import { Component, forwardRef, EventEmitter, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChange, ElementRef, OnDestroy } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { SelectItem } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMExecutable, EIMSelectable } from 'app/shared/shared.interface';
import { EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMFolderService, EIMFolder, EIMFolderType } from 'app/documents/shared/services/apis/folder.service';
import { EIMTableService, EIMTable, EIMHierarchicalTable, EIMTableItem } from 'app/documents/shared/services/apis/table.service';

import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMContentsSearchComponentService, EIMContentsSearchDetailCondition, EIMContentsSearchComponentInfo, EIMTagetObject } from 'app/documents/components/contents-search/contents-search.component.service';

import { EIMDateService } from 'app/shared/services/date.service';

// レンダラー
import { EIMPublicFileRendererComponent } from 'app/documents/shared/components/renderer/public-file-renderer.component';
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMStatusRendererComponent } from 'app/documents/shared/components/renderer/status-renderer.component';
import { EIMStatusRendererComponentService } from 'app/documents/shared/components/renderer/status-renderer.component.service';
import { EIMPageRendererComponent } from 'app/documents/shared/components/renderer/page-renderer.component';
import { EIMPageRendererComponentService } from 'app/documents/shared/components/renderer/page-renderer.component.service';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';

import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';

import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';
import { EIMFolderTreeNode } from '../contents-tree/contents-tree.component.service';


/** 画面状態定数 */
export namespace stateConst {
	export const EDITING = 'editing';
	export const CREATING = 'creating';
	export const COMPLETE = 'complete';
}

/** 検索種別 */
export namespace searchKinds {
	export const NORMAL_SEARCH = 'NORMAL_SEARCH';
	export const SUGGEST_SEARCH = 'SUGGEST_SEARCH';
}

/**
 * コンテンツ検索コンポーネント
 * @example
 *
 *		<eim-contents-search
 *			[parentObjId]="parentObjId"
 *			[selectFlg]="true"
 *			[multiple]="true"
 *			[targetObj]="targetObj"
 *			[isContentsSearch]="true"
 *			[visibleDocumentLink]="true"
 *		>
 *		</eim-contents-search>
 */
@Component({
    selector: 'eim-contents-search',
    templateUrl: './contents-search.component.html',
    styleUrls: ['./contents-search.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMContentsSearchComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMContentsSearchComponent) },
        EIMContentsSearchComponentService],
    standalone: false
})
export class EIMContentsSearchComponent extends EIMSingleSelectorComponent implements OnInit, AfterViewInit, OnDestroy, EIMComponent, EIMSelectable {
	/** サジェスチョンキーワード */
	keyWordSuggestions: string[];

	/** 初期表示パス */
	public static initPath = '/';

	/** 詳細表示 表示時の高さ */
	private static detailConditionOpenHeight = 300;

	/** 詳細表示 非表示時の高さ */
	private static detailConditionCloseHeight = 186;

	/** コンポーネント情報 */
	public info: EIMContentsSearchComponentInfo = {};

	/** 選択ボタン表示フラグ */
	public visibleSelect = false;

	/** ごみ箱検索フラグ */
	public static isTrash = false;

	/** 検索結果グリッド */
	@ViewChild('searchResultList', { static: true })
		searchResultList: EIMDataGridComponent;

	/** 親オブジェクトID */
	@Input() parentObjId: number;

	/** 複数選択可否 */
	@Input()
		public multiple = true;

	/** 検索パス */
	public searchPath: string;

	/** 選択可能フラグ */
	@Input() selectFlg = false;

	/** 検索可能となる対象指定 */
	@Input() targetObj: EIMTagetObject = {
			document: true,
			folder: true,
			tag: true,
	}

	/** プロパティ表示不可フラグ */
	@Input() disablePropertyFlg = false;

	/** ドキュメントリンク表示フラグ */
	@Input() public visibleDocumentLink = true;

	/** 過去履歴を含む変更を抑制 */
	@Input() public suppressChangeHistory = false;

	/** ステータスのデフォルト値 */
	@Input() public defaultStatus = 'all';

	/** ステータス変更を抑制 */
	@Input() public suppressChangeStatus = false;

	/** 検索結果の場所のリンク表示を抑制 */
	@Input() public suppressPlaceLink = false;

	/** 場所アクセスイベントエミッタ */
	@Output() contentsAccess: EventEmitter<any> = new EventEmitter<any>();

	/** 画面を閉じるのイベントエミッタ */
	@Output() closed: EventEmitter<null> = new EventEmitter<null>();

	/** 名前選択イベントエミッタ */
	@Output() onNodeSelect: EventEmitter<any> = new EventEmitter<any>();

	/** ステータス */
	public statuses: SelectItem[] =
		[
		 	{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02203'), value: 'all'},
		 	{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02033'), value: 'edit'},
		 	{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02034'), value: 'public'},
		 	{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02035'), value: 'checkout'},
		];

	/** キーワード入力最大数 */
	public keywordInputMaxLength: number = EIMConstantService.STRING_MAX_LENGTH;

	/** デリミタ「~」 */
	public DELIMITER_TIDE: string = EIMConstantService.DELIMITER_TIDE ;

	/** 日付フォーマット */
	private dateFormat: string = this.translateService.instant('EIM.CALENDAR.DATE_FORMAT');

	/** 検索対象パス変更イベントエミッタ */
	private searchPathChanged: EventEmitter<string> = new EventEmitter<string>();

	/** カレンダー年範囲 */
	public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

	/** 詳細条件表示ボタンラベル */
	public detailConditionButtonLabel: string;

	/** スプリットエリア上部サイズ(%) */
	public splitAreaFirstSize = 0;

	/** モード */
	private mode = EIMContentsSearchComponentService.MODE_NORMAL;

	/** テーブルロードサブスクリプション */
	private contentsTableServiceLoadCompleted: Subscription;

	/** テーブル選択サブスクリプション */
	private contentsTableServiceSelectTableCompleted: Subscription;

	/** テーブル更新サブスクリプション */
	private contentsTableServiceUpdateTableCompleted: Subscription;

	public disabled = false;

	/** ページクリック完了サブスクリプション */
	private pageClickCompleted: Subscription;

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	//
	// メニュー
	//
	/** メニュー */
	public tableMenuItems: EIMMenuItem[] = [];
	/** グリッドコンテキストメニュー */
	public contentsGridMenuItems: EIMMenuItem[] =
		[
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03007'), name: 'property', icon: 'fa fa-list-ul', disabled: true, command: (event) => {this.onShowProperty(); }},
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03018'), name: 'csvDownload', icon: 'fa fa-download', disabled: true, command: (event) => {this.onClickCsvDownload(); }},
		];

	//
	// メニューアイテム
	//
	/** メニューアイテム テーブル管理 */
	private menuTableConfig: EIMMenuItem =
		{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03019'), name: 'showTableConfig', icon: 'fa fa-table', command: (event) => { this.onClickMenuTableManagement(); }};
	/** メニューアイテム テーブル選択 */
	private menuTableSelector: EIMMenuItem =
		{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03020'), name: 'showTableSelector', icon: 'fa fa-table', items: [], command: (event) => { }};

	// 定数クラス
	private Constant: EIMConstantService = EIMConstantService;

	/** 選択処理完了のイベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();


	/** 状態 */
	public STATE = stateConst;
	public state = stateConst.EDITING;

	/** 自動採番設定 */
	public enableAutomaticNumbering = false;

	/** 検索画面用行比較関数 */
	public searchEquals = (obj1: any, obj2: any): boolean => {
		if (obj2.pageNumber || obj1.pageNumber) {
			return (obj1.objId === obj2.objId
				&& obj1.pageNumber === obj2.pageNumber
				&& obj1.isDocumentLink === obj2.isDocumentLink
				&& obj1.linkParentObjId === obj2.linkParentObjId
			);
		}
		return (obj1.objId === obj2.objId
			&& obj1.isDocumentLink === obj2.isDocumentLink
			&& obj1.linkParentObjId === obj2.linkParentObjId
		);
	}
	/**
	 * コンストラクタ.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected dateService: EIMDateService,
		protected placeRendererComponentService: EIMPlaceRendererComponentService,
		protected statusRendererComponentService: EIMStatusRendererComponentService,
		protected pageRendererComponentService: EIMPageRendererComponentService,
		protected publicFileRendererComponentService: EIMPublicFileRendererComponentService,
		protected historyRendererComponentService: EIMHistoryRendererComponentService,
		public contentsSearchComponentService: EIMContentsSearchComponentService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected documentFormService: EIMDocumentFormService,
		protected folderService: EIMFolderService,
		protected tableService: EIMTableService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected serverConfigService: EIMServerConfigService,
		protected contentsTableService: EIMContentsTableService,
		protected messageService: EIMMessageService,
		protected documentFileService: EIMDocumentFileService,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,
		protected elmRef: ElementRef) {
		super();
		this.info.selectedTable = null;
		this.info.tableMenuItems = this.tableMenuItems;
		this.info.menuTableConfig = this.menuTableConfig;
		this.info.menuTableSelector = this.menuTableSelector;
		this.info.isShowDetailCondition = false;

		/**
		 * テーブル読み込み完了イベントハンドラ
		 */
		this.contentsTableServiceLoadCompleted =
		this.contentsTableService.loadCompleted.subscribe( (event: any) => {
			this.onTableProcessingCompleted(event);
		});

		/**
		 * テーブル選択完了イベントハンドラ
		 */
		this.contentsTableServiceSelectTableCompleted =
		this.contentsTableService.selectTableCompleted.subscribe( (event: any) => {
			this.onTableProcessingCompleted(event);
		});

		/**
		 * テーブル更新完了イベントハンドラ
		 */
		this.contentsTableServiceUpdateTableCompleted =
		this.contentsTableService.updateTableCompleted.subscribe( (event: any) => {
			this.onTableProcessingCompleted(event);
		});

		/**
		 * 検索完了イベントハンドラ
		 */
		this.info.searchCompleted = new EventEmitter<any>();
		this.info.searchCompleted
		.subscribe( (result: any) => {
			this.onSearchCompleted(result);
		});

		/**
		 * ページ検索完了イベントハンドラ
		 */
		this.info.pageSearchCompleted = new EventEmitter<any>();
		this.info.pageSearchCompleted
		.subscribe( (result: any) => {
			this.onPageSearchCompleted(result);
		});

		// 自動採番設定取得
		this.enableAutomaticNumbering = serverConfigService.enableAutomaticNumbering;

		// 検索詳細条件OPEN/CLOSE設定 (初回起動時)
		if (!this.documentsCacheService.searchCache[this.mode].searchOnceDisplayedContentsSearch) {
			if (this.serverConfigService.searchDetailsOpen) {
				this.info.isShowDetailCondition = this.serverConfigService.searchDetailsOpen;
			}
		}
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

	/**
	* カレンダーボタンクリックイベントハンドラ
	* @param calendar 選択したカレンダー
	*/
	openCalendar(calendar) {
		if (calendar.value) {
			const date: Date = calendar.value;
			// 設定値と選択しているカレンダーの日にちが異なる場合は、合わせる。
			if (date.getMonth() !== calendar.currentMonth || date.getFullYear() !== calendar.currentYear) {
				calendar.currentMonth = date.getMonth();
				calendar.currentYear = date.getFullYear();
			}
		}
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コンテンツグリッドメニューボタン押下可否を制御します.
	 */
	public canContentsGridMenu(): void {
		this.canProperty();
		this.canCsvDownload();
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	public ngOnInit(): void {
	
		// 検索条件
		this.info.condition = {
			/** 選択された種別 */
			searchType: 'document',
			/** 選択された対象 */
			pathCondition: this.FLAG_TRUE,
			/** 検索対象のパス */
			searchPath: '/',
			/** キーワード */
			keyword: '',
			/** 全文を含む */
			contents: false,
			/** 過去履歴を含む*/
			history: false,
			/** 空フォルダのみ */
			emptyFolder: false,
			/** 選択されたステータス */
			status: this.defaultStatus,
			/** 選択しているテーブルID */
			tableId: 'default',
			/** 部分一致検索かどうか */
			chkDetailLikeSearch: this.serverConfigService.searchDetailLikeCondition,
			/** 詳細条件 */
			detailConditionList: [],
		};

	
		if (this.selectFlg) {
			this.contentsGridMenuItems[0].visible = false;
			this.visibleSelect = true;
			this.searchResultList.multiple = this.multiple;
			this.mode = EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR;
		}

		this.info.searchResultList = this.searchResultList;
		this.info.contentsAccess = this.contentsAccess;
		if (!this.searchPath) {
			this.searchPath = EIMContentsSearchComponent.initPath;
		}
		this.info.condition.searchPath = this.searchPath;
		this.info.condition.isTrash = EIMContentsSearchComponent.isTrash;

		if (!this.searchPath || this.searchPath === '/') {
			this.info.condition.pathCondition = this.FLAG_FALSE;
		}
		this.info.parentObjId = this.parentObjId;
		let normal = this.documentsCacheService.searchCache[this.mode].searchResult;
		let selector = this.documentsCacheService.searchCache[this.mode].searchResult;
		if (!this.documentsCacheService.searchCache[this.mode].searchOnceDisplayedContentsSearch) {
			// 表示処理
			this.contentsSearchComponentService.init(this.info, this.mode);
			this.documentsCacheService.searchCache[this.mode].searchOnceDisplayedContentsSearch = true;
		} else {
			// 再表示処理
			this.contentsSearchComponentService.redisplay(this.info, this.mode);
			window.setTimeout(() => {
				this.canContentsGridMenu();
			});
		}

		// 検索対象パス設定ハンドラ
		this.searchPathChanged.subscribe( (searchPath: string) => {
			this.info.condition.searchPath = searchPath;
		});
		// アコーディオン検索とテーブル管理が競合してしまうためフラグによる管理
		this.documentSessionStorageService.setContentsSelectDispFlg(true);

		this.info.suppressPlaceLink = this.suppressPlaceLink;
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngAfterViewInit(): void {
		window.setTimeout(() => {
			window.setTimeout(() => {
				// DialogコンポーネントのngAfterViewInitにて、window.setTimeoutのタイミングで
				// Dialogの中身コンテンツの高さが決定する。
				// そのためさらにwindow.setTimeoutでタイミングをずらしている。
				// コンテンツの高さからスプリットバーの％を決定する必要がある。

				// 詳細条件開閉
				this.showDetailConditionPanel();
			});
		});
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.contentsTableServiceLoadCompleted.closed) {this.contentsTableServiceLoadCompleted.unsubscribe()};
		if (!this.contentsTableServiceSelectTableCompleted.closed) {this.contentsTableServiceSelectTableCompleted.unsubscribe()};
		if (!this.info.placeRendererComponentServicePlaceClicked.closed) {this.info.placeRendererComponentServicePlaceClicked.unsubscribe()};

		this.documentSessionStorageService.setContentsSelectDispFlg(false);
	}

	/**
	 * サジェスチョンを取得します.
	 */
	onSearchSuggestions() {
		// 検索パラメータを設定
		let params = this.setParams(searchKinds.SUGGEST_SEARCH);
	
		if (!params) {
			// エラー時
			return;
		}

		// 検索
		this.documentFormService.searchSuggestions(params).
		subscribe( (resultList: any) => {
			this.keyWordSuggestions = resultList.value;
		}, (err: any) => {
			
		});
	}

	/**
	* 検索パラメータを設定します.
	 */
	private setParams(searchKind : any): any {
		// サーバ送信用のリクエストパラメータを作成
		let detailParams: any = {};
		// 文字列拡張属性
		let attType_Value:string[] = new Array();
		// 数値拡張属性
		let attType_RangeNumeric :string[] = new Array();
		// 日付拡張属性
		let attType_RangeDate :string[] = new Array();

		// 詳細条件リストループ
		for (let i = 0; i < this.info.condition.detailConditionList.length; i++) {
			let detail = this.info.condition.detailConditionList[i];
			let checkStatus = detail.checkStatus === true ? 'true' : 'false';
			let inputValueFrom = "";
			let inputValueTo = "";

			if (detail.field === 'createUserName' || detail.field === 'modifyUserName' || detail.field === 'searchIndex' || detail.field === 'property') {
				// 規定属性設定
				if (checkStatus === 'true' || detail.inputValue !== null) {
					detailParams[detail.field] = detail.inputValue + "," + checkStatus;
				}	
			} else if (detail.field === 'createDate' || detail.field === 'modifyDate' || detail.field === 'effectiveTerm'){
				// 日付の範囲チェック
				if (searchKind === searchKinds.NORMAL_SEARCH && checkStatus !== 'true' && detail.inputValueFrom && detail.inputValueTo) {
					if (new Date(detail.inputValueFrom) > new Date(detail.inputValueTo)) {
						this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00045'));
						return;
					}
				}
				// 規定属性設定
				if (checkStatus === 'true' || (detail.inputValueFrom !== "" && detail.inputValueFrom !== null && detail.inputValueFrom !== undefined) 
						|| (detail.inputValueTo !== "" && detail.inputValueTo !== null && detail.inputValueTo !== undefined)) {

					inputValueFrom = detail.inputValueFrom !== "" && detail.inputValueFrom !== null && detail.inputValueFrom !== undefined ? new Date(detail.inputValueFrom).getTime().toString() : "";
					if (detail.inputValueTo !== "" && detail.inputValueTo !== null && detail.inputValueTo !== undefined) {
						let date = new Date(detail.inputValueTo);
						date.setDate(date.getDate() + 1);
						inputValueTo = date.getTime().toString();
					} else {
						inputValueTo = "";
					}
					detailParams[detail.field] = inputValueFrom + "," + inputValueTo + "," + checkStatus;
				}
			} else if (detail.field === 'fileSize') {
				// 数値範囲チェック
				if (searchKind === searchKinds.NORMAL_SEARCH && checkStatus !== 'true' && detail.inputValueFrom && detail.inputValueTo) {
					if (Number(detail.inputValueFrom) > Number(detail.inputValueTo)) {
						this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00049'));
						return;
					}
				}
				// 規定属性設定
				if (checkStatus === 'true' || (detail.inputValueFrom !== "" && detail.inputValueFrom !== null && detail.inputValueFrom !== undefined)  
						|| (detail.inputValueTo !== "" && detail.inputValueTo !== null && detail.inputValueTo !== undefined)) {
					inputValueFrom = detail.inputValueFrom !== "" && detail.inputValueFrom !== null && detail.inputValueFrom !== undefined ? detail.inputValueFrom : "";
					inputValueTo = detail.inputValueTo !== "" && detail.inputValueTo !== null && detail.inputValueTo !== undefined ? detail.inputValueTo : "";
					detailParams[detail.field] = detail.inputValueFrom + "," + detail.inputValueTo + "," + checkStatus;
				}
			} else if (detail.valTypeId === EIMConstantService.VALUE_TYPE_INTEGER || detail.valTypeId === EIMConstantService.VALUE_TYPE_DOUBLE || detail.valTypeId === EIMConstantService.VALUE_TYPE_DATE) {
				// 拡張属性（日付or数値）
				if (detail.valTypeId === EIMConstantService.VALUE_TYPE_DATE) {
					// 日付の範囲チェック
					if (searchKind === searchKinds.NORMAL_SEARCH && checkStatus !== 'true' && detail.inputValueFrom && detail.inputValueTo) {
						if (new Date(detail.inputValueFrom) > new Date(detail.inputValueTo)) {
							this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00045'));
							return;
						}
					}

					if (checkStatus === 'true' || (detail.inputValueFrom !== "" && detail.inputValueFrom !== null && detail.inputValueFrom !== undefined) 
							|| (detail.inputValueTo !== "" && detail.inputValueTo !== null && detail.inputValueTo !== undefined)) {
						inputValueFrom = detail.inputValueFrom !== "" && detail.inputValueFrom !== null && detail.inputValueFrom !== undefined ? new Date(detail.inputValueFrom).getTime().toString() : "";
						if (detail.inputValueTo !== "" && detail.inputValueTo !== null && detail.inputValueTo !== undefined) {
							let date = new Date(detail.inputValueTo);
							date.setDate(date.getDate() + 1);
							inputValueTo = date.getTime().toString();
						} else {
							inputValueTo = "";
						}
						attType_RangeDate.push(detail.field + "," + inputValueFrom + "," + inputValueTo + "," + checkStatus);
					}

				} else {
					// 数値範囲チェック
					if (searchKind === searchKinds.NORMAL_SEARCH && checkStatus !== 'true' && detail.inputValueFrom && detail.inputValueTo) {
						if (Number(detail.inputValueFrom) > Number(detail.inputValueTo)) {
							this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00049'));
							return;
						}
					}

					if (checkStatus === 'true' || (detail.inputValueFrom !== "" && detail.inputValueFrom !== null && detail.inputValueFrom !== undefined)  
							|| (detail.inputValueTo !== "" && detail.inputValueTo !== null && detail.inputValueTo !== undefined)) {
						inputValueFrom = detail.inputValueFrom !== "" && detail.inputValueFrom !== null && detail.inputValueFrom !== undefined ? detail.inputValueFrom : "";
						inputValueTo = detail.inputValueTo !== "" && detail.inputValueTo !== null && detail.inputValueTo !== undefined ? detail.inputValueTo : "";
						attType_RangeNumeric.push(detail.field + "," + inputValueFrom + "," + inputValueTo + "," + checkStatus);
					}
	
				}
			} else if (detail.valTypeId === EIMConstantService.VALUE_TYPE_STRING || detail.valTypeId === EIMConstantService.VALUE_TYPE_TEXT) {
				// 拡張属性（文字列orテキスト）
				if (checkStatus === 'true' || (detail.inputValue !== null && detail.inputValue !== '')) {
					attType_Value.push(detail.field + "," + detail.inputValue + "," + checkStatus);
				}
			}
		}

		detailParams["attType_Value"] = attType_Value;
		detailParams["attType_RangeNumeric"] = attType_RangeNumeric;
		detailParams["attType_RangeDate"] = attType_RangeDate;


		let params: any = {};

		for (let key in this.info.condition) {
			if (key === 'detailConditionList') {
				continue;
			}
			// 全文を含む、過去履歴を含むは検索対象：ドキュメントの場合以外は初期値を設定
			if ((key === 'contents' || key === 'history') && this.info.condition['searchType'] !== 'document') {
				params[key] = 'false';
				continue;
			}
			// 空フォルダのみを検索は検索対象：フォルダの場合以外は初期値を設定
			if (key === 'emptyFolder' && this.info.condition['searchType'] !== 'folder') {
				params[key] = 'false';
				continue;
			}
			// ステータスは検索対象：タグの場合は初期値を設定
			if (key === 'status' && this.info.condition['searchType'] === 'tag') {
				params[key] = 'all';
				continue;
			}

			// 検索対象が全ての場合は、isTrash（ごみ箱の検索かどうかのフラグ）にはfalseを設定
			if (key === 'isTrash' && this.info.condition['pathCondition'] === 'false') {
				params[key] = false;
				continue;
			}

			params[key] = this.info.condition[key];
		}
		for (let key in detailParams) {
			if (detailParams.hasOwnProperty(key)) {
				params[key] = detailParams[key];
			}
		}
		return params;
	}

	/**
	 * 検索ボタン押下時の処理を実施します.
	 * 検索を実行します.
	 * @param f 検索条件フォーム
	 */
	public onSearch(event: any, f: NgForm): void {
		event.preventDefault();
		let params = this.setParams(searchKinds.NORMAL_SEARCH);
		params['displayTypeId'] = EIMConstantService.DISPLAY_LIST;

		if (params) {
			this.contentsSearchComponentService.search(this.info, {mode: this.mode, visibleDocumentLink: this.visibleDocumentLink, params: params});
		}
	}

	/**
	 * 検索ボタン押下可否を返却します.
	 * @param f 検索条件フォーム
	 * @return 実行ボタン押下可否
	 */
	public searchable(f: NgForm): boolean {
		return f.valid;
	}

	/**
	 * 選択ボタン押下時の処理を実施します.
	 */
	public select(): void {
		let contents: any = this.searchResultList.getSelectedData();
		if (contents && contents.length > 0 ) {
			let data = [];
			data.push(contents[0]);
			this.selected.emit(data);
		}
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		let contents: any = this.searchResultList.getSelectedData();
		if (contents && contents.length === 1 ) {
			return true;
		}
	}

	/**
	 * プロパティメニューボタン押下可否を制御します.
	 */
	private canProperty(): void {
		let isDisabled = false;

		if (this.searchResultList) {
			isDisabled = !this.isActiveProperty();
		} else {
			isDisabled = true;
		}

		let menu: EIMMenuItem[] = this.contentsGridMenuItems.filter( (value: EIMMenuItem, index: number) => {
			if (value.name === 'property') { return value; }
		});
		menu[0].disabled = isDisabled;
	}

	/**
	 * プロパティメニューボタン活性判定をします.
	 */
	protected isActiveProperty(): boolean {
		let flag = false;
		let selectedData: any[] = this.searchResultList.getSelectedData();

		// １つ選択、かつドキュメントを選択している場合はプロパティボタンを活性状態にする
		if ((this.searchResultList && selectedData.length === 1 && (selectedData[0].isDocument === true || selectedData[0].isDocumentLink === true))) {
			flag = true;
		}
		return flag;
	}

	/**
	 * CSVダウンロードメニューボタン押下可否を制御します.
	 */
	private canCsvDownload(): void {
		let flag = false;
		if (!this.searchResultList) {
			flag = false;
		}
		if ((this.searchResultList && this.searchResultList.getData().length > 0)) {
			flag = true;
		}

		let menu: EIMMenuItem[] = this.contentsGridMenuItems.filter( (value: EIMMenuItem, index: number) => {
			if (value.name === 'csvDownload') { return value; }
		});
		menu[0].disabled = !flag;
	}

	/**
	 * 検索対象のパスを設定する.
	 * @param searchPath 検索対象パス
	 */
	public setSearchPath(searchPath: string): void {
		this.searchPathChanged.emit(searchPath);
	}

	/**
	 * 検索対象がごみ箱かどうかを設定する.
	 * @param searchPath 検索対象パス
	 */
	public setIsTrashCondition(isTrash: boolean): void {
		this.info.condition.isTrash = isTrash;
	}
	/**
	 * フィルタを実行します.
	 * @param unvisibleData 非表示データ
	 */
	public filter(unvisibleData: any[]): void {
		this.contentsSearchComponentService.filter(this.searchResultList.info, unvisibleData);
	}

	/**
	 * 検索条件のキャッシュをクリアします.
	 */
	public clearSearchCache(): void {
		this.documentsCacheService.clearSearchCacheByMode(this.mode);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * クリアボタン押下時の処理を実施します.
	 * @param event イベント
	 * @param f 検索条件フォーム
	 */
	public onClear(event: any, f: NgForm) {
		event.preventDefault();
		// 検索条件を初期値にクリア
		this.contentsSearchComponentService.clearSearchCondition(this.info.condition);
		// 検索結果をクリア
		this.contentsSearchComponentService.clearSearchResult(this.searchResultList, this.mode);
		// 初期表示処理
    	this.contentsSearchComponentService.initParentObjIdList(this.info, this.mode);
   		this.contentsSearchComponentService.initCommon(this.info, this.mode);
		// グリッドメニューの活性非活性制御
		this.canContentsGridMenu();
	}

	/**
	 * コンテンツグリッド行選択イベントハンドラ
	 * @param event イベント
	 */
	onSelect(event: any): void {
		this.canContentsGridMenu();
		this.selectedData = this.searchResultList.getSelectedData();
	}

	/**
	 * 詳細条件表示ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	onClickDetailCondition(event: any): void {
		this.info.isShowDetailCondition = !this.info.isShowDetailCondition;
		this.documentsCacheService.searchCache[this.mode].searchShowDetailCondition = this.info.isShowDetailCondition;
		this.showDetailConditionPanel();
	}

	/**
	 * テーブル管理メニュークリックイベントハンドラ
	 */
	onClickMenuTableManagement(): void {
		let dialogId: string = this.dialogManagerComponentService.showTableConfig({
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
			},
			closed: () => {
				if (this.contentsTableService.isReservingUpdate) {
					this.contentsTableService.doUpdateTable();
				}
			},
		});
	}

	/**
	 * 検索種別ラジオボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickSearchType(event: any): void {
	}

	/**
	 * グリッド行ダブルクリックイベントハンドラ
	 * @param event イベント
	 */
	public onRowDoubleClicked(event: any): void {
		if (this.disablePropertyFlg && this.disablePropertyFlg === true) {
			return;
		}
		if (this.isActiveProperty()) {
			let contents: any = this.searchResultList.getSelectedData()[0];
			this.showProperty(this.info, contents);
		}
	}

	/**
	 * プロパティボタンクリックイベントハンドラ.
	 */
	public onShowProperty(): void {
		let contents: any = this.searchResultList.getSelectedData()[0];
		this.showProperty(this.info, contents);
	}

	/**
	 * CSVダウンロードボタンクリックイベントハンドラ.
	 */
	public onClickCsvDownload(): void {
		this.contentsSearchComponentService.csvDownload(this.info);
	}

	/**
	 * 検索完了ハンドラ.
	 * @param contentsList 検索結果リスト
	 */
	onSearchCompleted(result: any): void {

		if (result.message == null && result.resultList.length === 0) {
			this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
		}

		// コンテンツグリッドメニューボタン押下可否を制御.
		this.canContentsGridMenu();
	}
	/**
	 * ページ検索完了ハンドラ.
	 * @param result ページ検索結果リスト
	 */
	onPageSearchCompleted(result: any): void {
		if (result.message == null && result.resultList.length === 0) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00029'));
		}
	}

	/**
	 * 閉じるボタンクリックイベントハンドラ.
	 * @param event イベント
	 * @param close クローズイベント
	 */
	public close(event: any, close: EventEmitter<null>): void {
		// グリッド状態を保存
		this.contentsSearchComponentService.saveGridState(this.info, this.mode);
    	// 詳細条件開閉状態を保存
    	this.documentsCacheService.searchCache[this.mode].searchShowDetailCondition = this.info.isShowDetailCondition;
		// 閉じる
		close.emit();
		this.closed.emit();
	}

	/**
	 * グリッド準備完了イベントハンドラ
	 * @param event イベント
	 */
	public onGridReady(event: any): void {
		this.contentsSearchComponentService.restoreGridState(this.info, this.mode);
	}

	/**
	 * データグリッドメニューのページアイコンクリックイベントハンドラ
	 * @param rowData 行データ
	 */
	pageIconClicked(rowData: any): void {
		this.contentsSearchComponentService.pageSearch(this.info, rowData, this.mode);
	}

	/**
	 * フォルダ選択画面表示ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	public onClickShowFolderSelector(event: any): void {
		// フォルダツリーを表示する
		let dialogId: string = this.dialogManagerComponentService.showFolderTreeSelector(
			{selectPath: this.info.condition.searchPath},
			EIMDocumentsConstantService.FOLDER_DOCUMENT,
			{
				selected: (node: EIMFolderTreeNode ) => {
					this.dialogManagerComponentService.close(dialogId);
					this.info.condition.searchPath = this.getSearchPath(node);
					// ごみ箱、または、ワークスペースごみ箱が選択されたかどうか
					this.info.condition.isTrash = node.isTrash ? true : false;
				}
		});
	}

	/**
	 * グリッド内名前選択イベントハンドラ.
	 * @param treeNode 選択ツリーノード
	 */
	public onNodeSelectEmit(event: any): void {
		// グリッド状態を保存
		this.contentsSearchComponentService.saveGridState(this.info, this.mode);
		// 名前選択イベントエミッタをエミット
		this.onNodeSelect.emit(event);
		// 検索画面を閉じる
		this.dialogManagerComponentService.close('SEARCH');
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 検索パス取得
	 * @param node ツリーノード
	 * @return 検索パス
	 */
	private getSearchPath(node: EIMTreeNode): string {
		if ( node.parent ) {
			return this.getSearchPath( node.parent ) + node.data.objName + '/';
		}
		return '/' + node.data.objName + '/';
	}

	/**
	 * テーブル処理完了ハンドラ
	 * @event イベント
	 */
	private onTableProcessingCompleted(event: any): void {
		// テーブルメニューを設定
		this.contentsSearchComponentService.setTableMenu(this.info, event.menuItems, this.mode);
		// テーブルカラムを設定
		this.contentsSearchComponentService.setTableColumn(this.info, this.contentsTableService.selectedTable, event.columns, this.mode);
		// 検索条件を設定
		this.contentsSearchComponentService.setDetailCondition(this.info, this.contentsTableService.selectedTable, this.mode);
		// 選択テーブルを設定
		this.info.selectedTable = this.contentsTableService.selectedTable;
		this.documentsCacheService.searchCache[this.mode].searchSelectedTable = this.contentsTableService.selectedTable;
	}

	/**
	 * 詳細条件パネル表示/非表示処理
	 */
	private showDetailConditionPanel(): void {
		// スプリットバー位置初期設定
		if (this.info.isShowDetailCondition) {
			this.detailConditionButtonLabel = this.translateService.instant('EIM_DOCUMENTS.LABEL_03012');
			this.splitAreaFirstSize = EIMContentsSearchComponent.detailConditionOpenHeight / this.elmRef.nativeElement.children[0].offsetHeight * 100;

		} else {
			this.detailConditionButtonLabel = this.translateService.instant('EIM_DOCUMENTS.LABEL_03011');
			this.splitAreaFirstSize = EIMContentsSearchComponent.detailConditionCloseHeight / this.elmRef.nativeElement.children[0].offsetHeight * 100;
		}

	}

	/**
	 * 最大入力可能文字数を取得する.
	 * @param valTypeId 型タイプID
	 * @return 最大入力可能文字数
	 */
	private getMaxLength(valTypeId: number): number {
		let maxLength = 0;
		if (valTypeId === EIMConstantService.VALUE_TYPE_INTEGER) {
			maxLength = EIMConstantService.NUMBER_MAX_LENGTH;
		} else if (valTypeId === EIMConstantService.VALUE_TYPE_DOUBLE) {
			maxLength = EIMConstantService.REAL_NUMBER_MAX_LENGTH;
		} else if (valTypeId === EIMConstantService.VALUE_TYPE_STRING) {
			maxLength = EIMConstantService.STRING_MAX_LENGTH;
		} else if (valTypeId === EIMConstantService.VALUE_TYPE_TEXT) {
			maxLength = EIMConstantService.TEXT_MAX_LENGTH;
		}
		return maxLength;
	}


	/**
	 * プロパティ画面を表示します.
	 * @param info コンテンツ検索コンポーネント情報
	 * @param contents 選択行情報
	 */
	private showProperty(info: EIMContentsSearchComponentInfo, contents: any): void {

		// 過去版の場合、読み取り専用でプロパティ画面を開く
		let readOnly: boolean = contents.isLatest === this.FLAG_TRUE ? false : true;

		let dialogId: string = this.dialogManagerComponentService.showProperty(contents, readOnly,
				{
					updated: (data) => {

						this.dialogManagerComponentService.close(dialogId);
						// プロパティ取得
						this.documentFormService.getObjectProperty(data[0].objId)
						.subscribe(
								(object: any[]) => {
									// 検索結果とdspPropertyの結果ではレスポンスデータが異なるので、
									// 属性のみ画面に反映させる
									this.contentsSearchComponentService.setUpdateDataToResultData(contents, object, data[0].attributeList);
									// グリッドに設定する
									info.searchResultList.updateRowData([contents]);
								}
						);
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});

	}
}
