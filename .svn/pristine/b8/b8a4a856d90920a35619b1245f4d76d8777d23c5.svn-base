import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './object.domain';
import { EIMAttributeDomain } from './attribute.domain';
import { EIMAssignmentDomain } from './assignment.domain';
import { EIMUserDomain } from './user.domain';
import { EIMOtherNameDomain } from './other-name.domain';
import { EIMStatusTypeDomain } from './status-type.domain';

/**
 * ステータスドメイン
 */
export class EIMStatusDomain {

	/** アサイン一覧 */
	public assignmentList: EIMAssignmentDomain[] = [];

	/** ステータス属性一覧 */
	public attributeList: EIMAttributeDomain[] = [];

	/** ステータス作成ユーザー */
	public creationUser: EIMUserDomain = null;

	/** ステータス作成日 */
	public creationDate: Date = null;

	/** ステータス更新ユーザ */
	public modificationUser: EIMUserDomain = null;

	/** ステータス更新日 */
	public modificationDate: Date = null;

	/** ステータスID */
	public id  = 0;

	/** ステータス作成順 */
	public sequence  = 0;

	/** ステータスタイプ */
	public type: EIMStatusTypeDomain = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.assignmentList = domainService.createObjectList(json.assignmentList,
				(_json: any) => {
					return new EIMAssignmentDomain(_json);
				});
		this.attributeList = domainService.createObjectList(json.attributeList,
				(_json: any) => {
					return new EIMAttributeDomain(_json);
				});
		this.creationUser = domainService.createObject(json.creationUser,
				(_json: any) => {
					return new EIMUserDomain(_json);
				});
		this.creationDate = domainService.createObject(json.creationDate,
				(_json: any) => {
					return domainService.convertDate(_json);
				});
		this.modificationUser = domainService.createObject(json.modificationUser,
				(_json: any) => {
					return new EIMUserDomain(_json);
				});
		this.modificationDate = domainService.createObject(json.modificationDate,
				(_json: any) => {
					return domainService.convertDate(_json);
				});
		this.id = json.id;
		this.sequence = json.sequence;
		this.type = domainService.createObject(json.type,
				(_json: any) => {
					return new EIMStatusTypeDomain(_json);
				});
	}
}
