import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * フォーマットDTO
 */
export class EIMRoleDTO {

	/** ID */
	public id: number;
	/** アクセスID */
	public roleId: number;
	/** アクセス名 */
	public name: string;
	/** アクセス表示名 */
	public dispName: string;
	/** 表示順 */
	public dispOrder: number;
	/** アクセス権限ID */
	public stsecId: number;
	/** 権限IDリスト */
	public stsecList: any[];
	/** 権限 */
	public permit: string;
	/** 権限初期値 */
	public defaultPermit: string;
	/** 書込チェックボックス */
	public roleChk = false;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.roleId = Number(json.attr.roleId);
			this.id = this.roleId;
			this.name = json.attr.name;
			this.dispName = json.attr.dispName;
			if (Array.isArray(json.stsec)) {
				this.stsecList = json.stsec;
				this.stsecId = this.stsecList[this.stsecList.length - 1].attr.id;
				this.permit = this.stsecList[this.stsecList.length - 1].attr.permit;
				this.defaultPermit = this.stsecList[0].attr.permit;
			} else {
				this.stsecId = Number(json.stsec.attr.id);
				this.permit = json.stsec.attr.permit;
				this.defaultPermit = this.permit;
			}

			this.dispOrder = 0;
		}
	}
}
