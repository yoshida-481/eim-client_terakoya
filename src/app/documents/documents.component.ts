import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";

import { ConfirmationService } from "primeng/api";
import { ToastModule } from "primeng/toast";

import { FileItem, FileUploader } from "ng2-file-upload";

import {
	EIMDocumentsUserService,
	EIMSessionInformation,
	EIMUser,
} from "app/documents/shared/services/apis/documents-user.service";
import { EIMHeaderComponent } from "app/shared/components/header/header.component";
import {
	EIMMessageService,
	EIMMessageType,
} from "app/shared/services/message.service";

import { EIMDocumentsCacheService } from "app/documents/shared/services/documents-cache.service";
import { EIMDocumentsConstantService } from "app/documents/shared/services/documents-constant.service";
import { EIMServerConfigService } from "app/shared/services/server-config.service";

import { EIMDocumentAuthenticationService } from "app/documents/shared/services/apis/authentication.service";

import { EIMUserDomain } from "app/shared/domains/entity/user.domain";

import { EIMDropFileService } from "app/shared/services/drop-file.service";

import { EIMDocumentMainComponent } from "app/documents/components/document-main/document-main.component";
import { EIMContextMenuService } from "app/documents/shared/services/apis/context-menu.service";
import { EIMConstantService } from "app/shared/services/constant.service";
import { EIMDocumentSessionStorageService } from "app/documents/shared/services/apis/document-session-storage.service";
import { EIMDocumentsModule } from "./documents.module";
import { EIMSharedModule } from "app/shared/shared.module";
import { EIMDialogSharedManagerComponent } from "app/shared/components/dialog-shared-manager/dialog-shared-manager.component";
import { EIMMessageComponent } from "app/shared/components/message/message.component";
import { EIMDialogSharedManagerComponentService } from "app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service";

/**
 * ドキュメントコンポーネント
 * @example
 *
 *      <eim-documents
 *
 *      >
 *      </eim-documents>
 */
@Component({
    selector: "eim-documents",
    templateUrl: "./documents.component.html",
    styleUrls: ["./documents.component.css"],
	imports:[
		EIMDocumentsModule, 
		EIMSharedModule, 
		EIMDialogSharedManagerComponent,
		EIMMessageComponent
	],
    providers: [ToastModule, ConfirmationService],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
    standalone: true
})
export class EIMDocumentsComponent implements OnInit {
	@ViewChild("documentMain", { static: true })
	documentMain: EIMDocumentMainComponent;

	@ViewChild("header", { static: true }) header: EIMHeaderComponent;

	/** ログインユーザ */
	public user: EIMUser = {};

	/** バージョン */
	public version: string;

	/** フォントサイズ */
	public fontSize = "middle";

	/** フォントサイズクラス */
	fontSizeClass = "eim-font-size-m";

	/** URLジャンプ対象オブジェクトID */
	public jumpTargetId: number;

	/** フォルダフラグ */
	public isFolder: boolean;

	/** リンク親オブジェクトID */
	public linkParentObjId: string;

	/** ダウンロードPrivateドキュメントオブジェクトID */
	public downloadPrivateFileObjId: number;

	/** ダウンロードPublicドキュメントオブジェクトID */
	public downloadPublicFileObjId: number;

	/** ファイルアップローダ */
	public uploader: FileUploader = new FileUploader({
		url:"",
		queueLimit: 500, // 最大500件に設定
	});

	/** ファイルリスト */
	public addFileList: File[] = [];

	constructor(
		protected activatedRoute: ActivatedRoute,
		protected translateService: TranslateService,
		protected route: ActivatedRoute,
		protected confirmationService: ConfirmationService,
		protected dropFileService: EIMDropFileService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected messageService: EIMMessageService,
		protected serverConfigService: EIMServerConfigService,
		protected userService: EIMDocumentsUserService,
		protected contextMenuService: EIMContextMenuService,
		public documentAuthenticationService: EIMDocumentAuthenticationService,
		protected title: Title,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,
		protected dialogManagerSharedComponentService: EIMDialogSharedManagerComponentService
	) {}

	/** 表示中のダイアログ数をカウント */
	public setShowDialogId(dialogId: any) {
		if (dialogId) {
			this.header.showingDialogId++;
		} else {
			this.header.showingDialogId--;
		}
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		/**
		 * ファイル追加イベントハンドラ
		 */
		this.uploader.onAfterAddingAll = (fileItems: FileItem[]) => {
			let isEmpty = false;
			this.addFileList = [];
			console.log(fileItems.length);
			for (let i = 0; i < fileItems.length; i++) {
				let fileItem: FileItem = fileItems[i];

				console.log(fileItem);
				if (fileItem.file.size > 0) {
					// キューのファイルアイテムをリストに追加する
					this.addFileList.push(fileItem._file);
				} else {
					isEmpty = true;
				}
			}
			// キューをクリアする
			this.uploader.clearQueue();

			if (isEmpty && this.addFileList.length == 0) {
				this.messageService.show(
					EIMMessageType.error,
					this.translateService.instant("EIM_DOCUMENTS.ERROR_00011")
				);
				return;
			} else if (isEmpty && this.addFileList.length > 0) {
				this.messageService.showGrowl(
					this.translateService.instant("EIM_DOCUMENTS.INFO_00018")
				);
			}

			// ドロップファイル実行
			this.dropFileService.doDropFile(this.addFileList);
		};

		// 処理待ちポップアップ表示
		this.userService.getSessionUser().subscribe((data) => {
			this.user = data.loginUser;
			const isChangePasswordFlg = JSON.parse(data.configKeyValue['isChangePasswordFlg']);
			if(isChangePasswordFlg){
				// パスワードの変更が必要な場合はパスワード更新が完了した後に処理待ちポップアップを表示
				this.documentAuthenticationService.getNotesMessage().subscribe((value:string) => {
					let count = this.countCharacterUsingRegex(value, EIMConstantService.LOOP_BACK_CHARACHER_LF);
					let height;
					if(count == 0){
						height = String(EIMConstantService.CHANGE_PASSWORD_DISP_MIN_HEIGHT);
					}else{
						height = String(EIMConstantService.CHANGE_PASSWORD_DISP_MIN_HEIGHT + (20 * count));
					}
					let dialogId: string = this.dialogManagerSharedComponentService.showPasswordChange(this.documentAuthenticationService, true,height,
						{
							updated: (update) => {
								this.dialogManagerSharedComponentService.close(dialogId);
								this.settingWaitingDisplay(data);
							}
						}
					)
				})
			}else{
				this.settingWaitingDisplay(data);
			}
		});

		this.activatedRoute.queryParams.subscribe((params: any) => {
			this.jumpTargetId = params.objId;
			this.isFolder = params.isFolder;
			this.linkParentObjId = params.linkParentObjId;
			this.downloadPrivateFileObjId = params.privateFileDownloadObjId;
			this.downloadPublicFileObjId = params.publicFileDownloadObjId;
		});

		this.title.setTitle(EIMDocumentsConstantService.WINDOW_TITLE);
	}

	/**
	 * ファイルドロップハンドラ
	 * @param event イベント
	 */
	public onDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
	}

	/**
	 * ファイルドロップハンドラ
	 * @param event イベント
	 */
	public async onDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer?.items) {
			const addFileList = [];
			const fileProcessList: Promise<void>[] = [];

			// ファイル処理の完了を待つPromise
			const processPromise = this.handleFileDrop(
				event,
				addFileList,
				fileProcessList
			);

			await processPromise;
		}
	}

	/**
	 * ドロップされたファイル処理を行う
	 * @param event イベント
	 * @param addFileList 見つかったファイル・フォルダの情報
	 * @param fileProcessList 見つかったファイルの処理Process
	 */
	private async handleFileDrop(
		event: DragEvent,
		addFileList: any[],
		fileProcessList: Promise<void>[]
	) {
		const items = event.dataTransfer.items;

		// ドロップされたアイテムを処理
		const rootPromises = Array.from(items).map((item) => {
			const entry = item.webkitGetAsEntry();
			if (entry) {
				return this.addFileInfo(addFileList, fileProcessList, entry);
			}
			return Promise.resolve();
		});

		// すべてのアイテム処理が完了するまで待機
		await Promise.all(rootPromises);
		await Promise.all(fileProcessList);

		// ファイルドロップの後処理
		this.dropFileService.doDropFile(addFileList);
	}

	/**
	 * ファイル情報の取得
	 * @param fileList 見つかったファイル・フォルダの情報
	 * @param fileProcessList 見つかったファイルの処理Process
	 * @param item 検索中のインスタンス
	 * @param path 検索中のパス
	 */
	private async addFileInfo(
		fileList: any[],
		fileProcessList: Promise<void>[],
		item: any,
		path: string = ""
	) {
		if (item.isFile) {
			// ファイルの場合はファイル処理を追加
			const process = this.getFile(item).then((file) => {
				fileList.push({ isFile: true, fullPath: item.fullPath, file });
			});
			fileProcessList.push(process);
		} else if (item.isDirectory) {
			// ディレクトリの場合、情報を追加
			fileList.push({ isFile: false, fullPath: item.fullPath });
			const dirReader = item.createReader();

			// サブディレクトリのエントリを読み込むPromise
			const entries = await this.readDirectoryEntries(dirReader);

			// サブディレクトリの処理を非同期で行う
			const subDirPromises: Promise<void>[] = entries.map((entry) =>
				this.addFileInfo(
					fileList,
					fileProcessList,
					entry,
					path + item.name + "/"
				)
			);

			// サブディレクトリの処理完了を待機
			await Promise.all(subDirPromises);
		}
	}

	/**
	 * ディレクトリ内のエントリを読み込む
	 * @param dirReader ディレクトリリーダー
	 * @returns エントリのリスト
	 */
	private async readDirectoryEntries(dirReader: any): Promise<any[]> {
		const allEntries: any[] = [];

		// 非同期でディレクトリのエントリを再帰的に読み込む
		await new Promise<void>((resolve) => {
			const readNext = () => {
				dirReader.readEntries((results) => {
					if (!results.length) {
						resolve();
					} else {
						allEntries.push(...results);
						readNext();
					}
				});
			};
			readNext();
		});

		return allEntries;
	}
	/**
	 * ファイルインスタンスの取得
	 * @param item ファイル情報
	 */
	private getFile(item: any): Promise<File> {
		return new Promise((resolve, reject) => {
			item.file(
				(file: File) => {
					resolve(file);
				},
				(error: any) => reject(error)
			);
		});
	}

	/**
	 * フォントサイズ変更ハンドラ
	 * @param event イベント
	 */
	onChangeFontSize(event) {
		// グリッドの高さをリセットする（検索アコーディオンは高さを可変にしているため、フォントサイズにより高さが変わる）
		if (this.documentMain.contentsList.info.gridApi) {
			this.documentMain.contentsList.info.gridApi.resetRowHeights();
		}

		let fontSize: string = event;
		if (fontSize == "large") {
			this.fontSizeClass = "eim-font-size-l";
		}
		if (fontSize == "middle") {
			this.fontSizeClass = "eim-font-size-m";
		}
		if (fontSize == "small") {
			this.fontSizeClass = "eim-font-size-s";
		}
	}

	/**
	 * 処理待ちポップアップ表示の処理を行います.
	 * @param data ユーザセッション情報
	 */
	private settingWaitingDisplay(data:EIMSessionInformation): void {
		if (
			Number(this.user.approveDocument) > 0 &&
			this.user.isPopupExists == true
		) {
			this.messageService.show(
				EIMMessageType.confirm,
				this.translateService.instant("EIM_DOCUMENTS.CONFIRM_00013", {
					value: Number(this.user.approveDocument),
				}),
				() => {
					this.documentMain.info.functionType =
						EIMConstantService.EVENT_FUNCTION_TYPE_WAIT;
					this.documentMain.contentsMainComponentService.showApprove(
						this.documentMain.info,
						null,
						[]
					);
				}
			);
		}

		// サーバの設定ファイルの値を格納
		this.serverConfigService.setConfigValue(data.configKeyValue);

		// キャッシュに保存
		let loginUser: EIMUserDomain = new EIMUserDomain();
		loginUser.id = this.user.userId;
		loginUser.name = this.user.userName;
		loginUser.code = this.user.userCode;
		loginUser.kana = this.user.userKana;
		loginUser.mail = this.user.userMail;
		loginUser.admin = this.user.userAdmin;
		this.documentsCacheService.setLoginUser(loginUser);
		this.documentMain.getLoginUserInfo();
		this.documentsCacheService.setJSessionId(
			data.configKeyValue["jSessionId"]
		);
		// バージョン
		this.version = this.serverConfigService.eimanagerDocumentVersion;

		// コンテキストメニュー設定
		this.contextMenuService
			.getContextItemListAndMainMenuItemList()
			.subscribe((data) => {
				this.documentMain.setContextMenu(data[0]);
				// ドキュメント一覧のオプションメニュー表示／非表示切り替え
				this.documentMain.showOptionMenuItems(data[1]);
			});

		// テーブルメニューを作成する
		this.documentMain.contentsTableService.initialize();

		// 属性ツリービュー表示設定反映
		this.documentMain.dspAttributeTreeView =
			this.serverConfigService.attributeTreeView;

		//初回ログイン時の画面初期表示モード設定反映
		if (
			!this.documentSessionStorageService.getSearchDisplayType() &&
			this.documentSessionStorageService.getSearchDisplayType() !== 0
		) {
			this.documentMain.selectedDisplayTypeId =
				this.serverConfigService.searchDispMode;
			this.documentSessionStorageService.setSearchDisplayType(
				this.documentMain.selectedDisplayTypeId)
				this.documentMain.preSelectedDisplayTypeId = this.documentMain.selectedDisplayTypeId;
		} else {
			this.documentMain.selectedDisplayTypeId =
				this.documentSessionStorageService.getSearchDisplayType();
			this.documentMain.preSelectedDisplayTypeId = this.documentMain.selectedDisplayTypeId;
		}
	}

	/**
	 * 特定の文字の数をカウントした結果を返却します。 
	 * @param str 確認する文字列
	 * @param char 集計対象文字 
	 * @returns 
	 */
	private countCharacterUsingRegex(str: string, char: string): number {
		const regex = new RegExp(char, 'g');
		const matches = str.match(regex);
	 	return matches ? matches.length : 0;
	}
}
