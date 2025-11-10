import { EIMHttpService } from 'app/shared/services/http.service';
import { Component, OnInit, ViewChild, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, Params, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { of, Observable } from 'rxjs';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

import { EIMComponent, EIMExecutable, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMUserService, EIMSessionInformation, EIMUser } from 'app/admins/shared/services/apis/user.service';
import { EIMMessageService, EIMMessage, EIMMessageType } from 'app/shared/services/message.service';

import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMAdminsAuthenticationService } from 'app/admins/shared/services/apis/authentication.service';

import { EIMAdminsComponent } from 'app/admins/admins.component';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from './admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMMessageComponent } from 'app/shared/components/message/message.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { EIMDialogSharedManagerComponent } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component';

/**
 * 帳票モード　メインメニューコンポーネント
 * @example
 *
 *      <eim-admins>
 *      </eim-admins>
 */
@Component({
	selector: 'eim-admins',
	templateUrl: './admins.component.html',
	styleUrls: ['./admins.component.scss'],
	imports: [
		CommonModule,
		RouterModule,
		EIMAdminsModule,
		EIMSharedModule,
		EIMMessageComponent,
		EIMDialogSharedManagerComponent
	],
	providers: [ToastModule,
		ConfirmationService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMFormAdminsComponent extends EIMAdminsComponent implements OnInit {

	/** ヘッダラベル */
	public headerLabel = '(' + this.translateService.instant('EIM_ADMINS.LABEL_02248') + ')';

	/** ログインユーザ */
	public user: EIMUser = {};

	/** 各メニューの詳細情報を取得 */
	public menuDetail = new Map();

	/** フラグ用数値：1 */
	private readonly FLAG_ON = 1;

	/** フラグ用数値：0 */
	private readonly FLAG_OFF = 0;

	/**　画面遷移モード　0：初期処理済み　1：ログイン　2：URL直打ち */
	private navigateMode = -1;

	/**　遷移対象画面ID */
	private navigateViewId = '';
	// ユーザ
	protected menuUser: EIMMenuItem =
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03010'), rKey: 'EIM_ADMINS.LABEL_03010', name: 'User', icon: 'eim-icon-user', command: (event) => {this.navigate([this.getNavigatePath('User')])} };
	// グループ
	protected menuUserGroup: EIMMenuItem =
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03011'), rKey: 'EIM_ADMINS.LABEL_03011', name: 'UserGroupRole', icon: 'eim-icon-group',  command: (event) => {this.navigate([this.getNavigatePath('UserGroupRole')])} };

	/** コンテンツリストメニュー */
	public generalMenuItems: EIMMenuItem[] = [
		// タイプ(1)
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03002'), rKey: 'EIM_ADMINS.LABEL_03002', disabled: true, name: 'Class', icon: 'eim-icon-type', command: (event) => {this.navigate([this.getNavigatePath('Class')])} },
		// 属性(2)
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03023'), rKey: 'EIM_ADMINS.LABEL_03023', disabled: true, name: 'Attribute', icon: 'eim-icon-attribute', command: (event) => {this.navigate([this.getNavigatePath('Attribute')])} },
		// ワークフロー(3)'
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03012'), rKey: 'EIM_ADMINS.LABEL_03012', disabled: true, name: 'Workflow', icon: 'eim-icon-thumb-up', command: (event) => {this.navigate([this.getNavigatePath('Workflow')])} },
		// フォーマット(4)'
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03013'), rKey: 'EIM_ADMINS.LABEL_03013', disabled: true, name: 'Format', icon: 'eim-icon-format', command: (event) => {this.navigate([this.getNavigatePath('Format')])} },
		// ユーザ(5)
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03010'), rKey: 'EIM_ADMINS.LABEL_03010', disabled: true, name: 'User', icon: 'eim-icon-user', items: [
		     Object.assign({}, this.menuUser),
		     Object.assign({}, this.menuUserGroup), ]
		},
		// セキュリティ(6)
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03005'), rKey: 'EIM_ADMINS.LABEL_03005', disabled: true, name: 'Security', icon: 'eim-icon-security', command: (event) => {this.navigate([this.getNavigatePath('Security')])} },
		// 操作履歴(7)
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03006'), rKey: 'EIM_ADMINS.LABEL_03006', disabled: true, name: 'OperationHistory', icon: 'fa fa-history', command: (event) => {this.navigate([this.getNavigatePath('OperationHistory')])} },
		// 帳票ワークスペース(8)
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03009'), rKey: 'EIM_ADMINS.LABEL_03009', disabled: true, name: 'FormWorkspace', icon: 'eim-icon-form-workspace', command: (event) => {this.navigate([this.getNavigatePath('FormWorkspace')])} },
];

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
		public adminsAuthenticationService: EIMAdminsAuthenticationService,
		protected httpService: EIMHttpService,
		protected title: Title,
	) {
			super(translateService, router, userService, serverConfigService, documentsCacheService, messageService, sessionTimeoutService, authenticationService, httpService, title);
			// アプリケーション区分の保持
			this.documentsCacheService.setAppId(EIMAdminsConstantService.APP_ID_FORM);
			// メニューの情報をMAPに格納
			this.menuDetail.set('Class', {path: '/admins/form/class', digit: 2, menuIndex: 0});
			this.menuDetail.set('Attribute', {path: '/admins/form/attribute', digit: 3, menuIndex: 1});
			this.menuDetail.set('Workflow', {path: '/admins/form/workflow', digit: 4, menuIndex: 2});
			this.menuDetail.set('Format', {path: '/admins/form/format', digit: 5, menuIndex: 3});
			this.menuDetail.set('User', {path: '/admins/form/user', digit: 6, menuIndex: 4});
			this.menuDetail.set('UserGroupRole', {path: '/admins/form/user-group', digit: 6, menuIndex: 4});
			this.menuDetail.set('Security', {path: '/admins/form/security', digit: 7, menuIndex: 5});
			this.menuDetail.set('OperationHistory', {path: '/admins/form/history', digit: 8, menuIndex: 6});
			this.menuDetail.set('FormWorkspace', {path: '/admins/form/workspace', digit: 14, menuIndex: 7});
}
	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit(): void {
		super.ngOnInit();
		// メインメニューの権限を判定
		this.getSessionCallback = this.initMainMenu;
	}

	/**
	 * アクティブハンドラ
	 * @param componentRef 遷移先の画面構成情報
	 */
	public onActivateMain(componentRef: any): void {

		super.onActivateMain(componentRef);
		// 初期処理済みの場合は処理を抜ける
		if (this.navigateMode === 0) {
			// ログイン後の呼出時のみ2回目の処理をしないため、以降はURL直打ちのみ許容するようにする
			this.navigateMode = 2;
			return;
		}
		// viewIdがある場合（ログイン画面から遷移した場合は空となる）
		if (componentRef.viewId) {
			this.navigateMode = 2;
			this.navigateViewId = componentRef.viewId;
			// セッション未読み込みの場合は処理を抜ける
			if (!this.completeReadSession) {
				return;
			}
		} else {
			this.navigateMode = 1;
			// セッション未読み込みの場合は処理を抜ける
			if (!this.completeReadSession) {
				return;
			}
		}
		this.initMainMenu();
	}

	/**
	 * ヘッダラベルを初期化します.
	 */
	protected initialHeaderLabel(): void {
		this.headerLabel = '(' + this.translateService.instant('EIM_ADMINS.LABEL_02248') + ')';
	}

	/**
	 * メインメニューの権限から、参照先を指定する.
	 */
	private initMainMenu(): void {
		// 初期処理済みの場合は処理を抜ける
		if (this.navigateMode === 0) {
			return;
		}
		
		let menu: EIMMenuItem;
		for (let i = 0;  i < this.generalMenuItems.length ; i++ ) {
			if (this.hasAuth(this.generalMenuItems[i].name)) {

				this.generalMenuItems[i].disabled = false;

				// 最初に権限を持っている画面の番号取得
				if (!menu) {
					// ユーザ管理まで権限がなかった場合、ユーザ管理画面を初期表示する
					if (this.generalMenuItems[i].name === 'User') {
						menu = this.menuUser;
					} else {
						menu = this.generalMenuItems[i];
					}
				}
			}
		}
		// 初期表示画面
		if (this.navigateViewId) {
			// 直接URL指定した場合
			let menuIndex = this.menuDetail.get(this.navigateViewId).menuIndex;
			menu = this.generalMenuItems[menuIndex];
			// 対象メニューが非活性の場合、ログイン画面に遷移
			if (menu.disabled) {
				let accept = () => {
					this.router.navigate(['/admins/login']);
				};
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00006'), accept);
			}
		} else {

			// ログイン画面から遷移する場合
			if(!menu) {
				// 権限のあるメニューがない場合
				let accept = () => {
					this.router.navigate(['/admins/login']);
				};
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00006'), accept);
			} else {
				// 権限のあるメニューがある場合（権限のある一番左のメニュー）
				window.setTimeout(() => {menu.command({})});
			}
			// ログイン時はinit時のみ実施とするため、処理なしモードを設定
			this.navigateMode = 0;
		}
	}

	/**
	 * メインメニューの権限を判定する.
	 * @param name メニュー名
	 * @return 権限有無
	 */
	private hasAuth(name: string): boolean {
		let binaryAdmin = this.user.userAdmin.toString(2);
		let checkDigit = this.menuDetail.get(name).digit;
		// 権限チェック
		return this.checkAuth(binaryAdmin, checkDigit);
	}

	/**
	 * 権限の存在を確認します.
	 * @param binaryAdmin 権限一覧
	 * @param checkDigit 判定対象桁数
	 * @return checkAuth 権限判定結果（true:あり、false:なし)
	 */
	private checkAuth(binaryAdmin: string, checkDigit: number): boolean {
		if (checkDigit <= binaryAdmin.length ) {
			let systemAuth = binaryAdmin.substr(-checkDigit, 1);
			if (Number(systemAuth) === this.FLAG_ON) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**
	 * メニュー名を基にマップからURLを取得する.
	 * @param name メニュー名
	 * @return 遷移先URL
	 */
	private getNavigatePath(name: string): string {
		return this.menuDetail.get(name).path;
	}
}
