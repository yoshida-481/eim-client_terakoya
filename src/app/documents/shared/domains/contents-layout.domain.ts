import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMFormLayoutDomain } from 'app/shared/domains/form-layout.domain';
import { EIMContentsObjectTypeLayoutDomain } from './contents-object-type-layout.domain';

/**
 * コンテンツレイアウトドメイン
 */
export class EIMContentsLayoutDomain extends EIMFormLayoutDomain {

	/** オブジェクトタイプレイアウト */
	public objectTypeLayout: EIMContentsObjectTypeLayoutDomain;

	constructor(json?: any) {
		// ドメインプロパティが含まれるためsuperの初期化処理は使用しない
		super();

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.objectTypeLayout = domainService.createObject(json.objectTypeLayout,
				(_json: any) => {
					return new EIMContentsObjectTypeLayoutDomain(_json);
				});
// 		this.currentStatusTypeLayout = domainService.createObject(json.currentStatusTypeLayout,
// 		(json: any) => {return new EIMStatusTypeLayoutDomain(json);});
// 		this.pastStatusTypeLayout = domainService.createObjectList(json.pastStatusTypeLayout,
// 		(json: any) => {return new EIMStatusTypeLayoutDomain(json);});
	}
}
