import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from './admin.dto';
import { EIMFormLayoutDomain } from 'app/shared/domains/form-layout.domain';

/**
 * オブジェクトセキュリティDTO
 */
export class EIMObjectSecurityDTO {

	/** ID */
	public id: string;

	/** オブジェクトID */
	public objTypeId: number;

	/** オブジェクト名 */
	public objTypeName: string;

	/** ラベル */
	public label: string;

	/** セキュリティID */
	public secId: number;

	/** セキュリティ名 */
	public secName: string;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			if (json.objType) {
				this.objTypeId = Number(json.objType.attr.objTypeId);
				this.objTypeName = json.objType.attr.objTypeName;
				this.label = json.objType.attr.label;
				this.secId = Number(json.objType.attr.secId);
				this.secName = json.objType.attr.secName;
			} else {
				this.label = json.obj.attr.label;
				this.secId = Number(json.obj.attr.secId);
				this.secName = json.obj.attr.secName;
			}
		}
	}

}
