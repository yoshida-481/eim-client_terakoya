import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit, Injectable, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMComponent, EIMMenuItem, EIMApplicable } from 'app/shared/shared.interface';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDialogManagerComponentService, dialogName } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDocumentMainComponentInfo } from 'app/documents/components/document-main/document-main.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMTagService } from 'app/documents/shared/services/apis/tag.service';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { Subscription } from 'rxjs';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMContentsSearchComponentService } from 'app/documents/components/contents-search/contents-search.component.service';

import { EIMDateService } from 'app/shared/services/date.service';


/**
 * タグ割当コンポーネント
 * @example
 *      <eim-tag-allocation-applicant
 *          [content]='content'
 *          [workspaceObjId]='workspaceObjId'
 *          [parentObjId]='parentObjId'
 *          [path]='path'>
 *      </eim-tag-allocation-applicant>
 */

@Component({
    selector: 'eim-tag-allocation-applicant',
    templateUrl: './tag-allocation-applicant.component.html',
    styleUrls: ['./tag-allocation-applicant.component.css'],
    providers: [{ provide: EIMComponent,
            useExisting: forwardRef(() => EIMTagAllocationApplicantComponent) },],
    standalone: false
})

export class EIMTagAllocationApplicantComponent implements OnInit, EIMApplicable, OnDestroy {

	/** フォーム */
	@ViewChild('assignTagForm')
		assignTagForm: NgForm;

	/** コンテンツリスト */
	@ViewChild('contentsList', { static: true })
	contentsList: EIMDataGridComponent;

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram')
		workflowDiagram: EIMDiagramComponent;

	/** 表示対象のオブジェクト */
	@Input() content: any;

	/** ワークスペースオブジェクトID */
	@Input()
		workspaceObjId: number;

	/** 親オブジェクトID */
	@Input()
		parentObjId: number;

	/** パス */
	@Input() path = '';

	/** 適用完了時のイベントエミッタ */
	@Output() applied: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** クローズ時のイベントエミッタ */
	@Output() closed: EventEmitter<null> = new EventEmitter<null>();

	/** 場所選択時のイベントエミッタ */
	@Output() contentsAccess: EventEmitter<null> = new EventEmitter<null>();

	/** 名称選択イベントエミッタ */
	@Output() onSelect: EventEmitter<any> = new EventEmitter<any>();

	/** 場所クリック時のサブスクリプション */
	private placeRendererComponentServicePlaceClicked?: Subscription;

	/** メニュー定義 */
	private menuSelect: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: false, command: (event) => {this.onClickSelectDocument(event); }};
	private menuDelete: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: (event) => {this.onClickDelete(event); }};
	private menuExport: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03039'), icon: 'fa fa-download', disabled: false, command: (event) => {this.onClickCsvDownload(event); }};

	/** タグ一覧のメニュー */
	public tagMenuItems: EIMMenuItem[] = [this.menuSelect, this.menuDelete, this.menuExport];

	/** タグ一覧のコンテキストメニュー */
	public tagContextMenuItems: EIMMenuItem[] = [this.menuDelete];

	/** コンテンツ一覧が編集されたかどうか */
	public edited = false;

	/** 割当権限有無フラグ */
	public assignableFlg = false;

	/** ダイアログ表示 */
	public disabled = true;

	/** 割当済オブジェクトIDリスト */
	private assignedObjIds: number[] = [];


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected historyRendererComponentService: EIMHistoryRendererComponentService,
		protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
		protected documentTagService: EIMTagService,
		protected placeRendererComponentService: EIMPlaceRendererComponentService,
		protected documentCacheService: EIMDocumentsCacheService,
		protected dateService: EIMDateService,
	) {}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * コンテンツ情報を適用します.
	 */
	public apply(): void {
		let contentsListData = this.contentsList.getData();
		let isAddedFolder: boolean[] = [];
		let assignObjIds: number[] = [];
		// グリッドのコンテンツ数分
		for (let i = 0; i < contentsListData.length; i++ ) {
			let addFolder = false;
			// フォルダの場合
			if (contentsListData[i].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
				// 不一致の場合
				if (this.assignedObjIds.indexOf(contentsListData[i].objId) === -1) {
					addFolder = true;
				}
			}
			isAddedFolder.push(addFolder);
			assignObjIds.push(contentsListData[i].objId);
		}
		this.documentTagService.applyTagAllocation(isAddedFolder, this.content.objId, assignObjIds).subscribe((res: any) => {
			// 検索キャッシュクリア
			this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
			// 完了イベントを通知(画面が閉じる)
			this.dialogManagerComponentService.close(dialogName.TAG_ALLOCATION_APPLICANT);
			this.applied.emit([this.content.objId]);
		});
	}

	/**
	 * コンテンツ情報適用可否を返却します.
	 * @return コンテンツ情報適用可否
	 */
	public applicable(): boolean {
		if (this.edited) {
			return true;
		} else {
			return false;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 名前
		columns.push({ field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 350, cellRendererFramework: EIMObjectNameRendererComponent, suppressFilter: true, param: {showLink: false}});
		// 履歴
		columns.push({ field: 'rev', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), width: 63, suppressFilter: true,
			cellRendererFramework: EIMHistoryRendererComponent, valueGetter: this.historyRendererComponentService.valueGetter });
		// 場所
		columns.push({ field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), width: 250, cellRendererFramework: EIMPlaceRendererComponent, suppressFilter: true });
		// 付与者
		columns.push({ field: 'addUser', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02118'), width: 120, suppressFilter: true });
		// 付与日時
		columns.push({ field: 'addDateTime', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02119'), width: 180, suppressFilter: true,
				cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
		});

		// 場所クリックイベントハンドラ
		if (!this.placeRendererComponentServicePlaceClicked) {
			this.placeRendererComponentServicePlaceClicked = this.placeRendererComponentService.placeClicked.subscribe((data: any) => {
				// コンテンツアクセスイベントをエミット
				this.contentsAccess.emit(data);
			});
		}
		this.contentsList.setColumns(columns);

		// タグ割当権限情報を取得
		this.documentTagService.getAssignedTagAdminInfo(this.content.objId, false).subscribe(
			(object: any) => {
				for (let i = 0 ; i < object.length ; i++ ) {
					object[i].isNoLink = true;
				}
				this.disabled = false;
				this.menuSelect.disabled = false;
				this.assignableFlg = true;
			}, (errored) => {
				this.disabled = true;
				this.menuSelect.disabled = true;
				this.assignableFlg = false;
			}
		);

		// タグ割当情報一覧を取得
		this.documentTagService.getObjectAssignedTagInfoList(this.content.objId).subscribe(
			(object: any) => {
				for (let i = 0 ; i < object.length ; i++ ) {
					object[i].isNoLink = true;
					this.assignedObjIds.push(object[i].objId);
				}
				this.contentsList.setData(object);
			}, (errored) => {
				// 検索キャッシュクリア
				this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
				this.dialogManagerComponentService.close(dialogName.TAG_ALLOCATION_APPLICANT);
				this.errored.emit();
			}
		);
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		event.preventDefault();
		if (this.applicable()) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						// 検索キャッシュクリア
						this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
						close.emit();
					}
			);

		} else {
			// 検索キャッシュクリア
			this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
			close.emit();
		}
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		this.closed.emit();
		// 場所クリックサブスクリプションがクローズされていなければクローズ
		if (!this.placeRendererComponentServicePlaceClicked.closed) {
			this.placeRendererComponentServicePlaceClicked.unsubscribe();
		}
	}


	/**
	 * 選択メニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickSelectDocument(event: any): void {
		let targetObj = {
			document: true,
			folder: true,
			tag: true,
		}
		let dialogId: string = this.dialogManagerComponentService.showContentsMultipleSelector(null, this.path, targetObj, true, this.contentsList.getData(), {
			selected: (data: any[]) => {
				let checkresult: boolean;
				checkresult = this.checkSelectdata(data);
				if (checkresult) {
					// 検索キャッシュクリア
					this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
					this.dialogManagerComponentService.close(dialogId);
					this.contentsList.setData(data);
				}
				this.edited = true;
			}
		});
	}

	/**
	 * 削除メニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickDelete(event: any): void {
		let selectedData: any = this.contentsList.getSelectedData();
		let deleteChildRowList = [];
		let deleteChildFlg = false;
		if (selectedData.length === this.contentsList.getData().length) {
			this.deleteContents(true);
		} else {
		// 選択した数分
			for (let i = 0 ; i < selectedData.length ; i++ ) {
				let rowData = selectedData[i];
				// 削除対象がフォルダの場合
				if (rowData.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
					let selectedFolder = rowData.path + rowData.objName;
					// グリッド内要素数分
					for (let j = 0 ; j < this.contentsList.getData().length ; j++ ) {
						let contents = this.contentsList.getData()[j];
						// 選択フォルダ配下のコンテンツがある場合
						if (contents.path.indexOf(selectedFolder) === 0) {
							deleteChildFlg = true;
							this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00023'),
							() => {
								this.deleteContents(true);
							}, () => {
								this.deleteContents(false);
							});
							break;
						}
					}
				}
			}
		}
		if (!deleteChildFlg) {
			this.deleteContents(false);
		}
	}

	/**
	 * エクスポートメニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickCsvDownload(event: any): void {
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00024'), () => {
			this.documentTagService.getExportList(this.content.objId, false);
		});
	}

	/**
	 * メイン画面右クリック時のハンドラ.
	 * @param objectList リスト
	 */
	addDocuments(objectList: any[]): void {
		// コンテンツ一覧グリッドをオブジェクト名称をキーにマップに格納する
		let	documentListMap: Map<any, any> = new Map();
		let datas = this.contentsList.getData();
		for (let i = 0 ; i < datas.length ; i++ ) {
			documentListMap.set(datas[i].objName, true);
		}
		// 追加可能チェック実施
		let checkResult = this.checkObject(objectList, documentListMap);
		if (checkResult === true) {
			this.contentsList.setData(datas.concat(objectList));
			this.edited = true;
		}
	}

	/**
	 * タグ割当項目右クリック時のハンドラ.
	 * @param event イベント
	 */
	onContextMenuContentsList(event: MouseEvent): void {
		window.setTimeout(() => {
			let selectedFiles = this.contentsList.getSelectedData();
			let menuItem: EIMMenuItem = this.tagContextMenuItems[0];
			if (this.assignableFlg === false) {
				menuItem.disabled = true;
			} else {
				if ((selectedFiles.length > 0)) {
					menuItem.disabled = false;
				} else {
					menuItem.disabled = true;
				}
			}
		});
	}

	/**
	 * ドキュメントクリックイベントハンドラです.
	 *@param event イベント
	 */
	onSelectFile (event: any): void {
		let selectedData: any = this.contentsList.getSelectedData();
		this.changeEnableMenuItem(selectedData);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 選択状況に応じて削除メニューの有効/無効を切り替えます.
	 * @param selectFileItems 選択されたファイルアイテム配列
	 */
	private changeEnableMenuItem(selectedFiles: any[]): void {
		// 削除ボタンの押下可否を切り替える
		if (this.assignableFlg === false) {
			this.menuDelete.disabled = true;
			} else {
			if (selectedFiles.length > 0) {
				this.menuDelete.disabled = false;
			} else {
				this.menuDelete.disabled = true;
			}
		}
	}

	/**
	 * 選択されたコンテンツを削除します．
	 * @param childDeleteFlg 子コンテンツ削除フラグ
	 */
	private deleteContents(childDeleteFlg: boolean): void {
		let selectedData: any = this.contentsList.getSelectedData();
		let deleteChildRowList = [];
		// 子コンテンツを削除する場合
		if (childDeleteFlg) {
			// 選択した数分
			for (let i = 0 ; i < selectedData.length ; i++ ) {
				let rowData = selectedData[i];
				// 削除対象がフォルダの場合
				if (rowData.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
					let selectedFolder = rowData.path + rowData.objName;
					// グリッド内要素数分
					for (let j = 0 ; j < this.contentsList.getData().length ; j++ ) {
						let contents = this.contentsList.getData()[j];
						// 選択フォルダ配下のコンテンツがある場合
						if (contents.path.indexOf(selectedFolder) === 0) {
							deleteChildRowList.push(contents);
						}
					}
				}
			}
		}
		// 削除対象を選択状態にする
		this.contentsList.select(selectedData.concat(deleteChildRowList));
		// 選択行を削除する
		this.contentsList.removeRowData(this.contentsList.getSelectedData());
		this.contentsList.setSelectRow(this.contentsList.getFirstRowIndex(), this.contentsList.getScrollTop());
		let selectedFiles = this.contentsList.getSelectedData();
		this.changeEnableMenuItem(selectedFiles);
		this.edited = true;
	}

	/**
	 * タグ割当可否チェック(メイン画面右クリック)
	 * @param objectList 選択したオブジェクトリスト
	 * @param documentListMap 割当済リストMAP
	 * @return タグ割当が可能かどうか
	 */
	private checkObject(objectList, documentListMap): boolean {
		for (let i = 0 ; i < objectList.length ; i++ ) {
			// 同一名称チェック
			if (documentListMap.get(objectList[i].objName)) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00014', {value: objectList[i].objName}));
				return false;
				// 同一タグチェック
			} else if (this.content.objId === objectList[i].objId) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00044', {value: objectList[i].objName}));
				return false;
			}
			// ステータスなし・公開済みかどうか
			if ((objectList[i].hasOwnProperty('statusTypeKind') && Number(objectList[i].statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC)
			|| (objectList[i].hasOwnProperty('statusTypeKind') && objectList[i].statusTypeKind === '')
			|| (objectList[i].hasOwnProperty('statusTypeName') && objectList[i].statusTypeName === '-')) {
			} else {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00048'));
				return false;
			}
		}
		return true;
	}

	/**
	 * タグ割当可否チェック(選択ボタン)
	 * @param data 選択データ
	 */
	private checkSelectdata(data) {
		let checkResult = true;
		for (let i = 0 ; i < data.length ; i++ ) {
			// 同一名称チェック
			for (let j = 0 ; j < i ; j++ ) {
				if (data[i].objName === data[j].objName) {
					this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00014', {value: data[i].objName}));
					checkResult = false;
				}
			}
			// 同一タグチェック
			if (this.content.objId === data[i].objId) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00043', {value: data[i].objName}));
				checkResult = false;
			}
			// ステータスなし・公開済みかどうか
			if ((data[i].hasOwnProperty('statusTypeKind') && Number(data[i].statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC)
			|| (data[i].hasOwnProperty('statusTypeKind') && data[i].statusTypeKind === '')
			|| (data[i].hasOwnProperty('statusTypeName') && data[i].statusTypeName === '-')) {
			} else {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00048'));
				checkResult = false;
			}
		}
		return checkResult;
	}
}
