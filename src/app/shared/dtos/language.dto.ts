import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * 言語DTO
 */
export class EIMLanguageDTO {

	/** 言語ID */
	public langId = 0;

	/** 言語名称 */
	public name = null;

	/** 多言語名称 */
	public nameList? = [];

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.langId = json.langId;
		this.name = json.name;
	}
}
