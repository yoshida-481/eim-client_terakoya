import { EIMSimpleSearchObjectCriteria } from "./simple-search-object.criteria";

/**
 * 数値型属性の関連先オブジェクトを取得する検索条件
 */
export class EIMSimpleSearchRelatedObjectLongAttributeCriteria {

	/** 関連先オブジェクト取得条件 */
	public objectCriteria: EIMSimpleSearchObjectCriteria;

	/** 数値型属性の属性タイプ定義名称 */
	public longAttributeTypeDefinitionName: string;

}
