import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * 多言語ドメイン
 */
export class EIMOtherNameDomain {

	/** 言語ID(JA/EN) */
	public lang: string = null;

	/** 名前 */
	public value: string = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		this.lang = json.attr.lang;
		this.value = json.attr.value;
	}
}
