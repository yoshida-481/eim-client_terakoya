import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './object.domain';
import { EIMAttributeDomain } from './attribute.domain';
import { EIMBaseStatusTypeDomain } from './base-status-type.domain';
import { EIMUserDomain } from './user.domain';
import { EIMOtherNameDomain } from './other-name.domain';
import { EIMAssignmentEntryDomain } from './assignment-entry.domain';

/**
 * ステータスタイプドメイン
 */
export class EIMStatusTypeDomain {

	/** アサインエントリー一覧 */
	public assignmentEntryList: EIMAssignmentEntryDomain[] = [];

	/** 属性タイプ一覧 */
// public List<AttributeTypeDomain> attributeTypeList = new ArrayList<AttributeTypeDomain>();

	/** アサイン自動 */
	public auto = false;

	/** ステータスタイプ定義名称 */
	public definitionName: string = null;

	/** ステータスタイプID */
	public id = 0;

	/** ステータスタイプ名称一覧 */
// public List<OtherNameDomain> nameList = new ArrayList<OtherNameDomain>();
	/** ステータスタイプ名称 */
	public name: string = null;

	/** ステータスタイプの並び順 */
	public sequence  = 0;

	/** ベースステータスタイプ */
	public base: EIMBaseStatusTypeDomain = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.assignmentEntryList = domainService.createObjectList(json.assignmentEntryList,
				(_json: any) => {
					return new EIMAssignmentEntryDomain(_json);
				});
		this.auto = (json.auto === true);
		this.definitionName = json.definitionName;
		this.id = json.id;
		this.name = json.name;
		this.sequence = json.sequence;
		this.base = domainService.createObject(json.base,
				(_json: any) => {
					return new EIMBaseStatusTypeDomain(_json);
				});
	}
}
