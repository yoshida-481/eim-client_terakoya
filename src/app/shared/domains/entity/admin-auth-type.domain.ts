import { Injector } from '@angular/core';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMOtherNameDomain } from './other-name.domain';

/**
 * 管理者権限ドメイン
 */
export class EIMAdminAuthTypeDomain {

	/** アプリケーショーンID */
	public appId: string = null;

	/** 管理者権限ID */
	public id: string = null;

	/** 管理者権限値 */
	public value: string = null;

	/** 管理者権限名称一覧 */
	public nameList: EIMOtherNameDomain[] = [];

	/** セッション言語名称 */
	public name: string = null;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}

		const injector = Injector.create({ providers: [{ provide: EIMDomainService, deps: [] }] });
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.appId = json.appId;
		this.id = json.id;
		this.value = json.value;
		this.nameList = domainService.createObjectList(json.nameList,
			(_json: any) => {
				return new EIMOtherNameDomain(_json);
			});
		this.name = json.name;
	}
}
