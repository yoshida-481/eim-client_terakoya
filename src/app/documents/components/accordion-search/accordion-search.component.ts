import { Component, forwardRef, EventEmitter, ViewChild, Input, Output, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';

import { SelectItem } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMFolderService } from 'app/documents/shared/services/apis/folder.service';
import { EIMTableService } from 'app/documents/shared/services/apis/table.service';


import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAccordionSearchComponentService, EIMAccordionSearchComponentInfo, EIMTagetObject } from 'app/documents/components/accordion-search/accordion-search.component.service';

import { EIMDateService } from 'app/shared/services/date.service';

// レンダラー
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMStatusRendererComponentService } from 'app/documents/shared/components/renderer/status-renderer.component.service';
import { EIMPageRendererComponentService } from 'app/documents/shared/components/renderer/page-renderer.component.service';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';

import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';

import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {ToggleButtonModule} from 'primeng/togglebutton';

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

export interface customAttribute {
	attType?: string,
	attName?: string,
	dataType?: string,
}

/**
 * 検索コンポーネント
 * @example
 *
 *      <eim-accordion-search
 * 			</eim-accordion-search>
 */
 @Component({
    selector: 'eim-accordion-search',
    templateUrl: './accordion-search.component.html',
    styleUrls: ['./accordion-search.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMAccordionSearchComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMAccordionSearchComponent) },
        EIMAccordionSearchComponentService, AutoCompleteModule, ToggleButtonModule],
    standalone: false
})
export class EIMAccordionSearchComponent extends EIMSingleSelectorComponent implements OnInit, AfterViewInit, OnDestroy, EIMComponent, AutoCompleteModule,ToggleButtonModule {

    text: string;

    keyWordSuggestions: string[];

	/** 初期表示パス */
	public static initPath = '/';

	/** 詳細表示 表示時の高さ */
	private static detailConditionOpenHeight = 300;

	/** 詳細表示 非表示時の高さ */
	private static detailConditionCloseHeight = 186;

	/** コンポーネント情報 */
	public info: EIMAccordionSearchComponentInfo = {};

	/** ツリーコンポーネント */
	@ViewChild('tree', { static: true })
	tree: EIMTreeComponent;

	/** ツリーコンポーネント */
	@ViewChild('checkTree', { static: true })
	checkTree: EIMTreeComponent;

	/** 検索対象選択ボタン表示フラグ */
	public visibleSelect = false;

	/** 親オブジェクトID */
	@Input() parentObjId: number;

	/** 検索パス */
	public searchPath: string;

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

	/** 場所アクセスイベントエミッタ */
	@Output() contentsAccess: EventEmitter<any> = new EventEmitter<any>();

	/** 検索実行エミッタ */
	@Output() searchOnClicked: EventEmitter<any>;

	/** クリア実行エミッタ */
	@Output() clearOnClicked: EventEmitter<any>;

	/** CSVダウンロードエミッタ */
	@Output() exportCsvOnClicked: EventEmitter<any>;

	/** 表示モード切替エミッタ */
	@Output() switchTextExcerptMode: EventEmitter<any>;

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

	// /** 日付フォーマット */
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
	private mode = EIMAccordionSearchComponentService.MODE_ACCORDION_SEARCH;

	/** テーブルロードサブスクリプション */
	private contentsTableServiceLoadCompleted: Subscription;

	/** テーブル選択サブスクリプション */
	private contentsTableServiceSelectTableCompleted: Subscription;

	/** テーブル更新サブスクリプション */
	private contentsTableServiceUpdateTableCompleted: Subscription;

	public disabled = false;

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	
	//
	// メニュー
	//
	/** メニュー */
	public tableMenuItems: EIMMenuItem[] = [];

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

	/** CSVダウンロード活性フラグ */
	public disabledCsvDownloadFlg = true;

	/** ファセット表示フラグ */
	public facetDispFlg = false;

	/** ファセット更新フラグ */
	public facetUpdateFlg = true;

	/** データクリアフラグ */
	public dataClearFlg = false;

	/** ファセット選択状態の初期化判定用 */
	public selectedTree : string;

	/** テーブルカラム格納用 */
	public customAttributeItems :any[] = new Array();

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
		public accordionSearchComponentService: EIMAccordionSearchComponentService,
		public treeComponentService: EIMTreeComponentService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected documentFormService: EIMDocumentFormService,
		protected folderService: EIMFolderService,
		protected tableService: EIMTableService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected serverConfigService: EIMServerConfigService,
		protected contentsTableService: EIMContentsTableService,
		protected messageService: EIMMessageService,
		protected documentFileService: EIMDocumentFileService,
		protected elmRef: ElementRef,
		private documentSessionStorageService: EIMDocumentSessionStorageService,
		) {
		super();
		this.info.selectedTable = null;
		this.info.tableMenuItems = this.tableMenuItems;
		this.info.menuTableConfig = this.menuTableConfig;
		this.info.menuTableSelector = this.menuTableSelector;
		this.info.isShowDetailCondition = false;
	
		this.searchOnClicked = new EventEmitter<any>();
		this.clearOnClicked = new EventEmitter<any>();
		this.exportCsvOnClicked = new EventEmitter<any>();
		this.switchTextExcerptMode = new EventEmitter<any>();

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
				status: 'all',
				/** 選択しているテーブルID */
				tableId: 'default',
				/** 部分一致検索かどうか */
				chkDetailLikeSearch: this.serverConfigService.searchDetailLikeCondition,
				/** 詳細条件 */
				detailConditionList: [],
		};
	
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
			// ファセット更新用のフラグ設定
			if (this.facetDispFlg === true && this.documentSessionStorageService.getContentsSelectDispFlg() !== true) {
				this.facetUpdateFlg = true;
				this.onSearch();
			}
			
		});

		/**
		 * テーブル更新完了イベントハンドラ
		 */
		this.contentsTableServiceUpdateTableCompleted =
		this.contentsTableService.updateTableCompleted.subscribe( (event: any) => {
			this.onTableProcessingCompleted(event);
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
	 * ファセット選択
	 * @param event
	 */
	 onSelectTreeNode(event: any) {
		// ファセット選択状態の初期化判定用
		this.selectedTree = EIMConstantService.FACET_TYPE_VALUE + EIMConstantService.FACET_TYPE_RANGE_NUMERIC;
		// ファセット表示フラグ設定
		this.facetDispFlg = true;
		// ファセット更新用のフラグ設定
		this.facetUpdateFlg = false;
		//データクリア用のフラグ設定
		this.dataClearFlg = true;
		this.onSearch();
	}
	/**
	 * チェックツリーファセット選択
	 * @param event
	 */
	 onSelectCheckTreeNode(event: any) {
		// ファセット選択状態の初期化判定用
		this.selectedTree = EIMConstantService.FACET_TYPE_RANGE_DATE;
		// ファセット表示フラグ設定
		this.facetDispFlg = true;
		// ファセット更新用のフラグ設定
		this.facetUpdateFlg = false;
		//データクリア用のフラグ設定
		this.dataClearFlg = true;

		// 選択したイベントノードの検索エンジンフィールド名を取得
		let fieldData = event.selectedData[0].data.split(',')[0];
		// checkTreeの中からチェックされているノードを取得（複数ファセット混在）
		let selectedData:any = this.checkTree.getSelectedData()[0];

		// 選択したファセットチェックツリー以外のチェックを外す
		for(let i=0; i<selectedData.length; i++){
			// 既に選択済みの他チェックファセットのフィールド名を取得し、選択したフィールド名以外のものは削除する
			if (selectedData[i].selectable) {
				let selectedFieldData = selectedData[i].data.split(',')[0];
				if (selectedFieldData !== fieldData) {
					// spliceできるように加工
					let array:any = Array.from(this.checkTree.info.selectedData)[0];
					array.splice(i,1);
					// 削除されたためインデックスをデクリメントする
					i--;
				}
			}
		}
		this.onSearch();
	}

	/** 表示タイプ切替から再検索 */
	onClickSearchAtSnippetBtn(){
		// ファセット更新用のフラグ設定
		this.facetUpdateFlg = false;
		this.facetDispFlg = true;
		this.dataClearFlg = false;
		this.onSearch();
	}

	/**
	 * 検索ボタン押下
	 * @param event 
	 */
	 onClickSearchBtn(event: any) {
		// ファセット更新用のフラグ設定
		this.facetUpdateFlg = true;
		this.facetDispFlg = true;
		this.dataClearFlg = true;
		this.selectedTree = null;
		this.onSearch();
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
	 * 入力値初期化後イベントハンドラ.
	 */
	public ngOnInit(): void {
	
		this.visibleSelect = true;
		this.mode = EIMAccordionSearchComponentService.MODE_ACCORDION_SEARCH;

		this.info.contentsAccess = this.contentsAccess;
		if (!this.searchPath) {
			this.searchPath = EIMAccordionSearchComponent.initPath;
		}
		this.info.condition.searchPath = this.searchPath;

		if (!this.searchPath || this.searchPath === '/') {
			this.info.condition.pathCondition = this.FLAG_FALSE;
		}
		this.info.parentObjId = this.parentObjId;

		if (!this.documentsCacheService.searchCache[this.mode].searchOnceDisplayedContentsSearch) {
			// 表示処理
			this.documentsCacheService.searchCache[this.mode].searchOnceDisplayedContentsSearch = true;
		} else {
			// 再表示処理
			this.accordionSearchComponentService.redisplay(this.info, this.mode);
		}

		// 検索対象パス設定ハンドラ
		this.searchPathChanged.subscribe( (searchPath: string) => {
			this.info.condition.searchPath = searchPath;
		});
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

	//全文含むチェック
	public onContentsClicked(event: any): void{
		if (event.checked && this.serverConfigService.searchContentsFlg === true){
			this.switchTextExcerptMode.emit();
		}
	}

	/**
	 * 検索ボタン押下時の処理を実施します.
	 * 検索を実行します.
	 * @param f 検索条件フォーム
	 */
	public onSearch(): void {
	
		let params;

		if (this.facetUpdateFlg === true) {
			// 検索パラメータを設定
			params = this.setParams(searchKinds.NORMAL_SEARCH);
			if (!params) {
				// エラー時
				this.facetDispFlg = false;
				return;
			}
			// セッションストレージに検索時の条件をセットしておく
			// 用途1：accordion-search-rendererでページ検索時に使用
			// 用途2：ファセットでの検索時には、検索条件が書き換えられても問題ないように検索時に保持しておいた検索条件を使用する
			this.documentSessionStorageService.setSearchCondition(params);
			// コンテンツ選択時にもキーワードが保持されているので、page-rendererでの処理の都合上nullにする
			this.documentSessionStorageService.setSearchKeyword(null);
		} else {
			params = this.documentSessionStorageService.getSearchCondition();
			// 選択したファセットを検索パラメータに加える
			// 文字列ファセット
			let facet_Value :string[] = new Array();
			// 数値ファセット
			let facet_RangeNumeric :string[] = new Array();
			// 日付ファセット
			let facet_RangeDate :string[] = new Array();
			// facetUpdateFlgがfalse ＝ ファセット選択時の検索　の場合のみ条件に加える
			if (this.selectedTree !== EIMConstantService.FACET_TYPE_RANGE_DATE) { 
				// 文字列ファセットまたは数値ファセットの場合
				for (let i=0; i< this.tree.getSelectedData().length; i++){
					switch (this.tree.getSelectedData()[i].type) {
						case EIMConstantService.FACET_TYPE_VALUE:
							facet_Value.push(this.tree.getSelectedData()[i].data)
							break;
						case EIMConstantService.FACET_TYPE_RANGE_NUMERIC:
							facet_RangeNumeric.push(this.tree.getSelectedData()[i].data)
							break;
					}
				}
			} else if (this.selectedTree === EIMConstantService.FACET_TYPE_RANGE_DATE) { 
				// 日付ファセットの場合
				for (let i=0; i< this.checkTree.getSelectedData()[0].length; i++){
					switch (this.checkTree.getSelectedData()[0][i].type) {
						case EIMConstantService.FACET_TYPE_RANGE_DATE:
							facet_RangeDate.push(this.checkTree.getSelectedData()[0][i].data)
							break;
					}
				}
			}
			params['displayTypeId'] = this.documentSessionStorageService.getSearchDisplayType();
			params['facet_Value'] = facet_Value;
			params['facet_RangeNumeric'] = facet_RangeNumeric;
			params['facet_RangeDate'] = facet_RangeDate.filter(function(x, i, self) {return self.indexOf(x) === i;});
		}
		// 検索実行エミット
		this.searchOnClicked.emit({params: params});
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
	 * 検索対象のパスを設定する.
	 * @param searchPath 検索対象パス
	 */
	public setSearchPath(searchPath: string): void {
		this.searchPathChanged.emit(searchPath);
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
	public onClear(event: any) {
		event.preventDefault();
		// 検索条件を初期値にクリア
		this.accordionSearchComponentService.clearSearchCondition(this.info.condition);
		this.disabledCsvDownloadFlg = true;
		this.facetDispFlg = false;
		this.clearOnClicked.emit();
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
	 * CSVダウンロードボタンクリックイベントハンドラ.
	 */
	public onClickCsvDownload(): void {
		let fileName: string = this.serverConfigService.csvAccordionSearchFileHeader
		+ this.dateService.getFixedCurrentDateTimeString()
		+ EIMDocumentsConstantService.CSV_EXTENSION;
		this.exportCsvOnClicked.emit({fileName: fileName});	
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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	private setParams(searchKind: any): any {
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

			if (detail.field === 'createUserName' || detail.field === 'modifyUserName' || detail.field === 'searchIndex' || detail.field === 'property' || detail.field === 'number') {
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

		// 選択されている本文抜粋／リスト切替表示タイプのID
		if (searchKind === searchKinds.NORMAL_SEARCH) {
			let displayTypeId = this.documentSessionStorageService.getSearchDisplayType();
			params['displayTypeId'] = displayTypeId;
		}

		return params;
	}

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
		this.accordionSearchComponentService.setTableMenu(this.info, event.menuItems, this.mode);
		// 検索条件を設定
		this.accordionSearchComponentService.setDetailCondition(this.info, this.contentsTableService.selectedTable, this.mode);
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
			this.splitAreaFirstSize = EIMAccordionSearchComponent.detailConditionOpenHeight / this.elmRef.nativeElement.children[0].offsetHeight * 100;

		} else {
			this.detailConditionButtonLabel = this.translateService.instant('EIM_DOCUMENTS.LABEL_03011');
			this.splitAreaFirstSize = EIMAccordionSearchComponent.detailConditionCloseHeight / this.elmRef.nativeElement.children[0].offsetHeight * 100;
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

}

