import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * アクセス権限タイプドメイン
 */
export class EIMAccessRoleTypeDomain {
	/** アクセス権限タイプID */
	public id = 0;

	/** アクセス権限タイプ名称 */
	public name: string = null;

	/** アクセス権限タイプ定義名称 */
	public definitionName: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.name = json.name;
		this.definitionName = json.definitionName;
	}
}
