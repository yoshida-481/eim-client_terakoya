import { EIMWorkspaceService } from 'app/documents/shared/services/apis/workspace.service';

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { EIMContentsTreeComponentService, EIMFolderTreeNode } from 'app/documents/components/contents-tree/contents-tree.component.service';
import { EIMDialogManagerComponentService, dialogName } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMComponentInfo, EIMMenuItem } from 'app/shared/shared.interface';

import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMFolder, EIMFolderService } from 'app/documents/shared/services/apis/folder.service';
import { EIMWorkflowEvent, EIMWorkflowService } from 'app/documents/shared/services/apis/workflow.service';
import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';

import { EIMPublicFileCombineExecutorComponent } from 'app/documents/components/public-file-combine-executor/public-file-combine-executor.component';
import { EIMPublicFileCompareExecutorComponent } from 'app/documents/components/public-file-compare-executor/public-file-compare-executor.component';
import { EIMTagAllocationApplicantComponent } from 'app/documents/components/tag-allocation-applicant/tag-allocation-applicant.component';
import { EIMPublicFileSecurityDomain } from 'app/documents/shared/domains/public-file-security.domain';
import { EIMApproveDocumentDTO } from 'app/documents/shared/dtos/approve-document.dto';
import { EIMAttributeTreeService } from 'app/documents/shared/services/apis/attribute-tree.service';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { MenuItem } from 'primeng/api';
import { finalize } from 'rxjs/internal/operators/finalize';

import { EIMBoxContentsListComponentService } from 'app/documents/components/box-contents-list/box-contents-list.component.service';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';
import { EIMBoxAuthorizationService } from 'app/shared/services/apis/box-authorization.service';

import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMPublicDocumentService } from 'app/documents/shared/services/apis/public-document.service';
import { EIMDomainService } from 'app/shared/services/domain.service';


namespace accordionIndex {
	export const WORKSPACE = 0;
	export const SEARCH = 1;
	export const CIRCULATION_SITUATION = 2;
	export const ATTRIBUTE_TREE = 3;
}

/**
 * ドキュメントメインコンポーネント情報インタフェース
 */
export interface EIMDocumentMainComponentInfo extends EIMComponentInfo {
	// 改名前のオブジェクト名
	preObjName: string;
	// 貼り付け元オブジェクト(切り取り、または、コピー)
	pasteSourceObj: any;
	// コンテンツツリー
	contentsTree?: EIMTreeComponent;
	// 属性ツリー
	attrTree?: EIMTreeComponent;
	// コンテンツ一覧
	contentsList?: EIMDataGridComponent;
	// CSVダウンロード一覧
	csvDownloadList?: EIMDataGridComponent;
	// 選択親オブジェクトID
	selectedParentObjId?: number;
	// 選択親オブジェクト(タグ処理用)
	selectedParent?: EIMFolderTreeNode;
	// 選択ワークスペースオブジェクトID
	selectedWorkspaceObjId?: number;
	// 追加ファイルリスト
	addFileList?: any[],
	// ツリーで選択しているパス
	path?: string;
	// 表示中のコンテンツリストに対応するツリーパス
	// 選択されたコンテンツツリーのノードとコンテンツリストの表示内容がレスポンス待ちの間ずれため、
	// pathとは別に管理する
	contentsListPath?: string;
	// 処理タイプ(承認画面の処理初期値)
	functionType?: string;
	// アコーディオン選択インデックス
	accordionActiveIndex?: number;
	// メインメニュー
	mainMenuItems?: EIMMenuItem[];
	// コンテキストメニュー
	contentsListMenuItems?: EIMMenuItem[];
	normalContentsListMenuItems?: EIMMenuItem[];
	combineContentsListMenuItems?: EIMMenuItem[];
	compareContentsListMenuItems?: EIMMenuItem[];
	tagContextMenuItems?: MenuItem[];
	circulationSituationMenuItems?: EIMMenuItem[];
	accordionSearchMenuItems?: EIMMenuItem[];
	thumbnailDownloadButtonMenuItems?: EIMMenuItem[];
	thumbnailDirectMenuButtonItems?: EIMMenuItem[];
	// キーダウンイベント判定
	keyDownFlg?: boolean;
	// ログインユーザ情報
	loginUser?: any;
	// チェック対象ダイアログID
	checkTargetDialogId?: string;
	// 属性ツリー選択ノード(ページ再読み込み用)
	selectedAttrTreeNodeForPageReload?: any;
	// Box表示有無
	isDisplayingBox?: boolean;
	// 選択中のコンテンツリスト(Box連携用に使用する)
	selectedDataForBox?: any[];
	// 選択中のドキュメントタイプID(Box連携用に使用する)
	selectedDocumentTypeId?: number;
	// preview thumbnails Visible
	isThumbnailsVisible?:boolean;
	// データの追加・更新・削除の完了ハンドラ
	onComplete?(params: any): void;
	// アコーディオン選択変更イベント
	onChangeAccordionTab?(event): void;
	// 表示中ダイアログID変更
	changeDialogId?(dialoId, checkTargetUpdate): void;
}

/**
 * 追加データ情報インタフェース
 */
interface EIMCreatedData {
	data: any;
	additionalTarget?: any;
}

/**
 * 追加・更新・削除のデータ情報インタフェース
 */
interface EIMCompleteData {
	createdData?: EIMCreatedData[];
	updatedData?: any[];
	deletedData?: any[];
	isRefleshTree?: boolean;
}

/**
 * ドキュメントメインコンポーネントサービス.
 */
@Injectable()
export class EIMDocumentMainComponentService {

	/** ダイレクトアクセスサブジェクト */
	contentsAccess = new Subject<any>();
	/** ダイレクトアクセスオブザーバル */
	contentsAccess$ = this.contentsAccess.asObservable();

	/** コンテンツ選択ダイレクトアクセスサブジェクト */
	onSelect = new Subject<any>();
	/** コンテンツ選択ダイレクトアクセスオブザーバル */
	onSelect$ = this.onSelect.asObservable();

	/** バリデータマップ */
	private validatorMap: any = {
		//ドキュメント登録確認（Box連携用）
		showDocumentCreatorConfirmation: [
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// ドキュメント登録
		showDocumentCreator: [
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// フォルダ登録
		showFolderCreator: [
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// タグ登録
		showTagCreator: [
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentNotWFFolder,
			this.checkParentAuthForCreate,
		],
		// ワークスペース登録
		showWorkspaceCreator: [
			this.checkHasWorkspaceSystemAuth,
		],
		// ワークスペース編集
		showWorkspaceEditor: [
			this.checkParentSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsWorkspace,
		],
		// ワークスペース削除
		showWorkspaceDelete: [
			this.checkParentSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsWorkspace,
			this.checkHasWorkspaceSystemAuth,
			this.checkSecurityOfDocument.bind(this),
		],
		// ドキュメント一括登録
		showLumpDocumentCreator: [
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// フォルダアップロード
		showLumpFolderCreator: [
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// スキャン用紙登録
		showCoverCreator: [
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// チェックイン
		showCheckin: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsNotPublic),
			this.checkArray(this.checkNotCoverDocument),
		],
		// チェックアウト
		checkout: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsPublic),
			this.checkArray(this.checkIsNotLock),
			this.checkArray(this.checkNotCoverDocument),
			this.checkParentAuthForCreate,
		],
		// チェックアウト取り消し
		cancelCheckout: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsLock),
			this.checkParentAuthForCreate,
		],
		// コピー
		copy: [
			this.checkSelected,
			this.checkArray(this.checkTypeIsOtherAttribute),
			this.checkArray(this.checkTypeIsNotFolder),
		],
		// 切り取り
		cut: [
			this.checkSelected,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkArray(this.checkTypeIsDocumentOrFolderOrTag),
		],
		// 貼り付け
		paste: [
			this.checkPastable,
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// ブランチコピー
		copyBranch: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsNotGarbageBox,
			this.checkArray(this.checkTypeIsDocument),
			this.checkParentNotTag,
		],
		// 名前の変更
		rename: [
			this.checkGridView,
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkParentNotTag,
			this.checkArray(this.checkParentWFFolderStatusEdittingFromSelectedRowData),
			this.checkArray(this.checkTypeIsDocumentOrFolderOrTag),
			this.checkParentAuthForCreate,
		],
		// リンク貼付け（版固定/手動）
		pasteFixedLink: [
			this.checkPastable,
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// リンク貼付け（最新版/自動）
		pasteLatestLink: [
			this.checkPastable,
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEditting,
			this.checkParentAuthForCreate,
		],
		// リンク設定
		showLinkUpdator: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkParentWFFolderStatusEditting,
			this.checkArray(this.checkTypeIsDocumentLinkOrFolder),
			this.checkArray(this.checkStatusEditingWFFolder),
			this.checkParentAuthForCreate,
		],
		// リンク更新（最新リビジョン）
		updateLatestLink: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkParentWFFolderStatusEdittingFromSelectedRowData),
			this.checkArray(this.checkTypeIsDocumentLink),
		],
		// タグ割当て
		showAssignTag: [
			this.checkOpenedDialog,
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkArray(this.checkTypeIsTag),
		],
		// タグに追加
		assignTag: [
			this.checkParentAuthForCreate,
		],
		// フォルダツリー複製
		folderReplication: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsFolder),
			this.checkArray(this.checkParentWFFolderStatusEditting),
			this.checkParentAuthForCreate,
		],
		// フォルダのみ
		folderOnly: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsFolder),
			this.checkArray(this.checkParentWFFolderStatusEditting),
			this.checkParentAuthForCreate,
		],
		// ドキュメント含む(手動更新リンクとして複製)
		includingDocumentReplicationFixedLink: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsFolder),
			this.checkArray(this.checkParentWFFolderStatusEditting),
			this.checkParentAuthForCreate,
		],
		// ドキュメント含む(公開時更新リンクとして複製)
		includingDocumentReplicationLatestLink: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsFolder),
			this.checkArray(this.checkParentWFFolderStatusEditting),
			this.checkParentAuthForCreate,
		],
		// OCR処理設定
		showOCRSettingUpdator: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsPdfExt),
			this.checkArray(this.checkIsNotPublicForshowOCRSettingUpdator),
			this.checkParentAuthForCreate,
		],
		// OCR処理実行
		executeOCR: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsPdfExt),
			this.checkArray(this.checkNotOcrProcessStatusProcessing),
			this.checkArray(this.checkIsPublicForExecuteOCR),
			this.checkParentAuthForCreate,
		],
		// OCR処理取消
		cancelOCR: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsPdfExt),
			this.checkArray(this.checkNotOcrProcessStatusProcessing),
			this.checkArray(this.checkOcrProcessStatusWait),
			this.checkParentAuthForCreate,
		],
		// 公開ファイル結合
		showPublicFileCombineExecutor: [
			this.checkOpenedDialog,
			this.checkParentSelected,
			this.checkArray(this.checkIsNotGarbageBox),
			this.checkArray(this.checkParentNotTag),
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsPublicWithWorkflow),
			this.checkArray(this.checkIsDspPdfIcon),
			this.checkArray(this.checkParentAuthForCreate),
		],
		// 公開ファイル結合右クリック
		addPublicFileCombine: [
			this.checkParentSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsPublicWithWorkflow),
			this.checkArray(this.checkIsDspPdfIcon),
		],
		// 公開ファイル比較
		showPublicFileCompareExecutor: [
			this.checkOpenedDialog,
			this.checkSelectedCountLessThanTwo,
			this.checkIsNotGarbageBox,
			this.checkArray(this.checkPublicFileCompare),
		],
		// 公開ファイル比較右クリック比較元ドキュメント選択
		sourceDocument: [
			this.checkParentSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsNotGarbageBox,
			this.checkArray(this.checkPublicFileCompare),
		],
		// 公開ファイル比較右クリック比較先ドキュメント選択
		destinationDocument: [
			this.checkParentSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsNotGarbageBox,
			this.checkArray(this.checkPublicFileCompare)
		],
		// 公開ファイルセキュリティ設定
		showPublicFileSecurityUpdater: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkIsPublic),
			this.checkArray(this.checkIsPdfForPublicFileSecuityUpdater),
			this.checkParentAuthForCreate,
		],
		// 署名・暗号化
		showSignAndEncryption: [
			this.checkSelected,
			this.checkArray(this.checkTypeIsNotFolder),
			this.checkArray(this.checkSignAndEncryptedState),
		],
		// 削除
		delete: [
			this.checkSelected,
			this.checkParentNotTag,
			this.checkParentWFFolderStatusEdittingFromSelectedRowData,
			this.checkArray(this.checkTypeIsDocumentOrFolderOrTag),
			this.checkArray(this.checkCanDeleteStatus),
			this.checkParentAuthForCreate,
		],
		// 公開
			showPublic: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkWF),
			this.checkArray(this.checkIsEditWF),
			this.checkArray(this.checkIsNotLock),
			this.checkArray(this.checkIsNotConvertFailedDocument),
			this.checkParentAuthForStatusUp,
			this.checkArray(this.checkPDFConvExecStatusAndRegisteredPrePdf),
		],
		// 承認
		doApprove: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkStatusApprovalRequest),
			this.checkArray(this.checkIsNotConvertFailedDocument),
			this.checkParentAuthForStatusUp,
		],
		// 承認依頼
		showRequestApprove: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkIsEditWF),
			this.checkArray(this.checkIsNotLock),
			this.checkArray(this.checkIsNotConvertFailedDocument),
			this.checkParentAuthForStatusUp,
			this.checkArray(this.checkPDFConvExecStatusAndRegisteredPrePdf),
		],
		// 承認依頼取消
		cancelAproveRequest: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkStatusApprovalRequest),
			this.checkArray(this.checkIsNotLock),
			this.checkParentAuthForStatusUp,
		],
		// 取戻し
		assignRetrieve: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsFolderOrDocument),
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkisConvertFailedDocument),
			this.checkParentAuthForStatusUp,
		],
		// 差替え
		showFileReplacementExecutor: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkisConvertFailedDocument),
			this.checkParentAuthForCreate,
		],
		// 差戻し
		doTakeback: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkStatusApprovalRequest),
			this.checkArray(this.checkStatusNotPublishingProcessFailed),
			this.checkParentAuthForStatusUp,
		],

		// 処理待ち一覧
		assignPending: [],

		// 公開PDFの事前変換
		createPublicPdf: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument), // ドキュメントである
			this.checkArray(this.checkIsPdfConvertFileExt.bind(this)), // ファイル種別がPDF変換対象である
			this.checkArray(this.checkPDFConvExecStatus), // PDF変換失敗状態である、PDF変換処理中である、または原本の更新日時が「PDF変換処理実行日時」以上である
			this.checkArray(this.checkStatusNotPublic), // ステータスが「公開済」ではない
			this.checkArray(this.checkStatusNotProcessingPublic), // ステータスが「公開処理中」ではない
		],

		// 公開PDFの事前設定
		showPreSettingsPublicPdf: [
			this.checkSelected,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkParentAuthForCreate,	// 書き込み権限があるかどうか
			this.checkSelectedNumberIsOne,
			this.checkArray(this.checkIsNotLock),
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsDocument), // ドキュメントである
			this.checkArray(this.checkIsEditWF),	// ステータスが「編集中」かどうか
			this.checkArray(this.checkIsPdfConvertFileExt.bind(this)), // ファイル種別がPDF変換対象である
			this.checkArray(this.checkStatusNotPdfConverting),	// PDF変換中かどうか
		],

		// 公開取消
		showPublicCancel: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkIsNotGarbageBox,
			this.checkArray(this.checkParentNotWFFolderFromSelectedRowData),
			this.checkArray(this.checkTypeIsNotDocumentLink),
			this.checkArray(this.checkTypeIsFolderOrDocument),
			this.checkArray(this.checkWF),
			this.checkArray(this.checkStatusPublic),
			this.checkParentAuthForStatusUp,
		],
		// 検索
		showSearch: [],
		// プロパティ
		showProperty: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkArray(this.checkTypeIsWorkspaceOrDocumentOrFolderOrTag),
		],
		// 回付状況/履歴（ステータスプロパティ）
		showStatusProperty: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkArray(this.checkWF),
		],
		// 改訂履歴
		showRevisionHistory: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkArray(this.checkTypeIsDocument),
		],
		// アクセス履歴
		showAccessHistory: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkArray(this.checkTypeIsDocumentOrFolderOrTag),
		],
		// セキュリティ
		showSecurityChange: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkIsNotGarbageBox,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsWorkspaceOrFolder),
		],
		// テーブル編集
		showTableConfig: [
		],
		// お気に入り一覧
		showFavoriteList: [
		],
		// お気に入りに追加
		addFavorite: [
			this.checkSelected,
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsFolder),
		],
		// チェックアウト一覧
		showCheckoutList: [
		],
		// 公開ファイル比較結果一覧
		showCompareFileList: [],
		// ZIPダウンロード
		download: [
			this.checkSelected,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocumentOrFolderOrTag),
		],
		// ZIPダウンロード
		menuZipDownload: [
			this.checkSelected,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocumentOrFolderOrTag),
		],
		// 公開ファイル ダウンロード
		menuPublicDownload: [
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument),
            this.checkArray(this.checkHavePublicFile.bind(this)),
		],
		// 原本ファイル ダウンロード
		menuPrivateDownload: [
			this.checkSelectedNumberIsOne,
			this.checkParentNotTag,
			this.checkArray(this.checkTypeIsDocument),
            this.checkArray(this.checkIsNotReadOnly),
		],
		//  URLコピー
		menuURLCopy: [
			this.checkSelected,
			this.checkArray(this.checkTypeIsOtherAttribute),
		],
		//  URLショートカット出力
		menuURLShortcutOutput: [
			this.checkSelected,
			this.checkArray(this.checkTypeIsOtherAttribute),
		],
		//  アクセス履歴CSV出力
		menuAccessHistoryCSVOutput: [
			this.checkSelected,
			this.checkArray(this.checkTypeIsDocumentOrFolderOrTag),
		],
		// Boxを表示
		showBox: [
			// チェック無し
		],
	}

	/**
	 * メインメニュー　使用可否バリデータマップ
	 * 配列要素：0...ワークスペース、1...検索、2...回付状況確認、3...属性ツリービュー,4...ワークスペース（タグ選択時）
	 *
	 */
	private validatorMainMenuMap: any = {
		New: [false, true, true, true, true],
		showDocumentCreator: [false, true, true, true, true],
		showFolderCreator: [false, true, true, true, true],
		showTagCreator: [false, true, true, true, true],
		showWorkspaceCreator: [false, true, true, true, true],
		showLumpDocumentCreator: [false, true, true, true, true],
		showCoverCreator: [false, true, true, true, true],

		Edit: [false, true, true, false, false],
		copy: [false, true, true, true, false],
		copyBranch: [false, true, true, true, false],
		cut: [false, true, true, true, true],
		paste: [false, true, true, true, true],
		rename: [false, true, true, false, true],
		pasteFixedLink: [false, true, true, true, true],
		pasteLatestLink: [false, true, true, true, true],
		showLinkUpdator: [false, true, true, false, true],
		updateLatestLink: [false, true, true, true, true],
		showAssignTag: [false, true, true, true, true],
		folderReplication: [false, true, true, true, true],
		folderOnly: [false, true, true, true, true],
		includingDocumentReplicationFixedLink: [false, true, true, true, true],
		includingDocumentReplicationLatestLink: [false, true, true, true, true],
		showOCRSettingUpdator: [false, true, true, true, true],
		executeOCR: [false, true, true, true, true],
		cancelOCR: [false, true, true, true, true],
		showPublicFileCombineExecutor: [false, true, true, true, true],
		showPublicFileCompareExecutor: [false, true, true, true, false],
		showPublicFileSecurityUpdater: [false, true, true, true, true],
		showSignAndEncryption: [false, true, true, true, false],
		delete: [false, true, true, true, true],

		Revision: [false, true, true, true, true],
		checkout: [false, true, true, true, true],
		cancelCheckout: [false, true, true, true, true],
		showCheckin: [false, true, true, true, true],

		showSearch: [false, true, true, false, false],

		ApprovalRelease: [false, true, false, false, false],
		showRequestApprove: [ false, true, true, false, true],
		cancelAproveRequest: [false, true, false, false, true],
		doApprove: [false, true, false, false, true],
		doTakeback: [false, true, false, false, true],
		showPublic: [false, true, true, false, true],
		createPublicPdf: [false, true, false, false, true],
		showPreSettingsPublicPdf: [false, true, false, false, true],
		showPublicCancel: [false, true, false, false, true],
		assignRetrieve: [false, true, false, false, true],
		showFileReplacementExecutor: [false, true, false, false, true],
		assignPending: [false, true, false, false, false],

		Property: [false, false, false, false, false],
		showProperty: [false, false, false, false, false],
		showSecurityChange: [false, false, true, true, true],
		showRevisionHistory: [false, false, false, false, false],
		showAccessHistory: [false, false, false, false, false],
		showStatusProperty: [false, false, false, false, false],

		View: [false, true, true, false, false],
		showTableConfig: [false, true, true, false, false],
		tableMenuItem: [false, false, false, false, false],

		Myspace: [false, true, true, true, false],
		showFavoriteList: [false, true, true, true, false],
		addFavorite: [false, true, false, true, true],
		showCheckoutList: [false, true, true, true, false],
		showCompareFileList: [false, true, true, true, false],

		showBox: [false, true, true, false, false],
	}


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected contentsService: EIMContentsService,
		protected documentFormService: EIMDocumentFormService,
		protected folderService: EIMFolderService,
		protected attrTreeService: EIMAttributeTreeService,
		protected messageService: EIMMessageService,
		protected approveService: EIMApproveService,
		protected contentsTableService: EIMContentsTableService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected fileService: EIMFileService,
		protected workflowservice: EIMWorkflowService,
		protected serverConfigService: EIMServerConfigService,
		protected contentsTreeComponentService: EIMContentsTreeComponentService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected workspaceService: EIMWorkspaceService,
		protected userService: EIMDocumentsUserService,
		protected dateService: EIMDateService,
		protected boxAuthorizationService: EIMBoxAuthorizationService,
		protected boxContentsListComponentService: EIMBoxContentsListComponentService,
		protected authorizationService: EIMBoxAuthorizationService,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,
		protected publicDocumentServie: EIMPublicDocumentService,
        protected publicFileRendererComponentService: EIMPublicFileRendererComponentService,
        protected domainService: EIMDomainService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * メニューに対応したメソッドを実行します.
	 * @param name 実行メソッド名
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 *
	 * @return メソッドを実行したかどうか
	 */
	public invokeMethod(name: string, info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): boolean {
		if (!this.validation(name, info, parentData, selectedData, true)) {
			return false;
		}
		this[name](info, parentData, selectedData);
		return true;
	}

	/**
	 * バリデーションを行います.
	 * @param name バリデーション名
	 * @param info コンポーネント情報
	 * @param parentData 選択データ
	 * @param selectedData 選択データ
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデーション結果
	 */
	public validation(name: string, info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[], displayErrorDialog = false): boolean {
		let parent: any = parentData;
		if (Array.isArray(parentData)) {
			parent = parentData[0];
		}
		let validatorList: any[] = this.validatorMap[name];
		if (!validatorList) {
			return false;
		}
		for (let i = 0; i < validatorList.length; i++) {
			if (!validatorList[i](name, info, parent, selectedData, this.messageService, this.translateService, displayErrorDialog)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * ドキュメント登録ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showDocumentCreator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showDcoumentCreator(
				info.selectedWorkspaceObjId, info.selectedParentObjId, info.addFileList, info.path, null, {
					created: (data: any[]) => {
						this.dialogManagerComponentService.close(dialogId);
						let createdData: EIMCreatedData[] = [];
						for (let i = 0; i < data.length; i++) {
							createdData.push({data: data[i]});
						}
						this.complete(info, {createdData: createdData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00015'))
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
				});
		info.addFileList = [];
	}
	
	/**
	 * ドキュメント登録確認ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showDocumentCreatorConfirmation(
		info: EIMDocumentMainComponentInfo,
		parentData: any,
		selectedData: any[]
	): void {
		let content = [];
		let dialogId: string =
			this.dialogManagerComponentService.showDocumentCreatorConfirmation(
				info.selectedWorkspaceObjId,
				info.selectedParentObjId,
				content,
				info.addFileList,
				info.path,
				{
					created: (data: any[]) => {
						this.dialogManagerComponentService.close(dialogId);
						let createdData: EIMCreatedData[] = [];
						for (let i = 0; i < data.length; i++) {
							createdData.push({ data: data[i] });
						}
						this.complete(
							info,
							{ createdData: createdData },
							this.translateService.instant("EIM_DOCUMENTS.INFO_00015"),
							null,
							null,
							null,
							true
						);
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
				}
			);
		info.addFileList = [];
	}

	/**
	 * フォルダ登録ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showFolderCreator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showFolderCreator(info.selectedWorkspaceObjId, info.selectedParentObjId, info.path, {
			created: (data) => {

				this.dialogManagerComponentService.close(dialogId);

				let createdData: EIMCreatedData[] = [];
				for (let i = 0; i < data.length; i++) {
					createdData.push({data: data[i]});
				}
				this.complete(info, {createdData: createdData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00016'))
			},
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * タグ登録ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showTagCreator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showTagCreator(info.selectedWorkspaceObjId, info.selectedParentObjId, info.path, {
			created: (data) => {

				this.dialogManagerComponentService.close(dialogId);

				let createdData: EIMCreatedData[] = [];
				for (let i = 0; i < data.length; i++) {
					createdData.push({data: data[i]});
				}
				this.complete(info, {createdData: createdData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00031'))
			},
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ワークスペース登録ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showWorkspaceCreator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showWorkspaceCreator(null, {
			created: (data) => {
				this.dialogManagerComponentService.close(dialogId);
				let createdData: EIMCreatedData[] = [{data: data[0]}];
				this.complete(info, {createdData: createdData, isRefleshTree: true}, this.translateService.instant('EIM_DOCUMENTS.INFO_00029'));
			},
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
			}
		});
	}

		/**
	 * ワークスペース編集ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showWorkspaceEditor(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showWorkspaceCreator(parentData.data.objId, {
			updated: (data) => {
				this.dialogManagerComponentService.close(dialogId);
				let updatedData: any[] = [{data: parentData.data}];
				this.complete(info, {updatedData: updatedData, isRefleshTree: true}, this.translateService.instant('EIM_DOCUMENTS.INFO_00030'))
			},
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ワークスペース削除ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showWorkspaceDelete(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00021'), () => {
			this.workspaceService.delete(parentData.data.objId).subscribe(
				(res: any) => {
					this.complete(info, {deletedData: [], isRefleshTree: true}, this.translateService.instant('EIM_DOCUMENTS.INFO_00033'));
				});
		});
	}

	/**
	* ドキュメント一括登録ダイアログを表示します.
	* @param info コンポーネント情報
	* @param parentData 選択データの親データ
	* @param selectedData 選択データ
	*/
   public showLumpDocumentCreator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
	   let dialogId: string = this.dialogManagerComponentService.showLumpDocumentCreator(info.selectedWorkspaceObjId, info.selectedParentObjId, info.path, {
		   created: (data) => {

			   // 1つ前のリビジョンを取得する
			   let idList: any[] = [];
			   for (let i = 0; i < data.updatedData.length; i++) {
				   idList.push(data.updatedData[i].newObjId);
			   }

			   let updateIds: any[] = [];
			   let createIds = data.createdData;
			   if (idList.length > 0) {
				   this.documentFormService.getPreviousObjectList(idList)
				   .pipe(finalize( () => {
					   // 画面クローズ
			   this.dialogManagerComponentService.close(dialogId);
				   })).subscribe((previousDataList: any[]) => {
					   // メイン画面に反映

					   for (let i = 0; i < previousDataList.length; i++) {
						   updateIds.push({objId: previousDataList[i].objId});
					   }
					   let params: any = {createdData: createIds, updatedData: updateIds};

					   let equals = (obj1: any, obj2: any): boolean => {
						   if (obj1.objName === obj2.objName) {
							   return true;
						   } else {
							   return false;
						   }
					   }
					   this.complete(info, params, this.translateService.instant('EIM_DOCUMENTS.INFO_00025'), null, equals );
				   });
			   } else if (createIds) {
				   // 画面クローズ
				   this.dialogManagerComponentService.close(dialogId);
				   let params: any = {createdData: createIds, updatedData: updateIds};
				   let equals = (obj1: any, obj2: any): boolean => {
					   if (obj1.objName === obj2.objName) {
						   return true;
					   } else {
						   return false;
					   }
				   }
				   this.complete(info, params, this.translateService.instant('EIM_DOCUMENTS.INFO_00025'), null, equals );
			   }
		   },
		   errored: () => {
			console.error("エラーが発生しました");
			this.dialogManagerComponentService.close(dialogId);
		   }
	   });
	   info.addFileList = [];
   }

	/**
	 * フォルダアップロード登録ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showLumpFolderCreator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showLumpFolderCreator(info.selectedWorkspaceObjId, info.selectedParentObjId, info.addFileList, info.path, {
			created: (data) => {
				// 1つ前のリビジョンを取得する
				let idList: any[] = [];
				for (let i = 0; i < data.updatedData.length; i++) {
					idList.push(data.updatedData[i].newObjId);
				}

				let updateIds: any[] = [];
				let createIds = data.createdData;
				if (idList.length > 0) {
					this.documentFormService.getPreviousObjectList(idList)
					.pipe(finalize( () => {
						// 画面クローズ
						this.dialogManagerComponentService.close(dialogId);
					})).subscribe((previousDataList: any[]) => {
						// メイン画面に反映

						for (let i = 0; i < previousDataList.length; i++) {
							updateIds.push({objId: previousDataList[i].objId});
						}
						let params: any = {createdData: createIds, updatedData: updateIds};

						let equals = (obj1: any, obj2: any): boolean => {
							if (obj1.objName === obj2.objName) {
								return true;
							} else {
								return false;
							}
						}
						this.complete(info, params, this.translateService.instant('EIM_DOCUMENTS.INFO_00047'), null, equals );
					});
				} else if (createIds) {
					// 画面クローズ
					this.dialogManagerComponentService.close(dialogId);
					let params: any = {createdData: createIds, updatedData: updateIds};
					let equals = (obj1: any, obj2: any): boolean => {
						if (obj1.objName === obj2.objName) {
							return true;
						} else {
							return false;
						}
					}
					this.complete(info, params, this.translateService.instant('EIM_DOCUMENTS.INFO_00047'), null, equals );
				}
			},
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
			}
		});
		
		info.addFileList = [];
	}

	/**
	 * スキャン用表紙登録ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showCoverCreator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showCoverCreator(
				info.selectedWorkspaceObjId, info.selectedParentObjId, info.path, {
					created: (data: any[]) => {
						this.dialogManagerComponentService.close(dialogId);
						let createdData: EIMCreatedData[] = [];
						for (let i = 0; i < data.length; i++) {
							createdData.push({data: data[i]});
						}
						this.complete(info, {createdData: createdData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00015'))
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});
		info.addFileList = [];
	}

	/**
	 * リンク設定ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showLinkUpdator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showLinkUpdator(
			selectedData[0].objId, info.selectedParentObjId, selectedData[0].isDocumentLink, {
					updated: (data) => {
						this.documentFormService.updateObjectLinkSettings(data.objId, data.parentObjId, data.isDocumentLink, data.documentLinkUpdateTiming)
						.subscribe(
							(object: any) => {
								this.dialogManagerComponentService.close(dialogId);
								let updatedData: any[] = [];
								updatedData.push({objId: data.objId, isDocumentLink: 'true'});
								this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00041'));
							}
						);
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});
		info.addFileList = [];
	}


	/**
	 * チェックアウトします.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public checkout(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let objIds: number[] = [];
		selectedData.forEach((data) => {
			objIds.push(data.objId);
		});

		this.documentFormService.checkout(objIds)
		.subscribe(
				(data: any[]) => {
					// 画面更新データ
					let updatedData: any[] = [];
					let createdData: EIMCreatedData[] = [];
					// ダウンロード対象オブジェクトID
					let downloadTargetIds: any[] = [];
					for (let i = 0; i < data.length; i++) {
						// ドキュメントリンクはチェックアウト対象外の前提
						data[i].isDocumentLink = 'false';
						// 画面更新データをセット
						updatedData.push({objId: data[i].objId});
						createdData.push({data: {objId: data[i].revUpObjId}, additionalTarget: data[i]});
						// ダウンロード対象オブジェクトIDをセット
						// リビジョンアップ後のオブジェクトに対してダウンロードすると、チェックアウト取り消し後にダウンロードのアクセス履歴も
						// 削除されてしまうのでチェックアウト元のオブジェクトに対してダウンロードを行う
						downloadTargetIds.push(data[i].objId);
					}

					if (downloadTargetIds.length > 1) {

						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00011'),
							() => {
							// チェックアウトしたファイルをZIPでダウンロード
								this.fileService.downloadZipPrivateDocuments(downloadTargetIds);
								this.complete(info, {updatedData: updatedData, createdData: createdData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00012'));
							},
							() => {
								this.complete(info, {updatedData: updatedData, createdData: createdData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00012'));
							}
						);

					} else {
						// チェックアウトしたファイルをダウンロード
						this.fileService.downloadPrivateDocument(downloadTargetIds[0]);
						this.complete(info, {updatedData: updatedData, createdData: createdData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00012'));
					}

				}
		);

	}

	/**
	 * チェックアウトを取消します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public cancelCheckout(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let objId: number = selectedData[0].objId;
		this.documentFormService.cancelCheckout(objId)
		.subscribe(
				(data: any) => {
					let updatedData: any[] = [];
					let deletedData: any[] = [];
					updatedData.push({objId: data.objId});
					deletedData.push({objId: data.cancelObjId, isDocumentLink: 'false'});
					this.complete(info, {updatedData: updatedData, deletedData: deletedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00013'));
				}
		);

	}


	/**
	 * チェックインダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showCheckin(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let signencr = false;
		// 署名・暗号化済があるか確認
		for (let i = 0; i < selectedData.length; i++) {
			if (selectedData[i].signencr === EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR) {
				signencr = true;
			}
		}
		// 署名・暗号化済のものがあれば削除の確認
		if (signencr) {
			// 確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00034'),
			() => {
				this.checkin(info, parentData, selectedData);
			});
		} else {
			this.checkin(info, parentData, selectedData);
		}
	}

	/**
	 * コピーします.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public copy(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.savePasteSourceObj(info, selectedData, parentData, 'COPY');
	}

	/**
	 * ブランチコピーします.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public copyBranch(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[], isShowMessage = false): void {
		this.contentsService.checkBranchCopy(selectedData[0].objId).subscribe(
			() => {
				this.savePasteSourceObj(info, selectedData, parentData, 'BRANCH_COPY');
				if (isShowMessage) {
					this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00009'));
				}
			}
		);
	}

	/**
	 * 切り取りします.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public cut(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let isError = false;
		for (let i = 0; i < selectedData.length; i++) {
			if (isError) {
				// エラーがある場合は続行しない
				break;
			}
			let data: any = selectedData[i];
			// 切り取りチェック処理
			this.contentsService.checkExistence(data.objId, parentData.objId, true, data.isDocumentLink, true)
			.pipe(finalize(
					() => {

					}))
			.subscribe(
					(result: any) => {

					},
					(err: any) => {
						isError = true;
					},
					() => {

					}
			);
		}

		if (!isError) {
			// 選択したデータ全てにエラーが無い場合、ペースト情報として保存する
			this.savePasteSourceObj(info, selectedData, parentData, 'CUT');
		} else {
			// エラーの場合、ペースト情報を削除する
			this.clearPasteSourceObj(info);
		}

	}

	/**
	 * 貼り付けします.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public paste(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let parentIds: number[] = new Array();
		let pasteTypes: string[] = new Array();
		let isDocumentLinks: boolean[] = new Array();
		let fromParentObjIds: number[] = new Array();
		let originalData: any[] = info.pasteSourceObj.originalData;

		for (let i = 0; i < info.pasteSourceObj.length; i++) {
			parentIds[i] = parentData.objId;
			pasteTypes[i] = info.pasteSourceObj.pasteType;
			isDocumentLinks[i] = info.pasteSourceObj.originalData[i].isDocumentLink;
			fromParentObjIds[i] = info.pasteSourceObj.parentId;
		}

		// 貼り付け処理実行
		this.contentsService.paste(info.pasteSourceObj, parentIds, pasteTypes, isDocumentLinks, fromParentObjIds)
		.subscribe(
				(data: any[]) => {

					let createdData: EIMCreatedData[] = [];
					for (let i = 0; i < data.length; i++) {
						createdData.push({data: data[i]});
					}

					// 画面に反映
					this.complete(info, {createdData: createdData, deletedData: data}, this.translateService.instant('EIM_DOCUMENTS.INFO_00014'));

					// 切り取りの場合
					if (info.pasteSourceObj.pasteType == 'CUT') {
						// フォルダの場合、ツリーから削除を行う
						let target = info.pasteSourceObj.originalData;
						for (let i = 0; i < target.length; i++) {
							if (target[i].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER ||
								target[i].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
								target[i]['targetpath'] = target[i].path;
								let seravice = <EIMContentsTreeComponentService>info.contentsTree.componentService;
								seravice.deleteNodeByPath(info.contentsTree.info, [target[i]]);
							}
						}
						// 保持しているオブジェクト情報をクリア
						this.clearPasteSourceObj(info);
					}
				}
		);

	}

	/**
	 * 名前を変更します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public rename(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let rowIndex: number = info.contentsList.getRowIndex();
		let rowData = info.contentsList.getSelectedData()[0];
		// 表紙ドキュメントの場合
		if (rowData.isCoverForScanning === 'true') {
			let objName: string = rowData.objName;
			// [表紙]-を除外
			let coverString = this.serverConfigService.pdfAutoRegistDocNamePrefix;
			if (objName.indexOf(coverString) === 0) {
				objName = objName.substr(coverString.length);
			}
			// .pdfを除外
			let extension = '.pdf'
			let split = objName.split('.');
			if ('.' + split[split.length - 1] === extension) {
				objName = objName.substr(0, objName.length - extension.length)
			}
			// グリッドの名前を変更
			info.contentsList.info.gridApi.forEachNode( function (node) {
				if (node.data.objId === rowData.objId) {
					if (info.keyDownFlg === true) {
						info.contentsList.stopEditing();
					}
					window.setTimeout(() => {
						node.data.objName = objName;
					});
				}
			});
		}
		window.setTimeout(() => {
			info.contentsList.info.gridApi.setFocusedCell(0, 'objName');
			info.contentsList.info.gridApi.startEditingCell({rowIndex: rowIndex, colKey: 'objName'});
		});
	}

	/**
	 * OCR処理を実行します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public executeOCR(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00019'), () => {
			let ids: number[] = [];
			for (let i = 0; i < selectedData.length; i++) {
				ids.push(selectedData[i].objId);
			}
			this.documentFormService.ocrExecute(ids)
			.subscribe(
				(object: any) => {
					this.complete(info, {updatedData: selectedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00034'));
				}
			);
		});
	}

	/**
	 * OCR処理を取り消します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public cancelOCR(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00020'), () => {
			let ids: number[] = [];
			for (let i = 0; i < selectedData.length; i++) {
				ids.push(selectedData[i].objId);
			}
			this.documentFormService.ocrCancel(ids)
			.subscribe(
				(object: any) => {
					this.complete(info, {updatedData: selectedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00035'));
				}
			);
		});
	}

	/**
	 * 公開ファイル結合ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showPublicFileCombineExecutor(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
			// 有効期限切れドキュメントが存在するかチェック
			let existFlag = false;
			for (let i = 0 ; i < selectedData.length ; i++ ) {
				if (selectedData[i].expiration === 'true') {
					existFlag = true;
					selectedData[i].expirationCheck = true;
				}
			}
			// 権限確認
			let docIds = '';
			let select = [];
			for (let i = 0; i < selectedData.length ; i++ ) {
				select.push(selectedData[i].objId);
			}
			docIds = select.join(',');
			this.contentsService.checkCombineAuthority(docIds, String(info.selectedParentObjId))
			.subscribe(
				(data: any) => {
					if (existFlag) {
						// 有効期限切れドキュメントが存在する場合は警告メッセージを表示します.
						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00022'), () => {
							info.contentsListMenuItems = Object.assign([], info.combineContentsListMenuItems);
							let dialogId =  this.dialogManagerComponentService.showPublicFileCombineExecutor(
							selectedData, info.selectedWorkspaceObjId, info.selectedParentObjId, info.path, {
								executed: (compleatData) => {

									this.dialogManagerComponentService.close(dialogId);
									info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
									this.complete(info, {createdData: compleatData})
									info.changeDialogId('', true);
								},
								errored: () => {
									this.dialogManagerComponentService.close(dialogId);
									info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
									info.changeDialogId('', true);
								},
								closed: () => {
									info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
									info.changeDialogId('', true);
								}
							});
							info.changeDialogId(dialogId, true);
						});
					} else {
						// 有効期限切れドキュメントが存在しない場合は公開ファイル結合ダイアログを表示します.
						info.contentsListMenuItems = Object.assign([], info.combineContentsListMenuItems);
						let dialogId = this.dialogManagerComponentService.showPublicFileCombineExecutor(
							selectedData, info.selectedWorkspaceObjId, info.selectedParentObjId, info.path, {
								executed: (compleatData) => {
									this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_DOCUMENTS.INFO_00027'));
									this.dialogManagerComponentService.close(dialogId);
									info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
									this.complete(info, {createdData: compleatData})
									info.changeDialogId('', true);
								},
								errored: () => {
									this.dialogManagerComponentService.close(dialogId);
									info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
									info.changeDialogId('', true);
								},
								closed: () => {
									info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
									info.changeDialogId('', true);
								}
							}
						);
						info.changeDialogId(dialogId, true);
								}
				},
				(err: any) => {
					return;
				});
	}

	/**
	 * 公開ファイル結合右クリック選択ハンドラ.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public addPublicFileCombine(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		(<EIMPublicFileCombineExecutorComponent>this.dialogManagerComponentService.getView(dialogName.PUBLIC_FILE_COMBINE_EXECUTOR)).addDocuments(selectedData);
	}

	/**
	 * 公開ファイル比較ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showPublicFileCompareExecutor(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		info.contentsListMenuItems = Object.assign([], info.compareContentsListMenuItems);
		let dialogId = this.dialogManagerComponentService.showPublicFileCompareExecutor(selectedData, {
			executed: (res) => {
				this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_DOCUMENTS.INFO_00028'));
				this.dialogManagerComponentService.close(dialogId);
				info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
				info.changeDialogId('', true);
			},
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
				info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
				info.changeDialogId('', true);
			},
			closed: () => {
				info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
				info.changeDialogId('', true);
			}
		});
		info.changeDialogId(dialogId, true);
	}

	/**
	 * 公開ファイル比較右クリック比較元ドキュメント選択ハンドラ.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public sourceDocument(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		(<EIMPublicFileCompareExecutorComponent>this.dialogManagerComponentService.getView(dialogName.PUBLIC_FILE_COMPARE_EXECUTOR)).sourceDocuments(selectedData);
	}

	/**
	 * 公開ファイル比較右クリック比較先ドキュメント選択ハンドラ.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public destinationDocument(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		(<EIMPublicFileCompareExecutorComponent>this.dialogManagerComponentService.getView(dialogName.PUBLIC_FILE_COMPARE_EXECUTOR)).destinationDocuments(selectedData);
	}

	/**
	 * 公開ファイルセキュリティ設定ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showPublicFileSecurityUpdater(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.approveService.getPublicFileSecurity(selectedData[0].objId)
			.subscribe((publicFileSecurity: EIMPublicFileSecurityDomain) => {
				let dialogId: string = this.dialogManagerComponentService.showPublicFileSecurityUpdater(
					true, selectedData[0].objId , publicFileSecurity, {
					executed: (data) => {
					this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_DOCUMENTS.INFO_00026'));
					this.dialogManagerComponentService.close(dialogId);
				},
				errored: () => {
					this.dialogManagerComponentService.close(dialogId);
				}
			});
		});
	}

	/**
	 * タグに追加右クリックドキュメント選択ハンドラ.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public assignTag(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		(<EIMTagAllocationApplicantComponent>this.dialogManagerComponentService.getView(dialogName.TAG_ALLOCATION_APPLICANT)).addDocuments(selectedData);
	}

	/**
	 * 署名・暗号化します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showSignAndEncryption(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let objIds: number[] = [];
		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00035'), () => {
			for (let i = 0; i < selectedData.length; i++) {
				objIds.push(selectedData[i].objId);
			}
			this.contentsService.createSignencrDocument(objIds)
			.subscribe(
				(object: any) => {
					this.complete(info, {updatedData: selectedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00043'));
				}
			);
		});
	}

	/**
	 * 削除します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public delete(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let isFolder: boolean;
		let objIds: number[] = new Array();
		let objNames: number[] = new Array();
		let parentIds: number[] = new Array();
		let isFolders: boolean[] = new Array();
		let isDocumentLinks: boolean[] = new Array();
		let message = '';
		let count = 0;
		let shoedLinkDelete = false;

		selectedData.sort((a, b) => b.objId - a.objId);

		if (selectedData.length === 1) {
			message = this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00008', {value: selectedData[0].objName});
		} else {
			message = this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00007');
		}

		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, message,
			() => {
				for (let i = 0; i < selectedData.length; i++) {
					isFolder = selectedData[i].isDocument === 'true' ? false : true;
					objIds[i] = selectedData[i].objId;
					objNames[i] = selectedData[i].objName;
					parentIds[i] = parentData.objId;
					isFolders[i] = isFolder;
					isDocumentLinks[i] = selectedData[i].isDocumentLink === 'true';
					// ドキュメントリンクか判定
					if (selectedData[i].isDocumentLink === true || selectedData[i].isDocumentLink === 'true') {
						count++
						if (!shoedLinkDelete && count === selectedData.length) {
							// 削除処理呼出し
							this.contentsService.delete(objIds, parentIds, isFolders, isDocumentLinks)
							.subscribe(
								(object: any) => {
									this.complete(info, {deletedData: selectedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00010'));
								}
							);
						}
					} else {
						// ドキュメントリンクを保持しているかチェック
						this.documentFormService.actCheckHasDocLinkService(isFolder , Number(selectedData[i].objId))
						.subscribe((data: any) => {
							if (data.isHasFirstVersionDocLink === true || data.isHasFirstVersionDocLink === 'true') {
								shoedLinkDelete = true;
								// 保持していた場合ドキュメントリンク削除確認ダイアログを表示
								// フォルダの場合
								if (isFolder) {
									count++;
									this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00032',
									{value: selectedData[i].objName}), () => {
										if (count === selectedData.length) {
											// 削除処理呼出し
											this.contentsService.delete(objIds, parentIds, isFolders, isDocumentLinks)
											.subscribe(
												(object: any) => {
													this.complete(info, {deletedData: selectedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00010'));
												}
											);
										}
									});
								// ドキュメントの場合
								} else {
									count++;
									this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00031',
									{value: selectedData[i].objName}), () => {
										if (count === selectedData.length) {
											// 削除処理呼出し
											this.contentsService.delete(objIds, parentIds, isFolders, isDocumentLinks)
											.subscribe(
												(object: any) => {
													this.complete(info, {deletedData: selectedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00010'));
												}
											);
										}
									});
								}
							// 保持していない場合
							} else {
								count++;
								if (!shoedLinkDelete && count === selectedData.length) {
									// 削除処理呼出し
									this.contentsService.delete(objIds, parentIds, isFolders, isDocumentLinks)
									.subscribe(
										(object: any) => {
											this.complete(info, {deletedData: selectedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00010'));
										}
									);
								}
							}
						});
					}
				}
		});
	}

	/**
	 * 公開ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showPublic(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showPublic(
				selectedData,
				info.selectedWorkspaceObjId,
				{
					executed: (data) => {
						// 過去全てのリビジョンを取得する
						let idList: any[] = [];
						for (let i = 0; i < selectedData.length; i++) {
							idList.push(selectedData[i].objId);
						}

						if (idList.length > 0) {
							this.documentFormService.getPreviousAllObjectList(idList)
							.pipe(finalize(() => {
								// 画面クローズ
								this.dialogManagerComponentService.close(dialogId);
							}))
							.subscribe(previousDataList => {
								// メイン画面に反映
								let updateIds: any[] = [];
								let deleteIds: any[] = [];
								for (const id of idList) {
									const objId = Number(id);
									updateIds.push({objId: objId.toString(), isDocumentLink: 'false'});
									const previousObjIdList = previousDataList.get(objId);
									if (previousObjIdList) {
										previousObjIdList.forEach((previousObjId, index) => {
											if (index === previousObjIdList.length - 1) {
												// 直前のリビジョンの実体、ドキュメントリンクを更新
												updateIds.push({objId: previousObjId.toString(), isDocumentLink: 'false', isRevUpTask: 'true'});
												updateIds.push({objId: previousObjId.toString(), isDocumentLink: 'true'});
											} else {
												// それ以前のリビジョンのドキュメントリンクを更新
												updateIds.push({objId: previousObjId.toString(), isDocumentLink: 'true'});
											}
										});
									}
								}

								let params: any = {createdData: null, updatedData: updateIds, deletedData: deleteIds};
								this.complete(info, params, this.translateService.instant('EIM_DOCUMENTS.INFO_00017'), false, null, true);
							});
						} else {
							// 画面クローズ
							this.dialogManagerComponentService.close(dialogId);
						}
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
					onNodeSelect: (data) => {
						this.onSelect.next(data);
					},
				}
		);

	}

	/**
	 * 承認押下により承認ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doApprove(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		info.functionType = EIMConstantService.EVENT_FUNCTION_TYPE_APPROVE;
		this.showApprove(info, parentData, selectedData);
	}

	/**
	 * 差戻し押下により承認ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public doTakeback(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		info.functionType = EIMConstantService.EVENT_FUNCTION_TYPE_BACK;
		this.showApprove(info, parentData, selectedData);
	}


	/**
	 * 承認ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showApprove(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showApprove(
				info.functionType,
				selectedData,
				info.selectedWorkspaceObjId,
				{
					changeProperty: (data) => {
							this.showProperty(info, parentData, data.selectedData);
					},
					noRequest: () => {
						this.dialogManagerComponentService.close(dialogId);
						this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_DOCUMENTS.INFO_00004'))
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
					executed: (data) => {
						// 過去全てのリビジョンを取得する
						let idList: any[] = [];
						let finalApproveList: any[] = [];
							for (let j = 0; j < data.length; j++) {
								idList.push(data[j].objId);
								if (data[j].finalApprove) {
									finalApproveList.push(data[j].objId);
								}
							}
						if (idList.length > 0) {
							this.documentFormService.getPreviousAllObjectList(idList)
							.pipe(finalize(() => {
								// 画面クローズ
								this.dialogManagerComponentService.close(dialogId);
							}))
							.subscribe(previousDataList => {
								// メイン画面に反映
								let updateIds: any[] = [];
								let deleteIds: any[] = [];
								for (const id of idList) {
									const objId = Number(id);
									updateIds.push({objId: objId.toString(), isDocumentLink: 'false'});
									const previousObjIdList = previousDataList.get(objId);
									if (previousObjIdList) {
										previousObjIdList.forEach((previousObjId, index) => {
											if (index === previousObjIdList.length - 1) {
												// 直前のリビジョンの実体、ドキュメントリンクを更新
												updateIds.push({objId: previousObjId.toString(), isDocumentLink: 'false', isRevUpTask: 'true'});
												updateIds.push({objId: previousObjId.toString(), isDocumentLink: 'true'});
											} else {
												// それ以前のリビジョンのドキュメントリンクを更新
												updateIds.push({objId: previousObjId.toString(), isDocumentLink: 'true'});
											}
										});
									}
								}

								let params: any = {createdData: null, updatedData: updateIds, deletedData: deleteIds};
								if (data.length > 0) {
									// ワークスペース未選択時はメッセージのみ
									if (!info.selectedParentObjId) {
										this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00023'));
									} else {
										this.complete(info, params, this.translateService.instant('EIM_DOCUMENTS.INFO_00023'));
									}
								}
							});
						} else {
							// 画面クローズ
							this.dialogManagerComponentService.close(dialogId);
						}
					},
					closed: (list) => {
						if (list) {
							let updatedDataList = [];
							for (let i = 0; i < list.length; i++) {
								updatedDataList.push(list[i]);
							}
							this.complete(info, {createdData: null, updatedData: updatedDataList, deletedData: null});
						}
					},
					onNodeSelect: (data) => {
						this.onSelect.next(data);
					},
				}
		);
	}


	/**
	 * 承認依頼ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showRequestApprove(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showApproveRequest(
				selectedData,
				info.selectedWorkspaceObjId,
				{
					changeProperty: (data) => {
						this.showProperty(info, parentData, data.selectedData);
					},
					executed: (data) => {

						// 1つ前のリビジョンを取得する
						let idList: any[] = [];
						for (let i = 0; i < selectedData.length; i++) {
							idList.push(selectedData[i].objId);
						}

						if (idList.length > 0) {
							this.documentFormService.getPreviousObjectList(idList)
							.pipe(finalize( () => {
								// 画面クローズ
								this.dialogManagerComponentService.close(dialogId);
							}))
							.subscribe( (previousDataList: any[]) => {
								// メイン画面に反映
								let updateIds: any[] = [];
								for (let i = 0; i < previousDataList.length; i++) {
									updateIds.push({objId: previousDataList[i].objId});
								}
								if (data.length > 0) {
								let params: any = {createdData: null, updatedData: updateIds};
									this.complete(info, params, this.translateService.instant('EIM_DOCUMENTS.INFO_00022'));
								}
							});
						} else {
							// 画面クローズ
							this.dialogManagerComponentService.close(dialogId);
						}

					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
					onNodeSelect: (data) => {
						this.onSelect.next(data);
					},
				}
		);
	}

	/**
	 * 依頼取消を実行します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public cancelAproveRequest(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00012'),
				() => {
					for (let i = 0; i < selectedData.length; i++) {
						this.approveService.getByContentsId(selectedData[i].objId, null)
						.subscribe((object: EIMApproveDocumentDTO) => {

							let immediateMailTypeId: number;
							let nothingMailTypeId: number;
							if (Number(object.sendingBackAndRegainingMail) === Number(EIMConstantService.MAIL_SENDING_ON)) {
								immediateMailTypeId = EIMConstantService.MAIL_TYPE_ID_CANCEL_REQ_APPROVE;
							} else {
								nothingMailTypeId = EIMConstantService.MAIL_TYPE_ID_CANCEL_REQ_APPROVE;
							}

								let event: EIMWorkflowEvent = {
										objId: object.objId,
										forcastStatusTypeId: object.forcastStatusTypeId,
										statusMDateLong: object.statusMDateLong,
										baseEventTypeId: EIMConstantService.BASE_EVENT_TYPE_ID_CANCEL_REQ_APPROVE,
										immediateMailTypeId: immediateMailTypeId,
										nothingMailTypeId: nothingMailTypeId,
								};
								this.workflowservice.doEvent(event).subscribe((result) => {
								let updatedData: any[] = [];
								updatedData.push({objId: object.objId});
								this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00019'));
								} );
						} );
					}
				}
		);
	}

	/**
	 * 取戻しを実行します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public assignRetrieve(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.approveService.getByContentsId(selectedData[0].objId, 'takeback')
		.subscribe((object: EIMApproveDocumentDTO) => {
						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00016'),
								() => {
								let event: EIMWorkflowEvent = {
										objId: object.objId,
										forcastStatusTypeId: object.forcastStatusTypeId,
										statusMDateLong: object.statusMDateLong,
										baseEventTypeId: EIMConstantService.BASE_EVENT_TYPE_ID_TAKE_BACK,
								};
								this.workflowservice.doEvent(event).subscribe((result) => {
								let updatedData: any[] = [];
								updatedData.push({objId: object.objId});
								this.complete(info, {updatedData: updatedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00021'));
								} );
						} );
				}
		);
	}

	/**
	 * 差替えを実行します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showFileReplacementExecutor(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let signencr = false;
		// 署名・暗号化済があるか確認
		for (let i = 0; i < selectedData.length; i++) {
			if (selectedData[i].signencr === EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR) {
				signencr = true;
			}
		}
		// 署名・暗号化済のものがあれば削除の確認
		if (signencr) {
			// 確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00034'),
			() => {
				let dialogId: string = this.dialogManagerComponentService.showFileReplacementExecutor(info.selectedParentObjId, selectedData[0],
					{
						executed: (data: any) => {
							// 画面を閉じる
							this.dialogManagerComponentService.close(dialogId);
							this.complete(info, {updatedData: data}, this.translateService.instant('EIM_DOCUMENTS.INFO_00024'));
						},
						errored: (data: any) => {
							// 画面を閉じる
							this.dialogManagerComponentService.close(dialogId);
						}
					});
			});
		} else {
			let dialogId: string = this.dialogManagerComponentService.showFileReplacementExecutor(info.selectedParentObjId, selectedData[0],
				{
					executed: (data: any) => {
						// 画面を閉じる
						this.dialogManagerComponentService.close(dialogId);
						this.complete(info, {updatedData: data}, this.translateService.instant('EIM_DOCUMENTS.INFO_00024'));
					},
					errored: (data: any) => {
						// 画面を閉じる
						this.dialogManagerComponentService.close(dialogId);
					}
				});
		}
		info.addFileList = [];
	}

	/**
	 * 処理待ち一覧を表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public assignPending(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		info.functionType = EIMConstantService.EVENT_FUNCTION_TYPE_WAIT;
		this.showApprove(info , null , [] );
	}

	/**
	 * 公開PDFの事前変換を実行します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public createPublicPdf(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let ids: number[] = [];
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00039'), () => {
			for(let i = 0; i < selectedData.length; i++){
				ids.push(selectedData[i].objId);
			}
			this.publicDocumentServie.createPublicPdf(ids)
				.subscribe((data: any) => {
					this.complete(info, {updatedData: selectedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00044'));
				})
		});

	}

		/**
	 * 公開PDFの事前設定を実行します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
		 public showPreSettingsPublicPdf(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
			let signencr = false;
			// 署名・暗号化済があるか確認
			for (let i = 0; i < selectedData.length; i++) {
				if (selectedData[i].signencr === EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR) {
					signencr = true;
				}
			}
			// 署名・暗号化済のものがあれば削除の確認
			if (signencr) {
				// 確認ダイアログ
				this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00034'),
				() => {
					let dialogId: string = this.dialogManagerComponentService.showPreSettingsPublicPdf(info.selectedParentObjId, selectedData[0],
						{
							executed: (data: any) => {
								// 画面を閉じる
								this.dialogManagerComponentService.close(dialogId);
								this.complete(info, {updatedData: data}, this.translateService.instant('EIM_DOCUMENTS.INFO_00046'));
							},
							errored: (data: any) => {
								// 画面を閉じる
								this.dialogManagerComponentService.close(dialogId);
							}
						});
				});
			} else {
				let dialogId: string = this.dialogManagerComponentService.showPreSettingsPublicPdf(info.selectedParentObjId, selectedData[0],
					{
						executed: (data: any) => {
							// 画面を閉じる
							this.dialogManagerComponentService.close(dialogId);
							this.complete(info, {updatedData: data}, this.translateService.instant('EIM_DOCUMENTS.INFO_00046'));
						},
						errored: (data: any) => {
							// 画面を閉じる
							this.dialogManagerComponentService.close(dialogId);
						}
					});
			}
			info.addFileList = [];
		}

	/**
	 * 公開取消を実行します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showPublicCancel(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showContentsPublicCancelExecutor(
				selectedData,
				{

					executed: (data) => {
						// 1つ前のリビジョンを取得する
						let idList: any[] = [];
						for (let i = 0; i < selectedData.length; i++) {
							idList.push(selectedData[i].objId);
						}
						if (idList.length > 0) {
							this.documentFormService.getPreviousObjectList(idList)
							.pipe(finalize(() => {
								// 画面クローズ
								this.dialogManagerComponentService.close(dialogId);
							}))
							.subscribe( (previousDataList: any[]) => {
								// メイン画面に反映
								let updateIds: any[] = [];
								let createdData: any[] = [];
								let deletedData: any[] = [];
								for (let i = 0; i < previousDataList.length; i++) {
									if (previousDataList[i].objId == previousDataList[i].previousObjId) {
										updateIds.push({objId: previousDataList[i].objId});
										deletedData.push({objId: previousDataList[i].objId, isDocumentLink: 'true'});
									} else {
										createdData.push({data: {objId: previousDataList[i].previousObjId}, additionalTarget: data[i]});
										updateIds.push({objId: previousDataList[i].objId});
										deletedData.push({objId: previousDataList[i].objId, isDocumentLink: 'true'});
									}
								}
								let params: any = {createdData: createdData, updatedData: updateIds, deletedData: deletedData};
								this.complete(info, params, this.translateService.instant('EIM_DOCUMENTS.INFO_00020'), true, null, true);
							});
						} else {
							// 画面クローズ
							this.dialogManagerComponentService.close(dialogId);
						}
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});
		}

  	/**
	 * 検索アコーディオンを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
  public showSearch(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
    info.onChangeAccordionTab({index: accordionIndex.SEARCH});
  }

	/**
	 * プロパティダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showProperty(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		// 選択行が属性の場合、プロパティ画面を表示しない
		if (selectedData[0].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE) {
			return;
		}

		let disabled = false;
		// 読み取りのみの場合は更新不可
		if (selectedData[0].readOnly == 'true') {
			disabled = true;
		}
		// ドキュメントリンク場合は更新不可
		if (selectedData[0].isDocumentLink == 'true') {
			disabled = true;
		}
		// 過去履歴の場合は更新不可
		if (selectedData[0].isOldVer && (selectedData[0].isOldVer === true || selectedData[0].isOldVer === 'true')) {
			disabled = true;
		}
		if (selectedData[0].isLatest === false) {
			disabled = true;
		}

		let dialogId: string = this.dialogManagerComponentService.showProperty(selectedData[0], disabled,
				{
					updated: (data) => {
						this.dialogManagerComponentService.close(dialogId);
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
				});
	}

	/**
	 * ステータスプロパティダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showStatusProperty(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let getWorkflowFolder = ((param: any) => {
			if (param.isWorkflowFolder === 'true') {
				return param;
			} else if (param.parent) {
				return getWorkflowFolder(param.parent);
			} else {
				return null;
			}
		});

		let target;
		switch (info.accordionActiveIndex) {
			case 0:
				target = getWorkflowFolder(parentData);
				break;
			case 3:
				if (selectedData[0].higherWFFolder !== '') {
					target = {objId: selectedData[0].higherWFFolder};
				}
				break;
			default:
				break;
		}

		if (!target) {
			target = selectedData[0];
		}

		let dialogId: string = this.dialogManagerComponentService.showContentsStatusProperty(target,
				{
					errored: (data: any) => {
						// 画面を閉じる
						this.dialogManagerComponentService.close(dialogId);
					}
				}
		);
	}

	/**
	 * 改訂履歴ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showRevisionHistory(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showRevisionHistory(selectedData[0],
				{
					copyRevision: (data) => {
						this.copyBranch(info, parentData, [data], true);
					},
					updated: (updatedData) => {
						if (updatedData.length > 0) {
							this.complete(info, {createdData: updatedData[0].createdData, deletedData: updatedData[0].deletedData});
						}
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
		});
	}

	/**
	 * アクセス履歴ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showAccessHistory(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showAccessHistory(selectedData[0],
				{
					errored: (data: any) => {
						// 画面を閉じる
						this.dialogManagerComponentService.close(dialogId);
					}
				}
		);
	}

	/**
	 * OCR処理設定画面を表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showOCRSettingUpdator(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showOCRSettingUpdator(selectedData,
				{
					updated: (data: any) => {
						// 画面を閉じる
						this.complete(info, {updatedData: data}, this.translateService.instant('EIM_DOCUMENTS.INFO_00032'));
						this.dialogManagerComponentService.close(dialogId);
					},
					errored: (data: any) => {
						// 画面を閉じる
						this.dialogManagerComponentService.close(dialogId);
					}
				}
		);
	}

	/**
	 * セキュリティ変更ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showSecurityChange(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let dialogId: string = this.dialogManagerComponentService.showSecurityChange(selectedData[0],
				{
					applied: (data) => {
						this.dialogManagerComponentService.close(dialogId);
					},
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					}
				});
	}

	/**
	 * テーブル管理ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showTableConfig(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showTableConfig(
				{
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
					closed: () => {
						if (this.contentsTableService.isReservingUpdate) {
							this.contentsTableService.doUpdateTable();
						}
					},
				}
		);
	}

	/**
	 * お気に入り一覧ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showFavoriteList(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showFavoriteList(
				{
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
					onNodeSelect: (data) => {
						if (info.accordionActiveIndex !== 0) {
							info.onChangeAccordionTab({index: 0});
					}
						this.onSelect.next(data);
					},
				}
		);
	}

	/**
	 * チェックアウト一覧ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showCheckoutList(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showCheckoutList(
				{
					errored: () => {
							this.dialogManagerComponentService.close(dialogId);
						}
				}
		);
	}

	/**
	 * 公開ファイル比較結果一覧ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showCompareFileList(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showCompareFileList(
				{
					errored: () => {
						this.dialogManagerComponentService.close(dialogId);
					},
				}
		);
	}

	/**
	 * タグ割当ダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showAssignTag(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		// 右クリックメニューを置き換える
		info.contentsListMenuItems = Object.assign([], info.tagContextMenuItems);
		// タグ割当ダイアログを表示する
		let dialogId = this.dialogManagerComponentService.showAssignTag(
		selectedData[0], info.selectedWorkspaceObjId, info.selectedParentObjId, info.path, {
			applied: (data) => {
				this.dialogManagerComponentService.close(dialogId);
				this.complete(info, {updatedData: data}, this.translateService.instant('EIM_DOCUMENTS.INFO_00037'));
			},
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
				info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
				info.changeDialogId('', true);
			},
			closed: () => {
				window.setTimeout(() => {
					info.contentsListMenuItems = Object.assign([], info.normalContentsListMenuItems);
					info.changeDialogId('', true);
				});
			},
			contentsAccess: () => {
				// 右クリックメニューを置き換える
				info.contentsListMenuItems = Object.assign([], info.tagContextMenuItems);
			}
		});
		info.changeDialogId(dialogId, true);
	}

	/**
	 * DB取得データをノード情報に変換します.
	 * @param folder フォルダ
	 * @return フォルダノード
	 */
	public convertToEIMFolderTreeNode(folder: EIMFolder): EIMFolderTreeNode {

		let getIcon: (any) => string = (node) => {
			if (node.objTypeName == EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE) {
				return 'eim-doc-icon-workspace eim-doc-icon-workspace-color';
			}
			/*
			if (node.objTypeName == "タグ") {
				return 'eim-icon-tag eim-icon-tag-color';
			}
			*/
			if (node.objTypeName == EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
				return 'eim-icon-folder eim-icon-folder-color';
			}
			return 'eim-icon-trush eim-icon-trush-color';
		};

		let icon: string = 'fa-fw ' + getIcon(folder);
		let tn: EIMFolderTreeNode = {
			label: folder.objName,
			data: folder,
			expandedIcon: icon,
			collapsedIcon: icon,
			leaf: false,
			children: [],
			objId: Number(folder.objId),
			objTypeId: Number(folder.objTypeId),
			objTypeName: folder.objTypeName,
			isWorkflowFolder: folder.isWorkflowFolder,
			isBranch: true,
			isSearch: false,
			tagListKind: folder.tagListKind
		};

		return tn;
	}

	/**
	 * Privateファイルをダウンロードする
	 * @param objid オブジェクトID
	 */
	public downloadPrivateFile(objId: number): void {
		this.fileService.downloadPrivateLatestDocument(objId);
	}

	/**
	 * Publicファイルをダウンロードする
	 * @param objid オブジェクトID
	 */
	public downloadPublicFile(objId: number): void {
		this.fileService.downloadPublicLatestDocument(objId);
	}

	/**
	 * 選択された行データを各サービスに連携する
	 * @param selectedData 選択された行データ
	 */
	public selectedContensHandler(selectedData: any[]): void {
		this.boxContentsListComponentService.setSelectedContents(selectedData);
	}

	/**
	 * メインメニューの使用可否をMAPから取得する
	 * @param name メニュー名
	 * @param id 画面状態の番号
	 * @param parentsName 親メニュー名リスト
	 */
	public isUnavailableMenu(name: string, id: number, parentNames?: string[]): boolean {
		let validatorList: any[] = this.validatorMainMenuMap[name];
		if (!validatorList) {
			if (parentNames && parentNames.length) {
				return this.isUnavailableMenu(parentNames[parentNames.length - 1], id, parentNames.slice(0, parentNames.length - 1));
			}
			return true;
		}
		return validatorList[id];
	}

	/**
	 * リンク貼付け（版固定/手動）
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public pasteFixedLink(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.pasteLink(info, parentData, selectedData, 0);
	}

	/**
	 * リンク貼付け（最新版/自動）
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public pasteLatestLink(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.pasteLink(info, parentData, selectedData, 1);
	}

	/**
	 * リンク更新（最新リビジョン）
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public updateLatestLink(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.contentsService.actUpdateObjectLink(selectedData, parentData.data.objId).subscribe((data) => {

			let createdData = data.concat();
			let deletedData = selectedData.concat();
			let spliceCount = 0;

			// オブジェクトIDが変わらない場合、更新なしとする
			for (let i = 0; i < selectedData.length; i++) {
				createdData[i].isDocumentLink = 'true';
				createdData[i].additionalTarget = {objId: createdData[i].objId, isDocumentLink: 'false'};
				deletedData[i].isDocumentLink = 'true';

				for (let j = 0; j < data.length; j++) {
					if (selectedData[i].objId === data[j].objId) {
						createdData.splice(j - spliceCount, 1);
						deletedData.splice(i - spliceCount, 1);
						spliceCount++;
						break;
					}
				}
			}

			this.complete(info, {createdData: createdData, deletedData: deletedData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00040'));
		});
	}

	/**
	 * フォルダのみ
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public folderOnly(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.actDuplicateFolderTree(info, selectedData[0].objId, 0, false);
	}

	/**
	 * ドキュメント含む(手動更新リンクとして複製)
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public includingDocumentReplicationFixedLink(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.actDuplicateFolderTree(info, selectedData[0].objId, 0, true);
	}

	/**
	 * ドキュメント含む(公開時更新リンクとして複製)
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public includingDocumentReplicationLatestLink(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.actDuplicateFolderTree(info, selectedData[0].objId, 1, true);
	}

	/**
	 * お気に入りに追加
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public addFavorite(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		this.userService.createFavorite(selectedData[0].objId).subscribe(() => {
			this.complete(info, {createdData: [selectedData[0].objId]}, this.translateService.instant('EIM_DOCUMENTS.INFO_00038', {value: selectedData[0].objName}));
		});
	}

	/**
	 * ZIPダウンロード
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public menuZipDownload(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let objIds: number[] = [];
		let docLinks: string[] = [];
		for (let i = 0; i < selectedData.length; i++) {
			objIds.push(Number(selectedData[i].objId));
			docLinks.push(selectedData[i].isDocumentLink);
		}
		// ZIPダウンロード対象取得
		this.documentFormService.urlRequest(objIds)
			.subscribe(
				(res: any) => {
					// ZIPダウンロード実行
					this.documentFormService.zipDownloadExecute(objIds, docLinks, false).subscribe(() => {
						this.fileService.downloadZipMixedDocuments(objIds, docLinks, false);
					});
				},
			);
	}

	/**
	 * 公開ファイルダウンロード
	 * @param info コンポーネント情報
	 * @param parentData 選択	データの親データ
	 * @param selectedData 選択データ
	 */
	public menuPublicDownload(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		// ZIPダウンロード対象取得
		if(selectedData.length === 1){
			const objId = Number(selectedData[0].objId)
			this.fileService.downloadPublicDocument(objId);
		}
	}

	/**
	 * 原本ファイルダウンロード
	 * @param info コンポーネント情報
	 * @param parentData 選択	データの親データ
	 * @param selectedData 選択データ
	 */
	public menuPrivateDownload(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		// ZIPダウンロード対象取得
		if(selectedData.length === 1){
			const objId = Number(selectedData[0].objId)
			this.fileService.downloadPrivateDocument(objId);
		}
	}

	/**
	 * URLコピー
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public menuURLCopy(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		// URL取得
		let origin: string = window.location.origin;
		let pathname: string = window.location.pathname; // /eim/client/
		let path = info.path;
		let docAccessUrl = '';
		for (let i = 0; i < selectedData.length; i++) {
			let valueUrl: string;
			if ( selectedData[i].isDocument === 'true') {
				valueUrl = origin + pathname + '#/documents' + '/login' + '?objId=' + selectedData[i].objId + '&';
			} else {
				valueUrl = origin + pathname + '#/documents' + '/login' + '?objId=' + selectedData[i].objId + '&isFolder=true';
			}
			let objName = selectedData[i].objName;
			let url: string;
			// ドキュメントアクセスURLクリップボード出力設定が'出力する'の場合
			if (this.serverConfigService.docAccessUrlPathFlg === true) {
				url = path + objName + '\r\n' + valueUrl;
			} else {
				url = valueUrl;
			}
			if ( i === selectedData.length - 1 ) {
				docAccessUrl = docAccessUrl + url;
			} else {
				docAccessUrl = docAccessUrl + url + '\r\n';
			}
		}
		// クリップボードにコピー
		let copyForm = document.createElement('textarea');
		copyForm.textContent = docAccessUrl;
		let bodyElm = document.getElementsByTagName('body')[0];
		bodyElm.appendChild(copyForm);
		copyForm.select();
		document.execCommand('copy');
		bodyElm.removeChild(copyForm);
	}

	/**
	 * URLショートカット出力
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public menuURLShortcutOutput(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let origin: string = window.location.origin;
		let pathname: string = window.location.pathname; // /eim/client/
		let objNameList = [];
		let urlList = [];
		for (let i = 0; i < selectedData.length; i++) {
			// URL取得
			let addUrl = '';
			if (selectedData[i].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG
				|| selectedData[i].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
					addUrl = 'isFolder=true'
			}
			let valueUrl = origin + pathname + '#/documents' + '/login' + '?objId=' + selectedData[i].objId + '&' + addUrl;
			urlList.push(valueUrl);
			objNameList.push(selectedData[i].objName);
		}
		// ダウンロード実行
		this.fileService.downLoadUrlLinkFile(objNameList, urlList , 1);
	}

	/**
	 * アクセス履歴CSV出力
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public menuAccessHistoryCSVOutput(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {

		let param = [];
		for (let i = 0; i < selectedData.length; i++) {
			param.push({objId: selectedData[i].objId, objName: selectedData[i].objName});
		}

		this.fileService.downloadAccHistCSVFile(param);
	}

	/**
	 * Boxを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	public showBox(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		if (info.isDisplayingBox) {
			// Box領域を表示→非表示
			info.isDisplayingBox = false;

			// ラベルをBox表示に変更
			const menulistView = info.mainMenuItems.find(item => item.name === 'View');
			const menuItemShowBox = menulistView.items.find(item => item.name === 'showBox');
			menuItemShowBox.label = this.translateService.instant('EIM_DOCUMENTS.LABEL_03124');
			this.documentSessionStorageService.updateBoxAreaState({isDisplayingBox: info.isDisplayingBox});
			info.contentsList.redrawRows();

		} else {
			// Box領域を非表示→表示
			this.authorizationService.useEnterpriseAccount().subscribe(
				() => {
					info.isDisplayingBox = true;
					info.selectedDataForBox = selectedData;

					// ラベルをBox非表示に変更
					const menulistView = info.mainMenuItems.find(item => item.name === 'View');
					const menuItemShowBox = menulistView.items.find(item => item.name === 'showBox');
					menuItemShowBox.label = this.translateService.instant('EIM_DOCUMENTS.LABEL_03123');
					this.documentSessionStorageService.updateBoxAreaState({isDisplayingBox: info.isDisplayingBox});
					info.contentsList.redrawRows();
				}
			);
		}
	}

	/**
	 * 追加・更新・削除の完了イベントハンドラ
	 * @param info コンポーネント情報
	 * @param completeData 追加・更新・削除のデータ情報
	 * @param completeMessage 完了メッセージ
	 * @param createUponFlag データ作成位置変更フラグ
	 */
	public complete(info: EIMDocumentMainComponentInfo, completeData: EIMCompleteData, completeMessage?: string, createUponFlag?: boolean, equlsMethod?: any, noSelectFlag?: boolean, boxDocumentRegisterFlag?: boolean, lumpDocumentRegisterFlag?: boolean): void {
		let parentObjId: number = Number(info.selectedParentObjId);
		let tagObjIds: number[] = this.convertTagIds(info.selectedParent);
		if (!completeData.createdData && !completeData.updatedData && !completeData.deletedData) {
			// 全てnullの場合、リフレッシュする
			this.folderService.getChildObjects(parentObjId, [], false)
				.subscribe(
						(objectList: any) => {
							let params = {
								info: info,
								createUponFlag: false,
								objectList: objectList,
							};
							info.onComplete(params);
						}
				);
			return;
		}

		// ワークスペース登録/更新の場合、対象ワークスペースを選択対象としてリフレッシュする
		if (info.accordionActiveIndex === 0 && completeData.isRefleshTree) {
			let wsId: number;
			// 対象のワークスペースIDを取得
			if (completeData.createdData && completeData.createdData[0].data) {
				wsId = completeData.createdData[0].data.objId
			} else if (completeData.updatedData && completeData.updatedData[0].data) {
				wsId = completeData.updatedData[0].data.objId
			} else {
				// ワークスペース削除の場合は一番上を選択対象としてリフレッシュする
				wsId = null;
			}
			this.contentsTreeComponentService.updateLatest(info.contentsTree.info, wsId, [], info.contentsTree.initialized, info.contentsTree.selected);
			if (completeMessage) {
				this.messageService.showGrowl(completeMessage);
			}
			return;
		}

		// データ操作したコンテンツを取得する
		let objIdSet: any = Object.assign({},
				this.createObjIdSet(completeData.createdData),
				this.createObjIdSet(completeData.updatedData),
				this.createObjIdSet(completeData.deletedData),
				);

		if (info.accordionActiveIndex === 0) {
			this.folderService.getChildObjectsByIds(parentObjId, tagObjIds, Object.keys(objIdSet).map(Number)).subscribe((data: any[]) => {
				let createdData: any[] = this.getContentsList(data, completeData.createdData);
				let updatedData: any[] = this.getContentsList(data, completeData.updatedData);
				let orgDeletedLinkData: any[] = this.getContentsList(data, completeData.deletedData);	// リンク元が論理削除されたリンクデータ

				// 更新対象データを取得できなかった場合、そのデータは存在しないので削除データとする
				if (completeData.updatedData) {
					for (let i = 0; i < completeData.updatedData.length; i++) {
						let isFind = false;
						for (let j = 0; j < updatedData.length; j++) {
							if (completeData.updatedData[i].objId == updatedData[j].objId) {
								const isDocLink1 = completeData.updatedData[i].hasOwnProperty('isDocumentLink') &&
									(completeData.updatedData[i].isDocumentLink === true || completeData.updatedData[i].isDocumentLink === 'true');
								const isDocLink2 = updatedData[j].hasOwnProperty('isDocumentLink') &&
									(updatedData[j].isDocumentLink === true || updatedData[j].isDocumentLink === 'true');
								if (isDocLink1 === isDocLink2) {
									isFind = true;
									break;
								}
							}
						}
						if (!isFind) {
							if (!completeData.deletedData) {
								completeData.deletedData = [];
							}
							completeData.deletedData.push(completeData.updatedData[i]);
						}
					}
				}

				// 一覧のドキュメントリンク行をmapに格納する
				let contentsListData = info.contentsList.getData();
				let documentLinkMap = new Map();
				let documentMap = new Map();
				// objName
				if (lumpDocumentRegisterFlag) {
				for (let i = 0; i < contentsListData.length; i++) {
					if (contentsListData[i].isDocumentLink === 'true') {
						documentLinkMap.set(contentsListData[i].objName, contentsListData[i]);
					} else {
						documentMap.set(contentsListData[i].objName, contentsListData[i]);
					}
				}
				}else{
					// objId
					for (let i = 0; i < contentsListData.length; i++) {
						if (contentsListData[i].isDocumentLink === "true") {
                			documentLinkMap.set(contentsListData[i].objId,contentsListData[i]);
						}else{
							documentMap.set(contentsListData[i].objId, contentsListData[i]);
						}
					}
				}
				// ドキュメントリンクの更新対象データだが、一覧に存在しない場合、作成対象として扱う
				let newData = [];
				// objName
				if (lumpDocumentRegisterFlag) {
					for (let i = 0; i < updatedData.length; i++) {
						if (updatedData[i].isDocumentLink === 'true') {
							let mapData = documentLinkMap.get(updatedData[i].objName);
							if (!mapData) {
                  				updatedData[i].additionalTarget = documentMap.get(updatedData[i].objName);
								createdData.push(updatedData[i]);
							} else {
								newData.push(updatedData[i]);
							}
						} else {
							newData.push(updatedData[i]);
						}
					}
				}else{
					// objId
					for (let i = 0; i < updatedData.length; i++) {
						if (updatedData[i].isDocumentLink === "true") {
							let mapData = documentLinkMap.get(updatedData[i].objId);
							if (!mapData) {
								updatedData[i].additionalTarget = documentMap.get(updatedData[i].objId);
								createdData.push(updatedData[i]);
							} else {
								newData.push(updatedData[i]);
							}
						} else {
							newData.push(updatedData[i]);
						}
					}
				}
				updatedData = newData;

				// ドキュメントリンクの作成対象データだが、一覧に存在する場合、更新対象として扱う
				newData = [];
				for (let i = 0; i < createdData.length; i++) {
					if (createdData[i].isDocumentLink === 'true') {
						let mapData = documentLinkMap.get(createdData[i].objId);
						if (mapData) {
							updatedData.push(createdData[i]);
						} else {
							newData.push(createdData[i]);
						}
					} else {
						newData.push(createdData[i]);
					}
				}
				createdData = newData;

				// 削除対象データをグリッドから取得し直す
				if (completeData.deletedData) {
					let deleteData = [];
					for (let i = 0; i < completeData.deletedData.length; i++) {
						let targetData: any = completeData.deletedData[i];
						info.contentsList.info.gridApi.forEachNode((node) => {
							if (targetData.objId == node.data.objId) {
								if (!targetData.isDocumentLink || targetData.isDocumentLink === 'false') {
									if (node.data.isDocumentLink === 'true' && targetData.isRevUpTask === 'true') {
										if (node.data.documentLinkUpdateTiming === '1') {
											deleteData.push(node.data);
										}
									} else {
										deleteData.push(node.data);
									}
								} else if (targetData.isDocumentLink == node.data.isDocumentLink) {
									deleteData.push(node.data);
								}
							}
						});
					}

					// リンクが取得できていればグリッドからの削除対象から除く
					const matchKeys = new Set(
						orgDeletedLinkData.map(item => `${item.objId}-${item.isDocumentLink}`)
					);
					deleteData = deleteData.filter(itemA => {
						const key = `${itemA.objId}-${itemA.isDocumentLink}`;
						return !matchKeys.has(key);
					});

					completeData.deletedData = deleteData;
				}

				let backupMethod = info.contentsList.equals;
				if (equlsMethod) {
					info.contentsList.equals = equlsMethod;
				} else {
					let normalEqulsMethod = ((obj1: any, obj2: any): boolean => {
						return (obj1.objId == obj2.objId && obj1.isDocumentLink === obj2.isDocumentLink );
					});
					info.contentsList.equals = normalEqulsMethod;
				}
				let params = {
					info: info,
					createdData: createdData,
					updatedData: updatedData,
					deletedData: completeData.deletedData,
					createUponFlag: createUponFlag,
					noSelectFlag: noSelectFlag,
            		boxDocumentRegisterFlag: boxDocumentRegisterFlag,
            		lumpDocumentRegisterFlag: lumpDocumentRegisterFlag,
				};
				info.onComplete(params);
				info.contentsList.equals = backupMethod;
			});
		} else if (info.accordionActiveIndex === 3) {
			let parentAttr: any = info.attrTree.getSelectedData()[0];

			this.attrTreeService.getAttrChildObjectsByIds(parentAttr.attrTreeId, parentAttr.attrTreePath, parentAttr.attrTreeSettings,
			parentAttr.attrTreeValues, Object.keys(objIdSet).map(Number), parentAttr.data.objId).subscribe((data: any[]) => {
				let createdData: any[] = this.getContentsList(data, completeData.createdData);
				let updatedData: any[] = this.getContentsList(data, completeData.updatedData);
				// 更新対象データを取得できなかった場合、そのデータは存在しないので削除データとする
				if (completeData.updatedData) {

					for (let i = 0; i < completeData.updatedData.length; i++) {

						let isFind = false;
						for (let j = 0; j < updatedData.length; j++) {
							if (completeData.updatedData[i].objId == updatedData[j].objId) {
								isFind = true;
								break;
							}
						}
						if (!isFind) {
							if (!completeData.deletedData) {
								completeData.deletedData = [];
							}
							completeData.deletedData.push(completeData.updatedData[i]);
						}
					}
				}
				// 削除対象データをグリッドから取得し直す
				if (completeData.deletedData) {
					for (let i = 0; i < completeData.deletedData.length; i++) {
						let targetData: any = completeData.deletedData[i];
						info.contentsList.info.gridApi.forEachNode( (node) => {
							if (targetData.objId == node.data.objId) {
								completeData.deletedData[i] = node.data;
							}
						});
					}
				}

				let backupMethod = info.contentsList.equals;
				if (equlsMethod) {
					info.contentsList.equals = equlsMethod;
				} else {
					let normalEqulsMethod = ((obj1: any, obj2: any): boolean => {
						return (obj1.objId == obj2.objId && obj1.isDocumentLink === obj2.isDocumentLink );
					});
					info.contentsList.equals = normalEqulsMethod;
				}
				let params = {
					info: info,
					createdData: createdData,
					updatedData: updatedData,
					deletedData: completeData.deletedData,
					createUponFlag: createUponFlag,
					noSelectFlag: noSelectFlag,
				};
				info.onComplete(params);
				info.contentsList.equals = backupMethod;
			});
		}
		// 完了メッセージ表示
		if (completeMessage) {
			this.messageService.showGrowl(completeMessage);
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * リンク貼り付けします.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	private pasteLink(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[], linkUpdateTiming: number): void {
		let parentIds: number[] = new Array();
		let pasteTypes: string[] = new Array();
		let isDocumentLinks: boolean[] = new Array();
		let linkUpdateTimings: number[] = new Array();
		let originalData: any[] = info.pasteSourceObj.originalData;

		for (let i = 0; i < info.pasteSourceObj.length; i++) {
			parentIds[i] = parentData.objId;
			pasteTypes[i] = info.pasteSourceObj.pasteType;
			isDocumentLinks[i] = false;
			linkUpdateTimings[i] = linkUpdateTiming;
		}
		// 貼り付け処理実行
		this.contentsService.pasteLink(info.pasteSourceObj, linkUpdateTimings, parentIds, pasteTypes, isDocumentLinks)
		.subscribe(
				(data: any[]) => {
					let createdData: EIMCreatedData[] = [];
					for (let i = 0; i < data.length; i++) {
						data[i].isDocumentLink = 'true';
						createdData.push({data: data[i]});
					}
					// 画面に反映
					this.complete(info, {createdData: createdData}, this.translateService.instant('EIM_DOCUMENTS.INFO_00014'));
				}
		);
	}

	/**
	 * チェックインダイアログを表示します.
	 * @param info コンポーネント情報
	 * @param parentData 選択データの親データ
	 * @param selectedData 選択データ
	 */
	private checkin(info: EIMDocumentMainComponentInfo, parentData: any, selectedData: any[]): void {
		let dialogId: string = this.dialogManagerComponentService.showCheckIn(selectedData, info.selectedWorkspaceObjId, {
			executed: (checkInDetail) => {
				if (selectedData.length === checkInDetail.uploadCount ) {
					this.dialogManagerComponentService.close(dialogId);
				}
				let updatedDataList = [];
				let deletedDataList = [];

				for (let i = 0; i < checkInDetail.successList.length; i++) {
					let data: any = checkInDetail.successList[i];
					if (data.objId) {
						updatedDataList.push({objId: data.objId});
					}
					if (data.unlock === 'false') {
						continue;
					}
					if (((data.previousObjId && data.previousObjHasWF === 'false') && (data.objId && data.objHasWF === 'false'))
						|| ((data.previousObjId && data.previousObjHasWF === false) && (data.objId && data.objHasWF === false))
						|| ((data.previousObjId && data.previousObjHasWF === 'true') && (data.objId && data.objHasWF === 'false'))
						|| ((data.previousObjId && data.previousObjHasWF === true) && (data.objId && data.objHasWF === false))) {
						deletedDataList.push({objId: data.previousObjId, isDocumentLink: 'false', isRevUpTask: 'true'});
						updatedDataList.push({objId: data.previousObjId, isDocumentLink: 'true'});

						if (data.pastObjId) {
							const pastObjIds = data.pastObjId.split(',');
							for (let j = 0; j < pastObjIds.length; j++) {
								const pastObjId = pastObjIds[j];
								if (pastObjId === data.previousObjId) {
									continue;
								}
								deletedDataList.push({objId: pastObjId, isDocumentLink: 'false', isRevUpTask: 'true'});
							}
						}
					}
				}

				this.complete(info, {createdData: null, updatedData: updatedDataList, deletedData: deletedDataList}, this.translateService.instant('EIM_DOCUMENTS.INFO_00003'), false, null, true);
			}
		});
	}

	/**
	 * IDをセットに格納して返却します.
	 * @param data データ
	 * @return IDセット
	 */
	private createObjIdSet(data: any): any {
		let objIdSet: any = {};
		if (data) {
			for (let i = 0; i < data.length; i++) {
				let objId: number;
				if (data[i].hasOwnProperty('data')) {
					objId = Number(data[i].data.objId);
				} else {
					objId = Number(data[i].objId);
				}
				objIdSet[objId] = true;
			}
		}
		return objIdSet;
	}

	/**
	 * IDが一致しているオブジェクトをリストで返却します.
	 * @param data オブジェクトリスト
	 * @param idData オブジェクトリスト
	 * @return 一致しているデータ
	 */
	private getContentsList(data: any[], idData: any[]): any[] {
		const contentsList = [];
		if (idData) {
			for (let i = 0; i < idData.length; i++) {
				let idDataRow: any;
				if (idData[i].hasOwnProperty('data')) {
					idDataRow = idData[i].data;
					idDataRow.additionalTarget = idData[i].additionalTarget;
				} else {
					idDataRow = idData[i];
				}
				for (const dataRow of data) {
					if (Number(idDataRow.objId) !== Number(dataRow.objId)) {
						continue;
					}
					if (contentsList.find(c => c.objId === dataRow.objId
						&& c.isDocumentLink === dataRow.isDocumentLink
						&& c.documentLinkUpdateTiming === dataRow.documentLinkUpdateTiming)) {
						continue;
					}
					if (idDataRow.hasOwnProperty('isDocumentLink') && idDataRow.isDocumentLink === 'true'
						&& idDataRow.isDocumentLink !== dataRow.isDocumentLink) {
						continue;
					}
					dataRow.additionalTarget = idDataRow.additionalTarget;
					contentsList.push(dataRow);
				}
			}
		}
		return contentsList;
	}

	/**
	 * 貼り付け元オブジェクト情報を保存します.
	 * @param info コンポーネント情報
	 * @param selectedData 選択データ
	 * @param pasteType タイプ(切り取り、コピー、ブランチコピー)
	 */
	private savePasteSourceObj(info: EIMDocumentMainComponentInfo, selectedData: any[], parentData: any, pasteType: string): void {

		let objIds: number[] = new Array();
		for (let i = 0; i < selectedData.length; i++) {
			objIds[i] = selectedData[i].objId;
		}

		// 貼り付け元オブジェクト情報を保持
		info.pasteSourceObj = objIds;
		info.pasteSourceObj['pasteType'] = pasteType;
		info.pasteSourceObj['parentId'] = parentData.objId;
		info.pasteSourceObj['originalData'] = selectedData;
	}

	/**
	 * 貼り付け元オブジェクト情報をクリアします.
	 * @param info コンポーネント情報
	 */
	public clearPasteSourceObj(info: EIMDocumentMainComponentInfo): void {
		info.pasteSourceObj = null;
	}

	/**
	 * フォルダツリー複製を実行します.
	 * @param info コンポーネント情報
	 * @param objId
	 * @param linkUpdateTiming
	 * @param withDocLink
	 */
	private actDuplicateFolderTree(info: any, objId: number, linkUpdateTiming: number, withDocLink: boolean) {

		let data = {
			objId: objId,
			linkUpdateTiming: linkUpdateTiming,
			withDocLink: withDocLink,
		}

		this.folderService.actDuplicateFolderTree(data).subscribe((res: any) => {
			if (res.outOfTargetCount && res.outOfTargetCount !== '0') {
				this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_DOCUMENTS.INFO_00042'));
			}

			this.complete(info, {createdData: [res], updatedData: []}, this.translateService.instant('EIM_DOCUMENTS.INFO_00039'));
		});
	}

	// ----------------------------------------
	// 選択データのバリデータ
	// ----------------------------------------
	/**
	 * 複数選択データをバリデートします.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkArray(check: (name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean) => boolean): (name: string, info: any, parentData: any, domains: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean) => boolean {
		return (name: string, info: any, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean => {
			if (!domains) {
				return true;
			}
				for (let i = 0; i < domains.length; i++) {
					if (!check(name, info, parentData, domains[i], messageService, translateService, displayErrorDialog)) {
						return false;
					}
				}
			return true;
		};
	}

	/**
	 * ごみ箱でないかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果(ごみ箱でない場合true、ごみ箱の場合false)
	 */
	private checkIsNotGarbageBox(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check = true;
		if (!parentData) {
			check = true;
		} else {
			let data: any = Array.isArray(parentData) ? parentData[0] : parentData;
			check = (data && data.objTypeName == EIMDocumentsConstantService.OBJECT_TYPE_TRASH_CAN ||
				data.objTypeName == EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN? false : true);
		}
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00003'));
		}
		return check;
	}

	/**
	 * 親データ(ツリーノード)が選択されているかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkParentSelected(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		// 回付状況一覧画面を表示している場合、ツリーが無いためチェック除外
		if (info.accordionActiveIndex === 2) {
			return true;
		}

		let check: boolean;
		if (parentData) {
			if (Array.isArray(parentData) && parentData.length === 0) {
				check = true;
			} else {
				check = true;
			}
		} else {
			check = false;
		}

		if (!check && displayErrorDialog) {
			switch (name) {
				case 'showDocumentCreator':
				case 'showLumpDocumentCreator':
				case 'paste':
				case 'pasteFixedLink':
				case 'pasteLatestLink':
				case 'showPublicFileCombineExecutor':
				case 'showFolderCreator':
				case 'showTagCreator':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00070'));
					break;
				case 'showWorkspaceEditor':
				case 'showWorkspaceDelete':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00071'));
					break;
				default:
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00004'));
					break;
			}
		}

		return check;
	}

	/**
	 * 親データ(ツリーノード)に対して書き込み権限があるかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkParentAuthForCreate(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		// 回付状況一覧画面を表示している場合、ツリーが無いためチェック除外
		if (info.accordionActiveIndex === 2) {
			return true;
		}
		let check = false;
		let parent = parentData;
		if (Array.isArray(parentData)) {
			parent = parentData[0];
		}
		// 親データに権限情報が無い場合、チェック除外
		if (!parent || typeof parent.auth === 'undefined') {
			return true;
		} else {
			check = parent.auth.create;
		}
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00019'));
		}
		return check;
	}

    /**
    * 読み取りではないかを判定します.
    * @param info コンポーネント情報
    * @param parentData 親(ツリー選択ノード)データ
    * @param domain グリッド選択行データ
    * @param messageService メッセージサービス
    * @param translateService 言語サービス
    * @param displayErrorDialog エラーダイアログ表示フラグ
    * @return バリデート結果
    */
    private checkIsNotReadOnly(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
        const check =  !(domain.hasOwnProperty('readOnly') && (domain.readOnly == 'true' || domain.readOnly == true)) 
        if (!check && displayErrorDialog) {
            switch (name) {
                case 'menuPrivateDownload':
                case 'menuPublicDownload':
                    messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00134'));
                    break;
                default:
                    // 現状使っていません。デフォルトと思えるエラーメッセージを表示するケースができたら、エラーメッセージを追加して切り替えて使ってください
                    messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00134')); 
                    break;
            }
        }

        return check;
    }

	/**
	 * 親データ(ツリーノード)に対してステータスアップ権限があるかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkParentAuthForStatusUp(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		// 回付状況一覧画面を表示している場合、ツリーが無いためチェック除外
		if (info.accordionActiveIndex === 2) {
			return true;
		}
		let check = false;
		let parent = parentData;
		if (Array.isArray(parentData)) {
			parent = parentData[0];
		}
		// 親データに権限情報が無い場合、有効にしてサーバ側でチェックする
		if (typeof parent.auth === 'undefined') {
			return true;
		} else {
			check = parent.auth.statusUp;
		}
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00019'));
		}
		return check;
	}

	/**
	 * グリッドデータが選択されているかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkSelected(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domains && domains.length > 0);
		if (!check && displayErrorDialog) {
			switch (name) {
				case 'showPublicFileCombineExecutor':
				case 'showPublicFileSecurityUpdater':
				case 'copyBranch':
				case 'showOCRSettingUpdator':
				case 'executeOCR':
				case 'cancelOCR':
				case 'checkout':
				case 'cancelCheckout':
				case 'showCheckin':
				case 'showFileReplacementExecutor':
				case 'showRevisionHistory':
				case 'showPreSettingsPublicPdf':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00006'));
					break;
				case 'showRequestApprove':
				case 'cancelAproveRequest':
				case 'doApprove':
				case 'doTakeback':
				case 'showPublic':
				case 'showPublicCancel':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00008'));
					break;
				case 'copy':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00072'));
					break;
				case 'cut':
				case 'rename':
				case 'delete':
				case 'showProperty':
				case 'showAccessHistory':
				case 'menuDownload':
				case 'menuZipDownload':
				case 'menuAccessHistoryCSVOutput':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00073'));
					break;
				case 'showLinkUpdator':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00074'));
					break;
				case 'updateLatestLink':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00075'));
					break;
				case 'assignRetrieve':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00076'));
					break;
				case 'showSecurityChange':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00007'));
					break;
				case 'showAssignTag':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00036'));
					break;
				case 'folderReplication':
				case 'folderOnly':
				case 'includingDocumentReplicationFixedLink':
				case 'includingDocumentReplicationLatestLink':
				case 'addFavorite':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00007'));
					break;
				default:
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00004'));
					break;
			}
		}

		return check;
	}

	/**
	 * 選択しているデータが2件以下かどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkSelectedCountLessThanTwo(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domains && domains.length <= 2) {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00034'));
		}
		return false;
	}

	/**
	 * 選択しているデータが1件かどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkSelectedNumberIsOne(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domains && domains.length === 1);
		if (!check && displayErrorDialog) {
			switch (name) {
				case 'showStatusProperty':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00039'));
					break;
				case 'rename':
				case 'showProperty':
				case 'showAccessHistory':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00068'));
					break;
				case 'copyBranch':
				case 'showPublicFileSecurityUpdater':
				case 'cancelCheckout':
				case 'showFileReplacementExecutor':
				case 'showRevisionHistory':
				case 'showPreSettingsPublicPdf':
				case 'menuPrivateDownload':
				case 'menuPublicDownload':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00087'));
					break;
				case 'showLinkUpdator':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00088'));
					break;
				case 'showAssignTag':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00089'));
					break;
				case 'folderReplication':
				case 'folderOnly':
				case 'includingDocumentReplicationFixedLink':
				case 'includingDocumentReplicationLatestLink':
				case 'addFavorite':
				case 'showSecurityChange':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00090'));
					break;
				case 'assignRetrieve':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00091'));
					break;
				default:
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00002'));
					break;
			}
		}

		return check;
	}

	/**
	 * 選択しているデータが1件かどうかを判定します（メッセージ：ドキュメント、フォルダ、タグ）.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkSelectedNumberIsOneDocumentOrFolderOrTag(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domains && domains.length === 1);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00068'));
		}

		return check;
	}


	/**
	 * 貼り付け情報が可能であるかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkPastable(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (info.pasteSourceObj != null);
		if (check && info.pasteSourceObj.pasteType === 'CUT' && (name === 'pasteFixedLink' || name === 'pasteLatestLink')) {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00040'));
			}
			return false;
		}
		if (check && (name === 'pasteFixedLink' || name === 'pasteLatestLink')) {
			for (let i = 0; i < info.pasteSourceObj.originalData.length; i++) {
				if (info.pasteSourceObj.originalData[i].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
					if (displayErrorDialog) {
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00113'));
					}
					return false;
				}
			}
		}
		if (check && info.pasteSourceObj.pasteType === 'COPY') {
			// 表紙ドキュメントの場合、コピー/貼り付けは出来ない
			for (let i = 0; i < info.pasteSourceObj.originalData.length; i++) {
				if (info.pasteSourceObj.originalData[i].isCoverForScanning === true || info.pasteSourceObj.originalData[i].isCoverForScanning === 'true' ) {
					if (displayErrorDialog) {
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00114'));
					}
					return false;
				}
			}
		}
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00005'));
		}

		return check;
	}

	/**
	 * ドキュメントである事を判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsDocument(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.isDocument === true || domain.isDocument === 'true');
		if (!check && displayErrorDialog) {
			switch (name) {
				case 'showPublicFileCombineExecutor':
				case 'addPublicFileCombine':
				case 'showPublicFileSecurityUpdater':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00077', {value: domain.objName}));
					break;
				default:
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00006'));
					break;
			}
		}

		return check;
	}

	/**
	 * フォルダではない事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsNotFolder(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.objTypeName !== EIMDocumentsConstantService.OBJECT_TYPE_FOLDER);
		if (!check && displayErrorDialog) {
			switch (name) {
				case 'copy':
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00064', {value: domain.objName}));
				break;
				case 'showSignAndEncryption':
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00119', {value: domain.objName}));
				break;
				default:
				break;
			}
		}
		return check;
	}

	/**
	 * フォルダである事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsFolder(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00007'));
		}
		return false;
	}

	/**
	 * タグである事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsTag(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00036'));
		}
		return check;
	}

	/**
	 * タグでない事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsNotTag(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.objTypeName !== EIMDocumentsConstantService.OBJECT_TYPE_TAG);
		if (!check && displayErrorDialog) {
			switch (name) {
				case 'showRequestApprove':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00098', {value: domain.objName}));
					break;
				case 'cancelAproveRequest':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00099', {value: domain.objName}));
					break;
				case 'doApprove':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00078', {value: domain.objName}));
					break;
				case 'doTakeback':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00100', {value: domain.objName}));
					break;
				case 'showPublic':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00101', {value: domain.objName}));
					break;
			}
		}
		return check;
	}

	/**
	 * ワークスペース、またはフォルダかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsWorkspaceOrFolder(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE || domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00007'));
		}

		return check;
	}

	/**
	 * フォルダ、またはドキュメントかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsFolderOrDocument(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER || domain.isDocument === 'true' || domain.isDocument === true);
		if (!check && displayErrorDialog) {
			switch (name) {
				case 'assignRetrieve':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00076'));
					break;
				default:
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00008'));
					break;
			}
		}
		return check;
	}

	/**
	 * ドキュメント、フォルダまたはタグであるかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsDocumentOrFolderOrTag(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER || domain.isDocument === 'true' || domain.isDocument === true || domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00073'));
		}
		return check;
	}

	/**
	 * ワークスペース、ドキュメント、フォルダまたはタグであるかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsWorkspaceOrDocumentOrFolderOrTag(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE || domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER || domain.isDocument === 'true' || domain.isDocument === true || domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00073'));
		}
		return check;
	}

	/**
	 * ドキュメントリンクではない事を判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsNotDocumentLink(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.isDocumentLink && domain.isDocumentLink === 'true') {
			if (displayErrorDialog) {
				switch (name) {
					case 'showRequestApprove':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00103'));
						break;
					case 'showPublic':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00104'));
						break;
					case 'cancelAproveRequest':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00105'));
						break;
					case 'assignRetrieve':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00106'));
						break;
					case 'doTakeback':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00107'));
						break;
					case 'showPublicCancel':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00108'));
						break;
					case 'showFileReplacementExecutor':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00109'));
						break;
					case 'rename':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00066'));
						break;
					case 'showCheckin':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00117'));
						break;
					case 'checkout':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00116'));
						break;
					case 'cancelCheckout':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00118'));
						break;
					case 'showPreSettingsPublicPdf':
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00128'));
						break;
					default:
						messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00102'));
						break;
				}
			}
			return false;
		}
		return true;
	}

	/**
	 * ドキュメントリンクである事を判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsDocumentLink(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.isDocumentLink && domain.isDocumentLink === 'true') {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00075'));
		}
		return false;
	}

	/**
	 * ドキュメントリンクまたはフォルダである事を判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsDocumentLinkOrFolder(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.isDocumentLink && domain.isDocumentLink === 'true' || domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00074'));
		}
		return false;
	}

	/**
	 * 属性ではない事を判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkTypeIsOtherAttribute(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.objTypeName !== EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00008'));
		}
		return check;
	}

	/**
	 * ロックされているかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsLock(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.hasOwnProperty('lockUserName') && domain.lockUserName != '');
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00015'));
		}
		return check;
	}

	/**
	 * ロックされていないかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsNotLock(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (!domain.hasOwnProperty('lockUserName') || domain.lockUserName == '');
		if (!check && displayErrorDialog) {
			if (name === 'checkout') {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00096', {value: domain.objName}));
			} else {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00122'));
			}
		}
		return check;
	}

	/**
	 * 編集中(ワークフロー無しの場合は可)どうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsEdit(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (
				(domain.hasOwnProperty('statusTypeKind') && Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING)
				|| (domain.hasOwnProperty('statusTypeKind') && domain.statusTypeKind === '')
				|| (domain.hasOwnProperty('statusTypeName') && domain.statusTypeName === '-')
		);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00017', {value: domain.objName}));
		}
		return check;
	}
	/**
	 * 編集中(ワークフロー無しの場合は不可)どうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsEditWF(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (
				(domain.hasOwnProperty('statusTypeKind') && Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING)
		);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00017', {value: domain.objName}));
		}
		return check;
	}

	/**
	 * 公開済(ワークフロー無しの場合は可)どうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsPublic(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (
				(domain.hasOwnProperty('statusTypeKind') && Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC)
				|| (domain.hasOwnProperty('statusTypeKind') && domain.statusTypeKind === '')
				|| (domain.hasOwnProperty('statusTypeName') && domain.statusTypeName === '-')
		);
		if (!check && displayErrorDialog) {
			switch (name) {
				case 'executeOCR':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00081', {value: domain.objName}));
					break;
				default:
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00018', {value: domain.objName}));
					break;
			}
		}

		return check;
	}

	/**
	 * 公開済でないことを判定します（OCR処理設定）.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsNotPublicForshowOCRSettingUpdator(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {

		let check = true;
		if (domain.hasOwnProperty('statusTypeKind') && domain.statusTypeKind !== '') {
			// WFありの場合
			// 公開済みの場合エラー
			if (Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				check = false;
			}
		} else {
			// WFなしの場合
			// 公開済みアイコンありの場合エラー
			if (domain.isDspPubIconForNoWF === true || domain.isDspPubIconForNoWF === 'true') {
				check = false;
			}
		}

		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00097', {value: domain.objName}));
		}
		return check;
	}

	/**
	 * 公開済であることを判定します（OCR処理実行）.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsPublicForExecuteOCR(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {

		let check = true;
		if (domain.hasOwnProperty('statusTypeKind') && domain.statusTypeKind !== '') {
			// WFありの場合
			// 公開済みでない場合エラー
			if (Number(domain.statusTypeKind) !== EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				check = false;
			}
		} else {
			// WFなしの場合
			// 公開済みアイコンなしの場合エラー
			if (domain.isDspPubIconForNoWF === false || domain.isDspPubIconForNoWF === 'false') {
				check = false;
			}
		}

		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00081', {value: domain.objName}));
		}
		return check;
	}

	/**
	 * 公開済であることを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsPublicWithWorkflow(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (
				(domain.hasOwnProperty('statusTypeKind') && Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC)
		);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00018', {value: domain.objName}));
		}
		return check;
	}

	/**
	 * 公開済でないことを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsNotPublic(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.hasOwnProperty('statusTypeKind') && Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00017', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

    /**
     * 公開済(ワークフロー無しの場合は可)どうかを判定します.
     * @param info コンポーネント情報
     * @param parentData 親(ツリー選択ノード)データ
     * @param domain グリッド選択行データ
     * @param messageService メッセージサービス
     * @param translateService 言語サービス
     * @param displayErrorDialog エラーダイアログ表示フラグ
     * @return バリデート結果
     */
    private checkHavePublicFile(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
        const check = this.hasPublicFile(domain);
        if (!check && displayErrorDialog) {
            messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00135'));
        }
        return check;
    }

    /**
     * 公開アイコンを設定する.
     */
    private hasPublicFile(domain: any) {
		let isOldRevLink = false;
		if (this.domainService.isTrue(domain, 'isDocumentLink') && this.domainService.isTrue(domain, 'isDspLatestLink')) {
			isOldRevLink = true;
		}
		if (this.domainService.isTrue(domain, 'isOldVer')) {
			isOldRevLink = true;
		}

		// PDF変換完了(原本更新有)かどうか判定
		if (domain.hasOwnProperty('pdfConversionStatus')) {
			if (Number(domain.pdfConversionStatus) === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL) {
				isOldRevLink = true;
			}
		}

		const icon = this.publicFileRendererComponentService.getIcon(domain, isOldRevLink);
		return (icon != '');
	}

	/**
	 * ステータスが「承認依頼中」であることを判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果 true: 承認依頼中 false: 承認依頼中でない
	 */
	private checkStatusApprovalRequest(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_APPROVAL_REQUEST) {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00021', {value: domain.objName}));
		}
		return false;
	}

	/**
	 * 削除可能なステータスであるかを判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果 true: 承認依頼中 false: 承認依頼中でない
	 */
	private checkCanDeleteStatus(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		// ドキュメントリンクの場合はステータスに関わらず削除可能
		if (domain.isDocumentLink && domain.isDocumentLink === 'true') {
			return true;
		}
		if (Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_APPROVAL_REQUEST
		|| Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC
		|| (domain.hasOwnProperty('lockUserName') && domain.lockUserName !== '')) {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00026', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

	/**
	 * ステータスが「公開中」である事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkStatusPublic(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let status = Number(domain.statusTypeKind);
		if (status === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00018', {value: domain.objName}));
		}
		return false;
	}

	/**
	 * ステータスが「公開処理中（公開処理失敗）」ではない事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkStatusNotPublishingProcessFailed(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let status = Number(domain.statusTypeKind);
		if (status === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC && Number(domain.pdfConversionStatus) === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_FAILURE) {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00058', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}


	/**
	 * ドキュメントの場合、PDF変換失敗の文書かどうか、または上位にWF付きフォルダが無いかどうかチェックする
	 * @param name ダイアログ名
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkisConvertFailedDocument(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.isDocument === 'true' || domain.isDocument === true) {
			// PDF変換失敗の文書かどうかを判定します
			if (Number(domain.pdfConversionStatus) !== EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_FAILURE) {
				if (displayErrorDialog) {
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00022', {value: domain.objName}));
				}
				return false;
			}
		}
		return true;
	}

	/**
	 * ドキュメントの場合、PDF変換失敗でないことをチェックする
	 * @param name ダイアログ名
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsNotConvertFailedDocument(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.isDocument === 'true' || domain.isDocument === true) {
			// PDF変換失敗の文書かどうかを判定します
			if (Number(domain.pdfConversionStatus) === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_FAILURE) {
				if (displayErrorDialog) {
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00127', {value: domain.objName}));
				}
				return false;
			}
		}
		return true;
	}

	/**
	 * 公開ファイルがPDFかどうかを判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsDspPdfIcon(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = (domain.isDspPdfIcon === true || domain.isDspPdfIcon === 'true');
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00032', {value: domain.objName}));
		}
		return check;
	}

	/**
	 * 拡張子からPDFファイルであることを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsPdfExt(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let ext: string = domain.objName.substring(domain.objName.lastIndexOf('.'));
		if (ext === '.pdf') {
			return true;
		}
		if (displayErrorDialog) {
			switch (name) {
				case 'executeOCR':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00121', {value: domain.objName}));
					break;
				default:
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00032', {value: domain.objName}));
					break;
			}
		}
		return false;
	}

	/**
	 * PDF判定（公開ファイルセキュリティ設定用）.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsPdfForPublicFileSecuityUpdater(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		// 拡張子がpdf 又は dspPdfIcon が true なら true を返す
		let ext: string = domain.objName.substring(domain.objName.lastIndexOf('.'));
		if (ext === '.pdf' || domain.isDspPdfIcon === true || domain.isDspPdfIcon === 'true') {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00032', {value: domain.objName}));
		}
		return false;
	}

		/* 公開ファイル比較対象データかどうかを判定します
	 */
	private checkPublicFileCompare(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		// ステータスが公開済の場合
		if ((domain.hasOwnProperty('statusTypeKind') && Number(domain.statusTypeKind) === Number(EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC))
			&& (domain.objName.endsWith(EIMDocumentsConstantService.PDF_EXTENSION)
			|| domain.isDspPdfIcon === 'true')) {
			return true;
		// WF無しの場合
		} else if (((domain.hasOwnProperty('statusTypeKind') && domain.statusTypeKind === '')
			|| (domain.hasOwnProperty('statusTypeName') && domain.statusTypeName === '-'))
			&& domain.objName.endsWith(EIMDocumentsConstantService.PDF_EXTENSION)) {
				return true;
		}
		if (displayErrorDialog)　{
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00033', {value: domain.objName}));
		}
		return false;
	}

	/**
	 * 選択データがワークスペースであるか判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsWorkspace(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check = false;
		// domainsが１件の場合、かつ、domainがワークスペースの場合
		if (domains.length === 1 && domains[0].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE) {
			check = true;
		}
		// エラー表示なし
		return check;
	}
	/**
	 * 上位の階層にタグが付与されていない事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkParentNotTag(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		// 検索、回付状況確認、属性ツリービューを表示している場合、チェック除外する
		if (info.accordionActiveIndex === 1 || info.accordionActiveIndex === 2 || info.accordionActiveIndex === 3) {
			return true;
		}

		let check = true;
		let checkParent: (parentData: any) => void = (parent: any) => {
			if (typeof parent.objTypeName !== 'undefined') {
					// objNameがタグの場合
				if (parent.objTypeName  === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
					check = false;
				}
			}
			// parent内に上位のparentDataがある場合、上位のparentをチェックする
			if (typeof parent.parent !== 'undefined') {
				checkParent(parent.parent);
			}
		}

		// チェック実行
		let pData: any = parentData;
		if (Array.isArray(parentData)) {
			pData = parentData[0];
		}
		checkParent(pData);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00055'));
		}
		return check;
	}

	/**
	 * ログインユーザがシステム権限：ワークスペース管理を有するか判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkHasWorkspaceSystemAuth(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		const checkDigit = 13; // ワークスペース管理	0b 0001 0000 0000 0000(13桁目を判定)
		let admin = Number(info.loginUser.admin).toString(2);
		if (admin.length >= checkDigit) {
			// 文字列を右からチェック桁数まで切り出す
			let workAdmin = admin.slice(-(checkDigit));
			// １桁目を切り出す
			let workspaceSystemAuth = workAdmin.substr(0, 1);
			if (workspaceSystemAuth === '1') {
				return true;
			}
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00019'));
		}
		return false;
	}

	/**
	 * オブジェクトにドキュメントのセキュリティが設定されているか判定します
	 * config-doc.propertiesのNAME_SPACE_TO_EXCLUDE_IN_DOCUMENTに設定したネームスペースのセキュリティの場合は
	 * ドキュメントのセキュリティではないと判定します
	 * 
	 * domainsが1件の前提で動作します.先にcheckSelectedNumberIsOneをチェックしてください.
	 * 
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkSecurityOfDocument(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {

		let isDocumentSecurity = true;

		for (const nameSpaceToExclude of this.serverConfigService.nameSpacesToExclude) {

			if (domains[0].data.secName.indexOf(nameSpaceToExclude) === 0) {

				isDocumentSecurity = false;
				break;
			}
		}
		return isDocumentSecurity;
	}

	/**
	 * 選択オブジェクトがフォルダの場合、ワークフロー付きフォルダである事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkWFFolderForFolder(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER && domain.isWorkflowFolder !== 'true') {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00094', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

	/**
	 * 選択オブジェクトがワークフロー付きフォルダの場合、編集中である事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkStatusEditingWFFolder(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.isWorkflowFolder === 'true') {
			if (Number(domain.statusTypeKind) === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING) {
				return true;
			}
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00017', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

	/**
	 * ダイアログが既に開かれているかどうか判定します
	 *
	 * 下記命名規則にてダイアログIDの変数名を定義して下さい。
	 *  実行メソッド名 + DialogId(固定値)
	 *  ex) showAssignTag + DialogId
	 */
	private checkOpenedDialog (name: string, info: EIMDocumentMainComponentInfo, parentData: any, domains: any[], messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (info.checkTargetDialogId === undefined) {
			return true;
		} else if (info.checkTargetDialogId === '') {
			return true;
		} else {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM.ERROR_00011'));
			}
			return false;
		}
	}

	/**
	 * 選択オブジェクトがワークフロー付きフォルダ、またはワークフロー付きドキュメントである事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkWF(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (!domain.statusTypeKind || domain.statusTypeKind === '') {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00093', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

	/**
	 * グリッド選択データの上位階層にワークフロー付きフォルダがないことを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果 true: 上位階層にワークフロー付きフォルダがない false: 上位階層にワークフロー付きフォルダがある
	 */
	private checkParentNotWFFolderFromSelectedRowData (name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.higherWFFolder && domain.higherWFFolder !== '') {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00023', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

	/**
	 * 上位階層にワークフロー付きフォルダがないことを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果 true: 上位階層にワークフロー付きフォルダがない false: 上位階層にワークフロー付きフォルダがある
	 */
	private checkParentNotWFFolder(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {

		let check = true;
		let checkNotWFFolder = (node) => {
			if (node.isWorkflowFolder && node.isWorkflowFolder === 'true') {
				return false;
			}
			if (node.parent) {
				return checkNotWFFolder(node.parent);
			}
			return true;
		}
		check = checkNotWFFolder(parentData);
		if (check === false && displayErrorDialog === true) {
			switch (name) {
				case 'showTagCreator':
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00042'));
					break;
				default:
					messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00023', {value: domain.objName}));
					break;
			}
		}
		return check;
	}

	/**
	 * グリッド選択データの上位階層にワークフロー付きフォルダが有る場合、上位階層ワークフロー付きフォルダのステータスが「編集中」であることを判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果 true: その他 false: 上位にワークフロー付きフォルダがあり、且つ編集中でない
	 */
	private checkParentWFFolderStatusEdittingFromSelectedRowData (name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		if (domain.higherWFFolder && domain.higherWFFolder !== '' && Number(domain.higherWFFolderStatusTypeKind) !== EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING) {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00057'));
			}
			return false;
		}
		return true;
	}

	/**
	 * 上位階層にワークフロー付きフォルダが有る場合、上位階層ワークフロー付きフォルダのステータスが「編集中」であることを判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果 true: その他 false: 上位にワークフロー付きフォルダがあり、且つ編集中でない
	 */
	private checkParentWFFolderStatusEditting(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check = true;
		let checkNotWFFolder = (node) => {
			if (node.isWorkflowFolder && node.isWorkflowFolder === 'true' && Number(node.data.statusTypeKind) !== EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING) {
				return false;
			}
			if (node.parent) {
				return checkNotWFFolder(node.parent);
			}
			return true;
		}
		check = checkNotWFFolder(parentData);
		if (check === false && displayErrorDialog === true) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00057'));
		}
		return check;
	}

		/**
	 * ORC処理待ち判定.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkOcrProcessStatusWait(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {

		let check = true;
		if (domain.statusTypeKind !== '') {
			// WFありの場合
			// 公開済み、かつOCR処理待ちの場合はエラー
			if (domain.ocrProcessStatus !== EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT
			|| Number(domain.statusTypeKind) !== EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
				check = false;
			}
		} else {
			// WFなしの場合
			// OCR処理待ち以外の場合はエラー
			if (domain.ocrProcessStatus !== EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESS_WAIT) {
				check = false;
			}
		}
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00059', {value: domain.objName}));
		}
		return check;
	}

	/**
	 * ORC処理中でないことを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkNotOcrProcessStatusProcessing(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {

		if (domain.ocrProcessStatus === EIMDocumentsConstantService.OCR_PROC_STATUS_PROCESSING) {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00111', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

	/**
	 * 表紙ドキュメントではないことを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkNotCoverDocument(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {

		if (domain.isCoverForScanning === true || domain.isCoverForScanning === 'true') {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00114', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

	/**
	 * ステータスが「公開処理中」でない事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkStatusNotProcessingPublic(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let status = Number(domain.statusTypeKind);
		if (status !== EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PROCESSING_PUBLIC) {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00125', {value: domain.objName}));
		}
		return false;
	}

	/**
	 * ステータスが「公開中」でない事を判定します
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkStatusNotPublic(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let status = Number(domain.statusTypeKind);
		if (status !== EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_PUBLIC) {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00125', {value: domain.objName}));
		}
		return false;
	}

	/**
	 * 拡張子からPDF変換対象ファイルであることを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkIsPdfConvertFileExt(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let pdfConvertFileTypeSet = this.serverConfigService.pdfConvertFileTypeSet;
		let ext: string = domain.objName.substring(domain.objName.lastIndexOf('.') + 1);
		if (pdfConvertFileTypeSet.has(ext)) {
			return true;
		}
		if (displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00124', {value: domain.objName}));
		}
		return false;
	}

	/**
	 * 原本の更新日時が「PDF変換処理実行日時」以上であること、PDF変換失敗状態である、PDF変換処理中であることを判定します。
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkPDFConvExecStatus(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let pdfConversionStatus = Number(domain.pdfConversionStatus);
		let check: boolean = (
			pdfConversionStatus === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_FAILURE
			 || pdfConversionStatus === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESSING
			 || pdfConversionStatus === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_NONE
			 || pdfConversionStatus === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL);
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00126', {value: domain.objName}));
		}
		return check;
	}

	/**
	 * PDF変換処理中でないことを判定します。
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	 private checkStatusNotPdfConverting(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let pdfConversionStatus = Number(domain.pdfConversionStatus);

		if (pdfConversionStatus === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESSING) {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00128', {value: domain.objName}));
			}
			return false;
		}
		return true;
	}

	/**
	 * タグオブジェクトIDリストを作成します.
	 * @param selectedParent 選択対象親オブジェクトツリーノード
	 * @return タグオブジェクトIDリスト
	 */
	private convertTagIds(selectedParent: EIMFolderTreeNode): number[] {
		if (!selectedParent) {
			// 対象が存在しない場合、空を返却
			return [];
		}
		if (selectedParent.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			// 対象がタグの場合、自身を返却し配列の先頭とする
			return [selectedParent.objId];
		}
		let tagIds: number[] = this.convertTagIds(selectedParent.parent);
		if (tagIds.length !== 0) {
			// タグ配下の場合、自身を配列に加える
			tagIds.push(selectedParent.objId);
		}
		return tagIds;
	}

	/**
	 * 暗号化状態を判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkSignAndEncryptedState(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check = true;
		// 暗号化済みの場合
		if (domain.signencr === EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR || domain.signencr === Number(EIMDocumentsConstantService.SIGNENCR_KIND_SIGNENCR)) {
			check = false;
		// 暗号化処理中の場合
		} else if (domain.signencr === EIMDocumentsConstantService.SIGNENCR_KIND_PROCESSING_SIGNENCR || domain.signencr === Number(EIMDocumentsConstantService.SIGNENCR_KIND_PROCESSING_SIGNENCR)) {
			check = false;
		}
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00120', {value: domain.objName}));
		}
		return check;
	}

	/**
	 * "原本の更新日時が「公開PDF事前登録日時」以上であること、かつ、公開PDFが事前登録済みであれば、エラーとします。
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkPDFConvExecStatusAndRegisteredPrePdf(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let pdfConversionStatus = Number(domain.pdfConversionStatus);
		let isPdfPreRegistered:boolean = (domain.isPdfPreRegistered === true || domain.isPdfPreRegistered === 'true');

		if (pdfConversionStatus === EIMDocumentsConstantService.PDF_CONVERSION_STATUS_PROCESS_COMPLETE_NOT_SAME_ORIGINAL
			&& isPdfPreRegistered) {
			if (displayErrorDialog) {
				messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00130'));
			}
			return false;
		} else {
			return true;
		}
	}

	/**
	 * リストビューを表示しているかどうかを判定します.
	 * @param info コンポーネント情報
	 * @param parentData 親(ツリー選択ノード)データ
	 * @param domain グリッド選択行データ
	 * @param messageService メッセージサービス
	 * @param translateService 言語サービス
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return バリデート結果
	 */
	private checkGridView(name: string, info: EIMDocumentMainComponentInfo, parentData: any, domain: any, messageService: EIMMessageService, translateService: TranslateService, displayErrorDialog: boolean): boolean {
		let check: boolean = info.isThumbnailsVisible === false;
		if (!check && displayErrorDialog) {
			messageService.show(EIMMessageType.error, translateService.instant('EIM_DOCUMENTS.ERROR_00133'));
		}
		return check;
	}}



