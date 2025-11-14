import { Injector } from '@angular/core';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMEntryElementDomain } from './entry-element.domain';
import { EIMMemberRoleDomain } from './member-role.domain';

/**
 * メンバエントリ情報ドメイン
 */
export class EIMMemberEntryDomain {

	/** メンバエントリID */
	public id?: number = null;

	/** エントリエレメント */
	public entryElement?: EIMEntryElementDomain = null;

	/** メンバロールリスト */
	public memberRoleList?: EIMMemberRoleDomain[] = null;

	/** エントリタイプ */
	public entryType?: string = null;

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
		this.entryElement = json.entryElement;
		this.memberRoleList = domainService.createObjectList(json.memberRoleList,
			(result: any) => {return new EIMMemberRoleDomain(result); });
		this.entryType = json.entryType;
	}
}