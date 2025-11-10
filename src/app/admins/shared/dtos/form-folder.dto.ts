import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * 帳票フォルダDTO
 */
export class EIMFormFolderDTO {

	/** 帳票フォルダID */
	public id = 0;

	/** 帳票フォルダ名称 */
	public name: string = null;

		/** 親帳票フォルダ */
	public parentFolder: EIMFormFolderDTO = null;

	/** 言語リスト */
	public languageList: any = [];

	/** 帳票フォルダリスト */
	public children: EIMFormFolderDTO[] = null;

	/** 帳票数 */
	public formCount = 0;

	/** 帳票数合計 */
	public totalFormCount = 0;

	/** セキュリティID */
	public securityId = 0;

	/** セキュリティ名称 */
	public securityName: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = Number(json.id);
		this.name = json.name;
		this.formCount = json.formCount;
		this.totalFormCount = json.totalFormCount;
		this.securityId = Number(json.securityId);
		this.securityName = json.securityName;
		this.languageList = json.languageList;
		this.parentFolder = json.parentFolder;

		if (json.children) {
			this.children = domainService.createObjectList(json.children, (childrenJson: any) => {return new EIMFormFolderDTO(childrenJson); });
		} else {
			this.children = [];
		}

	}
}
