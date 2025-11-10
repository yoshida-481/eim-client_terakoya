import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectTypeLayoutDomain } from './object-type-layout.domain';
import { EIMStatusTypeLayoutDomain } from './status-type-layout.domain';

/**
 * フォームレイアウトドメイン
 */
export class EIMFormLayoutDomain {

	/** オブジェクトタイプレイアウト */
	public objectTypeLayout: EIMObjectTypeLayoutDomain;

	/** ステータスタイプレイアウト(現在ステータス) */
 	public currentStatusTypeLayout: EIMStatusTypeLayoutDomain;

	/** ステータスタイプレイアウト一覧(過去ステータス) */
	public pastStatusTypeLayout: EIMStatusTypeLayoutDomain[] = null;

	/** 階層レイアウトかどうか */
	public isHierarchicalLayout = false;


	constructor(json?: any) {

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		if (json.objectTypeLayout) {
			this.objectTypeLayout = domainService.createObject(json.objectTypeLayout,
					(_json: any) => {
						return new EIMObjectTypeLayoutDomain(_json);
					});
		}
		if (json.currentStatusTypeLayout) {
			this.currentStatusTypeLayout = domainService.createObject(json.currentStatusTypeLayout,
					(_json: any) => {
						return new EIMStatusTypeLayoutDomain(_json);
					});
		}
		if (json.pastStatusTypeLayout) {
			// サーバサイドの命名規約違反のための対応
			this.pastStatusTypeLayout = domainService.createObjectList(json.pastStatusTypeLayout,
				(_json: any) => {
					return new EIMStatusTypeLayoutDomain(_json);
				});
		}
		if (json.isHierarchicalLayout === true) {
			this.isHierarchicalLayout = true;
		}
	}
}
