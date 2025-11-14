import { EIMAttributeSearchCriteria } from 'app/shared/domains/criteria/attribute.search.criteria';

/**
 * 帳票の検索条件を保持します.
 */
export class EIMFormCriteria {

	/** 帳票ワークスペースIDに対する等価検索条件 */
	public formWorkspaceId: number;

	/** 帳票タイプIDに対する等価検索条件 */
	public formTypeId: number;

	/** 帳票タイプフォルダIDに対する等価検索条件 */
	public formTypeFolderId: number;

	/** 削除フラグに対する等価検索条件 */
	public invalidateFlag: boolean;

	/** 検索対象のオブジェクトタイプ定義名称 */
	public objectTypeDefinitionName: string;

	/** キーワード */
	public keyword: string;

	/** 個別検索クライテリア */
	public attributeSearchCriteriaList: EIMAttributeSearchCriteria[];

	/** 子階層の帳票タイプを検索対象とするかのフラグ */
	public isSearchChild: boolean;

	/** 全文を検索対象とするかのフラグ */
	public isFullText = false;

	/** 対象カラムIDリスト */
	public targetColumnIds: string[];

	/** 帳票IDリストに対する等価検索条件 */
	public ids: number[];

	/** 帳票アクセス権限タイプ判定条件 */
	public accessRoleType: string;

}
