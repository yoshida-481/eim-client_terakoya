import { EIMUIControlDomain } from './uiControl.domain';
import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

/**
 * データ型ドメイン
 */
export class EIMDataTypeDomain {
	/** タイプ型名称 */
	public type: string;
	/** uiコントロールリスト */
	public uiControlList: EIMUIControlDomain[] = [];
	/** 複数値フラグ */
	public multiple = false;
	/** タイプ型ID */
	public valTypeId: number;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}
		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.type = json.attr.type;
		this.valTypeId = this.convertValTypeId(this.type);
		if (json.singleList) {
			this.uiControlList = domainService.createObjectList(json.singleList.uIControlList.item,
				(_json: any) => {
					this.multiple = false;
					return new EIMUIControlDomain(_json);
			});
		} else if (json.multipleList) {
			this.uiControlList = domainService.createObjectList(json.multipleList.uIControlList.item,
				(_json: any) => {
					this.multiple = true;
					return new EIMUIControlDomain(_json);
			});
		}
	}

	private convertValTypeId(json: string): number {
		if (json === 'long') {
			return EIMAdminsConstantService.VALUE_TYPE_INTEGER;
		} else {
			// return EIMAdminsConstantService.VALUE_TYPE_INTEGER;
			return EIMAdminsConstantService['VALUE_TYPE_' + json.toUpperCase()];
		}
	}
}



