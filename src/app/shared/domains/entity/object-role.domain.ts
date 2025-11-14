import { Injector } from '@angular/core';
import { EIMOtherNameDomain } from './other-name.domain';
import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * 業務役割情報ドメイン
 */
export class EIMObjectRoleDomain {

	/** オブジェクトロールグループID */
	public id?: number;

	/** オブジェクトロールグループ定義名称 */
	public definitionName?: string;

	/** 表示名称 */
	public name?: string;

	/** 名称一覧 */
	public nameList?: EIMOtherNameDomain[]  = [];

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
		this.definitionName = json.definitionName;
		this.name = json.name;
		this.nameList = domainService.createObjectList(json.nameList,
			(_json: any) => {
				return new EIMOtherNameDomain(_json);
			});
	}
}