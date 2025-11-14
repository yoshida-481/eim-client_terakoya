import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeDomain } from './attribute.domain';
import { EIMEventTypeDomain } from './event-type.domain';
import { EIMUserDomain } from './user.domain';
import { EIMStatusDomain } from './status.domain';

/**
 * イベントドメイン
 */
export class EIMEventDomain {

	/** イベントID */
	public id = 0;

	/** イベントタイプ */
	public type: EIMEventTypeDomain = null;

	/** 遷移元ステータス */
	public fromStatus: EIMStatusDomain = null;

	/** 遷移先ステータス */
	public toStatus: EIMStatusDomain = null;

	/** イベント実行ユーザー */
	public creationUser: EIMUserDomain = null;

	/** イベント実行日 */
	public creationDate: Date = null;

	/** イベント属性一覧 */
	public attributeList: EIMAttributeDomain[] = [];

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.type = domainService.createObject(json.type,
				(_json: any) => {
					return new EIMEventTypeDomain(_json);
				});
		this.fromStatus = domainService.createObject(json.fromStatus,
				(_json: any) => {
					return new EIMStatusDomain(_json);
				});
		this.toStatus = domainService.createObject(json.toStatus,
				(_json: any) => {
					return new EIMStatusDomain(_json);
				});
		this.creationUser = domainService.createObject(json.creationUser,
				(_json: any) => {
					return new EIMUserDomain(_json);
				});
		this.creationDate = domainService.createObject(json.creationDate,
				(_json: any) => {
					return domainService.convertDate(_json);
				});
		this.attributeList = domainService.createObjectList(json.attributeList,
				(_json: any) => {
					return new EIMAttributeDomain(_json);
				});

	}
}
