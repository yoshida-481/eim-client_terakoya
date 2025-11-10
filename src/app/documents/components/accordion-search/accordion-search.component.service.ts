import { EIMDataGridSingleSelectorComponentInfo, EIMDataGridSingleSelectorComponentService } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { TranslateService } from '@ngx-translate/core';

import { EIMDateService } from 'app/shared/services/date.service';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';

// レンダラー
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMStatusRendererComponentService } from 'app/documents/shared/components/renderer/status-renderer.component.service';
import { EIMPageRendererComponentService } from 'app/documents/shared/components/renderer/page-renderer.component.service';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMAttributeRendererComponentService } from 'app/documents/shared/components/renderer/attribute-renderer.component.service';

// API
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMFolderService } from 'app/documents/shared/services/apis/folder.service';
import { EIMTableService, EIMTable } from 'app/documents/shared/services/apis/table.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';

/**
 * コンポーネント情報
 */
export interface EIMAccordionSearchComponentInfo extends EIMDataGridSingleSelectorComponentInfo {
	// 詳細条件開閉状態
	isShowDetailCondition?: boolean;
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
	// 親オブジェクトID
	parentObjId?: number | number[];
}

/**
 * 詳細条件
 */
export interface EIMAccordionSearchDetailCondition {
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
export class EIMAccordionSearchComponentService extends EIMDataGridSingleSelectorComponentService {

	public static MODE_NORMAL = 0;
	public static MODE_CONTENTS_SELECTOR = 1;
	public static MODE_ACCORDION_SEARCH = 2;
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
			protected documentFileService: EIMDocumentFileService

	) {
		super(translateService);
	}
	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 画面を再表示します.
	 * @param info コンテンツ検索コンポーネント情報
	 */
	public redisplay(info: EIMAccordionSearchComponentInfo, mode: number): void {
		// 詳細条件開閉状態
		info.isShowDetailCondition = this.documentsCacheService.searchCache[mode].searchShowDetailCondition ?? info.isShowDetailCondition;
		// 選択テーブル
		info.selectedTable = this.documentsCacheService.searchCache[mode].searchSelectedTable ?? info.selectedTable;
		// 検索条件
		info.condition = this.documentsCacheService.searchCache[mode].searchCondition ?? info.condition;
		// テーブルメニュー
		info.tableMenuItems.splice(0, info.tableMenuItems.length);
		Array.prototype.push.apply(info.tableMenuItems, this.documentsCacheService.searchCache[mode].searchMenuItems);
		// 親オブジェクトID
		info.parentObjId = this.documentsCacheService.searchCache[mode].parentObjIdList;

	}

	/**
	 * 検索条件をクリアして初期状態に戻します.
	 * @param condition 検索条件
	 */
	public clearSearchCondition(condition: any): void {
		condition.searchType = 'document';
		condition.pathCondition = 'false';
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
			data.inputValue = null;
			data.inputValueFrom = null;
			data.inputValueTo = null;
			data.checkStatus = false;
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
	}

	/**
	 * 詳細条件を設定します.
	 * @param info コンテンツ検索コンポーネント情報
	 * @param table テーブル
	 */
	public setDetailCondition(info: EIMAccordionSearchComponentInfo, table: EIMTable, mode: number): void {

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
		} else if (table.tableItemList !== undefined) {
			// デフォルト以外選択時
			table.tableItemList.forEach( (data: any) => {
				if (data.attTypeDefName === 'サイズ') {
					return;
				}

				let condition: EIMAccordionSearchDetailCondition = {
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
	public setTableMenu(info: EIMAccordionSearchComponentInfo, menuItems: EIMMenuItem[], mode: number): void {
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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

}
