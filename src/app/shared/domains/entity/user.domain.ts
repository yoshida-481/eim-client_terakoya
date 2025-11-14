import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMEntryElementDomain } from './entry-element.domain';
import { EIMObjectDomain } from './object.domain';
import { EIMOtherNameDomain } from './other-name.domain';
import { EIMGroupDomain } from 'app/shared/domains/entity/group.domain';
import { EIMRoleDomain } from 'app/shared/domains/entity/role.domain';

/**
 * ユーザドメイン
 */
export class EIMUserDomain implements EIMEntryElementDomain {

	public name = null;
	/** ユーザID */
	public id = 0;

	/** ユーザコード */
	public code: string = null;

	/** ユーザ名称一覧 */
	private nameList: EIMOtherNameDomain[] = [];

	/** ユーザ定義名称 */
	public definitionName: string = null;

	/** かな名称 */
	public kana: string = null;

	/** メールアドレス */
	public mail: string = null;

	/** 管理者権限フラグ */
	public admin = 0;

	/** 無効フラグ */
	public disable = false;

	/** 言語 */
	public lang: string = null;

	/** グループ一覧 */
 	public groupList: EIMGroupDomain[] = [];

	/** ロール一覧 */
 	public roleList: EIMRoleDomain[] = [];

	/** ユーザオブジェクト */
	public userObject: EIMObjectDomain = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);
		this.name = json.name;
		this.id = json.id;
		this.code = json.code;
		this.nameList = domainService.createObjectList(json.nameList,
				(_json: any) => {
					return new EIMOtherNameDomain(_json);
				});
		this.definitionName = json.definitionName;
		this.kana = json.kana;
		this.mail = json.mail;
		this.admin = json.admin;
		this.disable = json.disable;
		this.lang = json.lang;
		this.groupList = domainService.createObjectList(json.groupList,
				(_json: any) => {
					return new EIMGroupDomain(_json);
				});
		this.roleList = domainService.createObjectList(json.roleList,
				(_json: any) => {
					return new EIMRoleDomain(_json);
				});
		this.userObject = domainService.createObject(json.userObject,
				(_json: any) => {
					return new EIMObjectDomain(_json);
				});

	}
}
