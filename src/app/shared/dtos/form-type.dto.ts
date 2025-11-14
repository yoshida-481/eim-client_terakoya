import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMFormTypeFolderDTO } from './form-type-folder.dto';
import { EIMAccessRoleTypeDomain } from 'app/shared/domains/entity/access-role-type.domain';

/**
 * 帳票タイプDTO
 */
export class EIMFormTypeDTO {

	/** 帳票タイプID */
	public id = 0;

	/** 帳票タイプ定義名称 */
	public definitionName: string = null;

	/** 帳票タイプ名称 */
	public name: string = null;

	/** 表示列情報 */
	public formListColumn: any[] = [];

	/** 帳票ワークスペースID */
	public formWorkspaceId = 0;

	/** ワークフローID */
	public workflowId = 0;

	/** ワークフロー名称 */
	public workflowName: string = null;

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

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.definitionName = json.definitionName;
		this.name = json.name;
		this.formListColumn = json.formListColumn;
		this.formWorkspaceId = json.formWorkspaceId;
		this.formCount = json.formCount;
		this.totalFormCount = json.totalFormCount;
		this.securityId = json.securityId;
		this.workflowId = json.workflowId;
		this.workflowName = json.workflowName;

		if (json.children) {
			this.children = domainService.createObjectList(json.children, (res: any) => {return new EIMFormTypeFolderDTO(res); });
		} else {
			this.children = [];
		}
				
		this.accessRoleTypeList = domainService.createObjectList(json.accessRoleTypeList,	
				(json:any) => {return new EIMAccessRoleTypeDomain(json);});

	}
}
