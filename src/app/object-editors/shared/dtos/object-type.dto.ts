import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHierarchicalDomain } from 'app/shared/shared.interface';

/**
 * オブジェクトタイプDTO
 */
export class EIMObjectTypeDTO implements EIMHierarchicalDomain {

	/** 親階層 */
	public parent: EIMHierarchicalDomain;

	/** 子階層 */
	public children: EIMHierarchicalDomain[] = [];

	/** オブジェクトタイプID */
	public id = 0;

	/** オブジェクトタイプ名 */
	public name: string = null;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = Number(json.attr.objTypeId);
		this.name = json.attr.objTypeName;
	}
}
