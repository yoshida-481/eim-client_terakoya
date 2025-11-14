import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from './admin.dto';

/**
 * ワークフローDTO
 */
export class EIMAttrTreeDTO {

	/** ID */
	public id: number;

	/** 属性ID */
	public attrTreeId: number;

	/** 属性名前 */
	public attrTreeName: string;
	/** 名前リスト */
	public lang: any[];


	constructor(json?: any) {

		if (json) {
			this.attrTreeId = Number(json.attr.attrTreeId);
			this.lang = json.lang;
			this.id = this.attrTreeId;
			this.attrTreeName = json.attr.attrTreeName;

		}
	}
}
