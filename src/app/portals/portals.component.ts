import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMHttpService } from 'app/shared/services/http.service';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { EIMDocumentsHttpService } from 'app/documents/shared/services/documents-http.service';
import { EIMConfigService } from 'app/shared/services/config.service';
import { EIMPortalAuthenticationService } from './services/apis/portal-authentication.service';
import { EIMDocumentAuthenticationService } from 'app/documents/shared/services/apis/authentication.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { Subscription } from 'rxjs';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminAuthTypeDomain } from 'app/shared/domains/entity/admin-auth-type.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMPortalsConstantService } from './services/portal-constant.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMReloadService } from 'app/shared/services/reload.service';
import { EIMUpdatedTaskDTO } from 'app/tasks/tasks.interface';
import { EIMPortalsModule } from './portals.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMDialogSharedManagerComponent } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component';
import { EIMMessageComponent } from 'app/shared/components/message/message.component';

/**
 * ポータル画面コンポーネントインタフェース
 */
export interface EIMTaskMainComponent {
	viewId: string;
	setState: (state: any) => void;
	getState: () => any;
	checkAuth?: () => void;
}

export enum EIMPortalsSideMenuEnum {
	WORKSPACES = 'workspaces',
//	SEARCH = 'search',
	DOCUMENTS = 'documents',
	TASKS = 'tasks',
	PROJECT_MASTERS = 'projectMasters',
};

/**
 * ポータルコンポーネント
 * @example
 *
 *      <eim-portals
 *
 *      >
 *      </eim-portals>
 */
@Component({
	selector: 'eim-portals',
	templateUrl: './portals.component.html',
	styleUrls: ['./portals.component.scss'],
	imports: [
		CommonModule,
		RouterModule,

		EIMPortalsModule, 
		EIMSharedModule, 
		TranslatePipe, 
		EIMDialogSharedManagerComponent,
		EIMMessageComponent
	],
	providers: [
		ToastModule,
		MenubarModule,
		ConfirmationService,
		
		EIMDocumentAuthenticationService,
		EIMDocumentsCacheService,
		
	],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMPortalsComponent implements OnInit, OnDestroy {

	/** ログインユーザ */
	public user: any = {};

	/** バージョン */
	public version: string;

	/** フォントサイズ */
	public fontSize: string = 'middle';

	/** フォントサイズクラス */
	public fontSizeClass: string = 'eim-font-size-m';

	/** サイドメニュー選択項目 */
	public portalsSideMenu: typeof EIMPortalsSideMenuEnum = EIMPortalsSideMenuEnum;
	public defaultSelectedSideMenu = EIMPortalsSideMenuEnum.WORKSPACES;
	public selectedSideMenu = this.defaultSelectedSideMenu;

	/** ステート保持オブジェクト */
	public states: any = {};

	/** リロードサブスクリプション */
	private reloadServiceReload: Subscription;

	/** 
	 * 保持管理者権限ID（現行タスク管理用の管理者権限のみチェックしている）
	 * {
	 *   task: true,
	 *   bizMaster: false,
	 *   project: true
	 * }
	 */
	public hasTaskMasterAuthId = {};

	/** セッションタイムアウトサブスクリプション */
	private sessionTimeoutServiceSessionTimeout: Subscription;

	/** 子コンポーネント */
	protected childComponentRef: any;

	/** 子コンポーネントの状態 */
	protected childComponentState: {
		workspaces?: any,
		search?: any,
		documents?: any,
		tasks?: any,
		projectMasters?: any
	} = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
		public authenticationService: EIMPortalAuthenticationService,
		@Inject(DOCUMENT) protected document: Document,
		protected translateService: TranslateService,
		protected router: Router,
		protected messageService: EIMMessageService,
		protected httpService: EIMHttpService,
		protected fileService: EIMFileService,
		protected httpForRestAPIService: EIMHttpForRestAPIService,
		protected sessionTimeoutService: EIMSessionTimeoutService,
		protected documentsHttpService: EIMDocumentsHttpService,
		protected documentAuthenticationService: EIMDocumentAuthenticationService,
		protected configService: EIMConfigService,
		protected cacheService: EIMCacheService,
		protected localStorageService: EIMLocalStorageService,
		protected serverConfigService: EIMServerConfigService,
		protected reloadService: EIMReloadService,

	) {
		// // TranslateServiceでリソースが利用可能かどうかを判定する
		// let checkKey: string = 'EIM_TASKS.LABEL_01000';
		// let checkValue: string = this.translateService.instant(checkKey);
		// if (checkKey !== checkValue) {
		// 	// キーと値が一致していない場合はキーから値を取得できているので利用可能とみなす
		// 	// メニューアイテムラベルを更新する
		// 	this.refreshMenuItemLabel();
		// }

		// // TODO: ヘッダに移動
		// this.document.body.classList.add('eim-font-size-m');

		// タスク管理の設定ファイルから読み込み
		this.documentsHttpService.contextRoot = this.configService.get('tasks.documentsHttpService.contextRoot');
		this.fileService.contextRoot = this.configService.get('tasks.documentsHttpService.contextRoot');
		this.version = this.configService.get('tasks.version');

		// ドキュメント管理画面表示時にタイムアウトした場合、ポータルのログイン画面に戻るよう設定。
		this.documentAuthenticationService.loginUrl = '/portals/login';

		// セッションタイムアウトイベントハンドラ.
		this.sessionTimeoutServiceSessionTimeout =
			this.sessionTimeoutService.sessionTimeout.subscribe( (message: string) => {
				this.messageService.show(EIMMessageType.error, message,
					() => {
						this.saveState();

						// ログイン画面に遷移する
						this.authenticationService.goToLogin();
					}
				);
			});

		
		// 最新の情報に更新イベントハンドラ.
		this.reloadServiceReload = this.reloadService.reload.subscribe( (event: any) => {

			// 選択前の子コンポーネントの状態を保持
			this.saveChildComponentStatus();

			// 子コンポーネントの状態を復元
			if (this.childComponentRef.setState) {
				const childComponentState = this.childComponentState[this.selectedSideMenu];
				this.childComponentRef.setState(childComponentState);
			}
		});
		

	}

	/**
	 * メニューアイテムラベルをリフレッシュします.
	 */
	// public refreshMenuItemLabel(): void {
	// 	let changeLabel: (menuItems: EIMMenuItem[]) => void = (menuItems: EIMMenuItem[]) => {
	// 		for (let i = 0; i < menuItems.length; i++) {
	// 			let menuItem: EIMMenuItem = menuItems[i];
	// 			if (menuItem.hasOwnProperty('rKey')) {
	// 				menuItem.label = this.translateService.instant(menuItem.rKey);
	// 			}
	// 			if (menuItem.items && menuItem.items.length > 0) {
	// 				changeLabel(menuItem.items);
	// 			}
	// 		}
	// 	};
	// 	changeLabel(this.mainMenuItems);
	// 	let newMenuItems: EIMMenuItem[] = Object.assign([], this.mainMenuItems);
	// 	this.mainMenuItems = newMenuItems;
	// }

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {

		// セッションユーザ情報取得
		this.authenticationService.getSessionUser().subscribe(user => {
			this.user = {
				userName: user.name,
				groupPath: user.groupNames,
			};

			this.cacheService.setJSessionId(user.config.jSessionId);
			// サーバの設定ファイルの値を格納
			this.serverConfigService.setConfigValueForTask(user.config);
		});

		// 管理者権限リスト読み込み
		this.authenticationService.getAdminAuth(EIMAdminsConstantService.APP_ID_TASK).subscribe(
			(authList: EIMAdminAuthTypeDomain[]) => {

				authList.forEach((auth: EIMAdminAuthTypeDomain) => {
					const user: EIMUserDomain = this.cacheService.getLoginUser();
					const hasAuth = (user.admin & parseInt(auth.value)) === parseInt(auth.value);
					this.hasTaskMasterAuthId[auth.id] = hasAuth;
				});
				this.cacheService.setHasAuthId(this.hasTaskMasterAuthId);

			}
		);

		const url = location.href.split('?');
		const isFromLoginComponent = url?.[0].endsWith('/portals/main') ;

		// 前回の状態を取得
		const state = this.localStorageService.getUserItemByKeys(EIMPortalsConstantService.LOCAL_STORAGE_KEYS_STATE);
		const directAccessInfo = this.localStorageService.getUserItemByKeys(EIMConstantService.LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO);

		// 画面更新（F5押下時）
		if (!isFromLoginComponent) {

			// URLからサイドバーの選択状態を設定
			let pathArray = location.href.split('/portals/main/');
			let appPath = pathArray[1];
			if (appPath.startsWith('workspaces')) {
				this.selectedSideMenu = this.portalsSideMenu.WORKSPACES;
			// } else if (appPath.startsWith('search')) {
			// 	this.selectedSideMenu = this.portalsSideMenu.SEARCH;
			} else if (appPath.startsWith('documents')) {
				this.selectedSideMenu = this.portalsSideMenu.DOCUMENTS;
			} else if (appPath.startsWith('tasks')) {
				this.selectedSideMenu = this.portalsSideMenu.TASKS;
			} else if (appPath.startsWith('project-masters')) {
				this.selectedSideMenu = this.portalsSideMenu.PROJECT_MASTERS;
			}
		}
		// ダイレクトアクセスの場合
		else if (directAccessInfo && directAccessInfo.url) {

			this.navigate([directAccessInfo.url]);
		}

		// 前回の状態が保存されていれば復帰
		else if (state) {
			this.childComponentState = state.childComponentState;
			this.selectedSideMenu = state.selectedSideMenu;
			this.navigateChildComponent(this.selectedSideMenu);
		}
		// 初めてログインした場合
		else {
			this.selectedSideMenu = this.portalsSideMenu.WORKSPACES;
			this.navigateChildComponent(this.selectedSideMenu);
		}
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.sessionTimeoutServiceSessionTimeout.closed) { this.sessionTimeoutServiceSessionTimeout.unsubscribe(); }
		if (!this.reloadServiceReload.closed) { this.reloadServiceReload.unsubscribe(); }
	}

	/**
	 * フォントサイズ変更ハンドラ
	 * @param event イベント
	 */
	public onChangeFontSize(event) {
		let fontSize: string = event;
		if (fontSize === 'large') {
				this.fontSizeClass = 'eim-font-size-l';
		}
		if (fontSize === 'middle') {
				this.fontSizeClass = 'eim-font-size-m';
		}
		if (fontSize === 'small') {
				this.fontSizeClass = 'eim-font-size-s';
		}
	}

	/**
	 * ログアウト押下時のイベントハンドラです.
	 * 
	 * @param event イベント
	 */
	public onClickLogout(event) {

		this.saveState();

		this.authenticationService.logout().subscribe( () => {
			this.router.navigate([this.authenticationService.getLoginUrl()]);
		});
	}

	/**
	 * サイドメニュー押下時のハンドラです.
	 * 
	 * @param selectedSideMenu 選択したサイドメニュー
	 * @param enabled 選択したサイドメニューが有効かどうか
	 */
	public onClickSideMenu(selectedSideMenu: EIMPortalsSideMenuEnum, enabled = true) {

		if (!enabled) {
			// 何もしない
			return;
		}

		// 選択前の子コンポーネントの状態を保持
		this.saveChildComponentStatus();

		this.navigateChildComponent(selectedSideMenu);
	}

	/**
	 * 処理待ち一覧のタスク更新イベントハンドラ
	 * @param event イベント
	 */
	public onUpdatedTask(event: EIMUpdatedTaskDTO): void {

		if (this.childComponentRef.updateTask) {

			this.childComponentRef.updateTask(event.parentDTO, event.updatedDTO);
		}
	}
	
	
	/**
	 * アクティブハンドラ
	 * @param componentRef 遷移先の画面構成情報
	 */
	public onActivateChildComponent(childComponentRef: any): void {
		window.setTimeout(() => {
			// 子コンポーネントの状態を復元
			if (childComponentRef.setState) {
				const childComponentState = this.childComponentState[this.selectedSideMenu];
				childComponentRef.setState(childComponentState);
			}

			this.childComponentRef = childComponentRef;
		});
	}

	/**
	 * アンロードイベントハンドラ.
	 * @param _event イベント
	 */
	@HostListener('window:unload', ['$event'])
	public onUnload(_event: any): void {

		this.saveState();
	}
	
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 子コンポーネントを切り替えます.
	 * 
	 * @param url URL
	 */
	protected navigate(url: string[]): void {

		// if (this.httpForRestAPIService.isInRequest()) {
		// 	return;
		// }
		// if (this.httpForRestAPIService.isInRequest()) {
		// 	return;
		// }
		this.router.navigate(url);

	}

	/**
	 * 子コンポーネントの状態をキャッシュに保存します.
	 */
	protected saveChildComponentStatus(): void {
		// 画面の状態を復元
		if (this.childComponentRef && this.childComponentRef.getState) {
			const childComponentState = this.childComponentRef.getState();
			if (childComponentState) {
				this.childComponentState[this.selectedSideMenu] = childComponentState;
			}
		}
	}

	/**
	 * 子コンポーネントへナビゲートします.
	 * 
	 * @param selectedSideMenu 選択中のサイドメニュー
	 */
	protected navigateChildComponent(selectedSideMenu: EIMPortalsSideMenuEnum): void {

		switch(selectedSideMenu) {
			case this.portalsSideMenu.WORKSPACES:
				this.selectedSideMenu = this.portalsSideMenu.WORKSPACES;
				this.navigate(['portals', 'main', 'workspaces', '-1']);
				break;
			// case this.portalsSideMenu.SEARCH:
			// 	this.selectedSideMenu = this.portalsSideMenu.SEARCH;
			// 	break;
			case this.portalsSideMenu.DOCUMENTS:
				this.selectedSideMenu = this.portalsSideMenu.DOCUMENTS;
				this.navigate(['portals', 'main', 'documents']);
				break;
			case this.portalsSideMenu.TASKS:
				this.selectedSideMenu = this.portalsSideMenu.TASKS;
				this.navigate(['portals', 'main', 'tasks']);
				break;
			case this.portalsSideMenu.PROJECT_MASTERS:
				this.selectedSideMenu = this.portalsSideMenu.PROJECT_MASTERS;
				this.navigate(['portals', 'main', 'project-masters']);
				break;
		}
	}

	/**
	 * 状態をローカルストレージに保存します.
	 */
	protected saveState(): void {

		// 子コンポーネントの状態をキャッシュに保存
		this.saveChildComponentStatus();

		// ローカルストレージに保存
		const childComponentState = {};
		childComponentState[this.selectedSideMenu] = this.childComponentState[this.selectedSideMenu];
		this.localStorageService.setUserItemByKeys(
			EIMPortalsConstantService.LOCAL_STORAGE_KEYS_STATE,
			{
				selectedSideMenu: this.selectedSideMenu,
				childComponentState: childComponentState
			}
		);
		
	}
	
}
