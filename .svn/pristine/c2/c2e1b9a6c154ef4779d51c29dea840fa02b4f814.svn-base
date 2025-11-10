import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeTypeDomain } from './attribute-type.domain';
import { EIMStatusTypeDomain } from './status-type.domain';

/**
 * メールタイプドメイン
 */
export class EIMMailTypeDomain {

	/** メールタイプキー */
	public key: string = null;

	/** メールタイプID */
	public id = 0;

/** メールタイプ名称一覧 */
// private List<OtherNameDomain> nameList = new ArrayList<OtherNameDomain>();

	/** メールタイプ名 */
	public name: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.key = json.key;
		this.id = json.id;
		this.name = json.name;
	}
}
