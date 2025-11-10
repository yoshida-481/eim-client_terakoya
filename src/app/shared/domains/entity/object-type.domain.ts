import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './object.domain';
import { EIMAttributeTypeDomain } from './attribute-type.domain';
import { EIMOtherNameDomain } from './other-name.domain';
import { EIMWorkflowDomain } from './workflow.domain';

/**
 * オブジェクトタイプドメイン
 */
export class EIMObjectTypeDomain {
	/** 属性タイプ一覧 */
	public attributeTypeList?: EIMAttributeTypeDomain[] = [];

	/** オブジェクトタイプID */
	public id? = 0;

	/** オブジェクトタイプ名 */
	public name?: string = null;

	/** オブジェクトタイプ定義名称 */
	public definitionName?: string = null;

	/** オブジェクトタイプ名称一覧 */
	public nameList?: EIMOtherNameDomain[] = [];

	/** 親オブジェクトタイプ */
	public parent?: EIMObjectTypeDomain = null;

	/** 子オブジェクトタイプドメイン一覧 */
	public childList?: EIMObjectTypeDomain[] = [];

	/** オブジェクトタイプオブジェクト */
	public objectTypeObject?: EIMObjectDomain = null;

	/** フォーマット一覧 */
// 	public List<ObjectTypeFormatDomain> objectTypeFormatList = new ArrayList<ObjectTypeFormatDomain>();

	/** ワークフロー */
	public workflow?: EIMWorkflowDomain = null;

	/** 連続データ */
// 	public SequenceDomain sequence = null;

	/** 使用制限一覧表示時の選択対象フラグ */
	public selected? = false;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.attributeTypeList = domainService.createObjectList(json.attributeTypeList,
				(_json: any) => {
					return new EIMAttributeTypeDomain(_json);
				});
		this.id = json.id;
		this.name = json.name;
		this.definitionName = json.definitionName;
		this.nameList = domainService.createObjectList(json.nameList,
				(_json: any) => {
					return new EIMOtherNameDomain(_json);
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
		this.workflow = domainService.createObject(json.workflow,
				(_json: any) => {
					return new EIMWorkflowDomain(_json);
				});
	}
}
