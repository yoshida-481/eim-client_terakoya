import { EIMBoxObjectDomain } from 'app/shared/domains/box-object.domain';

/**
 * Boxフォルダドメイン
 */
export class EIMBoxFolderDomain extends EIMBoxObjectDomain {

	/** 共有されているかどうか */
	public hasCollaborations: boolean;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json: any) {
		super(json);
		this.hasCollaborations = json.hasCollaborations === 'true' || json.hasCollaborations === true ? true : false;
	}
}
