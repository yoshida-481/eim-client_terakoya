/**
 * Boxユーザドメイン
 */
export class EIMBoxUserDomain {
	/** ID */
	public id: string;

	/** 名前 */
	public name: string;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json: any) {
		this.id = json.id;
		this.name = json.name;
	}
}
