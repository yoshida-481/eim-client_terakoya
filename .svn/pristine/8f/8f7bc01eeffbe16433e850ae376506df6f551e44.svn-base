import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

/**
 * 属性タイプDTO
 */
export class EIMUserAttributeDTO {

	/** 属性ID */
	public attTypeId: number;

	/** 属性名前 */
	public attTypeName: string;

	/** 定義名前 */
	public attTypeDefName: string;

	/** 入力値 */
	public attValue: number;

	/** 属性種別ID*/
	public valTypeId: number;

	/** 属性種別名*/
	public valTypeName: string;

	/** 複数行判定 */
	public isMultiple: boolean;

	/** 複数行入力値 */
	public attMultipleList: string[];

	constructor(json?: any) {

		if (json) {
			this.attTypeId = Number(json.attr.attTypeId);
			this.attTypeName = json.attr.attTypeName;
			this.attTypeDefName = json.attr.attTypeDefName;
			this.attValue = Number(json.attr.attValue);
			this.valTypeId = Number(json.attr.valTypeId);
			this.valTypeName = json.attr.valTypeName;
			this.isMultiple = json.attr.isMultiple === 'true' ? true : false;
			this.attMultipleList = this.convertAttMultipleList(json);
		}
	}

	/**
	 * attMultipleのvalue取得
	 * @param json 属性情報
	 * @return attMultiple一覧
	 */
	private convertAttMultipleList(json: any): string[] {
		if (!json.attMultipleList) {
			return [];
		}
		let attMultipleList: string[] = [];
		let tempAttMultipleList: any = json.attMultipleList.attMultiple;
		if (!tempAttMultipleList) {
			return [];
		}
		if (!tempAttMultipleList.length) {
			let value = tempAttMultipleList.attr.attValue;
			if (Number(json.attr.valTypeId) === 3 && value !== '') {
				value = new Date(value);
			}
			return [value];
		}
		for (let i = 0; i < tempAttMultipleList.length; i++) {
			let values = tempAttMultipleList[i].attr.attValue
			if (Number(json.attr.valTypeId) === 3 && values !== '') {
				values = new Date(values);
			}
			attMultipleList.push(values);
		}
		return attMultipleList;
	}
}
