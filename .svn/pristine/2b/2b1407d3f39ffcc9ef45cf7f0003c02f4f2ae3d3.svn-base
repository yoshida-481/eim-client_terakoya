import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * エントリDTO
 */
export class EIMEntryDTO {

	/** ID */
	public id: number;

	/** オブジェクトID */
	public objId: number;

	/** エントリID */
	public entryId: number;

	/** タイプID */
	public entryTypeId: number;

	/** タイプ名 */
	public entryTypeName: string;

	/** エントリ名称 */
	public entryName: string;

	/** エントリーオブジェクト名称 */
	public entryObjName: string;

	/** 優先順位 */
	public priority: string;

	/** ロール名称 */
	public roleName: string;

	/** グループ名称 */
	public groupName: string;

	/** アクセスエントリーオブジェクトID */
	public entryObjId: number;

	public userDisable: number;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			if (json.hasOwnProperty('attr')) {
				json = Object.assign({}, json.attr);
			}
			this.id = Number(json.entryId);
			this.objId = this.id;
			this.entryId = this.id;
			this.entryTypeId = Number(json.entryTypeId);
			this.entryTypeName = json.entryTypeName;
			this.entryName = json.entryObjName;
			this.entryObjName = json.entryObjName;
			this.priority = json.priority;
			this.roleName = json.roleName;
			this.groupName = json.groupName;
			this.userDisable = json.disable;

			if (json.entryObjId) {
				this.entryObjId = Number(json.entryObjId);
			}
		}
	}
}
