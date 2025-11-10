import { EIMDataGridSingleSelectorComponentInfo, EIMDataGridSingleSelectorComponentService } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';
import { of, Observable ,  Subscription } from 'rxjs';

import { EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { TranslateService } from '@ngx-translate/core';

import { EIMDateService } from 'app/shared/services/date.service';

import { EIMDialogManagerComponentService, dialogName } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMDocumentsCacheService, EIMSearchCache } from 'app/documents/shared/services/documents-cache.service';
import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
// レンダラー
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMPublicFileRendererComponent } from 'app/documents/shared/components/renderer/public-file-renderer.component';
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMStatusRendererComponent } from 'app/documents/shared/components/renderer/status-renderer.component';
import { EIMStatusRendererComponentService } from 'app/documents/shared/components/renderer/status-renderer.component.service';
import { EIMPageRendererComponent } from 'app/documents/shared/components/renderer/page-renderer.component';
import { EIMPageRendererComponentService } from 'app/documents/shared/components/renderer/page-renderer.component.service';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMAttributeRendererComponent } from 'app/documents/shared/components/renderer/attribute-renderer.component';
import { EIMAttributeRendererComponentService } from 'app/documents/shared/components/renderer/attribute-renderer.component.service';
import { EIMSignEncryptionRendererComponent } from 'app/documents/shared/components/renderer/sign-encription-cell-renderer.component';

// API
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMFolderService, EIMFolder, EIMFolderType } from 'app/documents/shared/services/apis/folder.service';
import { EIMTableService, EIMTable, EIMHierarchicalTable, EIMTableItem } from 'app/documents/shared/services/apis/table.service';
import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';

/**
 * コンポーネント情報
 */
export interface EIMContentsSearchComponentInfo extends EIMDataGridSingleSelectorComponentInfo {
	// 詳細条件開閉状態
	isShowDetailCondition?: boolean;
	// 検索結果グリッド
	searchResultList?: EIMDataGridComponent;
	// 選択テーブル
	selectedTable?: EIMTable;
	// 検索条件
	condition?: any;
	// コンテンツアクセスイベントエミッタ
	contentsAccess?: EventEmitter<any>;
	// メニュー
	tableMenuItems?: EIMMenuItem[];
	menuTableConfig?: EIMMenuItem;
	menuTableSelector?: EIMMenuItem;
	// 検索完了
	searchCompleted?: EventEmitter<any>;
	// ページ検索完了
	pageSearchCompleted?: EventEmitter<any>;
	// 場所クリックイベントサブスクリプション
	placeRendererComponentServicePlaceClicked?: Subscription;
	// 親オブジェクトID
	parentObjId?: number | number[];

	// 検索結果の場所のリンク表示を抑制
	suppressPlaceLink?: boolean;
}

/**
 * 詳細条件
 */
export interface EIMContentsSearchDetailCondition {
	field?: string,
	checkField?: string,
	checkStatus?: boolean,
	fieldFrom?: string,
	fieldTo?: string,
	multiple?: boolean,
	label?: string,
	valTypeId?: number,
	inputRule?: boolean,
	inputValue?: string,
	inputValueFrom?: string,
	inputValueTo?: string,
	id?: number,
	isSystem?: boolean,
	inputRuleValueList?: any[];
}

/**
 * 詳細条件
 */
export interface EIMTagetObject {
	document?: boolean,
	folder?: boolean,
	tag?: boolean;
}



/**
 * コンテンツ検索コンポーネントサービス.
 */
@Injectable()
export class EIMContentsSearchComponentService extends EIMDataGridSingleSelectorComponentService {

	public static MODE_NORMAL = 0;
	public static MODE_CONTENTS_SELECTOR = 1;
	/**
	 * コンストラクタです.
	 */
	constructor(
			protected serverConfigService: EIMServerConfigService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected dateService: EIMDateService,
			protected documentFormService: EIMDocumentFormService,
			protected documentsCacheService: EIMDocumentsCacheService,
			protected folderService: EIMFolderService,
			protected tableService: EIMTableService,
			protected translateService: TranslateService,
			protected placeRendererComponentService: EIMPlaceRendererComponentService,
			protected statusRendererComponentService: EIMStatusRendererComponentService,
			protected pageRendererComponentService: EIMPageRendererComponentService,
			protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
			protected publicFileRendererComponentService: EIMPublicFileRendererComponentService,
			protected historyRendererComponentService: EIMHistoryRendererComponentService,
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			protected attributeRendererComponentService: EIMAttributeRendererComponentService,
			protected contentsTableService: EIMContentsTableService,
			protected messageService: EIMMessageService,
			protected documentFileService: EIMDocumentFileService,
			protected documentSessionStorageService: EIMDocumentSessionStorageService,

	) {
		super(translateService);
	}
	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期表示処理をします.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public init(info: EIMContentsSearchComponentInfo, mode: number): void {
		this.contentsTableService.initialize();
		this.initParentObjIdList(info, mode);
		this.initCommon(info, mode);
	}

	/**
	 * 画面を再表示します.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public redisplay(info: EIMContentsSearchComponentInfo, mode: number): void {
		// 詳細条件開閉状態
		info.isShowDetailCondition = this.documentsCacheService.searchCache[mode].searchShowDetailCondition;
		// 選択テーブル
		info.selectedTable = this.documentsCacheService.searchCache[mode].searchSelectedTable;
		// 検索条件
		info.condition = this.documentsCacheService.searchCache[mode].searchCondition;
		// テーブルメニュー
		info.tableMenuItems.splice(0, info.tableMenuItems.length);
		Array.prototype.push.apply(info.tableMenuItems, this.documentsCacheService.searchCache[mode].searchMenuItems);
		// テーブルカラム
		info.searchResultList.setColumns(this.documentsCacheService.searchCache[mode].searchColumns);
		// 検索結果
		info.searchResultList.setData(this.documentsCacheService.searchCache[mode].searchResult);
		// 親オブジェクトID
		info.parentObjId = this.documentsCacheService.searchCache[mode].parentObjIdList;

		// 初期表示共通処理
		this.initCommon(info, mode);
	}

	/**
	 * 検索条件をクリアして初期状態に戻します.
	 * @param condition 検索条件
	 */
	public clearSearchCondition(condition: any): void {
		condition.searchType = 'document';
		condition.pathCondition = 'true';
		// 部分一致
		condition.chkDetailLikeSearch = this.serverConfigService.searchDetailLikeCondition;
		// 検索対象のパスは対象外
		condition.keyword = '';
		condition.contents = false;
		condition.history = false;
		condition.emptyFolder = false;
		condition.status = 'all';
		// 選択しているテーブルIDは対象外
		// 詳細条件
		condition.detailConditionList.forEach( (data) => {
      		data.checkStatus = null;
			data.inputValue = null;
			data.inputValueFrom = null;
			data.inputValueTo = null;
		});
	}

	/**
	 * 検索結果をクリアします.
	 * @param searchResultList 検索結果グリッド
	 */
	public clearSearchResult(searchResultList: EIMDataGridComponent, mode: number): void {
		searchResultList.setData([]);
		// キャッシュの検索結果をクリア
		this.documentsCacheService.searchCache[mode].searchResult = null;
		// グリッド状態をクリア
		this.clearGridState(mode);
	}

	/**
	 * 検索を実行します.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public search(info: EIMContentsSearchComponentInfo, condition: any): void {

		let mode = condition.mode;

		// セッションストレージにページ検索用のキーワードをセットしておく
		this.documentSessionStorageService.setSearchKeyword(info.condition.keyword);

		// 検索
		let result: any;
		this.documentFormService.search(condition.params).
		pipe(finalize( () => {
			let tmpResultList = result.resultList.concat();
			let spliceCount = 0;

			for (let i = 0; i < tmpResultList.length; i++) {

				// 関連元文書非表示処理
				if (info.parentObjId) {
					const objId = Number(tmpResultList[i].objId);
					if (typeof info.parentObjId === 'number') {
						if (objId === info.parentObjId) {
							result.resultList.splice(i - spliceCount, 1);
							spliceCount++;
							continue;
						}
					} else {
						if (info.parentObjId.indexOf(objId) !== -1) {
							result.resultList.splice(i - spliceCount, 1);
							spliceCount++;
							continue;
						}
					}
				}

				// ドキュメントリンク非表示処理
				if (!condition.visibleDocumentLink
					&& (tmpResultList[i].isDocumentLink === true || tmpResultList[i].isDocumentLink === 'true')) {
					result.resultList.splice(i - spliceCount, 1);
					spliceCount++;
					continue;
				}

				// 履歴の場合、'-'を''に置換する。数値型にキャストする。
				if (tmpResultList[i].rev === '-') {
					result.resultList[i - spliceCount].rev = null;
				} else {
					result.resultList[i - spliceCount].rev = Number(result.resultList[i - spliceCount].rev);
				}

				tmpResultList[i].mode = mode;
			}

			for (let i=0; i<result.resultList.length; i++) {
				for (let prop in result.resultList[i].attr){
					if (prop.indexOf('multivalue') > -1) {
						let item = info.searchResultList.getColumns().find(el => el.field === prop);
						if (item.type === 2) {
							for (let j=0; j<result.resultList[i].attr[prop].length; j++ ) {
								// Date型の複数値について、ミリ秒から日付フォーマットに変換する
								result.resultList[i].attr[prop][j] = this.dateService.getDateTimeString(result.resultList[i].attr[prop][j]).replace(" 00:00:00","");
							}
						}
					}
				}

				if (result.resultList[i].attr !== null) {
					// 返却値attr（拡張属性）をsetData用に連想配列に設定する
					Object.keys(result.resultList[i].attr).forEach( function(value) {
						result.resultList[i][value] = this[value];
					}, result.resultList[i].attr)
				}
			}

			// 一覧表示内容変更
			info.searchResultList.setData(result.resultList);

			// キャッシュサービスに検索結果を保持
			let normal = this.documentsCacheService.searchCache[mode].searchResult;
			let selector = this.documentsCacheService.searchCache[mode].searchResult;
			this.documentsCacheService.searchCache[mode].searchResult = result.resultList;
			// 検索完了コールバック
			info.searchCompleted.emit(result);
		})).
		subscribe( (resultList: any) => {
			// resultList[0]・・・グリッド表示用データリスト
			// resultList[2]・・・ヒット件数（numFounds）
			// データが取得できなかった場合エラー
			if (resultList[0].length === 0) {
				this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM_DOCUMENTS.ERROR_00046'));
				info.searchResultList.setData([]);
				return;
			} else if (resultList[0].length !== resultList[2]) {
				// 結果データの件数とヒット件数に差異があった場合にメッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00045', {value: resultList[0].length,value2: resultList[2]}));
			}

			result = {resultList: resultList[0], message: null};
		}, (err: any) => {
			result = {resultList: [], message: err.message};
		});
	}

	/**
	 * ページ検索を実行します.
	 * @param info コンテンツ検索コンポーネント情報
	 * @param rowData 行データ
	 */
	public pageSearch(info: EIMContentsSearchComponentInfo, rowData: any, mode: number): void {

		// サーバ送信用のリクエストパラメータを作成
		// keyword
		// objctId
		let params: {key?: String} = {};
		params['keyword'] = this.documentSessionStorageService.getSearchCondition().keyword;
		params['objId'] = rowData.objId;
		let parentIdx: any;
		let parentRow: any;
		// 親要素取得
		for (let i = 0; i < this.documentsCacheService.searchCache[mode].searchResult.length; i++) {
			if (this.isSameDocOrLink(this.documentsCacheService.searchCache[mode].searchResult[i], rowData)) {
				parentIdx = i;
				parentRow = this.documentsCacheService.searchCache[mode].searchResult[i];
				break;
			}
		}

		let childRows: any[] = [];

		// 既にページ表示している場合
		if (parentRow.dspChild && parentRow.dspChild === true) {
			// ページレコードを削除
			let removeIdx: any = [];
			for (let i = 0; i < this.documentsCacheService.searchCache[mode].searchResult.length; i++) {
				if (this.isSameDocOrLink(this.documentsCacheService.searchCache[mode].searchResult[i], rowData)
					&& !this.documentsCacheService.searchCache[mode].searchResult[i].dspChild) {
						removeIdx.push(i);
						childRows.push(this.documentsCacheService.searchCache[mode].searchResult[i]);
				}
			}
			parentRow.dspChild = false;
			// 一覧表示内容変更
			info.searchResultList.removeRowData(childRows);
			info.searchResultList.refreshView();
			// キャッシュサービスに検索結果を保持
			this.documentsCacheService.searchCache[mode].searchResult = info.searchResultList.getData();
		} else {

			let result: any;

			// 検索
			this.documentFormService.pageSearch(params).
				pipe(finalize( () => {

					if (result.resultList.length === 0) {
						// 検索完了コールバック
						info.pageSearchCompleted.emit(result);
						return;
					}

					// ページ行作成
					for (let i = 0; i < result.resultList.length; i++) {

						childRows.push(JSON.parse(JSON.stringify(parentRow)));
						childRows[i].pageNumber = result.resultList[i].number;
						childRows[i].filepath = result.resultList[i].filepath;
						childRows[i].isDspPageIcon = 'false';

					}
					parentRow.dspChild = true;
					// 一覧表示内容変更
					info.searchResultList.addRowDataToIndex(childRows, parentIdx + 1);
					info.searchResultList.refreshView();
					// キャッシュ更新
					this.documentsCacheService.searchCache[mode].searchResult = info.searchResultList.getData();

				})).
				subscribe( (resultList: any) => {
						result = {resultList: resultList, message: null};
					}, (err: any) => {
						result = {resultList: [], message: err.message};
				});
		}
	}

	/**
	 * CSVダウンロードをします.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public csvDownload(info: EIMContentsSearchComponentInfo): void {
		let fileName: string = this.serverConfigService.csvFileHeader
				+ this.dateService.getFixedCurrentDateTimeString()
				+ EIMDocumentsConstantService.CSV_EXTENSION;
		let csv: string = info.searchResultList.getDataAsCsv();
		this.documentFileService.downloadCSV(EIMDocumentsConstantService.OPE_HIST_APP_ID, fileName, csv);
	}

	/**
	 * 詳細条件を設定します.
	 * @param info コンテンツ検索コンポーネント情報
	 * @param table テーブル
	 */
	public setDetailCondition(info: EIMContentsSearchComponentInfo, table: EIMTable, mode: number): void {

		info.condition.detailConditionList = [];

		if (this.serverConfigService.enableAutomaticNumbering) {
			info.condition.detailConditionList.push({field: 'number', label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02098'), multiple: false, valTypeId: EIMConstantService.VALUE_TYPE_STRING, inputRule: false, inputValue: null, isSystem: true});
		}
		if (table.tableId == null && table.tableDefName == null) {
			// デフォルト選択時
			info.condition.detailConditionList.push({field: 'modifyUserName', label: this.translateService.instant('EIM.LABEL_02032'), multiple: false, valTypeId: EIMConstantService.VALUE_TYPE_STRING, inputRule: false, inputValue: null, isSystem: true});
			info.condition.detailConditionList.push({field: 'modifyDate', fieldFrom:  'modifyDateFrom', fieldTo:  'modifyDateTo', label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02042'), multiple: false, valTypeId: EIMConstantService.VALUE_TYPE_DATE, inputRule: false, inputValue: null, isSystem: true});
			info.condition.detailConditionList.push({field: 'property', checkField: 'opeProperty', checkStatus: false, label: this.translateService.instant('EIM_DOCUMENTS.LABEL_02086'), multiple: false, valTypeId: EIMConstantService.VALUE_TYPE_STRING, inputRule: false, inputValue: null, isSystem: true});
			info.condition.tableId = 'default';
			info.condition.tableDefName = null;
		} else {
			// デフォルト以外選択時
			table.tableItemList.forEach( (data: any) => {
				if (data.attTypeDefName === 'サイズ') {
					return;
				}

				let condition: EIMContentsSearchDetailCondition = {
						field: data.attTypeId,
						checkField: 'opeAttType_' + data.attTypeId,
						checkStatus: false,
						label: data.attTypeName,
						multiple: data.attIsMultiple,
						valTypeId: Number(data.attValTypeId),
						inputRule: data.inputRule,
						inputRuleValueList: data.inputRuleValueList,
						inputValue: null,
						id: data.attTypeId,
						isSystem: false,
					};

				if (data.attTypeDefName === 'サイズ') {
					condition.field = 'fileSize';
					condition.fieldFrom = condition.field + '_From';
					condition.fieldTo = condition.field + '_To';
					condition.valTypeId = EIMConstantService.VALUE_TYPE_INTEGER;
					condition.isSystem = true;
				} else if (data.attTypeDefName === '有効期限') {
					condition.field = 'effectiveTerm';
					condition.fieldFrom = 'effectiveTermFrom';
					condition.fieldTo = 'effectiveTermTo';
					condition.valTypeId = EIMConstantService.VALUE_TYPE_DATE;
					condition.isSystem = true;
				} else if (data.attTypeDefName === '作成者') {
					condition.field = 'createUserName';
					condition.valTypeId = EIMConstantService.VALUE_TYPE_STRING;
					condition.isSystem = true;
				} else if (data.attTypeDefName === '更新者') {
					condition.field = 'modifyUserName';
					condition.valTypeId = EIMConstantService.VALUE_TYPE_STRING;
					condition.isSystem = true;
				} else if (data.attTypeDefName === '作成日') {
					condition.field = 'createDate';
					condition.fieldFrom = 'createDateFrom';
					condition.fieldTo = 'createDateTo';
					condition.valTypeId = EIMConstantService.VALUE_TYPE_DATE;
					condition.isSystem = true;
				} else if (data.attTypeDefName === '更新日') {
					condition.field = 'modifyDate';
					condition.fieldFrom = 'modifyDateFrom';
					condition.fieldTo = 'modifyDateTo';
					condition.valTypeId = EIMConstantService.VALUE_TYPE_DATE;
					condition.isSystem = true;
				} else if (data.attTypeDefName === '文書ID') {
					condition.field = 'searchIndex';
					condition.valTypeId = EIMConstantService.VALUE_TYPE_STRING;
					condition.isSystem = true;
				} else if (condition.valTypeId === EIMConstantService.VALUE_TYPE_INTEGER || condition.valTypeId === EIMConstantService.VALUE_TYPE_DATE || condition.valTypeId === EIMConstantService.VALUE_TYPE_DOUBLE) {
					condition.field = condition.field;
					condition.fieldFrom = condition.field + '_From';
					condition.fieldTo = condition.field + '_To';
				}
				// NULLとなることがない属性については値なしチェックボックスを表示しないように制御する
				if (data.notNull === true){
					condition.checkField = null;
				}

				info.condition.detailConditionList.push(condition);
			});

			if (table.tableId) {
				info.condition.tableId = table.tableId;
				info.condition.tableDefName = null;
			} else {
				info.condition.tableId = null;
				info.condition.tableDefName = table.tableDefName;
			}
		}

		this.documentsCacheService.searchCache[mode].searchCondition = info.condition;
	}

	/**
	 * テーブルメニューを設定します.
	 * @param info コンテンツ検索コンポーネント情報
	 * @param menuItems メニュー
	 */
	public setTableMenu(info: EIMContentsSearchComponentInfo, menuItems: EIMMenuItem[], mode: number): void {
		// メニュー
		let menuSeparator: EIMMenuItem = {separator: true};
		// クリア
		info.tableMenuItems.splice(0, info.tableMenuItems.length);
		info.menuTableSelector.items.splice(0, info.menuTableSelector.items.length);

		// テーブル管理
		info.tableMenuItems.push(info.menuTableConfig);
		// セパレータ
		info.tableMenuItems.push(Object.assign({}, menuSeparator));
		// テーブル選択
		info.tableMenuItems.push(info.menuTableSelector);
		Array.prototype.push.apply(info.menuTableSelector.items, menuItems);

		this.documentsCacheService.searchCache[mode].searchMenuItems = info.tableMenuItems;
	}

	/**
	 * テーブルカラムを設定します.
	 * @param info コンテンツ検索コンポーネント情報
	 * @param selectedTable 選択テーブル
	 * @param addColumns カラム
	 */
	public setTableColumn(info: EIMContentsSearchComponentInfo, selectedTable: EIMTable, addColumns: EIMDataGridColumn[], mode: number): void {
		let columns: EIMDataGridColumn[] = [];
		// 固定カラムを追加
		Array.prototype.push.apply(columns, this.createFixedColumns(info));
		// 選択テーブルのカラムを追加
		for (let i = 0; i < addColumns.length; i++) {
			if (addColumns[i].headerName === '文書ID') {
				addColumns[i].field = 'searchIndex';
				break;
			}
		}
		Array.prototype.push.apply(columns, addColumns);
		// グリッドにカラムを追加
		for (let i = 0; i < columns.length; i++) {
			if (columns[i].headerName === this.translateService.instant('EIM_DOCUMENTS.LABEL_02214')) {
				Object.assign(columns[i], {type: EIMDataGridColumnType.number});
				columns[i].valueGetter = null;
				columns[i].cellRendererFramework = null;
			}
		}
		info.searchResultList.setColumns(columns);
		this.documentsCacheService.searchCache[mode].searchColumns = columns;
	}

	/**
	 * 初期表示共通処理.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public initCommon(info: EIMContentsSearchComponentInfo, mode: number): void {

		// 場所クリックイベントハンドラ
		if (!info.placeRendererComponentServicePlaceClicked) {
			info.placeRendererComponentServicePlaceClicked = this.placeRendererComponentService.placeClicked.subscribe((data: any) => {
				// グリッド状態を保存
				this.saveGridState(info, mode);
				// コンテンツアクセスイベントをエミット
				info.contentsAccess.emit(data);
				// 検索画面を閉じる
				if (data.mode === EIMContentsSearchComponentService.MODE_NORMAL) {
					this.dialogManagerComponentService.close(dialogName.SEARCH);
				} else if (data.mode === EIMContentsSearchComponentService.MODE_CONTENTS_SELECTOR) {
					this.dialogManagerComponentService.close(dialogName.SEARCH_CONTENTS);
					this.dialogManagerComponentService.close(dialogName.SINGLE_SEARCH_CONTENTS);
				}
			});
		}
	}

	/**
	 * グリッドのソート状態を保存します.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public saveGridStateSort(info: EIMContentsSearchComponentInfo, mode: number): void {
		this.documentsCacheService.searchCache[mode].searchGridSortModel = info.searchResultList.getSortModel();
	}

	/**
	 * グリッドのフィルター状態を保存します.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public saveGridStateFilter(info: EIMContentsSearchComponentInfo, mode: number): void {
		this.documentsCacheService.searchCache[mode].searchGridFilterModel = info.searchResultList.getFilterModel();
	}

	/**
	 * グリッド状態を保存します(ソート・フィルターは除く).
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public saveGridState(info: EIMContentsSearchComponentInfo, mode: number): void {

		this.documentsCacheService.searchCache[mode].searchGridFilterModel = info.searchResultList.getFilterModel();
		this.documentsCacheService.searchCache[mode].searchGridSortModel = info.searchResultList.getSortModel();

		this.documentsCacheService.searchCache[mode].searchGridScrollTop = info.searchResultList.getScrollTop();
		this.documentsCacheService.searchCache[mode].searchGridSelectedData = info.searchResultList.getSelectedData();
	}

	/**
	 * グリッド状態を復元します.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public restoreGridState(info: EIMContentsSearchComponentInfo, mode): void {
		info.searchResultList.setFilterModel(this.documentsCacheService.searchCache[mode].searchGridFilterModel);
		info.searchResultList.setSortModel(this.documentsCacheService.searchCache[mode].searchGridSortModel);
		info.searchResultList.setScrollTop(this.documentsCacheService.searchCache[mode].searchGridScrollTop);
		info.searchResultList.select(this.documentsCacheService.searchCache[mode].searchGridSelectedData);
	}

	/**
	 * グリッド状態の保存情報をクリアします.
	 */
	public clearGridState(mode: number): void {
		this.documentsCacheService.searchCache[mode].searchGridFilterModel = null;
		this.documentsCacheService.searchCache[mode].searchGridSortModel = null;
		this.documentsCacheService.searchCache[mode].searchGridScrollTop = null;
		this.documentsCacheService.searchCache[mode].searchGridSelectedData = null;
	}
	/**
	 * 第1引数のオブジェクトに第2引数のオブジェクトの属性値と第3引数の属性値をコピーする.
	 * @param obj1 コピー先
	 * @param obj2 コピー元
	 * @param attributeList コピー元のAttributeDomainList
	 */
	public setUpdateDataToResultData(obj1: any, obj2: any, attributeList: EIMAttributeDomain[]): void {
		let targetSet: any = {};
		targetSet.expireDate = null;
		targetSet.createDate = null;
		targetSet.createDateTime = null;
		targetSet.createUserName = null;
		targetSet.modifyDate = null;
		targetSet.modifyDateTime = null;
		targetSet.modifyUserName = null;
		targetSet.searchIndex = null;
		targetSet.property = null;

		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMAttributeDomain = attributeList[i];
			let key: string = 'attType_' + attribute.attributeType.id;
			let value: any;
			if (attribute.attributeType.multiple) {
				key = key + '_multivalue';
			}

			if (attribute.attributeType.valueType === 'LONG') {
				value = (attribute.attributeType.multiple ? attribute.longList : attribute.longList[0]);
			} else if (attribute.attributeType.valueType === 'STRING') {
				value = (attribute.attributeType.multiple ? attribute.stringList : attribute.stringList[0]);
			} else if (attribute.attributeType.valueType === 'DATE') {
				value = (attribute.attributeType.multiple ? attribute.dateList : attribute.dateList[0]);
				if (Array.isArray(value)) {
					for (let j = 0; j < (value as any[]).length; j++) {
						value[j] = this.dateService.getDateString(value[j]);
					}
				} else {
					value = this.dateService.getDateString(value);
				}
			} else if (attribute.attributeType.valueType === 'TEXT') {
				value = (attribute.attributeType.multiple ? attribute.textList : attribute.textList[0]);
			} else if (attribute.attributeType.valueType === 'DOUBLE') {
				value = (attribute.attributeType.multiple ? attribute.doubleList : attribute.doubleList[0]);
			}

			obj2[key] = value;
		}
		// 追加・更新
		for (let key in obj2) {
			if (key.indexOf('attType_') > -1 || targetSet.hasOwnProperty(key)) {
				obj1[key] = obj2[key];
			}
		}
		// 削除
		for (let key in obj1) {
			if (key.indexOf('attType_') > -1) {
				if (!obj2[key]) {
					delete obj1[key];
				}
			}
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 2つの行が同一ドキュメント or ドキュメントリンクを示すものかどうかを判断します.
	 * @param row1 行データ1
	 * @param row2 行データ2
	 * @return true: 同一ドキュメント false: 別ドキュメント
	 */
	private isSameDocOrLink(row1: any, row2: any): boolean {
		// (1)ドキュメントの場合：ObjIDが等しい & ドキュメントリンクフラグはfalseで共通 & 親オブジェクトIDは"-"で共通
		// (2)リンクの場合： ObjIDが等しい & ドキュメントリンクフラグはtrueで共通 & 親オブジェクトIDが等しい
		if (row1.objId === row2.objId
			&& row1.isDocumentLink === row2.isDocumentLink
			&& row1.linkParentObjId === row2.linkParentObjId) {
				return true;
		}
		return false;
	}


	/**
	 * 固定(基本)カラムを作成します.
	 * @param info コンテンツ検索コンポーネント情報
	 * @return データグリッドカラムリスト
	 */
	private createFixedColumns(info: EIMContentsSearchComponentInfo): EIMDataGridColumn[] {

		let columns: EIMDataGridColumn[] = [];

		// 署名・暗号化がONの場合のみ表示
		if (this.serverConfigService.signatureAndEncryptionFlag) {
				columns.push({field: 'signencr', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02141'), width: 70, cellRendererFramework: EIMSignEncryptionRendererComponent, suppressFilter: true ,
					comparator: EIMSignEncryptionRendererComponent.comparator });
		}
		// 公開
		columns.push({field: 'a', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02036'), width: 70, suppressSorting: true, suppressFilter: true,
			cellRendererFramework: EIMPublicFileRendererComponent,
			valueGetter: this.publicFileRendererComponentService.valueGetter
		});
		// ページ
		columns.push({field: 'page', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02097'), width: 70, suppressSorting: true, suppressFilter: true,
			cellRendererFramework: EIMPageRendererComponent
		});
		// 番号
		// 自動採番がONの場合のみ表示
		if (this.serverConfigService.enableAutomaticNumbering) {
				columns.push({field: 'number', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02098'), width: 120, type: EIMDataGridColumnType.text});
		}
		// 名称
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 300, cellRendererFramework: EIMObjectNameRendererComponent, editable: false,
		});
		// 履歴
		columns.push({field: 'rev', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), width: 70, type: EIMDataGridColumnType.number,
			cellRendererFramework: EIMHistoryRendererComponent,
		});
		// ステータス
		columns.push({field: '', headerName: this.translateService.instant('EIM.LABEL_02008'), cellRendererFramework: EIMStatusRendererComponent,
			valueGetter: this.statusRendererComponentService.valueGetter
		});

		// 場所
		columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), cellRendererFramework: EIMPlaceRendererComponent,  param: {isLink: !info.suppressPlaceLink}});

		return columns;
	}

	/**
	 * 親オブジェクトIDリスト初期処理.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public initParentObjIdList(info: EIMContentsSearchComponentInfo, mode: number): void {
		if (info.parentObjId && typeof info.parentObjId === 'number') {
			this.documentFormService.getAllRevisionById(info.parentObjId)
				.subscribe(ids => {
					info.parentObjId = ids;
					this.documentsCacheService.searchCache[mode].parentObjIdList = info.parentObjId;
				});
		}
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (Number(a.objId) === Number(b.objId));
	}
}
