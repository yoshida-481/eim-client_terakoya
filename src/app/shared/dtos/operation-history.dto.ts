/**
 *
 */
export class EIMOperationHistoryDTO {

	/** アクセス日時 */
	public accessDate: Date = null;

	/** アプリケーション種別ID */
	public applicationTypeId = -1;

	/** アプリケーション種別名称 */
	public applicationTypeName: string = null;

	/** 操作詳細 */
	public detail: string = null;

	/** 操作種別Id */
	public operationTypeId = -1;

	/** 操作種別名称 */
	public operationTypeName: string = null;

	/** 操作対象AのID */
	public recordIdA = -1;

	/** 操作対象BのID */
	public recordIdB = -1;

	/** 操作対象情報AのID */
	public recordInfoIdA = -1;

	/** 操作対象情報BのID */
	public recordInfoIdB = -1;

	/** 操作対象情報Aの名称 */
	public recordInfoNameA: string = null;

	/** 操作対象情報Bの名称 */
	public recordInfoNameB: string = null;

	/** 操作対象Aの名称 */
	public recordNameA: string = null;

	/** 操作対象Bの名称 */
	public recordNameB: string = null;

	/** 操作対象Aのオブジェクト */
	public recordObjectA: any = null;

	/** 操作対象Bのオブジェクト */
	public recordObjectB: any = null;

	/** 操作対象種別AのID */
	public recordTypeIdA = -1;

	/** 操作対象種別BのID */
	public recordTypeIdB = -1;

	/** 操作対象種別Aの名称 */
	public recordTypeNameA: string = null;

	/** 操作対象種別Bの名称 */
	public recordTypeNameB: string = null;

	/** ユーザID */
	public userId = 0;

	/** ユーザ名 */
	public userName: string = null;

	constructor(json?: any) {
		this.accessDate = json.accessDate;
		this.applicationTypeId = json.applicationTypeId;
		this.applicationTypeName = json.applicationTypeName;
		this.detail = json.detail;
		this.operationTypeId = json.operationTypeId;
		this.operationTypeName = json.operationTypeName;
		this.recordIdA = json.recordIdA;
		this.recordIdB = json.recordIdB;
		this.recordInfoIdA = json.recordInfoIdA;
		this.recordInfoIdB = json.recordInfoIdB;
		this.recordInfoNameA = json.recordInfoNameA;
		this.recordInfoNameB = json.recordInfoNameB;
		this.recordNameA = json.recordNameA;
		this.recordNameB = json.recordNameB;
		this.recordObjectA = json.recordObjectA;
		this.recordObjectB = json.recordObjectB;
		this.recordTypeIdA = json.recordTypeIdA;
		this.recordTypeIdB = json.recordTypeIdB;
		this.recordTypeNameA = json.recordTypeNameA;
		this.recordTypeNameB = json.recordTypeNameB;
		this.userId = json.userId;
		this.userName = json.userName;
	}
}
