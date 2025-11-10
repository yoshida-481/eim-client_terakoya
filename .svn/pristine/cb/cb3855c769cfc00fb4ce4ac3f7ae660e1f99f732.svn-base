import { EIMSimpleSearchConditionLeftAttributeType, EIMSimpleSearchConditionLeftAttributeTypeWithEnd, EIMSimpleSearchConditionLeftAttributeTypeWithoutEnd, EIMSimpleSearchObjectConditionLeftAttributeType, EIMSimpleSearchRelationConditionLeftAttributeType } from "app/shared/builders/simple-search/simple-search-condition-left-attribute-type";
import { EIMSearchOperatorEnum } from "../../search/search-operator-enum";
import { EIMSimpleSearchConditionGroupCriteria } from "./simple-search-condition-group.criteria";

/**
 * 簡易検索の検索条件を保持します.
 */
export class EIMSimpleSearchConditionCriteria {

	/**
	 * 条件式左辺の属性タイプ定義名称パス
	 * 例)
	 *   ['id'],								// ID
	 *   ['type', 'name'], 			// タイプの名称
	 *   ['関連ドキュメント', 'name']					 // 関連ドキュメントの名称
	 *   ['app.form.dev:帳票タイプフォルダID'] // 帳票タイプフォルダID
	 */
	public attributeTypeDefinitionNamePath?: string[] = null;

	/** 比較演算子 */
	public op?: EIMSearchOperatorEnum = null;

	/** 条件式右辺 */
	public values?: any[] = null;

	/** 簡易検索のオブジェクト検索条件グループ */
	public conditionGroup?: EIMSimpleSearchConditionGroupCriteria = null;

	/**
	 * コンストラクタです.
	 *
	 * @param attributeTypeDefinitionNamePath 条件式左辺の属性タイプ定義名称パス
	 * @param op 演算子
	 * @param value 条件式右辺
	 */
	constructor(attributeTypeDefinitionNamePath: string[], op: EIMSearchOperatorEnum, value?: any);
	constructor(attributeType: EIMSimpleSearchConditionLeftAttributeType, op: EIMSearchOperatorEnum, value?: any);
	constructor(conditionGroup: EIMSimpleSearchConditionGroupCriteria);
	constructor(a: string[] | EIMSimpleSearchConditionLeftAttributeType | EIMSimpleSearchConditionGroupCriteria, op?: EIMSearchOperatorEnum, value: any = null) {

		// 検索条件グループ指定時
		if (a instanceof EIMSimpleSearchConditionGroupCriteria) {
			this.conditionGroup = a;
		} else {

			// 検索条件左辺属性タイプ指定時
			if (a instanceof EIMSimpleSearchConditionLeftAttributeType) {
				if (a instanceof EIMSimpleSearchObjectConditionLeftAttributeType || a instanceof EIMSimpleSearchRelationConditionLeftAttributeType) {
					this.attributeTypeDefinitionNamePath = a.getAttributeTypeDefinitionNamePath();
				} else {
					throw new Error('検索条件左辺属性タイプを指定する場合は、EIMSimpleSearchObjectConditionLeftAttributeTypeあるいはEIMSimpleSearchRelationConditionLeftAttributeTypeを指定してください。' +
						'例）new EIMSimpleSearchConditionCriteria(' +
						'new EIMSimpleSearchObjectConditionLeftAttributeType().baseType().definitionName().end(), EIMSearchOperatorEnum.EQ, \'ワークスペース\')');

				}

			// 検索条件左辺属性タイプの定義名称パス指定時
			} else {
				this.attributeTypeDefinitionNamePath = a;
			}

			this.op = op;
			if (!Array.isArray(value)) {
				this.values = [value];
			} else {
				this.values = value;
			}
		}
	}
}
