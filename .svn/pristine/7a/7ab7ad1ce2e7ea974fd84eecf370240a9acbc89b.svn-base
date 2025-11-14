import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';

/**
 * コンテンツ属性ドメイン
 */
export class EIMContentsAttributeDomain extends EIMAttributeDomain {

	public id: number;
	public name: string;
	public attributeList: EIMContentsAttributeDomain[] = [];

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		let injector = Injector.create({providers});
		let domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.name = json.name;
		this.attributeList = domainService.createObjectList(json.attributeList, (result: any) => {return new EIMContentsAttributeDomain(result); });
	}
}
