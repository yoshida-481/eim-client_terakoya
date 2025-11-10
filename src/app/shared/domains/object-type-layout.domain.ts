import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeTypeDomain } from './entity/attribute-type.domain';

import { EIMAttributeTypeLayoutDomain } from './attribute-type-layout.domain';
import { EIMHierarchicalGroupDomain } from './hierarchical-group.domain';
import { EIMHierarchicalLayoutDomain } from './hierarchical-layout.domain';
import { EIMNonHierarchicalGroupDomain } from './non-hierarchical-group.domain';


/**
 * オブジェクトタイプレイアウトドメイン
 */
export class EIMObjectTypeLayoutDomain extends EIMAttributeTypeDomain {

	/** 属性タイプのレイアウト一覧 **/
	public attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] = [];

	/** 階層レイアウトの一覧 */
	public hierarchicalLayoutList: EIMHierarchicalLayoutDomain[] = [];

	constructor(json?: any) {
		super(json);

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
					return new EIMAttributeTypeLayoutDomain(_json);
				});
		}
		if (json.attributeLayoutList) {
			// サーバサイドの命名規約違反のための対応
			this.attributeTypeLayoutList = domainService.createObjectList(json.attributeLayoutList,
				(_json: any) => {
					return new EIMAttributeTypeLayoutDomain(_json);
				});
		}
		if (json.hierarchicalLayoutList) {
	 		this.hierarchicalLayoutList = domainService.createObjectList(json.hierarchicalLayoutList,
		 		(_json: any) => {
					if (_json.attributeTypeLayout) {
						return new EIMNonHierarchicalGroupDomain(_json);
					} else {
						return new EIMHierarchicalGroupDomain(_json);
					}
		 		});
		}
	}
}
