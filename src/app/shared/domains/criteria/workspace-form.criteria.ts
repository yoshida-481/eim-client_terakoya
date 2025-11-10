import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMOtherNameDomain } from 'app/shared/domains/entity/other-name.domain';
/**
 * 帳票ワークスペース情報を保持します.
 */
export class EIMWorkspaceFormCriteria {

	/** 帳票ワークスペース */
	public name: string;

	/** 定義名称 */
	public definitionName: string;

	/** 帳票ワークスペースID */
	public formWorkspaceId: number;

	/** 帳票タイプID*/
	public formTypeId: number;

	/** 帳票フォルダID*/
	public formFolderId: number;

	/** 帳票フォルダID*/
	public parentFormFolderId: number;

	/** 帳票タイプIDに対する検索条件 */
	public ids: number[] = [];

	/** 言語リスト */
	public nameList: string[] = [];

	/** 他言語名称 */
	public nameListDomain: EIMOtherNameDomain[] = [];

}


