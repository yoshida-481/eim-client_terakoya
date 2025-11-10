import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';

/**
 * セキュリティDTO
 */
export class EIMSecurityDTO {

	/** ID */
	public id: number;

	/** セキュリティID */
	public secId: number;

	/** セキュリティ名前 */
	public secName: string;

	/** ラベル */
	public label: string;

	/** ブランチフラグ */
	public isBranch = false;

	/** アイコンタイプ */
	public typeName = 'security';

	/** アイコンタイプ */
	public typeLabel: string;

		/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.secId = Number(json.attr.secId);
			this.id = json.attr.secId;
			this.label = json.attr.label;
			this.secName = this.label;
			this.typeLabel = this.label;
			this.isBranch = json.attr.isBranch === 'true' ? true : false;
		}
	}
}
