import { EIMAdminDTO } from './admin.dto';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
/**
 * グループ/ロールのユーザDTO
 */
export class EIMGroupRoleUserDTO extends EIMUserDTO implements EIMAdminDTO {

	/** グループ名 */
	public groupName: string;

	/** ロール名 */
	public roleName: string;

	/** アイコンタイプ */
	public typeName = 'user';

	/** アイコンタイプ */
	public typeLabel: string;

	constructor(json?: any) {
		super(json);
		this.typeLabel = this.name;
		this.groupName = this.groupNames;
		this.roleName = this.roleNames;
	}
}
