import { EIMCacheEntryDTO } from './cache-entry.dto';
import { EIMCacheEntrySearchAttributeTypeDTO } from './cache-entry-search-attribute-type.dto';

/**
 * キャッシュエントリ検索DTOインタフェース
 */
export class EIMCacheEntrySearchDTO {
	/** キャシュ全件分の件数 */
	public allCounts: number;

	/** 上限設定に従ったヒット件数 */
	public entryList: EIMCacheEntryDTO[];

	/**
	 * ヒットしたオブジェクトの属性(疑似属性は除く)
	 * オブジェクトの場合のみ値が入る。
	 */
	public attributeTypeList: EIMCacheEntrySearchAttributeTypeDTO[];
}
