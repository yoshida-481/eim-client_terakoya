import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';

/**
 * 承認ステータスDTO
 */
export class EIMApproveStatusDTO {

	/** ステータスタイプID */
	public statusTypeId: number;

	/** ステータス名 */
	public statusTypeName: string;

	/** 承認者一覧 */
	public approver: EIMEntryUserDTO[];

	/**  */
	public step: number;

	/** 遷移先ステータスが公開か判定 */
	public statusKind: number;

	/** 次のステータスが承認を必要か判定 */
	public finalApprove: boolean;

	/** 処理名 */
	public functionType: number;

	/** 承認者名 */
	public approverName: string;

	/** 承認者ナンバー */
	public approverId: string;

	/**  */
	public displayFlag: boolean

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}

		this.statusTypeId = json.attr.statusTypeId;
		this.statusTypeName = json.attr.statusTypeName;
		this.step = json.attr.step;
		this.statusKind = json.attr.statusKind;
		this.finalApprove = json.attr.finalApprove === 'true' ? true : false;
		this.functionType = json.attr.functionType;
		this.approverName = json.attr.approverName;
		this.approverId = json.attr.approverId;
		this.displayFlag = json.attr.displayFlag;
		this.approver = this.convertApprover(json);
	}

	/**
	 * 承認者のJSON情報をドメインに変換します.
	 * @param json 承認者のJSON情報
	 * @return 承認者情報リスト
	 */
	private convertApprover(json?: any): EIMEntryUserDTO[] {
		let approvers: EIMEntryUserDTO[] = [];
		let approverIds: string[] = [];
		if (json.attr.approverId != null && json.attr.approverId.length > 0) {
			approverIds = (json.attr.approverId).split(',');
		}
		let approverNames: string[] = [];
		if (json.attr.approverName != null && json.attr.approverName.length > 0) {
			approverNames = (json.attr.approverName).split(',');
		}

		if (approverIds.length > 0 && approverNames.length > 0) {
			for (let j = 0; j < approverIds.length; j++) {
					let approverIdElements: string[] = approverIds[j].split(':');
					let approver: EIMEntryUserDTO = new EIMEntryUserDTO({
							id: Number(approverIdElements[1]),
							name: approverNames[j],
							})
					approvers.push(approver);
				}
			}
		return approvers;
	}

	/**
	 * ステータスDTOコピー貼り付け用.
	 * @return EIMApproveStatusDTO
	 */
	public makeStatusClone(): EIMApproveStatusDTO {
		let cloneStatusDTO = new EIMApproveStatusDTO();
		cloneStatusDTO.statusTypeId = this.statusTypeId;
		cloneStatusDTO.statusTypeName = this.statusTypeName;
		cloneStatusDTO.step = this.step;
		cloneStatusDTO.statusKind = this.statusKind;
		cloneStatusDTO.approver = [];
		for (let i = 0; i < this.approver.length; i++) {
			cloneStatusDTO.approver.push(this.approver[i].makeEntryUserClone());
		}
		cloneStatusDTO.finalApprove = this.finalApprove;
		cloneStatusDTO.functionType = this.functionType;
		cloneStatusDTO.approverName = this.approverName;
		cloneStatusDTO.approverId = this.approverId;
		cloneStatusDTO.displayFlag = this.displayFlag;
		return cloneStatusDTO;
	}
}
