import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, NgForm, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';

import { EIMComponent, EIMExecutable, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMPlaceRendererComponent} from 'app/documents/shared/components/renderer/place-renderer.component';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMContentsSearchComponentService } from 'app/documents/components/contents-search/contents-search.component.service';

/**
 * 公開ファイル比較コンポーネント
 * @example
 *
 *      <eim-public-file-compare-executor
 *          [contents]="contents">
 *      </eim-public-file-compare-executor>
 */
@Component({
    selector: 'eim-public-file-compare-executor',
    templateUrl: './public-file-compare-executor.component.html',
    styleUrls: ['./public-file-compare-executor.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMPublicFileCompareExecutorComponent) },
        SelectModule],
    standalone: false
})
export class EIMPublicFileCompareExecutorComponent implements OnInit, EIMExecutable {

	/** フォーム */
	@ViewChild('fileCompareForm', { static: true }) fileCompareForm: NgForm;

	/** 比較元ドキュメント */
	@ViewChild('sourceDocument', { static: true })
		sourceDocumentList: EIMDataGridComponent;

	/** 比較先ドキュメント */
	@ViewChild('destinationDocument', { static: true })
		destinationDocumentList: EIMDataGridComponent;

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram')
		workflowDiagram: EIMDiagramComponent;

	/** コンテントリスト */
	@Input()
		contents: any[];

	/** 実行完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 画面を閉じるのイベントエミッタ */
	@Output() closed: EventEmitter<null> = new EventEmitter<null>();

	/** フォームグループ */
	public form: UntypedFormGroup;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** PDF拡張子 */
	public PDF_EX = EIMDocumentsConstantService.PDF_EXTENSION;

	/** 比較結果ファイル名 */
	public name: string = null;

	/** メール通知チェックボックスの初期値 */
	public chkMailSendinglagValue = true;

	/** レイアウト解析チェックボックスの初期値 */
	public chkDoAnalyzeLayout = false;

	/** 入れ替えボタンの活性フラグ初期値 */
	public disabledFlag = true;

	/** 作成中かどうか */
	public creating = false;

	/** 比較元ドキュメント */
	public sourceDocument = [];

	/** 比較元ドキュメント */
	public destinationDocument = [];

	/** ドキュメント一覧のメニュー */
	public sourceDocumentMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: false, command: (event) => {this.onClickSelectSourceDocument(event); }},
	];

	/** ドキュメント一覧のメニュー */
	public destinationDocumentMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: false, command: (event) => {this.onClickSelectDestinationDocument(event); }},
	];

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** フラグON時文字列：1 */
	private readonly FLAG_ON = '1';

	/** フラグOFF時文字列：0 */
	private readonly FLAG_OFF = '0';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected objectTypeService: EIMObjectTypeService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected historyRendererComponentService: EIMHistoryRendererComponentService,
		protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
		protected contentsService: EIMContentsService,
		protected documentCacheService: EIMDocumentsCacheService,
	) { }

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 公開ファイルを比較します.
	 */
	public execute(): void {

		// 入力値のチェック
		if (this.isIllegalName()) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00009'));
			return;
		}
		this.creating = true;
		let orgObjId = String(this.sourceDocument[0].objId);
		let dstObjId = String(this.destinationDocument[0].objId);
		let isCompMail = this.FLAG_ON;
		let doAnalyzeLayout = this.FLAG_OFF;
		let compFileName = this.name + this.PDF_EX;

		// メール通知
		if (this.chkMailSendinglagValue) {
			isCompMail = this.FLAG_ON;
		} else {
			isCompMail = this.FLAG_OFF;
		}

		// レイアウト解析
		if (this.chkDoAnalyzeLayout) {
			doAnalyzeLayout = this.FLAG_ON;
		} else {
			doAnalyzeLayout = this.FLAG_OFF;
		}

		this.contentsService.actFileCompare(orgObjId , dstObjId , isCompMail , doAnalyzeLayout , compFileName)
			.subscribe(
				(res: any) => {
					// 検索キャッシュクリア
					this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
					// 完了イベントを通知(画面が閉じる)
					this.executed.emit();
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
		if (this.creating || !this.fileCompareForm.valid) {
			return false;
		}
		if (!this.sourceDocument[0] || !this.destinationDocument[0]) {
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
		if (this.fileCompareForm.dirty) {
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
	 * メイン画面右クリック比較元ドキュメント選択時のハンドラ.
	 * @param objectList リスト
	 */
	public sourceDocuments(objectList: any[]): void {
		if ( this.destinationDocument[0] && (this.destinationDocument[0].objId === objectList[0].objId)) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00030'));
			return;
		}
		objectList[0] = Object.assign({}, objectList[0]);
		this.sourceDocumentList.setData(objectList);
		this.sourceDocument = this.sourceDocumentList.getData();
		// 入れ替えボタンの活性判定
		this.replacementCheck();
	}

	/**
	 * メイン画面右クリック比較先ドキュメント選択時のハンドラ.
	 * @param objectList リスト
	 */
	public destinationDocuments(objectList: any[]): void {
		if ( this.sourceDocument[0] && (this.sourceDocument[0].objId === objectList[0].objId)) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00030'));
			return;
		}
		objectList[0] = Object.assign({}, objectList[0]);
		this.destinationDocumentList.setData(objectList);
		this.destinationDocument = this.destinationDocumentList.getData();
		// 入れ替えボタンの活性判定
		this.replacementCheck();
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		window.setTimeout(() => {
			let columns: EIMDataGridColumn[] = [];
			// 履歴
			columns.push({field: 'rev', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), width: 60,
				suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMHistoryRendererComponent,
				valueGetter: this.historyRendererComponentService.valueGetter});
			// 名前
			columns.push({field: 'objName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 200,
				suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMObjectNameRendererComponent, param: {isLink: false}});
			// 更新日時
			columns.push({field: 'modifyDateTime', headerName: this.translateService.instant('EIM.LABEL_02033'), width: 170,
				suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMDateTimeRendererComponent,
				valueGetter: this.dateTimeRendererComponentService.valueGetter});
			// 場所
			columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), width: 300,
				suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMPlaceRendererComponent, param: {showLink: false}});

			// 比較元
			this.sourceDocumentList.setColumns(columns);
			if (this.contents.length > 0) {
				this.contents[0] = Object.assign({}, this.contents[0]);
				this.sourceDocumentList.setData([this.contents[0]]);
				this.sourceDocument = this.sourceDocumentList.getData();
			}

			// 比較先
			this.destinationDocumentList.setColumns(columns);
			if (this.contents.length > 1) {
				this.contents[1] = Object.assign({}, this.contents[1]);
				this.destinationDocumentList.setData([this.contents[1]]);
				this.destinationDocument = this.destinationDocumentList.getData();
			}

			// 入れ替えボタンの活性判定
			this.replacementCheck();
		});
	}

	/**
	 * ドキュメントクリックイベントハンドラです.
	 * @param event イベント
	 */
	onSelectFile (event: any): void {
	}

	/**
	 * 比較元ドキュメント選択メニュークリックイベントハンドラです.
	 * @param event イベント
	 */
	onClickSelectSourceDocument(event: any): void {
		this.selectDocument(this.sourceDocument , this.destinationDocument, (data) => {
			this.sourceDocumentList.setData(data);
			this.sourceDocument = this.sourceDocumentList.getData();
			// 入れ替えボタンの活性判定
			this.replacementCheck();
		});
	}

	/**
	 * 比較先ドキュメント選択メニュークリックイベントハンドラです.
	 * @param event イベント
	 */
	onClickSelectDestinationDocument(event: any): void {
		this.selectDocument(this.destinationDocument , this.sourceDocument, (data) => {
			this.destinationDocumentList.setData(data);
			this.destinationDocument = this.destinationDocumentList.getData();
			// 入れ替えボタンの活性判定
			this.replacementCheck();
		});
	}

	/**
	 * 入れ替えボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickReplacement(event: any): void {
		let target: any[]  = this.destinationDocument;
		this.destinationDocumentList.setData(this.sourceDocument);
		this.sourceDocumentList.setData(target);
		this.sourceDocumentList.refreshView();
		this.sourceDocument = this.sourceDocumentList.getData();
		this.destinationDocument = this.destinationDocumentList.getData();
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
	 * 公開ファイル比較対象データかどうかを判定します.
	 * @param data 選択されたドキュメント配列
	 * @return 対象オブジェクト配列
	 */
	private checkPublicFileCompare(data: any[]): any {
		let publicFileComparekCheckList: any[] = [];
			// ステータスが公開済の場合
			if ((data[0].statusTypeKind === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC
				|| data[0].statusTypeKind === String(EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC))
				&& (data[0].objName.endsWith(this.PDF_EX)
				|| data[0].isDspPdfIcon === this.FLAG_TRUE)) {
			// WF無の場合
			} else if ((data[0].statusTypeKind === ''
				|| data[0].statusTypeName === '-')
				&& data[0].objName.endsWith(this.PDF_EX)) {
			} else {
				publicFileComparekCheckList.push(data[0].objName);
			}
		return publicFileComparekCheckList;
	}

	/**
	 * 入れ替え可能かを判定します.
	 */
	private replacementCheck(): void {
		if ( this.sourceDocument.length === 0 &&
		this.destinationDocument.length === 0) {
			this.disabledFlag = true;
		} else {
			this.disabledFlag = false;
		}
	}

	/**
	 * 選択ボタン押下ハンドラ.
	 * @param　選択対象ドキュメントデータ
	 * @param　比較対象ドキュメントデータ
	 * @return 選択後ドキュメントデータ
	 */
	private selectDocument(targetDataGrid , compareDataGrid, callback): any {
		let targetObj = {
			document: true,
			folder: false,
			tag: false,
		}
		let dialogId: string = this.dialogManagerComponentService.showContentsSingleSelector(null, null, targetObj, true,
			{
				selected: (data: any[]) => {
					let checkPublicFileCompares: any[] = this.checkPublicFileCompare(data);
					// 選択されたドキュメントが公開ファイル比較対象外データの場合はエラーメッセージを表示します.
					if (checkPublicFileCompares.length > 0) {
						this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00033', {value: checkPublicFileCompares[0]}));
					// 比較ドキュメントと同一ドキュメントが選択された場合はエラーメッセージを表示します.
					} else if (compareDataGrid[0] && compareDataGrid[0].objId === data[0].objId) {
						this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00030'));
					}　else {
						// 検索キャッシュクリア
						this.documentCacheService.clearSearchCacheByMode(EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR);
						this.dialogManagerComponentService.close(dialogId);
						data[0] = Object.assign({}, data[0]);
						callback(data);
					}
				}
			});
	}

}
