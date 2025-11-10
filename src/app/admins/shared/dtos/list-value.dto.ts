import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from './admin.dto';

/**
 * リスト値DTO
 */
export class EIMListValueDTO {

	/** リスト値名前 */
	public value: string;

	/** 色情報 */
	public color: string;

	/** 色設定フラグ */
	public isDspColor = false;

	constructor(json?: any) {

		if (json) {
			this.color = json.attr.color;
			this.value = json.attr.value;
			this.isDspColor = json.attr.isDspColor === 'true';
		}
	}
}
