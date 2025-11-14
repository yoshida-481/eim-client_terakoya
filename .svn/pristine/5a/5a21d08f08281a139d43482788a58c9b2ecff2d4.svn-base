import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectTypeDomain } from './object-type.domain';
import { EIMAttributeDomain } from './attribute.domain';
import { EIMUserDomain } from './user.domain';
import { EIMSecurityDomain } from './security.domain';
import { EIMStatusDomain } from './status.domain';

/**
 * オブジェクトドメイン
 */
export class EIMObjectDomain {
	/** 属性リスト */
	public attributeList: EIMAttributeDomain[] = [];

	/** 作成ユーザ */
	public creationUser: EIMUserDomain = null;

	/** 作成日 */
	public creationDate: Date = null;

	/** オブジェクトID */
	public id = 0;

	/** 最新履歴フラグ */
	public latest = false;

	/** ロックユーザ */
	public lockUser: EIMUserDomain = null;

	/** ロック日 */
	public lockDate: Date = null;

	/** 更新ユーザ */
	public modificationUser: EIMUserDomain = null;

	/** 更新日 */
	public modificationDate: Date = null;

	/** オブジェクト名 */
	public name: string = null;

	/** オブジェクトタイプ */
	public type: EIMObjectTypeDomain = null;

	/** リビジョン番号 */
	public revision = 0;

	/** セキュリティ */
 	public security: EIMSecurityDomain = null;

	/** ステータス */
 	public status: EIMStatusDomain = null;

	/** ステータスタイプ名 */
	public statusTypeName: string = null;

	/** リビジョングループID */
	public revisionGroupId = 0;

	/** ステータスリスト */
 	public statusList: EIMStatusDomain[] = [];

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

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
		this.id = json.id;
		this.latest = json.latest;
		this.lockUser = domainService.createObject(json.lockUser,
				(_json: any) => {
					return new EIMUserDomain(_json);
				});
		this.lockDate = domainService.createObject(json.lockDate,
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
		this.name = json.name;
		this.type = domainService.createObject(json.type,
				(_json: any) => {
					return new EIMObjectTypeDomain(_json);
				});
		this.revision = json.revision;
		this.security = domainService.createObject(json.security,
				(_json: any) => {
					return new EIMSecurityDomain(_json);
				});
		this.status = domainService.createObject(json.status,
				(_json: any) => {
					return new EIMStatusDomain(_json);
				});
		this.statusTypeName = json.statusTypeName;
		this.revisionGroupId = json.revisionGroupId;
		this.statusList = domainService.createObjectList(json.statusList,
				(_json: any) => {
					return new EIMStatusDomain(_json);
				});
	}
}
