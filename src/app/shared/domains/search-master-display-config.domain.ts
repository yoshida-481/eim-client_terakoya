import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeDomain } from './entity/attribute.domain';
import { EIMAttributeTypeDomain } from './entity/attribute-type.domain';
import { EIMObjectTypeDomain } from './entity/object-type.domain';
import { EIMOtherNameDomain } from './entity/other-name.domain';

/**
 * オブジェクトマスタ検索の画面定義情報ドメイン
 */
export class EIMSearchMasterDisplayConfigDomain {

	/** オブジェクトタイプ */
	public objectType: EIMObjectTypeDomain = null;

	/** 帳票オブジェクトID */
	public formObjectId: number = null;

	/** 検索フィールド（呼出し部）表示属性タイプ */
	public displayFieldAttributeType: EIMAttributeTypeDomain = null;

	/** 検索画面ウィンドウタイトル */
	public description: EIMOtherNameDomain[] = [];

	/** 検索上限 */
	public limit: number = null;

	/** 検索画面 表示属性タイプリスト */
	public displayDialogAttributeTypeList: EIMAttributeTypeDomain[] = [];

	/** 無効属性 */
	public invalidateAttribute: EIMAttributeDomain = null;


	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		if (json.objectType) {
			this.objectType = domainService.createObject(json.objectType,
					(_json: any) => {
						return new EIMObjectTypeDomain(_json);
					});
		}
		this.formObjectId = json.formObjectId;
		if (json.displayFieldAttributeType) {
			this.displayFieldAttributeType = domainService.createObject(json.displayFieldAttributeType,
					(_json: any) => {
						return new EIMAttributeTypeDomain(_json);
					});
		}
		if (json.description) {
			this.description = domainService.createObjectList(json.description,
					(_json: any) => {
						return new EIMOtherNameDomain(_json);
					});
		}
		this.limit = json.limit;
		if (json.displayDialogAttributeTypeList) {
			this.displayDialogAttributeTypeList = domainService.createObjectList(json.displayDialogAttributeTypeList,
					(_json: any) => {
						return new EIMAttributeTypeDomain(_json);
					});
		}
		if (json.invalidateAttribute) {
			this.invalidateAttribute = domainService.createObject(json.invalidateAttribute,
					(_json: any) => {
						return new EIMAttributeDomain(_json);
					});
		}
	}
}
