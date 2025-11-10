import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeTypeDomain } from './entity/attribute-type.domain';
import { EIMOtherNameDomain } from './entity/other-name.domain';

import { EIMHierarchicalLayoutDomain } from './hierarchical-layout.domain';
import { EIMNonHierarchicalGroupDomain } from './non-hierarchical-group.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

/**
 * 階層グループドメイン
 */
export class EIMHierarchicalGroupDomain extends EIMHierarchicalLayoutDomain {

	/** 階層レイアウトの一覧 */
	public hierarchicalLayoutList: EIMHierarchicalLayoutDomain[] = [];

	/** 階層グループ名一覧 */
	public labelList: EIMOtherNameDomain[] = [];

	/** 初期折り畳み表示フラグ true:折り畳みしないで表示、false:折り畳みして表示  */
	public defaultExpand = false;

	/** 階層レベル 0,1,2,… */
	public _level = 0;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any, level = 0) {
		super(json);

		if (!json) {
			return;
		}
		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const localStorageServiceProviders: StaticProvider[] = [{ provide: EIMLocalStorageService, useClass: EIMLocalStorageService }];
		const injectorDomainService = Injector.create({providers});
		const domainService: EIMDomainService = injectorDomainService.get(EIMDomainService);
		const injectorLocalStorageService = Injector.create( { providers: localStorageServiceProviders });
		const localStorageService: EIMLocalStorageService = injectorLocalStorageService.get(EIMLocalStorageService);

		if (json.hierarchicalLayoutList && level <= 3) {
			// 3階層目までしか読み込まない
			this.hierarchicalLayoutList = domainService.createObjectList(json.hierarchicalLayoutList,
				(_json: any) => {
					if (_json.attributeTypeLayout) {
						return new EIMNonHierarchicalGroupDomain(_json);
					} else {
						return new EIMHierarchicalGroupDomain(_json, level + 1);
					}
				});
		}
		if (json.labelList) {
			this.labelList = domainService.createObjectList(json.labelList,
				(_json: any) => {
					return new EIMOtherNameDomain(_json);
				});
		}
		// 言語設定と一致しないラベルを削除
		const lang = localStorageService.getLangId();
		for (let i = this.labelList.length + (-1) ; i >= 0; i--) {
			if (this.labelList[i].langId !== lang) {
				this.labelList.splice(i, 1);
			}
		}
		this.defaultExpand = json.defaultExpand;
		this._level = level;
	}
}
