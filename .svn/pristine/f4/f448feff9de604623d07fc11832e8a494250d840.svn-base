import { Component, ViewChild, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EIMDocumentAuthenticationService } from 'app/documents/shared/services/apis/authentication.service';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';

import { EIMLoginComponent } from 'app/shared/components/login/login.component';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDocumentsModule } from 'app/documents/documents.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { MessageService } from 'primeng/api';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { Button, ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

/**
 * ログインコンポーネント
 * @example
 *
 *      <eim-document-login>
 *      </eim-document-login>
 */
@Component({
    selector: 'eim-document-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
	imports:[EIMLoginComponent, DialogModule, ButtonModule],
    providers: [MessageService],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
    standalone: true
})
export class EIMDocumentLoginComponent implements OnInit, AfterViewInit {

	/** ログインコンポーネント */
	@ViewChild('login', { static: true }) loginComponent: EIMLoginComponent;

	private activateParam;

	/**
	 * コンストラクタです.
	 * @param authenticationService 認証サービス
	 * @param userService ユーザサービス
	 * @param router ルータ
	 * @param title タイトル
	 */
	constructor(
		public authenticationService: EIMDocumentAuthenticationService,
		protected userService: EIMDocumentsUserService,
		public activatedRoute: ActivatedRoute,
		private router: Router,
		protected title: Title,
	) {
	}

	/**
	 * データバインド入力値初期化後の処理です.
	 */
	ngOnInit(): void {
		this.loginComponent.init$.subscribe( (data: any) => {
			if (data.params) {
				// セッション確認
				this.userService.getSessionUser(true, false).subscribe( (userInfo: any) => {
					// セッション有りなら画面遷移
					// this.router.navigate([this.authenticationService.getMainUrl() + '/' + data.objId]);
					this.router.navigate([data.url], {queryParams: data.params});
				}, () => {
					// セッション無しならそのまま
				});
			}
		});

		this.activatedRoute.queryParams.subscribe( (params: any) => {
			this.activateParam = params;
		});

		this.title.setTitle(EIMDocumentsConstantService.WINDOW_TITLE);
	}

	/**
	 * 子コンポーネントのビュー生成後の処理です.
	 */
	ngAfterViewInit() {

		this.loginComponent.login$.subscribe( (data: any) => {
			if (this.activateParam.isPdfViewer) {
				this.router.navigate(["/pdfViewer"], {queryParams: this.activateParam});
			} else {
				this.router.navigate([data.url], {queryParams: data.params});
			}
		});
	}

}
