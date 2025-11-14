import { EIMFormsConstantService } from '../../shared/services/forms-constant.service';
import { Injectable, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';

import { EIMAttributeSearchCriteria } from 'app/shared/domains/criteria/attribute.search.criteria';
import { EIMAttributeSearchObjectRefCriteria } from 'app/shared/domains/criteria/attribute.search.object.ref.criteria';
import { EIMComponentInfo } from 'app/shared/shared.interface';
import { EIMFormCriteria } from 'app/shared/domains/criteria/form.criteria';
import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMRangeCriteria } from 'app/shared/domains/criteria/range.criteria';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * 帳票検索条件コンポーネント情報
 */
export interface EIMFormSearchConditionComponentInfo extends EIMComponentInfo {
	// 入力検索条件
	condition?: any,
	// 選択中検索条件項目
	selectConfig?: EIMFormSearchConfig,
	// 検索条件項目リスト
	config?: EIMFormSearchConfig[],
	// 選択帳票タイプ名称
	selectTarget?: string,
	// 詳細条件使用フラグ
	useDetailFlg?: boolean
}

/**
 * 検索条件項目設定
 */
export interface EIMFormSearchConfig {
	// 帳票タイプ名称
	typeName?: string,
	// 属性タイプ
	attributeTypeSearchLayoutList?: string,
	// 帳票定義名称
	objectTypeDefinitionName?: string,
	// 子タイプ検索対象フラグ
	childType?: boolean,
	// 基本検索条件
	basicCondition?: EIMFormSearchPartsCondition[],
	// 詳細検索条件
	detailCondition?: EIMFormSearchPartsCondition[];
}

/**
 * 検索条件入力部品
 */
export interface EIMFormSearchPartsCondition {
	// フィールド名称
	fieldName?: string,
	// 属性タイプ定義名称
	attributeTypeDefinitionName?: string,
	// 画面表示ラベル
	label?: string,
	// 検索部品ID
	searchControlId?: string,
	// デフォルト値
	conditionDefaultValue?: string,
	// オブジェクト型属性名称
	objectRefConfig?: EIMFormSearchObjectCondition;
}

/**
 * オブジェクト型属性
 */
export interface EIMFormSearchObjectCondition {
	// オブジェクトタイプ定義名称
	objectRefObjectTypeDefinitionName?: string,
	// 検索対象の属性タイプ定義名称
	objectRefAttributeTypeDefinitionName?: string,
	// 子オブジェクト型属性
	objectRefConfig?: EIMFormSearchObjectCondition;
}


/**
 * 帳票検索条件コンポーネントサービス.
 */
@Injectable()
export class EIMFormSearchConditionComponentService {

	/** 検索実行イベントエミッタ */
	public doSearch: EventEmitter<EIMFormCriteria> = new EventEmitter<EIMFormCriteria>();

	/** 検索条件検索結果クリア実行イベントエミッタ */
	public doClear: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected localStorageService: EIMLocalStorageService,
		protected formService: EIMFormService,
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
	) {

	}

	/**
	 * 検索項目の取得処理を行います.
	 * @param info 検索コンポーネント情報
	 * @param searchTarget 検索対象リスト
	 */
	public getSeachForm(info: EIMFormSearchConditionComponentInfo, searchTarget: SelectItem[]): void {
		info.condition = {
				/** キーワード */
				keyword: [],
				/** 全文を含む */
				contents: false
		};

		this.formService.getSearchFormJson().subscribe( (jsonObj: any) => {
			this.formService.getFormTypeDomainList().subscribe( (formTypeData: any[]) => {

				// 参照可能な帳票タイプの定義名称リストを生成
				let formTypeDefNameList: string[] = this.getReferenceableFormTypeDefinitionNameList();
				for (var formTypeIndex = 0; formTypeIndex < formTypeData.length; formTypeIndex++) {
					formTypeDefNameList.push(formTypeData[formTypeIndex].definitionName);
				}

				let configList: EIMFormSearchConfig[] = [];

				// 検索項目情報のJSONデータをコンポーネント情報オブジェクトに詰め直します
				for (var i = 0; i < jsonObj.searchLayoutConfig.objectTypeConfigList.length; i++) {
					if (formTypeDefNameList.indexOf(jsonObj.searchLayoutConfig.objectTypeConfigList[i].objectTypeDefinitionName) == -1){
						// 参照可能な帳票タイプでない場合は何もしない
						continue;
					}

					var data = jsonObj.searchLayoutConfig.objectTypeConfigList[i];

					// ユーザの言語情報を取得します
					var lang = this.localStorageService.getLangId();
					var typeName = null;


					for (var j = 0; j < data.typeName.length; j++) {
						var dataTypeName = data.typeName[j];
						if (dataTypeName.langId == lang) {
							typeName = dataTypeName.name;
							break;
						}
					};

					var childType = false;
					if (data.childType == 'on') {
						childType = true;
					}

					var attributeTypeSearchLayoutList = data.attributeTypeSearchLayoutList;

					// 基本情報項目一覧
					var basicSearchParts: EIMFormSearchPartsCondition[] = [];
					this.createInputPartsList(jsonObj.attributeTypeSearchLayoutListMap[attributeTypeSearchLayoutList].basicSearchList, jsonObj, basicSearchParts, info, lang);

					// 詳細情報項目一覧
					var detailSearchParts: EIMFormSearchPartsCondition[] = [];
					this.createInputPartsList(jsonObj.attributeTypeSearchLayoutListMap[attributeTypeSearchLayoutList].detailSearchList, jsonObj, detailSearchParts, info, lang);

					// コンポーネント情報オブジェクトを生成
					var searchConfig: EIMFormSearchConfig =
					{
						typeName: typeName,
						attributeTypeSearchLayoutList: data.attributeTypeSearchLayoutList,
						objectTypeDefinitionName: data.objectTypeDefinitionName,
						childType: childType,
						basicCondition: basicSearchParts,
						detailCondition: detailSearchParts
					};
					configList.push(searchConfig);
				};

				// 検索対象プルダウン用項目の設定
				for (let i = 0; i < configList.length; i++) {
					searchTarget[i] = {label: configList[i].typeName, value: configList[i].typeName};
				}
				info.selectConfig = configList[0];
				info.config = configList;

				// 後処理
				this.postGetSeachForm(info, searchTarget);

			}, (err: any) => {
	    	throw err;
			});
		}, (err: any) => {
			if (err instanceof SyntaxError) {
				// JSON変換エラー
				let errorMessage: string = this.translateService.instant('EIM_FORMS.ERROR_00009')
				err['message'] = errorMessage;
				this.messageService.show(EIMMessageType.error, errorMessage);
			}
			throw err;
		});

	}

	/**
	 * 参照可能な帳票タイプの定義名称リスト
	 */
	public getReferenceableFormTypeDefinitionNameList(): string[] {
		let list: string[] = [];
		list.push(EIMFormsConstantService.OBJECT_TYPE_NAME_FORM_FORM_ID);
		return list;
	}

	/**
	 * 検索対象変更処理を行います.
	 * @param info 検索コンポーネント情報
	 */
	public onChangeSearchTarget(info: EIMFormSearchConditionComponentInfo): void {
		info.useDetailFlg = false;
		for (var i = 0; i < info.config.length; i++) {
			if (info.config[i].typeName == info.selectTarget) {
				info.selectConfig = info.config[i];

				// 基本情報項目一覧の再設定
				this.resetSearchItem(info, info.selectConfig.basicCondition);
				// 詳細情報項目一覧の再設定
				this.resetSearchItem(info, info.selectConfig.detailCondition);

				break;
			}
		}
	}

	/**
	 * 帳票検索処理を行います.
	 *
	 * @param info 検索コンポーネント情報
	 */
	public search(info: EIMFormSearchConditionComponentInfo): void {
		// 画面入力値から検索条件クライテリアを作成する
		// 検索実行はメイン画面で実行するのでイベントを通知する
		let criteria: EIMFormCriteria = this.createCriteria(info);
		this.doSearch.emit(criteria);
	}

	/**
	 * 検索条件を生成します.
	 * @param info 検索コンポーネント情報
	 * @return 検索条件
	 */
	public createCriteria(info: EIMFormSearchConditionComponentInfo): EIMFormCriteria {

		let criteria: EIMFormCriteria = new EIMFormCriteria();
		let attributeCriteriaList: EIMAttributeSearchCriteria[] = [];

		// 基本検索条件生成
		this.createSearchAttributeList(info.selectConfig.basicCondition, info.condition, attributeCriteriaList);
		// 詳細検索条件生成
		if (info.useDetailFlg) {
			this.createSearchAttributeList(info.selectConfig.detailCondition, info.condition, attributeCriteriaList);
		}

		if (attributeCriteriaList.length > 0) {
			criteria.attributeSearchCriteriaList = attributeCriteriaList;
		}

		criteria.accessRoleType = 'READ';
		criteria.keyword = info.condition.keyword[0];
		criteria.isFullText = info.condition.contents;
		criteria.invalidateFlag = false;
		criteria.isSearchChild = info.selectConfig.childType;
		criteria.objectTypeDefinitionName = info.selectConfig.objectTypeDefinitionName;

		return criteria;
	}


	/**
	 * 検索条件をクリアして初期状態に戻します.
	 * @param condition 検索条件
	 */
	public clearSearchCondition(info: EIMFormSearchConditionComponentInfo): void {
		info.condition = {
				/** キーワード */
				keyword: [],
				/** 全文を含む */
				contents: false
		};
		// 基本情報項目一覧の再設定
		this.resetSearchItem(info, info.selectConfig.basicCondition);
		// 詳細情報項目一覧の再設定
		this.resetSearchItem(info, info.selectConfig.detailCondition);

		this.doClear.emit();
	}

	/**
	 * 入力部品オブジェクトを生成します
	 *
	 * @param itemList 検索項目リスト
	 * @param jsonObj JSONデータ
	 * @param searchParts 入力部品オブジェクトリスト
	 * @param info 検索コンポーネント情報
	 * @param lang 言語ID
	 */
	public createInputPartsList(itemList: string[], jsonObj: any, searchParts: EIMFormSearchPartsCondition[], info: EIMFormSearchConditionComponentInfo, lang: string): void {
	// 基本情報項目の入力部品オブジェクトを生成します
		for (var i = 0; i < itemList.length; i++) {
			var itemName = itemList[i];
			let itemObj: any = jsonObj.attributeTypeSearchLayoutMap[itemName];

			// 検索条件項目の設定
			if (itemObj.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_DATE_SCOPE ||
					itemObj.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_LONG_SCOPE) {
					info.condition[itemName] = [];
			} else if (itemObj.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_STRING ||
					itemObj.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_DOUBLE) {
				info.condition[itemName] = [];
				info.condition[itemName + 'CondValue'] = [itemObj.conditionDefaultValue];
			} else {
				info.condition[itemName] = [];
			}

			// 入力項目の表示名を取得
			var partsLabel = null;
			for (var j = 0; j < itemObj.labelList.length; j++) {
				var itemLabel = itemObj.labelList[j];
				if (itemLabel.langId == lang) {
					partsLabel = itemLabel.name;
					break;
				}
			};

			// オブジェクト型属性情報を取得
			let searchObjCondition: EIMFormSearchObjectCondition = null;
			if (itemObj.objectRefConfig != null) {
				searchObjCondition = this.createSearchObjectCondition(itemObj.objectRefConfig);
			}

			// 入力部品オブジェクトを生成
			var condition: EIMFormSearchPartsCondition =
			{
					fieldName: itemName,
					attributeTypeDefinitionName: itemObj.attributeTypeDefinitionName,
					label: partsLabel,
					searchControlId: itemObj.searchControlId,
					conditionDefaultValue: itemObj.conditionDefaultValue,
					objectRefConfig: searchObjCondition
			}

			searchParts.push(condition);
		};
	}



	/**
	 * 検索条件項目の再設定をします.
	 *
	 * @param info 検索コンポーネント情報
	 * @param searchCondition 検索条件
	 */
	public resetSearchItem(info: EIMFormSearchConditionComponentInfo, searchCondition: EIMFormSearchPartsCondition[]): void {
		// 基本情報項目一覧の再設定
		for (var i = 0; i < searchCondition.length; i++) {
			var item: EIMFormSearchPartsCondition = searchCondition[i];

			if (item.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_DATE_SCOPE ||
					item.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_LONG_SCOPE) {
					info.condition[item.fieldName] = []
			} else if (item.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_STRING ||
					item.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_DOUBLE) {
				info.condition[item.fieldName] = [];
				info.condition[item.fieldName + 'CondValue'] = [item.conditionDefaultValue];
			} else {
				info.condition[item.fieldName] = [];
			}
		}
	}


	/**
	 * 入力項目に対する属性の検索条件となるcriteriaを生成します.
	 * @param searchCondition 検索条件
	 * @param attributeCriteriaList 属性検索条件リスト
	 */
	public createSearchAttributeList(searchCondition: EIMFormSearchPartsCondition[], inputCondition: any, attributeCriteriaList: EIMAttributeSearchCriteria[]): void {
		// 入力項目の値を取得しcriteriaを生成する
		for (var i = 0; i < searchCondition.length; i++) {
			var condition = searchCondition[i];
			let attributeCriteria: EIMAttributeSearchCriteria = null;
			if (condition.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_STRING ||
					condition.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_DOUBLE) {
				// テキスト検索条件入力部品
				if (inputCondition[condition.fieldName][0]) {
					attributeCriteria = new EIMAttributeSearchCriteria();
					attributeCriteria.attributeTypeDefinitionName = condition.attributeTypeDefinitionName;
					attributeCriteria.conditionValue = inputCondition[condition.fieldName + 'CondValue'][0];
					if (condition.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_STRING) {
						attributeCriteria.stringValue = inputCondition[condition.fieldName][0];
					} else if (condition.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_DOUBLE) {
						attributeCriteria.doubleValue = inputCondition[condition.fieldName][0];
					}
				}
			} else if (condition.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_DATE_SCOPE) {
				// 日付範囲検索条件入力部品
				if (inputCondition[condition.fieldName][0] || inputCondition[condition.fieldName][1]) {
					let dateRangeCriteria: EIMRangeCriteria = new EIMRangeCriteria();
					dateRangeCriteria.from = inputCondition[condition.fieldName][0];
					dateRangeCriteria.to = inputCondition[condition.fieldName][1];
					attributeCriteria = new EIMAttributeSearchCriteria();
					attributeCriteria.attributeTypeDefinitionName = condition.attributeTypeDefinitionName;
					attributeCriteria.dateRangeCriteria = dateRangeCriteria;
				}
			} else if (condition.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_LONG_FLAG) {
				// 数値フラグ検索条件入力部品
				attributeCriteria = new EIMAttributeSearchCriteria();
				if (inputCondition[condition.fieldName][0]) {
					attributeCriteria.longValue = 1;
				}
				attributeCriteria.attributeTypeDefinitionName = condition.attributeTypeDefinitionName;
			} else if (condition.searchControlId == EIMFormsConstantService.FORM_SEARCH_CONDITION_CONTROLE_LONG_SCOPE) {
				// 数値範囲検索条件入力部品
				if (inputCondition[condition.fieldName][0] || inputCondition[condition.fieldName][1]) {
					let longRangeCriteria: EIMRangeCriteria = new EIMRangeCriteria();
					longRangeCriteria.from = inputCondition[condition.fieldName][0];
					longRangeCriteria.to = inputCondition[condition.fieldName][1];
					attributeCriteria = new EIMAttributeSearchCriteria();
					attributeCriteria.attributeTypeDefinitionName = condition.attributeTypeDefinitionName;
					attributeCriteria.longRangeCriteria = longRangeCriteria;
				}
			}

			if (attributeCriteria != null) {
				attributeCriteria.attributeSearchConditionDefName = condition.fieldName;
				if (condition.objectRefConfig != null) {
					attributeCriteria.attributeSearchObjectRefCriteria = this.createSearchObjectCriteria(condition.objectRefConfig);
				}

				attributeCriteriaList.push(attributeCriteria);
			}

		}
	}

	/**
	 * オブジェクト型属性オブジェクトを生成します.
	 *
	 * @param formSearchObjectCondition オブジェクト型属性検索条件
	 * @return オブジェクト型属性検索条件
	 */
	public createSearchObjectCondition(objectRefConfig: any): EIMFormSearchObjectCondition {
		let objectRefCondition: EIMFormSearchObjectCondition = null;

		if (objectRefConfig.objectRefConfig != null) {
			objectRefCondition = this.createSearchObjectCondition(objectRefConfig.objectRefConfig);
		}

		var objCondtion: EIMFormSearchObjectCondition =
		{
				objectRefObjectTypeDefinitionName: objectRefConfig.objectRefObjectTypeDefinitionName,
				objectRefAttributeTypeDefinitionName: objectRefConfig.objectRefAttributeTypeDefinitionName,
				objectRefConfig: objectRefCondition
		}

		return objCondtion;
	}

	/**
	 * オブジェクト型属性の検索条件となるcriteriaを生成します.
	 *
	 * @param formSearchObjectCondition オブジェクト型属性検索条件
	 * @return オブジェクト型属性検索条件criteria
	 */
	public createSearchObjectCriteria(formSearchObjectCondition: EIMFormSearchObjectCondition): EIMAttributeSearchObjectRefCriteria {
		let objRefCriteria: EIMAttributeSearchObjectRefCriteria = new EIMAttributeSearchObjectRefCriteria();

		objRefCriteria.objectTypeDefinitionName = formSearchObjectCondition.objectRefObjectTypeDefinitionName;
		objRefCriteria.attributeTypeDefinitionName = formSearchObjectCondition.objectRefAttributeTypeDefinitionName;

		if (formSearchObjectCondition.objectRefConfig != null) {
			objRefCriteria.attributeSearchObjectRefCriteria = this.createSearchObjectCriteria(formSearchObjectCondition.objectRefConfig);
		}

		return objRefCriteria;
	}

	/**
	 * 検索項目の取得処理の後処理をします.
	 * @param info 検索コンポーネント情報
	 * @param searchTarget 検索対象リスト
	 */
	protected postGetSeachForm(info: EIMFormSearchConditionComponentInfo, searchTarget: SelectItem[]): void {
		// 実装なし
	}
}
