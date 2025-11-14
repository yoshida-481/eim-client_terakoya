import { EIMJsonConvertibleDTO } from "./json-convertible.dto";
import { EIMObjectTypeDomain } from "../domains/entity/object-type.domain";
import { EIMSecurityDomain } from "../domains/entity/security.domain";
import { EIMStatusDomain } from "../domains/entity/status.domain";
import { EIMUserDomain } from "../domains/entity/user.domain";
import { EIMSimpleObjectDTO } from "./simple-object.dto";
import { EIMRelationTypeDomain } from "../domains/entity/relation-type.domain";

/**
 * 簡易リレーションDTO
 */
export class EIMSimpleRelationDTO extends EIMJsonConvertibleDTO {

	/** ID */
	public id: number;

	/** リレーションタイプ */
	public type?: EIMRelationTypeDomain;

	/** 親簡易オブジェクトDTO */
	public parent?: EIMSimpleObjectDTO;

	/** 子簡易オブジェクトDTO */
	public child?: EIMSimpleObjectDTO;

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
		this.type = json.type;
		this.parent = json.parent;
		this.child = json.child;

		this.attributeMap = json.attributeMap;
		this.exAttributeMap = json.exAttributeMap;

	}

}