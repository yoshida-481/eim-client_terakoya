import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeTypeDomain } from './attribute-type.domain';
import { EIMStatusTypeDomain } from './status-type.domain';

/**
 * ガード条件ドメイン
 */
export class EIMGuardConditionDomain {
	/** ガード条件キー */
	public key: string = null;

	/** ガード条件ID */
	public id = 0;

/** ガード条件名称一覧 */
// private List<OtherNameDomain> nameList = new ArrayList<OtherNameDomain>();

	/** ガード条件名 */
	public name: string = null;

	/** 現在ステータスへ自己遷移するか */
	public selfTransition: string = null;

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
		this.selfTransition = json.selfTransition;
	}
}
