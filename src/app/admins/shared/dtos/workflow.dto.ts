import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * ワークフローDTO
 */
export class EIMWorkflowDTO {

	/** ID */
	public id: number;

	/** 名前 */
	public name: string;

	/** リビジョン */
	public revision: number;

	/** 変更日時 */
	public modifyDateTimeString: string;

	/** 最新フラグ */
	public isLatest = false;

	/** タイプ */
	public type: string;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.id = Number(json.attr.workFlowId);
			this.name = json.attr.workFlowName;
			this.revision = Number(json.attr.workFlowRev);
			this.modifyDateTimeString = json.attr.mdate;
			this.isLatest = json.attr.islatest === 'true' ? true : false;
			this.type = json.attr.type;
		}
	}
}
