import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMMultipleCriteriaDTO } from './multiple-criteria.dto';

/**
 * 帳票ワークスペースに参加するユーザ検索条件DTOです.
 */
export class EIMAssignmentEntryUserCriteriaDTO {

	/** ステータスタイプIDに対する等価検索条件 */
	public statusTypeId: number;

	/**
	 * アサイン先エントリーにユーザ定義グループが登録されている場合に使用するオブジェクトID
	 * 検索条件には使用しません。
	 */
	public objectId: number;

	/**
	 * 依頼先取得フラグです。
	 * アサイン先エントリー登録ユーザを取得するかどうかを保持します。
	 */
	public entryUserGetFlag = false;

	/**
	 * アサイン先予定取得フラグです。
	 * アサイン先予定から取得するかどうかを保持します。
	 */
	public assignPlanGetFlag = false;

	/**
	 * ユーザIDに対する検索条件<br>
	 * 「id in (ids)」として使用する
	 */
	public ids: EIMMultipleCriteriaDTO<number> = null;

	constructor(json?: any) {
	}
}
