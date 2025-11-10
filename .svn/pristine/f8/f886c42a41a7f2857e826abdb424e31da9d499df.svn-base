import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeTypeDomain } from './attribute-type.domain';
import { EIMBaseEventTypeDomain } from './base-event-type.domain';
import { EIMGuardConditionDomain } from './guard-condition.domain';
import { EIMNoticeMailDomain } from './notice-mail.domain';
import { EIMStatusTypeDomain } from './status-type.domain';

/**
 * イベントタイプドメイン
 */
export class EIMEventTypeDomain {
	/** イベント属性タイプ一覧 */
	public attributeTypeList: EIMAttributeTypeDomain[] = [];

	/** 継承するベースイベントタイプ */
	public base: EIMBaseEventTypeDomain = null;

	/** イベントタイプ定義名称 */
	public definitionName: string = null;

	/** 遷移元ステータスタイプ */
	public fromStatusType: EIMStatusTypeDomain = null;

	/** ガード条件 */
	public guardCondition: EIMGuardConditionDomain = null;

	/** イベントタイプID */
	public id = 0;

	/** 通知メール一覧 */
	public noticeMailList: EIMNoticeMailDomain[] = [];

	/** 同一遷移元ステータスタイプ、同一ベースイベント内での優先度 */
	public priority = 0;

	/** 遷移先ステータスタイプ */
	public toStatusType: EIMStatusTypeDomain = null;

	/** イベントタイプ名称一覧 */
// public List<OtherNameDomain> nameList = new ArrayList<OtherNameDomain>();

	/** イベントタイプ名 */
	public name: string = null;


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
		this.base = domainService.createObject(json.base,
				(_json: any) => {
					return new EIMBaseEventTypeDomain(_json);
				});
		this.definitionName = json.definitionName;
		this.fromStatusType = domainService.createObject(json.fromStatusType,
				(_json: any) => {
					return new EIMStatusTypeDomain(_json);
				});
		this.guardCondition = domainService.createObject(json.guardCondition,
				(_json: any) => {
					return new EIMGuardConditionDomain(_json);
				});
		this.id = json.id;
		this.noticeMailList = domainService.createObjectList(json.noticeMailList,
				(_json: any) => {
					return new EIMNoticeMailDomain(_json);
				});
		this.priority = json.priority;
		this.toStatusType = domainService.createObject(json.toStatusType,
				(_json: any) => {
					return new EIMStatusTypeDomain(_json);
				});
		this.name = json.name;
	}
}
