import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * 帳票タイプDTO
 */
export class EIMWorkspaceFormTypeDTO {

	/** 帳票タイプID */
	public id = 0;

	/** オブジェクトタイプ：帳票 */
	public objectType: string = null;

	/** ルートタイプフラグ */
	public isRootType: boolean;

	/** ルートタイプ名称 */
	public rootTypeDefName: string ;

	/** 帳票タイプID */
	public formTypeId = 0;

	/** 帳票タイプ定義名称 */
	public definitionName: string = null;

	/** 帳票タイプ名称 */
	public formTypeName: string = null;

	/** 帳票タイプパス */
	public path = '/';

	/** ワークフローID */
	public workflowId: string = null;

	/** ワークフロー名称 */
	public workflowName: string = null;

	/** 帳票タイプリスト */
	public children: EIMWorkspaceFormTypeDTO[] = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}
		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.formTypeId = Number(json.id);
		this.id = this.formTypeId;
		this.definitionName = json.definitionName;
		this.formTypeName = json.name;
		this.workflowName = json.workflowName;

		this.isRootType = json.isRootType;
		this.rootTypeDefName = json.rootTypeDefName;

		if (json.children) {
			this.children = domainService.createObjectList(json.childrenType, (childrenJson: any) => {return new EIMWorkspaceFormTypeDTO(childrenJson); });
		} else {
			this.children = [];
		}
	}
}
