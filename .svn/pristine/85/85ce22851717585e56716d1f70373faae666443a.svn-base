import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * UIコントロールドメイン
 */
export class EIMUIControlDomain {
	/** UIコントロールID */
	public value: string;
	/** UIコントロールタイプ */
	public type: string;
	/** タイプ型名称 */
	public label: string;
	/** 参照タイプ名称 */
	public refmasterTypeName: string;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.value = json.attr.id;
			this.type = json.attr.type;
			this.label = json.attr.name;
			this.refmasterTypeName = json.attr.refmasterTypeName;
		}
	}
}
