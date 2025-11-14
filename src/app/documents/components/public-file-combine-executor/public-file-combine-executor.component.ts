import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { SelectModule } from 'primeng/select';
import { SelectItem } from 'primeng/api';
import { FileItem } from 'ng2-file-upload';

import { EIMDocumentMainComponentService} from 'app/documents/components/document-main/document-main.component.service';
import { EIMComponent, EIMExecutable, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMContentsSearchComponentService } from 'app/documents/components/contents-search/contents-search.component.service';

/**
 * 公開ファイル結合コンポーネント
 * @example
 *
 *      <eim-public-file-combine-executor
 *          [workspaceObjId]="workspaceObjId"
 *          [contents]="contents"
 *          [parentObjId]="parentObjId"
 *          [path]="path">
 *      </eim-public-file-combine-executor>
 */
@Component({
    selector: 'eim-public-file-combine-executor',
    templateUrl: './public-file-combine-executor.component.html',
    styleUrls: ['./public-file-combine-executor.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMPublicFileCombineExecutorComponent) },
        SelectModule],
    standalone: false
})
export class EIMPublicFileCombineExecutorComponent implements OnInit, EIMExecutable {

	/** フォーム */
	@ViewChild('fileCombineForm', { static: true }) fileCombineForm: NgForm;

	/** ドキュメントリスト */
	@ViewChild('documentList', { static: true })
		documentList: EIMDataGridComponent;

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram', { static: true })
		workflowDiagram: EIMDiagramComponent;

	/** ワークスペースオブジェクトID */
	@Input()
		workspaceObjId: number;

	/** コンテントリスト */
	@Input()
		contents: any[];

	/** 親オブジェクトID */
	@Input()
		parentObjId: number;

	/** パス */
	@Input() path = '';

	/** 登録完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 画面を閉じるのイベントエミッタ */
	@Output() closed: EventEmitter<null> = new EventEmitter<null>();

	/** タイプ一覧表示データ */
	public typeSelectItems: SelectItem[] = [];

	/** 選択したタイプID */
	public selectedTypeId: number;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** PDF拡張子 */
	public PDF_EX = EIMDocumentsConstantService.PDF_EXTENSION;

	/** 名前 */
	public name: string = null;

	/** 作成中かどうか */
	public creating = false;

	/** メニュー定義 */
	// 選択
	private menuSelect: EIMMenuItem =
			{label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: false, command: (event) => {this.onClickSelectDocument(event); }};
	// 削除
	private menuDelete: EIMMenuItem =
			{label: this.translateService.instant('EIM.LABEL_03003'), name: 'delete', icon: 'eim-icon-trash', disabled: true, command: (event) => {this.onClickDelete(event); }};
	/** ドキュメント一覧のメニュー */
	public documentMenuItems: EIMMenuItem[] = [this.menuSelect, this.menuDelete];

	/** ドキュメント一覧のコンテキストメニュー */
	public contextMenuItems: EIMMenuItem[] = [this.menuDelete];

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected objectTypeService: EIMObjectTypeService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected documentMainComponentService: EIMDocumentMainComponentService,
		protected contentsService: EIMContentsService,
		protected documentCacheService: EIMDocumentsCacheService,
	) { }

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 公開ファイルを結合します.
	 */
	public execute(): void {

		// 	入力値のチェック
		if (this.isIllegalName()) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00009'));
			return;
		}
		this.creating = true;

		// ドキュメントIDをカンマ区切り文字列に
		let docIds = '';
		let conbineData = this.documentList.getData();
		let completeData = [];
		for (let i = 0; i < conbineData.length; i++) {
			completeData.push(conbineData[i].objId);
		}
		docIds = completeData.join(',');
		/** 情報表示 */
		let objTypeId = String(this.selectedTypeId);
		let fileName = this.name;
		let folderObjId = String(this.parentObjId);
		let joinedDocIds = docIds;
		this.contentsService.combine(objTypeId, fileName, folderObjId, joinedDocIds)
		  .subscribe(
		  		(res: any) => {
						// 検索キャッシュクリア
						this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
						// 完了イベントを通知(画面が閉じる)
						this.executed.emit(completeData);
				  },
				  (err: any) => {
				  	// エラー発生時
				  	this.creating = false;
					});
	}

	/**
	 * 実行可否を返却します.
	 * @return 実行可否
	 */
	public executable(): boolean {
		if (this.creating || !this.fileCombineForm.valid ) {
			return false;
		}
		if (!this.documentList.getData()[0]) {
			return false;
		}
		return true;
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		event.preventDefault();
		if (this.fileCombineForm.dirty) {
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
	 * コンテンツリスト右クリックイベントハンドラ.
	 * @param event イベント
	 */
	public onContextMenuContentsList(event: MouseEvent): void {
		window.setTimeout(() => {
			let selectedFiles = this.documentList.getSelectedData();
			if ((selectedFiles.length > 0)) {
				this.menuDelete.disabled = false;
			} else {
				this.menuDelete.disabled = true;
			}
		});
	}

	/**
	 * メイン画面右クリック時のハンドラ.
	 * @param objectList リスト
	 */
	public addDocuments(objectList: any[]): void {
		let existFlag = false;
		for (let i = 0 ; i < objectList.length ; i++ ) {
			for (let j = 0 ; j < this.documentList.getData().length ; j++ ) {
				if (this.documentList.getData()[j].objId === objectList[i].objId) {
					this.messageService.show(EIMMessageType.error,
						this.translateService.instant('EIM_DOCUMENTS.ERROR_00028', {value: objectList[i].objName}));
					return;
				}
			}
			// 有効期限切れドキュメントが存在するかチェック
			if (objectList[i].expiration === this.FLAG_TRUE) {
				existFlag = true;
			}
			// 有効期限切れドキュメントが存在する場合は確認メッセージを表示します.
			if (existFlag) {
				objectList[i].expirationCheck = true;
				this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00022'), () => {
					this.documentList.setData(this.documentList.getData().concat(objectList));
				});
			} else {
				this.documentList.setData(this.documentList.getData().concat(objectList));
			}
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		// ドキュメントタイプ一覧取得
		this.objectTypeService.getHierarchical(this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT)
			.subscribe(
				(hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
					this.setTypeSelectItems(hierarchicalContentsType);
				},
				(err: any) => {
					window.setTimeout(() => {
						this.errored.emit();
					})
				});
			window.setTimeout(() => {
			let columns: EIMDataGridColumn[] = [];
			// 名前
			columns.push({field: 'objName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 280, suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMObjectNameRendererComponent});
			// 場所
			columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), width: 350, suppressFilter: true, suppressSorting: true});
			// 初期値セット
			this.documentList.setColumns(columns);
			let targets: any[] = [];
			for (let i = 0 ; this.contents.length > i ; i++ ) {
				targets.push(this.contents[i]);
			}
			this.documentList.setData(targets);
		});
	}

	/**
	 * タイプ変更イベントハンドラ
	 * @param event イベント
	 */
	onChangeType(event) {
		this.changeType();
	}

	/**
	 * タイプ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickShowObjectTypeSelector(event: any): void {
		// ドキュメントタイプツリーを表示する
		let dialogId: string = this.dialogManagerComponentService.showObjectTypeTreeSelector(null,
				this.workspaceObjId, EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
				{
					selected: (documentType: any) => {
						this.dialogManagerComponentService.close(dialogId);
						this.selectedTypeId = documentType.id;
						this.changeType();
					}
				});
	}

	/**
	 * 選択メニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickSelectDocument(event: any): void {
		let targetObj = {
				document: true,
				folder: false,
				tag: false,
		}

		let dialogId: string = this.dialogManagerComponentService.showContentsMultipleSelector(null, null, targetObj, true, this.documentList.getData(),
			{
				selected: (data: any[]) => {
					let checkPublics: any[] = this.checkPublic(data);
					let checkPdfs: any[] = this.checkPdf(data);
					let checkExpirations: boolean = this.checkExpiration(data);
					// 公開済では無い場合はエラーメッセージを表示します.
					if (checkPublics.length > 0) {
						this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00018', {value: checkPublics[0]}));
					// PDFでは無い場合はエラーメッセージを表示します.
					} else if (checkPdfs.length > 0) {
						this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00032', {value: checkPdfs[0]}));
					// 有効期限切れドキュメントが存在する場合は確認メッセージを表示します.
					} else if (checkExpirations) {
						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00022'), () => {
							this.dialogManagerComponentService.close(dialogId);
							this.documentList.setData(data);
						});
					} else {
						this.dialogManagerComponentService.close(dialogId);
						this.documentList.setData(data);
					}
				}
			});
	}

	/**
	 * 削除メニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickDelete(event: any): void {
		let selectedData: any = this.documentList.getSelectedData();
		let rowIndex: number = this.documentList.getFirstRowIndex();
		let scrollTop: number = this.documentList.getScrollTop();
		this.documentList.removeRowData(selectedData);
		this.documentList.setSelectRow(rowIndex, scrollTop);
		let selectedFiles = this.documentList.getSelectedData();
		this.changeEnableMenuItem(selectedFiles);
	}

	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickUp(event: any): void {

		let move = this.documentList.getSelectedData();
		this.documentList.moveUpSelectedData();
		// 移動行を選択
		this.documentList.select(move , false);
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event: any): void {
		let move = this.documentList.getSelectedData();
		this.documentList.moveDownSelectedData();
		// 移動行を選択
		this.documentList.select(move , false)
	}

	/**
	 * ドキュメントクリックイベントハンドラです.
	 * @param event イベント
	 */
	onSelectFile (event: any): void {
		let selectedData: any = this.documentList.getSelectedData();
		this.changeEnableMenuItem(selectedData);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 名前に禁則文字が含まれているかどうかを返却します.
	 * @return 禁則文字が含まれている場合trueを返却
	 */
	private isIllegalName(): boolean {
		let match = this.name.match(EIMConstantService.FORBIDDEN_PATTERN);
		return match != null;
	}

	/**
	 * ドキュメントタイプ変更処理です.
	 * ワークフローを更新します.
	 */
	private changeType(): void {
		// ワークフロー表示初期化
		let objTypeId: number = this.selectedTypeId;
		this.workflowDiagram.clear();
		this.workflowDiagram.show({objTypeId: objTypeId, workspaceId: this.parentObjId});
	}

	/**
	 * タイプコンボボックス用のデータを生成します.
	 * @param objectTypes オブジェクトタイプ情報
	 */
	private setTypeSelectItems(objectTypes: EIMHierarchicalObjectTypeDomain[]): void {

		for (let i = 0; i < objectTypes.length; i++) {
			let objectType: EIMHierarchicalObjectTypeDomain = objectTypes[i];

			if (objectType.children && objectType.children.length === 0) {
				// 末端
				this.typeSelectItems.push({label: objectType.name, value: objectType.id});
			} else {
				this.setTypeSelectItems(objectType.children);
			}
		}
	}

	/**
	 * 選択状況に応じて削除メニューの有効/無効を切り替えます.
	 * @param selectFileItems 選択されたファイルアイテム配列
	 */
	private changeEnableMenuItem(selectedFiles: any[]): void {
		// 削除ボタンの押下可否を切り替える
		if (selectedFiles.length > 0) {
			this.menuDelete.disabled = false;
		} else {
			this.menuDelete.disabled = true;
		}
	}

	/**
	 * 公開済(ワークフロー付きの場合は可)どうかを判定します.
	 * @param data 選択されたドキュメント配列
	 * @return 対象オブジェクト配列
	 */
	private checkPublic(data: any[]): any {
		let publicCheckList: any[] = [];
		for (let i = 0 ; i < data.length ; i++ ) {
			if (Number(data[i].statusTypeKind) !== EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				publicCheckList.push(data[i].objName);
			}
		}
		return publicCheckList;
	}

	/**
	 * PDFファイルかどうかを判定します.
	 * @param data 選択されたドキュメント配列
	 * @return 対象オブジェクト配列
	 */
	private checkPdf(data: any[]): any {
		let pdfCheckList: any[] = [];
		for (let i = 0 ; i < data.length ; i++ ) {
			if (data[i].isDspPdfIcon === this.FLAG_FALSE) {
				pdfCheckList.push(data[i].objName);
			}
		}
		return pdfCheckList;
	}

	/**
	 * 有効期限内かどうかを判定します.
	 * @param data 選択されたドキュメント配列
	 * @return 判定結果
	 */
	private checkExpiration(data: any[]): boolean {
		let existFlag = false;
		for (let i = 0 ; i < data.length ; i++ ) {
			if (!data[i].expirationCheck && data[i].expiration === this.FLAG_TRUE) {
				existFlag = true;
				data[i].expirationCheck = true;
			}
		}
		return existFlag;
	}

}
