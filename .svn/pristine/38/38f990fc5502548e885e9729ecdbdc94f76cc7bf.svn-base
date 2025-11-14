import { EIMRangeCriteria } from 'app/shared/domains/criteria/range.criteria';
import { EIMAttributeSearchObjectRefCriteria } from 'app/shared/domains/criteria/attribute.search.object.ref.criteria';

/**
 * 属性の検索条件を保持します.
 */
export class EIMAttributeSearchCriteria {

	/** 検索項目の属性タイプ定義名 */
	public attributeTypeDefinitionName: string;

	/** 文字列検索の単一入力の条件 */
	public stringValue: string;

	/** 数値検索の単一入力の条件 */
	public longValue: number;

	/** 実数値検索の単一入力の条件 */
	public doubleValue: number;

	/** 数値範囲検索の条件 */
	public longRangeCriteria: EIMRangeCriteria;

	/** 日付範囲検索の条件 */
	public dateRangeCriteria: EIMRangeCriteria;

	/** 条件式の値 */
	public conditionValue = 'NONE';

	/** オブジェクト型属性の検索条件 */
	public attributeSearchObjectRefCriteria: EIMAttributeSearchObjectRefCriteria;

	/** 個別検索条件の定義名称(attributeTypeSearchLayoutMapのキー) */
	public attributeSearchConditionDefName: string;
}
