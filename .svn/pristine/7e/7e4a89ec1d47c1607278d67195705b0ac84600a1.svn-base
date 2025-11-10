import { EIMSimpleSearchConditionGroupCriteria } from './simple-search-condition-group.criteria';

/**
 * 簡易検索のオブジェクト検索条件を保持します.
 */
export class EIMSimpleSearchObjectCriteria {

	/** 簡易検索のオブジェクト検索条件グループ */
	public conditionGroup: EIMSimpleSearchConditionGroupCriteria;

	/** 返却属性タイプ定義名称パスリスト */
	public resultAttributeTypeDefinitionNamePaths: string[][];

	/** 取得対象のオブジェクト型属性の参照階層 */
	public refObjectExpansionLevel?: number = 0;

	/** アクセスロールタイプの定義名称 */
	public accessRoleTypeDefName;

	/** 最大取得件数 */
	public limit: number;

	/** 最大取得件数を超えて取得した場合にEIMExceptionをスローするかどうか */
	public limitCondition: boolean;
}
