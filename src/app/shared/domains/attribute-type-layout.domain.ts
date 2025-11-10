import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeTypeDomain } from './entity/attribute-type.domain';
import { EIMSearchMasterDisplayConfigDomain } from './search-master-display-config.domain';

/**
 * 属性タイプレイアウトドメイン
 * @class EIMAttributeTypeLayoutDomain
 * @module EIMSharedModule
 * @constructor
 */
export class EIMAttributeTypeLayoutDomain extends EIMAttributeTypeDomain {

	/**
	 *  可視性(true:可視性あり)
	 *  @property visible
	 *  @type boolean
	 */
	/** 可視性(true:可視性あり) */
	public visible = false;

	/** 必須区分(true:必須) */
	public required: boolean;

	/** UIコントロールタイプ */
	public uiControlType: string;

	/** UIコントロールID */
	public uiControlId: string;

	/** 参照タイプマスタの画面定義 */
 	public searchMasterDisplayConfig: EIMSearchMasterDisplayConfigDomain;

	/** 表示順設定フラグ(true:設定済み) */
	public orderSetFlag: boolean;

	/** 複製フラグ(true:複製対象) */
	public newCopyFlag = true;

	/** 表示列ID */
	public formListColumnId: string;

	/** 初期値一覧 数値型 */
	public initialLongValueList: number[] = [];

	/** 初期値一覧 文字列型 */
	public initialStringValueList: string[] = [];

	/** 初期値一覧 実数型 **/
	public initialDoubleValueList: number[] = [];

	/** 初期値一覧 コード型 */
	public initialCodeValueList: number[] = [];

	/** 初期値一覧 ユーザ型 */
	public initialUserValueList: string[] = [];

	public getInitialValueList(): any[] {
		  switch (this.valueType) {
		  case 'LONG':
		    return this.initialLongValueList;
		  case 'STRING':
		  	return this.initialStringValueList;
		  case 'DATE':
		    break;
		  case 'TEXT':
		  	return this.initialStringValueList;
		  case 'DOUBLE':
		  	return this.initialDoubleValueList;
		  case 'OBJECT':
		    break;
		  case 'USER':
		  	return this.initialUserValueList;
		  case 'CODE':
		  	return this.initialCodeValueList;
	  }
		return [];
	}

	public setInitialValueList(initialValueList: any[]): void {
		  switch (this.valueType) {
		  case 'LONG':
		    this.initialLongValueList = initialValueList;
		    break;
		  case 'STRING':
		  	this.initialStringValueList = initialValueList;
		    break;
		  case 'DATE':
		    break;
		  case 'TEXT':
		  	this.initialStringValueList = initialValueList;
		    break;
		  case 'DOUBLE':
		  	this.initialDoubleValueList = initialValueList;
		    break;
		  case 'OBJECT':
		    break;
		  case 'USER':
		  	this.initialUserValueList = initialValueList;
		    break;
		  case 'CODE':
// this.initialUserValueList = initialValueList;
		    break;
	  }
	}

	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.visible = json.visible;
		this.required = json.required;
		this.uiControlType = json.uiControlType;
		this.uiControlId = json.uiControlId;
		if (json.searchMasterDisplayConfig) {
			this.searchMasterDisplayConfig = domainService.createObject(json.searchMasterDisplayConfig,
					(_json: any) => {
						return new EIMSearchMasterDisplayConfigDomain(_json);
					});
		}
		this.orderSetFlag = json.orderSetFlag;
		this.newCopyFlag = json.newCopyFlag;
		this.formListColumnId = json.formListColumnId;
		this.initialLongValueList = json.initialLongValueList;
		this.initialStringValueList = json.initialStringValueList;
		this.initialDoubleValueList = json.initialDoubleValueList;
		this.initialCodeValueList = json.initialCodeValueList;
		this.initialUserValueList = json.initialUserValueList;
	}
}
