import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAccessRoleTypeDomain } from 'app/shared/domains/entity/access-role-type.domain';



/**
 * 帳票タイプフォルダDTO
 */
export class EIMFormTypeFolderDTO {

	/** 帳票タイプフォルダID */
	public id = 0;

	/** 帳票タイプフォルダ名称 */
	public name: string = null;

	/** 言語リスト */
	public languageList: any = [];

	/** 帳票タイプフォルダリスト */
	public children: EIMFormTypeFolderDTO[] = null;

	/** 帳票数 */
	public formCount = 0;

	/** 帳票数合計 */
	public totalFormCount = 0;

	/** セキュリティID */
	public securityId = 0;

	/** セッションユーザが保持するアクセス権限タイプリスト */
	public accessRoleTypeList: EIMAccessRoleTypeDomain[] = null;

	/** セキュリティ名称 */
	public securityName: string = null;

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
		this.securityName = json.securityName;
		this.languageList = json.languageList;

		if (json.children) {
			this.children = domainService.createObjectList(json.children, (childrenJson: any) => { return new EIMFormTypeFolderDTO(childrenJson); });
		} else {
			this.children = [];
		}

		this.accessRoleTypeList = domainService.createObjectList(json.accessRoleTypeList,
			(json: any) => { return new EIMAccessRoleTypeDomain(json); });

	}
}
