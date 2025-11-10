import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * クラスDTO
 */
export class EIMClassDTO {

	/** ID */
	public id: number;

	/** 名前 */
	public name: string;

	/** リビジョン */
	public revision: number;

	/** 変更日時 */
	public modifyDateTimeString: string;

	/** 最新フラグ */
	public isRootType = false;

	/** タイプ */
	public type: string;

	constructor(json?: any) {

		if (json) {
			this.id = Number(json.attr.objTypeId);
			this.name = json.attr.objTypeName;
			this.isRootType = json.attr.isRootType === 'true' ? true : false;
		}
	}
}
