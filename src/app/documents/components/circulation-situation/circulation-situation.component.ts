
import { Subscription } from 'rxjs';

import { Component, ComponentRef, ComponentFactory, Output, EventEmitter, NgModule, OnDestroy, ViewContainerRef, SimpleChange, OnChanges, Input, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMHierarchicalContentsService, EIMHierarchicalContents } from 'app/documents/shared/services/apis/hierarchical-contents.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMUserInputFormItemComponent } from 'app/shared/components/input-form-item/user-input-form-item/user-input-form-item.component';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * 回付状況確認コンポーネント
 * @example
 *
 *      <eim-circulation-situation
 * 				(exportCsvOnClicked)="executeExportCsv($event)"
 * 				(searchOnClicked)="executeSearch($event)"
 * 				(clearOnClicked)="executeClearParams()">
 * 			</eim-circulation-situation>
 */
@Component({
    selector: 'eim-circulation-situation',
    templateUrl: './circulation-situation.component.html',
    styleUrls: ['./circulation-situation.component.css'],
    standalone: false
})

export class EIMCirculationSituationComponent {

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/** ノードID 承認依頼したドキュメント */
	private readonly APPROVER_REQUEST_DOCUMENT = 'APPROVER_REQUEST_DOCUMENT';

	/** ノードID 承認待ちのドキュメント(保留中) */
	private readonly APPROVER_PENDING_DOCUMENT = 'APPROVER_PENDING_DOCUMENT';

	/** ノードID 承認したドキュメント */
	private readonly  APPROVED_DOCUMENT = 'APPROVED_DOCUMENT';

	/** ドキュメントタイプ 承認依頼中 */
	private readonly DOC_TYPE_APPROVER_REQUEST = 0;

	/** ドキュメントタイプ 公開済み */
	private readonly DOC_TYPE_PUBLISHED = 1;

	/** ツリーコンポーネント */
	@ViewChild('tree')
	tree: EIMTreeComponent;

	/** ユーザー選択コンポーネント */
	@ViewChild('targetUser')
	targetUser: EIMUserInputFormItemComponent;

	/** CSVダウンロードエミッタ */
	@Output() exportCsvOnClicked: EventEmitter<any>;

	/** 検索実行エミッタ */
	@Output() searchOnClicked: EventEmitter<any>;

	/** クリア実行エミッタ */
	@Output() clearOnClicked: EventEmitter<any>;

	/** デリミタ「~」 */
	public DELIMITER_TIDE: string = EIMConstantService.DELIMITER_TIDE ;

	/** 作成者 */
	public users: any[];

	/** 過去履歴を含むチェックボックス値 */
	public isContainOldVersion = false;

	/** 名称 */
	public objName = '';

	/** 検索対象 */
	public pathCondition = this.FLAG_FALSE;

	/** 検索対象パス */
	public searchPath = '/';

	/** 検索開始日 */
	public searchRangeStartDate: any;

	/** 検索開始日 */
	public searchRangeEndDate: any;

	/** カレンダー年範囲 */
	public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

	/** 承認依頼フラグ */
	public isApprovalRequest = true;

	/** 初期選択ノード */
	private defaultSelectNode: EIMTreeNode[];

	/** フォルダ選択ボタン非活性 */
	public folderSelectButtonDisabled = true;

	/** 日付フォーマット */
	public dateFormat: string

	/** 初期化実施フラグ */
	public initialized = false;

	/** CSVダウンロード活性フラグ */
	public disabledCsvDownloadFlg = true;

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected translateService: TranslateService,
		public treeComponentService: EIMTreeComponentService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected dateService: EIMDateService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected messageService: EIMMessageService,
		protected serverConfigService: EIMServerConfigService,
		protected documentFileService: EIMDocumentFileService
	) {
		this.searchOnClicked = new EventEmitter<any>();
		this.exportCsvOnClicked = new EventEmitter<any>();
		this.clearOnClicked = new EventEmitter<any>();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 検索を実行します.
	 */
	public search() {
		this.executeSearch(this.tree.getSelectedData()[0]);
	}

	/**
	 * 初期処理を実行します.
	 */
	public init() {
		this.dateFormat = this.translateService.instant('EIM.CALENDAR.DATE_FORMAT');
		this.initialized = true;

		let parentNode: EIMTreeNode[] =
		[{
				label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02124'),
				icon: 'fa fa-fw fa-arrow-up',
				leaf: false,
				selectable: false,
				expanded: true,
				data: {id: this.APPROVER_REQUEST_DOCUMENT},
				key: this.APPROVER_REQUEST_DOCUMENT
			}
			, {
				label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02125'),
				icon: 'fa fa-fw fa-hourglass-half',
				leaf: false,
				selectable: false,
				expanded: true,
				data: {id: this.APPROVER_PENDING_DOCUMENT},
				key: this.APPROVER_PENDING_DOCUMENT
			}
			, {
				label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02126'),
				icon: 'fa fa-fw fa-handshake-o',
				leaf: false,
				selectable: false,
				expanded: true,
				data: {id: this.APPROVED_DOCUMENT},
				key: this.APPROVED_DOCUMENT
			}];
			this.users = [this.documentsCacheService.getLoginUser()];
			window.setTimeout(() => {
				this.tree.setData(parentNode);
				this.tree.setChildren(parentNode[0], this.getChildNodes(false, 0, parentNode[0].data.id));
				this.tree.setChildren(parentNode[1], this.getChildNodes(true, 1, parentNode[1].data.id));
				this.tree.setChildren(parentNode[2], this.getChildNodes(false, 2, parentNode[2].data.id));

				this.defaultSelectNode = parentNode[0].children;
				this.tree.select(parentNode[0].children, false);
			});
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * ツリーノード選択時イベントハンドラです.
	 * @param event イベント
	 */
	onSelectTreeNode(event) {
		if (event.selectedData[0].parent.label === this.translateService.instant('EIM_DOCUMENTS.LABEL_02126')) {
			this.isApprovalRequest = false;
		} else {
			this.isApprovalRequest = true;
		}
		this.executeSearch(event.selectedData[0]);
	}

	/**
	 * フォルダ選択ボタン押下時のイベントハンドラです
	 * @param event イベント
	 */
	onClickFolderSelect(event) {
		if (this.pathCondition === this.FLAG_TRUE) {
			let dialogId: string = this.dialogManagerComponentService.showFolderTreeSelector(
				{selectPath: this.searchPath},
				EIMDocumentsConstantService.FOLDER_DOCUMENT, {
				selected: (node: EIMTreeNode ) => {
					this.dialogManagerComponentService.close(dialogId);
					this.searchPath = this.getsearchPath(node) + '/';
				}
			});
		}
	}

	/**
	 * csvダウンロードボタンクリックイベントハンドラです.
	 */
	onClickCsvDownload() {
		let fileName: string = this.serverConfigService.csvCirculationFileHeader
				+ this.dateService.getFixedCurrentDateTimeString()
				+ EIMDocumentsConstantService.CSV_EXTENSION;
		this.exportCsvOnClicked.emit({fileName: fileName});
	}

	/**
	 * 検索ボタン押下時イベントハンドラです.
	 * @param event イベント
	 */
	onSearch(event) {
		this.executeSearch(this.tree.getSelectedData()[0]);
	}

	/**
	 * クリアボタン押下時イベントハンドラです.
	 * @param event イベント
	 */
	onClear(event) {
		this.isContainOldVersion = false;
		this.objName = '';
		this.pathCondition = this.FLAG_FALSE;
		this.searchPath = '/';
		this.searchRangeStartDate = null;
		this.searchRangeEndDate = null;
		this.users = [this.documentsCacheService.getLoginUser()];
		this.targetUser.writeValue([this.documentsCacheService.getLoginUser()]);
		this.targetUser.onChange(null, 0);
		this.tree.select(this.defaultSelectNode, false);

		this.disabledCsvDownloadFlg = true;
		this.clearOnClicked.emit();
	}

	/**
	 * 検索対象ラジオボタン選択イベントハンドラです.
	 * @param isSelectBelowFolder 選択値
	 */
	onClickSearchType (isSelectBelowFolder: boolean) {
		this.folderSelectButtonDisabled  = !isSelectBelowFolder;
	}

	/**
	 * 今日ボタンクリックイベントハンドラ
	 * @param value 選択した値
	 * @param calendar 選択したカレンダー
	 */
	onClickToday(value, calendar): void {
		let crrentDate = new Date();
		calendar.currentMonth = crrentDate.getMonth();
		calendar.currentYear = crrentDate.getFullYear();
	}

	/**
	 * クリアボタンクリックイベントハンドラ
	 * @param value 選択した値
	 * @param calendar 選択したカレンダー
	 */
	onClickClear(value, calendar): void {
		calendar.currentMonth = calendar.months[0].month;
		calendar.currentYear = calendar.months[0].year;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ツリーの子要素を生成して返す
	 * @param isApprovalWaitingDocument 承認待ち文書ノードフラグ
	 * @param targetDocType 対象ドキュメントタイプ
	 * @param pearentId 親ノードのID
	 * @return 引数の親ノードに追加する子要素
	 */
	private getChildNodes(isApprovalWaitingDocument, targetDocType, pearentId: string): EIMTreeNode[] {

		// ツリーの子要素を生成
		let childNodes: EIMTreeNode[] = [];

		childNodes.push({
			label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02127'),
			leaf: true,
			selectable: true,
			status: this.DOC_TYPE_APPROVER_REQUEST,
			targetDocType: targetDocType,
			data: {id: pearentId + '_' + this.DOC_TYPE_APPROVER_REQUEST.toString()},
			key: pearentId + '_' + this.DOC_TYPE_APPROVER_REQUEST.toString()
		});
		if (!isApprovalWaitingDocument) {
			childNodes.push({
				label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02176'),
				leaf: true,
				selectable: true,
				status: this.DOC_TYPE_PUBLISHED,
				targetDocType: targetDocType,
				data: {id: pearentId + '_' + this.DOC_TYPE_PUBLISHED.toString()},
				key: pearentId + '_' + this.DOC_TYPE_PUBLISHED.toString()
			});
		}
		return childNodes;
	}


	/**
	 * 検索実行
	 * @param selectedNode 選択ノード
	 */
	private executeSearch(selectedNode: EIMTreeNode): void {

		let startDate = this.dateService.getDateString(this.searchRangeStartDate);
		let endDate =  this.dateService.getDateString(this.searchRangeEndDate);

		// ユーザーの必須チェック
		if (this.users.length === 0) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00007'));
			return;
		}

		// 検索範囲日付の整合性チェック
		if (startDate && endDate) {
			if (endDate < startDate) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00045'));
				return;
			}
		}

		let params: any = {};

		// ユーザーID
		let userIds = '';
		for (let i = 0; i < this.users.length; i++) {
			let user: EIMUserDomain = this.users[i];
			userIds = userIds + user.id + ',';
		}
		params['userId'] = userIds.substring(0, userIds.length - 1);

		// ステータス
		params['status'] = selectedNode.status;

		// 文書種類
		params['targetDocType'] = selectedNode.targetDocType;

		// 名称
		params['objectName'] = this.objName;

		// 検索対象
		params['pathCondition'] = this.pathCondition;
		if (this.pathCondition === this.FLAG_TRUE) {
			params['searchPath'] = this.searchPath;
		}

		// 検索開始日
		if (startDate) {
			params['searchRangeStartDate'] = startDate + ' 00:00:00';
		}
		// 検索終了日
		if (this.searchRangeEndDate) {
			params['searchRangeEndDate'] = endDate + ' 23:59:59';
		}

		// 過去履歴を含む
		if (this.isContainOldVersion) {
			params['isContainOldVersion'] = this.isContainOldVersion;
		}

		// 検索実行エミット
		this.searchOnClicked.emit({params: params});
	}

	/**
	 * パスを生成します.
	 * @param node パス生成対象ノード
	 */
	private getsearchPath(node: EIMTreeNode): string {
		if (node.parent) {
			return this.getsearchPath( node.parent ) +  '/' + node.data.objName;
		}
		return '/' + node.data.objName;
	}
}
