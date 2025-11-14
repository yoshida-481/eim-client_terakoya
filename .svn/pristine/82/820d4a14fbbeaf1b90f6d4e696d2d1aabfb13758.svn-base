import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * アプリケーション種別DTO
 */
export class EIMAdminAppDTO {

	/** アプリケーション種別ID */
	public adminAppId = null;

	/** アプリケーション種別名称 */
	public name = null;

	/** アプリケーション種別名称リスト */
	public nameList? = [];

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.adminAppId = json.adminAppId;
		this.name = json.name;
	}
}
