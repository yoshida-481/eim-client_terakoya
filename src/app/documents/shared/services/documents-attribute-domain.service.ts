import { Injectable, Output } from '@angular/core';

import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMDateService } from 'app/shared/services/date.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';

import { EIMContentsAttributeTypeLayoutDomain } from 'app/documents/shared/domains/contents-attribute-type-layout.domain';

/**
 * 文書管理の属性ドメインサービス.
 */
@Injectable()
export class EIMDocumentsAttributeDomainService extends EIMAttributeService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected cacheService: EIMCacheService,
			protected dateService: EIMDateService,
	) {
		super(cacheService);
	}

	/**
	 * 初期値反映済みの属性を返却します.
	 */
	public getInitializedAttribute(attributeTypeLayout: EIMContentsAttributeTypeLayoutDomain): EIMAttributeDomain {
		let attribute: EIMAttributeDomain = super.getInitializedAttribute(attributeTypeLayout);
		if (attributeTypeLayout.successionFlag) {
			// 親に下位引継ぎが設定されている属性の変更は不可
			attribute['_lowSuccession'] = true;
		}

		return attribute;
	}

	/**
	 * 属性値をパラメータに設定します.
	 * @param params パラメータ
	 * @param attrKeyPrefix 属性値キーのプレフィックス
	 * @param attribute 属性値
	 */
	public setAttributeParams(params: any, attrKeyPrefix: string, attribute: EIMAttributeDomain): void {
		let valueList: any[] = attribute.getValueList();

		let cnt = 0;
		for (let i = 0; i < valueList.length; i++) {
			if (valueList[i]) {
				switch (attribute.attributeType.valueType) {
				case 'DATE':
					params[attrKeyPrefix + cnt] = this.dateService.getDateString(valueList[i]);
					break;
// フォルダで未使用のためコメントアウト
// 				case 'OBJECT':
// 					params[attrKeyPrefix + i] = valueList[i].id;
// 					break;
// 				case 'USER':
// 					params[attrKeyPrefix + i] = valueList[i].id;
// 					break;
				case 'CODE':
					params[attrKeyPrefix + cnt] = valueList[i].code;
					break;
				default:
					params[attrKeyPrefix + cnt] = valueList[i];
				}
				cnt++;
			}
		}
		if (cnt == 0) {
			params[attrKeyPrefix + 0] = '';
		}
	}
}
