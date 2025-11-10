import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from './admin.dto';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';

/**
 * ワークスペースDTO
 */
export class EIMWorkspaceDTO implements EIMAdminDTO {

	/** ワークスペースID */
	public wsId: number;

	/** ワークスペースID */
	public objId: number;

	/** セキュリティID */
	public secId: number;

	/** 下位セキュリティID */
	public lowerSuccessionSecId: number;

	/** ワークスペース名前 */
	public wsName: string;

	/** セキュリティ名前 */
	public secName: string;

	/** 下位セキュリティ名前 */
	public lowerSuccessionSecNam: string;

	/** アイコンタイプ */
	public typeName = 'workspace';

	/** アイコンタイプ */
	public typeLabel: string;

	public objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE;

		/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.wsId = Number(json.attr.wsId);
			this.secId =  Number(json.attr.secId);
			this.wsName = json.attr.wsName;
			this.secName = json.attr.secName;
			this.lowerSuccessionSecId =  Number(json.attr.lowerSuccessionSecId);
			this.lowerSuccessionSecNam = json.attr.lowerSuccessionSecNam;
			this.typeLabel = this.wsName;
		}
	}
}
