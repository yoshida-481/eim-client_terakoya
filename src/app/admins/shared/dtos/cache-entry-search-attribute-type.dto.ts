/**
 * キャッシュエントリ検索の属性タイプDTOインタフェース
 */
export class EIMCacheEntrySearchAttributeTypeDTO {
	/** 属性タイプID */
	public id = 0;

	/** 属性タイプ定義名称 */
	public definitionName: string = null;

	/** データ型 */
	public valueType: string = null;

	/** 多重度 */
	public multiple = false;
}
