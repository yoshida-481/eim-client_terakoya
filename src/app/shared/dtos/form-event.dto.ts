import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMObjectDTO } from './object.dto';

/**
 * 帳票イベントDTO
 */
export class EIMFormEventDTO {

	/** イベントID */
	public id = 0;

	/** イベントタイプ名 */
	public typeName: string = null;

	/** 遷移元ステータスタイプ名 */
	public fromStatusTypeName: string = null;

	/** 遷移先ステータスタイプ名 */
	public toStatusTypeName: string = null;

	/** イベント実行ユーザー名 */
	public creationUserName: string = null;

	/** イベント実行日時 */
	public creationDate: Date = null;

	/** イベントコメント */
	public comment: string = null;

	constructor(json?: any) {

		this.id = json.id;
		this.typeName = json.typeName;
		this.fromStatusTypeName = json.fromStatusTypeName;
		this.toStatusTypeName = json.toStatusTypeName;
		this.creationUserName = json.creationUserName;
		this.creationDate = new Date(json.creationDate);
		this.comment = json.comment;
	}
}
