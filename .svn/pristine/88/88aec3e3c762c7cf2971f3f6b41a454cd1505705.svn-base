import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMFormObjectDomain } from 'app/shared/domains/form-object.domain';

/**
 * 属性ドメイン
 */
export class EIMFormAttributeDomain extends EIMAttributeDomain {
	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		super(json);
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.objectList = domainService.createObjectList(json.objectList,
				(_json: any) => {
					return new EIMFormObjectDomain(_json);
				});
	}
}
