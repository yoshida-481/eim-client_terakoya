import { EIMSimpleObjectDTO } from "app/shared/dtos/simple-object.dto";

/**
 * 処理待ち一覧DTO
 */
export class EIMProcessingWaitingListDTO {

	/** ワークスペース名 */
	public workspaceName: string;

	/** タスクID */
	public taskId: number;

	/** タスク名 */
	public taskName: string;

	/** 担当者 */
	public tantoUserName: string;

	/** ステータス名 */
	public statusName: string;

	/** 開始予定日 */
	public startYoteiDate: Date;

	/** 終了予定日 */
	public endYoteiDate: Date;

	/** 進捗率 */
	public progressRate: number;

	/** 依頼日時 */
	public orderDate: Date;

	/** 依頼者 */
	public orderUserName: string;

	/** タスクの親オブジェクト */
	public parent: EIMSimpleObjectDTO;
	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}

		this.workspaceName = json.workspaceName;
		this.taskId = json.taskId;
		this.taskName = json.taskName;
		this.tantoUserName = json.tantoUserName;
		this.statusName = json.statusName;
		this.startYoteiDate = json.startYoteiDate;
		this.endYoteiDate = json.endYoteiDate;
		this.progressRate = json.progressRate;
		this.orderDate = json.orderDate;
		this.orderUserName = json.orderUserName;

		this.parent = json.parent;
	}

}
