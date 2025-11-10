
/**
 * 処理履歴DTO
 */
export class EIMProcessingHistoryDTO {

	/** オブジェクトID */
	public objId: number;

	/** ユーザ名 */
	public userName: string;

	/** イベントID */
	public eventId: number;

	/** イベント名称 */
	public eventTypeName: string;

	/** イベント実施日 */
	public createDate: Date;

	/** コメント */
	public comment: string;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}

		this.objId = json.objId;
		this.userName = json.userName;
		this.eventId = json.eventId;
		this.eventTypeName = json.eventTypeName;
		this.createDate = json.createDate;
		this.comment = json.comment;
	}

}
