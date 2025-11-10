import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMOtherNameDomain } from 'app/admins/shared/domains/other-name.domain';
import { EIMAdminsPDFOutputDomain } from 'app/admins/shared/domains/pdf-output.domain';

// import { EIMOtherNameDomain } from './other-name.domain';

/**
 * 公開処理設定ドメイン
 */
export class EIMPublishSettingDomain extends EIMAdminsPDFOutputDomain {

	/** 公開ファイルをPDF化 */
	public doPDFConvert = false;

	/** URLを挿入する。 */
	public doPDFURL = false;

	/** 有効期限設定 */
	public doSetTerm = false;
	public termNumParam = '';
	public termUnitParam = '';

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		super(json ? json.attr : json);

		if (!json) {
			return;
		}

		if ( json.attr ) {
			this.doPDFConvert = json.attr.doPDFConvert === 'true' ? true : false;
			this.doPDFURL = json.attr.doPDFURL === 'true' ? true : false;
			this.doSetTerm = json.attr.doSetTerm === 'true' ? true : false;

			this.termNumParam = (!json.attr.termNumParam || !this.doSetTerm)? '' : json.attr.termNumParam;
			this.termUnitParam = json.attr.termUnitParam;

		}

	}

}
