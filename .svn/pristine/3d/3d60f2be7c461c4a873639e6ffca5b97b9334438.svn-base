import { Component, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { EIMLoginComponent } from 'app/shared/components/login/login.component';

import { EIMObjectEditorsAuthenticationService } from 'app/object-editors/shared/services/apis/object-editors-authentication.service';
import { EIMObjectEditorsUserService } from 'app/object-editors/shared/services/apis/object-editors-user.service';

/**
 * ログインコンポーネント
 * @example
 *
 *      <eim-object-editor-login>
 *      </eim-object-editor-login>
 */
@Component({
	selector: 'eim-object-editor-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	imports: [EIMLoginComponent],
	providers: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMObjectEditorLoginComponent implements AfterViewInit {

	/** ログインコンポーネント */
	@ViewChild('login', { static: true }) loginComponent: EIMLoginComponent;


	/**
	 * コンストラクタです.
	 * @param authenticationService 認証サービス
	 * @param userService ユーザサービス
	 * @param router ルータ
	 */
	constructor(
		public authenticationService: EIMObjectEditorsAuthenticationService,
		protected userService: EIMObjectEditorsUserService,
		private router: Router,
	) {
	}

	/**
	 * 子コンポーネントのビュー生成後の処理です.
	 */
	ngAfterViewInit() {

		this.loginComponent.login$.subscribe( (data: any) => {
			this.router.navigate([data.url]);
		});
	}

}
