import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

import { EIMFormUserService } from 'app/forms/shared/services/apis/user.service';

import { EIMMessageService } from 'app/shared/services/message.service';

import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';
import { EIMFormsConstantService } from 'app/forms/shared/services/forms-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMFormAuthenticationService } from 'app/forms/shared/services/apis/authentication.service';

import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMUserSessionService } from 'app/shared/services/user-session.service';
import { EIMFormsModule } from './forms.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMDialogSharedManagerComponent } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component';
import { EIMMessageComponent } from 'app/shared/components/message/message.component';

/**
 * 帳票コンポーネント
 * @example
 *
 *      <eim-forms
 *
 *      >
 *      </eim-forms>
 */
@Component({
    selector: 'eim-forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.css'],
	imports:[
		EIMFormsModule, 
		EIMSharedModule, 
		EIMDialogSharedManagerComponent,
		EIMMessageComponent
	],
    providers: [ToastModule, ConfirmationService],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
    standalone: true
})
export class EIMFormsComponent implements OnInit {

	/** ログインユーザ */
	public user: any = {};

	/** バージョン */
	public version: string;

	/** フォントサイズ */
	public fontSize: string = 'middle';

	/** フォントサイズクラス */
	fontSizeClass: string = 'eim-font-size-m';

	/** URLジャンプ対象オブジェクトID */
	public jumpTargetId: number;

	/** アコーディオン指定URLジャンプ */
	public openAccordion: string;

	constructor(
		protected activatedRoute: ActivatedRoute,
		protected confirmationService: ConfirmationService,
		protected formsCacheService: EIMFormsCacheService,
		protected messageService: EIMMessageService,
		protected serverConfigService: EIMServerConfigService,
		protected userService: EIMFormUserService,
		protected usersessionService: EIMUserSessionService,
		public authenticationService: EIMFormAuthenticationService,
		protected title: Title,
	) {
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {

		this.userService.getSessionUser().subscribe(user => {
				this.user = {};
				this.user.userName = user.name;
				this.user.groupPath = user.groupNames;

				// サーバの設定ファイルの値を格納
				this.serverConfigService.setConfigValue(user.config);

				// バージョン
				this.version = this.serverConfigService.eimanagerFormVersion;
				let loginUser: EIMUserDomain = new EIMUserDomain();
				loginUser.id = user.id;
				loginUser.name = user.name;
				loginUser.code = user.code;
				this.formsCacheService.setLoginUser(loginUser);
				this.formsCacheService.setJSessionId(user.config.jSessionId);
				this.formsCacheService.setChangePasswordFlg(user.config.isChangePasswordFlg);
				this.usersessionService.doGetUserSession(user);
		});

		this.activatedRoute.queryParams.subscribe( (params: any) => {
			this.jumpTargetId = params.objId;
			this.openAccordion = params.openAccordion;
		});

		this.title.setTitle(EIMFormsConstantService.WINDOW_TITLE);
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
