import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from './admin.dto';

/**
 * 属性タイプDTO
 */
export class EIMAttributeTypeDTO implements EIMAdminDTO {

	/** ID */
	public id: number;

	/** 属性ID */
	public attTypeId: number;

	/** 属性名前 */
	public attTypeName: string;

	/** 定義名前 */
	public definitionName: string;

	/** 表示順 */
	public dispOrder: number;

	/** オブジェクトタイプID */
	public objTypeId: number;

	/** オブジェクトタイプ名 */
	public objTypeName: string;

	/** タイプ型ID */
	public valTypeId: number;

	/** タイプ型名称 */
	public valTypeName: string;

	/** 入力規則 */
	public inputRuleValue: string;

	/** 入力規則リスト値定義フラグ */
	public inputRuleFlag: boolean;

	/** 複数値有無 */
	public isMultipleValue: string;

	/** 複数値有無フラグ */
	public isMultipleFlag: boolean;

	/** デフォルト値 */
	public defValue: string;

	/** デフォルト値リスト */
	public defValueList: string[];

	/** UIコントロール名称 */
	public uiControlName: string;

	/** UIコントロールID */
	public uiControlId: string;

	/** リビジョンアップ引継ぎフラグ */
	public inheritanceFlag: boolean;

	/** 最新リビジョン関連付けフラグ */
	public relationFlag: boolean;

	/** コードタイプ名称 */
	public codeTypeName: string;

	/** 属性タイプ必須フラグ */
	public attTypeEssential: boolean;

	/** 複製フラグ */
	public newCopyFlag: boolean;

	/** 初期値 */
	public initValue: string;

	/** 初期値リスト */
	public initValueList: string[];

	/** アイコンタイプ */
	public typeName = 'attributeType';

	/** アイコンタイプ */
	public typeLabel: string;

	constructor(json?: any) {
		if (json) {
			this.attTypeId = Number(json.attr.attTypeId);
			this.id = this.attTypeId;
			this.attTypeName = json.attr.attTypeName;
			if (json.attr.valType) {
				this.valTypeId = Number(json.attr.valType);
			}
			if (json.attr.valTypeId) {
				this.valTypeId = Number(json.attr.valTypeId);
			}
			this.inputRuleValue = json.attr.inputRuleValue;
			this.typeLabel = this.attTypeName;
			this.definitionName = json.attr.definitionName;
			this.dispOrder = json.attr.dispOrder;
			this.objTypeId = Number(json.attr.objTypeId);
			this.valTypeName = json.attr.valTypeName;
			this.codeTypeName = json.attr.codeTypeName;
			this.defValue = this.convertDefValue(json);
			this.initValue = this.convertInitValue(json);
			this.defValueList = this.convertDefValueList(json);
			this.initValueList = this.convertInitValueList(json);
			this.uiControlName = json.attr.uiControlName;
			this.uiControlId = json.attr.uiControlId;
			this.attTypeEssential = json.attr.attTypeEssential === 'true' ? true : false;
			this.newCopyFlag = json.attr.newCopyFlag === 'true' ? true : false;
			this.inputRuleValue = json.attr.inputRuleValue;
			this.inputRuleFlag = json.attr.inputRuleFlag === 'true' ? true : false;
			this.isMultipleValue = json.attr.isMultipleValue;
			this.isMultipleFlag = json.attr.isMultipleFlag === 'true' ? true : false;
			this.inheritanceFlag = json.attr.inheritanceFlag === 'true' ? true : false;
			this.relationFlag = json.attr.relationFlag === 'true' ? true : false;
		}
	}

	/**
	 * defValueのvalue取得
	 * @param json 属性情報
	 * @return defValueの値
	 */
	private convertDefValue(json: any): any {
		if (json.defValueList) {
			let tempDefValue: any[] = json.defValueList.defValue;
			if (!tempDefValue) {
				return '';
			}
			if (tempDefValue.length > 0) {
				let defValue = '';
				for (let i = 0; i < tempDefValue.length; i++) {
					defValue = defValue + tempDefValue[i].attr.value;
					if (i !== tempDefValue.length - 1) {
						defValue = defValue + ' | ';
					}
				}
				return defValue;
			} else {
				return tempDefValue['attr'].value;
			}
		} else {
			return '';
		}
	}

	/**
	 * initValueのvalue取得
	 * @param json 属性情報
	 * @return initValueの値
	 */
	private convertInitValue(json: any): any {
		if (json.initValueList) {
			let tempInitValue: any[] = json.initValueList.initValue;
			if (!tempInitValue) {
				return '';
			}
			if (tempInitValue.length > 0) {
				let initValue = '';
				for (let i = 0; i < tempInitValue.length; i++) {
					initValue = initValue + tempInitValue[i].attr.value;
					if (i !== tempInitValue.length - 1) {
						initValue = initValue + ' | ';
					}
				}
				return initValue;
			} else {
				return tempInitValue['attr'].value;
			}
		} else {
			return '';
		}
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
		if (!tempDefValueList) {
			return [];
		}
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
		if (!tempInitValueList) {
			return [];
		}
		if (!tempInitValueList.length) {
			return [tempInitValueList.attr.value];
		}
		for (let i = 0; i < tempInitValueList.length; i++) {
			initValueList.push(tempInitValueList[i].attr.value);
		}
		return initValueList;
	}

}
