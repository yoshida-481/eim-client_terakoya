import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMOtherNameDomain } from 'app/shared/domains/entity/other-name.domain';
import { EIMContentsLayoutDomain } from './contents-layout.domain';

/**
 * コンテンツドメイン
 */
export class EIMContentsDomain extends EIMFormDomain {

	/** レイアウト情報 */
	public formLayout: EIMContentsLayoutDomain;

	/** 名称割当対象属性タイプID */
	public _nameAllocationAttributeTypeId: number;

	/** 下位引継ぎ属性かどうか */
	public _lowSuccession: boolean;

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.formLayout = domainService.createObject(json.formLayout,
				(_json: any) => {
					return new EIMContentsLayoutDomain(_json);
				});
	}
}
