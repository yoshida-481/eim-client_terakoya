import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';


/**
 * リレーションドメイン
 */
export class EIMRelationDomain {

	/** リレーションID */
	public id = 0;

	/** リレーション名 */
	public name: string = null;

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** リビジョンアップ */
	public revup = 'All';

	/** 相互／非相互 */
	public mutual = 'NoPermit';

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.attr.id;
		this.name = json.attr.name;
		this.nameList = json.nameList;
		this.revup = json.attr.revup;
		this.mutual = json.attr.mutual;

	}

}
