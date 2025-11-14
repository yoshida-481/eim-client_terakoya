import { Injectable, Output, ViewContainerRef, ComponentFactory, ComponentRef } from '@angular/core';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';

/**
 * 属性リスト入力コンポーネントサービス.
 */
@Injectable()
export class EIMAttributeListInputFormItemComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 表示対象の属性タイプレイアウトと属性をペアにして返却します.未設定の属性は補完します.
	 * @param attributeTypeLayoutList 属性タイプレイアウトリスト
	 * @param attributeList 属性リスト
	 */
	public getVisibleLayoutAndAttributeList(attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[], attributeList: EIMAttributeDomain[]): any[] {

		// 未設定の属性情報を保管します。
		let complementAttributeList: EIMAttributeDomain[] = this.getComplementAttributeList(attributeTypeLayoutList, attributeList);

	// 属性タイプIDと属性情報のマップを作成します。
		let attributeTypeIdAndAttributeMap: Map<number, EIMAttributeDomain> = new Map<number, EIMAttributeDomain>();
		for (let i = 0; i < complementAttributeList.length; i++) {
			attributeTypeIdAndAttributeMap.set(complementAttributeList[i].attributeType.id, complementAttributeList[i]);
		}

		// 属性タイプレイアウトと属性情報を対応させます。
		let attrPair: any[] = [];
		for (let i = 0; i < attributeTypeLayoutList.length; i++) {
			let attributeTypeLayout: EIMAttributeTypeLayoutDomain = attributeTypeLayoutList[i];
			if (!attributeTypeLayoutList[i].visible) {
				continue;
			}

			// 属性タイプレイアウトに関連する属性情報を取得
			let attribute: EIMAttributeDomain = attributeTypeIdAndAttributeMap.get(attributeTypeLayout.id);

			attrPair.push({attributeTypeLayout: attributeTypeLayout, attribute: attribute});
		}

		return attrPair;
	}

	/**
	 * 属性タイプレイアウトの表示対象に対応する属性ドメインを補完して返却します.
	 * @param attributeTypeLayoutList 属性タイプレイアウトリスト
	 * @param attributeList 属性リスト
	 */
	public getComplementAttributeList(attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[], attributeList: EIMAttributeDomain[]): EIMAttributeDomain[] {
		let attributeTypeIdAndAttributeMap: Map<number, EIMAttributeDomain> = new Map<number, EIMAttributeDomain>();
		for (let i = 0; i < attributeList.length; i++) {
			attributeTypeIdAndAttributeMap.set(attributeList[i].attributeType.id, attributeList[i]);
		}
		for (let j = 0; j < attributeTypeLayoutList.length; j++) {
			if (!attributeTypeLayoutList[j].visible) {
				continue;
			}

			let attribute: EIMAttributeDomain = attributeTypeIdAndAttributeMap.get(attributeTypeLayoutList[j].id);
			if (attribute) {
				continue;
			}

			// 未設定の入力欄に対応する属性ドメインはサーバから返却されない
			// 以下サーバから返却がないため補完する
			let attributeType = new EIMAttributeTypeDomain();
			attributeType.id = attributeTypeLayoutList[j].id;
			attributeType.name = attributeTypeLayoutList[j].name;
			attributeType.definitionName = attributeTypeLayoutList[j].definitionName;
			attributeType.valueType = attributeTypeLayoutList[j].valueType;
			attributeType.multiple = attributeTypeLayoutList[j].multiple;

			attribute = new EIMAttributeDomain();
			attribute.attributeType = attributeType;

			attributeList.push(attribute);
		}

		return attributeList;
	}
}
