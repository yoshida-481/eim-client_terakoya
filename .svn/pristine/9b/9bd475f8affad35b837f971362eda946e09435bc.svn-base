import { Injector } from '@angular/core';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMObjectRoleDomain } from './object-role.domain';

/**
 * メンバロール情報ドメイン
 */
export class EIMMemberRoleDomain {

	/** メンバロールID */
	public id?: number;

	/** オブジェクトロール */
	public objectRole?: EIMObjectRoleDomain;

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
		this.objectRole = new EIMObjectRoleDomain(json.objectRole);
	}
}