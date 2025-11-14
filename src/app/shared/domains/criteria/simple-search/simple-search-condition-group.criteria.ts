import { EIMSearchLogicalOperatorEnum } from '../../search/search-logical-operator-enum';
import { EIMSimpleSearchConditionCriteria } from './simple-search-condition.criteria';

/**
 * 簡易検索のオブジェクト検索条件グループを保持します.
 */
export class EIMSimpleSearchConditionGroupCriteria {

	public op: EIMSearchLogicalOperatorEnum = EIMSearchLogicalOperatorEnum.AND;
	public conditions: (EIMSimpleSearchConditionCriteria | EIMSimpleSearchConditionGroupCriteria)[] = [];

	/**
	 * コンストラクタです.
	 *
	 * @param op 演算子
	 * @param conditions 簡易検索の検索条件リスト
	 */
	constructor(op: EIMSearchLogicalOperatorEnum, conditions: (EIMSimpleSearchConditionCriteria | EIMSimpleSearchConditionGroupCriteria)[]) {
		this.op = op;
		this.conditions = conditions;
	}
}
