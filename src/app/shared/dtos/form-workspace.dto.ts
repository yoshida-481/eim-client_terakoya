import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMFormTypeDTO } from './form-type.dto';
import { EIMAccessRoleTypeDomain } from 'app/shared/domains/entity/access-role-type.domain';

/**
 * 帳票ワークスペースDTO
 */
export class EIMFormWorkspaceDTO {

	/** 帳票ワークスペースID */
	public id = 0;

	/** 帳票ワークスペース名称 */
	public name = null;

	/** 帳票タイプリスト */
	public children: EIMFormTypeDTO[] = null;

	/** 帳票数 */
	public formCount = 0;

	/** 帳票数合計 */
	public totalFormCount = 0;

	/** セキュリティID */
	public securityId = 0;
	
	/** セッションユーザが保持するアクセス権限タイプリスト */
	public accessRoleTypeList: EIMAccessRoleTypeDomain[] = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.name = json.name;
		this.formCount = json.formCount;
		this.totalFormCount = json.totalFormCount;
		this.securityId = json.securityId;

		if (json.children) {
			this.children = domainService.createObjectList(json.children, (result: any) => {return new EIMFormTypeDTO(result); });
		} else {
			this.children = [];
		}
		
		this.accessRoleTypeList = domainService.createObjectList(json.accessRoleTypeList,	
				(json:any) => {return new EIMAccessRoleTypeDomain(json);});
	}
}
