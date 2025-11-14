import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * メール種別DTO
 */
export class EIMMailTypeDTO {

	/** ID */
	public id: number;

	/** 名前 */
	public name: string;

	/** メソッド */
	public method = 'immediate'; // デフォルト値：即時

	constructor(json?: any) {

		if (json) {
			this.id = Number(json.attr.id);
			this.name = json.attr.name;
			if (json.attr.method) {
				this.method = json.attr.method;
			}
		}
	}
}
