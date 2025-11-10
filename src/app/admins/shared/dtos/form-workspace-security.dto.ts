
/**
 * 帳票ワークスペースセキュリティDTO
 */
export class EIMFormWorkspaceSecurityDTO {

	/** セキュリティID */
	public id: number;

	/** セキュリティ名 */
	public name: string;

	/** 定義名称 */
	public definitionName: string;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.id = Number(json.id)
			this.name = json.name;
			this.definitionName = json.definitionName;
		}
	}
}
