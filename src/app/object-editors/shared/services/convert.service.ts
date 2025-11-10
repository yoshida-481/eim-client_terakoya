import { Injectable, Output } from '@angular/core';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMAttributeTypeDTO } from 'app/object-editors/shared/dtos/attribute-type.dto';

/**
 * 変換サービス
 */
@Injectable()
export class EIMConvertService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected dateService: EIMDateService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性JSONリストを属性ドメインリストに変換します.
	 * @param json JSON
	 * @return 属性ドメイン
	 */
	public convertAttributeDomainList(jsons: any): EIMAttributeDomain[] {
		if (!jsons) {
			return [];
		}
		let attributeList: EIMAttributeDomain[] = [];
		if (Array.isArray(jsons)) {
			for (let i = 0; i < jsons.length; i++) {
				attributeList.push(this.convertAttributeDomain(jsons[i]));
			}
		} else {
			attributeList.push(this.convertAttributeDomain(jsons));
		}
		return attributeList;
	}

	/**
	 * リクエストパラメータに属性ドメインを追加します.
	 * @param param リクエストパラメータ
	 * @param attributeList 属性ドメインリスト
	 */
	public setAttributeRequestParameter(param: any, attributeList: EIMAttributeDomain[]): void {
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMAttributeDomain = attributeList[i];
			switch (attribute.attributeType.valueType) {
				case EIMConstantService.VALUE_TYPE_NAME_DATE:
					// 日時の場合
					this.setValueListRequestParameter(
							param, attribute.attributeType, attribute.getValueList(),
							(date: Date) => {
								return this.dateService.getDateTimeString(date.getTime());
							});
					break;
				case EIMConstantService.VALUE_TYPE_NAME_USER:
					// ユーザの場合
					this.setValueListRequestParameter(
							param, attribute.attributeType, attribute.getValueList(),
							(user: EIMUserDomain) => {
								return user.id;
							});
					break;
				case EIMConstantService.VALUE_TYPE_NAME_CODE:
					// コードの場合
					this.setValueListRequestParameter(
							param, attribute.attributeType, attribute.getValueList(),
							(code: EIMCodeDomain) => {
								return code.code;
							});
					break;
				case EIMConstantService.VALUE_TYPE_NAME_OBJECT:
					// オブジェクトの場合
					this.setValueListRequestParameter(
						param, attribute.attributeType, attribute.getValueList(),
						(object: EIMObjectDomain) => {
							return object.id;
						});
					break;
				default:
					this.setValueListRequestParameter(
							param, attribute.attributeType, attribute.getValueList());
			}
		}
	}


	/**
	 * 属性タイプDTOリストを属性ドメインリストに変換します.
	 * @param json 属性タイプDTOリスト
	 * @return 属性ドメイン
	 */
	public convertAttributeDomainListFromDTO(attrTypeList: EIMAttributeTypeDTO[]): EIMAttributeDomain[] {
		let result: EIMAttributeDomain[] = [];

		for (let i = 0; i < attrTypeList.length; i++) {
			let attribute: EIMAttributeDomain = new EIMAttributeDomain();
			result.push(attribute);
			let attributeType: EIMAttributeTypeDomain = new EIMAttributeTypeDomain();
			attribute.attributeType = attributeType;

			attributeType.id = attrTypeList[i].id;
			attributeType.name = attrTypeList[i].name;
			attributeType.multiple = attrTypeList[i].multiple;

			switch (Number(attrTypeList[i].valueTypeId)) {
				case EIMConstantService.VALUE_TYPE_INTEGER:
					attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_INTEGER;
					break;
				case EIMConstantService.VALUE_TYPE_STRING:
					attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_STRING;
					break;
				case EIMConstantService.VALUE_TYPE_DATE:
					attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_DATE;
					break;
				case EIMConstantService.VALUE_TYPE_TEXT:
					attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_TEXT;
					break;
				case EIMConstantService.VALUE_TYPE_DOUBLE:
					attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_DOUBLE;
					break;
				case EIMConstantService.VALUE_TYPE_OBJECT:
					attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_OBJECT;
					break;
				case EIMConstantService.VALUE_TYPE_USER:
					attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_USER;
					break;
				case EIMConstantService.VALUE_TYPE_CODE:
					let codeType = new EIMCodeTypeDomain()
					codeType.id = attrTypeList[i].codeTypeId;
					codeType.codeList = attrTypeList[i].codeList;
					attributeType.codeType = codeType;
					attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_CODE;
					break;
			}
		}

		return result;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * リクエストパラメータに属性値リストを追加します.
	 * @param param リクエストパラメータ
	 * @param attributeType 属性タイプ
	 * @param valueList 属性値リスト
	 * @param converter 変換関数
	 */
	protected setValueListRequestParameter(param: any, attributeType: EIMAttributeTypeDomain, valueList: any[], converter?: (value: any) => any): void {
		let paramValueList: any[] = [];
		let paramIndex = 0;
		for (let i = 0; i < valueList.length; i++) {
			// パラメータのキー設定
			let key = 'attType_' + attributeType.id + '_' + paramIndex + '_';
			if (attributeType.codeType) {
				key += attributeType.codeType.id;
			}

			// パラメータの値設定
			let value;
			if (converter) {
				value = converter(valueList[i]);
			} else {
				value = valueList[i];
			}
			// 値が空でない場合、追加
			if (value) {
				param[key] = value;
				paramIndex++;
			}
		}
	}

	/**
	 * 属性JSONを属性ドメインに変換します.
	 * @param json JSON
	 * @return 属性ドメイン
	 */
	protected convertAttributeDomain(json: any): EIMAttributeDomain {
		if (json == null) {
			return null;
		}

		let attribute: EIMAttributeDomain = new EIMAttributeDomain();
		attribute.attributeType = new EIMAttributeTypeDomain();
		attribute.attributeType.id = Number(json.attr.attTypeId);
		attribute.attributeType.name = json.attr.attTypeName;
		if (json.attr.isMultiple === 'true') {
			attribute.attributeType.multiple = true;
		} else {
			attribute.attributeType.multiple = false;
		}

		// コードシーケンスとコードのマップ
		let codeSeqAndCodeMap: any = {};

		if (json.codeList && json.codeList.code) {
			// コードの場合はコードリストを設定
			let codeList: EIMCodeDomain[] = [];

			if (Array.isArray(json.codeList.code)) {
				// 複数の場合
				for (let i = 0; i < json.codeList.code.length; i++) {
					let code: EIMCodeDomain = this.covertCodeDomain(json.codeList.code[i]);
					codeList.push(code);

					codeSeqAndCodeMap[code.sequence] = code;
				}
			} else {
				// 単数の場合
				let code: EIMCodeDomain = this.covertCodeDomain(json.codeList.code);
				codeList.push(code);

				codeSeqAndCodeMap[code.sequence] = code;

			}
			attribute.attributeType.codeType = new EIMCodeTypeDomain();
			attribute.attributeType.codeType.codeList = codeList;
		}

		// 型毎に属性値を設定
		switch (Number(json.attr.valTypeId)) {
			case EIMConstantService.VALUE_TYPE_INTEGER:
				attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_INTEGER;
				this.setValueList(attribute, json, this.convertValueTypeString);
				break;
			case EIMConstantService.VALUE_TYPE_STRING:
				attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_STRING;
				this.setValueList(attribute, json, this.convertValueTypeString);
				break;
			case EIMConstantService.VALUE_TYPE_DATE:
				attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_DATE;
				this.setValueList(attribute, json, this.convertValueTypeDate);
				break;
			case EIMConstantService.VALUE_TYPE_TEXT:
				attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_TEXT;
				this.setValueList(attribute, json, this.convertValueTypeString);
				break;
			case EIMConstantService.VALUE_TYPE_DOUBLE:
				attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_DOUBLE;
				this.setValueList(attribute, json, this.convertValueTypeString);
				break;
			case EIMConstantService.VALUE_TYPE_OBJECT:
				attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_OBJECT;
				this.setValueList(attribute, json, this.convertValueTypeObject);
				break;
			case EIMConstantService.VALUE_TYPE_USER:
				attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_USER;
				this.setValueList(attribute, json, this.convertValueTypeUser);
				break;
			case EIMConstantService.VALUE_TYPE_CODE:
				attribute.attributeType.codeType.id = Number(json.attr.codeTypeId);
				attribute.attributeType.valueType = EIMConstantService.VALUE_TYPE_NAME_CODE;
				this.setValueList(attribute, json, this.convertValueTypeCode, codeSeqAndCodeMap);
				break;
		}
		return attribute;
	}

	/**
	 * 属性ドメインに属性値を設定します.
	 * 属性ドメインの属性タイプドメイン-多重度を設定してください.
	 * @param attribute 属性
	 * @param json JSON
	 * @param convertFunction 変換関数
	 * @param codeSeqAndCodeMap コードのシーケンスとコードのマップ
	 */
	protected setValueList(attribute: EIMAttributeDomain, json, convertFunction: (json: any, codeSeqAndCodeMap?: any) => void, codeSeqAndCodeMap?: any): void {
		if (attribute.attributeType.multiple && json.attMultipleList.attMultiple) {
			// 複数値属性
			let values: any[] = [];
			if (Array.isArray(json.attMultipleList.attMultiple)) {
				// 複数
				for (let i = 0; i < json.attMultipleList.attMultiple.length; i++) {
					values.push(convertFunction(json.attMultipleList.attMultiple[i], codeSeqAndCodeMap));
				}
			} else {
				// 単数
				values.push(convertFunction(json.attMultipleList.attMultiple, codeSeqAndCodeMap));
		}
			attribute.setValueList(values);
		} else if (json.attr.attValue) {
			// 単数値属性
			attribute.setValueList([convertFunction(json, codeSeqAndCodeMap)]);
		}
	}

	/**
	 * 文字型属性のJSONを文字列に変換して返却します.
	 * @param json JSON
	 * @return 文字列
	 */
	protected convertValueTypeString(json: any): string {
		return json.attr.attValue;
	}

	/**
	 * 日付型属性のJSONを文字列に変換して返却します.
	 * @param json JSON
	 * @return 文字列
	 */
	protected convertValueTypeDate(json: any): Date {
		return new Date(json.attr.attValue.replace(/-/g, '/'));
	}

	/**
	 * ユーザ型属性のJSONをユーザドメインに変換して返却します.
	 * @param json JSON
	 * @return ユーザ
	 */
	protected convertValueTypeUser(json: any): EIMUserDomain {
		let user: EIMUserDomain = new EIMUserDomain();
		user.id = Number(json.attr.attValue);
		user.name = json.attr.attValueDisplay;
		user.code = json.attr.attValueDisplayUserCode;
		return user;
	}

	/**
	 * コード型属性のJSONをコードドメインに変換して返却します.
	 * @param json JSON
	 * @param codeSeqAndCodeMap コードのシーケンスとコードのマップ
	 * @return コード
	 */
	protected convertValueTypeCode(json: any, codeSeqAndCodeMap: any): EIMCodeDomain {
		return codeSeqAndCodeMap[Number(json.attr.codeSequence)];
	}

	/**
	 * オブジェクト型属性のJSONをオブジェクトドメインに変換して返却します.
	 * @param json JSON
	 * @return オブジェクト
	 */
	protected convertValueTypeObject(json: any): EIMObjectDomain {
		let object: EIMObjectDomain = new EIMObjectDomain();
		object.id = json.attr.attValue;
		object.name = json.attr.attValueDisplay;
		return object;
	}

	/**
	 * コードJSONをコードドメインに変換します.
	 * @param json JSON
	 * @return コードドメイン
	 */
	protected covertCodeDomain(json: any): EIMCodeDomain {
		let code: EIMCodeDomain = new EIMCodeDomain();
		code.id = Number(json.attr.id);
		code.name = json.attr.name;
		code.code = json.attr.value;
		code.sequence = Number(json.attr.sequence);

		return code;
	}
}
