import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from 'app/admins/shared/dtos/admin.dto';

/**
 * リレーションDTO
 */
export class EIMRelationTypeDTO implements EIMAdminDTO {

	/** ID */
	public id: number;

	/** 名前 */
	public label: string;

	/** ブランチフラグ */
	public isBranch = false;

	/** アイコンタイプ */
	public typeName = 'relation';

	/** アイコンタイプ */
	public typeLabel: string;

		/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.id = Number(json.attr.relationTypeId);
			this.label = json.attr.label;
			this.typeLabel = this.label;
			this.isBranch = json.attr.isBranch === 'true' ? true : false;
		}
	}
}
