import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminDTO } from './admin.dto';
import { EIMFormLayoutDomain } from 'app/shared/domains/form-layout.domain';

/**
 * オブジェクトDTO
 */
export class EIMObjectDTO implements EIMAdminDTO {

	/** ID */
	public id: string;

	/** 名称 */
	public name: string;

	/** 定義名称 */
	public definitionName: string;

	/** フォーマットID */
	public formatId: number;

	/** フォーマット名 */
	public formatName: string;

	/** パス */
	public path: string;

	/** オブジェクトID */
	public objTypeId: number;

	/** オブジェクト名 */
	public objTypeName: string;

	/** ラベル */
	public label: string;

	/** セキュリティID */
	public secId: number;

	/** セキュリティ名 */
	public secName: string;

	/** ネームスペース */
	public namespace: string;

	/** 定義名称 */
	public defNameWhichExceptedNamespace: string;

	/** 付加文字列 */
	public formatString: string;

	/** 言語数 */
	public otherCnt: number;

	/** 共有するクラス名 */
	public publicClassName: string;

	/** 親オブジェクトタイプID */
	public parentObjTypeId: number;

	/** 親オブジェクトタイプ名 */
	public parentObjTypeName: string;

	/** 言語ID */
	public otherLId: number;

	/** 言語名 */
	public otherName: string;

	/** 表示列ID */
	public formListColumnId: string;

	public lang: any[];

	/** 番号自動生成 */
	public numberAutoCreate: boolean;

	/** ワークフローID */
	public workflowId: number;

	/** ステータス属性ID */
	public statusTypeId: number;

	/** アイコンタイプ */
	public typeName = 'object';

	/** アイコンタイプ */
	public typeLabel: string;

	/** 表示列上限値 */
	public formListColumnsMaxCount: number;

	/** 表示列(デフォルト設定) */
	public defaultFormListColumns: any[];

	/** 表示列(属性) */
	public attributeFormListColumns: any[];

	/** 表示列(システム設定) */
	public systemSettingFormListColumns: any[];

	public formLayout: EIMFormLayoutDomain;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			if (json.attr) {
				this.id = json.attr.id;
				this.name = json.attr.name;
				this.definitionName = json.attr.definitionName;
				this.formatId = Number(json.attr.formatId);
				this.formatName = json.attr.formatName;
				this.path = json.attr.path;
				this.objTypeId = Number(json.attr.objTypeId);
				this.objTypeName = json.attr.objTypeName;
				this.label = json.attr.label;
				this.secId = Number(json.attr.secId);
				this.secName = json.attr.secName;
				this.namespace = json.attr.namespace;
				this.defNameWhichExceptedNamespace = json.attr.defNameWhichExceptedNamespace;
				this.formatString = json.attr.formatString;
				this.otherCnt = Number(json.attr.otherCnt);
				this.publicClassName = json.attr.publicClassName;
				this.parentObjTypeId = Number(json.attr.parentObjTypeId);
				this.parentObjTypeName = json.attr.parentObjTypeName;
				this.otherLId = Number(json.attr.otherLId);
				this.otherName = json.attr.otherName;
				this.lang = json.lang;
				this.numberAutoCreate = json.attr.numberAutoCreate === 'true' ? true : false;
				this.namespace = json.attr.namespace;
				this.defNameWhichExceptedNamespace = json.attr.defNameWhichExceptedNamespace;
				this.workflowId = Number(json.attr.workflowId);
			} else {
				this.formListColumnsMaxCount = Number(json.formListColumnsMaxCount._text);
				this.defaultFormListColumns = this.convertDefaultFormListColumns(json);
				this.attributeFormListColumns = this.convertAttributeFormListColumns(json);
				this.systemSettingFormListColumns = this.convertSystemSettingFormListColumns(json);
			}
		}
	}

	// 表示列(デフォルト値)変換
	private convertDefaultFormListColumns(json) {
		let tmpDefaultFormListColumns: any[] = json.defaultFormListColumns.column;

		if (tmpDefaultFormListColumns === undefined) {
			return [''];
		}

		let defaultFormListColumns: any[] = [];
		if (tmpDefaultFormListColumns.length > 0) {
			for (let i = 0; i < tmpDefaultFormListColumns.length; i++) {
				defaultFormListColumns[i] = tmpDefaultFormListColumns[i].attr;
			}
		} else {
			defaultFormListColumns[0] = tmpDefaultFormListColumns['attr'];
		}

		return defaultFormListColumns;
	}

	// 表示列(設定値)変換
	private convertSystemSettingFormListColumns(json) {
		let tmpSystemSettingFormListColumns: any[] = json.systemSettingFormListColumns.column;

		if (tmpSystemSettingFormListColumns === undefined) {
			return [''];
		}

		let systemSettingFormListColumns: any[] = [];
		if (tmpSystemSettingFormListColumns.length > 0) {
			for (let i = 0; i < tmpSystemSettingFormListColumns.length; i++) {
				systemSettingFormListColumns[i] = tmpSystemSettingFormListColumns[i].attr;
			}
		} else {
			systemSettingFormListColumns[0] = tmpSystemSettingFormListColumns['attr'];
		}
		return systemSettingFormListColumns;
	}

	// 表示列(属性)変換
	private convertAttributeFormListColumns(json) {

		let tmpAttributeFormListColumns: any[] = json.attributeFormListColumns.column;

		if (tmpAttributeFormListColumns === undefined) {
			return [''];
		}

		let attributeFormListColumns: any[] = [];
		if (tmpAttributeFormListColumns.length > 0) {
			for (let i = 0; i < tmpAttributeFormListColumns.length; i++) {
				attributeFormListColumns[i] = tmpAttributeFormListColumns[i].attr;
			}
		} else {
			attributeFormListColumns[0] = tmpAttributeFormListColumns['attr'];
		}
		return attributeFormListColumns;
	}

}
