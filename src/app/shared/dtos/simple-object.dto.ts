import { EIMJsonConvertibleDTO } from "./json-convertible.dto";
import { EIMObjectTypeDomain } from "../domains/entity/object-type.domain";
import { EIMSecurityDomain } from "../domains/entity/security.domain";
import { EIMStatusDomain } from "../domains/entity/status.domain";
import { EIMUserDomain } from "../domains/entity/user.domain";

/**
 * 簡易オブジェクトDTO
 */
export class EIMSimpleObjectDTO extends EIMJsonConvertibleDTO {

	/** オブジェクトID */
	public id: number;

	/** オブジェクト名 */
	public name?: string;

	/** オブジェクトタイプ */
	public type?: EIMObjectTypeDomain;

	/** リビジョン */
	public revision?: number;

	/** リビジョングループID */
	public revisionGroupId?: number;

	/** 最新フラグ */
	public latest?: boolean;

	/** 作成者 */
	public creationUser?: EIMUserDomain;

	/** 作成日時 */
	public creationDate?: number;

	/** 更新者 */
	public modificationUser?: EIMUserDomain;

	/** 更新日時 */
	public modificationDate?: number;

	/** ロックユーザ */
	public lockUser?: EIMUserDomain;

	/** ロック日時 */
	public lockDate?: number;

	/** オブジェクトステータス */
	public status?: EIMStatusDomain;

	/** オブジェクトセキュリティ */
	public security?: EIMSecurityDomain;

	/** 属性値マップ キー：{valueType: EIMValueTypeEnumeration, values: any[]} */
	public attributeMap?: any;

	/** 外部値マップ キー：値 */
	public exAttributeMap?: any;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		this.id = json.id;
		this.name = json.name;
		this.type = json.type;
		this.revision = Number(json.revision);
		this.revisionGroupId = json.revisionGroupId;
		this.latest = Boolean(json.latest);
		this.creationUser = json.creationUser;
		this.creationDate = json.creationDate;
		this.modificationUser = json.modificationUser;
		this.modificationDate = json.modificationDate;
		this.lockUser = json.lockUser;
		this.lockDate = json.lockDate;
		this.status = json.status;
		this.security = json.security;

		this.attributeMap = json.attributeMap;

		this.exAttributeMap = json.exAttributeMap;

	}

}