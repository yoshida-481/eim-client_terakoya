import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnDestroy } from '@angular/core';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';
import { EIMHttpService } from 'app/shared/services/http.service';
import { MenubarModule } from 'primeng/menubar';
import { EIMProjectManagerComponent } from './components/project-manager/project-manager.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { EIMTaskAuthenticationService } from './services/apis/task-authentication.service';
import { EIMDocumentsHttpService } from 'app/documents/shared/services/documents-http.service';
import { EIMConfigService } from 'app/shared/services/config.service';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMDocumentAuthenticationService } from 'app/documents/shared/services/apis/authentication.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { Subscription } from 'rxjs';
import { EIMTasksModule } from './tasks.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMDialogSharedManagerComponent } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component';
import { EIMMessageComponent } from 'app/shared/components/message/message.component';

/**
 * タスク管理画面コンポーネントインタフェース
 */
export interface EIMTaskMainComponent {
	viewId: string;
	setState: (state: any) => void;
	getState: () => any;
	checkAuth?: () => void;
}

/**
 * タスク管理コンポーネント
 * @example
 *
 *      <eim-tasks
 *
 *      >
 *      </eim-tasks>
 */
@Component({
	selector: 'eim-tasks',
	templateUrl: './tasks.component.html',
	styleUrls: ['./tasks.component.scss'],
	imports:[
			CommonModule,
			RouterModule,
			EIMTasksModule, 
			EIMSharedModule, 
			EIMDialogSharedManagerComponent,
			EIMMessageComponent
		],
	providers: [
		ToastModule,
		MenubarModule,
		ConfirmationService ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone:true
})
export class EIMTasksComponent implements OnDestroy {

		/** ログインユーザ */
		public user: any = {};

		/** バージョン */
		public version: string;

		/** フォントサイズ */
		public fontSize: string = 'middle';

		/** フォントサイズクラス */
		public fontSizeClass: string = 'eim-font-size-m';

	// ==========================================================================
  //  メニューの定義
  // ==========================================================================
	// /** メインメニューリスト */
	// public mainMenuItems: EIMMenuItem[] = [
	// 	// プロジェクト管理
	// 	{
	// 		label: '', rKey: 'EIM_TASKS.LABEL_03005', name: 'projectManager', icon: 'fa eim-icon-project',
	// 		command: (event) => {
	// 			this.navigate(['/tasks/main/project-manager']);
	// 		}
	// 	},
	// 	// タスク管理
	// 	{
	// 		label: '', rKey: 'EIM_TASKS.LABEL_03006', name: 'taskManager', icon: 'fa eim-icon-task',
	// 		command: (event) => {
	// 			this.navigate(['/tasks/main/task-manager']);
	// 		}
	// 	},
	// 	// ファイル管理
	// 	{
	// 		label: '', rKey: 'EIM_TASKS.LABEL_03013', name: 'fileManager', icon: 'fa eim-icon-file',
	// 		command: (event) => {
	// 			this.navigate(['/tasks/main/file-manager']);
	// 		}
	// 	},
	// ];

	/** セッションタイムアウトサブスクリプション */
	private sessionTimeoutServiceSessionTimeout: Subscription;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public authenticationService: EIMTaskAuthenticationService,
		@Inject(DOCUMENT) protected document: Document,
		protected translateService: TranslateService,
		protected router: Router,
		protected messageService: EIMMessageService,
		protected httpService: EIMHttpService,
		protected httpForRestAPIService: EIMHttpForRestAPIService,
		protected sessionTimeoutService: EIMSessionTimeoutService,
		protected documentsHttpService: EIMDocumentsHttpService,
		protected documentAuthenticationService: EIMDocumentAuthenticationService,
		protected configService: EIMConfigService,
		public cacheService: EIMCacheService	// TODO 仮実装

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
		this.version = this.configService.get('tasks.version');

		// ドキュメント管理画面表示時にタイムアウトした場合、タスク管理のログイン画面に戻るよう設定。
		this.documentAuthenticationService.loginUrl = '/portals/login';

		// セッションタイムアウトイベントハンドラ.
		this.sessionTimeoutServiceSessionTimeout =
			this.sessionTimeoutService.sessionTimeout.subscribe( (message: string) => {
				this.messageService.show(EIMMessageType.error, message,
					() => {
					// ログイン画面に遷移する
					this.authenticationService.goToLogin();
				});
			});
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {

		// TODO 仮でユーザ取得せずキャッシュ情報表示
		// let userDomain: EIMUserDomain = this.cacheService.getLoginUser();
		// this.user = {};
		// this.user.userName = userDomain.name;
		// this.user.groupPath = "グループ表示未実装";


		this.authenticationService.getSessionUser().subscribe(user => {
			this.user = {};
			this.user.userName = user.name;
			this.user.groupPath = user.groupNames;
			this.user.userAdmin = user.admin;

			this.cacheService.setJSessionId(user.config.jSessionId);
	});



		// this.user.userAdmin = userDomain.admin;
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

	/**
	 * 画面遷移用メソッド
	 * @param url URL
	 */
	public navigate(url: string[]): void {
		// if (this.httpService.isInRequest()) {
		// 	return;
		// }
		// if (this.httpForRestAPIService.isInRequest()) {
		// 	return;
		// }
		this.router.navigate(url);
		// 画面の状態を保持
		// this.states[this.mainComponentRef.viewId] = this.mainComponentRef.getState();
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.sessionTimeoutServiceSessionTimeout.closed) { this.sessionTimeoutServiceSessionTimeout.unsubscribe(); }
	}

	/**
	 * アクティブハンドラ
	 * @param componentRef 遷移先の画面構成情報
	 */
	public onActivateMain(componentRef: any): void {
		// this.mainComponentRef = componentRef;
		// window.setTimeout(() => {
		// 	componentRef.setState(this.states[this.mainComponentRef.viewId]);
		// });
		if (componentRef instanceof EIMProjectManagerComponent) {

		}
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
}
