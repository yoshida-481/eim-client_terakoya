import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectTypeDomain } from './entity/object-type.domain';
import { EIMFormLayoutDomain } from './form-layout.domain';
import { EIMFormListColumnDomain } from './form-list-column.domain';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';

/**
 * フォームタイプドメイン
 */
export class EIMFormTypeFolderDomain extends EIMObjectDomain {

	/** 帳票タイプフォルダ一覧 */
 	public formTypeFolderList: EIMFormTypeFolderDomain[] = [];

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

 		this.formTypeFolderList = domainService.createObject(json.formTypeFolderList,
				(_json: any) => {
					return new EIMFormListColumnDomain(_json);
				});
	}
}
