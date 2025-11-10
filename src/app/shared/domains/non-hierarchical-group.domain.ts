import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeTypeLayoutDomain } from './attribute-type-layout.domain';
import { EIMHierarchicalLayoutDomain } from './hierarchical-layout.domain';

/**
 * 非階層グループドメイン
 */
export class EIMNonHierarchicalGroupDomain extends EIMHierarchicalLayoutDomain {

	/** 属性タイプのレイアウト一覧 **/
	public attributeTypeLayout: EIMAttributeTypeLayoutDomain = null;

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		if (json.attributeTypeLayout) {
			this.attributeTypeLayout = domainService.createObject(json.attributeTypeLayout,
				(_json: any) => {
					return new EIMAttributeTypeLayoutDomain(_json);
				});
		}
	}
}
