import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMObjectDTO } from './object.dto';

/**
 * 帳票DTO
 */
export class EIMFormDTO extends EIMObjectDTO {

	/** ステータスタイプ名 */
	public statusTypeName: string;

	/** 帳票タイプ名 */
	public formTypeName: string;

	/** タイトル */
	public title: string;

	/**
	 * コンストラクタ.
	 * @param json JSON
	 */
	constructor(json?: any) {
		super(json);
		this.statusTypeName = json.statusTypeName;
		this.formTypeName = json.formTypeName;
		this.title = json.title;
	}
}
