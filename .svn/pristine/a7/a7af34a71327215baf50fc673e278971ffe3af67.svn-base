import { Component, ViewChild, OnInit, AfterViewInit, forwardRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { EIMLoginComponent } from 'app/shared/components/login/login.component';
import { EIMTaskAuthenticationService } from 'app/tasks/services/apis/task-authentication.service';
import { EIMComponent } from 'app/shared/shared.interface';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

/**
 * ログインコンポーネント
 * @example
 *
 *      <eim-task-login>
 *      </eim-task-login>
 */
@Component({
	selector: 'eim-task-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	imports:[EIMLoginComponent, DialogModule, ButtonModule],
    providers: [
		MessageService,
		{provide: EIMComponent, useExisting: forwardRef(() => EIMTaskLoginComponent)},
		EIMLoginComponent
	],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMTaskLoginComponent implements OnInit, AfterViewInit {

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
		public authenticationService: EIMTaskAuthenticationService,
		// protected userService: EIMFormUserService,
		private router: Router,
		protected title: Title,
	) {

	}

	/**
	 * データバインド入力値初期化後の処理です.
	 */
	ngOnInit() {
		this.loginComponent.init$.subscribe( (data:any) => {
				// TODO:セッション確認必要か
			// 	if (data.params) {
			// 	// セッション確認
			// 	this.userService.getSessionUser(true, false).subscribe( (userInfo:any) => {
			// 		// セッション有りなら画面遷移
			// 		this.router.navigate([data.url], {queryParams: data.params});
			// 	}, () => {
			// 		// セッション無しならそのまま
			// 	});
			// }
		});

		this.title.setTitle(EIMTaskConstantService.WINDOW_TITLE);
	}

	/**
	 * 子コンポーネントのビュー生成後の処理です.
	 */
	ngAfterViewInit() {

		this.loginComponent.login$.subscribe( (data:any) => {
			this.router.navigate([data.url], {queryParams: {}});
		});
	}

}
