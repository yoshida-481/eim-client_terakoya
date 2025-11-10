import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from './admin.dto';

/**
 * 属性ツリーアイテムDTO
 */
export class EIMAttrTreeItemDTO  {

	/** 属性名前 */
	public attTypeName: string;

	/** タイプ型名前 */
	public valTypeName: string;

	/** 属性ID */
	public attTypeId: number;

	/** 属性値なし表示フラグ */
	public viewNoValuesFlag: boolean;

	constructor(json?: any) {
		if (json) {
			this.attTypeId = Number(json.attr.attrTypeId);
			this.attTypeName = json.attr.attrTypeName;
			this.valTypeName = json.attr.valTypeName;
			this.viewNoValuesFlag = json.attr.viewNoValuesFlag === 'true' ? true : false;
		}
	}
}
