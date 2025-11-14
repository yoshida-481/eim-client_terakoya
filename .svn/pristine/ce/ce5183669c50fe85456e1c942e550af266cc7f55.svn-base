import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * ベースイベントタイプドメイン
 */
export class EIMBaseEventTypeDomain {
	/** ベースイベントタイプキー */
	public key: string = null;

	/** ベースイベントタイプID */
	public id = 0;

	/** アクセス権限キー */
	public aclKey: string = null;

// /** 名称一覧  */
// private List<OtherNameDomain> nameList = new ArrayList<OtherNameDomain>();
	/** ベースイベントタイプ名 */
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
		this.aclKey = json.aclKey;
		this.name = json.name;
	}
}
