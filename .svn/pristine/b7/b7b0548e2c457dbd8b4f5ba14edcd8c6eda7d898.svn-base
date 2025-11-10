import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMMailTypeDomain } from './mail-type.domain';

/**
 * 通知メールドメイン
 */
export class EIMNoticeMailDomain {

	/** 通知メールID */
	public id = 0;

	/** 送信方法 */
	public method: string = null;

	/** メールタイプ */
	public type: EIMMailTypeDomain = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.method = json.method;
		this.type = domainService.createObject(json.type,
				(_json: any) => {
					return new EIMMailTypeDomain(_json);
				});
	}
}
