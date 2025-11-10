import { EIMFormSearchConditionComponent } from '../form-search-condition/form-search-condition.component';
import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';

import { EIMFormMainComponentService, EIMFormMainComponentInfo } from 'app/forms/components/form-main/form-main.component.service';

import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMWorkspaceTreeComponentService, EIMWorkspaceTreeNode } from 'app/forms/components/workspace-tree/workspace-tree.component.service';
import { EIMProcessingTreeComponentService } from 'app/forms/components/processing-tree/processing-tree.component.service';
import { EIMFormListComponentService } from 'app/forms/components/form-list/form-list.component.service';

import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMReloadService } from 'app/shared/services/reload.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMWebDAVService } from 'app/shared/services/webdav.service';

import { EIMFormsConstantService } from 'app/forms/shared/services/forms-constant.service';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMFormDisplayColumnService } from 'app/forms/shared/services/form-display-column.service';

import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMDialogManagerComponentService } from 'app/forms/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDialogSharedManagerComponentService} from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';
import { EIMFormAuthenticationService } from 'app/forms/shared/services/apis/authentication.service';

import { EIMFormSearchConditionComponentService } from 'app/forms/components/form-search-condition/form-search-condition.component.service';

// DTO
import { EIMFormWorkspaceDTO } from 'app/shared/dtos/form-workspace.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormTypeFolderDTO } from 'app/shared/dtos/form-type-folder.dto';

import { EIMFormCriteria } from 'app/shared/domains/criteria/form.criteria';

// レンダラー
import { EIMIdRendererComponent } from 'app/forms/shared/components/renderer/id-renderer.component';
import { EIMIdRendererComponentService } from 'app/forms/shared/components/renderer/id-renderer.component.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMFormUserService } from 'app/forms/shared/services/apis/user.service';
import { EIMUserSessionService } from 'app/shared/services/user-session.service';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';

export interface EIMFormMainComponentGridState {
	// カラム
	columns?: EIMDataGridColumn[];
	// フィルターモデル
	filterModel?: any;
	// ソートモデル
	sortModel?: any;
	// スクロール位置
	scrollTop?: any;
	// 選択行データ
	selectedData?: any[];
}

/**
 * 帳票メインコンポーネント
 * @example
 *
 *      <eim-form-main
 *          jumpTargetId="jumpTargetId"
 *      >
 *      </eim-form-main>
 */
@Component({
    selector: 'eim-form-main',
    templateUrl: './form-main.component.html',
    styleUrls: ['./form-main.component.css'],
    providers: [
        MenubarModule,
        BreadcrumbModule,
        EIMFormMainComponentService,
        EIMWorkspaceTreeComponentService,
        EIMProcessingTreeComponentService,
        EIMFormSearchConditionComponentService,
        EIMFormListComponentService
    ],
    standalone: false
})
export class EIMFormMainComponent implements OnInit, AfterViewInit, OnDestroy {

	/** ワークスペースツリーコンポーネント */
	@ViewChild('workspaceTree', { static: true })
		workspaceTree: EIMTreeComponent;

	/** 処理待ちツリーコンポーネント */
	@ViewChild('processingTree', { static: true })
		processingTree: EIMTreeComponent;

	/** グリッドコンポーネント */
	@ViewChild('contentsList', { static: true })
		contentsList: EIMDataGridComponent;

	/** 検索条件コンポーネント */
	@ViewChild('searchConditionAccordion', { static: true })
		searchConditionAccordion: EIMFormSearchConditionComponent;

	/** URLダイレクトアクセス対象オブジェクトID */
	@Input('jumpTargetId') public jumpTargetId: number;

	/** 初期オープンアコーディオン */
	@Input('openAccordion') public openAccordion: string;

	/** ワークスペースツリー選択データ */
	public workspaceTreeSelectedData: EIMWorkspaceTreeNode[] = [];

	/** 処理待ちツリー選択データ */
	public processingTreeSelectedData: EIMWorkspaceTreeNode[] = [];

	/** URLダイレクトアクセス後のグリッド選択対象オブジェクトID */
	private selectedObjIdAfterContentsAccess: number;

	/** ドキュメントメインコンポーネント情報 */
	public info: EIMFormMainComponentInfo = {};

	/** アコーディオンクリック無効化フラグ（サーバー処理中にアコーディオンを変更できなくするために使用） */
	public disabledAccordion: boolean = false;

	/** リロードサブスクリプション */
	private reloadServiceReload: Subscription;

	/** セッションタイムアウトサブスクリプション */
	protected sessionTimeoutServiceSessionTimeout: Subscription;

	/** 表示列選択サブスクリプション */
	protected formDisplayColumnServiceSelectedDisplayColumnCompleted: Subscription;

	/** IDクリックサブスクリプション */
	protected idRendererComponentServiceClicked: Subscription;

	/** 言語変更サブスクリプション */
	private translateServiceOnLangChange: Subscription;

	/** 検索実行サブスクリプション */
	protected formSearchConditionComponentServiceDoSearch: Subscription;

	/** クリア実行サブスクリプション */
	protected formSearchConditionComponentServiceDoClear: Subscription;

	/** 処理待機フラグ */
	private timer: boolean = false;

	/* ==========================================================================
     メニューの定義
     ========================================================================== */
	// 帳票登録
	public menuFormCreate: EIMMenuItem = {label: '', rKey: 'EIM_FORMS.LABEL_03002', name: 'doFormCreate', icon: 'eim-icon-file', command: (event) => {this.invokeMethod(event, this.contentsList, 'doFormCreate'); }};
	// 流用作成
	public menuFormDivertCreate: EIMMenuItem = {label: '', rKey: 'EIM_FORMS.LABEL_03003', name: 'doFormDivertCreate', icon: 'eim-icon-branch-copy', command: (event) => {this.invokeMethod(event, this.contentsList, 'doFormDivertCreate'); }};
	// 帳票削除
	public menuFormDelete: EIMMenuItem = {label: '', rKey: 'EIM_FORMS.LABEL_03005', name: 'doFormDelete', icon: 'fa fa-trash', command: (event) => {this.invokeMethod(event, this.contentsList, 'doFormDelete'); }};
	// 元に戻す
	public menuFormRestore: EIMMenuItem = {label: '', rKey: 'EIM_FORMS.LABEL_03006', name: 'doFormRestore', icon: 'eim-icon-first', command: (event) => {this.invokeMethod(event, this.contentsList, 'doFormRestore'); }};
	// 帳票移動
	public menuFormMove: EIMMenuItem = {label: '', rKey: 'EIM_FORMS.LABEL_03007', name: 'doFormMove', icon: 'fa fa-scissors', command: (event) => {this.invokeMethod(event, this.contentsList, 'doFormMove'); }};
	// アクセス履歴
	public menuFormAccessHistory: EIMMenuItem = {label: '', rKey: 'EIM_FORMS.LABEL_03013', name: 'doFormAccessHistory', icon: 'eim-icon-list', command: (event) => {this.invokeMethod(event, this.contentsList, 'doFormAccessHistory'); }};
	// CSVダウンロード
	public menuFormCSVDownload: EIMMenuItem = {label: '', rKey: 'EIM_FORMS.LABEL_03009', name: 'doFormCSVDownload', icon: 'eim-icon-download', command: (event) => {this.invokeMethod(event, this.contentsList, 'doFormCSVDownload'); }};
	// 表示列編集
	public menuDisplayColumnEdit: EIMMenuItem = {label: '', rKey: 'EIM_FORMS.LABEL_03011', name: 'doDisplayColumnEdit', icon: 'eim-icon-table', command: (event) => {this.invokeMethod(event, this.contentsList, 'doDisplayColumnEdit'); }};
	// セパレータ
	public menuSeparator: MenuItem = {separator: true};

	/** コンテンツリストメニュー */
	public menuItems: EIMMenuItem[] = [
		// 新規
		{label: '', rKey: 'EIM_FORMS.LABEL_03001', name: 'mainNew', icon: 'eim-icon-plus', items: [
			Object.assign({}, this.menuFormCreate),
			Object.assign({}, this.menuFormDivertCreate),
			]
		},
		// 編集
		{label: '', rKey: 'EIM_FORMS.LABEL_03004', name: 'mainEdit', icon: 'eim-icon-pencil', items: [
			Object.assign({}, this.menuFormDelete),
			Object.assign({}, this.menuFormRestore),
			Object.assign({}, this.menuFormMove),
			]
		},
		// 検索
		{label: '', rKey: 'EIM_FORMS.LABEL_03012', name: 'mainSearch', icon: 'eim-icon-search', command: (event) => {this.invokeMethod(event, this.contentsList, 'doSearch'); }},
		// プロパティ
		{label: '', rKey: 'EIM_FORMS.LABEL_03008', name: 'mainProperty', icon: 'eim-icon-list', items: [
		  Object.assign({}, this.menuFormAccessHistory),
		  Object.assign({}, this.menuFormCSVDownload),
			]
		},
		// 表示
		{label: '', rKey: 'EIM_FORMS.LABEL_03010', name: 'mainDisplay', icon: 'eim-icon-table', items: [
			Object.assign({}, this.menuDisplayColumnEdit),
			]
		}
	];

	/** コンテンツリストコンテキストメニュー */
	public contentsListMenuItems: EIMMenuItem[] = [
		Object.assign({}, this.menuFormDivertCreate),
		Object.assign({}, this.menuFormDelete),
		Object.assign({}, this.menuFormRestore),
		Object.assign({}, this.menuFormMove),
		Object.assign({}, this.menuFormAccessHistory),
		Object.assign({}, this.menuFormCSVDownload),
	];

	/** コンテンツツリーコンテキストメニュー */
	public contentsTreeMenuItems: EIMMenuItem[] = [
		Object.assign({}, this.menuDisplayColumnEdit),
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected dialogManagerSharedComponentService: EIMDialogSharedManagerComponentService,
		public translateService: TranslateService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected contentsMainComponentService: EIMFormMainComponentService,
		public workspaceTreeComponentService: EIMWorkspaceTreeComponentService,
		public processingTreeComponentService: EIMProcessingTreeComponentService,
		public formListComponentService: EIMFormListComponentService,
		protected authenticationService: EIMFormAuthenticationService,
		protected messageService: EIMMessageService,
		protected webDAVService: EIMWebDAVService,
		protected serverConfigService: EIMServerConfigService,
		protected reloadService: EIMReloadService,
		protected sessionTimeoutService: EIMSessionTimeoutService,
		protected formDisplayColumnService: EIMFormDisplayColumnService,
		protected formSearchConditionComponentService: EIMFormSearchConditionComponentService,
		protected localStorageService: EIMLocalStorageService,
		protected idRendererComponentService: EIMIdRendererComponentService,
		protected formCacheService: EIMFormsCacheService,
		protected location: Location,
		protected sessionStorageService: EIMSessionStorageService,
		protected userService: EIMFormUserService,
		protected userSessionService: EIMUserSessionService,
	) {

		this.info = {
				// アコーディオン選択インデックス
				accordionActiveIndex: 0,
				// CRUD処理完了後のハンドラ
				onComplete: (info: EIMFormMainComponentInfo, createdData: any[], updatedData: any[], deletedData: any[], refreshData: any[] = null) => {

					if (refreshData) {
						info.contentsList.setData(refreshData);
					} else {
						if (deletedData && deletedData.length > 0) {
							info.contentsList.removeRowData(deletedData);
						}

						if (createdData && createdData.length > 0) {

							let selectedData: any[] = [];
							for (let i = 0; i < createdData.length; i++) {
								let data: any = createdData[i];
								selectedData.push(data.data);
								// 先頭行に追加
								info.contentsList.addRowDataToIndex([data.data], 0);

							}

							// グリッドのスクロール位置を設定
							info.contentsList.ensureIndexVisible(0);
							// 追加したドキュメント・フォルダを選択状態にする
							info.contentsList.select(selectedData);

						}

						if (updatedData && updatedData.length > 0) {
							info.contentsList.updateRowData(updatedData);
						}
					}
					// 現在のグリッドのデータを保存する
					info.formListComponentService.saveFormData(this.info.accordionActiveIndex, info.contentsList.getData());

					// 処理待ち件数アコーディオンを開いている場合、選択ツリーノードの件数を
					// 取得した帳票の件数に上書きする
					if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
						let selectedTreeNode: EIMWorkspaceTreeNode = this.info.processingTree.getSelectedData()[0];
						if (selectedTreeNode) {
							let count: number = this.contentsList.getData().length;
							this.processingTreeComponentService.updateFormCount(selectedTreeNode, count);
						}
					}

				}
		};

		// TranslateServiceでリソースが利用可能かどうかを判定する
		let checkKey: string = 'EIM_FORMS.LABEL_01000';
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
			let serviceParam: any = {};
			if (this.info.selectedTreeNode) {
				serviceParam.formWorkspaceId = this.info.selectedTreeNode.formWorkspaceId;
				serviceParam.formTypeId = this.info.selectedTreeNode.formTypeId;
				serviceParam.formTypeFolderId = this.info.selectedTreeNode.formTypeFolderId;
				serviceParam.isTrash = this.info.selectedTreeNode.isTrash;
			}

			if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
				// ワークスペースツリー
				this.workspaceTree.data = this.workspaceTree.info.data;
				// ワークスペースツリー初期処理
				this.workspaceTreeComponentService.initialize(this.workspaceTree.info, serviceParam, this.workspaceTree.initialized, this.workspaceTree.selected);
			} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
				// 処理待ちツリー
				this.processingTree.data = this.processingTree.info.data;
				// 処理待ちツリー初期処理
				this.processingTreeComponentService.initialize(this.processingTree.info, serviceParam, this.processingTree.initialized, this.processingTree.selected);
			} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
				// 検索
			}

		});

		/**
		 * セッションタイムアウトイベントハンドラ.
		 * @param message メッセージ
		 */
		this.sessionTimeoutServiceSessionTimeout =  this.sessionTimeoutService.sessionTimeout.subscribe( (message: string) => {
			this.messageService.show(EIMMessageType.error, message,
			() => {
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

		/**
		 * 検索実行イベントハンドラ.
		 * @param condition 検索条件
		 */
		this.formSearchConditionComponentServiceDoSearch = this.formSearchConditionComponentService.doSearch.subscribe( (criteria: EIMFormCriteria) => {
			// 検索実行
			this.onSearch(criteria);
		});

		/**
		 * 検索条件検索結果クリアイベントハンドラ
		 */
		this.formSearchConditionComponentServiceDoClear = this.formSearchConditionComponentService.doClear.subscribe( () => {
			// 帳票一覧をクリア
			this.formListComponentService.clearFormData(this.contentsList.info, this.info.accordionActiveIndex);
		});

		/**
		 * 検索条件表示イベントハンドラ
		 */
		this.info.searchCondtionShowed = new EventEmitter<any>();
		this.info.searchCondtionShowed
			.subscribe( (result: any) => {
				this.onChangeAccordionTab({index: EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH});
			});

		// パスワードの変更が必要であるか確認
		this.userSessionService.afterUserSessionGot.subscribe((user:EIMUserDTO) => {
			let jumpTargetId = this.jumpTargetId;
			if(user.config.changePasswordFlg){
				this.jumpTargetId = null;
				this.authenticationService.getNotesMessage().subscribe(value => {
					let count = this.countCharacterUsingRegex(value, EIMConstantService.LOOP_BACK_CHARACHER_LF);
					let height;
					if(count == 0){
						height = String(EIMConstantService.CHANGE_PASSWORD_DISP_MIN_HEIGHT);
					}else{
						height = String(EIMConstantService.CHANGE_PASSWORD_DISP_MIN_HEIGHT + (20 * count));
					}
					let dialogId: string = this.dialogManagerSharedComponentService.showPasswordChange(this.authenticationService, true,height,
						{
							updated: (data) => {
								//パスワードの更新完了時にジャンプ処理が必要か確認する
								this.dialogManagerSharedComponentService.close(dialogId);
								this.jumpTargetId = jumpTargetId;
								if(this.jumpTargetId){
									// ワークスペースアコーディオンを開く
									this.info.accordionActiveIndex = EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE;
									this.onChangeAccordionTab({index: this.info.accordionActiveIndex});
		
									// ジャンプする
									this.workspaceTreeComponentService.contentsAccess(this.workspaceTree.info, this.jumpTargetId, this.workspaceTree.initialized, this.workspaceTree.selected);
									}
							}
						}
					)
				})
			}
		})
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit() {

		/**
		 * 表示列選択完了イベントハンドラ
		 */
		this.formDisplayColumnServiceSelectedDisplayColumnCompleted = this.formDisplayColumnService.selectedDisplayColumnCompleted.subscribe( (event: any) => {
			this.onAfterSelectTreeNode(event);
		});

	}

	/**
	 * コンポーネント描画後イベントハンドラ.
	 */
	ngAfterViewInit(): void {

		this.info.workspaceTree = this.workspaceTree;
		this.info.workspaceTreeComponentService = this.workspaceTreeComponentService;
		this.info.processingTree = this.processingTree;
		this.info.contentsList = this.contentsList;
		this.info.searchConditionAccordion = this.searchConditionAccordion;
		this.info.formListComponentService = this.formListComponentService;

		// グリッドに同一行判定関数をセットする
		this.contentsList.equals = (obj1: any, obj2: any) => {
			return (obj1.id === obj2.id ? true : false);
		};
		// グリッドに同一行判定関数をセットする
		this.contentsList.info.equals = this.contentsList.equals;

		window.setTimeout( () => {

			// forms.componentsでURLパラメータを取得しているのでURLパラメータは削除する
			this.location.go(this.authenticationService.getMainUrl());

			if (this.jumpTargetId) {
				// ワークスペースアコーディオンを開く
				this.info.accordionActiveIndex = EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE;
				this.onChangeAccordionTab({index: this.info.accordionActiveIndex});

				// ジャンプする
				this.workspaceTreeComponentService.contentsAccess(this.workspaceTree.info, this.jumpTargetId, this.workspaceTree.initialized, this.workspaceTree.selected);

				return;
			}

			if (this.openAccordion) {
				// パラメータで指定されたアコーディオンを開く
				if (this.openAccordion === 'processing') {
					this.info.accordionActiveIndex = EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING;
				} else if (this.openAccordion === 'search') {
					this.info.accordionActiveIndex = EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH;
				} else {
					this.info.accordionActiveIndex = EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE;
				}

			} else {
				// パラメータで指定がない場合はコンポーネントサービスで設定したアコーディオンを開く
				this.info.accordionActiveIndex = this.contentsMainComponentService.getInitAccordionIndex();
			}

			this.onChangeAccordionTab({index: this.info.accordionActiveIndex});

		});

		/**
		 * IDクリックイベントハンドラ
		 */
		this.idRendererComponentServiceClicked = this.idRendererComponentService.idClicked.subscribe( (event: any) => {
			// 行を選択状態にする
			this.contentsList.select([event], false);
			// 帳票詳細を表示する
			this.invokeMethod(event, this.contentsList, 'doFormUpdate');
		});


	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {

		// リロードサブスクリプション
		if (!this.reloadServiceReload.closed) {
			this.reloadServiceReload.unsubscribe();
		}

		// セッションタイムアウトサブスクリプション
		if (!this.sessionTimeoutServiceSessionTimeout.closed) {
			this.sessionTimeoutServiceSessionTimeout.unsubscribe();
		}

		// 表示列選択サブスクリプション
		if (!this.formDisplayColumnServiceSelectedDisplayColumnCompleted.closed) {
			this.formDisplayColumnServiceSelectedDisplayColumnCompleted.unsubscribe();
		}

		// IDクリックサブスクリプション
		if (!this.idRendererComponentServiceClicked.closed) {
			this.idRendererComponentServiceClicked.unsubscribe();
		}

		// 言語変更サブスクリプション
		if (!this.translateServiceOnLangChange.closed) {
			this.translateServiceOnLangChange.unsubscribe();
		}

		// 検索実行サブスクリプション
		if (!this.formSearchConditionComponentServiceDoSearch.closed) {
			this.formSearchConditionComponentServiceDoSearch.unsubscribe();
		}

		// クリア実行サブスクリプション
		if (!this.formSearchConditionComponentServiceDoClear.closed) {
			this.formSearchConditionComponentServiceDoClear.unsubscribe();
		}

	}

	/**
	 * フォルダツリーノード選択ハンドラ.
	 * 子オブジェクトを取得して、フォルダツリー、ドキュメント一覧を更新します.
	 * @param event イベント
	 */
	public onSelectTreeNode(event: any) {

		let treeNode: EIMWorkspaceTreeNode = event.selectedData[0];

		if (!treeNode) {
			this.info.selectedTreeNode = null;
			this.info.selectedFormType = null;
			this.info.selectedDisplayColumn = null;
			// 一覧をクリアする
			this.formListComponentService.clearFormData(this.contentsList.info, this.info.accordionActiveIndex);
			return;
		}

		window.setTimeout( () => {
			// アコーディオンクリックを無効化
			this.disabledAccordion = true;
		});

		let params: any = {};
		this.info.selectedTreeNode = treeNode;
		params.selectedTreeNode = treeNode;
		params.targetObjectList = (event.params && event.params.targetObjectList ? event.params.targetObjectList : []);
		params.eventDateTime = event.eventDateTime;

		// 表示列取得
		this.formDisplayColumnService.selectDisplayColumn(this.info.accordionActiveIndex, params);

	}

	/**
	 * 表示列取得後ハンドラ.
	 * @param event イベント
	 */
	public onAfterSelectTreeNode(event: any): void {
		// カラムの変更
		this.formListComponentService.setColumns(this.contentsList, this.info.accordionActiveIndex, event.columns);
		// 選択帳票タイプ
		this.info.selectedFormType = event.formType;
		// 選択帳票タイプの表示列
		this.info.selectedDisplayColumn = event.displayColumn;
		let columnIds: string[] = [];
		if (this.info.selectedDisplayColumn) {
			this.info.selectedDisplayColumn.columns.forEach( (column: any) => {
				columnIds.push(column.columnId);
			});
		}

		// 帳票一覧の条件を作成する
		let selectedTreeNode: EIMWorkspaceTreeNode;
		if (event.params && event.params.selectedTreeNode) {
			selectedTreeNode = event.params.selectedTreeNode;
		} else {
			selectedTreeNode = this.getSelectedTreeNode();
		}
		let criteria = this.makeFormCriteria(selectedTreeNode, columnIds);

		let selectedData: any[];
		if (event.params && event.params.targetObjectList && event.params.targetObjectList.length > 0) {
			selectedData = event.params.targetObjectList;
		} else {
			selectedData = this.contentsList.getSelectedData();
		}

		// 一覧をクリアする
		this.formListComponentService.clearFormData(this.contentsList.info, this.info.accordionActiveIndex);

		// 帳票一覧を更新する
		let eventDateTime: Date = event.params && event.params.eventDateTime ? event.params.eventDateTime : null;
		this.contentsList.initialize(
			{criteria: criteria, type: this.info.accordionActiveIndex, selectedData: selectedData, eventDateTime: eventDateTime, selectedTreeNode: selectedTreeNode},
			true
		);

		if (this.jumpTargetId) {
			let parentData = {id: event.params.selectedTreeNode.formWorkspaceId};
			selectedData = event.params.targetObjectList;
			this.contentsMainComponentService.invokeMethod('doFormUpdate', this.info, parentData, selectedData, this.info.accordionActiveIndex);
			// ジャンプ対象のIDをクリアする
			this.jumpTargetId = null;
		}
	}

	/**
	 * 帳票一覧取得用の検索条件を作成する.
	 */
	public makeFormCriteria(selectedTreeNode: EIMWorkspaceTreeNode, columnIds: string[]): EIMFormCriteria {
		let criteria = new EIMFormCriteria();
		criteria.formWorkspaceId = selectedTreeNode.formWorkspaceId;
		criteria.formTypeId = selectedTreeNode.formTypeId;
		criteria.formTypeFolderId = selectedTreeNode.formTypeFolderId;
		criteria.invalidateFlag = selectedTreeNode.isTrash;
		criteria.targetColumnIds = columnIds;
		// criteria.accessRoleTypeはサーバー呼び出し直前で設定するため、ここでは設定しない

		return criteria;
	}

	/**
	 * 検索実行.
	 * @param criteria 帳票検索条件クライテリア
	 */
	public onSearch(criteria: EIMFormCriteria): void {
		// 検索実行をして帳票一覧を更新する
		this.contentsList.initialize({criteria: criteria, type: this.info.accordionActiveIndex}, true);
	}

	/**
	 * コンテンツグリッド初期化ハンドラ.
	 * @param event イベント
	 */
	public onInitializeContentsList(event: any): void {

		window.setTimeout( () => {
			// アコーディオンクリックを有効化
			this.disabledAccordion = false;
		});

		// 処理待ち件数アコーディオンを開いている場合、選択ツリーノードの件数を
		// 取得した帳票の件数に上書きする
		if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			let selectedTreeNode: EIMWorkspaceTreeNode = event.serviceParam.selectedTreeNode;
			if (selectedTreeNode) {
				let count: number = this.contentsList.getData().length;
				this.processingTreeComponentService.updateFormCount(selectedTreeNode, count);
			}
		} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			// 検索実行時の検索結果が0件の場合メッセージを表示
			if (this.contentsList.info.rowCount === 0) {
				this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
			}
		}
	}

	/**
	 * ツリーエラーハンドラ.
	 * @param event イベント
	 */
	public onTreeError(event: any): void {

		window.setTimeout( () => {
			// アコーディオンクリックを有効化
			this.disabledAccordion = false;
		});

		if (event === 'contentsAccess') {
			// ジャンプ対象のIDをクリアする
			this.jumpTargetId = null;
		}
	}

	/**
	 * グリッド行ダブルクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onRowDoubleClicked(event: any): void {
		// 帳票詳細を表示する
		this.invokeMethod(event, this.contentsList, 'doFormUpdate');
	}

	/**
	 * カラムサイズ変更イベントハンドラ.
	 * @param event イベント
	 */
	public onColumnResized(event: any): void {

		if (!this.info.selectedDisplayColumn) {
			return;
		}

		if (this.timer) {
			return;
		}

		this.timer = true;

		window.setTimeout( () => {
			this.formDisplayColumnService.setDisplayColumnSize(this.info.selectedDisplayColumn, event.column.colDef.field, event.column.actualWidth);
			this.timer = false;
		}, 800);
	}

	/**
	 * カラム移動イベントハンドラ.
	 * @param event イベント
	 */
	public onColumnMoved(event: any): void {

		// 「検索」アコーディオンの場合はreturn
		if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH || !this.info.selectedDisplayColumn) {
			return;
		}

		if (this.timer) {
			return;
		}

		this.timer = true;

		window.setTimeout( () => {
			this.formDisplayColumnService.moveDisplayColumn(this.info.selectedDisplayColumn, event.column.colId, event.toIndex);
			this.timer = false;
		}, 0);

	}

	/**
	 * ソート変更イベントハンドラ.
	 * @param event イベント
	 */
	public onSortChanged(event: any): void {
		if (!this.info.selectedDisplayColumn) {
			return;
		}

		let sortModel: any[] = this.contentsList.getSortModel();

		// ソート解除された場合はsortModel[0]の中はnull
		let colId: string = sortModel[0] ? sortModel[0].colId : null;
		let sort: string = sortModel[0] ? sortModel[0].sort : null;

		this.formDisplayColumnService.setDisplayColumnSort(this.info.selectedDisplayColumn, colId, sort);
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * メニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	public onContextMenuContentsList(event: MouseEvent): void {
		window.setTimeout(() => {
			let parentData: any = this.getSelectedTreeNode();
			let selectedData: any[] = this.contentsList.getSelectedData();

			for (let i = 0; i < this.contentsListMenuItems.length; i++) {
				let menuItem: EIMMenuItem = this.contentsListMenuItems[i];
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
	 * アコーディオンタブ変更イベントハンドラ
	 * @param event イベント
	 */
	public onChangeAccordionTab(event: any): void {

		// 読み込みのタイミングによってはキャッシュからユーザを取得できないので
		// 取得できない場合はログイン時に格納したローカルストレージからユーザIDを取得する
		let loginUser: EIMUserDomain = this.formCacheService.getLoginUser();
		let loginUserId: number = loginUser ? loginUser.id : this.localStorageService.getUserId();

		// アコーディオンタブ変更前のインデックス
		let prevAccordionActiveIndex: number = this.info.accordionActiveIndex;

		// アコーディオンタブインデックス変数を再セットする
		this.info.accordionActiveIndex = event.index;

		// 最新に更新ボタンを非活性にする
		this.reloadService.doDisable(false);

		// 現在のグリッドを保存する
		this.formListComponentService.saveGrid(this.contentsList, prevAccordionActiveIndex);

		if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {

			// 初期化済みではない場合、パラメータにtrueを渡して初期化を実行できるようにする
			if (!this.workspaceTreeComponentService.canInitialize) {
				let serviceParam: any = {};
				serviceParam.canInitialize = true;
				this.workspaceTree.initialize(serviceParam, true);
			}

			// 選択帳票タイプの表示列(selectedDisplayColumn)がワークスペースアコーディオンで選択している帳票タイプへ更新する。
			if (this.info.selectedDisplayColumn && this.workspaceTreeSelectedData.length > 0 &&
					this.info.selectedDisplayColumn.formTypeId !== this.workspaceTreeSelectedData[0].formTypeId) {

				// 選択帳票タイプの表示列(selectedDisplayColumn)と選択帳票タイプ(selectedFormType)を更新する。
				this.contentsMainComponentService.updateDisplayColumnAndFormType(this.info, loginUserId, this.workspaceTreeSelectedData[0].formTypeId);
			}

		} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {

			// 初期化済みではない場合、パラメータにtrueを渡して初期化を実行できるようにする
			if (!this.processingTreeComponentService.canInitialize) {
				let serviceParam: any = {};
				serviceParam.canInitialize = true;
				this.processingTree.initialize(serviceParam, true);
			}

			//  選択帳票タイプの表示列(selectedDisplayColumn)を処理待ちアコーディオンで選択している帳票タイプへ更新する。
			if (this.info.selectedDisplayColumn && this.processingTreeSelectedData.length > 0 &&
					this.info.selectedDisplayColumn.formTypeId !== this.processingTreeSelectedData[0].formTypeId) {

				// 選択帳票タイプの表示列(selectedDisplayColumn)と選択帳票タイプ(selectedFormType)を更新する。
				this.contentsMainComponentService.updateDisplayColumnAndFormType(this.info, loginUserId, this.processingTreeSelectedData[0].formTypeId);
			}

		} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			// 検索アコーディオンタブに変更
			this.changeSearchAccordionTab(event);
		}

		// アコーディオンインデックスをローカルストレージに保存する
		this.localStorageService.setFormInitOpenAccorditonIndex(loginUserId, this.info.accordionActiveIndex);

		// グリッドを切り替える
		this.formListComponentService.switchGrid(this.contentsList, this.info.accordionActiveIndex);

		// メインメニュー活性非活性制御
		this.mainMenuActiveInactivationControl();

	}

	/**
	 * 検索アコーディオンタブ変更
	 * @param event イベント
	 */
	protected changeSearchAccordionTab(event: any): void {
		// 最新に更新ボタンを非活性にする
		this.reloadService.doDisable(true);
		// 検索グリッド用カラムをセット
		this.formListComponentService.setColumns(this.contentsList, this.info.accordionActiveIndex, this.formDisplayColumnService.getSearchDefaultColumns());
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * メニュー選択項目を実行します.
	 * @param event イベント
	 * @param targetComponent コンポーネント
	 * @param name メニュー名
	 */
	public invokeMethod(event, targetComponent: EIMListComponent<any>, name?: string): void {
		let parentData: any = this.getSelectedTreeNode();
		let selectedData: any[] = targetComponent.getSelectedData();

		this.info.selectedTreeNode = parentData;

		let method: string = name ? name : event.item.name;
		this.contentsMainComponentService.invokeMethod(method, this.info, parentData, selectedData, this.info.accordionActiveIndex);
	}

	/**
	 * 現在選択しているツリーノードを取得します.
	 * @return ツリーノード
	 */
	public getSelectedTreeNode(): EIMWorkspaceTreeNode {
		let treeNode: EIMWorkspaceTreeNode;
		let treeNodes: EIMWorkspaceTreeNode[];

		if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			treeNodes = this.workspaceTree.getSelectedData() as EIMWorkspaceTreeNode[];
			treeNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : null;
		} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			treeNodes = this.processingTree.getSelectedData() as EIMWorkspaceTreeNode[];
			treeNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : null;
		} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			treeNodes = this.contentsList.getSelectedData() as EIMWorkspaceTreeNode[];
			treeNode = treeNodes && treeNodes.length > 0 ? treeNodes[0] : null;
		}
		return treeNode;
	}

	/**
	 * メインメニューの活性非活性を制御します.
	 */
	public mainMenuActiveInactivationControl(): void {
		if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE) {
			this.mainWorkspaceActiveInactivationControl();
		} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			this.mainProcessingActiveInactivationControl();
		} else if (this.info.accordionActiveIndex === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			this.mainSearchActiveInactivationControl();
		}
	}

	/**
	 * ワークスペースアコーディオンのメニュー活性非活性を制御します.
	 */
	public mainWorkspaceActiveInactivationControl(): void {
		this.menuItems.forEach( (menuItem: EIMMenuItem) => {
			switch (menuItem.name) {
				case 'mainNew':
				case 'mainEdit':
				case 'mainSearch':
				case 'mainDisplay':
					menuItem.disabled = false;
					break;
				case 'mainProperty':
					menuItem.disabled = false;
					menuItem.items.forEach( (subMenuItem: EIMMenuItem) => {
						switch (subMenuItem.name) {
							case 'doFormCSVDownload':
								subMenuItem.disabled = true;
								break;
							case 'doFormAccessHistory':
								subMenuItem.disabled = false;
								break;
						}
					});
					break;
				default:
					menuItem.disabled = true;
			}
		});
	}

	/**
	 * 処理待ちアコーディオンのメニュー活性非活性を制御します.
	 */
	public mainProcessingActiveInactivationControl(): void {
		this.menuItems.forEach( (menuItem: EIMMenuItem) => {
			switch (menuItem.name) {
				case 'mainSearch':
				case 'mainDisplay':
					menuItem.disabled = false;
					break;
				case 'mainProperty':
					menuItem.disabled = false;
					menuItem.items.forEach( (subMenuItem: EIMMenuItem) => {
						switch (subMenuItem.name) {
							case 'doFormCSVDownload':
								subMenuItem.disabled = true;
								break;
							case 'doFormAccessHistory':
								subMenuItem.disabled = false;
								break;
						}
					});
					break;
				case 'mainNew':
				case 'mainEdit':
					menuItem.disabled = true;
					break;
				default:
					menuItem.disabled = true;
			}
		});
	}

	/**
	 * 検索アコーディオンのメニュー活性非活性を制御します.
	 */
	public mainSearchActiveInactivationControl(): void {
		this.menuItems.forEach( (menuItem: EIMMenuItem) => {
			switch (menuItem.name) {
				case 'mainProperty':
					menuItem.disabled = false;
					menuItem.items.forEach( (subMenuItem: EIMMenuItem) => {
						switch (subMenuItem.name) {
							case 'doFormCSVDownload':
								subMenuItem.disabled = false;
								break;
							case 'doFormAccessHistory':
								subMenuItem.disabled = false;
								break;
						}
					});
					break;
				case 'mainNew':
				case 'mainEdit':
				case 'mainSearch':
				case 'mainDisplay':
					menuItem.disabled = true;
					break;
				default:
					menuItem.disabled = true;
			}
		});
	}

	/**
	 * メニューアイテムラベルをリフレッシュします.
	 */
	public refreshMenuItemLabel(): void {
		let changeLabel: (menuItems: EIMMenuItem[]) => void = (menuItems: EIMMenuItem[]) => {
			for (let i = 0; i < menuItems.length; i++) {
				let menuItem: EIMMenuItem = menuItems[i];
				if (menuItem.hasOwnProperty('rKey')) {
					menuItem.label = this.translateService.instant(menuItem.rKey);
				}
				if (menuItem.items && menuItem.items.length > 0) {
					changeLabel(menuItem.items);
				}
			}
		};
		changeLabel(this.menuItems);
		let newMenuItems: EIMMenuItem[] = Object.assign([], this.menuItems);
		this.menuItems = newMenuItems;

		// コンテンツツリーコンテキストメニュー
		changeLabel(this.contentsTreeMenuItems);
		let newContentsTreeMenuItems: EIMMenuItem[] = Object.assign([], this.contentsTreeMenuItems);
		this.contentsTreeMenuItems = newContentsTreeMenuItems;

		// コンテンツグリッドコンテキストメニュー
		changeLabel(this.contentsListMenuItems);
		let newContentsListMenuItems: EIMMenuItem[] = Object.assign([], this.contentsListMenuItems);
		this.contentsListMenuItems = newContentsListMenuItems;
	}

	/**
	 * 特定の文字の数をカウントした結果を返却します。 
	 * @param str 確認する文字列
	 * @param char 集計対象文字 
	 * @returns 
	 */
	private countCharacterUsingRegex(str: string, char: string): number {
		const regex = new RegExp(char, 'g');
		const matches = str.match(regex);
	 	return matches ? matches.length : 0;
	}
}
