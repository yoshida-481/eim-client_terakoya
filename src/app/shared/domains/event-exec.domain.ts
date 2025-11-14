import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './entity/object.domain';
import { EIMFormLayoutDomain } from './form-layout.domain';
import { EIMAccessRoleTypeDomain } from './entity/access-role-type.domain';
import { EIMBaseEventTypeDomain } from './entity/base-event-type.domain';
import { EIMNoticeMailDomain } from './entity/notice-mail.domain';

/**
 * フォームドメイン
 */
export class EIMEventExecFormDomain {

	/** 実行対象オブジェクト */
	public object: EIMObjectDomain = null;

	/** 実行対象のベースイベントタイプ */
	public baseEventType: EIMBaseEventTypeDomain = null;

	/** 実行時に即時送信するメール一覧 */
	public immediateMailList: EIMNoticeMailDomain[] = [];

	/** 実行時に定時送信するメール一覧 */
	public accumulationMailList: EIMNoticeMailDomain[] = [];

	/** 実行時に送信しないメール一覧 */
	public nothingMailList: EIMNoticeMailDomain[] = [];

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);
		this.object = domainService.createObject(json.object,
				(_json: any) => {
					return new EIMObjectDomain(_json);
				});

		this.immediateMailList = domainService.createObjectList(json.immediateMailList,
				(_json: any) => {
					return new EIMNoticeMailDomain(_json);
				});
		this.accumulationMailList = domainService.createObjectList(json.accumulationMailList,
				(_json: any) => {
					return new EIMNoticeMailDomain(_json);
				});
		this.nothingMailList = domainService.createObjectList(json.nothingMailList,
				(_json: any) => {
					return new EIMNoticeMailDomain(_json);
				});
	}
}
