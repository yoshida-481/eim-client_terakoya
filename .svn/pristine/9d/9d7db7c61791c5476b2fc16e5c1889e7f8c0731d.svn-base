import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMOtherNameDomain } from './other-name.domain';
/**
 * コードドメイン
 */
export class EIMCodeDomain {

	/** コードID */
	public id = 0;

	/** コード値 */
	public code: string = null;

	/** 並び順序 */
	public sequence = 0;

	/** 他言語名称 */
	public nameList: EIMOtherNameDomain[] = [];

	/** 無効フラグ */
	public disable = false;

	/** セッション言語名称 */
	public name: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.code = json.code;
		this.sequence = json.sequence;
		this.nameList = domainService.createObjectList(json.nameList,
				(_json: any) => {
					return new EIMOtherNameDomain(_json);
				});
		this.disable = json.disable;
		this.name = json.name;
	}
}
