import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMObjectDomain } from './object.domain';
import { EIMOtherNameDomain } from './other-name.domain';
import { EIMCodeTypeDomain } from './code-type.domain';

/**
 * 属性タイプドメイン
 */
export class EIMAttributeTypeDomain {
	/** 属性タイプID */
	public id = 0;

	/** 属性タイプ名 */
	public name: string = null;

	/** 属性タイプ定義名称 */
	public definitionName: string = null;

	/** データ型 */
	public valueType: string = null;

	/** 多重度 */
	public multiple = false;

	/** 親オブジェクトID */
	public pearentObjId = '';

	/** 属性タイプ名称一覧 */
	public nameList: EIMOtherNameDomain[]  = [];

	/** デフォルト値一覧 数値型 */
	public defaultLongValueList: number[] = [];

	/** デフォルト値一覧 日付型 */
	public defaultDateValueList: Date[] = [];

	/** デフォルト値一覧 実数型 */
	public defaultDoubleValueList: number[] = [];

	/** デフォルト値一覧 テキスト型 */
	public defaultTextValueList: string[] = [];

	/** デフォルト値一覧 文字列型 */
	public defaultStringValueList: string[] = [];

	/** コードタイプ */
	public codeType: EIMCodeTypeDomain = null;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.id;
		this.name = json.name;
		this.definitionName = json.definitionName;
		this.valueType = json.valueType;
		this.multiple = json.multiple;
		this.nameList = domainService.createObjectList(json.nameList,
				(_json: any) => {
					return new EIMOtherNameDomain(_json);
				});
		this.defaultLongValueList = domainService.createObjectList(json.defaultLongValueList,
				(_json: any) => {
					return _json;
				});
		this.defaultDateValueList = domainService.createObjectList(json.defaultDateValueList,
				(_json: any) => {
					return domainService.convertDate(_json);
				});
		this.defaultDoubleValueList = domainService.createObjectList(json.defaultDoubleValueList,
				(_json: any) => {
					return _json;
				});
		this.defaultTextValueList = domainService.createObjectList(json.defaultTextValueList,
				(_json: any) => {
					return _json;
				});
		this.defaultStringValueList = domainService.createObjectList(json.defaultStringValueList,
				(_json: any) => {
					return _json;
				});
		this.codeType = domainService.createObject(json.codeType,
				(_json: any) => {
					return new EIMCodeTypeDomain(_json);
				});

	}
}
