import { EIMAdminDTO } from './admin.dto';

/**
 * 管理者ユーザDTO'
 */
export class EIMAdminsUserDTO  implements EIMAdminDTO {

	/** ユーザID */
	public userId: number;

	/** ID */
	public userCode: string;

	/** ユーザ名 */
	public userName: string;

	/** ユーザ名(かな) */
	public userKana: string;

	/** メール */
	public userMail: string;

	/** グループID */
	public groupId: number;

	/** グループ名 */
	public groupName: string;

	/** ロールID */
	public roleId: number;

	/** ロール名 */
	public roleName: string;

	/** パスワード */
	public userPass: string;

	/** 言語リスト */
	public langList: any[];

	/** 無効フラグ */
	public userDisable: number;

	/** ファイルサイズ */
	public userLang: string;

	/** アイコンタイプ */
	public typeName = 'user';

	/** アイコンタイプ */
	public typeLabel: string;



	// 以下セッションユーザ取得時のみの情報
	/** 管理者権限 */
	public userAdmin: number;

	/** グループパス */
	public groupPath: string;

	/** ファイルサイズ */
	public approveDocument: number;

	/** ファイルサイズ */
	public isPopupExists: boolean;

	/** ファイルサイズ */
	public viceApprove: boolean;

	/** ファイルサイズ */
	public systemSecurity: boolean;

	/** 文字数最大値 */
	public textAttrMaxChars: number;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.userId = Number(json.attr.userId);
			this.userCode = json.attr.userCode;
			this.userName = json.attr.userName;
			this.userKana = json.attr.userKana;
			this.userMail = json.attr.userMail;
			this.groupName = json.attr.groupName;
			this.roleName = json.attr.roleName;
			this.langList = json.lang;
			this.userLang = json.attr.userLang;
			this.userDisable = json.attr.userDisable;
			this.groupId = json.attr.groupId;
			this.roleId = json.attr.roleId;

			this.typeLabel = json.attr.userName;

			this.userAdmin = Number(json.attr.userAdmin);
			this.groupPath = json.attr.groupPath;
			this.approveDocument = Number(json.attr.approveDocument);
			this.isPopupExists = json.attr.isPopupExists === 'true' ? true : false;
			this.viceApprove = json.attr.viceApprove === 'true' ? true : false;
			this.systemSecurity = json.attr.systemSecurity === 'true' ? true : false;
			this.textAttrMaxChars = Number(json.attr.textAttrMaxChars);
		}

	}

}
