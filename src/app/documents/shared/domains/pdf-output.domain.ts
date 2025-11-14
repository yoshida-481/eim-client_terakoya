import { EIMPublicFileSecurityDomain } from 'app/documents/shared/domains/public-file-security.domain';

/**
 * PDF出力ドメイン
 */
export class EIMPDFOutputDomain extends EIMPublicFileSecurityDomain {

	/** 電子署名設定有無 */
	public doSignPDF = false;
	/** 電子署名設定・セキュリティ設定有無 */
	public doSignPDFAndSetSecurity = false;
	/** 承認日付挿入 */
	public insertApproveDate = false;
	/** 承認者名挿入 */
	public insertApproveUser = '0';
	/** 挿入ページ */
	public insertPage = '0';
	/** 基準点 */
	public insertPlace = '0';
	/** 基準点X軸入力値 */
	public insertPlaceX = 0;
	/** 基準点Y軸入力値 */
	public insertPlaceY = 0;
	/** 承認者名言語 */
	public approveNamelang: string;
	/** 署名用ジョブ名 */
	public signJobName: string;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		this.doSignPDF = json.doSignPDF === 'true';
		this.doSignPDFAndSetSecurity = json.doSignPDFAndSetSecurity === 'true';
		this.insertApproveDate = json.insertApproveDate === 'true';
		this.insertApproveUser = json.insertApproveUser;
		this.insertPage = json.insertPage;
		this.insertPlace = json.insertPlace;
		if (json.insertPlaceX) {
			this.insertPlaceX = Number(json.insertPlaceX);
		}
		if (json.insertPlaceY) {
			this.insertPlaceY = Number(json.insertPlaceY);
		}
		this.approveNamelang = json.approveNamelang;
		this.signJobName = json.signJobName;
	}
}
