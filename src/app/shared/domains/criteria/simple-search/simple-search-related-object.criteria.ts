import { EIMSimpleSearchRelatedObjectLongAttributeCriteria } from "./simple-search-related-object-long-attribute.criteria";
import { EIMSimpleSearchRelatedObjectObjectAttributeCriteria } from "./simple-search-related-object-object-attribute.criteria";
import { EIMSimpleSearchRelatedObjectRelationCriteria } from "./simple-search-related-object-relation.criteria";

/**
 * 簡易検索の関連先オブジェクト検索条件を保持します.<br>
 * いずれかの検索条件を設定して使用します.
 */
export class EIMSimpleSearchRelatedObjectCriteria {

	/** リレーション親オブジェクト検索条件 */
	public relationParent?: EIMSimpleSearchRelatedObjectRelationCriteria;

	/** リレーション子オブジェクト検索条件 */
	public relationChild?: EIMSimpleSearchRelatedObjectRelationCriteria;

	/** 数値型属性設定元オブジェクト検索条件 */
	public longAttributeSource?: EIMSimpleSearchRelatedObjectLongAttributeCriteria;

	/** 数値型属性設定先オブジェクト検索条件 */
	public longAttributeDestination?: EIMSimpleSearchRelatedObjectLongAttributeCriteria;

	/** オブジェクト型属性設定元オブジェクト検索条件 */
	public objectAttributeSource?: EIMSimpleSearchRelatedObjectObjectAttributeCriteria;

	/** オブジェクト型属性設定先オブジェクト検索条件 */
	public objectAttributeDestination?: EIMSimpleSearchRelatedObjectObjectAttributeCriteria;

}