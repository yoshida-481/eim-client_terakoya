import { Component, EventEmitter, Input, Output, SimpleChanges, Inject, OnDestroy, OnChanges, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DOCUMENT } from "@angular/common";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMAuthenticationService } from 'app/shared/services/apis/authentication.service';

import { EIMDialogSharedManagerComponentService} from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';

import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMReloadService } from 'app/shared/services/reload.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { EIMTaskMainComponent } from 'app/tasks/tasks.component';
import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMConfigService } from 'app/shared/services/config.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';

@Component({
	selector: 'eim-portal-header',
	templateUrl: './portal-header.component.html',
	styleUrls: ['./portal-header.component.scss'],
	standalone: false,
})
/**
 * ヘッダーコンポーネント
 * @example
 *
 *		<eim-portal-header
 *			[user]="user"
 *			[version]="version"
 *			[authenticationService]="authenticationService"
 *			[headerLabel]="headerLabel"
 *			[versionDisableFlag]="flase">
 *		</eim-portal-header>
 */
export class EIMPortalHeaderComponent implements OnInit, OnChanges, OnDestroy {

	/** ユーザ情報 */
	@Input()
	user = {
		groupPath: '',
		userName: ''
	};

	/** バージョン */
	@Input()
	public version: string;

	/** 認証サービス */
	@Input()
	public authenticationService: EIMAuthenticationService;

	/** バージョン情報非表示フラグ */
	@Input()
	public versionDisableFlag = false;

	/** ヘッダラベル */
	@Input()
	public headerLabel: string;

	/** 文字サイズ変更イベントエミッタ */
	@Output()
	public changeFontSize: EventEmitter<string> = new EventEmitter<string>();

	/** ログアウト押下イベントエミッタ */
	@Output()
	public clickLogout: EventEmitter<null> = new EventEmitter<null>();

	/** タスク更新時のイベントエミッタ */
	@Output() updatedTask: EventEmitter<
			{parentDTO: EIMSimpleObjectDTO, updatedDTO: EIMSimpleObjectDTO}> = new EventEmitter();
	
	/** ステート保持オブジェクト */
	public states: any = {};

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

	/** 表示中のダイアログ名 */
	public viewDialogName = null;
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		@Inject(DOCUMENT) protected document: Document,
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
	}

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
		// let state = this.mainComponentRef.getState();
		// this.states[this.mainComponentRef.viewId] = state;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 初期化時のイベントハンドラです.
	 */
	ngOnInit(): void {

		// ユーザIDが取得できなければタイムアウト扱い
		if (!this.localStorageService.getUserId()) {
			this.sessionTimeoutService.doSessionTimeout();
			return;
		}

		// 言語リスト読み込み
		this.authenticationService.getLanguageList()
			.subscribe((languages: any[]) => {
				this.languages = languages;
				this.refreshLanguageMenuItem();
			});

		// 処理待ち一覧表示
		this.taskService.getProcessingWaitingCount(this.localStorageService.getUserId()).subscribe((res: any) => {
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
	onUpdatedTask(event: {parentDTO: EIMSimpleObjectDTO, updatedDTO: EIMSimpleObjectDTO}): void {

		this.updatedTask.emit(event);
	}

	/**
	 * ログアウトメニュークリックイベントハンドラ
	 * @param event イベント
	 */
	onClickLogout(event: any): void {

		this.clickLogout.emit();
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

}
