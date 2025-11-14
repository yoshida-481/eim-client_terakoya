import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMMultipleCriteriaDTO } from './multiple-criteria.dto';

/**
 * 帳票ワークスペースに参加するユーザ検索条件DTOです.
 */
export class EIMFormWorkspaceEntryUserCriteriaDTO {

	/** 帳票ワークスペースIDに対する等価検索条件です. */
	public formWorkspaceId: number = null;

	/**
	 * ユーザIDに対する検索条件<br>
	 * 「id in (ids)」として使用する
	 */
	public ids: EIMMultipleCriteriaDTO<number> = null;

	constructor(json?: any) {
	}
}
