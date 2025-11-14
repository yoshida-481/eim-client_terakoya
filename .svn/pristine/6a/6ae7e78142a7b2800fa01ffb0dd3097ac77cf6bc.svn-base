/**
 * 検索条件左辺属性タイプ保持クラスの基底クラスです.
 */
export class EIMSimpleSearchConditionLeftAttributeType {
}

/**
 * 検索条件左辺属性タイプ保持クラスの終端処理が存在しない（検索条件左辺属性タイプの終端として指定できない）クラスです.
 */
export class EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd extends EIMSimpleSearchConditionLeftAttributeType {

	/** 検索条件左辺属性タイプ */
	protected rootConditionLeftAttributeType: EIMSimpleSearchConditionLeftAttributeType = null;

	/**
	 * コンストラクタです.
	 */
	constructor(rootConditionLeftAttributeType: EIMSimpleSearchConditionLeftAttributeType = null) {

		super();

		if (rootConditionLeftAttributeType) {

			this.rootConditionLeftAttributeType = rootConditionLeftAttributeType;

		} else {

			this.rootConditionLeftAttributeType = this;

		}

	}

}

/**
 * 検索条件左辺属性タイプ保持クラスの終端処理が存在する（検索条件左辺属性タイプの終端として指定できる）クラスです.
 */
export class EIMSimpleSearchConditionLeftAttributeTypeWithEnd extends EIMSimpleSearchConditionLeftAttributeType {

	/** 検索条件左辺属性タイプ */
	protected rootConditionLeftAttributeType: EIMSimpleSearchConditionLeftAttributeType = null;

	/**
	 * コンストラクタです.
	 */
	constructor(rootConditionLeftAttributeType: EIMSimpleSearchConditionLeftAttributeType = null) {

		super();

		if (rootConditionLeftAttributeType) {

			this.rootConditionLeftAttributeType = rootConditionLeftAttributeType;

		} else {

			this.rootConditionLeftAttributeType = this;

		}

	}

	/**
	 * 終端処理です.
	 * @returns 返却属性タイプパスの先頭属性タイプ
	 */
	public end?(): EIMSimpleSearchConditionLeftAttributeType {
		return this.rootConditionLeftAttributeType;
	}
}

/**
 * オブジェクト情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchObjectConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	protected attributeTypeDefNames: string[] = [];

	/** オブジェクトタイプ情報の検索条件左辺属性タイプ */
	private objectTypeConditionLeftAttributeType: EIMSimpleSearchObjectTypeConditionLeftAttributeType = null;
	/** 基底オブジェクトタイプ情報の検索条件左辺属性タイプ */
	private baseObjectTypeConditionLeftAttributeType: EIMSimpleSearchObjectTypeConditionLeftAttributeType = null;
	/** ユーザ情報の検索条件左辺属性タイプ */
	private objectUserConditionLeftAttributeType: EIMSimpleSearchUserConditionLeftAttributeType = null;
	/** ステータス情報の検索条件左辺属性タイプ */
	private objectStatusConditionLeftAttributeType: EIMSimpleSearchStatusConditionLeftAttributeType = null;
	/** セキュリティ情報の検索条件左辺属性タイプ */
	private objectSecurityConditionLeftAttributeType: EIMSimpleSearchSecurityConditionLeftAttributeType = null;
	/** 属性情報の検索条件左辺属性タイプ */
	private attributeConditionLeftAttributeType: EIMSimpleSearchAttributeConditionLeftAttributeType = null;

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {

		let paths: string[] = this.attributeTypeDefNames;

		// オブジェクトタイプ情報指定時
		if (this.objectTypeConditionLeftAttributeType) {
			paths = paths.concat(this.objectTypeConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		// 基底オブジェクトタイプ情報指定時
		} else if (this.baseObjectTypeConditionLeftAttributeType) {
			paths = paths.concat(this.baseObjectTypeConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		// ユーザ情報指定時
		} else if (this.objectUserConditionLeftAttributeType) {
			paths = paths.concat(this.objectUserConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		// ステータス情報指定時
		} else if (this.objectStatusConditionLeftAttributeType) {
			paths = paths.concat(this.objectStatusConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		// セキュリティ情報指定時
		} else if (this.objectSecurityConditionLeftAttributeType) {
			paths = paths.concat(this.objectSecurityConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		// 属性値指定時
		} else if (this.attributeConditionLeftAttributeType) {
			paths = paths.concat(this.attributeConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		}

		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにTYPEを追加します.
	 */
	public type(): EIMSimpleSearchObjectTypeConditionLeftAttributeType {
		this.attributeTypeDefNames = ['type'];
		this.objectTypeConditionLeftAttributeType = new EIMSimpleSearchObjectTypeConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.objectTypeConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスにTYPEを追加します.
	 */
	public baseType(): EIMSimpleSearchObjectTypeConditionLeftAttributeType {
		this.attributeTypeDefNames = ['baseType'];
		this.baseObjectTypeConditionLeftAttributeType = new EIMSimpleSearchObjectTypeConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.baseObjectTypeConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにLATESTを追加します.
	 */
	public latest(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['latest'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにREVを追加します.
	 */
	public revision(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['revision'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにCUSERを追加します.
	 */
	public creationUser(): EIMSimpleSearchUserConditionLeftAttributeType {
		this.attributeTypeDefNames = ['creationUser'];
		this.objectUserConditionLeftAttributeType = new EIMSimpleSearchUserConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.objectUserConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスにCDATEを追加します.
	 */
	public creationDate(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['creationDate'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにMUSERを追加します.
	 */
	public modificationUser(): EIMSimpleSearchUserConditionLeftAttributeType {
		this.attributeTypeDefNames = ['modificationUser'];
		this.objectUserConditionLeftAttributeType = new EIMSimpleSearchUserConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.objectUserConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスにMDATEを追加します.
	 */
	public modificationDate(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['modificationDate'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにLUSERを追加します.
	 */
	public lockUser(): EIMSimpleSearchUserConditionLeftAttributeType {
		this.attributeTypeDefNames = ['lockUser'];
		this.objectUserConditionLeftAttributeType = new EIMSimpleSearchUserConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.objectUserConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスにLDATEを追加します.
	 */
	public lockDate(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['lockDate'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにSECURITYを追加します.
	 */
	public security(): EIMSimpleSearchSecurityConditionLeftAttributeType {
		this.attributeTypeDefNames = ['security'];
		this.objectSecurityConditionLeftAttributeType = new EIMSimpleSearchSecurityConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.objectSecurityConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスにSTATUSを追加します.
	 */
	public status(): EIMSimpleSearchStatusConditionLeftAttributeType {
		this.attributeTypeDefNames = ['status'];
		this.objectStatusConditionLeftAttributeType = new EIMSimpleSearchStatusConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.objectStatusConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスにREVを追加します.
	 */
	public revisionGroupId(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['revisionGroupId'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスに属性値を追加します.
	 */
	public attribute(definitionName: string): EIMSimpleSearchAttributeConditionLeftAttributeType {
		this.attributeTypeDefNames = ['attributeMap', definitionName];
		this.attributeConditionLeftAttributeType = new EIMSimpleSearchAttributeConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.attributeConditionLeftAttributeType;
	}

}

/**
 * オブジェクトタイプ情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchObjectTypeConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにNAME(定義名称)を追加します.
	 */
	public definitionName(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['definitionName'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}
}

/**
 * ユーザ情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchUserConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

}

/**
 * セキュリティ情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchSecurityConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

}

/**
 * ベースステータスタイプ情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchBaseStatusTypeConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

}

/**
 * ステータスタイプ情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchStatusTypeConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/** ベースステータスタイプ情報の検索条件左辺属性タイプ */
	private baseStatusTypeConditionLeftAttributeType: EIMSimpleSearchBaseStatusTypeConditionLeftAttributeType = null;

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {

		let paths: string[] = this.attributeTypeDefNames;

		// ベースステータスタイプ情報指定時
		if (this.baseStatusTypeConditionLeftAttributeType) {
			paths = paths.concat(this.baseStatusTypeConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());
		}
		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにBASEを追加します.
	 */
	public base(): EIMSimpleSearchBaseStatusTypeConditionLeftAttributeType {
		this.attributeTypeDefNames = ['base'];
		this.baseStatusTypeConditionLeftAttributeType = new EIMSimpleSearchBaseStatusTypeConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.baseStatusTypeConditionLeftAttributeType
	}

}

/**
 * ステータス情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchStatusConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/** ステータスタイプ情報の検索条件左辺属性タイプ */
	private statusTypeConditionLeftAttributeType: EIMSimpleSearchStatusTypeConditionLeftAttributeType = null;

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {

		let paths: string[] = this.attributeTypeDefNames;

		// ステータスタイプ情報指定時
		if (this.statusTypeConditionLeftAttributeType) {
			paths = paths.concat(this.statusTypeConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());
		}
		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにTYPEを追加します.
	 */
	public type(): EIMSimpleSearchStatusTypeConditionLeftAttributeType {
		this.attributeTypeDefNames = ['type'];
		this.statusTypeConditionLeftAttributeType = new EIMSimpleSearchStatusTypeConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.statusTypeConditionLeftAttributeType
	}

}


/**
 * リレーション情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchRelationConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/** リレーションタイプ情報の検索条件左辺属性タイプ */
	private relationTypeConditionLeftAttributeType: EIMSimpleSearchRelationTypeConditionLeftAttributeType = null;
	/** 親オブジェクト情報の検索条件左辺属性タイプ */
	private parentObjectConditionLeftAttributeType: EIMSimpleSearchObjectConditionLeftAttributeType = null;
	/** 子オブジェクト情報の検索条件左辺属性タイプ */
	private childObjectConditionLeftAttributeType: EIMSimpleSearchObjectConditionLeftAttributeType = null;

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {

		let paths: string[] = this.attributeTypeDefNames;

		// リレーションタイプ情報指定時
		if (this.relationTypeConditionLeftAttributeType) {
			paths = paths.concat(this.relationTypeConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		// 親オブジェクト指定時
		} else if (this.parentObjectConditionLeftAttributeType) {
			paths = paths.concat(this.parentObjectConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		// 子オブジェクト指定時
		} else if (this.childObjectConditionLeftAttributeType) {
			paths = paths.concat(this.childObjectConditionLeftAttributeType.getAttributeTypeDefinitionNamePath());

		}

		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにTYPEを追加します.
	 */
	public type(): EIMSimpleSearchRelationTypeConditionLeftAttributeType {
		this.attributeTypeDefNames = ['type'];
		this.relationTypeConditionLeftAttributeType = new EIMSimpleSearchRelationTypeConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.relationTypeConditionLeftAttributeType
	}

	/**
	 * 検索条件左辺属性タイプパスに親オブジェクトを追加します.
	 */
	public parent(): EIMSimpleSearchObjectConditionLeftAttributeType {
		this.attributeTypeDefNames = ['parent'];
		this.parentObjectConditionLeftAttributeType = new EIMSimpleSearchObjectConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.parentObjectConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスに子オブジェクトを追加します.
	 */
	public child(): EIMSimpleSearchObjectConditionLeftAttributeType {
		this.attributeTypeDefNames = ['child'];
		this.parentObjectConditionLeftAttributeType = new EIMSimpleSearchObjectConditionLeftAttributeType(this.rootConditionLeftAttributeType);

		return this.parentObjectConditionLeftAttributeType;
	}

	/**
	 * 検索条件左辺属性タイプパスに属性値を追加します.
	 */
	public attribute(definitionName: string): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = [definitionName];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}
}

/**
 * リレーションタイプ情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchRelationTypeConditionLeftAttributeType extends EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd {

	/** 検索条件左辺属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 検索条件左辺属性タイプパス配列を返却します.
	 *
	 * @returns 検索条件左辺属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 検索条件左辺属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}

	/**
	 * 検索条件左辺属性タイプパスにNAME(定義名称)を追加します.
	 */
	public definitionName(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['definitionName'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}
}

/**
 * 属性情報の検索条件左辺属性タイプ保持クラスです.
 */
export class EIMSimpleSearchAttributeConditionLeftAttributeType extends EIMSimpleSearchObjectConditionLeftAttributeType {

	/**
	 * 検索条件左辺属性タイプパスにCODEを追加します.
	 */
	public code(): EIMSimpleSearchConditionLeftAttributeTypeWithEnd {
		this.attributeTypeDefNames = ['code'];

		return new EIMSimpleSearchConditionLeftAttributeTypeWithEnd(this.rootConditionLeftAttributeType);
	}
	
	/**
	 * 終端処理です.
	 * @returns 返却属性タイプパスの先頭属性タイプ
	 */
	public end?(): EIMSimpleSearchConditionLeftAttributeType {
		return this.rootConditionLeftAttributeType;
	}

}


