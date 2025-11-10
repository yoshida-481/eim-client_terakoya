import { EIMBoxObjectDomain } from 'app/shared/domains/box-object.domain';

/**
 * Boxファイルドメイン
 */
export class EIMBoxFileDomain extends EIMBoxObjectDomain {
	/** 履歴 */
	public revision: number;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json: any) {
		super(json);
		this.revision = json.revision;
	}
}
