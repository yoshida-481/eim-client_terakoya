import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * 承認ユーザDTO
 */
 export class EIMApproveUserDTO {

	/** ID */
	public id: number;

	/** エントリタイプ */
	public entryType: string;

	/** 承認者名 */
	public name: string;

	/**  */
	public approve: boolean;

	/**  */
	public must: boolean;

	constructor(json?: any) {
		if (!json) {
			return;
		}
		this.id = Number(json.attr.id);
		this.entryType = json.attr.entryType;
		this.name = json.attr.name;
		this.approve = json.attr.approve === 'true' ? true : false;
		this.must = json.attr.must === 'true' ? true : false;
	}
}
