import { EIMOtherNameDomain } from 'app/admins/shared/domains/other-name.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';

/**
 * 属性タイプドメイン
 */
export class EIMAdminAttributeTypeDomain {

	/** 属性タイプID */
	public attTypeId: number;
	/** ネームスペース */
	public namespace: string;
	/** タイプ型名称 */
	public valTypeName: string;
	/** 表示順序 */
	public otherCnt: number;
	/** 入力規則 */
	public inputRuleCheck: boolean;
	/** 複数値設定 */
	public isMultiple: boolean;
	/** 定義名称 */
	public definitionName: string;
	/** コードタイプID */
	public codeTypeId: number;
	/** コードタイプ名称 */
	public codeTypeName: string;
	/** 必須フラグ */
	public required: boolean;
	/** UIコントロールタイプ */
	public uicontrolType: string;
	/** UIコントロール */
	public uicontrolId: string;
	/** タイプ型ID */
	public valTypeId: number;
	/** 言語 */
	public lang: any[] = [];
	/** デフォルト値リスト */
	public defValueList: any[] = [];
	/** 初期値リスト */
	public initValueList: any[] = [];
	/** コードリスト */
	public codeList: any[] = [];
	/** UIコントロール名称 */
	public uicontrolName: string;
	/** マスタ定義タイプ名称 */
	public refmasterTypeName: string;

	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.attTypeId = Number(json.attr.attTypeId);
		this.namespace = json.attr.namespace;
		this.valTypeName = json.attr.valTypeName;
		this.otherCnt = Number(json.attr.otherCnt);
		this.inputRuleCheck = json.attr.isValMaster === 'true';
		this.isMultiple = json.attr.isMultiple === 'true';
		this.definitionName = json.attr.definitionName;
		this.codeTypeId = Number(json.attr.codeTypeId);
		this.codeTypeName = json.attr.codeTypeName;
		this.required = json.attr.attTypeEssential === 'true';
		this.uicontrolType = json.attr.uiControlType;
		this.uicontrolId = json.attr.uiControlId === 'null' ? null : json.attr.uiControlId;

		this.lang = domainService.createObjectList(json.lang,
				(_json: any) => {
					return {otherLId: _json.attr.otherLId, otherName: _json.attr.otherName};
				});
		this.defValueList = this.convertDefValueList(json);
		this.initValueList = this.convertInitValueList(json);
		this.codeList = this.convertCodeList(json);
	}


	/**
	 * codeのvalue取得
	 * @param json 属性情報
	 * @return code一覧
	 */
	private convertCodeList(json: any): any[] {
		if (!json.codeList) {
			return [];
		}
		let codeList: any[] = [];
		let tempCodeList: any = json.codeList.code;
		if (!tempCodeList) {
			return [];
		}
		if (!tempCodeList.length) {
			return [{id: Number(tempCodeList.attr.id), code: tempCodeList.attr.code, name: tempCodeList.attr.name}];
		}
		for (let i = 0; i < tempCodeList.length; i++) {
			codeList.push({id: Number(tempCodeList[i].attr.id), code: tempCodeList[i].attr.code, name: tempCodeList[i].attr.name});
		}
		return codeList;
	}

	/**
	 * defValueのvalue取得
	 * @param json 属性情報
	 * @return defValue一覧
	 */
	private convertDefValueList(json: any): string[] {
		if (!json.defValueList) {
			return [];
		}
		let defValueList: string[] = [];
		let tempDefValueList: any = json.defValueList.defValue;
		if (!tempDefValueList.length) {
			return [tempDefValueList.attr.value];
		}
		for (let i = 0; i < tempDefValueList.length; i++) {
			defValueList.push(tempDefValueList[i].attr.value);
		}
		return defValueList;
	}

	/**
	 * initValueのvalue取得
	 * @param json 属性情報
	 * @return initValue一覧
	 */
	private convertInitValueList(json: any): string[] {
		if (!json.initValueList) {
			return [];
		}
		let initValueList: string[] = [];
		let tempInitValueList: any = json.initValueList.initValue;
		if (!tempInitValueList.length) {
			return [tempInitValueList.attr.value];
		}
		for (let i = 0; i < tempInitValueList.length; i++) {
			initValueList.push(tempInitValueList[i].attr.value);
		}
		return initValueList;
	}
}
