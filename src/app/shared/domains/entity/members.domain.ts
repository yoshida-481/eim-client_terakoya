import { Injector } from '@angular/core';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMMemberEntryDomain } from './member-entry.domain';

/**
 * メンバーズ情報ドメイン
 */
export class EIMMembersDomain {

	/** メンバーズID */
	public id?: number;

	/** メンバエントリリスト */
	public memberEntryList?: EIMMemberEntryDomain[];

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json: any) {

		if (json === null) {
			return this;
		}

		const injector = Injector.create({providers: [{provide: EIMDomainService, deps: []}]});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = Number(json.id);
		this.memberEntryList = domainService.createObjectList(json.memberEntryList,
			(result: any) => {return new EIMMemberEntryDomain(result); });
	}
}