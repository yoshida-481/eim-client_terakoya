import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, NgZone, OnDestroy, OnInit, ElementRef, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { EIMWorkspaceService } from 'app/documents/shared/services/apis/workspace.service';
import { Subject, Subscription } from 'rxjs';

import { MenuItem, SelectItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMMenuItem } from 'app/shared/shared.interface';

import { EIMListComponent } from 'app/shared/shared.interface';

import { EIMDocumentMainComponentInfo, EIMDocumentMainComponentService } from 'app/documents/components/document-main/document-main.component.service';

import { EIMAccordionSearchComponent } from 'app/documents/components/accordion-search/accordion-search.component';
import { EIMCirculationSituationComponent } from 'app/documents/components/circulation-situation/circulation-situation.component';
import { EIMContentsSearchComponent } from 'app/documents/components/contents-search/contents-search.component';
import { EIMDirectEditingRendererComponent } from 'app/documents/shared/components/renderer/direct-editing-renderer.component';
import { EIMTextEditorRendererComponent } from 'app/documents/shared/components/renderer/text-editor-renderer.component';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDataGridColumn, EIMDataGridColumnType, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';

import { EIMAttributeTreeComponentService, EIMAttributeTreeNode } from 'app/documents/components/attribute-tree/attribute-tree.component.service';
import { EIMContentsListComponentService } from 'app/documents/components/contents-list/contents-list.component.service';
import { EIMContentsTreeComponentService, EIMFolderTreeNode } from 'app/documents/components/contents-tree/contents-tree.component.service';
import { EIMAccordionSearchRendererComponentService } from 'app/documents/shared/components/renderer/accordion-search-renderer.component.service';
import { EIMPageRendererComponent } from 'app/documents/shared/components/renderer/page-renderer.component';
import { EIMPageRendererComponentService } from 'app/documents/shared/components/renderer/page-renderer.component.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMFolderService } from 'app/documents/shared/services/apis/folder.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';

import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMDropFileService } from 'app/shared/services/drop-file.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMReloadService } from 'app/shared/services/reload.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMWebDAVService } from 'app/shared/services/webdav.service';

import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';
import { EIMTableService } from 'app/documents/shared/services/apis/table.service';
import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';
import { EIMPublicFileRendererComponent } from 'app/documents/shared/components/renderer/public-file-renderer.component';
import { EIMDocumentAuthenticationService } from 'app/documents/shared/services/apis/authentication.service';

// レンダラー
import { EIMAccordionSearchComponentService } from 'app/documents/components/accordion-search/accordion-search.component.service';
import { EIMContentsPropertyComponentService } from 'app/documents/components/contents-property/contents-property.component.service';
import { EIMAccordionSearchRendererComponent } from 'app/documents/shared/components/renderer/accordion-search-renderer.component';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMContextMenu, EIMContextMenuService, EIMMainMenu } from 'app/documents/shared/services/apis/context-menu.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMSignEncryptionRendererComponent } from 'app/documents/shared/components/renderer/sign-encription-cell-renderer.component';
import { EIMStatusRendererComponent } from 'app/documents/shared/components/renderer/status-renderer.component';
import { EIMStatusRendererComponentService } from 'app/documents/shared/components/renderer/status-renderer.component.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { EIMThumbnailService } from 'app/documents/shared/services/apis/document-thumbnail.service';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMBoxAuthorizationService } from 'app/shared/services/apis/box-authorization.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { ContextMenu } from 'primeng/contextmenu';
import { finalize } from 'rxjs/operators';
import { EIMThumbnailViewerComponent } from '../thumbnail-viewer/thumbnail-viewer.component';
import { EIMDialogSharedManagerComponent } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';

import { EIMBoxContentsListComponentService } from "../box-contents-list/box-contents-list.component.service";
import { EIMBoxFileDragComponentService } from "../box-file-drag/box-file-drag.component.service";
import { BoxEIMFileDragComponentService, BoxEIMFileDragInfo, } from "../eim-file-drag/eim-file-drag.component.service";
import { EIMBoxFileService } from "app/shared/services/apis/box-file.service";
import { EIMBoxContentsListComponent } from "../box-contents-list/box-contents-list.component";


export namespace accordionIndex {
	export const WORKSPACE = 0;
	export const SEARCH = 1;
	export const CIRCULATION_SITUATION = 2;
	export const ATTRIBUTE_TREE = 3;
}
const COMMON_STATE = 4;

/**
 * 右クリックメニュー定義名
 */
namespace contextMenuDefineName {
	export const CHECK_OUT = 'チェックアウト';
	export const CANCEL_CHECK_OUT = 'チェックアウト取消';
	export const CHECK_IN = 'チェックイン';
	export const PROPERTIES = '属性';
	export const ROTATION_STATUS_HISTORY = 'ステータス属性';
	export const APPROVAL_REQUEST = '承認依頼';
	export const REQUEST_CANCEL = '承認依頼取消';
	export const APPROVE_IT = '承認';
	export const COPY = 'コピー';
	export const CUT = '切取り';
	export const PASTE = '貼付け';
	export const LINK_PASTING_PLATE_FIXING_MANUAL = 'リンク貼付け(手動更新)';
	export const LINK_PASTING_LATEST_VERSION_AUTOMATIC = 'リンク貼付け(公開時更新)';
	export const RENAME = '改名';
	export const DELETE = '削除';
	export const COPY_THE_URL = 'URLコピー';
	export const URL_SHORTCUT_OUTPUT = 'URLショートカット出力';
	export const PUBLISH = '公開';
	export const ACCESS_HISTORY_CSV_OUTPUT = 'アクセス履歴CSVダウンロード';
	export const CREATE_PUBLIC_PDF = '公開PDFの事前変換';
	export const SETTINGS_PUBLIC_PDF = '公開PDFの事前設定';
	export const PUBLIC_CANCEL = '公開取消';
	export const TAKE_BACK = '取戻し';
	export const SEND_IT_BACK_AND_TO_NEXT = '差戻し';
	export const REPLACE = '差替え';
	export const APPROVAL_WAITING_LIST = '処理待ち一覧';
	export const SECURITY = 'セキュリティ';
	export const REVISION_LOG = '改訂履歴';
	export const ACCESS_LOG = 'アクセス履歴';
	export const ADD_TO_FAVORITES_LIST = 'お気に入りに追加';
	export const DOWNLOAD = 'ダウンロード';
	export const DOWNLOAD_ZIP = 'ZIPダウンロード';
	export const DOWNLOAD_PRIVATE = '原本ダウンロード';
	export const DOWNLOAD_PUBLIC = '公開ダウンロード';
	export const LINK_SETTING = 'リンク設定';
	export const LINK_UPDATE_LATEST_REVISION = 'リンク更新(最新リビジョン)';
	export const TAG_ALLOCATION = 'タグ割当て';
	export const BRANCH = 'ブランチコピー';
	export const COPY_FOLDER_TREE = 'フォルダツリー複製';
	export const FOLDER_ONLY = 'フォルダのみ';
	export const WITH_DOCUMENT_AS_LINK_MANUAL = 'ドキュメント含む(手動更新リンクとして複製)';
	export const WITH_DOCUMENT_AS_LINK_AUTO = 'ドキュメント含む(公開時更新リンクとして複製)';
	export const OCR_PROCESSING_SETTINGS = 'OCR処理設定';
	export const OCR_PROCESSING_EXECUTION = 'OCR処理実行';
	export const OCR_PROCESSING_CANCELLATION = 'OCR処理取消';
	export const JOIN_PUBLISHED_PDF = '公開ファイル結合';
	export const PUBLIC_DOCUMENT_COMPARISON = '公開ファイル比較';
	export const SECURITY_SETTING_FOR_PUBLISHED_DOCUMENT = '公開ファイルセキュリティ設定';
	export const SIGN_AND_ENCRYPTION = '署名・暗号化';
}

/**
 * ドキュメントメインコンポーネント
 * @example
 *
 *      <eim-document-main
 *        jumpTargetId="{{jumpTargetId}}"
 *        isFolder="{{isFolder}}"
 *        linkParentObjId="{{linkParentObjId}}"
 *        downloadPrivateFileObjId="{{downloadPrivateFileObjId}}"
 *        downloadPublicFileObjId="{{downloadPublicFileObjId}}">
 *      </eim-document-main>
 */
@Component({
    selector: 'eim-document-main',
    templateUrl: './document-main.component.html',
    styleUrls: ['./document-main.component.css'],
    providers: [
        MenubarModule,
        BreadcrumbModule,
        EIMDocumentMainComponentService,
        EIMContentsTreeComponentService,
        EIMContentsListComponentService,
        EIMAccordionSearchComponentService
    ],
    standalone: false
})
export class EIMDocumentMainComponent implements OnInit, OnDestroy {

	/** サムネイルコンポーネント */
	@ViewChild('thumbnailsSample', { read: ViewContainerRef }) thumbnailsSample: ViewContainerRef;

	/** ツリーコンポーネント */
	@ViewChild('contentsTree', { static: true })
		contentsTree: EIMTreeComponent;

	/** グリッドコンポーネント */
	@ViewChild('contentsList', { static: true })
		contentsList: EIMDataGridComponent;

	/** CSVダウンロードグリッドコンポーネント */
	@ViewChild('csvDownloadList')
		csvDownloadList: EIMDataGridComponent;

	/** 属性ツリーコンポーネント */
	@ViewChild('attrTree')
	attrTree: EIMTreeComponent;

	/** アコーディオン検索コンポーネント */
	@ViewChild('accordionSearch', { static: true })
	accordionSearch: EIMAccordionSearchComponent;

	/** 回付状況確認コンポーネント */
	@ViewChild('circulation', { static: true })
	circulation: EIMCirculationSituationComponent;

	/** ダイアログマネージャ */
	@ViewChild('documentDialogManager', { static: true })
	documentDialogManager: EIMDialogSharedManagerComponent;

	/** 属性ツリーコンポーネント */
	@ViewChild('contextMenu')
	contextMenu: ContextMenu;

	/** サムネイルビューコンポーネント */
	@ViewChild('thumbnailViewer', { static: false })
		thumbnailViewer: EIMThumbnailViewerComponent;

	/** URLダイレクトアクセス対象オブジェクトID */
	@Input('jumpTargetId')
		public jumpTargetId: number;

	/** URLダイレクトアクセス対象フォルダーフラグ */
	@Input('isFolder')
		public isFolder: boolean;

	/** ジャンプ対象ドキュメントリンクフラグ */
	@Input('linkParentObjId')
		public linkParentObjId: number;

	/** ダウンロードPrivateドキュメントオブジェクトID */
	@Input('downloadPrivateFileObjId')
		public downloadPrivateFileObjId: number;

	/** ダウンロードPublicドキュメントオブジェクトID */
	@Input('downloadPublicFileObjId')
		public downloadPublicFileObjId: number;

	/** 作成者 */
	public createUser: EIMUserDomain;

	/** ファイルをドラッグ中の場合true */
	public boxFileDragging = false;

	/** ファイルのdragenterイベントターゲット */
	public fileDragEnterTarget: EventTarget;

	/** ドラッグ開始サブスクリプション */
	private dragStarted: Subscription;

	/** ドラッグ終了サブスクリプション */
	private dragEnded: Subscription;

	/** 回付状況確認アコーディオンを表示するかどうか */
	@Input()
	public isDispalyCirculationSituationAccordion = true;

	/** 属性ツリービューアコーディオンを表示するかどうか */
	@Input()
	public isDispalyAttributeTreeAccordion = true;

	/** ツリーコンポーネント初期化処理無効化 */
	@Input('disabledTreeInitialization')
		public disabledTreeInitialization: boolean = false;

	/** オブジェクトを選択する際のコンテキストルート(http://localhost/eim) */
	@Input() contextRootForSelectObject = null;

	/** オブジェクトを選択する際のルートパス(client/#/以降) */
	@Input() routePathForSelectObject = null;
	
	/** オブジェクトを選択する際の追加クエリパラメータ('param=value'の配列) */
	@Input() paramsForSelectObject: string[] = null;

	/** ファイルダウンロードのコンテキストルート */
	@Input() contextRootForDownloadDocument = null;
	
	@Output() shownDialog: EventEmitter<string> = new EventEmitter<string>();

	/** ツリー選択データ */
	public contentsTreeSelectedData: any;

	/** 回付状況確認アコーディオンのインデックス */
	public accordionIndexCirculationSituation = accordionIndex.CIRCULATION_SITUATION;

	/** 検索アコーディオンのインデックス */
	public accordionIndexSearch = accordionIndex.SEARCH;

	/** 検索時　本文抜粋／リスト／サムネイル切替表示タイプ */
	public displayTypes: SelectItem[] = [
		{label: this.translateService.instant("EIM_DOCUMENTS.LABEL_02030"), value: EIMConstantService.DISPLAY_TEXTEXCERPT}, //本文抜粋
		{label: this.translateService.instant("EIM_DOCUMENTS.LABEL_02031") , value: EIMConstantService.DISPLAY_LIST}, // リスト
		{label: this.translateService.instant("EIM_DOCUMENTS.LABEL_02223") , value: EIMConstantService.DISPLAY_THUMBNAIL} //サムネイル
	];

	/** 検索時　選択されている表示タイプのID */
	public selectedDisplayTypeId: number;

	/** 検索時　前に選択されていた表示タイプのID */
	public preSelectedDisplayTypeId: number;
	
	/** ワークスペース時 リスト／サムネイル切替表示タイプ */
	public workspaceDisplayTypes: SelectItem[] = [
		{label: this.translateService.instant("EIM_DOCUMENTS.LABEL_02031") , value: EIMConstantService.DISPLAY_LIST}, // リスト
		{label: this.translateService.instant("EIM_DOCUMENTS.LABEL_02223") , value: EIMConstantService.DISPLAY_THUMBNAIL} //サムネイル
	];
	
	/** ワークスペース時　選択されている表示タイプのID */
	public selectedWorkspaceDisplayTypeId = EIMConstantService.DISPLAY_LIST;

	/** RxJSでの購読解除用 */
	private destroy$ = new Subject();

	//
	// メインメニュー（機能毎）
	//
	/** メインメニュー 新規 */
	private menulistNew: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03025', name: 'New', icon: 'eim-icon-plus'};
	/** メインメニュー 編集 */
	private menulistEdit: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03026', name: 'Edit', icon: 'eim-icon-pencil'};
	/** メインメニュー 改訂 */
	private menulistRevision: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03080', name: 'Revision', icon: 'fa fa-clone'};
	/** メインメニュー 検索 */
	private menulistSearch: EIMMenuItem =
    	{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03024', name: 'showSearch', icon: 'eim-icon-search',
    	command: (event) => { this.invokeMethod(event, this.contentsList, 'showSearch'); }
    };
	/** メインメニュー 承認/公開 */
	private menulistApprovalRelease: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03081', name: 'ApprovalRelease', icon: 'eim-icon-thumb-up'};
	/** メインメニュー プロパティ */
	private menulistProperty: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03007', name: 'Property', icon: 'eim-icon-list'};
	/** メインメニュー 表示 */
	private menulistView: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03040', name: 'View', icon: 'eim-icon-table'};
	/** メインメニュー マイスペース */
	private menulistMyspace: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03082', name: 'Myspace', icon: 'fa fa-star'};
	/** メインメニュー フォルダ複製 */
	private menulistFolderReplication: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03084', name: 'folderReplication', icon: 'eim-icon-folder-tree'};
	/** メニュー ドキュメント一括 */
	private menuItemShowLumpDocumentCreator: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03062', name: 'LumpDocumentCreator', icon: 'fa fa-files-o'};
	/** メニュー ダウンロード */
	private menuItemDownload: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03095', name: 'download', icon: 'fa fa-files-o'};

	//
	// メニュー
	//
	/** メニュー ドキュメント */
	private menuItemCreateDocument: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03030', name: 'showDocumentCreator', icon: 'eim-icon-file', command: (event) => {this.invokeMethod(event, this.contentsList, 'showDocumentCreator'); }};
	/** メニュー フォルダ */
	private menuItemCreateFolder: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03031', name: 'showFolderCreator', icon: 'eim-icon-folder', command: (event) => {this.invokeMethod(event, this.contentsList, 'showFolderCreator'); }};
	/** メニュー タグ */
	private menuItemCreateTag: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03060', name: 'showTagCreator', icon: 'fa fa-tag', command: (event) => {this.invokeMethod(event, this.contentsList, 'showTagCreator'); }};
	/** メニュー ワークスペース */
	private menuItemCreateWorkspace: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03061', name: 'showWorkspaceCreator', icon: 'fa fa-lg eim-icon-workspace', command: (event) => {this.invokeMethod(event, this.contentsList, 'showWorkspaceCreator'); }};
	/** メニュー ZIP展開登録 */
	private menuItemShowZip_expansion_registration: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03128', name: 'showLumpDocumentCreator', icon: 'fa fa-files-o', command: (event) => {this.invokeMethod(event, this.contentsList, 'showLumpDocumentCreator'); }};
	/** メニュー フォルダアップロード */
	private menuItemShowLumpFolderCreator: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03127', name: 'showLumpFolderCreator', icon: 'fa fa-files-o', command: (event) => {this.invokeMethod(event, this.contentsList, 'showLumpFolderCreator'); }};
		
	/** メニュー スキャン用紙 */
	private menuItemShowCoverCreator: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03063', name: 'showCoverCreator', icon: 'eim-icon-printer', command: (event) => {this.invokeMethod(event, this.contentsList, 'showCoverCreator'); }};
	/** メニュー チェックイン */
	private menuItemCheckin: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03029', name: 'showCheckin', icon: 'eim-icon-checkin', command: (event) => {this.invokeMethod(event, this.contentsList, 'showCheckin'); }};
	/** メニュー チェックアウト */
	private menuItemCheckout: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03032', name: 'checkout', icon: 'eim-icon-checkout', command: (event) => {this.invokeMethod(event, this.contentsList, 'checkout'); }};
	/** メニュー チェックアウト取り消し */
	private menuItemCancelCheckout: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03033', name: 'cancelCheckout', icon: 'eim-icon-checkout_back', command: (event) => {this.invokeMethod(event, this.contentsList, 'cancelCheckout'); }};
	/** メニュー コピー */
	private menuItemCopy: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03034', name: 'copy', icon: 'eim-icon-copy', command: (event) => {this.invokeMethod(event, this.contentsList, 'copy'); }};
	/** メニュー ブランチコピー */
	private menuItemCopyBranch: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03008', name: 'copyBranch', icon: 'eim-icon-branch-copy', command: (event) => {this.invokeMethod(event, this.contentsList, 'copyBranch'); }};
	/** メニュー 切り取り */
	private menuItemCut: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03035', name: 'cut', icon: 'eim-icon-scissors', command: (event) => {this.invokeMethod(event, this.contentsList, 'cut'); }};
	/** メニュー 貼り付け */
	private menuItemPaste: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03036', name: 'paste', icon: 'eim-icon-paste', command: (event) => {this.invokeMethod(event, this.contentsList, 'paste'); }};
	/** メニュー 名前の変更 */
	private menuItemRename: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03037', name: 'rename', icon: 'eim-icon-rename', command: (event) => {this.invokeMethod(event, this.contentsList, 'rename'); }};
	/** メニュー リンク貼付け（版固定/手動） */
	private menuItemPasteFixedLink: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03064', name: 'pasteFixedLink', icon: 'fa fa-link fa-flip-vertical eim-icon-link-color-gray', command: (event) => {this.invokeMethod(event, this.contentsList, 'pasteFixedLink'); }};
	/** メニュー リンク貼付け（最新版/自動） */
	private menuItemPasteLatestLink: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03065', name: 'pasteLatestLink', icon: 'fa fa-link fa-flip-vertical eim-icon-link-color-gray', command: (event) => {this.invokeMethod(event, this.contentsList, 'pasteLatestLink'); }};
	/** メニュー リンク設定 */
	private menuItemShowLinkUpdator: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03066', name: 'showLinkUpdator', icon: 'fa fa-link fa-flip-vertical eim-icon-link-color-gray', command: (event) => {this.invokeMethod(event, this.contentsList, 'showLinkUpdator'); }};
	/** メニュー リンク更新（最新リビジョン） */
	private menuItemUpdateLatestLink: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03067', name: 'updateLatestLink', icon: 'fa fa-link fa-flip-vertical eim-icon-link-color-gray', command: (event) => {this.invokeMethod(event, this.contentsList, 'updateLatestLink'); }};
	/** メニュー タグ割当て */
	private menuItemShowAssignTag: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03068', name: 'showAssignTag', icon: 'fa fa-tag', command: (event) => {this.invokeMethod(event, this.contentsList, 'showAssignTag'); }};
	/** メニュー フォルダのみ */
	private menuItemFolderOnly: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03085', name: 'folderOnly', icon: '', command: (event) => {this.invokeMethod(event, this.contentsList, 'folderOnly'); }};
	/** メニュー ドキュメント含む(手動更新リンクとして複製) */
	private menuItemIncludingDocumentReplicationFixedLink: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03086', name: 'includingDocumentReplicationFixedLink', icon: '', command: (event) => {this.invokeMethod(event, this.contentsList, 'includingDocumentReplicationFixedLink'); }};
	/** メニュー ドキュメント含む(公開時更新リンクとして複製) */
	private menuItemIncludingDocumentReplicationLatestLink: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03087', name: 'includingDocumentReplicationLatestLink', icon: '', command: (event) => {this.invokeMethod(event, this.contentsList, 'includingDocumentReplicationLatestLink'); }};
	/** メニュー OCR処理設定 */
	private menuItemShowOCRSettingUpdator: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03069', name: 'showOCRSettingUpdator', icon: 'eim-icon-printer', command: (event) => {this.invokeMethod(event, this.contentsList, 'showOCRSettingUpdator'); }};
	/** メニュー OCR処理実行 */
	private menuItemExecuteOCR: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03070', name: 'executeOCR', icon: 'eim-icon-printer', command: (event) => {this.invokeMethod(event, this.contentsList, 'executeOCR'); }};
	/** メニュー OCR処理取消 */
	private menuItemCancelOCR: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03071', name: 'cancelOCR', icon: 'eim-icon-printer', command: (event) => {this.invokeMethod(event, this.contentsList, 'cancelOCR'); }};
	/** メニュー 公開ファイル結合 */
	private menuItemShowPublicFileCombineExecutor: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03072', name: 'showPublicFileCombineExecutor', icon: 'eim-icon-public-file', command: (event) => {this.invokeMethod(event, this.contentsList, 'showPublicFileCombineExecutor'); }};
	/** メニュー 結合対象に追加 */
	private menuItemAddPublicFileCombine: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03099', name: 'addPublicFileCombine', icon: 'eim-icon-checkout', command: (event) => {this.invokeMethod(event, this.contentsList, 'addPublicFileCombine'); }};
	/** メニュー 公開ファイル比較 */
	private menuItemShowPublicFileCompareExecutor: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03073', name: 'showPublicFileCompareExecutor', icon: 'eim-icon-public-file', command: (event) => {this.invokeMethod(event, this.contentsList, 'showPublicFileCompareExecutor'); }};
	/** メニュー 比較元ドキュメント選択 */
	private menuItemSourceDocument: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03113', name: 'sourceDocument', icon: 'eim-icon-checkout', command: (event) => {this.invokeMethod(event, this.contentsList, 'sourceDocument'); }};
	/** メニュー 比較先ドキュメント選択 */
	private menuItemDestinationDocument: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03114', name: 'destinationDocument', icon: 'eim-icon-checkout', command: (event) => {this.invokeMethod(event, this.contentsList, 'destinationDocument'); }};
	/** メニュー 公開ファイルセキュリティ設定 */
	private menuItemShowPublicFileSecurityUpdater: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03074', name: 'showPublicFileSecurityUpdater', icon: 'eim-icon-public-file', command: (event) => {this.invokeMethod(event, this.contentsList, 'showPublicFileSecurityUpdater'); }};
	/** メニュー 署名・暗号化 */
	private menuItemShowSignAndEncryption: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03091', name: 'showSignAndEncryption', icon: 'fa fa-lock', command: (event) => {this.invokeMethod(event, this.contentsList, 'showSignAndEncryption'); }};
		/** メニュー 削除 */
	private menuItemDelete: EIMMenuItem =
		{label: '', rKey: 'EIM.LABEL_03003', name: 'delete', icon: 'eim-icon-trash', command: (event) => {this.invokeMethod(event, this.contentsList, 'delete'); }};
	/** メニュー 公開 */
	private menuItemPublic: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03022', name: 'showPublic', icon: 'fa fa-unlock', command: (event) => {this.invokeMethod(event, this.contentsList, 'showPublic'); }};
	/** メニュー 公開PDFの事前変換 */
	private menuItemCreatePublicPdf: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03059', name: 'createPublicPdf', icon: 'eim-icon-pdf-menu', command: (event) => {this.invokeMethod(event, this.contentsList, 'createPublicPdf'); }};
	/** メニュー 公開PDFの事前設定 */
	private menuItemPreSettingsPublicPdf: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03092', name: 'showPreSettingsPublicPdf', icon: 'eim-icon-pdf-menu', command: (event) => {this.invokeMethod(event, this.contentsList, 'showPreSettingsPublicPdf'); }};
	/** メニュー 公開取消 */
	private menuItemPublicCancel: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03041', name: 'showPublicCancel', icon: 'fa fa-unlock-alt', command: (event) => {this.invokeMethod(event, this.contentsList, 'showPublicCancel'); }};
	/** メニュー 承認 */
	private menuItemApprove: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03042', name: 'doApprove', icon: 'eim-icon-thumb-up', command: (event) => {this.invokeMethod(event, this.contentsList, 'doApprove'); }};
	/** メニュー 承認依頼 */
	private menuItemRequestApprove: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03043', name: 'showRequestApprove', icon: 'fa fa-share', command: (event) => {this.invokeMethod(event, this.contentsList, 'showRequestApprove'); }};
	/** メニュー 承認依頼取消 */
	private menuItemCancelAproveRequest: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03044', name: 'cancelAproveRequest', icon: 'fa fa-reply', command: (event) => {this.invokeMethod(event, this.contentsList, 'cancelAproveRequest'); }};
	/** メニュー 差戻し */
	private menuItemAssignRequestRemand: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03045', name: 'doTakeback', icon: 'fa fa-hand-stop-o', command: (event) => {this.invokeMethod(event, this.contentsList, 'doTakeback'); }};
	/** メニュー 取戻し */
	private menuItemAssignRetrieve: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03046', name: 'assignRetrieve', icon: 'fa fa-recycle', command: (event) => {this.invokeMethod(event, this.contentsList, 'assignRetrieve'); }};
	/** メニュー 差替え */
	private menuItemAssignReplacement: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03083', name: 'showFileReplacementExecutor', icon: 'fa fa-retweet', command: (event) => {this.invokeMethod(event, this.contentsList, 'showFileReplacementExecutor'); }};
	/** メニュー 処理待ち一覧 */
	private menuItemAssignPending: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03047', name: 'assignPending', icon: 'fa fa-hourglass-half', command: (event) => {this.invokeMethod(event, this.contentsList, 'assignPending'); }};
	/** メニュー プロパティ */
	private menuItemProperty: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03007', name: 'showProperty', icon: 'eim-icon-list', command: (event) => {this.invokeMethod(event, this.contentsList, 'showProperty'); }};
		/** メニュー 回付状況/履歴 */
	private menuItemStatusProperty: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03048', name: 'showStatusProperty', icon: 'fa fa-history eim-icon-history-color-gray', command: (event) => {this.invokeMethod(event, this.contentsList, 'showStatusProperty'); }};
	/** メニュー 改訂履歴 */
	private menuItemRevisionHistory: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03038', name: 'showRevisionHistory', icon: 'eim-icon-revision-history', command: (event) => {this.invokeMethod(event, this.contentsList, 'showRevisionHistory'); }};
	/** メニュー アクセス履歴 */
	private menuItemAccessHistory: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03039', name: 'showAccessHistory', icon: 'fa fa-history eim-icon-history-color-gray', command: (event) => {this.invokeMethod(event, this.contentsList, 'showAccessHistory'); }};
	/** メニュー セキュリティ */
	private menuItemSecurityChange: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03017', name: 'showSecurityChange', icon: 'eim-icon-security', command: (event) => {this.invokeMethod(event, this.contentsList, 'showSecurityChange'); }};
	/** メニュー テーブル管理 */
	private menuItemTableConfig: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03019', name: 'showTableConfig', icon: 'eim-icon-table', command: (event) => {this.invokeMethod(event, this.contentsList, 'showTableConfig'); }};
	/** メニュー お気に入り一覧 */
	private menuItemShowFavoriteList: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03076', name: 'showFavoriteList', icon: 'fa fa-star', command: (event) => {this.invokeMethod(event, this.contentsList, 'showFavoriteList'); }};
	/** メニュー お気に入りに追加 */
	private menuItemAddFavorite: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03077', name: 'addFavorite', icon: 'eim-icon-plus', command: (event) => {this.invokeMethod(event, this.contentsList, 'addFavorite'); }};
	/** メニュー チェックアウト一覧 */
	private menuItemShowCheckoutList: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03078', name: 'showCheckoutList', icon: 'eim-icon-checkout', command: (event) => {this.invokeMethod(event, this.contentsList, 'showCheckoutList'); }};
	/** メニュー 公開ファイル比較結果 */
	private menuItemShowCompareFileList: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03079', name: 'showCompareFileList', icon: 'eim-icon-table', command: (event) => {this.invokeMethod(event, this.contentsList, 'showCompareFileList'); }};
	/** メニュー ZIPダウンロード */
	private menuItemZipDownload: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03129', name: 'menuZipDownload', icon: '', command: (event) => {this.invokeMethod(event, this.contentsList, 'menuZipDownload'); }};
	/** メニュー 原本ファイルダウンロード */
	private menuItemPrivateDownload: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03131', name: 'menuPrivateDownload', icon: '', command: (event) => {this.invokeMethod(event, this.contentsList, 'menuPrivateDownload'); }};
	/** メニュー 公開ファイルダウンロード */
	private menuItemPublicDownload: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03130', name: 'menuPublicDownload', icon: '', command: (event) => {this.invokeMethod(event, this.contentsList, 'menuPublicDownload'); }};
	/** メニュー URLコピーメニュー */
	private menuItemURLCopy: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03096', name: 'menuURLCopy', icon: 'fa fa-download', command: (event) => {this.invokeMethod(event, this.contentsList, 'menuURLCopy'); }};
	/** メニュー URLショートカット出力 */
	private menuItemURLShortcutOutput: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03097', name: 'menuURLShortcutOutput', icon: 'fa fa-download', command: (event) => {this.invokeMethod(event, this.contentsList, 'menuURLShortcutOutput'); }};
	/** メニュー アクセス履歴CSV出力 */
	private menuItemAccessHistoryCSVOutput: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03098', name: 'menuAccessHistoryCSVOutput', icon: 'fa fa-download', command: (event) => {this.invokeMethod(event, this.contentsList, 'menuAccessHistoryCSVOutput'); }};
	/** メニュー タグに追加 */
	private menuItemAssignTag: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03116', name: 'assignTag', icon: 'fa fa-plus-square-o', command: (event) => {this.invokeMethod(event, this.contentsList, 'assignTag'); }};
	/** メニュー ワークスペース編集 */
	private menuItemShowWorkspaceEditor: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03088', name: 'showWorkspaceEditor', icon: '',
			command: (event) => {this.invokeMethod(event, this.contentsTree, 'showWorkspaceEditor'); }};
	/** メニュー ワークスペース削除 */
	private menuItemShowWorkspaceDelete: EIMMenuItem =
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03089', name: 'showWorkspaceDelete', icon: '',
			command: (event) => {this.invokeMethod(event, this.contentsTree, 'showWorkspaceDelete'); }};
	/** メニュー Box表示 */
	private menuItemShowBox: EIMMenuItem =
		{ label: '', name: 'showBox', icon: 'eim-icon-paste',
			command: (event) => { this.invokeMethod(event, this.contentsList, 'showBox')}};

	/** セパレータ */
	private menuItemSeparator: EIMMenuItem = { separator: true };
	/** OCRオプション直下セパレータ */
	private menuItemOCRSeparator: EIMMenuItem = { separator: true, name: 'OCRSeparator'};

	/** ツリーエリアのサイズ */
	public splitAreaFirstSize: number;
	/** ツリーエリアのサイズを読み込み済か否か */
	protected splitAreaSizeLoaded = false;

	/** 最後に設定したスプリットエリアのサイズ */
	protected lastSplitAreaSize: number[];

	/** アコーディオンタブに設定するスタイルClass名 */
	public accordionTabClass = '';

	/** 回付状況確認表示フラグ */
	public dspCirculationSituationView = true;

	/** 属性ツリービュー表示フラグ */
	public dspAttributeTreeView = false;

	/** preview thumbnailsVisible */
	//public thumbnailsVisible = false;

	/** サムネイル右クリックメニュー */
	public thumbnailsContextMenuItems: EIMMenuItem[] = [];

	/** サムネイルの大小状態（ワークスペースと検索で共通） */
	public isThumbnailLarge = false;

	/** 検索スキップフラグ */
	public searchSkipFlg = false;

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/** フラグ用数値：1 */
	private readonly FLAG_ON = 1;

	/** フラグ用数値：0 */
	private readonly FLAG_OFF = 0;

	/** セル編集可能かどうか */
	private isCellEditable = false;

	/** セル編集中かどうか */
	private isCellEditing = false;

	//
	// メインメニュー
	//
	/** メインメニュー */
	public mainMenuItems: EIMMenuItem[] = [
		// 新規
		Object.assign({}, this.menulistNew,
			{ items: [
				Object.assign({}, this.menuItemCreateDocument),
				Object.assign({}, this.menuItemCreateFolder ),
				Object.assign({}, this.menuItemCreateTag),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemCreateWorkspace),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemShowLumpDocumentCreator,
					{ items: [
						Object.assign({}, this.menuItemShowZip_expansion_registration),
						Object.assign({}, this.menuItemShowLumpFolderCreator),
					]}
				),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemShowCoverCreator),
			]}
		),
		// 改訂
		Object.assign(this.menulistRevision,
			{ items: [
				Object.assign({}, this.menuItemCheckout),
				Object.assign({}, this.menuItemCancelCheckout),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemCheckin),
			]}
		),
		// 編集
		Object.assign({}, this.menulistEdit,
			{ items: [
				Object.assign({}, this.menuItemCopy),
				Object.assign({}, this.menuItemCopyBranch),
				Object.assign({}, this.menuItemCut),
				Object.assign({}, this.menuItemPaste),
				Object.assign({}, this.menuItemRename),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemPasteFixedLink),
				Object.assign({}, this.menuItemPasteLatestLink),
				Object.assign({}, this.menuItemShowLinkUpdator),
				Object.assign({}, this.menuItemUpdateLatestLink),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemShowAssignTag),
				this.menuItemSeparator,
				// フォルダ複製
				Object.assign({}, this.menulistFolderReplication,
					{ items: [
						Object.assign({}, this.menuItemFolderOnly),
						Object.assign({}, this.menuItemIncludingDocumentReplicationFixedLink),
						Object.assign({}, this.menuItemIncludingDocumentReplicationLatestLink)
					]}
				),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemShowOCRSettingUpdator),
				Object.assign({}, this.menuItemExecuteOCR),
				Object.assign({}, this.menuItemCancelOCR),
				Object.assign({}, this.menuItemOCRSeparator),
				Object.assign({}, this.menuItemShowPublicFileCombineExecutor),
				Object.assign({}, this.menuItemShowPublicFileCompareExecutor),
				Object.assign({}, this.menuItemShowPublicFileSecurityUpdater),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemShowSignAndEncryption),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemDelete),
				this.menuItemSeparator,
			]}
		),
    	// 検索
		Object.assign(this.menulistSearch),
		// 承認/公開
		Object.assign(this.menulistApprovalRelease,
			{ items: [
				Object.assign({}, this.menuItemRequestApprove),
				Object.assign({}, this.menuItemCancelAproveRequest),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemApprove),
				Object.assign({}, this.menuItemAssignRequestRemand),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemPublic),
				Object.assign({}, this.menuItemCreatePublicPdf), // 公開PDFの事前変換
				Object.assign({}, this.menuItemPreSettingsPublicPdf), // 公開PDFの事前設定
				Object.assign({}, this.menuItemPublicCancel),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemAssignRetrieve),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemAssignReplacement), // 差替え
				this.menuItemSeparator,
				Object.assign({}, this.menuItemAssignPending), // 処理待ち一覧
			]}
		),
		// プロパティ
		Object.assign(this.menulistProperty,
			{ items: [
				Object.assign({}, this.menuItemProperty),
				Object.assign({}, this.menuItemSecurityChange),
				Object.assign({}, this.menuItemRevisionHistory),
				Object.assign({}, this.menuItemAccessHistory),
				Object.assign({}, this.menuItemStatusProperty),
			]}
		),
		// 表示
		Object.assign(this.menulistView),
		// マイスペース
		Object.assign(this.menulistMyspace,
			{ items: [
				Object.assign({}, this.menuItemShowFavoriteList),
				Object.assign({}, this.menuItemAddFavorite),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemShowCheckoutList),
				this.menuItemSeparator,
				Object.assign({}, this.menuItemShowCompareFileList),
			]}
		),
	];

	/** コンテンツツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
		// プロパティ
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03007', name: 'showProperty', icon: 'eim-icon-list', command: (event) => {this.invokeMethod(event, this.contentsTree, 'showProperty'); }},
		Object.assign({}, this.menuItemSeparator),
		// セキュリティ
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03017', name: 'showSecurityChange', icon: 'eim-icon-security', command: (event) => {this.invokeMethod(event, this.contentsTree, 'showSecurityChange'); }},
		// ワークスペース編集
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03088', name: 'showWorkspaceEditor', icon: '', command: (event) => {this.invokeMethod(event, this.contentsTree, 'showWorkspaceEditor'); }},
		// ワークスペース削除
		{label: '', rKey: 'EIM_DOCUMENTS.LABEL_03089', name: 'showWorkspaceDelete', icon: '', command: (event) => {this.invokeMethod(event, this.contentsTree, 'showWorkspaceDelete'); }}
	];

	/**
	 * ドキュメント一覧右クリックメニュー
	 */
	private documentContentsListMenuItems: EIMMenuItem[] = [
		// 0件の場合datagrid側でコンテキストメニューを非表示にするフラグを立てるが、
		// コンテキストメニューはサーバーの設定を読み込むため、初期処理時にはダミーを設定しておく
		{label: 'dummy', rKey: 'dummy', name: 'dummy', icon: '', command: null },
	];
	/** アコーディオン検索　右クリックメニュー */
	private accordionSearchContentsListMenuItems: EIMMenuItem[] = [];
	/** 回付状況確認　右クリックメニュー */
	private circulationSituationContentsListMenuItems: EIMMenuItem[] = [];
	/** 属性ツリービュー　右クリックメニュー */
	private attributeTreeContentsListMenuItems: EIMMenuItem[] = [];

	/** 公開ファイル結合コンテンツグリッドコンテキストメニュー */
	private combineContentsListMenuItems: EIMMenuItem[] = [
		Object.assign({}, this.menuItemAddPublicFileCombine),
	];

	/** 公開ファイル比較コンテンツグリッドコンテキストメニュー */
	private compareContentsListMenuItems: EIMMenuItem[] = [
		Object.assign({}, this.menuItemSourceDocument),
		Object.assign({}, this.menuItemDestinationDocument),
	];

	/** タグ追加コンテンツグリッドコンテキストメニュー */
	private tagContextMenuItems: EIMMenuItem[] = [
		Object.assign({}, this.menuItemAssignTag),
	]

	/** サムネイルのダウンロードボタンメニュー */
	private thumbnailDownloadButtonMenuItems: EIMMenuItem[] = [
		Object.assign({}, this.menuItemPrivateDownload),
		Object.assign({}, this.menuItemPublicDownload),
	]

	/** サムネイル上のボタン */
	private thumbnailDirectMenuButtonItems: EIMMenuItem[] = [
		Object.assign({}, this.menuItemProperty),
	]

	/**  メインメニュー */
	public mainMenu = this.mainMenuItems;

	/** パンくず */
	public breadcrumbItems: MenuItem[];

	/** Box連携オプション有無 */
	public boxIntegration = false;

	/** ユーザ別Box連携利用許可設定 */
	public boxUserInteg = false;

	/** ファイルドラッグ中かどうか */
	public isFileDragging = false;

	/** URLダイレクトアクセス後のグリッド選択対象オブジェクトID */
	private selectedObjIdAfterContentsAccess: number;

	/** ドキュメントメインコンポーネント情報 */
	public info: EIMDocumentMainComponentInfo;

	/** アコーディオンタブ変数 */
	public accordionActiveIndexData: Number

	/** リロードサブスクリプション */
	private reloadServiceReload: Subscription;

	/** ドロップファイルサブスクリプション */
	private dropFileServiceDropFile: Subscription;

	/** セッションタイムアウトサブスクリプション */
	private sessionTimeoutServiceSessionTimeout: Subscription;

	/** テーブルロードサブスクリプション */
	private contentsTableServiceLoadCompleted: Subscription;

	/** テーブル選択サブスクリプション */
	private contentsTableServiceSelectTableCompleted: Subscription;

	/** テーブル更新サブスクリプション */
	private contentsTableServiceUpdateTableCompleted: Subscription;

	/** 言語変更サブスクリプション */
	private translateServiceOnLangChange: Subscription;

	/** 場所クリック時のサブスクリプション */
	private placeRendererComponentServicePlaceClicked?: Subscription;

	/** プロパティ画面の対象にジャンプ押下時のサブスクリプション */
	private propertyJumpTargetClicked?: Subscription;

	/** プロパティ画面の更新完了時のサブスクリプション */
	private propertyUpdeted?: Subscription;

	/** ページクリック完了（本文抜粋表示時）サブスクリプション */
	private pageClickCompleted: Subscription;

	/** ページクリック完了（リスト表示時）サブスクリプション */
	private pageClickCompleted2: Subscription;


	/** アコーディオン間の情報保持用変数 */
	private accordionListInfo: any[] = [
		{state: null, columns: null, },
		{state: null, columns: null, searchExecuted: false, },
		{state: null, columns: null, searchExecuted: false, },
		{state: null, columns: null, },
		{state: null}
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected translateService: TranslateService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		public contentsMainComponentService: EIMDocumentMainComponentService,
		public contentsTreeComponentService: EIMContentsTreeComponentService,
		public contentsListComponentService: EIMContentsListComponentService,
		public attributeTreeComponentService: EIMAttributeTreeComponentService,
		protected authenticationService: EIMDocumentAuthenticationService,
		protected messageService: EIMMessageService,
		protected webDAVService: EIMWebDAVService,
		protected tableService: EIMTableService,
		protected serverConfigService: EIMServerConfigService,
		protected folderService: EIMFolderService,
		protected contentsService: EIMContentsService,
		protected historyRendererComponentService: EIMHistoryRendererComponentService,
		protected statusRendererComponentService: EIMStatusRendererComponentService,
		protected reloadService: EIMReloadService,
		protected dropFileService: EIMDropFileService,
		protected sessionTimeoutService: EIMSessionTimeoutService,
		public contentsTableService: EIMContentsTableService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected placeRendererComponentService: EIMPlaceRendererComponentService,
		protected workspaceService: EIMWorkspaceService,
		protected publicFileRendererComponentService: EIMPublicFileRendererComponentService,
		private location: Location,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,
		protected contentsPropertyComponentService: EIMContentsPropertyComponentService,
		protected documentFileService: EIMDocumentFileService,
		protected localStorageService: EIMLocalStorageService,
		protected dateService: EIMDateService,
		protected authorizationService: EIMBoxAuthorizationService,
		protected sessionStorageService: EIMSessionStorageService,
		protected pageRendererComponentService: EIMPageRendererComponentService,
		protected accordionSearchRendererComponentService: EIMAccordionSearchRendererComponentService,
		protected fileDragComponentService: BoxEIMFileDragComponentService,
		protected eimBoxContentsListComponentService: EIMBoxContentsListComponentService,
		protected eimBoxFileService: EIMBoxFileService,
		protected thumbnailService: EIMThumbnailService,
		public viewContainerRef: ViewContainerRef,
		public changeDetectorRef: ChangeDetectorRef,
		private zone: NgZone,
		protected userService: EIMDocumentsUserService,
		protected contextMenuService: EIMContextMenuService,
		protected httpService: EIMHttpService

	) {

		//作成者取得
		this.createUser = this.documentsCacheService.getLoginUser();

		// ツリーエリアサイズ指定
		this.splitAreaFirstSize = (385 / window.innerWidth) * 100;

		this.info = {
			preObjName: null,
			pasteSourceObj: null,
			addFileList: [],
			path: null,
			// CRUD処理完了後のハンドラ
			onComplete: (params: any) => {

				let info = params.info;
				let createdData = params.createdData;
				let updatedData = params.updatedData;
				let deletedData = params.deletedData;
				let createUponFlag = params.createUponFlag;
				let refreshData = params.refreshData;
				let noSelectFlag = params.noSelectFlag;
				let boxDocumentRegisterFlag = params.boxDocumentRegisterFlag;
				let lumpDocumentRegisterFlag = params.lumpDocumentRegisterFlag;

				if (refreshData) {
					info.contentsList.setData(refreshData);
					return;
				}
				let createFolderData: any[] = [];
				let deleteFolderData: any[] = [];
				if (deletedData && deletedData.length > 0) {
					for (let i = 0; i < deletedData.length; i++) {
						deleteFolderData.push(deletedData[i]);
					}

					info.contentsList.removeRowData(deletedData);

					// フォルダツリーへの反映
					if (deleteFolderData.length > 0) {
						this.contentsTreeComponentService.deleteNode(this.contentsTree.info, deleteFolderData);
					}
				}

				if (createdData && createdData.length > 0) {
					// グリッドリストに表示されている最後尾のフォルダのインデックス取得する
					let folderCount = -1;
					let tagCount = 0;
					let contentsList: any[] = info.contentsList.getData();
					for (let i = 0; i < contentsList.length; i++) {
						let contents: any = contentsList[i];
						if (contents.isDocument === false || contents.isDocument === this.FLAG_FALSE) {
							if (contents.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
								tagCount++;
							}
							folderCount++;
						}
					}

					let scrollPosIndex = 0;
					let selectedData: any[] = [];
					for (let i = 0; i < createdData.length; i++) {
						let data: any;
						if (createdData[i].hasOwnProperty('data')) {
							data = createdData[i].data;
						} else {
							data = createdData[i];
						}
						selectedData.push(data);
						let isFolder: boolean = data.isDocument === false || data.isDocument === this.FLAG_FALSE;
						let isTag: boolean = data.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG;

						if (isFolder) {
							createFolderData.push(data);
						}

						if (createdData[i].hasOwnProperty('additionalTarget') && createdData[i].additionalTarget) {
							// 対象行を取得
							let rowIndex: number = info.contentsList.getTargetRowIndex(createdData[i].additionalTarget);
							if (rowIndex !== -1) {
								// 対象行に追加
								if (!createUponFlag) {
									rowIndex++;
								}
								// ドキュメントリンクの場合、別履歴の同盟ファイルがあれば、追加位置を調整する
								if (data.isDocumentLink === 'true') {
									let listData = info.contentsList.getData();
									if (rowIndex < listData.length) {
										let nextData = info.contentsList.getDataByRowIndex(rowIndex);
										if (data.objName === nextData.objName) {
											rowIndex++;
										}
									}
								}
							} else {
								rowIndex = info.contentsList.getData().length;
							}
							info.contentsList.addRowDataToIndex([data], rowIndex);
							scrollPosIndex = rowIndex;
						} else if (isTag) {
							if (!createUponFlag) {
								folderCount++;
							}
							info.contentsList.addRowDataToIndex([data], tagCount);
							scrollPosIndex = tagCount;
						} else if (isFolder) {
							// 対象行に追加
							if (!createUponFlag) {
								folderCount++;
							}
							info.contentsList.addRowDataToIndex([data], folderCount);
							scrollPosIndex = folderCount;
						} else {
							if (boxDocumentRegisterFlag) {
								info.contentsList.updateDocumentRowData([data]);
								this.eimBoxContentsListComponentService.copyToEIMFlag = false;							
							} else {
								info.contentsList.addRowData([data]);
							}
							scrollPosIndex = info.contentsList.getData().length - 1;
						}
					}
					// グリッドのスクロール位置を設定
					info.contentsList.ensureIndexVisible(scrollPosIndex);
					// 追加したドキュメント・フォルダを選択状態にする
					if (noSelectFlag !== true) {
						info.contentsList.select(selectedData);
					}
					// フォルダツリーへの反映
					if (createFolderData.length > 0) {
						this.contentsTreeComponentService.addNode(info.contentsTree.info, info.contentsTree.getSelectedData()[0], createFolderData);

					}
				}

				if (updatedData && updatedData.length > 0) {
					if (lumpDocumentRegisterFlag) {
						info.contentsList.updateDocumentRowData(updatedData);
					} else {
						info.contentsList.updateRowData(updatedData);
					}
				}

				if(this.selectedWorkspaceDisplayTypeId == EIMConstantService.DISPLAY_THUMBNAIL){
					this.reloadService.doReload();
				}
			},
			// アコーディオン選択インデックス
			accordionActiveIndex: accordionIndex.WORKSPACE,
			isThumbnailsVisible:false,
			// コンテンツリストのコンテキストメニュー
			contentsListMenuItems: this.documentContentsListMenuItems,
			normalContentsListMenuItems: this.documentContentsListMenuItems,

			combineContentsListMenuItems: this.combineContentsListMenuItems,
			compareContentsListMenuItems: this.compareContentsListMenuItems,
			tagContextMenuItems: this.tagContextMenuItems,
			accordionSearchMenuItems: this.accordionSearchContentsListMenuItems,
			circulationSituationMenuItems: this.circulationSituationContentsListMenuItems,
			mainMenuItems: this.mainMenuItems,
			thumbnailDownloadButtonMenuItems: this.thumbnailDownloadButtonMenuItems,
			thumbnailDirectMenuButtonItems: this.thumbnailDirectMenuButtonItems,
			checkTargetDialogId: '',
			onChangeAccordionTab: (event) => {this.onChangeAccordionTab(event)},
			changeDialogId: (dialogId, checkTargetUpdate) => {this.changeDialogId(dialogId, checkTargetUpdate)},
		};

		// TranslateServiceでリソースが利用可能かどうかを判定する
		let checkKey = 'EIM_DOCUMENTS.LABEL_01016';
		let checkValue: string = this.translateService.instant(checkKey);
		if (checkKey !== checkValue) {
			// キーと値が一致していない場合はキーから値を取得できているので利用可能とみなす
			// メニューアイテムラベルを更新する
			this.refreshMenuItemLabel();
		}

		/**
		 * 最新の情報に更新イベントハンドラ.
		 * @param event イベント
		 */
		this.reloadServiceReload = this.reloadService.reload.subscribe( (event: any) => {

			// ツリー初期化対象外（他のコンポーネントの子コンポーネントとして表示している場合）の場合は何もしない
			if (this.disabledTreeInitialization) {
				return;
			}

			this.saveContentsInitState();
			this.ngOnInit();
			this.documentsCacheService.clearForReload();
			if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
				// ツリー選択状態
				let treeSelectedData: any = this.contentsTree.getSelectedData()[0];
				// グリッド選択状態
				let selectionTargetRows: any[] = [];
				this.contentsList.getSelectedData().forEach( (data: any) => {
					selectionTargetRows.push({objId: data.objId, isDocumentLink: data.isDocumentLink});
				});

				let objId: number = treeSelectedData ? treeSelectedData.objId : null;
				this.contentsTreeComponentService.updateLatest(this.contentsTree.info, objId, selectionTargetRows, this.contentsTree.initialized, this.contentsTree.selected);
			}	else if (this.info.accordionActiveIndex === accordionIndex.SEARCH) {
				if (this.accordionListInfo[accordionIndex.SEARCH].searchExecuted) {
					this.accordionListInfo[accordionIndex.SEARCH].searchExecuted = true;
					this.accordionSearch.onSearch();
				}
			}	else if (this.info.accordionActiveIndex === accordionIndex.CIRCULATION_SITUATION) {
				if (this.accordionListInfo[accordionIndex.CIRCULATION_SITUATION].searchExecuted) {
					this.accordionListInfo[accordionIndex.CIRCULATION_SITUATION].searchExecuted = true;
					this.circulation.search();
				}
			} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
				// ツリー選択状態
				let treeSelectedData: any = this.attrTree.getSelectedData()[0];
				// グリッド選択状態
				let gridSelectionRows: any[] = [];
				this.contentsList.getSelectedData().forEach( (data: any) => {
					gridSelectionRows.push({attrTreeId: data.attrTreeId, attrTreeValues: data.attrTreeValues});
				});

				let selectedNode;
				if (treeSelectedData) {
					selectedNode = {
						attrTreeId: treeSelectedData.attrTreeId,
						attrTreePath: treeSelectedData.attrTreePath,
						attrTreeSettings: treeSelectedData.attrTreeSettings,
						attrTreeValues: treeSelectedData.attrTreeValues,
						objId: treeSelectedData.objId,
					};
				}

				this.attributeTreeComponentService.updateLatest(this.attrTree.info, selectedNode, gridSelectionRows, this.attrTree.initialized, this.attrTree.selected);
			}
			this.changeDetectorRef.detectChanges();
		});

		/**
		 * ドロップファイルイベントハンドラ.
		 * @param event イベント
		 */
		this.dropFileServiceDropFile = this.dropFileService.dropFile.subscribe( (files: any[]) => {
			if (this.info.accordionActiveIndex === accordionIndex.SEARCH) {
				return;
			}
			this.info.addFileList = [];

			const isExistFolder = files.some(item => (!item.isFile));

			if(!isExistFolder){ // ドキュメント登録ウィンドウ
				const fileList = files.map(item =>{
					if(item.isFile){
						return item.file;
					}
				});

				// バリデーション エラーの場合はドキュメント登録ウィンドウを開かない
				let parentData: any[] = this.contentsTree.getSelectedData();
				let result: boolean = this.contentsMainComponentService.validation('showDocumentCreator', this.info, parentData, null, true);
				if (!result) {return};

					for (let i = 0; i < fileList.length; i++) {
						let file: File = fileList[i];
					this.info.addFileList.push(file);
				}

				// ドキュメント登録ウィンドウを開く
				this.invokeMethod(null, this.contentsList, 'showDocumentCreator');
			}
			else{
				// フォルダアップロードウィンドウ
				this.info.addFileList = files.filter((item) => {
					const isOneLevel = (item.fullPath.match(/\//g) || []).length === 1;
					return !(isOneLevel && item.file);
				});
				
				this.invokeMethod(null, this.contentsList, 'showLumpFolderCreator');
			}


		});

		/**
		 * セッションタイムアウトイベントハンドラ.
		 * @param message メッセージ
		 */
		this.sessionTimeoutServiceSessionTimeout =  this.sessionTimeoutService.sessionTimeout
			.subscribe( (message: string) => {
				this.messageService.show(EIMMessageType.error, message,
					() => {
					// キャッシュをクリアする
					this.documentsCacheService.clearAll();
					// SSOログインした場合は画面を再読み込みする
					const isSso = this.sessionStorageService.get(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME,
						EIMConstantService.SESSIONSTORAGE_KEY_SSO);
					this.sessionStorageService.removeItem(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME,
						EIMConstantService.SESSIONSTORAGE_KEY_SSO);
					if (isSso) {
						window.location.reload();
						return;
					}
					// ログイン画面に遷移する
					this.authenticationService.goToLogin();
			});
		});

		/**
		 * 言語変更イベントハンドラ.
		 * @param event イベント
		 */
		this.translateServiceOnLangChange = this.translateService.onLangChange.subscribe( (event: LangChangeEvent) => {
			this.refreshMenuItemLabel();
		});

		// ページクリック完了サブスクリプション
		this.pageClickCompleted = accordionSearchRendererComponentService.pageClicked.subscribe((params: any) => {this.pageClicked(params); });

		// ページクリック完了サブスクリプション
		this.pageClickCompleted2 = pageRendererComponentService.pageClicked.subscribe((params: any) => {this.pageClicked(params); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * データグリッドメニューのページクリックイベントハンドラ
	 * @param params パラメータ
	 */
	pageClicked(params: any): void {
		this.documentFileService.pageOpen(params);
	}
	/**
	 * ログインユーザ情報を取得します.
	 */
	public getLoginUserInfo() {
		this.info.loginUser = this.documentsCacheService.getLoginUser();
	}

	/**
	 * オプションメニューを表示します.
	 * @param メインメニューアイテムリスト
	 */
	public showOptionMenuItems(mainMenuItemList: EIMMainMenu[]): void {
		// メインメニュー判定フラグ
		let changeVisible: (menuItems: EIMMenuItem[], isMainMenuItems: boolean) => void = (menuItems: EIMMenuItem[], isMainMenuItems: boolean) => {
			for (let i = 0; i < menuItems.length; i++) {
				let menuItem: EIMMenuItem = menuItems[i];

				// メニューアイテムの名称と同名のオプションの有効判定
				menuItem.visible = this.isVisibleCheckOption(menuItem.name);
				// メインメニューのメニューアイテムの表示&非表示の切替
				if(isMainMenuItems){
					for (let j = 0; j < mainMenuItemList.length; j++) {
						if(menuItem.name === mainMenuItemList[j].itemEnName){
							if(mainMenuItemList[j].visible === false){
								menuItem.visible = false;
							}
						}
					}
				}
				if (menuItem.items && menuItem.items.length > 0) {
					changeVisible(menuItem.items,isMainMenuItems);
				}
			}
			// 連続しているセパレータを非表示
			let separatorCount = 0;
			for (let i = 0; i < menuItems.length; i++) {
				// 表示セパレータの場合
				if (menuItems[i].visible === true && menuItems[i].separator &&  menuItems[i].separator === true) {
					separatorCount++;
					// 連続している場合は非表示
					if (separatorCount > 1) {
						menuItems[i] = {visible: false};
					}
					continue;
				}
				// 表示メニューがあればリセット
				if (menuItems[i].visible === true && !menuItems[i].separator) {
					separatorCount = 0;
				}
			}
		};

		// メインメニュー
		changeVisible(this.mainMenuItems, true);
		let newMenuItems: EIMMenuItem[] = Object.assign([], this.mainMenuItems);
		this.mainMenuItems = newMenuItems;

		// コンテンツツリーコンテキストメニュー
		changeVisible(this.contentsTreeMenuItems, false);
		let newContentsTreeMenuItems: EIMMenuItem[] = Object.assign([], this.contentsTreeMenuItems);
		this.contentsTreeMenuItems = newContentsTreeMenuItems;

		// コンテンツグリッドコンテキストメニュー
		changeVisible(this.info.contentsListMenuItems, false);
		let newContentsListMenuItems: EIMMenuItem[] = Object.assign([], this.info.contentsListMenuItems);
		this.info.contentsListMenuItems = newContentsListMenuItems;

		// 検索一覧右クリックメニュー
		changeVisible(this.accordionSearchContentsListMenuItems, false);
		this.accordionSearchContentsListMenuItems = Object.assign([], this.accordionSearchContentsListMenuItems);

		// 回付状況確認一覧右クリックメニュー
		changeVisible(this.circulationSituationContentsListMenuItems, false);
		this.circulationSituationContentsListMenuItems = Object.assign([], this.circulationSituationContentsListMenuItems);

		// 属性ツリービュー右クリックメニュー
		changeVisible(this.attributeTreeContentsListMenuItems, false);
		this.attributeTreeContentsListMenuItems = Object.assign([], this.attributeTreeContentsListMenuItems);
	}

	/**
	 * コンテンツ一覧の同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public contentsListEquals(obj1: any, obj2: any): boolean {
		if (obj1.attrTreeId) {
			// 属性ツリービュー用の処理
			if (Number(obj1.attrTreeId) !== Number(obj2.attrTreeId)) {
				return false;
			}
			return (obj1.attrTreeValues
							&& JSON.stringify(obj1.attrTreeValues) === JSON.stringify(obj2.attrTreeValues))
					|| (obj1.objId
							&& Number(obj1.objId) === Number(obj2.objId));
		}
		return (Number(obj1.objId) === Number(obj2.objId)
							&& obj1.isDocumentLink === obj2.isDocumentLink);
	}

	/**
	 * セッション情報を取得し、その結果を受けてメニューなどの初期化処理を行います.
	 */
	// TODO documents.componentから流用。現状重複定義になっている。
	public getSessionUser() {

		// 処理待ちポップアップ表示
		this.userService.getSessionUser().subscribe(data => {
			// TODO
			let user = data.loginUser;
				if (Number(user.approveDocument) > 0 && user.isPopupExists == true) {
					this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00013' , {value: Number(user.approveDocument)}) ,
					() => {
						this.info.functionType = EIMConstantService.EVENT_FUNCTION_TYPE_WAIT;
						this.contentsMainComponentService.showApprove(this.info , null , [] );
					});
				}

			// サーバの設定ファイルの値を格納
			this.serverConfigService.setConfigValue(data.configKeyValue);

			// キャッシュに保存
			let loginUser: EIMUserDomain = new EIMUserDomain();
			loginUser.id = user.userId;
			loginUser.name = user.userName;
			loginUser.code = user.userCode;
			loginUser.kana = user.userKana;
			loginUser.mail = user.userMail;
			loginUser.admin = user.userAdmin;
			this.documentsCacheService.setLoginUser(loginUser);
			this.getLoginUserInfo();
			this.documentsCacheService.setJSessionId(data.configKeyValue['jSessionId']);
			// バージョン
			// TODO
			let version = this.serverConfigService.eimanagerDocumentVersion;

			// コンテキストメニュー設定
			this.contextMenuService.getContextItemListAndMainMenuItemList().subscribe(data => {
				this.setContextMenu(data[0]);
				// ドキュメント一覧のオプションメニュー表示／非表示切り替え
				this.showOptionMenuItems(data[1]);
			});

			// テーブルメニューを作成する
			this.contentsTableService.initialize();

			// アコーディオンタブのスタイルClass名を初期化(属性ツリーが表示対象かどうかserverConfigServiceに設定されている必要がある)
			this.initializeAccordionTabClass();
		});
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit(): void {
		this.info.contentsTree = this.contentsTree;
		this.info.attrTree = this.attrTree;
		this.info.contentsList = this.contentsList;
		this.info.csvDownloadList = this.csvDownloadList;
		this.info.isDisplayingBox = false;

		// URL設定
		let origin: string = window.location.origin; // http://localhost:4200

		// 原本/リンク選択URLのコンテキストルート生成（http://999.999.999.999:9999/eim）
		let contextRootForSelectObject = this.contextRootForSelectObject;
		if (!contextRootForSelectObject) {
			contextRootForSelectObject = origin + this.serverConfigService.getContextPath();
		}

		// 原本/リンク選択URLのルートパス生成（/documents/login）
		let routePathForSelectObject = this.routePathForSelectObject;
		if (!routePathForSelectObject) {
			routePathForSelectObject = EIMDocumentsConstantService.ROUTE_PATH_FOR_SELECT_OBJECT;
		}

		// ダウンロードURLのコンテキストルート生成（http://999.999.999.999:9999/eim）
		let contextRootForDownloadDocument = this.contextRootForDownloadDocument;
		if (!contextRootForDownloadDocument) {
			contextRootForDownloadDocument = origin + this.serverConfigService.getContextPath();
		}

		this.documentsCacheService.setDocumentURLCache({
			contextRootForSelectObject: contextRootForSelectObject,
			routePathForSelectObject: routePathForSelectObject,
			paramsForSelectObject: this.paramsForSelectObject,
			contextRootForDownloadDocument: contextRootForDownloadDocument
		});

		// AG-Grid v31以降: setGridOptionを使用
		if (this.contentsList.info.gridApi && !this.contentsList.info.gridApi.isDestroyed()) {
			this.contentsList.info.gridApi.setGridOption('getRowHeight', this.getRowHeight);
		} else {
			this.contentsList.info.gridOptions.getRowHeight = this.getRowHeight;
		}

		// 初期表示情報をローカルストレージから取得
		const initState = this.localStorageService.getDocumentInitState();

		// ツリー初期サイズ設定
		if (!this.splitAreaSizeLoaded) {
			if (typeof initState.treeAreaSize !== 'undefined') {
				this.splitAreaFirstSize = initState.treeAreaSize;
			}
			this.splitAreaSizeLoaded = true;
		}

		// セッションからBox領域の表示/非表示を取得
		const boxAreaState = this.documentSessionStorageService.getBoxAreaState();
		// Box領域の表示/非表示
		this.info.isDisplayingBox = boxAreaState.isDisplayingBox;

		// ページ再読み込み前の情報をセッションストレージから取得
		const info = this.documentSessionStorageService.getMainComponentInfoForPageReload();
		this.documentSessionStorageService.removeMainComponentInfoForPageReload();

		// セッションを保持している間は前回表示モードで初期表示
		if(info){
			this.selectedWorkspaceDisplayTypeId = this.documentSessionStorageService.getWorkspaceDisplayType();
			this.documentSessionStorageService.setWorkspaceDisplayType(this.selectedWorkspaceDisplayTypeId);

			this.selectedDisplayTypeId = this.documentSessionStorageService.getSearchDisplayType();
			this.documentSessionStorageService.setSearchDisplayType(this.selectedDisplayTypeId);
			this.preSelectedDisplayTypeId = this.selectedDisplayTypeId;
		}

		// コンテンツツリーの初期化を実行するか
		this.contentsTreeComponentService.disabledInitialization = this.disabledTreeInitialization;

		// URLダイレクトアクセス
		if (this.jumpTargetId) {
			this.contentsTreeSelectedData = [{
					objId: this.jumpTargetId,
					isFolder: this.isFolder,
					linkParentObjId: this.linkParentObjId,
			}];
		} else {
			// アコーディオンを直前の状態に戻す
			this.info.accordionActiveIndex = initState.accordionIndex;
			this.documentSessionStorageService.setAccordionActiveIndex(this.info.accordionActiveIndex);
			if (info) {
				if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE && info.selectedParentObjId) {
					// 再読み込み前に選択していたフォルダに遷移
					this.contentsTreeSelectedData = [{
						objId: info.selectedParentObjId,
						isFolder: 'true',
					}];
				} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE && info.selectedAttrTreeNode) {
					this.info.selectedAttrTreeNodeForPageReload = info.selectedAttrTreeNode;
				}
			}
			// アコーディオンタブ変数
			this.accordionActiveIndexData = this.info.accordionActiveIndex;
		}

		// メインメニューを初期化する
		this.mainMenu = this.initMainMenu(this.mainMenuItems, this.info, false);


		if (this.downloadPrivateFileObjId) {
			this.contentsMainComponentService.downloadPrivateFile(this.downloadPrivateFileObjId);
		}

		if (this.downloadPublicFileObjId) {
			this.contentsMainComponentService.downloadPublicFile(this.downloadPublicFileObjId);
		}

		// documents.componentsでURLパラメータを取得しているのでコンストラクタでURLのパラメータを削除する
		if (this.jumpTargetId) {
			this.location.go('/documents/main');
		}

		/**
		 * 対象コンテンツにジャンプする.
		 */
		this.contentsMainComponentService.contentsAccess$.subscribe( (data) => {
				this.contentsTreeComponentService.contentsAccess(this.contentsTree.info, data, true, this.contentsTree.initialized, this.contentsTree.selected);
			}
		);

		/**
		 * 対象コンテンツを選択する.
		 */
		this.contentsMainComponentService.onSelect$.subscribe( (data) => {
			this.contentsTreeComponentService.existsObject(this.contentsTree.info.data, data).subscribe((exist) => {
				if (exist) {
					this.contentsTreeComponentService.contentsAccess(this.contentsTree.info, data, false, this.contentsTree.initialized, this.contentsTree.selected);
				} else {
					this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_DOCUMENTS.INFO_00036'));
				}
			});
		});

		/**
		 * テーブル読み込み完了イベントハンドラ
		 */
		this.contentsTableServiceLoadCompleted = this.contentsTableService.loadCompleted.subscribe( (event: any) => {
			this.accordionSearch.customAttributeItems = [];

			for (let i = 0; i < event.columns.length; i++) {
				if (event.columns[i].headerName === this.translateService.instant('EIM_DOCUMENTS.LABEL_02214')) {
					Object.assign(event.columns[i], {type: EIMDataGridColumnType.number});
					event.columns[i].valueGetter = null;
					event.columns[i].cellRendererFramework = null;
				}
				if (event.columns[i].type === EIMDataGridColumnType.date || event.columns[i].type === EIMDataGridColumnType.dateTime) {
					event.columns[i].comparator = this.dateService.dateComparator;
				}
				this.accordionSearch.customAttributeItems.push({attType: event.columns[i].field, attName: event.columns[i].headerName, dataType: event.columns[i].type});
			}

			this.setTableMenuAndColumn(event.menuItems, event.columns);
		});

		/**
		 * テーブル選択完了イベントハンドラ
		 */
		this.contentsTableServiceSelectTableCompleted = this.contentsTableService.selectTableCompleted.subscribe( (event: any) => {
			this.accordionSearch.customAttributeItems = [];

			for (let i = 0; i < event.columns.length; i++) {
				if (event.columns[i].headerName === this.translateService.instant('EIM_DOCUMENTS.LABEL_02214')) {
					Object.assign(event.columns[i], {type: EIMDataGridColumnType.number});
					event.columns[i].valueGetter = null;
					event.columns[i].cellRendererFramework = null;
				}
				if (event.columns[i].type === EIMDataGridColumnType.date || event.columns[i].type === EIMDataGridColumnType.dateTime) {
					event.columns[i].comparator = this.dateService.dateComparator;
				}
				this.accordionSearch.customAttributeItems.push({attType: event.columns[i].field, attName: event.columns[i].headerName, dataType: event.columns[i].type});
			}
			if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
				// 本文抜粋選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForTextExcerpt = this.accordionListInfo[accordionIndex.SEARCH].state;
			} else if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
				// リスト選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForList = this.accordionListInfo[accordionIndex.SEARCH].state;
			} else { 
				// サムネイル選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForThumbnail = this.accordionListInfo[accordionIndex.SEARCH].state;
			}
			this.setTableMenuAndColumn(event.menuItems, event.columns);
		});

		/**
		 * テーブル更新完了イベントハンドラ
		 */
		this.contentsTableServiceUpdateTableCompleted = this.contentsTableService.updateTableCompleted.subscribe( (event: any) => {
			this.accordionSearch.customAttributeItems = [];

			for (let i = 0; i < event.columns.length; i++) {
				if (event.columns[i].headerName === this.translateService.instant('EIM_DOCUMENTS.LABEL_02214')) {
					Object.assign(event.columns[i], {type: EIMDataGridColumnType.number});
					event.columns[i].valueGetter = null;
					event.columns[i].cellRendererFramework = null;
				}
				if (event.columns[i].type === EIMDataGridColumnType.date || event.columns[i].type === EIMDataGridColumnType.dateTime) {
					event.columns[i].comparator = this.dateService.dateComparator;
				}
				this.accordionSearch.customAttributeItems.push({attType: event.columns[i].field, attName: event.columns[i].headerName, dataType: event.columns[i].type});
			}
			if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
				// 本文抜粋選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForTextExcerpt = this.accordionListInfo[accordionIndex.SEARCH].state;
			} else if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
				// リスト選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForList = this.accordionListInfo[accordionIndex.SEARCH].state;
			} else { 
				// サムネイル選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForThumbnail = this.accordionListInfo[accordionIndex.SEARCH].state;
			}
			this.setTableMenuAndColumn(event.menuItems, event.columns);
		});

		// 場所クリックイベントハンドラ
		if (!this.placeRendererComponentServicePlaceClicked) {
			this.placeRendererComponentServicePlaceClicked = this.placeRendererComponentService.placeClicked.subscribe((data: any) => {
				// アコーディオンを変更
				if (this.info.accordionActiveIndex !== accordionIndex.WORKSPACE) {
					this.onChangeAccordionTab({index: accordionIndex.WORKSPACE});
				}
				// コンテンツアクセス
				this.contentsTreeComponentService.contentsAccess(this.contentsTree.info, data, true, this.contentsTree.initialized, this.contentsTree.selected);
			});
		}

		// プロパティ画面の対象にジャンプ押下時のイベントハンドラ
		if (!this.propertyJumpTargetClicked) {
			this.propertyJumpTargetClicked = this.contentsPropertyComponentService.jumpTargetClicked.subscribe((data: any) => {
				// アコーディオンを変更
				if (this.info.accordionActiveIndex !== accordionIndex.WORKSPACE) {
					this.onChangeAccordionTab({index: accordionIndex.WORKSPACE});
				}
				let isPlace = true;
				if (data.isFolder === true) {
					isPlace = false;
				}
				// コンテンツアクセス
				this.contentsTreeComponentService.contentsAccess(this.contentsTree.info, data, isPlace, this.contentsTree.initialized, this.contentsTree.selected);
			});
		}

		// プロパティ画面の更新完了時のイベントハンドラ
		if (!this.propertyUpdeted) {
			this.propertyUpdeted = this.contentsPropertyComponentService.updated.subscribe((data: any) => {
				data[0].isDocumentLink = false;
				this.contentsMainComponentService.complete(this.info, {updatedData: data}, this.translateService.instant('EIM_DOCUMENTS.INFO_00002'), false, null);

				// ツリー更新
				let seravice = <EIMContentsTreeComponentService>this.info.contentsTree.componentService;
				seravice.updateNode(this.info.contentsTree.info, data[0]);

				// パンくず更新
				if (this.info.accordionActiveIndex !== accordionIndex.SEARCH) {
					this.setBreadcrumbItemsAndPath(this.info.contentsTree.info.selectedData[0]);
				}
			});
		}

		// アコーディオンタブのスタイルClass名を初期化
		this.initializeAccordionTabClass();
		/**
		 * Boxドキュメントドラッグイベントハンドラ.
		 */
		// ドラッグ開始／終了時にBlockUIの表示を切り替える
		this.dragStarted = this.fileDragComponentService.dragStarted$.subscribe(
			(_) => (this.boxFileDragging = true)
		);

		this.dragEnded = this.fileDragComponentService.dragEnded$.subscribe((_) => {
			this.boxFileDragging = false;
			this.fileDragEnterTarget = undefined;
		});
	}
		
	/**
	 * EIMへ公開ボタン押下イベントハンドラ
	 */
	onClickCopyToEIM(selectedDataForEIM?: any[]) {
		this.documentCreatorConfirmation(selectedDataForEIM);
	}
	
	/**
	 * ドキュメント登録確認ダイアログ表示
	 */
	private documentCreatorConfirmation(selectedDataForEIM) {
		if (this.info.accordionActiveIndex === accordionIndex.SEARCH) {
			return;
		}
		this.info.addFileList = [];

		//Boxファイルを一次格納フォルダにダウンロード
		//ダウンロードが成功した場合、ドキュメント登録確認ダイアログ表示
		this.eimBoxFileService
			.getBoxFile(selectedDataForEIM, this.createUser.id)
			.subscribe(
				(value) => {
					// バリデーション エラーの場合はウィンドウを開かない
					let parentData: any[] = this.contentsTree.getSelectedData();
					let result: boolean = this.contentsMainComponentService.validation(
						'showDocumentCreatorConfirmation',
						this.info,
						parentData,
						null,
						true
					);
					if (!result) {
						return;
					}
					for (let i = 0; i < selectedDataForEIM.length; i++) {
						let file: File = selectedDataForEIM[i];
						this.info.addFileList.push(file);
					}

					// ドキュメント登録確認ウィンドウを開く
					this.invokeMethod(
						null,
						this.contentsList,
						'showDocumentCreatorConfirmation'
					);
				},
				(error) => { }
			);
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.reloadServiceReload.closed) { this.reloadServiceReload.unsubscribe(); }
		if (!this.dropFileServiceDropFile.closed) { this.dropFileServiceDropFile.unsubscribe(); }
		if (!this.sessionTimeoutServiceSessionTimeout.closed) { this.sessionTimeoutServiceSessionTimeout.unsubscribe(); }
		if (!this.contentsTableServiceLoadCompleted.closed) { this.contentsTableServiceLoadCompleted.unsubscribe(); }
		if (!this.contentsTableServiceSelectTableCompleted.closed) { this.contentsTableServiceSelectTableCompleted.unsubscribe(); }
		if (!this.contentsTableServiceUpdateTableCompleted.closed) { this.contentsTableServiceUpdateTableCompleted.unsubscribe(); }
		if (!this.translateServiceOnLangChange.closed) { this.translateServiceOnLangChange.unsubscribe(); }
		if (!this.placeRendererComponentServicePlaceClicked.closed) { this.placeRendererComponentServicePlaceClicked.unsubscribe(); }
		if (!this.propertyJumpTargetClicked.closed) { this.propertyJumpTargetClicked.unsubscribe(); }
		if (!this.propertyUpdeted.closed) { this.propertyUpdeted.unsubscribe(); }
		if (!this.pageClickCompleted.closed) {this.pageClickCompleted.unsubscribe(); }
		if (!this.pageClickCompleted2.closed) {this.pageClickCompleted2.unsubscribe(); }
		if (this.dragStarted && !this.dragStarted.closed) {this.dragStarted.unsubscribe(); }
		if (this.dragEnded && !this.dragEnded.closed) { this.dragEnded.unsubscribe(); }

		// 購読を解除する
		this.completeSubject();

		// セッションストレージ情報を削除
		this.documentSessionStorageService.removeAll();
	}

	/** CSVエクスポートを実行します. */
	executeExportCsv(event): void {
		let oldState = this.info.contentsList.getState();

		if (this.info.accordionActiveIndex === accordionIndex.SEARCH && this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
			// 検索アコーディオンかつ本文抜粋表示の場合はワークスペース表示の列をCSV出力する（ページ列は不要なため、リスト用の設定は使わない）
			this.contentsList.setColumns(this.accordionListInfo[accordionIndex.WORKSPACE].columns);
		}

		let csv: string = this.contentsList.getDataAsCsv();
		this.documentFileService.downloadCSV(EIMDocumentsConstantService.OPE_HIST_APP_ID, event.fileName, csv);

		if (this.info.accordionActiveIndex === accordionIndex.SEARCH && this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
			// CSV出力用に変更した列設定を元に戻す
			this.contentsList.setColumns(this.createAccordionSearchColumnsForTextExcerpt());

			// 検索結果の状態を復帰します
			this.contentsList.setState(oldState);
		}
	}

	/** 検索を実行します. */
	executeAccordionSearch(event): void {

		// ワークスペースアコーディオンからテーブル変更した際にも呼び出されてしまうので、アクティブインデックスを条件に加える
		if (this.info.accordionActiveIndex === accordionIndex.SEARCH) {
			this.documentSessionStorageService.setSearchDisplayType(this.selectedDisplayTypeId);

			// 検索実行
			this.accordionListInfo[accordionIndex.SEARCH].searchExecuted = true;
			this.contentsList.initialize({
				accordionActiveIndex: this.info.accordionActiveIndex, params: event.params, 
				accordionSearch: this.accordionSearch, destroy$: this.destroy$}, true);
		}

	}

	/** 検索を実行します. */
	executeSearch(event): void {
		// 検索実行
		this.accordionListInfo[accordionIndex.CIRCULATION_SITUATION].searchExecuted = true;
		this.contentsList.initialize({
			accordionActiveIndex: this.info.accordionActiveIndex, params: event.params, 
			circulation: this.circulation, destroy$: this.destroy$}, true);
	}

	/** アコーディオン検索の検索条件のクリアを実行します. */
	executeAccordionSearchClearParams(): void {
		// 検索実行
		this.accordionListInfo[accordionIndex.SEARCH].searchExecuted = false;
		this.contentsListComponentService.clearDataList();
		this.contentsList.info.hitCount = 0;
		this.contentsList.setData([]);
	}
	/** 回付状況検索条件のクリアを実行します. */
	executeClearParams(): void {
		// 検索実行
		this.accordionListInfo[accordionIndex.CIRCULATION_SITUATION].searchExecuted = false;
		this.contentsList.setData([]);
	}


	/**
	 * フォルダツリーノード選択ハンドラ.
	 * 子オブジェクトを取得して、フォルダツリー、ドキュメント一覧を更新します.
	 * @param event イベント
	 */
	public onSelectFolderTreeNode(event: any): void {
		let treeNodes: EIMFolderTreeNode[] = event.selectedData as EIMFolderTreeNode[];
		let selectionTargetRows: number[];
		if (event.params && event.params.selectionTargetRows) {
			selectionTargetRows = event.params.selectionTargetRows;
		} else {
			selectionTargetRows = [];
		}

		if (!treeNodes || treeNodes.length === 0) {
			// 選択しているワークスペース、フォルダをクリアする
			this.info.selectedWorkspaceObjId = null;
			this.info.selectedParentObjId = null;
			// パンくず・パスをクリアする
			this.setBreadcrumbItemsAndPath();
			// 選択状態クリア
			this.contentsList.select([],false);
			// コンテンツグリッド
			this.contentsList.setData([]);
		} else {
			// メインメニューを初期化する
			let treeNode: EIMFolderTreeNode = treeNodes[0];
			let isSelectTag = this.isTagToTreeNode(treeNode);
			this.mainMenu = this.initMainMenu(this.mainMenuItems, this.info, isSelectTag);

			// 所属するワークフローのオブジェクトIDを更新する
			let rootTreeNode: EIMFolderTreeNode = this.hierarchicalDomainService.getRoot(treeNode) as EIMFolderTreeNode;
			this.info.selectedWorkspaceObjId = rootTreeNode.objId;
			this.info.selectedParentObjId = treeNode.objId;
			this.info.selectedParent = treeNode;

			// パンくず・パスをセットする
			this.setBreadcrumbItemsAndPath(treeNode);

			// ドキュメントリンク指定がある場合
			let targetDocumentLink = false;
			if (event.params && event.params.hasOwnProperty('selectionTargetDocumentLink')) {
				targetDocumentLink = event.params.selectionTargetDocumentLink;
			}

			// 選択状態クリア
			this.contentsList.select([],false);

			// コンテンツ一覧を更新する
			this.contentsList.initialize({
					noupdate: false, accordionActiveIndex: this.info.accordionActiveIndex,
					selectedTreeNode: treeNode, selectionTargetRows: selectionTargetRows,
					targetDocumentLink: targetDocumentLink,
					eventDateTime: event.eventDateTime ? event.eventDateTime : new Date(),
					destroy$: this.destroy$}, true);
		}
	}

	/**
	 * 属性ツリービュー用フォルダツリーノード選択ハンドラ.
	 * 子オブジェクトを取得して、フォルダツリー、ドキュメント一覧を更新します.
	 * @param event イベント
	 */
	public onSelectAttributeTreeNode(event: any): void {

		let attributTtreeNodes: EIMAttributeTreeNode[] = event.selectedData as EIMAttributeTreeNode[];

		if (!attributTtreeNodes || attributTtreeNodes.length === 0) {
			// 選択しているワークスペース、フォルダをクリアする
			this.info.selectedWorkspaceObjId = null;
			this.info.selectedParentObjId = null;
			// パンくず・パスをクリアする
			this.setBreadcrumbItemsAndPath();
			// コンテンツグリッド
			this.contentsList.setData([]);
		} else {
			let attributTtreeNode: EIMAttributeTreeNode = attributTtreeNodes[0];

			// 所属するワークフローのオブジェクトIDを更新する
			let rootTreeNode: EIMAttributeTreeNode = this.hierarchicalDomainService.getRoot(attributTtreeNode) as EIMAttributeTreeNode;
			this.info.selectedWorkspaceObjId = rootTreeNode.attrTreeId;
			this.info.selectedParentObjId = attributTtreeNode.attrTreeId;

			// パンくず・パスをセットする
			this.setBreadcrumbItemsAndPath(attributTtreeNode);

			// コンテンツ一覧を更新する
			this.contentsList.initialize({
					accordionActiveIndex: this.info.accordionActiveIndex, contentsList: this.contentsList,
					selectedTreeNode: attributTtreeNode,
					eventDateTime: event.eventDateTime ? event.eventDateTime : new Date(),
					destroy$: this.destroy$}, true);
			this.attrTree.expand(rootTreeNode, true);
		}
	}

	/**
	 * コンテンツツリー初期化イベントハンドラ
	 */
	public onInitializedContentsTree($event: any): void {
		if ($event && $event.selectedData && $event.selectedData.length) {
			this.contentsTree.ensureIndexVisible($event.selectedData[0]);
		}
	}

	/**
	 * ツリーノードをオープンイベントハンドラ
	 */
	public onExpandTreeNode(treeNodes: EIMFolderTreeNode[]): void {
		let treeNode: EIMFolderTreeNode = treeNodes[0];

		// 選択ツリーノードの下ノードをセットしていない場合(セット済みの場合はisSearchの値はtrue)
		if (!treeNode.isSearch) {
			// コンテンツ一覧を更新する
			this.contentsList.initialize({
				accordionActiveIndex: this.info.accordionActiveIndex, selectedTreeNode: treeNode, 
				noUpdate: true, destroy$: this.destroy$}, true);
		}
	}

	/**
	 * 属性ツリーノードをオープンイベントハンドラ
	 */
	public onExpandAttributeTreeNode(attributetreeNodes: EIMAttributeTreeNode[]): void {
		let attributetreeNode: EIMAttributeTreeNode = attributetreeNodes[0];

		// 選択ツリーノードの下ノードをセットしていない場合(セット済みの場合はisSearchの値はtrue)
		if (!attributetreeNode.isSearch) {
			// コンテンツ一覧を更新する
			this.contentsList.initialize({
				selectedTreeNode: attributetreeNode, noUpdate: true, 
				accordionActiveIndex: this.info.accordionActiveIndex, destroy$: this.destroy$}, true);
		}
	}

	/**
	 * グリッド内フォルダ選択ハンドラ.
	 * @param treeNode 選択ツリーノード
	 */
	public onSelectFolderGridItem(treeNode: any): void {
		if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
			// ワークスペースアコーディオンの場合
			let node: EIMFolderTreeNode = { objId: Number(treeNode.objId)};
			node['targetpath'] = this.info.contentsListPath;
			this.contentsTree.select([node], true);
		} else if (this.info.accordionActiveIndex === accordionIndex.CIRCULATION_SITUATION
					|| this.info.accordionActiveIndex === accordionIndex.SEARCH) {
			// 検索アコーディオンまたは回付状況アコーディオンの場合
			this.onChangeAccordionTab({index: accordionIndex.WORKSPACE});
			let node: EIMFolderTreeNode = { objId: Number(treeNode.objId)};
			this.contentsTreeComponentService.existsObject(this.contentsTree.info.data, node).subscribe((exist) => {
				if (exist) {
					this.contentsTreeComponentService.contentsAccess(this.contentsTree.info, node, false, this.contentsTree.initialized, this.contentsTree.selected);
				} else {
					this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_DOCUMENTS.INFO_00036'));
				}
			});

		} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
			// 属性ツリービューアコーディオンの場合
			let node: EIMAttributeTreeNode = { attrTreeId: treeNode.attrTreeId, attrTreeValues: treeNode.attrTreeValues, value: treeNode.value};
			this.attributeTreeComponentService.selectNode(this.attrTree, node, true);
		}
	}

	/**
	 * コンテンツリスト初期化ハンドラ.
	 * @param event イベント
	 */
	public onInitializeContentsList(event): void {
		if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
			// グリッドに表示しているツリーのフォルダノード
			let treeNode: EIMFolderTreeNode = event.serviceParam.selectedTreeNode;
			if (!treeNode) {
				return;
			}

			// コンテンツリストで表示しているパスを設定
			this.info.contentsListPath = this.createSearchPath(treeNode);
			if (treeNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
				treeNode.isTrash = true;
				treeNode.expanded = false;
			}

			// ツリー選択ノードにグリッドデータ(子データ)をセットする
			let data: any[] = event.serviceParam.contentsList;
			if (!data || data.length === 0) {
				// 0件の場合
				data = [];
				treeNode.leaf = true;
				treeNode.isBranch = false;
				treeNode.isSearch = true;
			} else if (data.length > 0 && !treeNode.isTrash) {

				let childFolderItems: EIMFolderTreeNode[] = [];
				for (let i = 0; i < data.length; i++) {
					let folderItem = data[i];
					let tn: EIMFolderTreeNode = this.contentsTreeComponentService.convertRowDataToEIMFolderTreeNode(folderItem)
					// ワークスペース固有ごみ箱のプロパティをセットする
					if(folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN){
						folderItem.isTrash = 'true';
						tn.leaf = true;
						tn.isBranch = false;
						tn.isSearch = true;
					}
					if (folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE
						|| folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER
						|| folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG
						|| folderItem.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE_TRASH_CAN) {
							childFolderItems.push(tn);
					}
				}
				this.contentsTree.setChildren(treeNode, childFolderItems);
				treeNode.expanded = true;
				// セット済みをtrueにする
				treeNode.isSearch = true;
			}
		} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
			// 属性ツリー表示時
			// グリッドに表示しているツリーのフォルダノード
			let selectedTreeNode: EIMAttributeTreeNode = event.serviceParam.selectedTreeNode;
			if (!selectedTreeNode) {
				return;
			}
			// ツリー選択ノードにグリッドデータ(子データ)をセットする
			let data: any[] = event.serviceParam.contentsList;
			if (!data || data.length === 0) {
				// 0件の場合
				data = [];
				selectedTreeNode.leaf = true;
				selectedTreeNode.isBranch = false;
				selectedTreeNode.isSearch = true;
			} else if (data.length > 0 && !selectedTreeNode.isTrash) {
				let childNodes: EIMAttributeTreeNode[] = [];
				for (let i = 0; i < data.length; i++) {
					let rowData = data[i];
					if (rowData.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE
						|| rowData.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER
						|| rowData.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {

						let node: EIMAttributeTreeNode;
						node = this.attributeTreeComponentService.convertRowDataToEIMAttributeTreeNode(rowData);

						// 親から不足属性を補完する
						this.attributeTreeComponentService.complementChildNodeData(selectedTreeNode, node);
						childNodes.push(node);
					}
				}
				this.attrTree.setChildren(selectedTreeNode, childNodes);
				selectedTreeNode.expanded = true;
				// セット済みをtrueにする
				selectedTreeNode.isSearch = true;
			}
		}
	}


	/**
	 * コンテンツグリッドエラーハンドラ.
	 * @param event イベント
	 */
	public onContentsListError(event: any): void {

	}

	/**
	 * グリッド行ダブルクリックイベントハンドラ
	 * @param event イベント
	 */
	public onRowDoubleClicked(event: any): void {
		// セル編集状態を解除する
		this.contentsList.info.gridApi.stopEditing();
		if (event.event.target.className.match('eim-document-main-single-clickable')) {
			return;
		}
		// プロパティ画面を表示する
		let parentData: any;
		// アコーディオン：ドキュメント一覧を表示している場合
		if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
			parentData = this.contentsTree.getSelectedData()[0];
		} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
			// アコーディオン：属性ツリービューを表示している場合
			parentData =  this.attrTree.getSelectedData()[0];
		}
		let selectedData: any[] = [event.data];
		this.contentsMainComponentService.invokeMethod('showProperty', this.info, parentData, selectedData);
	}


	/**
	 * コンテンツツリー右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * メニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	public onContextMenuContentsTree(event: MouseEvent): void {
		window.setTimeout(() => {
			let selectedData: any[] = this.contentsTree.getSelectedData();

			for (let i = 0; i < this.contentsTreeMenuItems.length; i++) {
				let menuItem: EIMMenuItem = this.contentsTreeMenuItems[i];
				let result: boolean = this.contentsMainComponentService.validation(menuItem.name, this.info, selectedData, selectedData);
				if (result) {
					menuItem.disabled = false;
				} else {
					menuItem.disabled = true;
				}
			}
			// ワークスペース編集メニューの活性／非活性切り替え
			// 選択がワークスペース、かつ、ユーザにシステム管理のワークスペース管理権限が無い場合
			if (selectedData.length > 0 && selectedData[0].objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE
				&& !this.hasWorkspaceSystemAuth(this.info.loginUser.admin)) {

				// メニュー非活性
				let workspaceEditMenu: EIMMenuItem;
				for (let i = 0; i < this.contentsTreeMenuItems.length; i++) {
					if (this.contentsTreeMenuItems[i].name === 'showWorkspaceEditor') {
						workspaceEditMenu = this.contentsTreeMenuItems[i];
						break;
					}
				}
				workspaceEditMenu.disabled = true;

				// 選択ワークスペースの管理者に設定されている場合は活性に戻す
				this.workspaceService.dspWorkspaceAuth(selectedData[0].objId).subscribe(
					(res: any) => {
						if (res.value.root.workspaceAuth.attr.flag === this.FLAG_TRUE) {
							workspaceEditMenu.disabled = false;
						}
				});
			}
		});
	}

	/**
	 * カレントviewを取得
	 */
	private getCurrentView(){
		let target :EIMListComponent<any> = null;
		if(this.info.isThumbnailsVisible){
			target = this.thumbnailViewer;
		}else{
			target = this.contentsList;
		};
		return target;
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * メニューアイテムの活性非活性制御を行う
	 */
	public onContextMenuContentsList(event: MouseEvent): void {
		window.setTimeout(() => {
			let parentData = {};
			// アコーディオン：ドキュメント一覧を表示している場合
			if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
				parentData = this.contentsTree.getSelectedData();
			} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
				// アコーディオン：属性ツリービューを表示している場合
				parentData =  this.attrTree.getSelectedData();
			}
			let selectedData: any[];

			selectedData = this.contentsList.getSelectedData();

			for (let i = 0; i < this.info.contentsListMenuItems.length; i++) {
				let menuItem: EIMMenuItem = this.info.contentsListMenuItems[i];
				let result: boolean = this.contentsMainComponentService.validation(menuItem.name, this.info, parentData, selectedData);
				if (result) {
					menuItem.disabled = false;
				} else {
					menuItem.disabled = true;
				}
			}
		});
	}

    /**
     * サムネイルのダウンロードボタンクリックイベントハンドラ.
     * PrimNGのコンテキストメニュー表示前に呼び出されるので
     * メニューアイテムの活性非活性制御を行う
     */
    public onThumbnailDownloadMenu(event: MouseEvent): void { 
        window.setTimeout(() => {
            let parentData = this.contentsTree.getSelectedData();
            const selectedData = this.contentsList.getSelectedData();

            this.validationMenuItems(parentData, selectedData, this.info.thumbnailDownloadButtonMenuItems);
        });
    }
    /**
     * メニューアイテムの活性非活性制御を行う
     */
    private validationMenuItems(parentData: {}, selectedData: any[], menuItems: any[]) {
        for (let i = 0; i < menuItems.length; i++) {
            let menuItem: EIMMenuItem = menuItems[i];
            let result: boolean = this.contentsMainComponentService.validation(menuItem.name, this.info, parentData, selectedData);
            if (result) {
                menuItem.disabled = false;
            } else {
                menuItem.disabled = true;
            }
        }
    }

	/**
	 * 選択行のセルクリックイベントハンドラ
	 * @param event イベント
	 */
	public onSelectedRowCellClicked(event: any): void {
		if (!this.isCellEditing 
				&& event.data.objTypeName !== EIMDocumentsConstantService.OBJECT_TYPE_ATTRIBUTE 
				&& event.colDef.field === 'objName') {
			this.isCellEditable = this.doRename();
		}
	}

	/**
	 * キーダウンイベントハンドラ.
	 * @param event イベント
	 */
	@HostListener('document:keydown', ['$event'])
	public handleKeyboardEvent(event: KeyboardEvent): void {

		// ダイアログが開いている最中はスキップ
		if (this.documentDialogManager.dialogs.length !== 0) {
			return;
		}

		// セル編集中はスキップ
		if (this.isCellEditing) {
			return;
		}

		if (event.key == 'F2' && this.contentsList.getSelectedData().length === 1) {
			this.info.keyDownFlg = true;
			this.isCellEditable = this.doRename();
			this.info.keyDownFlg = false;
		}
	}

	/**
	 * アンロードイベントハンドラ.
	 * @param _event イベント
	 */
	@HostListener('window:unload', ['$event'])
	public onUnload(_event: any): void {
		// ページ再読み込み用の情報を保存
		this.savePageReloadState();
		// ページ初期化情報を保存
		this.saveContentsInitState();
	}

	/**
	 * 改名可能かどうかを判定します.
	 * @return 改名可能な場合true
	 */
	private doRename(): boolean {
		let parentData: any[];
		if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
			parentData = this.contentsTree.getSelectedData();
		} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
			parentData = this.attrTree.getSelectedData();
		}
		let selectedData: any[] = this.contentsList.getSelectedData();
		// invokeMethodメソッド内でもチェック処理が実行されるが、事前にチェックして改名できない場合は編集状態を解除する
		let result: boolean = this.contentsMainComponentService.validation('rename', this.info, parentData, selectedData, false);
		if (result) {
			// 改名
			this.invokeMethod(null, this.contentsList, 'rename');
		} else {
			this.contentsList.stopEditing();
		}
		return result;
	}

	/**
	 * グリッド行選択イベントハンドラ.
	 * @param event イベント
	 */
	public onSelect(event: any): void {
		/**EIMANAGERに公開ボタンを非活性に変更 */
		this.eimBoxContentsListComponentService.documentPublicFlag();
		/**Boxデータグリッドを更新 */
		this.eimBoxContentsListComponentService.boxDataGridRefresh();

		this.contentsList.info.gridApi.stopEditing();

		this.contentsMainComponentService.selectedContensHandler(this.contentsList.getSelectedData());
	}

	/**
	 * グリッドセル編集開始イベントハンドラ.
	 * @param event イベント
	 */
	public onCellEditingStarted(event: any): void {
		
		// セル編集中フラグをON
		this.isCellEditing = true;

		// 改名前オブジェクト名を保持
		let selectedData: any[] = this.contentsList.getSelectedData();
		if (selectedData && selectedData.length !== 0) {
			this.info.preObjName = selectedData[0].objName;
		}
	}

	/**
	 * グリッドセル編集終了イベントハンドラ
	 * @param event イベント
	 */
	public onCellEditingStopped(event: any): void {
		
		// セル編集中フラグをOFF
		this.isCellEditing = false;
		this.isCellEditable = false;

		// 後処理
		let postProc: () => void = () => {
			// グリッド再描画
			this.contentsList.info.gridApi.redrawRows();
			// 改名前の名称をクリア
			this.info.preObjName = '';
		};

		// 空の場合、エラー
		if (!event.data.objName || event.data.objName == '') {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00012'));
			// 改名前に戻す
			this.revertBeforeRename(event.data);
			postProc();
			return;
		}

		if (this.info.preObjName != event.data.objName) {

			// フォルダの場合問い合わせを行う
			if (event.data.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
				this.contentsService.getRenameInfo(event.data.objId)
				.subscribe(
					(object: any) => {
						if (Number(object.attr.nameAllocate) === this.FLAG_OFF) {
							this.executeRename(event, postProc);
						} else {
							this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00112'));
							this.revertBeforeRename(event.data);
							postProc();
						}
					},
					(err: any) => {
					// エラーの場合、改名前に戻す
					this.revertBeforeRename(event.data);
					},
				);
			} else {
				this.executeRename(event, postProc);
			}
		} else {
			// 表紙ドキュメントの場合
			if (event.data.isCoverForScanning === this.FLAG_TRUE) {
				// 改名前に戻す
				this.revertBeforeRename(event.data);
				postProc();
			}
		}
	}

	/**
	 * アコーディオンタブ変更イベントハンドラ
	 * @param event イベント
	 */
	public onChangeAccordionTab(event: any): void {

		// 購読を解除する
		this.completeSubject();

		// アコーディオンタブ変更前のインデックス
		let prevAccordionActiveIndex: number = this.info.accordionActiveIndex;

		this.accordionListInfo[prevAccordionActiveIndex].state = this.contentsList.getState();
		if (prevAccordionActiveIndex === accordionIndex.SEARCH) {
			if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
				// 本文抜粋選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForTextExcerpt = this.accordionListInfo[accordionIndex.SEARCH].state;
			} else if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
				// リスト選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForList = this.accordionListInfo[accordionIndex.SEARCH].state;
			} else { 
				// サムネイル選択時
				this.accordionListInfo[accordionIndex.SEARCH].stateForThumbnail = this.accordionListInfo[accordionIndex.SEARCH].state;
			}
		}

		// アコーディオンタブインデックス変数を再セットする
		this.info.accordionActiveIndex = event.index;
		this.accordionActiveIndexData = this.info.accordionActiveIndex;
		this.documentSessionStorageService.setAccordionActiveIndex(this.info.accordionActiveIndex);

		// メインメニューを初期化する
		this.mainMenu = this.initMainMenu(this.mainMenuItems, this.info, false);

		// 前回タブが回付状況確認、検索アコーディオン以外の場合は共通ステートを更新する
		if (prevAccordionActiveIndex !== accordionIndex.CIRCULATION_SITUATION && prevAccordionActiveIndex !== accordionIndex.SEARCH) {
			this.accordionListInfo[COMMON_STATE].state = this.accordionListInfo[prevAccordionActiveIndex].state;
		}
		switch (this.info.accordionActiveIndex) {
			case accordionIndex.WORKSPACE: {

				if(this.selectedWorkspaceDisplayTypeId == EIMConstantService.DISPLAY_THUMBNAIL){
					this.thumbnailON();
				}else{
					this.thumbnailOFF();
				}
				// ワークスペース
				// 右クリックメニュー変更
				this.info.contentsListMenuItems = this.documentContentsListMenuItems;
				this.info.normalContentsListMenuItems = this.documentContentsListMenuItems;

				// パンくずリスト表示
				let treeNode = this.contentsTree.getSelectedData()[0];
				this.setBreadcrumbItemsAndPath(treeNode);

				// コンテンツリストの情報を復帰
				let state = this.accordionListInfo[event.index].state;
				if (state !== null) {
					if (!this.accordionListInfo[COMMON_STATE].state) {
						this.contentsList.setState(state);
					} else {
						this.contentsList.setState(this.assignCommonState(state, this.accordionListInfo[COMMON_STATE].state));
					}
					this.contentsList.setColumns(this.accordionListInfo[event. index].columns);
				} else {
					this.contentsList.setData([]);
					if (!this.accordionListInfo[COMMON_STATE].state) {
						// ワークスペースタブと属性ツリータブ選択時は、右ペインの一覧表示のカラム情報を共通にする
						this.contentsList.setColumns(this.accordionListInfo[event. index].columns ?? []);
						this.setContentsInitState(event. index);
					} else {
						this.contentsList.setState(this.assignCommonState({}, this.accordionListInfo[COMMON_STATE].state));
					}
				}

				break;
			}
			case accordionIndex.SEARCH: {
				if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_THUMBNAIL) {
					this.thumbnailON();
				} else {
					this.thumbnailOFF();
				}

				let treeNode = this.contentsTree.getSelectedData()[0];
				if (treeNode !== undefined) {
					this.info.path = this.createSearchPath(treeNode);
					// 検索アコーディオンの検索対象パスを更新する
					let searchPath: string = this.createSearchPath(treeNode);
					this.accordionSearch.info.condition.searchPath = searchPath;
					// 検索対象パスがごみ箱かどうかの判定
					this.accordionSearch.info.condition.isTrash =
						treeNode.data.isTrash || treeNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TRASH_CAN ? true : false;
					// 検索対象のラジオボタン制御
					if (!searchPath || searchPath === '/') {
						this.accordionSearch.info.condition.pathCondition = this.FLAG_FALSE;
					} else {
						this.accordionSearch.info.condition.pathCondition = this.FLAG_TRUE;
					}
				}

				// 右クリックメニュー変更
				this.info.contentsListMenuItems = this.accordionSearchContentsListMenuItems;
				this.info.normalContentsListMenuItems = this.accordionSearchContentsListMenuItems;
				// パンくずリスト非表示
				this.setBreadcrumbItemsAndPath();
				// コンテンツリストの情報を復帰
				let state = null;
				if (this.selectedDisplayTypeId === 0) {
					state = this.accordionListInfo[event.index].stateForTextExcerpt;
				}
				else {
					state = this.accordionListInfo[event.index].stateForList;
				}
				this.contentsList.setState(state);
				if (state == null) {
					this.contentsList.setData([]);
					this.contentsList.setColumns(this.accordionListInfo[event.index].columns ?? []);
					this.setContentsInitState(event.index);
				}
				// 本文抜粋/リストの選択状態に応じて行高さを設定
				this.contentsList.info.gridApi.resetRowHeights();

				break;
			}
			case accordionIndex.CIRCULATION_SITUATION: {
				// 回付状況/確認
				this.thumbnailOFF();

				// 右クリックメニュー変更
				this.info.contentsListMenuItems = this.circulationSituationContentsListMenuItems;
				this.info.normalContentsListMenuItems = this.circulationSituationContentsListMenuItems;
				// パンくずリスト非表示
				this.setBreadcrumbItemsAndPath();

				// コンテンツリストの情報を復帰
				let state = this.accordionListInfo[event.index].state;
				if (state !== null) {
					this.contentsList.setState(state);
				} else {
					this.contentsList.setData([]);
					this.contentsList.setColumns(this.accordionListInfo[event.index].columns ?? []);
					this.setContentsInitState(event. index);
					this.circulation.init();
				}

				break;
			}
			case accordionIndex.ATTRIBUTE_TREE: {
				// 属性ツリービュー
				this.thumbnailOFF();

				// 右クリックメニュー変更
				this.info.contentsListMenuItems = this.attributeTreeContentsListMenuItems;
				this.info.normalContentsListMenuItems = this.attributeTreeContentsListMenuItems;
				// パンくずリスト表示
				let treeNode = this.attrTree.getSelectedData()[0];
				this.setBreadcrumbItemsAndPath(treeNode);

				// コンテンツリストの情報を復帰
				let state = this.accordionListInfo[event.index].state;
				if (state !== null) {
					this.contentsList.setState(this.assignCommonState(state, this.accordionListInfo[COMMON_STATE].state));
				} else {
					if (!this.accordionListInfo[COMMON_STATE].state) {
						// ワークスペースタブと属性ツリータブ選択時は、右ペインの一覧表示のカラム情報を共通にする
						this.contentsList.setColumns(this.accordionListInfo[event.index].columns ?? []);
						this.setContentsInitState(event.index);
						this.contentsList.setData([]);
					} else {
						this.contentsList.setState(this.assignCommonState({data: []}, this.accordionListInfo[COMMON_STATE].state));
					}

					// 属性一覧検索実行
					this.attributeTreeComponentService.searchAttrTree(this.attrTree.info, this.attrTree.selected);
				}
				this.info.attrTree = this.attrTree;
				break;
			}
		}

		// 最新に更新ボタンを非活性にする
		this.reloadService.doDisable(false);
	}

	/**
	 * ドキュメント一覧右クリックメニューを設定する
	 * @param itemList コンテキストメニューアイテムリスト
	 */
	public setContextMenu(contextMenuItemList: EIMContextMenu[]): void {

		// ダミーをを削除
		this.documentContentsListMenuItems.shift();

		let workspaceGridContextMenuMap = this.getWorkspaceGridContextMenuMap();
		let accordionSearchGridContextMenuMap = this.getAccordionSearchGridContextMenuMap();
		let circulationSituationGridContextMenuMap = this.getCirculationSituationGridContextMenuMap();
		let attributeTreeViewGridContextMenuMap = this.getAttributeTreeViewGridContextMenuMap();

		// フォルダ複製メニュー有無
		let existsMenulistFolderReplication = false;
		let folderReplicationIndex: number;
		// フォルダ複製サブメニュー
		let menulistFolderReplicationSubMenus: EIMMenuItem[] = [];
		
		// ダウンロードメニュー有無
		let existsMenulistDownload = false;
		let downloadMenuIndex: number;
		// ダウンロード複製サブメニュー
		const menulistDownloadSubMeus: EIMMenuItem[] = [];
		// エラー
		let errMenu = '';


		for (let i = 0; i < contextMenuItemList.length; i++) {

			if (!workspaceGridContextMenuMap.has(contextMenuItemList[i].itemJpName)) {
				// エラーは１件のみ表示するため上書き
				errMenu = contextMenuItemList[i].itemJpName;
				continue;
			}
			// ■ワークスペースグリッド右クリックメニュー
			// フォルダ複製有無判定
			if (contextMenuItemList[i].itemJpName === contextMenuDefineName.COPY_FOLDER_TREE) {
				existsMenulistFolderReplication = true;
				folderReplicationIndex = i;
				continue;
			}
			// サブメニューは退避
			if (contextMenuItemList[i].itemJpName === contextMenuDefineName.FOLDER_ONLY
			|| contextMenuItemList[i].itemJpName === contextMenuDefineName.WITH_DOCUMENT_AS_LINK_MANUAL
			|| contextMenuItemList[i].itemJpName === contextMenuDefineName.WITH_DOCUMENT_AS_LINK_AUTO) {
				menulistFolderReplicationSubMenus.push(workspaceGridContextMenuMap.get(contextMenuItemList[i].itemJpName));
				continue;
			}

			// ダウンロード有無判定
			if (contextMenuItemList[i].itemJpName === contextMenuDefineName.DOWNLOAD) {
				existsMenulistDownload = true;
				downloadMenuIndex = i;
				continue;
			}
			// ダウンロード系サブメニューは退避
			if (contextMenuItemList[i].itemJpName === contextMenuDefineName.DOWNLOAD_ZIP
			|| contextMenuItemList[i].itemJpName === contextMenuDefineName.DOWNLOAD_PRIVATE
			|| contextMenuItemList[i].itemJpName === contextMenuDefineName.DOWNLOAD_PUBLIC) {
				menulistDownloadSubMeus.push(workspaceGridContextMenuMap.get(contextMenuItemList[i].itemJpName));
				continue;
			}

			// セパレータ追加
			if (contextMenuItemList[i].separatorBefore) {
				this.documentContentsListMenuItems.push(this.menuItemSeparator);
			}
			// メニュー追加
			this.documentContentsListMenuItems.push(Object.assign({}, workspaceGridContextMenuMap.get(contextMenuItemList[i].itemJpName)));


			// ■アコーディオン検索グリッド右クリックメニュー設定
			if (accordionSearchGridContextMenuMap.has(contextMenuItemList[i].itemJpName)) {
				// セパレータ追加
				if (contextMenuItemList[i].separatorBefore) {
					this.accordionSearchContentsListMenuItems.push(this.menuItemSeparator);
				}
				// メニュー追加
				this.accordionSearchContentsListMenuItems.push(Object.assign({}, accordionSearchGridContextMenuMap.get(contextMenuItemList[i].itemJpName)));
			}

			// ■回付状況確認グリッド右クリックメニュー設定
			if (circulationSituationGridContextMenuMap.has(contextMenuItemList[i].itemJpName)) {
				// セパレータ追加
				if (contextMenuItemList[i].separatorBefore) {
					this.circulationSituationContentsListMenuItems.push(this.menuItemSeparator);
				}
				// メニュー追加
				this.circulationSituationContentsListMenuItems.push(Object.assign({}, circulationSituationGridContextMenuMap.get(contextMenuItemList[i].itemJpName)));
			}

			// ■属性ツリービューグリッド右クリックメニュー設定
			if (attributeTreeViewGridContextMenuMap.has(contextMenuItemList[i].itemJpName)) {
				// セパレータ追加
				if (contextMenuItemList[i].separatorBefore) {
					this.attributeTreeContentsListMenuItems.push(this.menuItemSeparator);
				}
				// メニュー追加
				this.attributeTreeContentsListMenuItems.push(Object.assign({}, attributeTreeViewGridContextMenuMap.get(contextMenuItemList[i].itemJpName)));
			}
		}

		// フォルダツリー複製メニュー
		// 親あり、且つサブメニューありだったら追加
		if (existsMenulistFolderReplication && menulistFolderReplicationSubMenus.length > 0) {
			this.documentContentsListMenuItems.splice(folderReplicationIndex, 0, Object.assign({}, this.menulistFolderReplication, { items: menulistFolderReplicationSubMenus}));
		}

		// ダウンロードメニュー
		// 親あり、且つサブメニューありだったら追加
		if (existsMenulistDownload && menulistDownloadSubMeus.length > 0) {
			this.documentContentsListMenuItems.splice(downloadMenuIndex, 0, Object.assign({}, this.menuItemDownload, { items: menulistDownloadSubMeus}));
		}


		if (errMenu !== '') {
			this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_DOCUMENTS.ERROR_00062',  {value: errMenu}));
		}

		// ドキュメント一覧　右クリックメニュー
		this.changeLabel(this.documentContentsListMenuItems);
		let newDocumentContentsListMenuItems: EIMMenuItem[] = Object.assign([], this.documentContentsListMenuItems);
		this.documentContentsListMenuItems = newDocumentContentsListMenuItems;
		// 検索アコーディオン　右クリックメニュー
		this.changeLabel(this.accordionSearchContentsListMenuItems);
		let newAccordionSearchContentsListMenuItems: EIMMenuItem[] = Object.assign([], this.accordionSearchContentsListMenuItems);
		this.accordionSearchContentsListMenuItems = newAccordionSearchContentsListMenuItems;
		// 回付状況確認　右クリックメニュー
		this.changeLabel(this.circulationSituationContentsListMenuItems);
		let newCirculationSituationContentsListMenuItems: EIMMenuItem[] = Object.assign([], this.circulationSituationContentsListMenuItems);
		this.circulationSituationContentsListMenuItems = newCirculationSituationContentsListMenuItems;
		// 属性ツリービュー　右クリックメニュー
		this.changeLabel(this.attributeTreeContentsListMenuItems);
		let newAttributeTreeContentsListMenuItems: EIMMenuItem[] = Object.assign([], this.attributeTreeContentsListMenuItems);
		this.attributeTreeContentsListMenuItems = newAttributeTreeContentsListMenuItems;


		switch (this.info.accordionActiveIndex) {
			case accordionIndex.WORKSPACE: {
				// ワークスペース
				// 右クリックメニュー変更
				this.info.contentsListMenuItems = this.documentContentsListMenuItems;
				this.info.normalContentsListMenuItems = this.documentContentsListMenuItems;
				break;
			}
			case accordionIndex.SEARCH: {
				// 右クリックメニュー変更
				this.info.contentsListMenuItems = this.accordionSearchContentsListMenuItems;
				this.info.normalContentsListMenuItems = this.accordionSearchContentsListMenuItems;
				break;
			}
			case accordionIndex.CIRCULATION_SITUATION: {
				// 回付状況/確認
				// 右クリックメニュー変更
				this.info.contentsListMenuItems = this.circulationSituationContentsListMenuItems;
				this.info.normalContentsListMenuItems = this.circulationSituationContentsListMenuItems;
				break;
			}
			case accordionIndex.ATTRIBUTE_TREE: {
				// 属性ツリービュー
				// 右クリックメニュー変更
				this.info.contentsListMenuItems = this.attributeTreeContentsListMenuItems;
				this.info.normalContentsListMenuItems = this.attributeTreeContentsListMenuItems;
				break;
			}
		}
	}

	/**
	 * Box領域を非表示にします.
	 */
	public onClickCloseBox() {
		this.invokeMethod(event, this.contentsList, 'showBox');
	}

	/**
	 * スプリットドラッグ終了ハンドラ
	 */
	public onSplitDragEnd({ sizes }: any): void {
		this.lastSplitAreaSize = sizes;
	}

	/**
	 * 全文チェック時イベントハンドラ
	 */
	public contentsClick(){
		// 「本文抜粋」表示に切り替える
		if(this.selectedDisplayTypeId !== EIMConstantService.DISPLAY_TEXTEXCERPT){
			this.selectedDisplayTypeId = EIMConstantService.DISPLAY_TEXTEXCERPT;
			this.searchSkipFlg = true;
			this.snippetChangeClick();
			if(this.contentsListComponentService.listModeList || this.contentsListComponentService.thumbnailModeList){
				this.contentsList.setData([]);
			}
			this.searchSkipFlg = false;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 購読を解除します.
	 * リクエストを取り消す際に使用します.
	 */
	protected completeSubject(): void {

		// 購読を解除する
		this.destroy$.next(null);
		this.destroy$.complete();
	}

	/**
	 * 検索用 本文抜粋/リスト/サムネイル切替ボタン押下時処理
	 * @param event
	 */
	private snippetChangeClick() {
		// 変更がない場合は何もしない
		if (this.documentSessionStorageService.getSearchDisplayType() === this.selectedDisplayTypeId) {
			return;
		}

		let oldState = this.info.contentsList.getState();
		this.documentSessionStorageService.setSearchDisplayType(this.selectedDisplayTypeId);

		// カラムを取得
		if (this.info.accordionActiveIndex === accordionIndex.SEARCH 
			&& this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
			// 本文抜粋選択時
			if (this.accordionListInfo[accordionIndex.SEARCH].state) {
				this.accordionListInfo[accordionIndex.SEARCH].state.columns = this.createAccordionSearchColumnsForTextExcerpt();
			} else {
				this.accordionListInfo[accordionIndex.SEARCH].columns = this.createAccordionSearchColumnsForTextExcerpt();
			}
			if(this.preSelectedDisplayTypeId === EIMConstantService.DISPLAY_LIST){
				this.accordionListInfo[accordionIndex.SEARCH].stateForList = oldState;
			} else {
				this.accordionListInfo[accordionIndex.SEARCH].stateForThumbnail = oldState;
				this.thumbnailOFF();
			}
		} else if(this.info.accordionActiveIndex === accordionIndex.SEARCH &&
			this.selectedDisplayTypeId === EIMConstantService.DISPLAY_LIST) {
			// リスト選択時
			let commonColumns = this.createAccordionSearchColumnsForList();
			let tableColumns = this.contentsTableService.createTableColumns(this.contentsTableService.selectedTable);
			if (this.accordionListInfo[accordionIndex.SEARCH].state) {
				this.accordionListInfo[accordionIndex.SEARCH].state.columns = commonColumns.concat(tableColumns);
			} else {
				this.accordionListInfo[accordionIndex.SEARCH].columns = commonColumns.concat(tableColumns);
			}
			if(this.preSelectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT){
				this.accordionListInfo[accordionIndex.SEARCH].stateForTextExcerpt = oldState;
			} else {
				this.accordionListInfo[accordionIndex.SEARCH].stateForThumbnail = oldState;
				this.thumbnailOFF();
			}
		} else {
			// サムネイル選択時
			this.accordionListInfo[accordionIndex.SEARCH].columns = this.createAccordionSearchColumnsForThumbnail();
			if(this.preSelectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT){
				this.accordionListInfo[accordionIndex.SEARCH].stateForTextExcerpt = oldState;
			} else {
				this.accordionListInfo[accordionIndex.SEARCH].stateForList = oldState;
			}
			this.thumbnailON();
		}

		// グリッドにカラムを追加
		if (this.accordionListInfo[this.info.accordionActiveIndex].state) {
			this.contentsList.setColumns(this.accordionListInfo[accordionIndex.SEARCH].state.columns);
		} else {
			this.contentsList.setColumns(this.accordionListInfo[accordionIndex.SEARCH].columns);
			this.setContentsInitState(this.info.accordionActiveIndex);
		}
		// 本文抜粋/リストの選択状態に応じて行高さを設定
		this.contentsList.info.gridApi.resetRowHeights();

		// 現在の表示タイプを保持
		this.preSelectedDisplayTypeId = this.selectedDisplayTypeId;

		// どの表示タイプにもデータが保持されていない場合はデータのセットを行わない
		if (!(this.contentsListComponentService.textExcerptModeList?.length) &&
			!(this.contentsListComponentService.listModeList?.length) &&
			!(this.contentsListComponentService.thumbnailModeList?.length)){
			return;
		}

		// 本文抜粋選択時
		if (this.info.accordionActiveIndex === accordionIndex.SEARCH 
			&& this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
			//「全文を含む」チェック押下時			
			if(this.searchSkipFlg === true){
				return;
			// 本文抜粋で検索が行われておらずリストまたはサムネイルで検索が行われている場合に再検索
			} else if(this.contentsListComponentService.textExcerptModeList.length === 0 
					&& (this.contentsListComponentService.listModeList.length !== 0 
					|| this.contentsListComponentService.thumbnailModeList.length !== 0)){
				this.accordionSearch.onClickSearchAtSnippetBtn();
			// それ以外の場合は保持しているデータをセット
			} else {
				this.accordionListInfo[accordionIndex.SEARCH].stateForTextExcerpt.data = this.contentsListComponentService.textExcerptModeList; 
				this.contentsList.setState(this.accordionListInfo[accordionIndex.SEARCH].stateForTextExcerpt);
			}
		// リスト選択時
		} else if (this.info.accordionActiveIndex === accordionIndex.SEARCH 
			&& this.selectedDisplayTypeId === EIMConstantService.DISPLAY_LIST){
			// リストで検索が行われておらず本文抜粋またはサムネイルで検索が行われている場合に再検索
			if(this.contentsListComponentService.listModeList.length === 0 
				&& (this.contentsListComponentService.textExcerptModeList.length !== 0 
				|| this.contentsListComponentService.thumbnailModeList.length !== 0)){
				this.accordionSearch.onClickSearchAtSnippetBtn();
			// それ以外の場合は保持しているデータをセット
			} else {
				this.accordionListInfo[accordionIndex.SEARCH].stateForList.data = this.contentsListComponentService.listModeList; 
				this.contentsList.setState(this.accordionListInfo[accordionIndex.SEARCH].stateForList);
			}
		}
		// サムネイル選択時
		else {
			// サムネイルで検索が行われておらず本文抜粋またはリストで検索が行われている場合に再検索
			if((this.contentsListComponentService.thumbnailModeList.length === 0 
				&& (this.contentsListComponentService.textExcerptModeList.length !== 0 
				|| this.contentsListComponentService.listModeList.length !== 0))){
				this.contentsList.setData([]);
				this.accordionSearch.onClickSearchAtSnippetBtn();
			// それ以外の場合は保持しているデータをセット
			} else {
				this.accordionListInfo[accordionIndex.SEARCH].stateForThumbnail.data 
				= this.contentsListComponentService.thumbnailModeList;
				this.contentsList.setState(this.accordionListInfo[accordionIndex.SEARCH].stateForThumbnail);
			}
		}
		// 検索結果のカラム幅を自動調整します
		this.contentsList.componentService.autoSizeColumn(this.contentsList.info, 'column');
	}

	/**
	 * パンくず情報を生成します.
	 * @param node ツリー選択ノード
	 * @return メニューアイテムリスト
	 */
	private createBreadcrumbItems(node: any): MenuItem[] {
		let retMenuItems: any[];
		if (node.parent) {
			retMenuItems = this.createBreadcrumbItems(node.parent);
		} else {
			retMenuItems = [];
		}

		let event;
		if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
			event = () => this.contentsTree.select([node], true);
		} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
			event = () => this.attrTree.select([node], true);
		}

		retMenuItems.push({
			label: node.label,
			command: event
		});
		return retMenuItems;
	}

	/**
	 * 検索パスを作成します.
	 * @param node ツリー選択ノード
	 * @return 検索パス
	 */
	private createSearchPath(node: any): string {
		let retPath: string;
		let labelList: string[] = [];
		let targetNode: any = node;

		labelList.push(targetNode.label);

		while (targetNode.parent) {
			targetNode = targetNode.parent;
			labelList.unshift(targetNode.label);
		}

		retPath = labelList.join('/');
		retPath = '/' + retPath + '/';

		return retPath;
	}

	/**
	 * ツリーノードをもとに、パンくず情報・パスをセットします.
	 * @param treeNode 選択ツリーノード
	 */
	private setBreadcrumbItemsAndPath(treeNode?: EIMFolderTreeNode): void {
		if (treeNode) {
			// パンくず情報設定
			this.breadcrumbItems = this.createBreadcrumbItems(treeNode);

			if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
				this.info.path = this.createSearchPath(treeNode);
				// 検索画面のパスを更新する
				let searchPath: string = this.createSearchPath(treeNode);
				EIMContentsSearchComponent.initPath = searchPath;
				EIMContentsSearchComponent.isTrash =
					treeNode.data.isTrash || treeNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TRASH_CAN ? true : false;
				let contentsSearch: any = this.dialogManagerComponentService.getView('SEARCH');
				if (contentsSearch) {
					(<EIMContentsSearchComponent>contentsSearch).setSearchPath(searchPath);
					(<EIMContentsSearchComponent>contentsSearch).setIsTrashCondition(EIMContentsSearchComponent.isTrash);
				}
			}
		} else {
			// パンくず
			this.breadcrumbItems = null;
		}
	}

	/**
	 * テーブルメニューとカラムを設定します.
	 * @param userTableMenuItems ユーザテーブルメニューアイテムリスト
	 * @param addColumns グリッドカラムリスト
	 */
	private setTableMenuAndColumn(userTableMenuItems: EIMMenuItem[], addColumns: EIMDataGridColumn[]): void {
		// 共通ステート初期化
		this.accordionListInfo[COMMON_STATE].state = null;

		// ■ワークスペース一覧カラム生成
		let columns: EIMDataGridColumn[] = [];
		// 固定カラムを追加
		Array.prototype.push.apply(columns, this.createFixedColumns());
		// 選択テーブルのカラムを追加
		Array.prototype.push.apply(columns, addColumns);

		// カラムを保持
		if (this.accordionListInfo[accordionIndex.WORKSPACE].state) {
			this.accordionListInfo[accordionIndex.WORKSPACE].state.columns = columns;
			this.accordionListInfo[accordionIndex.WORKSPACE].columns = columns;
		} else {
			this.accordionListInfo[accordionIndex.WORKSPACE].columns = columns;
		}

		if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
			if(this.selectedWorkspaceDisplayTypeId === EIMConstantService.DISPLAY_THUMBNAIL){
				this.thumbnailON();
			}
		}
		else if (this.info.accordionActiveIndex === accordionIndex.SEARCH) {
			if(this.selectedDisplayTypeId === EIMConstantService.DISPLAY_THUMBNAIL){
				this.thumbnailON();
			}
		}

		// ■検索一覧カラム生成
		let searchColumns: EIMDataGridColumn[] = [];
		if (this.documentSessionStorageService.getSearchDisplayType() === EIMConstantService.DISPLAY_TEXTEXCERPT) {
			// 固定カラムを追加
			Array.prototype.push.apply(searchColumns, this.createAccordionSearchColumnsForTextExcerpt());
		} else if(this.documentSessionStorageService.getSearchDisplayType() === EIMConstantService.DISPLAY_LIST) {
			// 固定カラムを追加
			Array.prototype.push.apply(searchColumns, this.createAccordionSearchColumnsForList());
			// 選択テーブルのカラムを追加
			Array.prototype.push.apply(searchColumns, addColumns);
		} else {
			// 固定カラムを追加
			Array.prototype.push.apply(searchColumns, this.createAccordionSearchColumnsForThumbnail());
		}

		if (this.accordionListInfo[accordionIndex.SEARCH].state) {
			this.accordionListInfo[accordionIndex.SEARCH].state.columns = searchColumns;
		} else {
			this.accordionListInfo[accordionIndex.SEARCH].columns = searchColumns;
		}

		// ■回付情報一覧カラム生成
		this.accordionListInfo[accordionIndex.CIRCULATION_SITUATION].columns = this.createCirculationSituationColumns();

		// ■属性ツリービュー一覧カラム生成
		let attrColumns: EIMDataGridColumn[] = [];
		// 固定カラムを追加
		Array.prototype.push.apply(attrColumns, this.createFixedColumns());
		// 選択テーブルのカラムを追加
		Array.prototype.push.apply(attrColumns, addColumns);
		if (this.accordionListInfo[accordionIndex.ATTRIBUTE_TREE].state) {
			this.accordionListInfo[accordionIndex.ATTRIBUTE_TREE].state.columns = columns;
		} else {
			this.accordionListInfo[accordionIndex.ATTRIBUTE_TREE].columns = attrColumns;
		}

		// 検索アコーディオン選択時はステート復帰
		let isInitColums = false;
		if (this.info.accordionActiveIndex === accordionIndex.SEARCH) {
			if (this.selectedDisplayTypeId === EIMConstantService.DISPLAY_TEXTEXCERPT) {
				if (this.accordionListInfo[this.info.accordionActiveIndex].stateForTextExcerpt) {
					this.contentsList.setState(this.accordionListInfo[this.info.accordionActiveIndex].stateForTextExcerpt);
					isInitColums = true;
				}
			} else if(this.selectedDisplayTypeId === EIMConstantService.DISPLAY_LIST) {
				if (this.accordionListInfo[this.info.accordionActiveIndex].stateForList) {
					this.contentsList.setState(this.accordionListInfo[this.info.accordionActiveIndex].stateForList);
					isInitColums = true;
				}
			} else {
				if (this.accordionListInfo[this.info.accordionActiveIndex].stateForThumbnail) {
					this.contentsList.setState(this.accordionListInfo[this.info.accordionActiveIndex].stateForThumbnail);
					isInitColums = true;
				}
			}
		}

		// グリッドにカラムを追加
		if (this.accordionListInfo[this.info.accordionActiveIndex].state) {
			this.contentsList.setColumns(this.accordionListInfo[this.info.accordionActiveIndex].state.columns);
		} else {
			this.contentsList.setColumns(this.accordionListInfo[this.info.accordionActiveIndex].columns);
		}
		
		

		// メニュー初期化の為、nameを設定する
		for (let i = 0; i < userTableMenuItems.length; i++) {
			let menuItem: EIMMenuItem = userTableMenuItems[i];
			if (menuItem.label) {
				// ラベルが設定されている場合、tableMenuItemとする
				menuItem.name = 'tableMenuItem';
			}
		}

		// メニュー
		if (this.menuItemTableConfig.label === '') {
			this.menuItemTableConfig.label = this.translateService.instant(this.menuItemTableConfig.rKey);
		}
		const newTableMenuItems = [];
		newTableMenuItems.push(this.menuItemTableConfig);										// テーブル管理メニュー追加
		newTableMenuItems.push(this.menuItemSeparator);											// セパレータ追加
		Array.prototype.push.apply(newTableMenuItems, userTableMenuItems);	// ユーザテーブルメニューリスト追加

		// Box表示メニュー追加
		this.boxIntegration = this.serverConfigService.boxIntegrationFlg;
		this.boxUserInteg = this.serverConfigService.boxUserIntegFlg;
		if (this.boxIntegration && this.boxUserInteg) {
			if (this.menuItemShowBox.label === '') {
				// メニューラベル初期化
				this.menuItemShowBox.label = this.info.isDisplayingBox ?
						this.translateService.instant('EIM_DOCUMENTS.LABEL_03123') : this.translateService.instant('EIM_DOCUMENTS.LABEL_03124');
			}
			newTableMenuItems.push(this.menuItemSeparator);										// セパレータ追加
			newTableMenuItems.push(this.menuItemShowBox);											// Box表示メニュー追加
		}

		// アコーディオン内のコンポーネントを初期化
		if (!this.accordionListInfo[this.info.accordionActiveIndex].state) {
			switch (this.info.accordionActiveIndex) {
				case accordionIndex.CIRCULATION_SITUATION:
					this.contentsList.setData([]);
					this.circulation.init();
					break;
				case accordionIndex.ATTRIBUTE_TREE:
					if (this.info.selectedAttrTreeNodeForPageReload) {
						this.attributeTreeComponentService.updateLatest(this.attrTree.info,
							this.info.selectedAttrTreeNodeForPageReload, [], this.attrTree.initialized, this.attrTree.selected);
						delete this.info.selectedAttrTreeNodeForPageReload;
					} else {
						this.attributeTreeComponentService.searchAttrTree(this.attrTree.info, this.attrTree.selected);
					}
					break;
				default:
					break;
			}
		}
		this.menulistView.items = newTableMenuItems;
	}

	/**
	 * 固定カラムを生成します.
	 * @return グリッドカラムリスト
	 */
	private createFixedColumns(): EIMDataGridColumn[] {

		let columns: EIMDataGridColumn[] = [];

		// 署名・暗号化がONの場合のみ表示
		if (this.serverConfigService.signatureAndEncryptionFlag) {
			columns.push({field: 'signencr', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02141'), width: 75, cellRendererFramework: EIMSignEncryptionRendererComponent, suppressFilter: true ,
				comparator: EIMSignEncryptionRendererComponent.comparator});
		}

		// 公開
		columns.push({field: 'public', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02036'), width: 70,
			cellRendererFramework: EIMPublicFileRendererComponent, valueGetter: this.publicFileRendererComponentService.valueGetter,suppressSorting: true, suppressFilter: true});

		// 編集
		if (this.webDAVService.enable()) {
			columns.push({field: 'edit', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02058'), width: 70, cellRendererFramework: EIMDirectEditingRendererComponent, suppressSorting: true, suppressFilter: true});
		}

		// 自動採番がONの場合のみ表示
		if (this.serverConfigService.enableAutomaticNumbering) {
			columns.push({field: 'number', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02098'), width: 120, type: EIMDataGridColumnType.text});
		}

		// 名前
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 300,
			cellRendererFramework: EIMObjectNameRendererComponent, cellEditorFramework: EIMTextEditorRendererComponent, 
			editable: (params) => {return this.isCellEditable === true},
			headerClass: 'eim-editable-column-header',
			cellRendererParams: {
				draggableToBoxArea: true
			}
		});

		// 履歴
		columns.push({field: 'rev', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), width: 70, type: EIMDataGridColumnType.number,
			cellRendererFramework: EIMHistoryRendererComponent,
		});

		// ステータス
		columns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM.LABEL_02029'),
			cellRendererFramework: EIMStatusRendererComponent,
			valueGetter: this.statusRendererComponentService.valueGetter
		});

		return columns;
	}

	/**
	 * アコーディオン検索グリッドの固定カラムを生成します（本文抜粋）.
	 * @return グリッドカラムリスト
	 */
	private createAccordionSearchColumnsForTextExcerpt(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		columns.push({field: 'column', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02144'), width: 1000, suppressSorting  : true,
			cellRendererFramework: EIMAccordionSearchRendererComponent,
			cellRendererParams: {
				customAttributeItems:this.accordionSearch.customAttributeItems
			}
		});

		return columns;
	}
	/**
	 * アコーディオン検索グリッドの固定カラムを生成します（リスト）.
	 * @return グリッドカラムリスト
	 */
	 private createAccordionSearchColumnsForList(): EIMDataGridColumn[] {

		let columns: EIMDataGridColumn[] = [];

		// 署名・暗号化がONの場合のみ表示
		if (this.serverConfigService.signatureAndEncryptionFlag) {
			columns.push({field: 'signencr', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02141'), width: 75, cellRendererFramework: EIMSignEncryptionRendererComponent, suppressFilter: true ,
				comparator: EIMSignEncryptionRendererComponent.comparator});
		}

		// 公開
		columns.push({field: 'public', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02036'), width: 70,
			cellRendererFramework: EIMPublicFileRendererComponent, valueGetter: this.publicFileRendererComponentService.valueGetter,suppressSorting: true, suppressFilter: true});

		// 編集
		if (this.webDAVService.enable()) {
			columns.push({field: 'edit', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02058'), width: 70, cellRendererFramework: EIMDirectEditingRendererComponent, suppressSorting: true, suppressFilter: true});
		}

		// ページ
		columns.push({field: 'page', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02097'), width: 70, suppressSorting: true, suppressFilter: true,
			cellRendererFramework: EIMPageRendererComponent
		});

		// 自動採番がONの場合のみ表示
		if (this.serverConfigService.enableAutomaticNumbering) {
			columns.push({field: 'number', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02098'), width: 120, type: EIMDataGridColumnType.text});
		}

		// 名前
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 300,
			cellRendererFramework: EIMObjectNameRendererComponent, cellEditorFramework: EIMTextEditorRendererComponent, editable: true,
			headerClass: 'eim-editable-column-header',
			cellRendererParams: {
				draggableToBoxArea: true
			}
		});

		// 履歴
		columns.push({field: 'rev', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), width: 70, type: EIMDataGridColumnType.number,
			cellRendererFramework: EIMHistoryRendererComponent,
		});

		// ステータス
		columns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM.LABEL_02029'),
			cellRendererFramework: EIMStatusRendererComponent,
			valueGetter: this.statusRendererComponentService.valueGetter
		});

		// 場所
		columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), width: 270, cellRendererFramework: EIMPlaceRendererComponent,
		});

		return columns;
	}
	/**
	* アコーディオン検索グリッドの固定カラムを生成します（サムネイル）.
	* @return グリッドカラムリスト
	*/
	private createAccordionSearchColumnsForThumbnail(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];
		return columns;
	}

	/**
	 * 回付状況確認グリッドの固定カラムを生成します.
	 * @return グリッドカラムリスト
	 */
	private createCirculationSituationColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		// 署名・暗号化がONの場合のみ表示
		if (this.serverConfigService.signatureAndEncryptionFlag) {
			columns.push({field: 'signencr', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02141'), width: 75, cellRendererFramework: EIMSignEncryptionRendererComponent, suppressFilter: true ,
				comparator: EIMSignEncryptionRendererComponent.comparator });
		}
		// 公開
		columns.push({field: 'a', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02036'), width: 70, cellRendererFramework: EIMPublicFileRendererComponent,
		valueGetter: this.publicFileRendererComponentService.valueGetter, suppressSorting: true, suppressFilter: true});

		// 自動採番がONの場合のみ表示
		if (this.serverConfigService.enableAutomaticNumbering) {
			columns.push({field: 'number', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02098'), width: 120, type: EIMDataGridColumnType.text});
		}

		// 名前
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 270, cellRendererFramework: EIMObjectNameRendererComponent
		});

		// 履歴
		columns.push({field: 'rev', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), width: 70, type: EIMDataGridColumnType.number,
			cellRendererFramework: EIMHistoryRendererComponent,
		});

		// 承認依頼者
		columns.push({field: 'requestUser', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02120'), width: 120, type: EIMDataGridColumnType.text,
		});

		// 承認依頼日時
		columns.push({field: 'requestDate', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02134'), width: 165, type: EIMDataGridColumnType.dateTime, comparator: this.dateService.dateComparator
		});

		// ステータス
		columns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM.LABEL_02029'), width: 220, cellRendererFramework: EIMStatusRendererComponent,
			valueGetter: this.statusRendererComponentService.valueGetter
		});

		// 承認者
		columns.push({field: 'nextApprover', cellRendererFramework: EIMTooltipRendererComponent, headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02122'), width: 120, type: EIMDataGridColumnType.text,
		});

		// 場所
		columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), width: 270, cellRendererFramework: EIMPlaceRendererComponent,
		});

		return columns;
	}

	/**
	 * 改名前に名前を戻します.
	 * @param data オブジェクト
	 */
	private revertBeforeRename(data: any): void {
		let tempPreObjName = this.info.preObjName;
		// 表紙ドキュメントの場合
		if (data.isCoverForScanning === this.FLAG_TRUE) {
			// [表紙]-と拡張子を追加
			let coverString = this.serverConfigService.pdfAutoRegistDocNamePrefix;
			tempPreObjName = coverString + tempPreObjName + '.pdf';
		}

		this.contentsList.info.gridApi.forEachNode( function (node) {
			if (node.data.objId === data.objId) {
				node.data.objName = tempPreObjName;
			}
		});
	}

	/**
	 * メニュー選択項目を実行します.
	 * @param event イベント
	 * @param targetComponent コンポーネント
	 * @param name メニュー名
	 * @param enable 有効かどうか
	 */
	private invokeMethod(event, targetComponent: EIMListComponent<any>, name: string, enable = true): void {
		if (!enable) {
			return;
		}
		let parentData: any;
		if (this.info.accordionActiveIndex === accordionIndex.WORKSPACE) {
			parentData = this.contentsTree.getSelectedData()[0];
		} else if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
			parentData = this.attrTree.getSelectedData()[0];
		}
		let selectedData: any[] = targetComponent.getSelectedData();
		const isInvoked = this.contentsMainComponentService.invokeMethod(name, this.info, parentData, selectedData);

		// 「名前の変更」実行時
		if (isInvoked && name === 'rename') {
			this.isCellEditable = true;
		}

	}

	/**
	 * メニュー名称変更
	 * @param menuItems メニュー
	 */
	private changeLabel(menuItems: EIMMenuItem[]) {
		for (let i = 0; i < menuItems.length; i++) {
			let menuItem: EIMMenuItem = menuItems[i];
			if (menuItem.hasOwnProperty('rKey')) {
				menuItem.label = this.translateService.instant(menuItem.rKey);
			}
			if (menuItem.items && menuItem.items.length > 0) {
				this.changeLabel(menuItem.items);
			}
		}
	}
	/**
	 * メニューアイテムラベルをリフレッシュします.
	 */
	private refreshMenuItemLabel(): void {

		// ワークスペースメインメニュー
		this.changeLabel(this.mainMenu);
		let newMenuItems: EIMMenuItem[] = Object.assign([], this.mainMenu);
		this.mainMenu = newMenuItems;

		// コンテンツツリーコンテキストメニュー
		this.changeLabel(this.contentsTreeMenuItems);
		let newContentsTreeMenuItems: EIMMenuItem[] = Object.assign([], this.contentsTreeMenuItems);
		this.contentsTreeMenuItems = newContentsTreeMenuItems;

		// 公開ファイル結合コンテンツグリッドコンテキストメニュー
		this.changeLabel(this.combineContentsListMenuItems);
		let newCombineContentsListMenuItems: EIMMenuItem[] = Object.assign([], this.combineContentsListMenuItems);
		this.combineContentsListMenuItems = newCombineContentsListMenuItems;

		// 公開ファイル比較コンテンツグリッドコンテキストメニュー
		this.changeLabel(this.compareContentsListMenuItems);
		let newCompareContentsListMenuItems: EIMMenuItem[] = Object.assign([], this.compareContentsListMenuItems);
		this.compareContentsListMenuItems = newCompareContentsListMenuItems;

		// タグに追加コンテンツグリッドコンテキストメニュー
		this.changeLabel(this.tagContextMenuItems);
		let newTagContextMenuItems: EIMMenuItem[] = Object.assign([], this.tagContextMenuItems);
		this.tagContextMenuItems = newTagContextMenuItems;

		//サムネイルのダウンロードボタンメニュー
		this.changeLabel(this.thumbnailDownloadButtonMenuItems);
		const newthumbnailDownloadButtonMenuItems: EIMMenuItem[] = Object.assign([], this.thumbnailDownloadButtonMenuItems);
		this.thumbnailDownloadButtonMenuItems = newthumbnailDownloadButtonMenuItems;

		//サムネイル上のボタンの一部
		this.changeLabel(this.thumbnailDirectMenuButtonItems);
		const newthumbnailDirectMenuButtonItems: EIMMenuItem[] = Object.assign([], this.thumbnailDirectMenuButtonItems);
		this.thumbnailDirectMenuButtonItems = newthumbnailDirectMenuButtonItems;
	}

		/**
	 * 対象のオプションメニューは表示可能かどうかを返却します.
	 * @param オプションメニュー名称
	 * @return 表示可能かどうか
	 */
	private isVisibleCheckOption(menuName: string): boolean {
		// 公開取消の場合
		if (menuName === 'showPublicCancel') {
			if (!this.serverConfigService.publicCancelFlg) {
				return false
			}
			if (!this.serverConfigService.isPublicCancelMenuSystemManagerOnly || this.serverConfigService.isSystemManager) {
				return true;
			}
			return false;
		}

		// OCRの場合
		if (menuName === 'showOCRSettingUpdator' || menuName === 'executeOCR' || menuName === 'cancelOCR' || menuName === 'OCRSeparator') {
			return this.serverConfigService.ocrFlg;
		}
		// スキャン用表紙作成の場合(作成可能グループか否かはjsp内で判定)
		if (menuName === 'showCoverCreator') {
			return this.serverConfigService.coverFlg;
		}
		// 公開ファイル比較の場合
		if (menuName === 'showPublicFileCompareExecutor' || menuName === 'showCompareFileList') {
			return this.serverConfigService.pdfCompareFlg;
		}
		// 公開ファイル結合の場合
		if (menuName === 'showPublicFileCombineExecutor') {
			return this.serverConfigService.pdfJoinFlg;
		}
		// 差替え
		if (menuName === 'showFileReplacementExecutor') {
			return this.serverConfigService.isSystemManager;
		}
		// 署名・暗号化
		if (menuName === 'showSignAndEncryption') {
			return this.serverConfigService.signatureAndEncryptionFlag;
		}
		// 公開ファイルセキュリティ設定の場合
		if (menuName === 'showPublicFileSecurityUpdater') {
			return this.serverConfigService.pdfOutputConf;
		}
		
		return true;
	}

	/**
	 * メインメニューを初期化します
	 */
	private initMainMenu(menuItems: EIMMenuItem[], info: EIMDocumentMainComponentInfo, isSelectTag: boolean ): EIMMenuItem[] {
		// 状態を設定/ 選択アコーディオン：0...ワークスペース、1...検索、2...回付状況確認、3...属性ツリービュー
		let stateId = info.accordionActiveIndex;
		if (isSelectTag) {
			stateId = 4; // タグ選択中
		}

		// メニューの使用不可、disabledプロパティを変更するメソッド
		const isUnavailable = (menu_Items: EIMMenuItem[], parentNames?: string[]) => {
			for (const menuItem of menu_Items) {
				const result = this.contentsMainComponentService.isUnavailableMenu(menuItem.name, stateId, parentNames);
				if (result) {
					menuItem.isUnavailable = result;
					menuItem.disabled = result;
				} else {
					menuItem.isUnavailable = false;
					menuItem.disabled = false;
				}
				if (menuItem.items && menuItem.items.length > 0) {
					const newParentNames = parentNames ? parentNames.concat(menuItem.name) : [menuItem.name];
					isUnavailable(menuItem.items, newParentNames);
				}
			}
		}
		isUnavailable(menuItems);

		return menuItems;
	}

	/**
	 * ステートに共通ステートを適用します.
	 * @param state 割当対象のステート
	 * @param commonState 共通ステート
	 * @return 割当てたステート
	 */
	private assignCommonState(state, commonState): any {
		if (!commonState) {
			return state;
		}
		state.columns = commonState.columns;
		state.colState = commonState.colState;
		state.sortState = commonState.sortState;
		state.filterState = commonState.filterState;
		return state;
	}

	/**
	 * ログインユーザがシステム権限：ワークスペース管理を有するか判定します
	 * @param admin ログインユーザのシステム権限
	 * @return 判定結果
	 */
	private hasWorkspaceSystemAuth(admin: number): boolean {
		let checkDigit = 13; // ワークスペース管理	0b 0001 0000 0000 0000(13桁目を判定)
		let binaryAdmin = admin.toString(2);
		if (binaryAdmin.length >= checkDigit) {
			// 文字列を右からチェック桁数まで切り出す
			let workAdmin = binaryAdmin.slice(-checkDigit);
			// １桁目を切り出す
			let workspaceSystemAuth = workAdmin.substr(0, 1);
			if (Number(workspaceSystemAuth) === this.FLAG_ON) {
				return true;
			}
		}
		return false;
	}

	/**
	 * ワークスペースツリーの選択中ノードと上位の階層にタグが付与されている事を判定します
	 * @param parentData 上位階層の選択データ
	 * @return 判定結果
	 */
	private isTagToTreeNode(treeNode: any): boolean {
		let check = false;
		let checkParent: (treeNode: any) => void = (parent: any) => {
			if (typeof parent.objTypeName !== 'undefined') {
					// objNameがタグの場合
				if (parent.objTypeName  === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
					check = true;
				}
			}
			// parent内に上位のparentDataがある場合、上位のparentをチェックする
			if (typeof parent.parent !== 'undefined') {
				checkParent(parent.parent);
			}
		}

		// チェック実行
		if (treeNode.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			return true;
		}
		checkParent(treeNode);
		return check;
	}

	/**
	 * サムネイルのダウンロードボタンメニューの名称とメニューの対応マップを返す.
	 */
	private getThumbnailDownloadBottonMenuMap(): Map<string, any> {
		return new Map([
			[contextMenuDefineName.DOWNLOAD_PRIVATE, this.menuItemPrivateDownload],
			[contextMenuDefineName.DOWNLOAD_PUBLIC, this.menuItemPublicDownload],
		]);
	}

	/**
	 * 右クリックメニューの名称とメニューの対応マップを返す.
	 */
	private getWorkspaceGridContextMenuMap(): Map<string, any> {
		return new Map([
			[contextMenuDefineName.CHECK_OUT, this.menuItemCheckout],
			[contextMenuDefineName.CANCEL_CHECK_OUT, this.menuItemCancelCheckout],
			[contextMenuDefineName.CHECK_IN, this.menuItemCheckin],
			[contextMenuDefineName.DOWNLOAD, this.menuItemDownload],
			[contextMenuDefineName.DOWNLOAD_ZIP, this.menuItemZipDownload],
			[contextMenuDefineName.DOWNLOAD_PRIVATE, this.menuItemPrivateDownload],
			[contextMenuDefineName.DOWNLOAD_PUBLIC, this.menuItemPublicDownload],
			[contextMenuDefineName.COPY, this.menuItemCopy],
			[contextMenuDefineName.BRANCH, this.menuItemCopyBranch],
			[contextMenuDefineName.CUT, this.menuItemCut],
			[contextMenuDefineName.PASTE, this.menuItemPaste],
			[contextMenuDefineName.RENAME, this.menuItemRename],
			[contextMenuDefineName.LINK_PASTING_PLATE_FIXING_MANUAL, this.menuItemPasteFixedLink],
			[contextMenuDefineName.LINK_PASTING_LATEST_VERSION_AUTOMATIC, this.menuItemPasteLatestLink],
			[contextMenuDefineName.LINK_SETTING, this.menuItemShowLinkUpdator],
			[contextMenuDefineName.LINK_UPDATE_LATEST_REVISION, this.menuItemUpdateLatestLink],
			[contextMenuDefineName.TAG_ALLOCATION, this.menuItemShowAssignTag],
			[contextMenuDefineName.COPY_FOLDER_TREE, this.menulistFolderReplication], // フォルダツリー複製
			[contextMenuDefineName.FOLDER_ONLY, this.menuItemFolderOnly], // フォルダのみ
			[contextMenuDefineName.WITH_DOCUMENT_AS_LINK_MANUAL, this.menuItemIncludingDocumentReplicationFixedLink], // ドキュメント含む(手動更新リンクとして複製)
			[contextMenuDefineName.WITH_DOCUMENT_AS_LINK_AUTO, this.menuItemIncludingDocumentReplicationLatestLink], // ドキュメント含む(公開時更新リンクとして複製)
			[contextMenuDefineName.OCR_PROCESSING_SETTINGS, this.menuItemShowOCRSettingUpdator],
			[contextMenuDefineName.OCR_PROCESSING_EXECUTION, this.menuItemExecuteOCR],
			[contextMenuDefineName.OCR_PROCESSING_CANCELLATION, this.menuItemCancelOCR],
			[contextMenuDefineName.JOIN_PUBLISHED_PDF, this.menuItemShowPublicFileCombineExecutor],
			[contextMenuDefineName.PUBLIC_DOCUMENT_COMPARISON, this.menuItemShowPublicFileCompareExecutor],
			[contextMenuDefineName.SECURITY_SETTING_FOR_PUBLISHED_DOCUMENT, this.menuItemShowPublicFileSecurityUpdater],
			[contextMenuDefineName.SIGN_AND_ENCRYPTION, this.menuItemShowSignAndEncryption],
			[contextMenuDefineName.DELETE, this.menuItemDelete],
			[contextMenuDefineName.APPROVAL_REQUEST, this.menuItemRequestApprove],
			[contextMenuDefineName.REQUEST_CANCEL, this.menuItemCancelAproveRequest],
			[contextMenuDefineName.APPROVE_IT, this.menuItemApprove],
			[contextMenuDefineName.SEND_IT_BACK_AND_TO_NEXT, this.menuItemAssignRequestRemand],
			[contextMenuDefineName.PUBLISH, this.menuItemPublic],
			[contextMenuDefineName.PUBLIC_CANCEL, this.menuItemPublicCancel],
			[contextMenuDefineName.TAKE_BACK, this.menuItemAssignRetrieve],
			[contextMenuDefineName.REPLACE, this.menuItemAssignReplacement],
			[contextMenuDefineName.APPROVAL_WAITING_LIST, this.menuItemAssignPending],
			[contextMenuDefineName.PROPERTIES, this.menuItemProperty],
			[contextMenuDefineName.SECURITY, this.menuItemSecurityChange],
			[contextMenuDefineName.REVISION_LOG, this.menuItemRevisionHistory],
			[contextMenuDefineName.ACCESS_LOG, this.menuItemAccessHistory],
			[contextMenuDefineName.ROTATION_STATUS_HISTORY, this.menuItemStatusProperty],
			[contextMenuDefineName.ADD_TO_FAVORITES_LIST, this.menuItemAddFavorite],
			[contextMenuDefineName.COPY_THE_URL, this.menuItemURLCopy],
			[contextMenuDefineName.URL_SHORTCUT_OUTPUT, this.menuItemURLShortcutOutput],
			[contextMenuDefineName.ACCESS_HISTORY_CSV_OUTPUT, this.menuItemAccessHistoryCSVOutput],
		]);
	}


	/**
	 * アコーディオン検索グリッド右クリックメニューのマップを返す.
	 */
	 private getAccordionSearchGridContextMenuMap(): Map<string, EIMMenuItem> {
		return new Map([
			[contextMenuDefineName.PROPERTIES, this.menuItemProperty], // プロパティ
			[contextMenuDefineName.REVISION_LOG, this.menuItemRevisionHistory], // 改訂履歴
			[contextMenuDefineName.ACCESS_LOG, this.menuItemAccessHistory], // アクセス履歴
			[contextMenuDefineName.ROTATION_STATUS_HISTORY, this.menuItemStatusProperty], // 回付状況/履歴
		]);
	}
	/**
	 * 回付状況確認グリッド右クリックメニューのマップを返す.
	 */
	private getCirculationSituationGridContextMenuMap(): Map<string, EIMMenuItem> {
		return new Map([
			[contextMenuDefineName.PROPERTIES, this.menuItemProperty], // プロパティ
			[contextMenuDefineName.REVISION_LOG, this.menuItemRevisionHistory], // 改訂履歴
			[contextMenuDefineName.ACCESS_LOG, this.menuItemAccessHistory], // アクセス履歴
			[contextMenuDefineName.ROTATION_STATUS_HISTORY, this.menuItemStatusProperty], // 回付状況/履歴
			[contextMenuDefineName.PUBLIC_CANCEL, this.menuItemPublicCancel], // 公開取消
			[contextMenuDefineName.REQUEST_CANCEL, this.menuItemCancelAproveRequest], // 承認依頼取消
			[contextMenuDefineName.APPROVE_IT, this.menuItemApprove], // 承認
			[contextMenuDefineName.SEND_IT_BACK_AND_TO_NEXT, this.menuItemAssignRequestRemand], // 差戻し
			[contextMenuDefineName.TAKE_BACK, this.menuItemAssignRetrieve], // 取戻し
			[contextMenuDefineName.REPLACE, this.menuItemAssignReplacement], // 差替え
			[contextMenuDefineName.APPROVAL_WAITING_LIST, this.menuItemAssignPending], // 処理待ち一覧
		]);
	}

	/**
	 * 属性ツリービューグリッド右クリックメニューのマップを返す.
	 */
	private getAttributeTreeViewGridContextMenuMap(): Map<string, EIMMenuItem> {
		return new Map([
			[contextMenuDefineName.DOWNLOAD, this.menuItemDownload], // ダウンロード
			[contextMenuDefineName.RENAME, this.menuItemRename], // 改名
			[contextMenuDefineName.APPROVAL_REQUEST, this.menuItemRequestApprove], // 承認依頼
			[contextMenuDefineName.REQUEST_CANCEL, this.menuItemCancelAproveRequest], // 承認依頼取消
			[contextMenuDefineName.APPROVE_IT, this.menuItemApprove], // 承認
			[contextMenuDefineName.SEND_IT_BACK_AND_TO_NEXT, this.menuItemAssignRequestRemand], // 差戻し
			[contextMenuDefineName.TAKE_BACK, this.menuItemAssignRetrieve], // 取戻し
			[contextMenuDefineName.PUBLISH, this.menuItemPublic], // 公開
			[contextMenuDefineName.PUBLIC_CANCEL, this.menuItemPublicCancel], // 公開取消
			[contextMenuDefineName.REPLACE, this.menuItemAssignReplacement], // 差替え
			[contextMenuDefineName.APPROVAL_WAITING_LIST, this.menuItemAssignPending], // 処理待ち一覧
			[contextMenuDefineName.LINK_SETTING, this.menuItemShowLinkUpdator], // リンク設定
			[contextMenuDefineName.PROPERTIES, this.menuItemProperty], // プロパティ
			[contextMenuDefineName.REVISION_LOG, this.menuItemRevisionHistory], // 改訂履歴
			[contextMenuDefineName.ACCESS_LOG, this.menuItemAccessHistory], // アクセス履歴
			[contextMenuDefineName.ROTATION_STATUS_HISTORY, this.menuItemStatusProperty], //  回付状況/履歴
		]);
	}

	/**
	 * 表示中のダイアログID変更
	 */
	private changeDialogId(dialogId: string, checkTargetUpdate) {
		if (checkTargetUpdate) {
			this.info.checkTargetDialogId = dialogId;
		}
		this.shownDialog.emit(dialogId);
	}

	/**
	 * 改名実行処理
	 * @param event イベント
	 * @param postProc 後処理
	 */
	private executeRename(event: any, postProc: any): void {
		// 列幅以上の名前が入力された場合アイコンがずれるので確認ダイアログを表示する前にグリッドを再描画する
		this.contentsList.info.gridApi.redrawRows();

		if (this.localStorageService.getDispConfirmRenameFile() === "true") {
			this.ExecuteRenameMain(event, postProc);
		} else {
			// 確認ダイアログ
			this.messageService.showCheckBox(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00010'),
				this.translateService.instant('EIM_DOCUMENTS.LABEL_03121'),
				(V: boolean) => {
					if (V) {
						this.localStorageService.setDispConfirmRenameFile("true");
					} else {
						this.localStorageService.setDispConfirmRenameFile("false");
					}
				},
				() => {
					this.ExecuteRenameMain(event, postProc);
				},
				() => {
					// 改名前に戻す
					this.revertBeforeRename(event.data);
					postProc();
				}
			);
		}
	}

	private ExecuteRenameMain(event: any, postProc: any) {
		// 表紙ドキュメントの場合
		if (event.data.isCoverForScanning === this.FLAG_TRUE) {
			// [表紙]-と拡張子を追加
			let coverString = this.serverConfigService.pdfAutoRegistDocNamePrefix;
			event.data.objName = coverString + event.data.objName + '.pdf';
		}
		// 改名処理
		this.contentsService.rename(event.data.objId, event.data.objName)
			.pipe(finalize(() => {
				postProc();
			}))
			.subscribe((object: any) => {
				// フォルダツリーに反映
				this.contentsTreeComponentService.updateNode(this.contentsTree.info, event.data);
				// 完了メッセージ表示
				this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00011'));
			}, (err: any) => {
				// エラーの場合、改名前に戻す
				this.revertBeforeRename(event.data);
			}, () => {
		});
	}

	/**
	 * ページ再読み込み用の情報を保存します.
	 */
	protected savePageReloadState(): void {
		const info: any = { selectedParentObjId: this.info.selectedParentObjId };
		if (this.info.accordionActiveIndex === accordionIndex.ATTRIBUTE_TREE) {
			const treeSelectedData: any = this.attrTree.getSelectedData()[0];
			if (treeSelectedData) {
				const selectedNode = {
					attrTreeId: treeSelectedData.attrTreeId,
					attrTreePath: treeSelectedData.attrTreePath,
					attrTreeSettings: treeSelectedData.attrTreeSettings,
					attrTreeValues: treeSelectedData.attrTreeValues,
					objId: treeSelectedData.objId,
				};
				info.selectedAttrTreeNode = selectedNode;
			}
		}
		this.documentSessionStorageService.setMainComponentInfoForPageReload(info);
	}

	/**
	 * コンテンツ一覧の初期状態を保存します.
	 */
	protected saveContentsInitState(): void {
		const state = this.accordionListInfo.map((value, index) => {
			if (value && value.state && index !== COMMON_STATE) {
				const { colState, sortState } = value.state;
				return { colState, sortState };
			} else {
				return null;
			}
		});
		if (this.info.contentsList) {
			const { colState, sortState } = this.info.contentsList.getState();
			state[this.info.accordionActiveIndex] = { colState, sortState };
		}
		this.localStorageService.setDocumentInitState({
			accordionIndex: this.info.accordionActiveIndex,
			state,
			treeAreaSize: (this.lastSplitAreaSize && this.lastSplitAreaSize.length)
				? this.lastSplitAreaSize[0]
				: this.splitAreaFirstSize
		});
	}

	/**
	 * コンテンツ一覧の初期状態を設定します.
	 * @param accordionActiveIndex アコーディオン選択インデックス
	 */
	protected setContentsInitState(accordionActiveIndex: number): void {
		const initState = this.localStorageService.getDocumentInitState();
		if (accordionActiveIndex < initState.state.length && initState.state[accordionActiveIndex]) {
			const { colState, sortState } = initState.state[accordionActiveIndex];
			const columns = this.contentsList.getColumns();
			if (colState && colState.length
				&& colState.length === columns.length
				&& colState.every(cst => columns.some(column => column.field === cst.colId))) {
					this.contentsList.setColumnState(colState);
			}
			if (sortState && sortState.length
				&& sortState.every(sst => columns.some(column => column.field === sst.colId))) {
				this.contentsList.setSortModel(sortState);
			}
		}
	}

	/**
	 * グリッドの高さを可変に設定します.
	 * @param params パラメータ
	 */
	protected getRowHeight(params) {
		let documentSessionStorageService = new EIMDocumentSessionStorageService(new EIMSessionStorageService());

		if (documentSessionStorageService.getSearchDisplayType() === 0
			&& documentSessionStorageService.getAccordionActiveIndex() === 1) {
			// ローカルストレージからフォントサイズを取得する
			let localStorageService = new EIMLocalStorageService();
			let fontSize: string = localStorageService.getFontSize();

			if (params.data.snippetAttributeList !== null || params.data.snippetFullTextList != null || params.data.snippetAttributeList !== undefined || params.data.snippetFullTextList !== undefined) {
				// スニペットに応じて高さ変動
				let rowCount = 0;
				if (params.data.snippetAttributeList !== null && params.data.snippetAttributeList !== undefined) {
					// 属性スニペットは結合して1行に表示する
					rowCount = 1;
				}
				if (params.data.snippetFullTextList !== null && params.data.snippetFullTextList !== undefined) {
					// 本文スニペットはデータごとに行表示するため行数分カウントする
					rowCount = rowCount + Object.keys(params.data.snippetFullTextList).length;
				}

				let rowHeight = 0;
				let noSnippetHeight = 0;
				switch (fontSize) {
					case "large":
						rowHeight = 23;
						noSnippetHeight = 85;
						break;
					case "middle":
						rowHeight = 19;
						noSnippetHeight = 80;
						break;
					case "small":
						rowHeight = 18;
						noSnippetHeight = 70;
						break;
				}
				return noSnippetHeight + rowCount * rowHeight;

			} else {
				// スニペットなしの高さ
				switch (fontSize) {
					case "large":
						return 85;
					case "middle":
						return 80;
					case "small":
						return 70;
				}
			}
		} else {
			// リスト表示時の高さ
			return 25;
		}
	}
	/**
	 * Boxファイルドロップ時のイベントハンドラです.
	 * @param event イベント
	 */
	onDropBoxFile(event: DragEvent) {
		event.stopPropagation();
		event.preventDefault();
		this.isFileDragging = false;

		const userAgent = window.navigator.userAgent;
		const isIE = userAgent.indexOf('Trident/') >= 0;

		// ドラッグしたEIMファイル情報を取得
		const jsonData = event.dataTransfer.getData(
			isIE ? 'text' : 'application/json'
		);
		if (jsonData === '') {
			return;
		}
		const data: BoxEIMFileDragInfo[] = JSON.parse(jsonData);

		if (!data || !data.length) {
			return;
		}
		// ドラッグ操作が終了したら false に設定
		this.boxFileDragging = false;

		// Box 上からドキュメントを登録するフラグを true に設定
		this.eimBoxContentsListComponentService.copyToEIMFlag = true;

		//ドキュメント登録確認ダイアログ表示
		this.documentCreatorConfirmation(data);
	}

	/**
	 * 外部からの物理フォルダ/ファイルドロップハンドラ
	 * @param event イベント
	 */
	public async onDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.isFileDragging = false;

		if (event.dataTransfer?.items) {
			const addFileList = [];
			const fileProcessList: Promise<void>[] = [];

			// ファイル処理の完了を待つPromise
			const processPromise = this.handleFileDrop(
				event,
				addFileList,
				fileProcessList
			);

			await processPromise;
		}
	}

	/**
	 * ドラッグポインタがコンテンツリストに入っている時のイベントハンドラです.
	 * @param event イベント
	 */
	onDragOver(event: DragEvent) {
		if (event.preventDefault) {
			event.preventDefault();
		}
		event.dataTransfer.dropEffect = 'copy';
	}

	/**
	 * ドラッグポインタがコンテンツリストに入った時のイベントハンドラです.
	 * @param event イベント
	 */
	onDragEnter(event: DragEvent) {
		this.fileDragEnterTarget = event.target;
		this.isFileDragging = this.info.accordionActiveIndex === accordionIndex.WORKSPACE ? true : false;
		event.stopPropagation();
		event.preventDefault();
	}

	/**
	 * ドラッグポインタがコンテンツリストから離れた時のイベントハンドラです.
	 * @param event イベント
	 */
	onDragLeave(event: DragEvent) {
		// ポインタがBlockUIの外に出るまでBlockUIの表示を継続する
		if (event.target === this.fileDragEnterTarget) {
			event.stopPropagation();
			event.preventDefault();
			this.fileDragEnterTarget = undefined;
		}
		this.isFileDragging = false;
	}
	
	/**
	 * preview off
	 */
	thumbnailOFF(): void {
		// 表を可視化する
		const grids = document.getElementById('dataGridDiv');
		grids.style.visibility = 'visible';
		// サムネイルを非表示にする
		this.info.isThumbnailsVisible = false;
	}

	/**
	 * preview on
	 */
	thumbnailON(): void {
		// 表を非表示にする
		const grids = document.getElementById('dataGridDiv');
		grids.style.visibility = 'hidden';
		// 表の値が格納されている変数
		this.info.isThumbnailsVisible = true;
	}

	/**
	 * preview onChange
	 */
	snippetWorkspaceChangeClick(event: any):void {
		this.documentSessionStorageService.setWorkspaceDisplayType(this.selectedWorkspaceDisplayTypeId);
		if (this.selectedWorkspaceDisplayTypeId === EIMConstantService.DISPLAY_THUMBNAIL){
			this.thumbnailON();
		}else{
			this.thumbnailOFF();
		}
	}

	/**
	 * select Thumnail
	 */	
	onSelectThumnail(selectedData): void {
		this.contentsList.select(selectedData, false);
		this.contentsMainComponentService.selectedContensHandler(this.contentsList.getSelectedData());
	}

	/**
	 * コンテンツリスト初期化ハンドラ.
	 * @param event イベント
	 */
	public onInitializeThumbnail(event): void {
		const parentData = this.contentsTree.getSelectedData();
        for (let i = 0; i < event.menuItems.length; i++) {
            let menuItem: EIMMenuItem = event.menuItems[i];
            let result: boolean = this.contentsMainComponentService.validation(menuItem.name, this.info, parentData, [event.data]);
            if (result) {
                menuItem.disabled = false;
            } else {
                menuItem.disabled = true;
            }
        }
	}

	/**
	 * コンテンツリスト初期化ハンドラ.
	 * @param event イベント
	 */
	public onInitializeThumbnailView(event): void {
		event[0].sender.select(this.contentsList.getSelectedData(), false);
	}

	/**
	 * アコーディオンタブのスタイルClass名を初期化します.
	 * 表示対象のアコーディオン数に応じてアコーディオンコンテンツの高さを決定するスタイルClass名を初期化します.
	 */
	protected initializeAccordionTabClass(): void {
		// 表示するアコーディオンの数(ワークスペース/検索)
		let visibleAccordionCount = 2;

		// 回付状況確認表示反映
		if (this.isDispalyCirculationSituationAccordion) {
			this.dspCirculationSituationView = true;
			visibleAccordionCount++;
		} else {
			this.dspCirculationSituationView = false;
		}

		// 属性ツリービュー表示設定反映
		if (this.isDispalyAttributeTreeAccordion) {
			this.dspAttributeTreeView = this.serverConfigService.attributeTreeView;
			if (this.dspAttributeTreeView) {
				visibleAccordionCount++;
			}
		} else {
			this.dspAttributeTreeView = false;
		}

		this.accordionTabClass = 'visibleAccordion_x' + visibleAccordionCount;
		
	}
	
	/**
	 * ドロップされたファイル処理を行う
	 * @param event イベント
	 * @param addFileList 見つかったファイル・フォルダの情報
	 * @param fileProcessList 見つかったファイルの処理Process
	 */
	private async handleFileDrop(
		event: DragEvent,
		addFileList: any[],
		fileProcessList: Promise<void>[]
	) {
		const items = event.dataTransfer.items;

		// ドロップされたアイテムを処理
		const rootPromises = Array.from(items).map((item) => {
			const entry = item.webkitGetAsEntry();
			if (entry) {
				return this.addFileInfo(addFileList, fileProcessList, entry);
			}
			return Promise.resolve();
		});

		// すべてのアイテム処理が完了するまで待機
		await Promise.all(rootPromises);
		await Promise.all(fileProcessList);

		// ファイルドロップの後処理
		this.dropFileService.doDropFile(addFileList);
	}

	/**
	 * ファイル情報の取得
	 * @param fileList 見つかったファイル・フォルダの情報
	 * @param fileProcessList 見つかったファイルの処理Process
	 * @param item 検索中のインスタンス
	 * @param path 検索中のパス
	 */
	private async addFileInfo(
		fileList: any[],
		fileProcessList: Promise<void>[],
		item: any,
		path: string = ""
	) {
		if (item.isFile) {
			// ファイルの場合はファイル処理を追加
			const process = this.getFile(item).then((file) => {
				fileList.push({ isFile: true, fullPath: item.fullPath, file });
			});
			fileProcessList.push(process);
		} else if (item.isDirectory) {
			// ディレクトリの場合、情報を追加
			fileList.push({ isFile: false, fullPath: item.fullPath });
			const dirReader = item.createReader();

			// サブディレクトリのエントリを読み込むPromise
			const entries = await this.readDirectoryEntries(dirReader);

			// サブディレクトリの処理を非同期で行う
			const subDirPromises: Promise<void>[] = entries.map((entry) =>
				this.addFileInfo(
					fileList,
					fileProcessList,
					entry,
					path + item.name + "/"
				)
			);

			// サブディレクトリの処理完了を待機
			await Promise.all(subDirPromises);
		}
	}

	/**
	 * ディレクトリ内のエントリを読み込む
	 * @param dirReader ディレクトリリーダー
	 * @returns エントリのリスト
	 */
	private async readDirectoryEntries(dirReader: any): Promise<any[]> {
		const allEntries: any[] = [];

		// 非同期でディレクトリのエントリを再帰的に読み込む
		await new Promise<void>((resolve) => {
			const readNext = () => {
				dirReader.readEntries((results) => {
					if (!results.length) {
						resolve();
					} else {
						allEntries.push(...results);
						readNext();
					}
				});
			};
			readNext();
		});

		return allEntries;
	}
	/**
	 * ファイルインスタンスの取得
	 * @param item ファイル情報
	 */
	private getFile(item: any): Promise<File> {
		return new Promise((resolve, reject) => {
			item.file(
				(file: File) => {
					resolve(file);
				},
				(error: any) => reject(error)
			);
		});
	}


}
