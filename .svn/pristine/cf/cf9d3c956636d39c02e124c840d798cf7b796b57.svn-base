import { Injectable } from "@angular/core";
/**
 * 共通定数サービス
 */
@Injectable()
export class EIMConstantService {

	/** ネームスペース：帳票管理(開発) */
	public static NAME_SPACE_APP_FORM_DEV = 'app.form.dev';

	/** オブジェクトタイプ定義名称：一時添付ファイル */
	public static OBJECT_TYPE_NAME_TEMP_FILE = 'app.form.dev:一時添付ファイル';

	/** 属性タイプタイプ定義名称：帳票タイプワークスペースID */
	public static ATTRIBUTE_TYPE_NAME_FORM_WORKSPACE_ID = 'app.form.dev:帳票ワークスペースID'

	/** 属性タイプタイプ定義名称：帳票タイプフォルダID */
	public static ATTRIBUTE_TYPE_NAME_FORM_TYPE_FOLDER_ID = 'app.form.dev:帳票タイプフォルダID'

	/** 属性タイプタイプ定義名称：追加のメール通知先 */
	public static ATTRIBUTE_NAME_ADDMAIL_NOTIFICATION = 'app.form.dev:追加のメール通知先'

	/** 属性タイプタイプ定義名称：通知方法 */
	public static ATTRIBUTE_NAME_NOTIFICATION_METHOD = 'app.form.dev:通知方法'

	/** 属性タイプタイプ定義名称：複製元オブジェクトID */
	public static ATTRIBUTE_TYPE_NAME_SRC_OBJECT_ID = 'app.form.dev:複製元オブジェクトID'

	/** 属性タイプタイプ定義名称：無効フラグ */
	public static ATTRIBUTE_TYPE_NAME_DELETE_FLAG = 'app.form.dev:無効フラグ'

	/** 属性タイプタイプ定義名称：複製元オブジェクトID*/
	public static ATTRIBUTE_NAME_SRC_OBJECT_ID = 'app.form.dev:複製元オブジェクトID'

	/** 属性タイプタイプ定義名称： コメント*/
	public static ATTRIBUTE_NAME_COMMENT = 'app.form.dev:コメント'

	/** データグリッドフィールド定義名称：タイトル*/
	public static DATA_GRID_FIELD_NAME_TITLE = 'タイトル';

	/** ステータスタイプ種別：なし */
	public static STATUS_TYPE_KIND_ID_NONE = 0;
	/** ステータスタイプ種別：デフォルトステータスタイプ種別 */
	public static STATUS_TYPE_KIND_DEFUALT = -3000;
	/** ステータスタイプ種別：デフォルトステータスタイプ種別 */
	public static STATUS_TYPE_KIND_FORM_DEFUALT = -3001;
	/** ステータスタイプ種別：編集中 */
	public static STATUS_TYPE_KIND_ID_EDITTING = -13001;
	/** ステータスタイプ種別：承認依頼中 */
	public static STATUS_TYPE_KIND_ID_APPROVE = -13002;
	/** ステータスタイプ種別：公開処理中 */
	public static STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC = -13003;
	/** ステータスタイプ種別：公開済 */
	public static STATUS_TYPE_KIND_ID_PUBLIC = -13004;

	/** ベースイベントタイプID：承認依頼 */
	public static BASE_EVENT_TYPE_ID_REQ_APPROVE = -14001;
	/** ベースイベントタイプID：承認 */
	public static BASE_EVENT_TYPE_ID_APPROVAL = -14002;
	/** ベースイベントタイプID：公開 */
	public static BASE_EVENT_TYPE_ID_PUBLIC = -14003;
	/** ベースイベントタイプID：承認依頼取消 */
	public static BASE_EVENT_TYPE_ID_CANCEL_REQ_APPROVE = -14004;
	/** ベースイベントタイプID：差戻し */
	public static BASE_EVENT_TYPE_ID_SEND_BACK = -14005;
	/** ベースイベントタイプID：取戻し */
	public static BASE_EVENT_TYPE_ID_TAKE_BACK = -14006;
	/** ベースイベントタイプID：公開取消 */
	public static BASE_EVENT_TYPE_ID_PUBLIC_CANCEL = -14007;

	/** ベースイベントタイプID：デフォルトベースイベントタイプ*/
	public static EVENT_TYPE_ID_DEFUALT_BASE = -4000;
	/** ベースイベントタイプID：帳票デフォルトベースイベントタイプ*/
	public static EVENT_TYPE_ID_SET_ASSIGNMENT_PLAN_BASE = -4001;
	/** ベースイベントタイプID：帳票取戻しベースイベントタイプ*/
	public static EVENT_TYPE_ID_REGAIN_BASE = -4002;

	/** ガード条件ID：なし */
	public static GUARD_COND_ID_NOHTING_FORM = -5000;
	/** ガード条件ID：最後の承認者ではない */
	public static GUARD_COND_ID_DEFAULT_FORM = -5001;
	/** ガード条件ID：なし */
	public static GUARD_COND_ID_NOHTING = -15001;
	/** ガード条件ID：最後の承認者ではない */
	public static GUARD_COND_ID_FINAL_APPROVED_IS_NOT = -15002;
	/** ガード条件ID：PDF変換対象 */
	public static GUARD_COND_ID_PDF_CONVERSION = -15003;
	/** ガード条件ID：PDF変換対象外 */
	public static GUARD_COND_ID_NON_PDF_CONVERSION = -15004;
	/** ガード条件ID：実行者が現ステータスの承認者 */
	public static GUARD_COND_ID_CURRENT_APPROVAL_CLIENT = -15005;
	/** ガード条件ID：実行者が現ステータスの承認依頼者 */
	public static GUARD_COND_ID_CURRENT_APPROVAL_REQUEST = -15006;

	/** メール種別：承認依頼通知 */
	public static MAIL_TYPE_ID_REQ_APPROVE = -12001;
	/** メール種別：承認通知 */
	public static MAIL_TYPE_ID_APPROVE = -12002;
	/** メール種別：差戻し通知 */
	public static MAIL_TYPE_ID_SEND_BACK = -12003;
	/** メール種別：承認依頼取消通知 */
	public static MAIL_TYPE_ID_CANCEL_REQ_APPROVE = -12004;
	/** メール種別：公開通知 */
	public static MAIL_TYPE_ID_PUBLIC_NOTIFICATION = -12005;
	/** メール種別：公開取消通知 */
	public static MAIL_TYPE_ID_PUBLIC_CANCEL_NOTIFICATION = -12006;

	/** メール通知方法:即時 */
	public static MAILNOTICE_METHOD_IMMEDIATE = '0';
	/** メール通知方法:定時 */
	public static MAILNOTICE_METHOD_ACCUMULATE = '1';
	/** メール通知方法:なし */
	public static MAILNOTICE_METHOD_NOTHING = '3';

	/** 正規表現：パスワード */
	public static REGULAR_EXPRESSION_PASSWORD = '^[0-9A-Za-z!-\\/:-@\\[-`\\{-~ ]+$';

	/** 正規表現：数値のみ */
	public static REGULAR_EXPRESSION_NUMBER_ONLY = '^[0-9]+$';

	/** カレンダー年範囲 */
	public static CALENDAR_YEAR_RANGE = '1980:2049';

	/** 入力最大文字数 */
	public static INPUT_MAX_LENGTH = 127;

	/** 有効期限設定入力最大文字数 */
	public static INPUT_YUUKOU_MAX_LENGTH = 9;

	/** 日時表示用カラム幅 */
	public static COLUMN_WIDTH_DATETIME = 165;

	/** 承認系画面カラム高さ */
	public static APPROVE_ROW_HEIGHT = 65;

	/** メール送信方法：即時送信 */
	public static MAIL_METHOD_ENUM_IMMEDIATE = 'IMMEDIATE';

	/** メール送信方法：定時送信 */
	public static MAIL_METHOD_ENUM_SCHEDULED = 'SCHEDULED';

	/** メール送信方法：一括送信 */
	public static MAIL_METHOD_ENUM_ACCUMULATE = 'ACCUMULATE';

	/** メール送信方法：ユーザ選択 */
	public static MAIL_METHOD_ENUM_SELECTABLE = 'SELECTABLE';

	/** エントリータイプ：ユーザ */
	public static ENTRY_TYPE_NAME_USER = 'USER';

	/** エントリタイプ(ユーザ、グループ、ロール、複合グループ) */
	public static ENTRY_TYPE_USER = 1;
	public static ENTRY_TYPE_GROUP = 2;
	public static ENTRY_TYPE_ROLE = 3;
	public static ENTRY_TYPE_COMPLEX_GROUP = 4;
	public static ENTRY_TYPE_USER_DEF_GROUP = 5;
	public static ENTRY_TYPE_SYSTEM_FUNC = 6;
	public static ENTRY_TYPE_OBJECT_ROLE = 7;

	/** 区切り文字：コンマ */
	public static DELIMITER_COMMA = ',';

	/** 区切り文字：~ */
	public static DELIMITER_TIDE = '～';

	/** Windows禁止文字 */
	public static INVALID_NAME_CHAR: string[] = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];

	/** 3点リーダー */
	public static THREE_DOT_LEADER = '...';

	/** イベント処理タイプ：差戻し */
	public static EVENT_FUNCTION_TYPE_BACK = 'back';

	/** イベント処理タイプ：承認・承認依頼 */
	public static EVENT_FUNCTION_TYPE_APPROVE = 'approve';

	/** イベント処理タイプ：保留 */
	public static EVENT_FUNCTION_TYPE_WAIT = 'wait';

	/** メール送信有無：送信しない */
	public static MAIL_SENDING_OFF = '0';

	/** メール送信有無：送信する */
	public static MAIL_SENDING_ON = '1';

	/** 承認者通過条件：全員 */
	public static APPROVE_THROUGH_ALL = '2';

	/** 承認者通過条件：一人 */
	public static APPROVE_THROUGH_ONE = '3';

	/** 数値型最大文字数 */
	public static NUMBER_MAX_LENGTH = 15;

	/** 数値型(LONG)最大文字数 */
	public static LONG_MAX_LENGTH = 15;

	/** 実数型最大文字数 */
	public static REAL_NUMBER_MAX_LENGTH = 15;

	/** 文字列型最大文字数 */
	public static STRING_MAX_LENGTH = 127;

	/** テキスト型最大文字数 */
	public static TEXT_MAX_LENGTH = 127;

	/** 数値型フォーマット */
	public static NUMBER_PATTERN = '([+-]?[1-9]\\d*|0)';

	/** 実数型フォーマット */
	public static REAL_PATTERN = '([+-]?[1-9]\\d*|[+-]?0)(\\.\\d+)?';

	/** 禁則文字フォーマット */
	public static FORBIDDEN_PATTERN = /\\|\/|\:|\*|\?|\"|\<|\>|\|/g;

	/** 属性デフォルト値：ログインユーザ */
		public static ATTRIBUTE_DEFAULT_VALUE_LOGIN_USER = 'login_user';

	/** 数値型 */
	public static VALUE_TYPE_INTEGER = 1;
	/** 文字列型 */
	public static VALUE_TYPE_STRING = 2;
	/** 日付型 */
	public static VALUE_TYPE_DATE = 3;
	/** テキスト型 */
	public static VALUE_TYPE_TEXT = 4;
	/** 実数型 */
	public static VALUE_TYPE_DOUBLE = 5;
	/** オブジェクト型 */
	public static VALUE_TYPE_OBJECT = 6;
	/** ユーザ型 */
	public static VALUE_TYPE_USER = 7;
	/** コード型 */
	public static VALUE_TYPE_CODE = 8;

	/** 数値型 */
	public static VALUE_TYPE_NAME_INTEGER = 'LONG';
	/** 文字列型 */
	public static VALUE_TYPE_NAME_STRING = 'STRING';
	/** 日付型 */
	public static VALUE_TYPE_NAME_DATE = 'DATE';
	/** テキスト型 */
	public static VALUE_TYPE_NAME_TEXT = 'TEXT';
	/** 実数型 */
	public static VALUE_TYPE_NAME_DOUBLE = 'DOUBLE';
	/** オブジェクト型 */
	public static VALUE_TYPE_NAME_OBJECT = 'OBJECT';
	/** ユーザ型 */
	public static VALUE_TYPE_NAME_USER = 'USER';
	/** コード型 */
	public static VALUE_TYPE_NAME_CODE = 'CODE';

	/** Java Integer.MAX_VALUE */
	public static INT_MAX_VALUE = 2147483647;

	/** ラジオボタン0~9の10桁の値 */
	public static OPERATION_HISTORY_DIGITS = 10;

	/**
	* セキュリティ管理アクセス権限定義
	*/
	public static PROC_DEFNAME_CREATE = 'CREATE';
	public static PROC_DEFNAME_READ = 'READ';
	public static PROC_DEFNAME_UPDATE = 'UPDATE';
	public static PROC_DEFNAME_DELETE = 'DELETE';
	public static PROC_DEFNAME_RENAME = 'RENAME';
	public static PROC_DEFNAME_LOCK = 'LOCK';
	public static PROC_DEFNAME_UNLOCK = 'UNLOCK';
	public static PROC_DEFNAME_CHECKIN = 'CHECKIN';
	public static PROC_DEFNAME_CHECKOUT = 'CHECKOUT';
	public static PROC_DEFNAME_STATUS_UP = 'STATUS_UP';
	public static PROC_DEFNAME_STATUS_DOWN = 'STATUS_DOWN';
	public static PROC_DEFNAME_REVISION_UP = 'REVISION_UP';
	public static PROC_DEFNAME_CREATE_RELATION = 'CREATE_RELATION';
	public static PROC_DEFNAME_UPDATE_RELATION = 'UPDATE_RELATION';
	public static PROC_DEFNAME_DELETE_RELATION = 'DELETE_RELATION';
	public static PROC_DEFNAME_APPROVE = 'APPROVE';
	public static PROC_DEFNAME_OPEN_READ = 'ROLE_500';

	/* サブシステム名セッションストレージキー */
	public static readonly SESSIONSTORAGE_SUBSYSTEM_NAME = '_';
	/* SSOフラグセッションストレージキー */
	public static readonly SESSIONSTORAGE_KEY_SSO = 'sso';
	/* EIMANAGER独自認証フラグセッションストレージキー */
	public static readonly SESSIONSTORAGE_KEY_INTERNAL_AUTH = 'internalAuth';

	/* ファセット種別 */
	public static FACET_TYPE_VALUE = "VALUE";
	public static FACET_TYPE_RANGE_NUMERIC = "RANGE_NUMERIC";
	public static FACET_TYPE_RANGE_DATE = "RANGE_DATE";

	/** 表示モード */
	public static DISPLAY_TEXTEXCERPT = 0;
	public static DISPLAY_LIST = 1;
	public static DISPLAY_THUMBNAIL = 2;
	
	/** 電子署名使用ツール：HGPScan */
	public static SIGN_USE_TOOL_HGPSCAN = 'hgpscan';
	/** 電子署名使用ツール：IOWebDoc */
	public static SIGN_USE_TOOL_IOWEB = 'ioweb';
	/** 電子署名使用ツール：フリーライブラリ */
	public static SIGN_USE_TOOL_NORMAL = 'normal';

	/** ローカルストレージキー：ダイレクトアクセス情報 */
	public static LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO = ['directAccessInfo'];

	/** プラグインパラメータ名：ワークスペースID */
	public static PLUG_IN_PARAM_NAME_WORKSPACE_ID = 'workspaceId';
	/** プラグインパラメータ名：結果ドメインにオブジェクトタイプレイアウト情報を含めるかどうかのフラグ(true/false) */
	public static PLUG_IN_PARAM_NAME_INCLUDE_OBJECT_TYPE_LAYOUT = 'includeObjectTypeLayout';
	/** プラグインパラメータ名：結果ドメインに属性タイプレイアウト情報を含めるかどうかのフラグ(true/false) */
	public static PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT = 'includeAttributeTypeLayout';	
	/** プラグインパラメータ名：結果ドメインのDTOに含めるアクセス権限のマップ({<オブジェクトタイプ定義名称>: <アクセスロールタイプ名>}) */
	public static PLUG_IN_PARAM_NAME_INCLUDE_ACCESS_ROLE_TYPE_NAME_MAP = 'includeAccessRoleTypeNameMap';
	/** プラグインパラメータ名：複製実施 */
	public static PLUG_IN_PARAM_NAME_IS_INVOKE_DUPLICATE = 'isInvokeDuplicate';

	/** パスワード変更画面の高さ最小値 */
	public static CHANGE_PASSWORD_DISP_MIN_HEIGHT = 200;

	/** 折り返し文字(\n) */
	public static LOOP_BACK_CHARACHER_LF = '\n';
}
