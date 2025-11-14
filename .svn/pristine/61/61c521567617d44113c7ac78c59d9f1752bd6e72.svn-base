import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * 一時ファイルドメイン
 */
export class EIMDuplicateCheckModeDomain {

	/* サーバ上の一時ファイルのパス */
	public value: number;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.value = Number(json.value);
	}
}
