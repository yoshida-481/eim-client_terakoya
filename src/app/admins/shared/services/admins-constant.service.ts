import { EIMConstantService } from "app/shared/services/constant.service";

/**
 * ドキュメント管理定数サービス
 */
export class EIMAdminsConstantService {

	/** 操作履歴に出力するアプリケーションのID */
	public static OPE_HIST_APP_ID = 'system';

	/** アプリケーションのID */
	public static APP_ID_GENERAL = 'general';
	public static APP_ID_DOCUMENT = 'document';
	public static APP_ID_FORM = 'form';
	public static APP_ID_TASK = 'task';

	/** 言語取得失敗時エラーメッセージ(セッション切れと類似現象) */
	public static LANGUAGE_NOT_EXIST = 'Language cache error';

	// ステータスタイプ：デフォルトステータスタイプ種別
	public static STATUS_TYPE__KIND_ID_DEFAULT = -3000;
	// ステータスタイプ：帳票デフォルトステータスタイプ種別
	public static STATUS_TYPE__KIND_ID_FORM_DEFAULT = -3001;
	// ステータスタイプ：編集中
	public static STATUS_TYPE_KIND_ID_EDITTING = -13001;
	/** ステータスタイプ：承認依頼中 */
	public static STATUS_TYPE_KIND_ID_APPROVAL_REQUEST = -13002;
	// ステータスタイプ：公開済
	public static STATUS_TYPE_KIND_ID_PUBLIC = -13004;
	// ベースイベントタイプ：承認
	public static BASE_EVENT_TYPE_ID_APPROVAL = -14002;
	// メール種別：公開通知
	public static MAIL_TYPE_ID_PUBLIC_NOTIFICATION = -12005;


	// 数値型
	public static VALUE_TYPE_INTEGER = 1;
	// 文字列型
	public static VALUE_TYPE_STRING = 2;
	// 日付型
	public static VALUE_TYPE_DATE = 3;
	// テキスト型
	public static VALUE_TYPE_TEXT = 4;
	// 実数型
	public static VALUE_TYPE_DOUBLE = 5;
	// オブジェクト型
	public static VALUE_TYPE_OBJECT = 6;
	// ユーザ型
	public static VALUE_TYPE_USER = 7;
	// コード型
	public static VALUE_TYPE_CODE = 8;

	// 数値型最大文字数
	public static NUMBER_MAX_LENGTH = 15;
	// 実数型最大文字数
	public static REAL_NUMBER_MAX_LENGTH = 17;
	// 文字列型最大文字数
	public static STRING_MAX_LENGTH = 127;
	// テキスト型最大文字数
	public static TEXT_MAX_LENGTH = 127;

	// 数値型フォーマット
	public static NUMBER_PATTERN = '([+-]?[1-9]\\d*|0)';
	// 実数型フォーマット
	public static REAL_PATTERN = '([+-]?[1-9]\\d*|0)(\\.\\d+)?';

	// ワークスペースオブジェクトタイプ
	public static OBJECT_TYPE_WORKSPACE = 'ワークスペース';
	// フォルダオブジェクトタイプ
	public static OBJECT_TYPE_FOLDER = 'フォルダ';
	// ドキュメントオブジェクトタイプ
	public static OBJECT_TYPE_DOCUMENT = 'ドキュメント';
	// ごみ箱オブジェクトタイプ
	public static OBJECT_TYPE_TRASH_CAN = 'ごみ箱';
	// ワークスペース固有ごみ箱オブジェクトタイプ
	public static OBJECT_TYPE_WORKSPACE_TRASH_CAN = 'ワークスペース固有ごみ箱';
	// タグオブジェクトタイプ
	public static OBJECT_TYPE_TAG = 'タグ';
	// お気に入りオブジェク名
	public static OBJECT_NAME_FAVORITE = 'お気に入り';
	// タグオブジェクトタイプ
	public static OBJECT_NAME_PDF_CONVERSION = 'PDF変換';
	// タグオブジェクトタイプ
	public static OBJECT_NAME_MY_DOCUMENTS = 'マイドキュメント';
	// タグオブジェクトタイプ
	public static OBJECT_NAME_CONFIRM_RECEPTION = '受信確認';
	// 文書添付ファイル定義名
	public static DOCUMENT_ATTACHMENT = 'app.form.dev:帳票添付ファイル';
	// 一時添付ファイル定義名
	public static PRIMARY_ATTACHMENT = 'app.form.dev:一時添付ファイル';

	// プロパティ属性
	public static ATTRIBUTE_TYPE_PROPERTY = 'プロパティ';
	// 有効期限属性
	public static ATTRIBUTE_TYPE_EXPIREDATE = '有効期限';
	// 下位への引継ぎ属性
	public static ATTRIBUTE_TYPE_FOLDER_TO_LOW_ATTR = '下位への引継ぎ属性';

	// アクセス権限:作成
	public static ACCESS_ROLE_ID_CREATE = 11;
	// アクセス権限:ステータスup
	public static ACCESS_ROLE_ID_STATUS_UP = 41;
	// アクセス権限:常時読取
	public static ACCESS_ROLE_ID_ALWAYS_READ = 500;
	// アクセス権限:読み取り
	public static ACCESS_ROLE_ID_READ = 12;

	// エントリタイプ(ID:定義名称)
	public static ENTRY_TYPE_EN: { [key: number]: string; } = {
		[EIMConstantService.ENTRY_TYPE_USER]: 'user',
		[EIMConstantService.ENTRY_TYPE_GROUP]: 'group',
		[EIMConstantService.ENTRY_TYPE_ROLE]: 'role',
		[EIMConstantService.ENTRY_TYPE_COMPLEX_GROUP]: 'compGroup',
		[EIMConstantService.ENTRY_TYPE_USER_DEF_GROUP]: 'userDefGroup',
		[EIMConstantService.ENTRY_TYPE_SYSTEM_FUNC]: 'system',
		[EIMConstantService.ENTRY_TYPE_OBJECT_ROLE]: 'objectRole',
	};

	// エントリタイプ(定義名称:ID)
	public static ENTRY_TYPE_ID_EN: {} = {
		'user': EIMConstantService.ENTRY_TYPE_USER ,
		'group': EIMConstantService.ENTRY_TYPE_GROUP,
		'role': EIMConstantService.ENTRY_TYPE_ROLE,
		'compGroup': EIMConstantService.ENTRY_TYPE_COMPLEX_GROUP,
		'userDefGroup': EIMConstantService.ENTRY_TYPE_USER_DEF_GROUP,
		'system': EIMConstantService.ENTRY_TYPE_SYSTEM_FUNC,
		'objectRole': EIMConstantService.ENTRY_TYPE_OBJECT_ROLE,
	};

	// ステータスタイプP
	public static STATUS_TYPE_EDIT = 1;					// 編集中
	public static STATUS_TYPE_APPROVAL = 2;			// 承認中
	public static STATUS_TYPE_PUBLISH = 3;			// 公開


	/** 「複写」先頭付け文言 */
	public static COPY_WORD: { [key: string]: string; } = {
			JA: 'コピー -',
			EN: 'Copy -'
		};

	/** メイン言語コード */
	public static MAIN_LANGUAGE_CODE = 'JA';


	// ディレクトリのステータスのラベル：ONLINE
	public static DIR_STATUS_ONLINE_LABEL = 'ONLINE';
	// ディレクトリのステータスのラベル：OFFLINE
	public static DIR_STATUS_OFFLINE_LABEL = 'OFFLINE';
	// ディレクトリのステータスの値：ONLINE
	public static DIR_STATUS_ONLINE_VALUE = 1;
	// ディレクトリのステータスの値：OFFLINE
	public static DIR_STATUS_OFFLINE_VALUE = 0;

	// システム管理アプリケーション種別ID：汎用管理
	public static ADMIN_APP_ID_GENERAL = 'general';
	// システム管理アプリケーション種別ID：ドキュメント管理
	public static ADMIN_APP_ID_DOCUMENT = 'document';
	// システム管理アプリケーション種別ID：帳票管理
	public static ADMIN_APP_ID_FORM = 'form';
	// システム管理アプリケーション種別ID：タスク管理
	public static ADMIN_APP_ID_TASK = 'task';

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

	// デリミタ「:」
	public static DELIMITER_COLON = ':';
	// デリミタ「|」
	public static DELIMITER_PIPE = '|';

	/** デリミタ「/」 */
	public static DELIMITER_PATH = '/'

	// カラーコード接頭文字「#」
	public static COLOR_HASH = '#';

	// 改行つきセパレータ
	public static NEW_LINE_SEPARATER = '\n------\n';

	// 帳票タイプ
	public static OBJECT_TYPE_NAME_FORM= 'app.form.dev:帳票';
	public static OBJECT_TYPE_NAME= 'OBJECT_TYPE_NAME';

	/** CSVファイル拡張子 */
	public static CSV_EXTENSION = '.csv';

	/** ネームスペース */
	public static NAMESPACE_DOC_USER  = 'app.doc.user';
	public static NAMESPACE_FORM_DEV  = 'app.form.dev';
	public static NAMESPACE_FORM_USER = 'app.form.user';
	public static NAMESPACE_TASK_DEV  = 'app.task.dev';
	public static NAMESPACE_TASK_USER = 'app.task.user';

	/** colorPicker初期選択色 */
	public static INIT_COLOR_CODE = '#ff0000';

	/** 色未設定時内部値：「-」 */
	public static NO_COLOR = '-'

	/** チェックエラー種類 */
	public static CHECK_ERROR = 'CHECK_ERROR'

	/** デフォルトフォーマット文字列 */
	public static DEFAULT_FORMAT_STRING = ' [default]';

	/** 管理画面処理名称：登録処理 */
	public static PROC_NAME_CREATE = 'CREATE';
	/** 管理画面処理名称：更新処理 */
	public static PROC_NAME_UPDATE = 'UPDATE';

	/** 操作履歴画面：検索してCSVダウンロード時の初期パラメータ */
	public static OPERATION_HISTORY_DEFAULT = 'NULL';

	/** 帳票フォルダ最大階層 */
	public static FORM_FOLDER_MAX_HIERARCHY = 5;

	/** ウィンドウタイトル */
	public static WINDOW_TITLE = 'System/EIMANAGER';
}
