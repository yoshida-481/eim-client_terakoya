import { EIMHttpService } from 'app/shared/services/http.service';
import { OnInit, OnDestroy, Directive } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { EIMUserService, EIMUser } from 'app/admins/shared/services/apis/user.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { Subscription } from 'rxjs';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMAdminsAuthenticationService } from 'app/admins/shared/services/apis/authentication.service';
import { EIMMenuItem } from 'app/shared/shared.interface';

/**
 * システム管理画面コンポーネントインタフェース
 */
export interface EIMAdminMainComponent {
	viewId: string;
	setState: (state: any) => void;
	getState: () => any;
	checkAuth?: () => void;
}

/**
 * システム管理ベースコンポーネント
 */
@Directive()
export class EIMAdminsComponent implements OnInit, OnDestroy {

	/** メインコンポーネント */
	public mainComponentRef: EIMAdminMainComponent;

	/** ステート保持オブジェクト */
	public states: any = {};

	/** ログインユーザ */
	public user: EIMUser = {};

	/** フォントサイズ */
	public fontSize = 'middle';

	/** フォントサイズクラス */
	public fontSizeClass = 'eim-font-size-m';

	/** バージョン */
	public version: string;

	/** 権限判定用コールバックメソッド */
	public getSessionCallback: () => void;

	/** リソースファイル読み込み完了フラグ */
	public completeReadResource = false;

	/** メニュー */
	public generalMenuItems: EIMMenuItem[];

	/** セッション読み込み完了フラグ */
	protected completeReadSession = false;

	/** セッションタイムアウトサブスクリプション */
	private sessionTimeoutServiceSessionTimeout: Subscription;

	/** 言語変更サブスクリプション */
	private translateServiceOnLangChange: Subscription;

	/**
	 * コンストラクタ
	 */
	constructor(
		protected translateService: TranslateService,
		protected router: Router,
		protected userService: EIMUserService,
		protected serverConfigService: EIMServerConfigService,
		protected documentsCacheService: EIMAdminsCacheService,
		protected messageService: EIMMessageService,
		protected sessionTimeoutService: EIMSessionTimeoutService,
		protected authenticationService: EIMAdminsAuthenticationService,
		protected httpService: EIMHttpService,
		protected title: Title,
	) {
		/**
		 * セッションタイムアウトイベントハンドラ.
		 * @param message メッセージ
		 */
		this.sessionTimeoutServiceSessionTimeout = this.sessionTimeoutService.sessionTimeout
			.subscribe( (message: string) => {
				this.messageService.show(EIMMessageType.error, message,
					() => {
					// ログイン画面に遷移する
					this.authenticationService.goToLogin();
			});
		});

		/**
		 * 言語変更イベントハンドラ.
		 * @param event イベント
		 */
		this.translateServiceOnLangChange = this.translateService.onLangChange
			.subscribe( (event: any) => {
				this.initialHeaderLabel();
				this.initialMenuItemLabel(this.generalMenuItems);
				this.completeReadResource = true;
			});

		// TranslateServiceでリソースが利用可能かどうかを判定する
		let checkKey = 'EIM_ADMINS.LABEL_01200';
		let checkValue: string = this.translateService.instant(checkKey);
		if (checkKey !== checkValue) {
			// キーと値が一致していない場合はキーから値を取得できているので利用可能とみなす
			this.initialHeaderLabel();
			this.initialMenuItemLabel(this.generalMenuItems);
			this.completeReadResource = true;
		}

	}
	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit(): void {

		this.userService.getSessionUser().subscribe(data => {
			this.user = data.loginUser;

			// サーバの設定ファイルの値を格納
			this.serverConfigService.setConfigValue(data.configKeyValue);
			// キャッシュに保存
			let loginUser: EIMUserDomain = new EIMUserDomain();
			loginUser.id = this.user.userId;
			loginUser.name = this.user.userName;
			loginUser.code = this.user.userCode;
			loginUser.kana = this.user.userKana;
			loginUser.mail = this.user.userMail;
			loginUser.admin = this.user.userAdmin;
			this.documentsCacheService.setLoginUser(loginUser);
			this.documentsCacheService.setJSessionId(data.configKeyValue['jSessionId']);
			// バージョン
			this.version = this.serverConfigService.eimanagerDocumentVersion;
			this.completeReadSession = true;
			// コンポーネント内で権限判定処理が必要な場合、処理実行
			if (this.mainComponentRef.checkAuth) {
				this.mainComponentRef.checkAuth();
			}
			// コールバック処理が設定されている場合、処理実行
			if (this.getSessionCallback) {
				this.getSessionCallback();
			}
		},
		err => {
			let accept = () => {
				this.router.navigate(['/admins/login']);
			};
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00006'), accept);
		});

		this.title.setTitle(EIMAdminsConstantService.WINDOW_TITLE);
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.sessionTimeoutServiceSessionTimeout.closed) { this.sessionTimeoutServiceSessionTimeout.unsubscribe(); }
		if (!this.translateServiceOnLangChange.closed) { this.translateServiceOnLangChange.unsubscribe(); }
	}

	/**
	 * 画面遷移用メソッド
	 * @param url URL
	 */
	public navigate(url: string[]): void {
		if (this.httpService.isInRequest()) {
			return;
		}
		this.router.navigate(url);
		// 画面の状態を保持
		this.states[this.mainComponentRef.viewId] = this.mainComponentRef.getState();
	}

	/**
	 * アクティブハンドラ
	 * @param componentRef 遷移先の画面構成情報
	 */
	public onActivateMain(componentRef: any): void {
		this.mainComponentRef = componentRef;
		window.setTimeout(() => {
			componentRef.setState(this.states[this.mainComponentRef.viewId]);
		});
	}

	/**
	 * フォントサイズ変更ハンドラ
	 * @param event イベント
	 */
	public onChangeFontSize(event: any): void {
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
	 * ヘッダラベルを初期化します.
	 * 継承クラスで初期化処理を記載してください.
	 */
	protected initialHeaderLabel(): void {
	}

	/**
	 * メニューのラベルを初期化します.
	 * リソースの読み込みがメニュー設定に間に合わなかった場合の対応です.
	 */
	protected initialMenuItemLabel(menuItems: EIMMenuItem[]): void {
		if (!menuItems) {
			return;
		}
		for (let i = 0; i < menuItems.length; i++) {
			let menuItem: EIMMenuItem = menuItems[i];
			if (menuItem.items) {
				this.initialMenuItemLabel(menuItem.items);
			}
			if (!menuItem.rKey) {
				continue;
			}
			let newLabel: string = this.translateService.instant(menuItem.rKey);
			if (menuItem.label === newLabel) {
				continue;
			}
			menuItem.label = newLabel;
		}
	}
}
