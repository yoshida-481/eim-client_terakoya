import { EIMAdminDTO } from './admin.dto';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

/**
 * ディレクトリDTO'
 */
export class EIMDirectoryDTO  implements EIMAdminDTO {

	/** ID */
	public id: number;

	/** パス */
	public path: string;

	/** ステータス */
	public status: number;

	/** ファイル数 */
	public fileCount: number;

	/** ファイルサイズ */
	public fileSize: number;

	/** アイコンタイプ */
	public typeName = 'directory';

	/** アイコンタイプ */
	public typeLabel: string;

		/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.id = Number(json.attr.dirId);
			this.path = json.attr.path;
			this.typeLabel = this.path;
			this.status = json.attr.status === 'true' ? EIMAdminsConstantService.DIR_STATUS_ONLINE_VALUE : EIMAdminsConstantService.DIR_STATUS_OFFLINE_VALUE;
			if (json.attr.fileCount) {
				this.fileCount = Number(json.attr.fileCount.replace(/,/gi , ''));
			}

			if (json.attr.fileSize) {
				this.fileSize = Number(json.attr.fileSize.replace(/,/gi , ''));
			}
		}

	}

}
