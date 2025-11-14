import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMOtherNameDomain } from './other-name.domain';
/**
 * コードドメイン
 */
export class EIMBaseStatusTypeDomain {

	/** ベースステータスタイプキー */
	public key: string = null;

	/** ベースステータスタイプID */
	public id = 0;

	/** セッション言語名称 */
	public name: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.key = json.key;
		this.id = Number(json.id);
		this.name = json.name;
	}
}
