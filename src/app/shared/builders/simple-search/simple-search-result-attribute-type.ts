/**
 * オブジェクト情報の返却属性タイプ保持クラスの基底クラスです.
 */
export class EIMSimpleSearchResultAttributeType {

	/** オブジェクト情報の返却対象属性タイプ */
	protected rootResultAttributeType: EIMSimpleSearchResultAttributeType = null;

	/**
	 * コンストラクタです.
	 */
	constructor(rootResultAttributeType: EIMSimpleSearchResultAttributeType = null) {

		if (rootResultAttributeType) {

			this.rootResultAttributeType = rootResultAttributeType;

		} else {

			this.rootResultAttributeType = this;

		}

	}

	/**
	 * 終端処理です.
	 * @returns 返却属性タイプパスの先頭属性タイプ
	 */
	public end(): EIMSimpleSearchResultAttributeType {
		return this.rootResultAttributeType;
	}

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		return [];
	}
}

/**
 * オブジェクト情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchObjectResultAttributeTypeWithoutAttribute extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	protected attributeTypeDefNames: string[] = [];

	/** オブジェクトタイプ情報の返却属性タイプ */
	private objectTypeResultAttributeType: EIMSimpleSearchObjectTypeResultAttributeType = null;
	/** ユーザ情報の返却属性タイプ */
	private userResultAttributeType: EIMSimpleSearchUserResultAttributeType = null;
	/** ステータス情報の返却属性タイプ */
	private statusResultAttributeType: EIMSimpleSearchStatusResultAttributeType = null;
	/** セキュリティ情報の返却属性タイプ */
	private securityResultAttributeType: EIMSimpleSearchSecurityResultAttributeType = null;

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {

		let paths: string[] = this.attributeTypeDefNames;

		// オブジェクトタイプ情報指定時
		if (this.objectTypeResultAttributeType) {
			paths = paths.concat(this.objectTypeResultAttributeType.getAttributeTypeDefinitionNamePath());

		// ユーザ情報指定時
		} else if (this.userResultAttributeType) {
			paths = paths.concat(this.userResultAttributeType.getAttributeTypeDefinitionNamePath());

		// ステータス情報指定時
		} else if (this.statusResultAttributeType) {
			paths = paths.concat(this.statusResultAttributeType.getAttributeTypeDefinitionNamePath());

		// セキュリティ情報指定時
		} else if (this.securityResultAttributeType) {
			paths = paths.concat(this.securityResultAttributeType.getAttributeTypeDefinitionNamePath());
		}

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにTYPEを追加します.
	 */
	public type(): EIMSimpleSearchObjectTypeResultAttributeType {
		this.attributeTypeDefNames = ['type'];
		this.objectTypeResultAttributeType = new EIMSimpleSearchObjectTypeResultAttributeType(this.rootResultAttributeType);

		return this.objectTypeResultAttributeType
	}

	/**
	 * 返却属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにREVを追加します.
	 */
	public revision(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['revision'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにLATESTを追加します.
	 */
	public latest(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['latest'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにCUSERを追加します.
	 */
	public creationUser(): EIMSimpleSearchUserResultAttributeType {
		this.attributeTypeDefNames = ['creationUser'];
		this.userResultAttributeType = new EIMSimpleSearchUserResultAttributeType(this.rootResultAttributeType);

		return this.userResultAttributeType;
	}

	/**
	 * 返却属性タイプパスにCDATEを追加します.
	 */
	public creationDate(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['creationDate'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにMUSERを追加します.
	 */
	public modificationUser(): EIMSimpleSearchUserResultAttributeType {
		this.attributeTypeDefNames = ['modificationUser'];
		this.userResultAttributeType = new EIMSimpleSearchUserResultAttributeType(this.rootResultAttributeType);

		return this.userResultAttributeType;
	}

	/**
	 * 返却属性タイプパスにMDATEを追加します.
	 */
	public modificationDate(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['modificationDate'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにLUSERを追加します.
	 */
	public lockUser(): EIMSimpleSearchUserResultAttributeType {
		this.attributeTypeDefNames = ['lockUser'];
		this.userResultAttributeType = new EIMSimpleSearchUserResultAttributeType(this.rootResultAttributeType);

		return this.userResultAttributeType;
	}

	/**
	 * 返却属性タイプパスにLDATEを追加します.
	 */
	public lockDate(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['lockDate'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにSTATUSを追加します.
	 */
	public status(): EIMSimpleSearchStatusResultAttributeType {
		this.attributeTypeDefNames = ['status'];
		this.statusResultAttributeType = new EIMSimpleSearchStatusResultAttributeType(this.rootResultAttributeType);

		return this.statusResultAttributeType;
	}

	/**
	 * 返却属性タイプパスにSECURITYを追加します.
	 */
	public security(): EIMSimpleSearchSecurityResultAttributeType {
		this.attributeTypeDefNames = ['security'];
		this.securityResultAttributeType = new EIMSimpleSearchSecurityResultAttributeType(this.rootResultAttributeType);

		return this.securityResultAttributeType;
	}

	/**
	 * 返却属性タイプパスにREVを追加します.
	 */
	public revisionGroupId(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['revisionGroupId'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

}

/**
 * オブジェクト情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchObjectResultAttributeType extends EIMSimpleSearchObjectResultAttributeTypeWithoutAttribute {

	/** 属性情報の返却属性タイプ */
	private attributeResultAttributeType: EIMSimpleSearchObjectResultAttributeType = null;

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {

		let paths: string[] = super.getAttributeTypeDefinitionNamePath();

		// 属性値指定時
		if (this.attributeResultAttributeType) {
			paths = paths.concat(this.attributeResultAttributeType.getAttributeTypeDefinitionNamePath());

		}

		return paths;
	}

	/**
	 * 返却属性タイプパスに属性値を追加します.
	 */
	public attribute(definitionName?: string): EIMSimpleSearchObjectResultAttributeType {

		if (definitionName) {
			this.attributeTypeDefNames = ['attributeMap', definitionName];
		} else {
			this.attributeTypeDefNames = ['attributeMap'];
		}
		this.attributeResultAttributeType = new 
				EIMSimpleSearchObjectResultAttributeType(this.rootResultAttributeType);

		return this.attributeResultAttributeType;
	}

}

/**
 * オブジェクトタイプ情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchObjectTypeResultAttributeType extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAME(定義名称)を追加します.
	 */
	public definitionName(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['definitionName'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}
}

/**
 * ユーザ情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchUserResultAttributeType extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAME(定義名称)を追加します.
	 */
	public definitionName(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['definitionName'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}
}

/**
 * ステータス情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchStatusResultAttributeType extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAME(定義名称)を追加します.
	 */
	public definitionName(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['definitionName'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}
}

/**
 * セキュリティ情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchSecurityResultAttributeType extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAME(定義名称)を追加します.
	 */
	public definitionName(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['definitionName'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}
}



/**
 * リレーション情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchRelationResultAttributeTypeWithoutAttribute extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	protected attributeTypeDefNames: string[] = [];

	/** リレーションタイプ情報の返却属性タイプ */
	private relationTypeResultAttributeType: EIMSimpleSearchRelationTypeResultAttributeType = null;
	/** 親オブジェクト情報の返却属性タイプ */
	private parentObjectResultAttributeType: EIMSimpleSearchRelationParentObjectResultAttributeType = null;
	/** 子オブジェクト情報の返却属性タイプ */
	private childObjectResultAttributeType: EIMSimpleSearchRelationChildObjectResultAttributeType = null;

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {

		let paths: string[] = this.attributeTypeDefNames;

		// リレーションタイプ情報指定時
		if (this.relationTypeResultAttributeType) {
			paths = paths.concat(this.relationTypeResultAttributeType.getAttributeTypeDefinitionNamePath());

		// 親オブジェクト指定時
		} else if (this.parentObjectResultAttributeType) {
			paths = paths.concat(this.parentObjectResultAttributeType.getAttributeTypeDefinitionNamePath());

		// 子オブジェクト指定時
		} else if (this.childObjectResultAttributeType) {
			paths = paths.concat(this.childObjectResultAttributeType.getAttributeTypeDefinitionNamePath());

		}

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにTYPEを追加します.
	 */
	public type(): EIMSimpleSearchRelationTypeResultAttributeType {
		this.attributeTypeDefNames = ['type'];
		this.relationTypeResultAttributeType = new EIMSimpleSearchRelationTypeResultAttributeType(this.rootResultAttributeType);

		return this.relationTypeResultAttributeType
	}

	/**
	 * 返却属性タイプパスに親オブジェクトを追加します.
	 */
	public parent(): EIMSimpleSearchRelationParentObjectResultAttributeType {
		this.attributeTypeDefNames = ['parent'];
		this.parentObjectResultAttributeType = new EIMSimpleSearchRelationParentObjectResultAttributeType(this.rootResultAttributeType);

		return this.parentObjectResultAttributeType;
	}

	/**
	 * 返却属性タイプパスに子オブジェクトを追加します.
	 */
	public child(): EIMSimpleSearchRelationChildObjectResultAttributeType {
		this.attributeTypeDefNames = ['child'];
		this.childObjectResultAttributeType = new EIMSimpleSearchRelationChildObjectResultAttributeType(this.rootResultAttributeType);

		return this.childObjectResultAttributeType;
	}

}

/**
 * リレーション情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchRelationResultAttributeType extends EIMSimpleSearchRelationResultAttributeTypeWithoutAttribute {

	/** 属性情報の返却属性タイプ */
	private attributeResultAttributeType: EIMSimpleSearchRelationResultAttributeTypeWithoutAttribute = null;

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {

		let paths: string[] = super.getAttributeTypeDefinitionNamePath();

		// 属性値指定時
		if (this.attributeResultAttributeType) {
			paths = paths.concat(this.attributeResultAttributeType.getAttributeTypeDefinitionNamePath());

		}

		return paths;
	}

	/**
	 * 返却属性タイプパスに属性値を追加します.
	 */
	public attribute(definitionName?: string): EIMSimpleSearchRelationResultAttributeTypeWithoutAttribute {

		if (definitionName) {
			this.attributeTypeDefNames = ['attributeMap', definitionName];
		} else {
			this.attributeTypeDefNames = ['attributeMap'];
		}

		this.attributeResultAttributeType = new 
				EIMSimpleSearchRelationResultAttributeTypeWithoutAttribute(this.rootResultAttributeType);

		return this.attributeResultAttributeType;
	}
}

/**
 * リレーションタイプ情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchRelationTypeResultAttributeType extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAMEを追加します.
	 */
	public name(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['name'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}

	/**
	 * 返却属性タイプパスにNAME(定義名称)を追加します.
	 */
	public definitionName(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['definitionName'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}
}

/**
 * リレーション親オブジェクト情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchRelationParentObjectResultAttributeType extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}
}

/**
 * リレーション子オブジェクト情報の返却属性タイプ保持クラスです.
 */
export class EIMSimpleSearchRelationChildObjectResultAttributeType extends EIMSimpleSearchResultAttributeType {

	/** 返却属性タイプの定義名称リスト（パス） */
	private attributeTypeDefNames: string[] = [];

	/**
	 * 返却属性タイプパス配列を返却します.
	 *
	 * @returns 返却属性タイプパス配列
	 */
	public getAttributeTypeDefinitionNamePath(): string[] {
		let paths: string[] = this.attributeTypeDefNames;

		return paths;
	}

	/**
	 * 返却属性タイプパスにIDを追加します.
	 */
	public id(): EIMSimpleSearchResultAttributeType {
		this.attributeTypeDefNames = ['id'];

		return new EIMSimpleSearchResultAttributeType(this.rootResultAttributeType);
	}
}

