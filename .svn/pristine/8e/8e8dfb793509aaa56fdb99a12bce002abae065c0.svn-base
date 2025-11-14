import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './object.domain';
import { EIMAttributeTypeDomain } from './attribute-type.domain';
import { EIMUserDomain } from './user.domain';
import { EIMCodeDomain } from './code.domain';

/**
 * 属性ドメイン
 */
export class EIMAttributeDomain {
	/** 属性タイプ */
	public attributeType: EIMAttributeTypeDomain = null;

	/** 数値型属性値配列 */
	public longList: number[] = [];

	/** 日付型属性値配列 */
	public dateList: Date[] = [];

	/** 実数型属性値配列 */
	public doubleList: number[] = [];

	/** テキスト型属性値配列 */
	public textList: string[] = [];

	/** 文字列型属性値配列 */
	public stringList: string[] = [];

	/** オブジェクト型属性値配列 */
	public objectList: EIMObjectDomain[] = [];

	/** ユーザ型属性値配列 */
	public userList: EIMUserDomain[] = [];

	/** コード型属性値配列 */
	public codeList: EIMCodeDomain[] = [];

	public getValueList(): any[] {
		switch (this.attributeType.valueType) {
			case 'LONG':
				return this.longList;
			case 'STRING':
				return this.stringList;
			case 'DATE':
				return this.dateList;
			case 'TEXT':
				return this.textList;
			case 'DOUBLE':
				return this.doubleList;
			case 'OBJECT':
				return this.objectList;
			case 'USER':
				return this.userList;
			case 'CODE':
				return this.codeList;
		}
		return [];
	}

	public setValueList(valueList: any[]): void {
		switch (this.attributeType.valueType) {
			case 'LONG':
				this.assign(this.longList, valueList);
				break;
			case 'STRING':
				this.assign(this.stringList, valueList);
				break;
			case 'DATE':
				this.assign(this.dateList, valueList);
				break;
			case 'TEXT':
				this.assign(this.textList, valueList);
				break;
			case 'DOUBLE':
				this.assign(this.doubleList, valueList);
				break;
			case 'OBJECT':
				this.assign(this.objectList, valueList);
				break;
			case 'USER':
				this.assign(this.userList, valueList);
				break;
			case 'CODE':
				this.assign(this.codeList, valueList);
				break;
		}
	}

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.attributeType = domainService.createObject(json.attributeType,
				(_json: any) => {
					return new EIMAttributeTypeDomain(_json);
				});
		this.longList = domainService.createObjectList(json.longList,
				(_json: any) => {
					return _json;
				});
		this.dateList = domainService.createObjectList(json.dateList,
				(_json: any) => {
					if (isNaN(_json)) {
						return domainService.convertDateZero(_json);
					} else {
						return new Date(Number(_json));
					}
				});
		this.doubleList = domainService.createObjectList(json.doubleList,
				(_json: any) => {
					return _json;
				});
		this.textList = domainService.createObjectList(json.textList,
				(_json: any) => {
					return _json;
				});
		this.stringList = domainService.createObjectList(json.stringList,
				(_json: any) => {
					return _json;
				});

		this.objectList = domainService.createObjectList(json.objectList,
				(_json: any) => {
					return new EIMObjectDomain(_json);
				});
		this.userList = domainService.createObjectList(json.userList,
				(_json: any) => {
					return new EIMUserDomain(_json);
				});
		this.codeList = domainService.createObjectList(json.codeList,
				(_json: any) => {
					return new EIMCodeDomain(_json);
				});
	}

	/**
	 * 値リストを設定します.
	 * @param valueList 設定される既存の値リスト
	 * @param newValueList 設定する値リスト
	 */
	private assign(valueList: any[], newValueList): void {
		Object.assign(valueList, newValueList);
		if (valueList.length > newValueList.length) {
			// 配列の要素数が減る場合
			// 余剰分を削除
			valueList.splice(newValueList.length, valueList.length - newValueList.length);
		}
	}

}
