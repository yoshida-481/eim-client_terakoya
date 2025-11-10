import { DOCUMENT } from "@angular/common";
import { Component, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { EIMMenuItem } from 'app/shared/shared.interface';

import { EIMDialogSharedManagerComponentService} from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';

import { EIMAdminsConstantService } from "app/admins/shared/services/admins-constant.service";
import { EIMAdminAuthTypeDomain } from "app/shared/domains/entity/admin-auth-type.domain";
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMReloadService } from 'app/shared/services/reload.service';
import { EIMTaskAuthenticationService } from "app/tasks/services/apis/task-authentication.service";
import { EIMTaskMainComponent } from 'app/tasks/tasks.component';
import { EIMCacheService } from "app/shared/services/cache.service";
import { EIMTaskService } from "app/tasks/services/apis/task.service";
import { EIMProcessingWaitingListDTO } from "app/tasks/shared/dtos/processing-waiting-list.dto";
import { EIMUserDomain } from "app/shared/domains/entity/user.domain";
import { EIMTaskConstantService } from "app/tasks/services/task-constant.service";
import { EIMSessionTimeoutService } from "app/shared/services/session-timeout.service";
import { EIMSimpleObjectDTO } from "app/shared/dtos/simple-object.dto";
import { EIMUpdatedTaskDTO } from "app/tasks/tasks.interface";

@Component({
	selector: 'eim-task-header',
	templateUrl: './task-header.component.html',
	styleUrls: ['./task-header.component.scss'],
	standalone: false
})
/**
 * ヘッダーコンポーネント
 * @example
 *
 *		<eim-task-header
 *			[user]="user"
 *			[version]="version"
 *			[authenticationService]="authenticationService"
 *			[headerLabel]="headerLabel"
 *			[versionDisableFlag]="flase">
 *		</eim-task-header>
 */
export class EIMTaskHeaderComponent implements OnInit, OnChanges, OnDestroy {

	/** ユーザ情報 */
	@Input()
	user = {
		groupPath: '',
		userName: '',
		userAdmin: 0
	};

	/** バージョン */
	@Input()
	public version: string;

	/** 認証サービス */
	@Input()
	public authenticationService: EIMTaskAuthenticationService;

	/** バージョン情報非表示フラグ */
	@Input()
	public versionDisableFlag = false;

	/** ヘッダラベル */
	@Input()
	public headerLabel: string;

	/** 文字サイズ変更イベントエミッタ */
	@Output()
	public changeFontSize: EventEmitter<string> = new EventEmitter<string>();

	/** メインコンポーネント */
	public childComponentRef: EIMTaskMainComponent;

	/** 子コンポーネントの状態 */
	public childComponentState: {
		projectManager?: any,
		taskManager?: any,
		fileManager?: any,
		projectMasterManager?: any
	} = {};

	/** ロゴ画像のパス */
	public logoSrc: string = environment.baseURL + 'src/assets/EIM_logo.svg';

	/** 個人メニュー */
	public personalMenuItems: EIMMenuItem[];

	/** ヘッダーツールチップクラス */
	public headerTooltipClass: string;

	/** 選択文字サイズ */
	public selectedFontSize: string;

	/** 更新ツールチップメッセージ */
	public updateLatestTooltip: string;

	/** 設定メニュー */
	public configurationMenuItems: EIMMenuItem[] = [];

	/** リロードサブスクリプション */
	private reloadServiceReload: Subscription;

	/** 言語変更サブスクリプション */
	private translateServiceOnLangChange: Subscription;

	/** リロードサブスクリプション */
	private reloadServiceDisabled: Subscription;

	/** リロード無効化 */
	public reloadDisabled = false;

	/** 表示中のダイアログID */
	public showingDialogId = 0;

	/** 言語リスト */
	private languages: any[];

	/** サイドバーを表示するかどうか */
	public displaySidebar = false;

	/** 表示するダイアログ名 */
	public viewDialogName = null;
	// ==========================================================================
	//  メニューの定義
	// ==========================================================================
	/** メインメニューリスト */
	public mainMenuItems: EIMMenuItem[] = [
		// プロジェクト管理
		{
			label: '', rKey: 'EIM_TASKS.LABEL_03005', name: 'projectManager', icon: 'fa eim-icon-project',
			command: (event) => {
				this.navigateChildComponent('projectManager');
				this.displaySidebar = false;
			}
		},
		// タスク管理
		{
			label: '', rKey: 'EIM_TASKS.LABEL_03006', name: 'taskManager', icon: 'fa eim-icon-task',
			command: (event) => {
				this.navigateChildComponent('taskManager');
				this.displaySidebar = false;
			}
		},
		// ファイル管理
		{
			label: '', rKey: 'EIM_TASKS.LABEL_03013', name: 'fileManager', icon: 'fa eim-icon-file',
			command: (event) => {
				this.navigateChildComponent('fileManager');
				this.displaySidebar = false;
			}
		},
		// 業務マスタ管理
		{
			label: '', rKey: 'EIM_TASKS.LABEL_03019', name: 'projectMasterManager', icon: 'fa eim-icon-project',
			command: (event) => {
				this.navigateChildComponent('projectMasterManager');
				this.displaySidebar = false;
			}
		},
	];

	/** 各メニューの詳細情報Map */
	private menuDetails = new Map([
		['projectManager', {}],
		['taskManager', {}],
		['fileManager', {}],
		['projectMasterManager', {authId: 'bizMaster'}],
	]);

	/**
	 * コンストラクタです.
	 */
	constructor(
		@Inject(DOCUMENT) protected document: Document,
		protected route: ActivatedRoute,
		protected router: Router,
		protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected reloadService: EIMReloadService,
		protected messageService: EIMMessageService,
		protected sessionStorageService: EIMSessionStorageService,
		protected httpService: EIMHttpService,
		protected httpForRestAPIService: EIMHttpForRestAPIService,
		protected taskService: EIMTaskService,
		protected cacheService: EIMCacheService,
		protected sessionTimeoutService: EIMSessionTimeoutService
	) {

		// デフォルト設定
		let fontSize: string = this.localStorageService.getFontSize();
		if (fontSize) {
			this.selectedFontSize = fontSize;
		} else {
			this.selectedFontSize = 'middle';
		}
		this.document.body.classList.add('eim-font-size-m');

		// ツールチップラベルを設定する
		this.setTooltipLabel();

		// TranslateServiceでリソースが利用可能かどうかを判定する
		let checkKey = 'EIM.LABEL_01003';
		let checkValue: string = this.translateService.instant(checkKey);
		if (checkKey !== checkValue) {
			// キーと値が一致していない場合はキーから値を取得できているので利用可能とみなす
			// メニューアイテムラベルを更新する
			this.refreshMenuItemLabel();
		}

		/**
		 * 言語変更イベントハンドラ.
		 * @param event イベント
		 */
		this.translateServiceOnLangChange = this.translateService.onLangChange.subscribe( (event: LangChangeEvent) => {
			this.refreshMenuItemLabel();
		});

		/**
		 * 更新ボタン活性非活性イベントハンドラ.
		 * @param event イベント
		 */
		this.reloadServiceDisabled = this.reloadService.disabled.subscribe( (disabled: boolean) => {
			this.reloadDisabled = disabled;
		});

		// 最新の情報に更新イベントハンドラ.
		this.reloadServiceReload = this.reloadService.reload.subscribe( (event: any) => {

			this.saveChildComponentState();
			
			// 子コンポーネントの状態を復元
			if (this.childComponentRef && this.childComponentRef.setState) {
				const childComponentState = this.childComponentState[this.childComponentRef.viewId];
				this.childComponentRef.setState(childComponentState);
			}

		});

		// URLのパスから選択するワークスペースを決定
		const taskId: number = Number(this.route.snapshot.queryParamMap.get('taskId'));

		if (!isNaN(taskId) && taskId !== 0) { // クエリパラメータ未指定の場合はtaskIdが0となる
			this.localStorageService.setUserItemByKeys(
				EIMConstantService.LOCAL_STORAGE_KEYS_DIRECT_ACCESS_INFO,
				{
					url: this.router.url.split('?')[0],
					taskManagerComponent: {
						taskId: taskId
					}
				}
			);
		}

		// project-manager
		// 前回の状態を取得
		const state = this.localStorageService.getUserItemByKeys(EIMTaskConstantService.LOCAL_STORAGE_KEYS_STATE);
		if (state) {
			this.childComponentState = state.childComponentState ?? {};
			const selectedViewId = state.selectedViewId;
			this.navigateChildComponent(selectedViewId);
		}
		else {
			this.navigateChildComponent('projectManager');
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * アクティブハンドラ
	 * @param componentRef 遷移先の画面構成情報
	 */
	public onActivateMain(componentRef: any): void {
		this.childComponentRef = componentRef;
		window.setTimeout(() => {
			// 画面の状態を復元
			let state = this.childComponentState[this.childComponentRef.viewId];
			componentRef.setState(state);
		});
	}

	/**
	 * 初期化時のイベントハンドラです.
	 */
	ngOnInit(): void {

		// ユーザが取得できなければタイムアウト扱い
		if (!this.cacheService.getLoginUser()) {
			this.sessionTimeoutService.doSessionTimeout();
			return;
		}

		// 言語リスト読み込み
		this.authenticationService.getLanguageList()
			.subscribe((languages: any[]) => {
				this.languages = languages;
				this.refreshLanguageMenuItem();
			});

		// 管理者権限リスト読み込み
		this.authenticationService.getAdminAuth(EIMAdminsConstantService.APP_ID_TASK).subscribe(
			(authList: EIMAdminAuthTypeDomain[]) => {

				const hasTaskMasterAuthId = {};
				authList.forEach((auth: EIMAdminAuthTypeDomain) => {
					const user: EIMUserDomain = this.cacheService.getLoginUser();
					const hasAuth = (user.admin & parseInt(auth.value)) === parseInt(auth.value);
					hasTaskMasterAuthId[auth.id] = hasAuth;
				});
				this.cacheService.setHasAuthId(hasTaskMasterAuthId);

				// メニュー初期化
				this.initMainMenu();
			}
		);

		// 処理待ち一覧表示
		this.taskService.getProcessingWaitingCount(this.cacheService.getLoginUser().id).subscribe((res: any) => {
			const totalCount = res.totalCount;
			const delayedCount = res.delayedCount;
			
			if (totalCount > 0) {
				let messageKey: string;
				
				if (delayedCount == 0) {
					messageKey = 'EIM_TASKS.CONFIRM_00004';
				} else {
					messageKey = 'EIM_TASKS.CONFIRM_00005';
				}
				
				this.messageService.show(
					EIMMessageType.confirm,
					this.translateService.instant(messageKey, { value: totalCount, value2: delayedCount }),
					() => {
						this.viewDialogName = 'processingWaitingList';
					}
				);
			}
		});

	}

	/**
	 * 値変更後のイベントハンドラです.
	 * @param changes 変更後の値
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (changes['user']) {
			let items = [];
			// パスワード変更
			const isInternalAuth = this.sessionStorageService.get(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME, EIMConstantService.SESSIONSTORAGE_KEY_INTERNAL_AUTH);
			if (!this.headerLabel && isInternalAuth) {
				// 文書管理/帳票管理でEIMANAGER独自認証の場合に表示 (システム管理/オブジェクトエディタはheaderLabelの設定有)
 				items.push({label: this.translateService.instant('EIM.LABEL_03015'), icon: 'eim-icon-key', command: ($event) => {this.onClickShowChangePassowrd($event)}});
 				items.push({separator: true});
			}
	
			// 処理待ち一覧
			items.push({label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03047'), icon: 'fa fa-hourglass-half', command: ($event) => {this.onClickWaitingList($event); }})

			// ログアウト
			const isSso = this.sessionStorageService.get(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME, EIMConstantService.SESSIONSTORAGE_KEY_SSO);
			if (!isSso) {
				// シングルサインオンでない場合に表示
 				items.push({label: this.translateService.instant('EIM.LABEL_03016'), icon: 'eim-icon-logout', command: ($event) => {this.onClickLogout($event); }})
			}
			this.personalMenuItems = [
				{ label: this.user.userName, icon: 'eim-icon-user',
					items: items
				}
			];
		}

		// 設定メニューアイテムを設定する
		this.setConfigurationMenuItems();

		this.onChangeFontSize(this.selectedFontSize);
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.reloadServiceDisabled.closed) {
			this.reloadServiceDisabled.unsubscribe();
		}
		if (!this.translateServiceOnLangChange.closed) {
			this.translateServiceOnLangChange.unsubscribe();
		}
		if (!this.reloadServiceReload.closed) {
			this.reloadServiceReload.unsubscribe();
		}
	}

	/**
	 * 文字サイズ変更イベントハンドラ
	 * @param size 文字サイズ
	 */
	onChangeFontSize(size: string): void {
		// 文字サイズ変更可否チェック
		if (this.checkfontSizeChangeable()) {
			// メニュー選択状態を再設定
			let menuItems: EIMMenuItem[] = [];
			for (const menuItem of this.configurationMenuItems[0].items[0].items) {
				if (menuItem.name && menuItem.name.indexOf('font-size-') > -1) {
					menuItem.icon = 'eim-icon-none';
					if (menuItem.name === ('font-size-' + size)) {
						menuItem.icon = 'eim-icon-check';
					}
				}
				menuItems.push(menuItem);
			}
			this.localStorageService.setFontSize(size);
			this.changeTooltipClass(size);
			this.changeFontSize.emit(size);
		}
	}

	/**
	 * バージョン情報メニュークリックイベントハンドラ
	 */
	onClickVersion(): void {
		this.viewDialogName = 'version';
	}

	/**
	 * パスワード変更メニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickShowChangePassowrd(event: any): void {
		let dialogId: string = this.dialogManagerComponentService.showPasswordChange(this.authenticationService, 
			false, String(EIMConstantService.CHANGE_PASSWORD_DISP_MIN_HEIGHT),
			{
				updated: (data) => {
					this.dialogManagerComponentService.close(dialogId);
				}
			}
		);
	}

	/**
	 * ログアウトメニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickLogout(event: any): void {

		// 画面の状態を保存
		this.saveState();

		this.authenticationService.logout().subscribe( () => {
			this.router.navigate([this.authenticationService.getLoginUrl()]);
		});
	}

	/**
	 * 処理待ち一覧メニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickWaitingList(event: any): void {
		this.viewDialogName = 'processingWaitingList';
	}

	/**
	 * 処理待ち一覧のタスク更新イベントハンドラ
	 * @param event イベント
	 */
	onUpdatedTask(event: EIMUpdatedTaskDTO): void {

	}

	/**
	 * 最新の情報に更新ボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onUpdateLatest(event: any): void {
		this.reloadService.doReload();
	}

	/**
	 * 言語選択イベントハンドラ
	 * @param langId 言語ID
	 */
	onSelectLanguage(langId: string): void {
		const currentLang = this.translateService.currentLang;
		if (langId === currentLang) {
			return;
		}

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM.CONFIRM_00004'),
			() => {
				// 表示言語更新
				this.localStorageService.setLangId(langId);
				this.authenticationService.changeLanguage(langId)
					.subscribe(_ => {
						// 画面再読み込み
						location.reload();
					});
			});
	}

	onClickSidebar(event): void {
		this.displaySidebar = true;

	}

	/**
	 * アンロードイベントハンドラ.
	 * @param event イベント
	 */
	@HostListener('window:unload', ['$event'])
	public onUnload(event: any): void {

		// 画面の状態を保存
		this.saveState();
	}
	
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 文字サイズに対応したクラスを返却します.
	 * @param fontSize 文字サイズ
	 */
	private changeTooltipClass(fontSize: string): void {
		this.document.body.classList.remove('eim-font-size-l');
		this.document.body.classList.remove('eim-font-size-m');
		this.document.body.classList.remove('eim-font-size-s');
		if (fontSize === 'large') {
			this.document.body.classList.add('eim-font-size-l');
			this.headerTooltipClass = 'eim-font-size-l';
		} else if (fontSize === 'middle') {
			this.document.body.classList.add('eim-font-size-m');
			this.headerTooltipClass = 'eim-font-size-m';
		} else if (fontSize === 'small') {
			this.document.body.classList.add('eim-font-size-s');
			this.headerTooltipClass = 'eim-font-size-s';
		}
	}

	/**
	 * ツールチップラベルを設定する
	 */
	private setTooltipLabel(): void {
		// 更新ツールチップメッセージ
		this.updateLatestTooltip = this.translateService.instant('EIM.LABEL_03018');
	}

	/**
	 * メニューアイテムラベルをリフレッシュします.
	 */
	private refreshMenuItemLabel(): void {
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
		changeLabel(this.configurationMenuItems);
		let newMenuItems: EIMMenuItem[] = Object.assign([], this.configurationMenuItems);
		this.configurationMenuItems = newMenuItems;
		// ツールチップラベルを設定する
		this.setTooltipLabel();
		// 表示言語メニューを更新する
		this.refreshLanguageMenuItem();

		changeLabel(this.mainMenuItems);
		newMenuItems = Object.assign([], this.mainMenuItems);
		this.mainMenuItems = newMenuItems;

	}

	/**
	 * 文字サイズ変更可否チェック
	 * @return 文字サイズ変更可否
	 */
	private checkfontSizeChangeable(): boolean {
		if (this.showingDialogId !== 0) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00011'));
			return false;
		}
		return true;
	}

	/**
	 * バージョン情報表示可否チェック
	 * @return バージョン情報表示可否
	 */
	private setConfigurationMenuItems(): void {

		this.configurationMenuItems = [
			{
				label: '', id: 'firstFocusMenu', rKey: 'EIM.LABEL_03021', icon: 'fa fa-gear',
				items: [
					{ label: '', rKey: 'EIM.LABEL_03017', icon: 'fa fa-fw fa-font', items: [
						{ label: '', rKey: 'EIM.LABEL_03022', name: 'font-size-large', icon: null, command: ($event) => { this.onChangeFontSize('large'); } },
						{ label: '', rKey: 'EIM.LABEL_03023', name: 'font-size-middle', icon: null, command: ($event) => { this.onChangeFontSize('middle'); } },
						{ label: '', rKey: 'EIM.LABEL_03024', name: 'font-size-small', icon: null, command: ($event) => { this.onChangeFontSize('small'); } },
					]},
					{ separator: true },
					{ label: '', rKey: 'EIM.LABEL_03053', icon: 'fa fa-fw fa-language', items: [] },
				]
			}
		];

		if (!this.versionDisableFlag) {
			this.configurationMenuItems[0].items.push({separator: true});
			this.configurationMenuItems[0].items.push({label: '', rKey: 'EIM.LABEL_03025', icon: 'fa fa-server', command: ($event) => {this.onClickVersion(); }});
		}
		this.refreshMenuItemLabel();
	}

	/**
	 * 言語メニューアイテムをリフレッシュします.
	 */
	private refreshLanguageMenuItem(): void {
		if (!this.languages) {
			return;
		}

		// 「設定メニュー」項目を取得
		const firstFocusMenu = this.configurationMenuItems.find(item => item.id === 'firstFocusMenu');
		if (!firstFocusMenu) {
			return;
		}

		// 「表示言語」項目を取得
		const menuItem = firstFocusMenu.items.find(item => item.rKey === 'EIM.LABEL_03053');
		if (!menuItem) {
			return;
		}

		// 言語名リストを取得し、サブメニュー作成
		// 選択中言語にチェック
		const currentLang = this.translateService.currentLang;
		if (this.languages.length > 0) {
			const languages = this.languages.map((lang: any) => {
				const label = lang.name;
				const value = lang.langId;
				const icon = value === currentLang ? 'eim-icon-check' : 'eim-icon-none';
				return {
					label,
					icon,
					command: ($event: any) => this.onSelectLanguage(value),
				};
			});
			menuItem.items = [...languages];
		} else {
			menuItem.items = [];
		}
	}

	/**
	 * メインメニューの初期化
	 * 権限のないメニューを無効化する.
	 */
	private initMainMenu(): void {
		for (let i = 0;  i < this.mainMenuItems.length ; i++ ) {
			if (!this.hasAuth(this.mainMenuItems[i].name)) {
				this.mainMenuItems[i].disabled = true;
			}
		}
	}

	/**
	 * メインメニューの権限を判定する.
	 * @param name メニュー名
	 * @return 権限有無
	 */
	private hasAuth(name: string): boolean {

		// 権限ID
		const authId = this.menuDetails.get(name).authId;
		if (!authId) {
			// 権限チェック対象外
			return true;
		}

		// 権限有無
		return this.cacheService.getHasAuthId()[authId];
	}

	/**
	 * 画面遷移用メソッド
	 * @param viewId 画面ID
	 */
	protected navigateChildComponent(viewId: string): void {
		if (this.httpService.isInRequest()) {
			return;
		}
		if (this.httpForRestAPIService.isInRequest()) {
			return;
		}

		// 画面の状態を保持
		let state = this.childComponentRef?.getState() ?? null;
		if (state) {
			this.childComponentState[this.childComponentRef.viewId] = state;
		}

		switch (viewId) {
			case 'projectManager':
				this.router.navigate(['/tasks/main/project-manager']);
				break;
			case 'taskManager':
				this.router.navigate(['/tasks/main/task-manager']);
				break;
			case 'fileManager':
				this.router.navigate(['/tasks/main/file-manager']);
				break;
			case 'projectMasterManager':
				this.router.navigate(['/tasks/main/project-master-manager']);
				break;
												
		}
	}
	
	/**
	 * 子コンポーネントの状態をキャッシュに保存します.
	 */
	protected saveChildComponentState(): void {
		// 画面の状態を復元
		if (this.childComponentRef && this.childComponentRef.getState) {
			const childComponentState = this.childComponentRef.getState();
			if (childComponentState) {
				this.childComponentState[this.childComponentRef.viewId] = childComponentState;
			}
		}
	}

	/**
	 * 状態をローカルストレージに保存します.
	 */
	protected saveState(): void {

		// 画面の状態を保持
		const state = this.childComponentRef.getState();

		// ローカルストレージに保存
		const childComponentState = {};
		childComponentState[this.childComponentRef.viewId] = state;
		this.localStorageService.setUserItemByKeys(
			EIMTaskConstantService.LOCAL_STORAGE_KEYS_STATE,
			{
				selectedViewId: this.childComponentRef.viewId,
				childComponentState: childComponentState
			}
		);
	}
	
}
