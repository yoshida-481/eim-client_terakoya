import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './entity/object.domain';
import { EIMFormLayoutDomain } from './form-layout.domain';
import { EIMAccessRoleTypeDomain } from './entity/access-role-type.domain';
import { EIMFormAttributeDomain } from 'app/shared/domains/form-attribute.domain';

/**
 * フォームドメイン
 */
export class EIMFormDomain extends EIMObjectDomain {

	/** レイアウト情報 */
	public formLayout: EIMFormLayoutDomain;

	/** セッションユーザが保持するアクセス権限タイプリスト */
 	public accessRoleTypeList: EIMAccessRoleTypeDomain[] = [];

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
					return new EIMFormLayoutDomain(_json);
				});
 		this.accessRoleTypeList = domainService.createObjectList(json.accessRoleTypeList,
				(_json: any) => {
					return new EIMAccessRoleTypeDomain(_json);
				});
		this.attributeList = domainService.createObjectList(json.attributeList,
				(_json: any) => {
					return new EIMFormAttributeDomain(_json);
				});
	}
}
