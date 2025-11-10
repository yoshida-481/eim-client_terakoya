/**
 * 公開ファイルセキュリティドメイン
 */
export class EIMPublicFileSecurityDomain {

	/** ドキュメントのオブジェクトID */
	public objId: number;
	/** セキュリティ設定有無 */
	public doSetSecurity = false;
	/** セキュリティパスワード設定有無 */
	public doSetSecurityPassword = false;
	/** セキュリティパスワード */
	public securityPassword = '';
	/** 参照権限設定有無 */
	public doSetReferencePassword = false;
	/** 参照用パスワード */
	public referencePassword = '';
	/** 印刷禁止 */
	public forbidPrint = false;
	/** セキュリティ設定有無 */
	public forbidEdit = false;
	/** セキュリティ設定有無 */
	public forbidAnnotate = false;
	/** セキュリティ設定有無 */
	public forbidReproduce = false;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}
		this.objId = json.objId;
		this.doSetSecurity = json.doSetSecurity === 'true';
		this.doSetSecurityPassword = json.doSetSecurityPassword === 'true';
		this.securityPassword = json.securityPassword;
		this.doSetReferencePassword = json.doSetReferencePassword === 'true';
		this.referencePassword = json.referencePassword;
		this.forbidPrint = json.forbidPrint === 'true';
		this.forbidEdit = json.forbidEdit === 'true';
		this.forbidAnnotate = json.forbidAnnotate === 'true';
		this.forbidReproduce = json.forbidReproduce === 'true';
	}
}
