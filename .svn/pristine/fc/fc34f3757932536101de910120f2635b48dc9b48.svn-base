import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './object.domain';
import { EIMOtherNameDomain } from './other-name.domain';

/**
 * セキュリティドメイン
 */
export class EIMSecurityDomain {

	/** セキュリティID */
	public id = 0;

	/** セキュリティ名 */
	public name: string = null;

	/** セキュリティ定義名称 */
	public definitionName: string = null;

	/** アクセスエントリー一覧 */
// private List<AccessEntryDomain> accessEntryList = new ArrayList<AccessEntryDomain>();

	/** ステータス別セキュリティ一覧 */
// private List<StatusSecurityDomain> statusSecurityList = new ArrayList<StatusSecurityDomain>();

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
