import { EIMWorkflowDomain } from './../../../admins/shared/domains/workflow.domain';
import { EIMObjectDomain } from './../../../shared/domains/entity/object.domain';
import { EIMObjectTypeDomain } from './../../../shared/domains/entity/object-type.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMContentsLayoutDomain } from './contents-layout.domain';
import { EIMOtherNameDomain } from 'app/shared/domains/entity/other-name.domain';

/**
 * コンテンツタイプドメイン
 */
export class EIMContentsTypeDomain extends EIMFormTypeDomain {

	/** レイアウト情報 */
	public formLayout: EIMContentsLayoutDomain;

	constructor(json?: any) {
		// ドメインプロパティが含まれるためsuperの初期化処理は使用しない
		super();

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);
		this.id = json.id;
		this.name = json.name;
		this.definitionName = json.definitionName;
		this.attributeTypeList = domainService.createObjectList(json.attributeTypeList,
			(_json: any) => {
				return new EIMAttributeTypeDomain(_json);
			});
		this.nameList = domainService.createObjectList(json.nameList,
			(_json: any) => {
				return new EIMOtherNameDomain(_json);
			});
		this.formLayout = domainService.createObject(json.formLayout,
			(_json: any) => {
				return new EIMContentsLayoutDomain(_json);
			});
		this.parent = domainService.createObject(json.parent,
			(_json: any) => {
				return new EIMObjectTypeDomain(_json);
			});
		this.childList = domainService.createObjectList(json.childList,
			(_json: any) => {
				return new EIMObjectTypeDomain(_json);
			});
		this.objectTypeObject = domainService.createObject(json.objectTypeObject,
			(_json: any) => {
				return new EIMObjectDomain(_json);
			});

	// this.formListColumn:EIMFormListColumnDomain = ;
		this.formWorkspaceId = json.formWorkspaceId;
	// this.formTypeFolderList:EIMFormTypeFolderDomain = ;
	}

}
