import { Component, Input, OnDestroy, OnInit, Output, ViewChild, EventEmitter, } from '@angular/core';
import { empty, from, Subscription, zip } from 'rxjs';
import { catchError, concatMap, tap, toArray } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMReloadService } from 'app/shared/services/reload.service';

import { EIMBoxNameRendererComponentService } from 'app/documents/shared/components/renderer/box-name-renderer.component.service';
import { EIMBoxFolderDomain } from 'app/shared/domains/box-folder.domain';
import { EIMBoxObjectDomain } from 'app/shared/domains/box-object.domain';
import { EIMBoxUserDomain } from 'app/shared/domains/box-user.domain';
import { EIMBoxFileService } from 'app/shared/services/apis/box-file.service';
import { EIMBoxFolderService } from 'app/shared/services/apis/box-folder.service';
import { EIMBoxAuthorizationService } from 'app/shared/services/apis/box-authorization.service';
import { EIMBoxFileDragComponentService, EIMBoxFileDragInfo } from 'app/documents/components/box-file-drag/box-file-drag.component.service';

import { EIMBoxContentsListComponentService } from './box-contents-list.component.service';
import { EIMBoxFileDomain } from 'app/shared/domains/box-file.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';
import { EIMDocumentMainComponentInfo, EIMDocumentMainComponentService,} from "../document-main/document-main.component.service";
import { EIMDocumentMainComponent } from "../document-main/document-main.component";

import { accordionIndex } from "../document-main/document-main.component";
import { EIMDocumentsConstantService } from "app/documents/shared/services/documents-constant.service";
import { EIMServerConfigService } from "app/shared/services/server-config.service";

/**
 * Boxコンテンツリストコンポーネント
 * @example
 *      <eim-box-contents-list
 *          [loginUser]="loginUser"
 *          [selectedData]="selectedData">
 *      </eim-box-contents-list>
 */
@Component({
    selector: 'eim-box-contents-list',
    templateUrl: './box-contents-list.component.html',
    styleUrls: ['./box-contents-list.component.css'],
    standalone: false
})
export class EIMBoxContentsListComponent implements OnInit, OnDestroy {
	/** コンテンツリスト */
	@ViewChild('contentsList', { static: true })
	contentsList: EIMDataGridComponent;

	/** ログインユーザ */
	@Input('loginUser')
	loginUser: EIMBoxUserDomain;

	/** 選択コンテンツリスト（初期表示用） */
	@Input('selectedData')
	selectedData: any[];

	/** Box非表示を親コンポーネントへ通知 */
	@Output() closeBox = new EventEmitter<void>();

	/** パンくずリスト */
	breadcrumbItems: MenuItem[] = [];

	/** ファイルをドラッグ中の場合true */
	eimFileDragging = false;
	
	/** ファイルのdragenterイベントターゲット */
	fileDragEnterTarget: EventTarget;

	/** Boxへのコピーの有効/無効 */
	enableBoxPaste = false;

	/** EIMへのコピーの有効/無効 */
	enableEIMPaste = false;

	/** Boxファイル削除ボタンの有効/無効 */
	enableBoxFileDelete = false;

	/** パスリスト */
	protected pathList: EIMBoxObjectDomain[];

	/** 名前クリックサブスクリプション */
	private nameClicked: Subscription;
	/** 更新サブスクリプション */
	private reload: Subscription;
	/** ドラッグ開始サブスクリプション */
	private dragStarted: Subscription;
	/** ドラッグ終了サブスクリプション */
	private dragEnded: Subscription;
	/** コンテンツ選択サブスクリプション */
	private contentsSelected: Subscription;

	/** フォーマット選択ダイアログデータ取得サブスクリプション */
	private formatDialogData: Subscription;

	/** Boxデータグリッドリセットサブスクリプション */
	private dataGridRefresh: Subscription;

	/** EIMANAGER公開ボタンの活性/非活性サブスクリプション */
	private setPublicFlag: Subscription;

	/** フォーマットダイアログの表示有無 */
	private boxDialogFlg: boolean;

	/** フォーマットの初期値設定(公開を選択可) */
	private boxDefaultSettingPublic: boolean;

	/** 公開ドキュメント */
	private publicDocumentID: string =
		this.serverConfigService.publicDocumentFormat;

	/** 選択中のコンテンツリスト(EIM連携用に使用する) */
	selectedDataForEIM?: any[];

	/** ドキュメントメインコンポーネント情報 */
	public info: EIMDocumentMainComponentInfo;

	/** Boxからドキュメント登録するファイル */
	private boxPath: String = "";

	/** BoxからEIM上へドキュメント公開ボタン押下を親コンポーネントへ通知 */
	@Output() clickCopyToEIM = new EventEmitter();


	/**
	 * コンストラクタです.
	 */
	constructor(
		public componentService: EIMBoxContentsListComponentService,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected reloadService: EIMReloadService,
		protected fileService: EIMBoxFileService,
		protected folderService: EIMBoxFolderService,
		protected authorizationService: EIMBoxAuthorizationService,
		protected fileDragComponentService: EIMBoxFileDragComponentService,
		protected nameRenderComponentService: EIMBoxNameRendererComponentService,
		protected localStorageService: EIMLocalStorageService,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,

		/** config.propertiesの設定値取得 */
		protected serverConfigService: EIMServerConfigService
	) {
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		// データグリッドを初期化
		// セッションストレージに設定されている場合（Box領域を非表示→Box領域を表示した場合）は再取得しない
		const boxState = this.documentSessionStorageService.getBoxAreaState();
		if (boxState && boxState.selectedFolder) {
			this.componentService.getColumns().subscribe((columns) => {
				this.contentsList.setColumns(columns);
				this.setContents(boxState.selectedFolder, boxState.contents, boxState.selectedContents);
			});
		} else {
			this.componentService.getColumns().subscribe((columns) => {
				this.contentsList.setColumns(columns);

				this.folderService.getById('0').subscribe((parentFolder) => {
					this.folderService.getChildrenByParentId('0').subscribe((children) => {
						this.setContents(parentFolder, children);
					});
				});
			});
		}

		// 名前選択時、フォルダであれば表示中のフォルダを切り替える
		this.nameClicked = this.nameRenderComponentService.clicked$
			.subscribe((object) => {
				if (object.type === 'folder') {
					this.changeCurrentFolder(object);
					this.disableMenuButton();
				}
			});

		// 更新ボタンが押されたら一覧を再読み込みする
		this.reload = this.reloadService.reload
			.subscribe(() => {
				this.onClickReload();
			});

		// ドラッグ開始／終了時にBlockUIの表示を切り替える
		this.dragStarted = this.fileDragComponentService.dragStarted$.subscribe((_) => this.eimFileDragging = true);
		this.dragEnded = this.fileDragComponentService.dragEnded$
			.subscribe(_ => {
				this.eimFileDragging = false;
				this.fileDragEnterTarget = undefined;
			});

		// コンテンツが選択されたらBoxに貼り付けメニュー押下可否を制御する
		this.enableBoxPaste = false;
		if (this.selectedData && this.selectedData.length > 0) {
			let existsNotDocument = false;
			for (let i = 0; i < this.selectedData.length; i++) {
				if (this.selectedData[i].isDocument !== 'true' && this.selectedData[i].isDocument !== true) {
					existsNotDocument = true;
				}
			}
			if (!existsNotDocument) {
				this.enableBoxPaste = true;
			}
		}

		this.contentsSelected = this.componentService.contentsSelected$
			.subscribe((selectedContents: any[]) => {
				this.selectedData = selectedContents;

				this.enableBoxPaste = false;
				if (selectedContents.length > 0) {
					let existsNotDocument = false;
					for (let i = 0; i < selectedContents.length; i++) {
						if (selectedContents[i].isDocument !== 'true' && selectedContents[i].isDocument !== true) {
							existsNotDocument = true;
						}
					}
					if (!existsNotDocument) {
						this.enableBoxPaste = true;
					}
				}
			});

		/** ダイアログBox公開ボタン押下時のデータ取得 */
		this.formatDialogData = this.componentService
			.getBoxCreate()
			.subscribe((receiveData) => {
				if (receiveData) {
					this.createAfterCheck(receiveData);
				}
			});

		/** EIMANAGERにBoxファイル登録後のグリッド更新イベントハンドラ */
		this.dataGridRefresh = this.componentService
			.getBoxDataGridRefresh()
			.subscribe(() => {
				const boxState = this.documentSessionStorageService.getBoxAreaState();
				this.setContents(boxState.selectedFolder, boxState.contents, null);
			});

		/** EIMANAGERのデータグリッド選択後の公開ボタンイベントハンドラ */
		this.setPublicFlag = this.componentService
			.getDocumentPublicFlag()
			.subscribe(() => {
				this.enableEIMPaste = false;
			});

		/** EIMANAGERのデータグリッド選択後のBoxファイル削除ボタンイベントハンドラ */
		this.componentService
			.getDocumentDeleteFlag()
			.subscribe(() => {
				this.enableBoxFileDelete = false;
			});
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy() {
		if (this.nameClicked && !this.nameClicked.closed) { this.nameClicked.unsubscribe(); }
		if (this.reload && !this.reload.closed) { this.reload.unsubscribe(); }
		if (this.dragStarted && !this.dragStarted.closed) { this.dragStarted.unsubscribe(); }
		if (this.dragEnded && !this.dragEnded.closed) { this.dragEnded.unsubscribe(); }
		if (this.contentsSelected && !this.contentsSelected.closed) { this.contentsSelected.unsubscribe(); }
		if (this.formatDialogData && !this.formatDialogData.closed) { this.formatDialogData.unsubscribe(); }
		if (this.dataGridRefresh && !this.dataGridRefresh.closed) { this.dataGridRefresh.unsubscribe(); }
		if (this.setPublicFlag && !this.setPublicFlag.closed) { this.setPublicFlag.unsubscribe(); }
	}

	/**
	 * ファイルドロップ時のイベントハンドラです.
	 * @param event イベント
	 */
	onDropFile(event: DragEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (!this.pathList) { return; }

		const userAgent = window.navigator.userAgent;
		const isIE = userAgent.indexOf('Trident/') >= 0;

		// ドラッグしたEIMファイル情報を取得
		const jsonData = event.dataTransfer.getData(isIE ? 'text' : 'application/json');
		if (jsonData === '') { return; }
		const data: EIMBoxFileDragInfo[] = JSON.parse(jsonData);

		if (!data || !data.length) { return; }

		// ファイルを作成
		this.boxDialogFlg = this.serverConfigService.boxDialogFlg;
		if (this.formatCheck(data) && this.boxDialogFlg) {
			const boxData = this.contentsList.getData();
			this.componentService.showBoxFormat(data, boxData);
		} else if (this.eimFileDragging) {
			//EIMからBox領域にファイルをドロップされたとき
			this.create(data);

			this.eimFileDragging = false;
		}
	}

	/**
	 * ドラッグポインタがコンテンツリストに入っている時のイベントハンドラです.
	 * @param event イベント
	 */
	onDragOver(event: DragEvent) {
		if (event.preventDefault) {
			event.preventDefault();
		}

		event.dataTransfer.dropEffect = 'copy';
	}

	/**
	 * ドラッグポインタがコンテンツリストに入った時のイベントハンドラです.
	 * @param event イベント
	 */
	onDragEnter(event: DragEvent) {
		this.fileDragEnterTarget = event.target;
		event.stopPropagation();
		event.preventDefault();
	}

	/**
	 * ドラッグポインタがコンテンツリストから離れた時のイベントハンドラです.
	 * @param event イベント
	 */
	onDragLeave(event: DragEvent) {
		// ポインタがBlockUIの外に出るまでBlockUIの表示を継続する
		if (event.target === this.fileDragEnterTarget) {
			event.stopPropagation();
			event.preventDefault();
			this.fileDragEnterTarget = undefined;
		}
	}

	/**
	 * 更新ボタン押下時のイベントハンドラです.
	 */
	onClickReload(): void {
		const state = this.documentSessionStorageService.getBoxAreaState();
		this.changeCurrentFolder(this.getCurrentFolder(), true, state.selectedContents);
	}

	/**
	 * Box非表示ボタン押下時のイベントハンドラです.
	 */
	onClickClose(): void {
		this.closeBox.emit();
	}

	/**
	 * Boxに公開ボタン押下時のダイアログ分岐
	 */
	onClickBoxPaste(): void {
		this.boxDialogFlg = this.serverConfigService.boxDialogFlg;
		this.boxDefaultSettingPublic =
			this.serverConfigService.boxDefaultSettingPublic;
		if (this.formatCheck(this.selectedData) && this.boxDialogFlg) {
			const boxData = this.contentsList.getData();
			this.componentService.showBoxFormat(this.selectedData, boxData);
		} else {
			this.create(this.selectedData);
		}
	}

	/**
	 * EIMANAGERに公開ボタン押下時のイベントハンドラです.
	 */
	onClickCopyToEIM(): void {
		this.clickCopyToEIM.emit(this.selectedData);
		this.componentService.copyToEIMFlag = true;
	}

	/**
	 * BOXファイル削除ボタン押下時のイベントハンドラです.
	 */
	onClickBoxDelete(): void {
		let message = "";
		this.boxPath = "";
		if (this.selectedData.length === 1) {
			message = this.translateService.instant("EIM_DOCUMENTS.CONFIRM_00008", {
				value: this.selectedData[0].name,
			});
		} else {
			message = this.translateService.instant("EIM_DOCUMENTS.CONFIRM_00007");
		}

		// BOXパス生成
		for (let i = 0; i < +this.pathList.length; i++) {
			this.boxPath = this.boxPath + "/" + this.pathList[i].name;
		}
		this.messageService.show(EIMMessageType.confirm, message, () => {
			for (let i = 0; i < this.selectedData.length; i++) {
				this.fileService
					.deleteBoxFile(
						this.selectedData[i].id,
						this.selectedData[i].type,
						this.selectedData[i].name,
						this.boxPath
					)
					.subscribe(
						(data: any) => {
							// データグリッドからデータの削除
							this.contentsList.deleteRowBoxId(data.value);
							// 削除完了メッセージの表示
							// 複数削除を行った場合は、最後のファイルを削除したタイミングでメッセージの表示
							if (this.selectedData.length === 1) {
								this.messageService.showGrowl(
									this.translateService.instant("EIM_DOCUMENTS.INFO_00010")
								);
							}
							// データグリッドの更新
							const contents = this.contentsList.getData();
							this.documentSessionStorageService.updateBoxAreaState({
								contents: contents,
							});
							this.disableMenuButton();
						},
						(error) => {
							console.error("Error occurred", error);
						}
					);
			}
		});
	}

	/**
	 * Box起動リンク押下時のイベントハンドラです.
	 */
	onClickOpenBox(): void {
		// アンカータグを使用しているため、この記述がないと前画面に遷移してしまう
		event.preventDefault();
		window.open('https://account.box.com/login/sso', '_blank');
	}

	/**
	 * グリッド行選択イベントハンドラ.
	 * @param event イベント
	 */
	onSelect(event: any): void {
		this.documentSessionStorageService.updateBoxAreaState({
			selectedContents: this.contentsList.getSelectedData(),
		});
		this.selectedData = this.contentsList.getSelectedData();

		if (this.selectedData && this.selectedData.length > 0) {
			let existsNotDocument = false;
			for (let i = 0; i < this.selectedData.length; i++) {
				if (this.selectedData[i].type !== "file") {
					existsNotDocument = true;
					this.enableEIMPaste = false;
					break;
				}
			}
			if (!existsNotDocument) {
				this.enableEIMPaste = true;

				//操作履歴に渡すパス
				this.componentService.breadcrumbItems = this.breadcrumbItems;
			}
			this.enableBoxFileDelete = true;
		} else {
			// 非選択状態 
			this.disableMenuButton();
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 現在のフォルダを取得します.
	 * @return 現在のフォルダパス
	 */
	private getCurrentFolder(): EIMBoxObjectDomain {
		return this.pathList[this.pathList.length - 1];
	}

	/**
	 * 現在のフォルダを変更します.
	 * @param folderTo 変更先のフォルダ
	 * @param force trueの場合、変更先が現在のフォルダと同じであっても再読み込みする
	 * @param selectedContents 初期選択したいコンテンツがある場合は配列で指定する
	 */
	private changeCurrentFolder(folderTo: EIMBoxObjectDomain, force = false, selectedContents?: any[]) {
		const currentFolder = this.getCurrentFolder();
		if (!force && currentFolder.id === folderTo.id) { return; }

		this.folderService.getById(folderTo.id).subscribe((parentFolder) => {
			this.folderService.getChildrenByParentId(folderTo.id).subscribe((children) => {
				this.setContents(parentFolder, children, selectedContents);
			});
		});
	}

	/**
	 * データグリッドにBoxフォルダ情報を設定します.
	 * @param folder Boxフォルダ情報
	 * @param contents コンテンツリスト
	 * @param selectedContents 初期選択したいコンテンツがある場合は配列で指定する
	 */
	private setContents(folder: EIMBoxFolderDomain, contents: EIMBoxFolderDomain[] | EIMBoxFileDomain[], selectedContents?: any[]) {

		this.documentSessionStorageService.updateBoxAreaState({selectedFolder: folder, contents: contents});
		this.contentsList.setData(contents);

		window.setTimeout(() => {
			this.contentsList.select(selectedContents);
		});

		this.pathList = folder.pathList;
		this.breadcrumbItems = null;
		this.breadcrumbItems = this.pathList.map((path) => ({
			label: path.name,
			command: () => {this.changeCurrentFolder(path); this.disableMenuButton() },
		}));
	}

	/**
	 * Boxにファイルを作成します.
	 * @param data EIMドキュメントオブジェクトのid,objNameのリスト
	 */
	private create(data: any[]) {
		if (!data || !data.length) { return; }

		/**ドキュメントのフォーマットIdを取得 */
		const boxCopyFiles = data.map((obj) => ({
			id: obj.objId,
			name: 
				(obj.formatId === this.publicDocumentID ||
					obj.readOnly ||
					(!this.boxDialogFlg && this.boxDefaultSettingPublic)) &&
					!obj.publicFileName === null
					? obj.publicFileName
					: obj.objName,
			formatId: this.formatIDCheck(obj),
			boxFileId: null,
		}));
		const boxData = this.contentsList.getData();
		if (!boxData || boxData.length === 0) {
			this.createAfterCheck(boxCopyFiles);
			return;
		}

		// コピー対象のEIMストレージファイルに同名ファイルがないかチェック
		const fileNameSet = new Set();
		for (let i = 0; i < boxCopyFiles.length; i++) {
			if (fileNameSet.has(boxCopyFiles[i].name)) {
				// 同名ファイルはコピーできない
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00123'));
				return;
			}
			fileNameSet.add(boxCopyFiles[i].name);
		}
		// Box領域に同名ファイルがないかチェック
		const boxFileNameAndDataMap = new Map();
		for (let i = 0; i < boxData.length; i++) {
			boxFileNameAndDataMap.set(boxData[i].name, boxData[i]);
		}
		let existsSameName = false;
		for (let i = 0; i < boxCopyFiles.length; i++) {
			if (boxFileNameAndDataMap.get(boxCopyFiles[i].name)) {
				existsSameName = true;
				boxCopyFiles[i].boxFileId = boxFileNameAndDataMap.get(boxCopyFiles[i].name).id;
			}
		}
		if (!existsSameName) {
			this.createAfterCheck(boxCopyFiles);
			return;
		}

		// 同名ファイル上書き確認
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00038'),
			() => {
				this.createAfterCheck(boxCopyFiles);
			});
	}

	/**
	 * Boxにファイルを作成します.(create()にてチェック完了後に呼び出すメソッド)
	 * @param boxCopyFiles EIMドキュメントオブジェクトのid,objNameのリスト
	 */
	private createAfterCheck(boxCopyFiles: any[]): void {
		const parentId = this.getCurrentFolder().id;
		// 1ファイルずつファイルを作成する
		from(boxCopyFiles)
			.pipe(
				concatMap((boxCopyFile) => this.fileService.copyFromEIMFile(boxCopyFile.id, parentId, boxCopyFile.formatId, boxCopyFile.boxFileId)
					.pipe(
						tap((file) => {
							if (boxCopyFile.boxFileId === null) {
								// BoxにEIMファイルを追加。データグリッドに追加する。
								this.contentsList.addRowData([file]);
							} else {
								// BoxのファイルをEIMファイルで更新。データグリッドを更新する。
								const data = this.contentsList.getData();
								let target = data.filter((boxObject) => {
									return this.componentService.boxObjectEquals(boxObject, file);
								});
								if (target !== null && target.length === 1) {
									const boxFile = Object.assign(target[0], file);
									this.contentsList.updateRowData([boxFile]);
									this.contentsList.refreshView();
								}
							}
							const contents = this.contentsList.getData();
							this.documentSessionStorageService.updateBoxAreaState({contents: contents});
						}),
						catchError((error) => {
							console.error(error);
							return empty();
						}),
					)
				),
				toArray(),
			)
			.subscribe((files) => {
				if (files.length) {
					// ドキュメントを登録しました。
					this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00015'));

					// 作成したファイルを選択状態にし、スクロール位置を調整する
					this.contentsList.select(files, false);
					const selectIndex = this.contentsList.getFirstRowIndex();
					this.contentsList.ensureIndexVisible(selectIndex);
				}
			});
	}

	/** 
	 * ダイアログ表示の有無を判定
	 * @param selectDataList Box公開時の選択データ
	 * @return ダイアログ表示の判定結果
	 */
	private formatCheck(selectDataList: any): boolean {
		let flag: boolean = false;
		for (let i = 0; i < selectDataList.length; i++) {
			const statusTypeKind = selectDataList[i].statusTypeKind;
			const readOnly = selectDataList[i].readOnly;
			const publicFileName = selectDataList[i].publicFileName;
			if (readOnly === "false") {
				if (statusTypeKind.length > 0) {
					if (publicFileName != null) {
						flag = true;
					}
				}
			}
		}
		return flag;
	}

	/**
	 * ダイアログを使用しないBox公開時のformatIdを取得
	 * @param selectedData
	 * @return フォーマット
	 */
	private formatIDCheck(selectData: any): string {
		let formatId: string = "";
		const readOnly = selectData.readOnly;
		if (readOnly === "true") {
			formatId = this.publicDocumentID;
		} else if (!this.boxDialogFlg && this.boxDefaultSettingPublic) {
			formatId = this.publicDocumentID;
		} else {
			formatId = "";
		}
		return formatId;
	}

	/**
	 * EIMANAGERに公開ボタン・BOXファイル削除ボタンを非活性にする
	 */
	private disableMenuButton(): void {
		this.enableEIMPaste = false;
		this.enableBoxFileDelete = false;
	}
}
