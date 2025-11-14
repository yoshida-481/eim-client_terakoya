import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from './admin.dto';

/**
 * 属性ツリー更新用DTO
 */
export class EIMAttrTreeUpdateDTO {

	/** ID */
	public id: number;

	/** 属性ID */
	public attrTreeId: number;

	/** 属性名前 */
	public attrTreeName: string;

	/** 名前リスト */
	public lang: any[];

	/** 分類対象 */
	public classifyTarget: string;

	constructor(json?: any) {

		if (json) {
			this.attrTreeId = Number(json.attr.attrTreeId);
			this.id = this.attrTreeId;
			this.attrTreeName = json.attr.attrTreeName;
			this.classifyTarget = json.attr.classifyTarget;
			this.lang = json.lang;
		}
	}
}
