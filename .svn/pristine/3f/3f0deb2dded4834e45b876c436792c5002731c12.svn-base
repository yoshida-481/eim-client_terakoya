import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectTypeDomain } from './entity/object-type.domain';
import { EIMFormLayoutDomain } from './form-layout.domain';

import { EIMAttributeTypeLayoutDomain } from './attribute-type-layout.domain';

/**
 * 表示列情報ドメイン
 */
export class EIMFormListColumnDomain {

	/** 表示列上限数 */
	public formListColumnMaxCount: number;

	/** システム設定表示列リスト */
	public systemSettingFormListColumns: EIMAttributeTypeLayoutDomain[] = [];

	constructor(json?: any) {

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

 		this.systemSettingFormListColumns = domainService.createObjectList(json.systemSettingFormListColumns,
 				(res: any) => {return new EIMAttributeTypeLayoutDomain(res); });
 		this.formListColumnMaxCount = json.formListColumnMaxCount;
	}
}
