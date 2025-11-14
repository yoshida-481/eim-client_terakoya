import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMEntryElementDomain } from './entry-element.domain';
import { EIMEventDomain } from './event.domain';
import { EIMObjectDomain } from './object.domain';
import { EIMUserDomain } from './user.domain';
import { EIMAssignmentEntryDomain } from 'app/shared/domains/entity/assignment-entry.domain';

/**
 * アサインドメイン
 */
export class EIMAssignmentDomain {
	/** アサインID */
	public id = 0;

	/** アサインエントリー一覧 */
	public entryList: EIMAssignmentEntryDomain[] = [];

	/** イベント */
	public event: EIMEventDomain = null;

	/** アサイン */
	public entryElement: EIMEntryElementDomain = null;

	/** アサイン対象オブジェクト */
	public object: EIMObjectDomain = null;

	/** エントリタイプ */
	public entryType: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;

		this.event = domainService.createObject(json.event,
				(_json: any) => {
					return new EIMEventDomain(_json);
				});
		this.object = domainService.createObject(json.object,
				(_json: any) => {
					return new EIMObjectDomain(_json);
				});
		this.entryList = domainService.createObjectList(json.entryList,
				(_json: any) => {
					return new EIMAssignmentEntryDomain(_json);
				});
		this.entryType = json.entryType;
		switch (this.entryType) {
			case 'USER':
				this.entryElement = domainService.createObject(json.entryElement,
						(_json: any) => {
							return new EIMUserDomain(_json);
						});
		}
	}
}
