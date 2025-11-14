import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectTypeDomain } from './entity/object-type.domain';
import { EIMFormLayoutDomain } from './form-layout.domain';
import { EIMFormListColumnDomain } from './form-list-column.domain';
import { EIMFormTypeFolderDomain } from 'app/shared/domains/form-type-folder.domain';

/**
 * フォームタイプドメイン
 */
export class EIMFormTypeDomain extends EIMObjectTypeDomain {

	/** レイアウト情報 */
	public formLayout: EIMFormLayoutDomain;

	/** 表示列情報 */
	public formListColumn: EIMFormListColumnDomain;

	/** 帳票ワークスペースID */
	public formWorkspaceId: number;

	/** 帳票タイプフォルダ一覧 */
 	public formTypeFolderList: EIMFormTypeFolderDomain[] = [];

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.formLayout = domainService.createObject(json.formLayout,
				(_json: any) => {
					return new EIMFormLayoutDomain(_json);
				});

		this.formListColumn = domainService.createObject(json.formListColumn,
				(_json: any) => {
					return new EIMFormListColumnDomain(_json);
				});

		this.formWorkspaceId = json.formWorkspaceId;
 		this.formTypeFolderList = domainService.createObject(json.formTypeFolderList,
				(_json: any) => {
					return new EIMFormListColumnDomain(_json);
				});
	}
}
