import { TranslateService } from '@ngx-translate/core';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMListValueDTO } from 'app/admins/shared/dtos/list-value.dto';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMDataTypeDomain } from 'app/admins/shared/domains/dataType.domain';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMListValueDomain } from 'app/shared/domains/list-value.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * 属性タイプAPIサービス
 */
@Injectable()
export class EIMAdminAttributeService {

	constructor(
		private translateService: TranslateService,
		protected domainService: EIMDomainService,
		private httpService: EIMHttpService,
		private jsonService: EIMJSONService
	) {
	}

	/**
	 * 指定されたキーワードで検索し、合致する定義名称を持つ属性タイプリストを取得します.
	 * @param name 検索文字列
	 * @return 合致する属性タイプ一覧
	 */
	public getListByName(name: string, relationViewFlag?: boolean, documentTypeFlag?: boolean): Observable<EIMAttributeTypeDTO[]> {
		return this.httpService.postForForm('/admin/attribute/dspAttributeTypeList.jsp',
				{attTypeName: name, documentTypeFlag: documentTypeFlag, relationViewFlag: relationViewFlag})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.attTypes.attType,
					(_json: any) => {
						return new EIMAttributeTypeDTO(_json);
			}));
		}))
	}

	/**
	 * 属性タイプIDから紐づくリスト値を取得します.
	 * @param attTypeId 属性タイプID
	 * @return リスト値一覧
	 */
	public getListByValue(attTypeId: number): Observable<EIMListValueDTO[]> {
		return this.httpService.postForForm('/admin/attribute/dspAttTypeValueList.jsp', {attTypeId: attTypeId}, false)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.definitionValuesList.definitionValue,
					(_json: any) => {
						return new EIMListValueDTO(_json);
					}));
			}));
	}

	/**
	 * ネームスペースリストを返却します.
	 * @return ネームスペース一覧
	 */
	public getNamespaceList(): Observable<EIMSpnameDTO[]> {
		return this.httpService.get('/admin/conf/dspNamespaceXML.jsp', false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.namespaceConf.namespaceList.namespace,
						(_json: any) => {
							return new EIMSpnameDTO(_json);
						}));
			}));
	}

	/**
	 * 属性を新規登録します.（汎用）
	 * @param attribute 登録属性タイプ
	 * @return 登録後属性タイプ
	 */
	public create(attribute: EIMAdminAttributeTypeDomain): Observable<EIMAttributeTypeDTO> {
		let params: any = {
			definitionName: attribute.definitionName,
			namespace: attribute.namespace,
			otherCnt: attribute.otherCnt,
			valTypeId: attribute.valTypeId,
			inputRuleCheck: attribute.inputRuleCheck,
			required: attribute.required,
			multipleCheck: attribute.isMultiple,
			codeTypeId: '',
			codeTypeName: '',
		};
		params = this.convertOtherName(params, attribute);
		// 初期値入力
		let defValueList: any[] = this.justifyDefValue(attribute.defValueList);
		for (let i = 0; i < defValueList.length; i++) {
			params['defaultValue_' + i] = defValueList[i];
		}
		// コード型の場合、選択されたコードタイプを設定
		if (attribute.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE) {
			params.codeTypeId = attribute.codeTypeId ? attribute.codeTypeId : '';
			params.codeTypeName = attribute.codeTypeName ? attribute.codeTypeName : '';
		}
		return this.httpService.postForForm('/admin/attribute/actCreateAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMAttributeTypeDTO(res.value.attType));
			}));
	}

	/**
	 * 属性を更新します.（汎用）
	 * @param attribute 更新属性タイプ
	 * @return 更新後属性タイプ
	 */
	public update(attribute: EIMAdminAttributeTypeDomain): Observable<EIMAttributeTypeDTO> {
		let params: any = {
			attTypeId: attribute.attTypeId,
			definitionName: attribute.definitionName,
			namespace: attribute.namespace,
			otherCnt: attribute.otherCnt,
			codeTypeId: '',
			codeTypeName: '',
			refmasterTypeName: attribute.refmasterTypeName,
			inputRuleCheck: attribute.inputRuleCheck,
			required: attribute.required,
			multipleCheck: attribute.isMultiple,
			valTypeName: attribute.valTypeName,
		};
		params = this.convertOtherName(params, attribute);
		// 初期値入力
		let defValueList: any[] = this.justifyDefValue(attribute.defValueList);
		for (let i = 0; i < defValueList.length; i++) {
			params['defaultValue_' + i] = defValueList[i];
		}
		// コード型の場合、選択されたコードタイプを設定
		if (attribute.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE) {
			params.codeTypeId = attribute.codeTypeId ? attribute.codeTypeId : '';
			params.codeTypeName = attribute.codeTypeName ? attribute.codeTypeName : '';
		}
		return this.httpService.postForForm('/admin/attribute/actUpdateAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				// データ型が表示と食い違うので、修正処理を行う
				res.value.attType.attr.valTypeName = this.translateService.instant('EIM.VALUETYPE.' + res.value.attType.attr.valTypeName);
				return of(new EIMAttributeTypeDTO(res.value.attType));
			}));
	}

	/**
	 * 属性を削除します.
	 * @param attTypeId 削除対象属性ID
	 * @return 削除対象属性ID
	 */
	public delete(attTypeId: number): Observable<number> {
		let params: any = {};
			params['attTypeId'] = attTypeId;
		return this.httpService.postForForm('/admin/attribute/actDeleteAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(attTypeId);
			}));
	}

	/**
	 * 属性を新規登録します.（ドキュメント）
	 * @param attribute 登録属性タイプ
	 * @return 登録後属性タイプ
	 */
	public createForDocument (attribute: EIMAdminAttributeTypeDomain): Observable<EIMAttributeTypeDTO> {
		let params: any = {
			definitionName: attribute.definitionName,
			namespace: attribute.namespace,
			otherCnt: attribute.otherCnt,
			codeTypeId: '',
			codeTypeName: '',
			valTypeId: attribute.valTypeId,
			uicontrolId: attribute.uicontrolId,
			uicontrolType: attribute.uicontrolType,
			uicontrolName: attribute.uicontrolName,
			inputRuleCheck: attribute.inputRuleCheck,
			required: attribute.required,
			refmasterTypeName: attribute.refmasterTypeName,
			multipleCheck: attribute.isMultiple
		};
		params = this.convertOtherName(params, attribute);
		// リスト定義している場合
		if (attribute.inputRuleCheck) {
			params.uicontrolType = 'ComboBox';
		}
		// 初期値入力
		let defValueList: any[] = this.justifyDefValue(attribute.initValueList);
		for (let i = 0; i < defValueList.length; i++) {
			params['initValue_' + i] = defValueList[i];
		}
		return this.httpService.postForForm('/admin/attribute/actCreateAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMAttributeTypeDTO(res.value.attType));
			}));
	}

	/**
	 * 更新対象の属性を取得します.
	 * @param attTypeId 更新対象属性タイプID
	 * @return 更新対象属性タイプ
	 */
	public getAttributeType(attTypeId: number): Observable<EIMAdminAttributeTypeDomain> {
		return this.httpService.postForForm('/admin/attribute/dspAttributeType.jsp', {attTypeId: attTypeId})
			.pipe(mergeMap((res: any) => {
				return of(new EIMAdminAttributeTypeDomain(res.value.attType));
			}));
	}

	/**
	 * 属性を更新します.（ドキュメント）
	 * @param attribute 属性タイプ
	 * @return 更新後属性タイプ
	 */
	public updateForDocument(attribute: EIMAdminAttributeTypeDomain): Observable<EIMAttributeTypeDTO> {
		let params: any = {
			attTypeId: attribute.attTypeId,
			definitionName: attribute.definitionName,
			namespace: attribute.namespace,
			otherCnt: attribute.otherCnt,
			codeTypeId: '',
			codeTypeName: '',
			uicontrolId: attribute.uicontrolId,
			uicontrolType: attribute.uicontrolType,
			uicontrolName: attribute.uicontrolName,
			inputRuleCheck: attribute.inputRuleCheck,
			required: attribute.required,
			refmasterTypeName: attribute.refmasterTypeName,
			multipleCheck: attribute.isMultiple,
			valTypeName: attribute.valTypeName,
		};
		params = this.convertOtherName(params, attribute);
		// リスト定義の場合
		if (attribute.inputRuleCheck) {
			params.uicontrolType = 'ComboBox';
		}
		// コード型の場合、選択されたコードタイプを設定
		if (attribute.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE) {
			params.codeTypeId = attribute.codeTypeId;
			params.codeTypeName = attribute.codeTypeName;
		}
		// 初期値入力
		let defValueList: any[] = this.justifyDefValue(attribute.defValueList);
		for (let i = 0; i < defValueList.length; i++) {
			params['defaultValue_' + i] = defValueList[i];
		}
		let initValueList: any[] = this.justifyDefValue(attribute.initValueList);
		for (let i = 0; i < initValueList.length; i++) {
			params['initValue_' + i] = initValueList[i];
		}

		return this.httpService.postForForm('/admin/attribute/actUpdateAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				// データ型が表示と食い違うので、修正処理を行う
				res.value.attType.attr.valTypeName = this.translateService.instant('EIM.VALUETYPE.' + res.value.attType.attr.valTypeName);
				return of(new EIMAttributeTypeDTO(res.value.attType));
			}));

	}

	/**
	 * 属性を新規登録します.(帳票)
	 * @param attribute 属性インターフェース
	 * @return 登録属性タイプ
	 */
	public createForForm(attribute: EIMAdminAttributeTypeDomain): Observable<EIMAttributeTypeDTO> {
		let params: any = {
			definitionName: attribute.definitionName,
			namespace: attribute.namespace,
			otherCnt: attribute.otherCnt,
			codeTypeId: '',
			codeTypeName: '',
			valTypeId: attribute.valTypeId,
			uicontrolId: attribute.uicontrolId,
			uicontrolType: attribute.uicontrolType,
			uicontrolName: attribute.uicontrolName,
			inputRuleCheck: attribute.inputRuleCheck,
			required: attribute.required,
			multipleCheck: attribute.isMultiple,
			refmasterTypeName: attribute.refmasterTypeName,
		};
		params = this.convertOtherName(params, attribute);

		// コード型の場合、選択されたコードタイプを設定
		if (attribute.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE) {
			params.codeTypeId = attribute.codeTypeId ? attribute.codeTypeId : '';
			params.codeTypeName = attribute.codeTypeName ? attribute.codeTypeName : '';
		}
		// 初期値入力
		let defValueList: any[] = this.justifyDefValue(attribute.initValueList);
		for (let i = 0; i < defValueList.length; i++) {
			params['initValue_' + i] = defValueList[i];
		}

		return this.httpService.postForForm('/admin/attribute/actCreateAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMAttributeTypeDTO(res.value.attType));
			}));
	}

	/**
	 * 属性を更新します.(帳票)
	 * @param attribute 属性タイプ
	 * @return 更新後属性タイプ
	 */
	public updateForForm(attribute: EIMAdminAttributeTypeDomain): Observable<EIMAttributeTypeDTO> {
		let params: any = {
			attTypeId: attribute.attTypeId,
			definitionName: attribute.definitionName,
			namespace: attribute.namespace,
			otherCnt: attribute.otherCnt,
			codeTypeId: '',
			codeTypeName: '',
			uicontrolId: attribute.uicontrolId,
			uicontrolType: attribute.uicontrolType,
			uicontrolName: attribute.uicontrolName,
			inputRuleCheck: attribute.inputRuleCheck,
			required: attribute.required,
			refmasterTypeName: attribute.refmasterTypeName,
			multipleCheck: attribute.isMultiple,
			valTypeName: attribute.valTypeName,
		};
		params = this.convertOtherName(params, attribute);
		// コード型の場合、選択されたコードタイプを設定
		if (attribute.valTypeId === EIMAdminsConstantService.VALUE_TYPE_CODE) {
			params.codeTypeId = attribute.codeTypeId ? attribute.codeTypeId : '';
			params.codeTypeName = attribute.codeTypeName ? attribute.codeTypeName : '';
		}

		// 初期値入力
		let defValueList: any[] = this.justifyDefValue(attribute.initValueList);
		for (let i = 0; i < defValueList.length; i++) {
			params['initValue_' + i] = defValueList[i];
		}

		return this.httpService.postForForm('/admin/attribute/actUpdateAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				// 返却されるデータ型が表示形式と異なるため、修正処理を行う
				res.value.attType.attr.valTypeName = this.translateService.instant('EIM.VALUETYPE.' + res.value.attType.attr.valTypeName);
				return of(new EIMAttributeTypeDTO(res.value.attType));
			}));
	}

	/**
	 * リスト値を新規登録します.
	 * @param listValue 作成リスト値
	 * @return 登録後リスト値一覧
	 */
	public createMaster(listValue: EIMListValueDomain): Observable<EIMListValueDTO[]> {
		let params: any = {};
			params['attTypeId'] = listValue.attTypeId;
			params['isDspColor'] = listValue.isDspColor;
			params['value'] = listValue.value;
			params['valType'] = listValue.valType;
			params['color'] = listValue.isDspColor ? listValue.color : EIMAdminsConstantService.NO_COLOR;
		return this.httpService.postForForm('/admin/attribute/actCreateMaster.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.definitionValuesList.definitionValue,
					(_json: any) => {
						return new EIMListValueDTO(_json);
					}));
			}));
	}

	/**
	 * リスト値更新画面の初期表示情報を取得します.
	 * @param attributeType 編集対象リスト値を含む対象属性タイプ
	 * @param listValue 編集対象リスト値
	 * @return 更新対象リスト値
	 */
	public getupdateMaster(attributeType: EIMAttributeTypeDTO, listValue: EIMListValueDTO): Observable<EIMListValueDTO> {
		let params: any = {};
			params['attTypeId'] = attributeType.attTypeId;
			params['isDspColor'] = listValue.color !== EIMAdminsConstantService.NO_COLOR;
			params['color'] = listValue.color;
			params['value'] = listValue.value;
			params['valType'] = attributeType.valTypeId;
		return this.httpService.postForForm('/admin/attribute/dspUpdateMaster.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMListValueDTO(res.value.definitionValue));
			}));
	}

	/**
	 * リスト値を更新します.
	 * @param listValue 作成リスト値
	 */
	public updateMaster(listValue: EIMListValueDomain): Observable<EIMListValueDTO[]> {
		let params: any = {};
			params['attTypeId'] = listValue.attTypeId;
			params['beforeValue'] = listValue.beforeValue;
			params['afterValue'] = listValue.afterValue;
			params['isDspColor'] = listValue.isDspColor;
			params['color'] = listValue.isDspColor ? listValue.color : EIMAdminsConstantService.NO_COLOR;
			params['valType'] = listValue.valType;
		return this.httpService.postForForm('/admin/attribute/actUpdateMaster.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.definitionValuesList.definitionValue,
					(_json: any) => {
						return new EIMListValueDTO(_json);
					}));
			}));
	}

	/**
	 * リスト値を削除します.
	 * @param attTypeId リスト値ID
	 * @param value リスト値
	 * @param valType リスト値タイプ
	 * @return 削除後リスト値一覧
	 */
	public deleteMaster(attTypeId: number, value: string, valType: number): Observable<EIMListValueDTO[]> {
		let params: any = {};
			params['attTypeId'] = attTypeId;
			params['value'] = value;
			params['valType'] = valType;
		return this.httpService.postForForm('/admin/attribute/actDeleteMaster.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.definitionValuesList.definitionValue,
					(_json: any) => {
						return new EIMListValueDTO(_json);
					}));
			}));
	}

	/**
	 * リスト値の並べ替えを行います.
	 * @param attributeType 対象属性タイプ
	 * @param listValue 対象リスト値
	 * @param dropIndex 移動先順序
	 * @return 並べ替え後リスト値一覧
	 */
	public updateMasterOrder(attributeType: EIMAttributeTypeDTO, listValue: EIMListValueDTO, dropIndex: number): Observable<EIMListValueDTO[]> {
		let params: any = {};
			params['attTypeId'] = attributeType.attTypeId;
			params['dropIndex'] = dropIndex;
			params['color'] = listValue.color;
			params['value'] = listValue.value;
			params['valType'] = attributeType.valTypeId;
		return this.httpService.postForForm('/admin/attribute/actUpdateMasterOrder.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(this.jsonService.getJsonChildren(res.value.definitionValuesList.definitionValue,
				(_json: any) => {
					return new EIMListValueDTO(_json);
				}));
		}));
	}

	/**
	 * データ型に付随するUIコントロール一覧を取得します.
	 * @return UIコントロールリスト
	 */
	public getUIControlList(): Observable<EIMDataTypeDomain[]> {
		return this.httpService.get('/admin/attribute/dspUIControlList.jsp', null, false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.result.dataTypeList.item,
						(_json: any) => {
							return new EIMDataTypeDomain(_json);
						}));
			}));
	}

	/**
	 * 選択されたパラメータに他言語リストから名称を指定します.
	 * @param params 送信パラメータ
	 * @param attribute 操作対象属性タイプ
	 */
	private convertOtherName(params: any, attribute: EIMAdminAttributeTypeDomain): any {
		for (let i = 0; i < attribute.lang.length; i++) {
			params['otherLId' + i] = attribute.lang[i].otherLId;
			params['otherName' + i] = attribute.lang[i].otherName;
		}
		return params;
	}

	/**
	 * デフォルト値(初期値)を正規化します.
	 * @param defValueList デフォルト値一覧
	 * @return 正規化されたデフォルト値一覧
	 */
	private justifyDefValue(defValueList: any[]): any[] {
		let result: any[] = [];
		for (let i = 0; i < defValueList.length; i++) {
			if (defValueList[i] && defValueList[i] !== '') {
				result.push(defValueList[i]);
			}
		}
		return result;
	}

}
