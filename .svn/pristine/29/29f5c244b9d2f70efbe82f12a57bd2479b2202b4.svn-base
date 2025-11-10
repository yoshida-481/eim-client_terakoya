import { Injectable, Output, ViewContainerRef, ComponentFactory, ComponentRef } from '@angular/core';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';

import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMHierarchicalGroupDomain } from 'app/shared/domains/hierarchical-group.domain';
import { EIMHierarchicalLayoutDomain } from 'app/shared/domains/hierarchical-layout.domain';
import { EIMNonHierarchicalGroupDomain } from 'app/shared/domains/non-hierarchical-group.domain';

/**
 * 階層属性リスト入力コンポーネントサービス.
 */
@Injectable()
export class EIMHierarchicalAttributeListInputFormItemComponentService {

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
	 * 属性タイプレイアウトの表示対象に対応する属性ドメインを補完して返却します.
	 * @param attributeTypeLayoutList 属性タイプレイアウトリスト
	 * @param attributeList 属性リスト
	 * @param hierarchicalLayoutList 階層レイアウトリスト
	 * @return 属性値マップ（キー：属性タイプID、値：属性）
	 */
	public getAttributeObjectMap(attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[], attributeList: EIMAttributeDomain[], hierarchicalLayoutList: EIMHierarchicalLayoutDomain[]): Object {

		// 設定済みの属性リストのマップを作成
		let map: Object = {};
		for (let i = 0; i < attributeList.length; i++) {
			map[attributeList[i].attributeType.id] = attributeList[i];
		}
		
		// 未設定分の属性をマップに追加する
		for (let i = 0; i < attributeTypeLayoutList.length; i++) {
			let attributeTypeLayout: EIMAttributeTypeLayoutDomain = attributeTypeLayoutList[i];
			
			let attribute:EIMAttributeDomain = map[attributeTypeLayout.id];
			if (attribute) {
				continue;
			}

			// 未設定の入力欄に対応する属性ドメインはサーバから返却されない
			// 以下サーバから返却がないため補完する
			let attributeType = new EIMAttributeTypeDomain();
			attributeType.id = attributeTypeLayout.id;
			attributeType.name = attributeTypeLayout.name;
			attributeType.definitionName = attributeTypeLayout.definitionName;
			attributeType.valueType = attributeTypeLayout.valueType;
			attributeType.multiple = attributeTypeLayout.multiple;

			attribute = new EIMAttributeDomain();
			attribute.attributeType = attributeType;

			map[attributeType.id] = attribute;
		}

		return map;
	}
	
}
