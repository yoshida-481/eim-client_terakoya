/**
 * タスク管理定数サービス
 */
export class EIMTaskConstantService {

	/** ウィンドウタイトル */
	public static WINDOW_TITLE: string = 'Task/EIMANAGER';

	/** タスク管理テンプレート用ネームスペース(USER) */
	public static NAMESPACE_APP_TASK_USER = 'app.task.user';
	/** タスク管理テンプレート用ネームスペース(DEV) */
	public static NAMESPACE_APP_TASK_DEV = 'app.task.dev';

	/** オブジェクトタイプ定義名称：プロジェクトマスタ */
	public static OBJECT_TYPE_NAME_PROJECT_MASTER = 'app.task.dev:プロジェクト(マスタ)';
	/** オブジェクトタイプ定義名称：プロセスマスタ */
	public static OBJECT_TYPE_NAME_PROCESS_MASTER = 'app.task.dev:プロセス(マスタ)';
	/** オブジェクトタイプ定義名称：タスクマスタ */
	public static OBJECT_TYPE_NAME_TASK_MASTER = 'app.task.dev:タスク(マスタ)';
	/** オブジェクトタイプ定義名称：プロジェクト */
	public static OBJECT_TYPE_NAME_PROJECT = 'ワークスペース';
	/** オブジェクトタイプ定義名称：プロセス */
	public static OBJECT_TYPE_NAME_PROCESS = 'app.task.dev:プロセス';
	/** オブジェクトタイプ定義名称：タスク */
	public static OBJECT_TYPE_NAME_TASK = 'app.task.dev:タスク';

	/** リレーションタイプ定義名称：業務 */
	public static RELATION_TYPE_NAME_TASK = '業務';
	/** リレーションタイプ定義名称：雛型 */
	public static RELATION_TYPE_NAME_TEMPLATE_UPDATE_AUTO = '雛型';
	/** リレーションタイプ定義名称：雛型（タスク） */
	public static RELATION_TYPE_NAME_TEMPLATE_UPDATE_MANUAL = '雛型(タスク)';
	
	/****************************************************************************************
	 * 属性タイプ（task.dev）
	 * ※task.devはシステムに存在しないとエラーとなる属性に付与するネームスペース
	 ****************************************************************************************/
	/** 属性タイプ定義名称：プロジェクトマスタ */
	public static ATTRIBUTE_TYPE_NAME_PROJECT_MASTER = 'app.task.dev:プロジェクト(マスタ)';
	/** 属性タイプ定義名称：プロセスマスタ */
	public static ATTRIBUTE_TYPE_NAME_PROCESS_MASTER = 'app.task.dev:プロセス(マスタ)';
	/** 属性タイプ定義名称：タスクマスタ */
	public static ATTRIBUTE_TYPE_NAME_TASK_MASTER = 'app.task.dev:タスク(マスタ)';
	/** 属性タイプ定義名称：プロジェクトタイプ */
	public static ATTRIBUTE_TYPE_NAME_PROJECT_TYPE = 'app.task.dev:プロジェクトタイプ';
	/** 属性タイプ定義名称：タスクタイプ */
	public static ATTRIBUTE_TYPE_NAME_TASK_TYPE = 'app.task.dev:タスクタイプ';
	/** 属性タイプ定義名称：プロセスタイプ */
	public static ATTRIBUTE_TYPE_NAME_PROCESS_TYPE = 'app.task.dev:プロセスタイプ';
	/** 属性タイプ定義名称：ワークスペース */
	public static ATTRIBUTE_TYPE_NAME_WORKSPACE = 'app.task.dev:ワークスペース';
	/** 属性タイプ定義名称：一時添付ファイル */
	public static ATTRIBUTE_TYPE_NAME_TEMPORARY_ATTACHMENT_FILE = 'app.form.dev:一時添付ファイル';
	/** 属性タイプ定義名称：利用方法 */
	public static ATTRIBUTE_TYPE_NAME_HOW_TO_USE = 'app.task.dev:利用方法';
	/** 属性タイプ定義名称：プロジェクト進捗状況 */
	public static ATTRIBUTE_TYPE_NAME_PROJECT_PROGRESS = 'app.task.dev:プロジェクト進捗状況';
	/** 属性タイプ定義名称：進捗率 */
	public static ATTRIBUTE_TYPE_NAME_PROGRESS_RATE = 'app.task.dev:進捗率';
	/** 属性タイプ定義名称：開始予定日 */
	public static ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE = 'app.task.dev:開始予定日';
	/** 属性タイプ定義名称：終了予定日 */
	public static ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE = 'app.task.dev:終了予定日';
	/** 属性タイプ定義名称：完了日 */
	public static ATTRIBUTE_TYPE_NAME_COMPLETION_DATE = 'app.task.dev:完了日';
	/** 属性タイプ定義名称：ステータス */
	public static ATTRIBUTE_TYPE_NAME_STATUS = 'app.task.dev:ステータス';
	/** 属性タイプ定義名称：成果物 */
	public static ATTRIBUTE_TYPE_NAME_OUTPUT = 'app.task.dev:成果物';
	/** 属性タイプ定義名称：成果物保存先 */
	public static ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER = 'app.task.dev:成果物保存先';
	/** 属性タイプ定義名称：成果物文書タイプ*/
	public static ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE = 'app.task.dev:成果物文書タイプ';
	/** 属性タイプ定義名称：無効フラグ */
	public static ATTRIBUTE_TYPE_NAME_DISABLED_FLAG = 'app.task.dev:無効フラグ';
	/** 属性タイプ定義名称：担当 */
	public static ATTRIBUTE_TYPE_NAME_RESPONSIBLE = 'app.task.dev:担当';
	/** 属性タイプ定義名称：作業内容 */
	public static ATTRIBUTE_TYPE_NAME_WORK_CONTENT = 'app.task.dev:作業内容';
	/** 属性タイプ定義名称：雛型ファイル */
	public static ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE = 'app.task.dev:雛型ファイル';
	/** 属性タイプ定義名称：雛型プロジェクト名 */
	public static ATTRIBUTE_TYPE_NAME_TEMPLATE_PROJECT_NAME = 'app.task.dev:雛型プロジェクト名';
	/** 属性タイプ定義名称：ピン */
	public static ATTRIBUTE_TYPE_NAME_PIN = 'app.task.dev:ピン';

	/****************************************************************************************
	 * 属性タイプ（task.user）
	 ****************************************************************************************/
	/** 属性タイプ定義名称：メモ */
	public static ATTRIBUTE_TYPE_NAME_MEMO = 'app.task.user:メモ';

	/** ステータスタイプ種別：未着手 */
	public static STATUS_TYPE_KIND_ID_NEW = -23001;
	/** ステータスタイプ種別：対応中 */
	public static STATUS_TYPE_KIND_ID_WORKING = -23002;
	/** ステータスタイプ種別：承認中 */
	public static STATUS_TYPE_KIND_ID_APPROVING = -23003;
	/** ステータスタイプ種別：完了 */
	public static STATUS_TYPE_KIND_ID_DONE = -23004;

	/** イベントタイプ種別：タスクデフォルトベースイベントタイプ */
	public static EVENT_TYPE_KIND_ID_DEFAULT = -24001;
	/** イベントタイプ種別：タスク取戻しベースイベントタイプ */
	public static EVENT_TYPE_KIND_ID_REGAIN = -24002;

	/** ガード条件：デフォルト */
	public static GUARD_CONDITION_ID_DEFAULT = -25001;
	/** ガード条件：最後の承認者ではない */
	public static GUARD_CONDITION_ID_NOT_LAST_APPROVER = -25002;

	/** ローカルストレージキー：アプリケーション名 */
	public static LOCAL_STORAGE_KEY_APPLICATION = 'tasks';
	/** ローカルストレージキー：アプリケーション名 */
	public static LOCAL_STORAGE_KEYS_STATE = [EIMTaskConstantService.LOCAL_STORAGE_KEY_APPLICATION, 'state'];

	/** 文書管理のオブジェクトを選択する際のルートパス(client/#/以降) */
	public static ROUTE_PATH_FOR_SELECT_OBJECT = '/portals/main/documents';
	// public static ROUTE_PATH_FOR_SELECT_OBJECT = '/tasks/main/file-manager';
	public static ROUTE_PATH_FOR_SELECT_OBJECT_FROM_WORKSPACES = '/portals/main/workspaces/@workspaceTreeNodeId@/documents';

	/****************************************************************************************
	 * プラグインパラメータ名
	 ****************************************************************************************/
	/** プラグインパラメータ名：タスクマスタに設定されたタスクタイプを設定するかどうかのフラグ(true/false) */
	public static PLUG_IN_PARAM_NAME_SETTING_TASK_TYPE_TO_LATEST_FLAG = 'setTaskTypeToLatestFlag';
	/** プラグインパラメータ名：マテリアライズドビューから取得した進捗率、開始予定日、終了予定日、完了日を結果ドメインのDTOに含めるかどうかのフラグ(true/false) */
	public static PLUG_IN_PARAM_NAME_INCLUDE_PROGRESS_AND_SCHEDULE = 'includeProcessProgressAndSchedule';
	/** プラグインパラメータ名：最終実施イベント情報を設定するかどうかのフラグ(true/false) */
	public static PLUG_IN_PARAM_NAME_SETTING_LATEST_EVENT = 'settingLatestEvent';
	/** プラグインパラメータ名：タスクに紐づく更新対象の雛型ファイルのIDリスト([999,999,999,...]) */
	public static PLUG_IN_PARAM_NAME_UPDATING_TEMPLATE_REVISION_GROUP_IDS = 'updatingTemplateRevisionGroupIds';
	/** プラグインパラメータ名：タスクに紐づく更新対象の雛型ファイルの変更前のオブジェクトIDリスト([999,999,999,...]) */
	public static PLUG_IN_PARAM_NAME_BEFORE_TEMPLATE_OBJECT_IDS = 'beforeTemplateObjectIds';
	/** プラグインパラメータ名：成果物登録に必要な情報を保持するパラメータ名({999, {revisionGroupId: 999, isRevisionUp: 999}}) */
	public static PLUG_IN_PARAM_NAME_OUTPUT_FILE_ID_AND_INFO_MAP = "outputFileIdAndInfoMap";
	/** プラグインパラメータ名：プロジェクト流用実施 */
	public static PLUG_IN_PARAM_NAME_IS_PROJECT_DUPLICATE = 'isProjectDuplicate';
	/** プラグインパラメータ名：タスク複製実施 */
	public static PLUG_IN_PARAM_NAME_IS_TASK_DUPLICATE = 'isTaskDuplicate';
	/** プラグインパラメータ名：成果物オブジェクト型属性のオブジェクトステータスをタスクのステータスに更新するかどうかのフラグ(true/false) */
	public static PLUG_IN_PARAM_NAME_UPDATE_OUTPUT_STATUS_FLAG = 'updateOutputStatusFlag';
	/** プラグインパラメータ名：成果物オブジェクト型属性の雛型ファイルオブジェクト型属性を設定 */
	public static PLUG_IN_PARAM_NAME_SETTING_TEMPLATE_FILE_IN_OUTPUT = 'settingTemplateFileInOutput';

	/****************************************************************************************
	 * exAttributeキー(結果DTOの拡張パラメータキー)
	 ****************************************************************************************/
	/** exAttributeキー：ステータスが進行してしまっているオブジェクトのフラグ */
	public static EX_ATTRIBUTE_KEY_NOT_UPDATED_TASK_FOR_EXISTS_EVENT = 'notUpdatedTaskTypeForExistsEvent';

}