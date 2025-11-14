import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectTypeLayoutDomain } from 'app/shared/domains/object-type-layout.domain';
import { EIMContentsAttributeTypeLayoutDomain } from './contents-attribute-type-layout.domain';


/**
 * コンテンツオブジェクトタイプレイアウトドメイン
 */
export class EIMContentsObjectTypeLayoutDomain extends EIMObjectTypeLayoutDomain {

	/** 属性タイプのレイアウト一覧 **/
	public attributeTypeLayoutList: EIMContentsAttributeTypeLayoutDomain[] = [];

	/** 階層レイアウトの一覧 */
// 	public hierarchicalLayoutList: EIMHierarchicalLayout = [];

	constructor(json?: any) {
		// ドメインプロパティが含まれるためsuperの初期化処理は使用しない
		super();

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		if (json.attributeTypeLayoutList) {
			// サーバサイドの命名規約違反のための対応
			this.attributeTypeLayoutList = domainService.createObjectList(json.attributeTypeLayoutList,
					(_json: any) => {
						return new EIMContentsAttributeTypeLayoutDomain(_json);
					});
		}
		if (json.attributeLayoutList) {
			// サーバサイドの命名規約違反のための対応
			this.attributeTypeLayoutList = domainService.createObjectList(json.attributeLayoutList,
					(_json: any) => {
						return new EIMContentsAttributeTypeLayoutDomain(_json);
					});
		}
// 		this.hierarchicalLayoutList = domainService.createObjectList(json.hierarchicalLayoutList,
// 		(_json: any) => {
// 		return new EIMHierarchicalLayout(_json);
// 		});
	}
}
