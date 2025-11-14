/**
 * ドキュメント管理定数サービス
 */
export class EIMDocumentsConstantService {

	/** 操作履歴に出力するアプリケーションのID */
	public static OPE_HIST_APP_ID = 'document';

	/** ステータスタイプ：編集中 */
	public static STATUS_TYPE_KIND_ID_EDITTING = -13001;
	/** ステータスタイプ：承認依頼中 */
	public static STATUS_TYPE_KIND_ID_APPROVAL_REQUEST = -13002;
	/** ステータスタイプ：公開済 */
	public static STATUS_TYPE_KIND_ID_PUBLIC = -13004;
	/** ステータスタイプ：公開処理中 */
	public static STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC = -13003;
	/** ベースイベントタイプ：承認 */
	public static BASE_EVENT_TYPE_ID_APPROVAL = -14002;
	/** メール種別：公開通知 */
	public static MAIL_TYPE_ID_PUBLIC_NOTIFICATION = -12005;

	/** OCR処理待 */
	public static OCR_PROC_STATUS_PROCESS_WAIT = '0';
	/** OCR処理中 */
	public static OCR_PROC_STATUS_PROCESSING = '1';
	/** OCR処理完了 */
	public static OCR_PROC_STATUS_PROCESS_COMPLETE = '2';

	/** OCR結果未設定 */
	public static OCR_RESULT_STATUS_NONE = '-1';
	/** OCR結果成功 */
	public static OCR_RESULT_STATUS_SUCCESS = '1';
	/** OCR結果失敗 */
	public static OCR_RESULT_STATUS_FAILURE = '9';

	/** PDF変換ステータス：処理なし */
	public static PDF_CONVERSION_STATUS_NONE = -1;
	/** PDF変換ステータス：変換中 */
	public static PDF_CONVERSION_STATUS_PROCESSING = 1;
	/** PDF変換ステータス：変換完了（原本ファイルと乖離なし） */
	public static PDF_CONVERSION_STATUS_PROCESS_COMPLETE_SAME_ORIGINAL = 2;
	/** PDF変換ステータス：変換完了（原本ファイルと乖離あり） */
	public static PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL = 3;
	/** PDF変換ステータス：変換失敗 */
	public static PDF_CONVERSION_STATUS_PROCESS_FAILURE = 9;

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

	/** 数値型最大文字数 */
	public static NUMBER_MAX_LENGTH = 15;
	/** 実数型最大文字数 */
	public static REAL_NUMBER_MAX_LENGTH = 17;
	/** 文字列型最大文字数 */
	public static STRING_MAX_LENGTH = 127;
	/** テキスト型最大文字数 */
	public static TEXT_MAX_LENGTH = 127;

	/** 数値型フォーマット */
	public static NUMBER_PATTERN = '([+-]?[1-9]\\d*|0)';
	/** 実数型フォーマット */
	public static REAL_PATTERN = '([+-]?[1-9]\\d*|0)(\\.\\d+)?';

	/** ワークスペースオブジェクトタイプ */
	public static OBJECT_TYPE_WORKSPACE = 'ワークスペース';
	/** フォルダオブジェクトタイプ */
	public static OBJECT_TYPE_FOLDER = 'フォルダ';
	/** ドキュメントオブジェクトタイプ */
	public static OBJECT_TYPE_DOCUMENT = 'ドキュメント';
	/** フォルダタイプ */
	public static FOLDER_DOCUMENT = 'フォルダ';
	/** タグオブジェクトタイプ */
	public static OBJECT_TYPE_TAG = 'タグ';
	/** 属性オブジェクトタイプ */
	public static OBJECT_TYPE_ATTRIBUTE = '属性';
	/** ごみ箱オブジェクトタイプ */
	public static OBJECT_TYPE_TRASH_CAN = 'ごみ箱';
	/** ワークスペース固有ごみ箱オブジェクトタイプ */
	public static OBJECT_TYPE_WORKSPACE_TRASH_CAN = 'ワークスペース固有ごみ箱';
	/** ドキュメントリンクオブジェクトタイプ */
	public static OBJECT_TYPE_DOCUMENT_LINK = 'ドキュメントリンク';

	/** プロパティ属性 */
	public static ATTRIBUTE_TYPE_PROPERTY = 'プロパティ';
	/** 有効期限属性 */
	public static ATTRIBUTE_TYPE_EXPIREDATE = '有効期限';
	/** 下位への引継ぎ属性 */
	public static ATTRIBUTE_TYPE_FOLDER_TO_LOW_ATTR = '下位への引継ぎ属性';
	/** 名称割当て属性 */
	public static ATTRIBUTE_TYPE_FOLDER_TO_ASSIGN_NAME = '名称割当て属性';
	/** 上位からの引継ぎ属性 */
	public static ATTRIBUTE_TYPE_FOLDER_TO_HIGHT_ATTR = '上位からの引継ぎ属性';

	/** アクセス権限:作成 */
	public static ACCESS_ROLE_ID_CREATE = 11;
	/** アクセス権限:ステータスup */
	public static ACCESS_ROLE_ID_STATUS_UP = 41;
	/** アクセス権限:常時読取 */
	public static ACCESS_ROLE_ID_ALWAYS_READ = 500;
	/** アクセス権限:読み取り */
	public static ACCESS_ROLE_ID_READ = 12;

	/** エントリタイプ(ユーザ、グループ、ロール、複合グループ) */
	public static ENTRY_TYPE_USER = 1;
	public static ENTRY_TYPE_GROUP = 2;
	public static ENTRY_TYPE_ROLE = 3;
	public static ENTRY_TYPE_COMPLEX_GROUP = 4;

	/** PDF挿入位置入力最大文字数 */
	public static PDF_INSERTION_POSITION_DIGIT = 4;

	/** PDF挿入位置入力最大値 */
	public static PDF_INSERTION_POSITION_MAXIMUM_VALUE = 1500;

	/** PDF挿入位置入力最小値 */
	public static PDF_INSERTION_POSITION_MINIMUM_VALUE = 0;

	/** PDFファイル拡張子 */
	public static PDF_EXTENSION = '.pdf';

	/** ZIPファイル拡張子 */
	public static ZIP_EXTENSION = '.zip';

	/** CSVファイル拡張子 */
	public static CSV_EXTENSION = '.csv';

	/** CSVファイル名 */
	public static CIRCULATION_CSV_FILE_NAME = 'CIRCULATION_';

	/** 承認依頼先画面上長のみチェックボックス初期表示設定 */
	public static APPROVER_SELECTED_IS_BOSS_CHECK = 2;

	/** 署名・暗号化状態::署名・暗号化なし */
	public static SIGNENCR_KIND_NOT_SIGNENCR = '0';
	/** 署名・暗号化状態:署名・暗号化済み */
	public static SIGNENCR_KIND_SIGNENCR = '1';
	/** 署名・暗号化状態:署名・暗号化中 */
	public static SIGNENCR_KIND_PROCESSING_SIGNENCR = '2';
	/** 署名・暗号化状態:署名・暗号化失敗 */
	public static SIGNENCR_KIND_FAILED = '3';

	/** ウィンドウタイトル */
	public static WINDOW_TITLE = 'Document/EIMANAGER';

	/** URL */
	public static URLLINK_DOWNLOAD_KIND_DOCUMENT: number  = 1;
	/** 原本ファイル最新版URL */
	public static URLLINK_DOWNLOAD_KIND_ORIGINAL: number = 2;
	/** 公開ファイル最新版URL */
	public static URLLINK_DOWNLOAD_KIND_PUBLIC: number = 3;


	/** オブジェクトを選択する際のルートパス(client/#/以降) */
	public static ROUTE_PATH_FOR_SELECT_OBJECT = '/documents/login';
	/** 原本ファイルダウンロードのパス */
	public static PATH_FOR_DOWNLOAD_PRIVATE_DOCUMENT = '/servlet/DownloadPrivateLatestDocument';
	/** 公開ファイルダウンロードのパス */
	public static PATH_FOR_DOWNLOAD_PUBLIC_DOCUMENT = '/servlet/DownloadPublicLatestDocument';
}
