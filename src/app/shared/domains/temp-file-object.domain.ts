import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './entity/object.domain';
import { EIMDuplicateCheckModeDomain } from './duplication-check-mode.domain';

/**
 * 一時ファイルオブジェクトドメイン
 */
export class EIMTempFileObjectDomain {

	/* サーバ上の一時ファイルのパス */
	public tempFilePath: string;

	/* 作成対象のオブジェクト */
	public object: EIMObjectDomain;

	/* 重複チェックモード */
	public duplicateCheckMode: EIMDuplicateCheckModeDomain;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.tempFilePath = json.tempFilePath;
		this.object = new EIMObjectDomain(json.object);
		this.duplicateCheckMode = new EIMDuplicateCheckModeDomain(json.duplicateCheckMode);
	}
}
