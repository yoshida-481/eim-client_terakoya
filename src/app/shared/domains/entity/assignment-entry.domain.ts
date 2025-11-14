import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMEntryElementDomain } from './entry-element.domain';
import { EIMUserDomain } from './user.domain';

/**
 * アサインドメイン
 */
export class EIMAssignmentEntryDomain {
	/** アサインエントリーID */
	public id = 0;

	/** エントリー */
	public entryElement: EIMEntryElementDomain = null;

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
