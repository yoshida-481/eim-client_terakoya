import { EIMSimpleSearchConditionCriteria } from "app/shared/domains/criteria/simple-search/simple-search-condition.criteria";
import { EIMSimpleSearchRelationCriteria } from "app/shared/domains/criteria/simple-search/simple-search-relation.criteria";
import { EIMSearchOperatorEnum } from "app/shared/domains/search/search-operator-enum";
import { EIMSimpleSearchRelationResultAttributeType, EIMSimpleSearchResultAttributeType } from "./simple-search-result-attribute-type";
import { EIMSimpleSearchConditionGroupCriteria } from "app/shared/domains/criteria/simple-search/simple-search-condition-group.criteria";

/**
 * 簡易リレーション検索条件ビルダ
 */
export class EIMSimpleSearchRelationCriteriaBuilder {

	/** 検索条件 */
	private conditionGroup: EIMSimpleSearchConditionGroupCriteria = null;

	/**
	 * 返却属性タイプ定義名称パスのリスト
	 * 例)
	 * [
	 *   ['id'],								// ID
	 *   ['type', 'name'], 			// タイプの名称
	 *   ['関連ドキュメント', 'name']					 // 関連ドキュメントの名称
	 *   ['app.form.dev:帳票タイプフォルダID'] // 帳票タイプフォルダID
	 * ]
	 */
	private resultAttributeTypeDefinitionNamePaths: string[][] = null;

	/**
	 * 検索条件グループを設定します.
	 */
	public setConditionGroup(conditionGroup: EIMSimpleSearchConditionGroupCriteria): EIMSimpleSearchRelationCriteriaBuilder {
		this.conditionGroup = conditionGroup;

		return this;
	}

	/**
	 * 取得対象の属性タイプを追加します.
	 * オブジェクト型属性/ユーザ型属性の場合は階層を配列にして指定します.<br>
	 * 例）通知先ユーザの名称を取得したい場合<br>
	 * addRetAttr(['通知先ユーザ', 'name'])
	 *
	 * @param resultAttributeTypeDefinitionNamePath 取得対象の属性タイプの定義名称
	 * @returns ビルダーインスタンス
	 */
	public addResultAttributeTypeDefinitionNamePath(resultAttributeTypeDefinitionNamePath: string[]): EIMSimpleSearchRelationCriteriaBuilder {

		if (!resultAttributeTypeDefinitionNamePath) {
			return this;
		}
		if (!this.resultAttributeTypeDefinitionNamePaths) {
			this.resultAttributeTypeDefinitionNamePaths = [];
		}

		this.resultAttributeTypeDefinitionNamePaths.push(resultAttributeTypeDefinitionNamePath);

		return this;
	}

	/**
	 * 取得対象の属性タイプリストを追加します.
	 *
	 * @param resultAttributeTypeDefinitionNamePaths 取得対象の属性タイプリスト
	 * @returns ビルダーインスタンス
	 */
	public addResultAttributeTypeDefinitionNamePaths(resultAttributeTypeDefinitionNamePaths: string[][]): EIMSimpleSearchRelationCriteriaBuilder {

		if (!resultAttributeTypeDefinitionNamePaths) {
			return this;
		}
		if (!this.resultAttributeTypeDefinitionNamePaths) {
			this.resultAttributeTypeDefinitionNamePaths = [];
		}

		for (let resultAttributeTypeDefinitionNamePath of resultAttributeTypeDefinitionNamePaths) {

			this.addResultAttributeTypeDefinitionNamePath(resultAttributeTypeDefinitionNamePath);
		}

		return this;
	}

	/**
	 * 取得対象のリレーション返却項目を追加します.<br>
	 * 例）<br>
	 *   .addResultAttributeType(new EIMSimpleSearchRelationResultAttributeType().id().end()) // ID取得<br>
	 *   .addResultAttributeType(new EIMSimpleSearchRelationResultAttributeType().parent().name().end()) // 親オブジェクトの名称取得<br>
	 *
	 * @param objectResultAttributeType オブジェクト返却項目
	 * @returns ビルダーインスタンス
	 */
	public addResultAttributeType(objectResultAttributeType: EIMSimpleSearchResultAttributeType): EIMSimpleSearchRelationCriteriaBuilder {

		if (!objectResultAttributeType) {
			return this;
		}
		if (!(objectResultAttributeType instanceof EIMSimpleSearchRelationResultAttributeType)) {
			throw new Error('返却項目を指定する場合は、EIMSimpleSearchRelationResultAttributeTypeを指定してください。例）.addResultAttributeType(new EIMSimpleSearchRelationResultAttributeType().id().end())');
		}
		if (!this.resultAttributeTypeDefinitionNamePaths) {
			this.resultAttributeTypeDefinitionNamePaths = [];
		}

		this.resultAttributeTypeDefinitionNamePaths.push((objectResultAttributeType as EIMSimpleSearchRelationResultAttributeType).getAttributeTypeDefinitionNamePath());

		return this;
	}

	/**
	 * 簡易リレーション検索条件をビルドします。
	 * @returns 簡易リレーション検索条件
	 */
	public build(): EIMSimpleSearchRelationCriteria {

		let criteria: EIMSimpleSearchRelationCriteria = new EIMSimpleSearchRelationCriteria();

		criteria.conditionGroup = this.conditionGroup;
		criteria.resultAttributeTypeDefinitionNamePaths = this.resultAttributeTypeDefinitionNamePaths;

		return criteria;
	}
}

