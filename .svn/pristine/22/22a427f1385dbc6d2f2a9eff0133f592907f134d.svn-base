import { Component, ViewChild, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EIMFormsConstantService } from 'app/forms/shared/services/forms-constant.service';
import { EIMFormAuthenticationService } from 'app/forms/shared/services/apis/authentication.service';
import { EIMFormUserService } from 'app/forms/shared/services/apis/user.service';

import { EIMLoginComponent } from 'app/shared/components/login/login.component';

/**
 * ログインコンポーネント
 * @example
 *
 *      <eim-form-login>
 *      </eim-form-login>
 */
@Component({
    selector: 'eim-form-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
	imports:[EIMLoginComponent],
    providers: [],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
    standalone: true
})
export class EIMFormLoginComponent implements OnInit, AfterViewInit {

	/** ログインコンポーネント */
	@ViewChild('login', { static: true }) loginComponent:EIMLoginComponent;

	/**
	 * コンストラクタです.
	 * @param authenticationService 認証サービス
	 * @param userService ユーザサービス
	 * @param router ルータ
	 * @param title タイトル
	 */
	constructor(
		public authenticationService: EIMFormAuthenticationService,
		protected userService: EIMFormUserService,
		private router: Router,
		protected title: Title,
	) {

	}

	/**
	 * データバインド入力値初期化後の処理です.
	 */
	ngOnInit() {
		this.loginComponent.init$.subscribe( (data:any) => {
			if (data.params) {
				// セッション確認
				this.userService.getSessionUser(true, false).subscribe( (userInfo:any) => {
					// セッション有りなら画面遷移
					this.router.navigate([data.url], {queryParams: data.params});
				}, () => {
					// セッション無しならそのまま
				});
			}
		});

		this.title.setTitle(EIMFormsConstantService.WINDOW_TITLE);
	}

	/**
	 * 子コンポーネントのビュー生成後の処理です.
	 */
	ngAfterViewInit() {

		this.loginComponent.login$.subscribe( (data:any) => {
			this.router.navigate([data.url], {queryParams: data.params});
		});
	}

}
