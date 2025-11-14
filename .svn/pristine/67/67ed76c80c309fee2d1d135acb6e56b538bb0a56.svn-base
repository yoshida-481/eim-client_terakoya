import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { EIMObjectEditorsAuthenticationService } from 'app/object-editors/shared/services/apis/object-editors-authentication.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMMessageService, EIMMessageType} from 'app/shared/services/message.service';
import { EIMObjectEditorsUserService, EIMUser } from 'app/object-editors/shared/services/apis/object-editors-user.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMObjectEditorsCacheService } from 'app/object-editors/shared/services/object-editors-cache.service';
import { EIMObjectEditorsModule } from './object-editors.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMDialogSharedManagerComponent } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component';
import { EIMMessageComponent } from 'app/shared/components/message/message.component';
import { CommonModule } from '@angular/common';
import { EIMObjectEditorMainComponent } from './components/object-editor-main/object-editor-main.component';
import { EIMObjectEditorDialogManagerComponent } from './shared/components/dialog-manager/dialog-manager.component';

/**
 * オブジェクトエディタコンポーネント
 * @example
 *
 *      <eim-object-editors
 *
 *      >
 *      </eim-object-editors>
 */
@Component({
	selector: 'eim-object-editors',
	templateUrl: './object-editors.component.html',
	styleUrls: ['./object-editors.component.css'],
	imports: [
		CommonModule,
		EIMSharedModule,
		EIMDialogSharedManagerComponent,
		EIMObjectEditorDialogManagerComponent,
		EIMMessageComponent,

		EIMObjectEditorMainComponent
	],
	providers: [ToastModule, ConfirmationService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMObjectEditorsComponent implements OnInit {

	/** ログインユーザ */
	public user: EIMUser = {};

	/** バージョン */
	public version: string;

	/** フォントサイズ */
	public fontSize = 'middle';

	/** フォントサイズクラス */
	fontSizeClass = 'eim-font-size-m';

	/** ヘッダーラベル */
	public headerLabel = '';

	/** セッションタイムアウトサブスクリプション */
	private sessionTimeoutServiceSessionTimeout: Subscription;

	/** セッション読み込みフラグ */
	public sessionReadFlg = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public authenticationService: EIMObjectEditorsAuthenticationService,
		protected translateService: TranslateService,
		protected sessionTimeoutService: EIMSessionTimeoutService,
		protected messageService: EIMMessageService,
		protected userService: EIMObjectEditorsUserService,
		protected serverConfigService: EIMServerConfigService,
		protected objectEditorsCacheService: EIMObjectEditorsCacheService,
		protected router: Router,
	) {
		/**
		 * セッションタイムアウトイベントハンドラ.
		 * @param message メッセージ
		 */
		this.sessionTimeoutServiceSessionTimeout =  this.sessionTimeoutService.sessionTimeout
			.subscribe( (message: string) => {
				this.messageService.show(EIMMessageType.error, message,
					() => {
					// ログイン画面に遷移する
					this.authenticationService.goToLogin();
			});
		});
	}

	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit(): void {

		this.userService.getSessionUser().subscribe(data => {
			this.user = data.loginUser;

			// キャッシュに保存
			let loginUser: EIMUserDomain = new EIMUserDomain();
			loginUser.id = this.user.userId;
			loginUser.name = this.user.userName;
			loginUser.code = this.user.userCode;
			loginUser.kana = this.user.userKana;
			loginUser.mail = this.user.userMail;
			loginUser.admin = this.user.userAdmin;
			this.objectEditorsCacheService.setLoginUser(loginUser);
			this.objectEditorsCacheService.setJSessionId(data.configKeyValue['jSessionId']);
			// バージョン
			this.version = '';
			this.headerLabel = '(' + this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_01012') + ')';

			this.sessionReadFlg = true;
		},
		err => {
			let accept = () => {
				this.router.navigate(['/object-editors/login']);
			};
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00006'), accept);
		});

	}
	/**
	 * フォントサイズ変更ハンドラ
	 * @param event イベント
	 */
	onChangeFontSize(event) {
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
