import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMEventExecFormDomain } from 'app/shared/domains/event-exec.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMEventTypeDomain } from 'app/shared/domains/entity/event-type.domain';

/**
 * フォームドメイン
 */
export class EIMFormEventExecDomain extends EIMEventExecFormDomain {

	/** アサイン先設定が『選択』の場合に指定する依頼先ユーザ一覧 */
	public assignmentUserList: EIMUserDomain[] = [];

	/** 追加のメール通知先ユーザ一覧 */
	public mailAddedList: EIMUserDomain[] = [];

	/** コメント */
	public comment: String = null;

	/** 遷移先イベントタイプ */
	public eventType: EIMEventTypeDomain = null;

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.assignmentUserList = domainService.createObjectList(json.assignmentUserList,
				(_json: any) => {
					return new EIMUserDomain(_json);
				});
		this.mailAddedList = domainService.createObjectList(json.mailAddedList,
				(_json: any) => {
					return new EIMUserDomain(_json);
				});
		this.comment = json.comment;
		this.eventType = domainService.createObject(json.eventType,
				(_json: any) => {
					return new EIMEventTypeDomain(_json);
				});
	}
}
