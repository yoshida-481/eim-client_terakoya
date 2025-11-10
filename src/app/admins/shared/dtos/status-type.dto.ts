import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';


/**
 * ステータスタイプTO
 */
export class EIMStatusTypeDTO {

	/** ID */
	public id: number;

	/** ステータスタイプID */
	public statusTypeId: number;

	/** ステータスタイプ名前 */
	public statusTypeName: string;

	/** ステータスタイプ種類 */
	public statusTypeKind: string;

	/** ステップ */
	public step: number;

		/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.statusTypeId = Number(json.attr.statusTypeId);
			this.id = this.statusTypeId;
			this.statusTypeName = json.attr.statusTypeName;
			this.statusTypeKind = json.attr.statusTypeKind;
			this.step = Number(json.attr.step);
		}
	}
}
