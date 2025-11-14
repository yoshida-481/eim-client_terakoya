import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMEntryElementDomain } from './entry-element.domain';
import { EIMObjectDomain } from './object.domain';
import { EIMOtherNameDomain } from './other-name.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';

/**
 * ロールドメイン
 */
export class EIMRoleDomain implements EIMEntryElementDomain {

	/** 名称 */
	name: string = null;

	/** ロールID */
	public id = 0;

	/** ロール名称一覧 */
	public nameList: EIMOtherNameDomain[] = [];

	/** 子ロールドメイン一覧 */
	public childList: EIMRoleDomain[] = [];

	/** ロール定義名称  */
	public definitionName: string	= null;

	/** 親ロール */
	public parent: EIMRoleDomain = null;

	/** ユーザ一覧 */
	public userList: EIMUserDomain[] = [];

	/** ロールオブジェクト */
	public roleObject: EIMObjectDomain = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.name = json.name;
		this.id = json.id;
		this.nameList = domainService.createObjectList(json.nameList,
				(_json: any) => {
					return new EIMOtherNameDomain(_json);
				});
		this.childList = domainService.createObjectList(json.childList,
				(_json: any) => {
					return new EIMRoleDomain(_json);
				});
		this.definitionName = json.definitionName;
		this.parent = domainService.createObject(json.parent,
				(_json: any) => {
					return new EIMRoleDomain(_json);
				});
		this.userList = domainService.createObjectList(json.userList,
				(_json: any) => {
					return new EIMUserDomain(_json);
				});
		this.roleObject = domainService.createObject(json.roleObject,
				(_json: any) => {
					return new EIMObjectDomain(_json);
				});
	}
}
