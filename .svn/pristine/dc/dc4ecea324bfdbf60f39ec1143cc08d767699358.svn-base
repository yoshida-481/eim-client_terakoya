import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMMultipleCriteriaDTO } from './multiple-criteria.dto';

/**
 * ユーザ検索条件DTOです.
 */
export class EIMUserCriteriaDTO {
	/**
	 * セッション言語ユーザコードに対する曖昧検索条件です.
	 */
	public code: string = null;

	/**
	 * セッション言語ユーザ名称に対する曖昧検索条件です.
	 */
	public name: string = null;

	/**
	 * セッション言語かな名称に対する曖昧検索条件です.
	 */
	public kana: string = null;

	/**
	 * セッション言語メールアドレスに対する曖昧検索条件です.
	 */
	public mail: string = null;

	/** 無効フラグに対する検索条件です. */
	public disable: boolean = null;

	/** グループIDに対する等価検索条件です. */
	public groupId: number = null;

	/** ロールIDに対する等価検索条件です. */
	public roleId: number = null;

	/** 複合グループIDに対する等価検索条件です. */
	public compId: number = null;

	/** 最大取得件数です. */
	/** 取得件数を制限しない場合は0を指定します. */
	public limit: number = null;

	/** 最大取得件数を超えて取得した場合にEIMExceptionをスローするかどうかのフラグです. */
	public limitCondition: boolean = null;

	/**
	 * ユーザIDに対する検索条件<br>
	 * 「id in (ids)」として使用する
	 */
	public ids: EIMMultipleCriteriaDTO<number> = null;

	constructor(json?: any) {
	}
}
