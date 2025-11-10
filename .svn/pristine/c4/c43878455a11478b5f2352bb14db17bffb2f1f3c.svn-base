import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAttributeTypeDTO } from 'app/shared/dtos/attribute-type.dto';

/**
 * 属性タイプレイアウトDTO
 */
export class EIMAttributeTypeLayoutDTO extends EIMAttributeTypeDTO {

	/** 可視性(true:可視性あり) */
	public visible: boolean;

	/** 必須区分(true:必須) */
	public required: boolean;

	/** UIコントロールタイプ */
	public uiControlType: string;

	/** UIコントロールID */
	public uiControlId: string;

	/** 表示順設定フラグ(true:設定済み) */
	public orderSetFlag: boolean;

	/** 複製フラグ(true:複製対象) */
	public newCopyFlag: boolean;

	/** 表示列ID */
	public formListColumnId: string;

	/** 初期値一覧 数値型 */
	public initialLongValueList: any[];

	/** 初期値一覧 文字列型 */
	public initialStringValueList: any[];

	/** 初期値一覧 実数型 **/
	public initialDoubleValueList: any[];

	/** 初期値一覧 コード型 */
	public initialCodeValueList: any[];

	/** 初期値一覧 ユーザ型 */
	private initialUserValueList: any[];

	constructor(json?: any) {
		super(json);

		this.visible = json.visible;
		this.required = json.required;
		this.uiControlType = json.uiControlType;
		this.uiControlId = json.uiControlId;
		this.orderSetFlag = json.orderSetFlag;
		this.newCopyFlag = json.newCopyFlag;
		this.formListColumnId = json.formListColumnId;
		this.initialLongValueList = json.initialLongValueList;
		this.initialStringValueList = json.initialStringValueList;
		this.initialDoubleValueList = json.initialDoubleValueList;
		this.initialCodeValueList = json.initialCodeValueList;
		this.initialUserValueList = json.initialUserValueList;
	}
}
