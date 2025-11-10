import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from 'app/admins/shared/dtos/admin.dto';

/**
 * 操作履歴DTO
 */
export class EIMOperationHistoryDTO {

	/** アクセス日時 */
	public acdate: number;

	/** ユーザコード */
	public userCode: string;

	/** ユーザ */
	public userName: string;

	/** アプリケーション */
	public appType: string;

	/** 操作内容 */
	public opType: string;

	/** 操作対象情報A */
	public rcInfo_A: string;

	/** 操作対象A */
	public rcName_A: string;

	/** 操作対象情報B */
	public rcInfo_B: string;

	/** 操作対象B */
	public rcName_B: string;

	/** 詳細 */
	public detail: string;

	/** 操作対象ID_A */
	public rcId_A: string;

	/** 操作対象TYPE_A */
	public rcType_A: string;

	/** 操作対象ID_B */
	public rcId_B: string;

	/** 操作対象TYPE_B */
	public rcType_B: string;


	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.acdate = json.attr.acdate;
			this.userCode = json.attr.userCode;
			this.userName = json.attr.userName;
			this.appType = json.attr.appType;
			this.opType = json.attr.opType;
			this.rcInfo_A = json.attr.rcInfo_A;
			this.rcName_A = json.attr.rcName_A;
			this.rcInfo_B = json.attr.rcInfo_B;
			this.rcName_B = json.attr.rcName_B;
			this.detail = json.attr.detail;
			this.rcId_A = json.attr.rcId_A;
			this.rcType_A = json.attr.rcType_A;
			this.rcId_B = json.attr.rcId_B;
			this.rcType_B = json.attr.rcType_B;
		}
	}
}
