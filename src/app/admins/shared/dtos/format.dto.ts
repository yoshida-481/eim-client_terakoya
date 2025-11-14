import { EIMAdminDTO } from './admin.dto';
import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';

/**
 * フォーマットDTO
 */
export class EIMFormatDTO implements EIMAdminDTO {

	/** ID */
	public id: number;

	/** 名前 */
	public label: string;

	/** ブランチフラグ */
	public isBranch = false;

	/** アイコンタイプ */
	public typeName = 'format';

	/** アイコンタイプ */
	public typeLabel: string;

	/** フォーマット名 */
	public formatName: string;

	/** パス */
	public path: string;

	/** オブジェクト名 */
	public objName: string;

	/** デフォルト */
	public def = false;

	/** 親フォーマット */
	public isParentFormat = false;

	/** オブジェクトID */
	public objId: number;

	/** 言語DTO */
	public langugeList: EIMLanguageDTO[] = [];

	/** BOXフォルダID */
	public boxFolderId: string;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			this.id = Number(json.attr.formatId);
			this.label = json.attr.label;
			this.typeLabel = this.label;
			this.isBranch = json.attr.isBranch === 'true' ? true : false;
			this.objId = Number(json.attr.objTypeId);
			this.formatName = json.attr.formatName;
			this.path = json.attr.path;
			this.objName = json.attr.objTypeName;
			this.def = json.attr.def === 'true' ? true : false;
			this.isParentFormat = json.attr.isParentFormat === 'true' ? true : false;

			if (Array.isArray(json.lang)) {
				if (json.lang.length > 0) {
					for (let idx = 0; idx < json.lang.length; idx++) {
						let lang = json.lang[idx];
						let language: EIMLanguageDTO = new EIMLanguageDTO();
						language.langId = lang.attr.otherLId;
						language.name = lang.attr.otherName;
						this.langugeList.push(language);
					}
				}
			}

			this.boxFolderId = json.attr.boxFolderId;
		}
	}
}
