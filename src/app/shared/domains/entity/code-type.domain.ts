import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMCodeDomain } from './code.domain';

/**
 * コードタイプドメイン
 */
export class EIMCodeTypeDomain {

	/** コードタイプID */
	public id = 0;

	/** コード定義名称 */
	public definitionName: string = null;

	/** コード一覧 */
	public codeList: EIMCodeDomain[] = [];

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.definitionName = json.definitionName;
		this.codeList = domainService.createObjectList(json.codeList,
				(_json: any) => {
					return new EIMCodeDomain(_json);
				});
	}
}
