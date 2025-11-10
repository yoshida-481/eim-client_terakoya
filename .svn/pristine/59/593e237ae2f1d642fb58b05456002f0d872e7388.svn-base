import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';


/**
 * テンプレートファイルDTO
 */
export class EIMTemplateFileDTO {

	/** 画面表示名称 */
	public displayName: string = null;

	/** ファイル格納パス */
	public filePath: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);
		this.displayName = json.displayName;
		this.filePath = json.filePath;
	}
}
