import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * ネームスペースDTO
 */
export class EIMSpnameDTO {
	/** ID */
	public id: number;

	/** アクセス名 */
	public name: string;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.name = json.attr.name;
		}
	}
}
