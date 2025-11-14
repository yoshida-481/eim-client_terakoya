import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * 多言語ドメイン
 */
export class EIMOtherNameDomain {

	/** 言語ID */
	public langId: string = null;

	/** 名称 */
	public name: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

// 		let injector = Injector.create({providers});
// 		let domainService:EIMDomainService = injector.get(EIMDomainService);

		this.langId = json.langId;
		this.name = json.name;
	}
}
