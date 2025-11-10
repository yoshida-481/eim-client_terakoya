import { EIMPublicFileSecurityDomain } from 'app/documents/shared/domains/public-file-security.domain';
import { EIMPDFOutputDomain } from 'app/documents/shared/domains/pdf-output.domain';

/**
 * PDF出力ドメイン
 */
export class EIMAdminsPDFOutputDomain extends EIMPDFOutputDomain {

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		this.doSignPDFAndSetSecurity = json.doSignAndSetSecurity === 'true';
	}
}
