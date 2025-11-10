import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './entity/object.domain';
import { EIMTemplateFileDomain } from './template-file.domain';

/**
 * ファイルオブジェクト作成ドメイン
 */
export class EIMFileObjectCreatorDomain extends EIMObjectDomain {

	/* テンプレートファイル */
	public templateFile: EIMTemplateFileDomain;

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);
		this.templateFile = new EIMTemplateFileDomain(json.templateFile);
	}
}
