import { Injectable, Output } from '@angular/core';

import { EIMCacheService } from 'app/shared/services/cache.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * 属性ドメインサービス.
 */
@Injectable()
export class EIMAttributeService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected cacheService: EIMCacheService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性情報の配列から、該当定義名称の属性情報を返却します.
	 * @param attributeList 属性情報配列
	 * @param definitionName 属性タイプ定義名称
	 * @return 属性情報
	 */
	public getAttributeByDefinitionName(attributeList: EIMAttributeDomain[], definitionName: string): EIMAttributeDomain {
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMAttributeDomain = attributeList[i];
			if (attribute.attributeType.definitionName === definitionName) {
				return attribute;
			}
		}
		return null;
	}

	/**
	 * 初期値反映済みの属性を返却します.
	 * 初期値ありのみ返却します.
	 */
	public getInitializedAttributeList(attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[]): EIMAttributeDomain[] {
		if (!attributeTypeLayoutList) {
			return [];
		}

		let attributeList: EIMAttributeDomain[] = [];
		for (let i = 0; i < attributeTypeLayoutList.length; i++) {
			let attributeTypeLayout: EIMAttributeTypeLayoutDomain = attributeTypeLayoutList[i];

			let attribute: EIMAttributeDomain = this.getInitializedAttribute(attributeTypeLayout);
			let valueList: any[] = attribute.getValueList();
			if (valueList.length == 0) {
				continue;
			}

			let valueType: String = attributeTypeLayout.valueType;
			if (valueType === 'CODE') {
				// コード型
				let newValue: any[] = [];

				// コードのIDをコード情報に置き換える
				let codeMap: any = {};
				let codeList: EIMCodeDomain[] = attributeTypeLayout.codeType.codeList;
				for (let j = 0; j < codeList.length; j++) {
					let code: EIMCodeDomain = codeList[j];
					codeMap[code.id] = code;
				}

				for (let j = 0; j < valueList.length; j++) {
					let code: EIMCodeDomain = codeMap[valueList[j]];
					if (code) {
						newValue.push(code);
					}
				}
				attribute.setValueList(newValue);
			} else if (valueType === 'USER') {
				// ユーザ型
				let newValue: any[] = [];

				// ログインユーザの場合、ログインユーザ情報に置き換える
				for (let j = 0; j < valueList.length; j++) {
					if (valueList[j] === EIMConstantService.ATTRIBUTE_DEFAULT_VALUE_LOGIN_USER) {
						newValue.push(this.cacheService.getLoginUser());
					}
				}
				attribute.setValueList(newValue);
			}
			attributeList.push(attribute);
		}
		return attributeList.concat();
	}

	/**
	 * 画面表示対象の属性を返却します.
	 * @param attributeList 属性情報リスト
	 * @param attributeTypeLayoutList 属性タイプレイアウト情報リスト
	 * @return 属性情報リスト
	 */
	public getVisibleAttributeList(attributeList: EIMAttributeDomain[], attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[]): EIMAttributeDomain[] {
		let retAttributeList: EIMAttributeDomain[] = [];
		for (let i = 0; i < attributeTypeLayoutList.length; i++) {
			for (let j = 0; j < attributeList.length; j++) {
				if (attributeTypeLayoutList[i].id != attributeList[j].attributeType.id) {
					continue;
				}
				retAttributeList.push(attributeList[j]);
			}
		}
		return retAttributeList;
	}

	/**
	 * 属性値の値リストの内、空行を削除した属性値を複製して返却します.
	 * @param attributeList 属性情報リスト
	 * @return 属性情報リスト
	 */
	public excludeNullAttributeList(attributeList: EIMAttributeDomain[]): EIMAttributeDomain[] {

		if (!attributeList) {
			return [];
		}

		let retAttributeList: EIMAttributeDomain[] = [];
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: any = attributeList[i];

			let valueList: any[] = this.excludeNull(attribute.getValueList());
			if (attribute.attributeType.multiple) {

				// 複数値属性の場合
				if (valueList.length == 0) {
					continue;
				}
			} else {

				// 単数値属性の場合
				if (valueList.length != 1) {
					continue;
				}
			}
			let newAttribute: EIMAttributeDomain = new EIMAttributeDomain();
			newAttribute.attributeType = attribute.attributeType;
			newAttribute.setValueList(valueList);

			retAttributeList.push(newAttribute);
		}
		return retAttributeList;
	}

	/**
	 * 属性タイプの名称を返却します.
	 * 
	 * @param attributeTypeLayouts 属性タイプレイアウト情報リスト
	 * @param definitionName 属性タイプ定義名称
	 * @returns 
	 */
	public getAttributeTypeName(attributeTypeLayouts: EIMAttributeTypeLayoutDomain[], definitionName: string): string {

		for (const attributeTypeLayout of attributeTypeLayouts) {
			if (attributeTypeLayout.definitionName !== definitionName) {
				continue;
			}

			return attributeTypeLayout.name;
		}

		return '';
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 初期値反映済みの属性を返却します.
	 * @param attributeTypeLayoutList 属性タイプレイアウト情報リスト
	 * @return 初期値反映済みの属性情報
	 */
	protected getInitializedAttribute(attributeTypeLayout: EIMAttributeTypeLayoutDomain): EIMAttributeDomain {
		// 属性情報を生成
		let initialValueList: any[] = new Array();
		let attribute: EIMAttributeDomain = new EIMAttributeDomain();
		let attributeType: EIMAttributeTypeDomain = new EIMAttributeTypeDomain();
		Object.assign(initialValueList , attributeTypeLayout.getInitialValueList());
		attributeType.id = attributeTypeLayout.id;
		attributeType.name = attributeTypeLayout.name;
		attributeType.definitionName = attributeTypeLayout.definitionName;
		attributeType.valueType = attributeTypeLayout.valueType;
		attributeType.multiple = attributeTypeLayout.multiple;
		attribute.attributeType = attributeType;

		attribute.setValueList(initialValueList);
		return attribute;
	}

	/**
	 * 複数値属性の入力値から、空の項目を削除し返却します.
	 */
	protected excludeNull(valueList: any[]): any[] {
		const newList = [];
		for (let i = 0; i < valueList.length; i++) {
			if (valueList[i] === null || valueList[i] === '') {
				continue;
			}

			if (valueList[i]  instanceof Date) {
				// no check
				// Dateはobjectとみなされる。下の処理をさせないため。

			} else 	if (typeof valueList[i] == 'object') {

				// PrimeNGが加えてしまう属性を削除
				if (valueList[i]._$visited) {
					delete valueList[i]._$visited;
				}

				if (Object.keys(valueList[i]).length == 0) {
					continue;
				}
			}
			newList.push(valueList[i]);
		}
		return newList;
	}

}
