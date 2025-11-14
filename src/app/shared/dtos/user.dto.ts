import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * ユーザDTO
 */
export class EIMUserDTO {

	/** ユーザ名 */
	public name: string = null;
	public typeLabel: string = null;

	/** ユーザID */
	public id = 0;

	/** ユーザかな */
	public kana: string;

	/** ユーザコード */
	public code: string = null;

	/** メールアドレス */
	public mail: string = null;

	/** グループ名前一覧 */
	public groupNames: string;
	public groupName: string;

	/** ロール名前一覧 */
	public roleNames: string;
	public roleName: string;

	/** 管理者権限フラグ */
	public admin = 0;

	/** 無効フラグ */
	public disable = false;

	/** 言語 */
	public lang: string = null;

	/** システム管理用無効フラグ */
	public userDisable: string;

	/** アイコンタイプ */
	public typeName = 'user';

	/** コンフィグ */
	public config: any;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.name = json.name;
		this.id = json.id;
		this.kana = json.kana;
		this.code = json.code;
		this.mail = json.mail;
		this.groupNames = json.groupNames;
		this.roleNames = json.roleNames;
		this.admin = json.admin;
		this.disable = json.disable;
		this.lang = json.lang;
		this.config = json.config;
	}
}
