import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './entity/object.domain';

import { EIMFormDomain } from './form.domain';
import { EIMFormTypeDomain } from './form-type.domain';

/**
 * フォームドメイン
 */
export class EIMFormWorkspaceDomain extends EIMObjectDomain {

	/** 帳票タイプ一覧 */
	public formTypeList: EIMFormTypeDomain[] = [];

	/** 帳票一覧 */
	public formList: EIMFormDomain[] = [];

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

 		this.formTypeList = domainService.createObjectList(json.formTypeList,
 				(res: any) => {return new EIMFormTypeDomain(res); });

 		this.formList = domainService.createObjectList(json.formList,
 				(res: any) => {return new EIMFormDomain(res); });
	}
}
