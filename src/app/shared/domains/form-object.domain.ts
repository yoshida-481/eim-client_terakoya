import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';

/**
 * 帳票オブジェクトドメイン
 */
export class EIMFormObjectDomain extends EIMObjectDomain {
	/** 公開ファイル名 */
	public publicFileName: string = null;

	/** PDF変換処理実行日時 */
	public pdfConversionExecutedDate: Date = null;

	/** 公開PDF事前登録日時 */
	public pdfPreRegistDate: Date = null;
	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		super(json);
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.publicFileName = json.publicFileName;
		this.pdfConversionExecutedDate = domainService.convertDate(json.pdfConversionExecutedDate);
		this.pdfPreRegistDate = domainService.convertDate(json.pdfPreRegistDate);
	}
}
