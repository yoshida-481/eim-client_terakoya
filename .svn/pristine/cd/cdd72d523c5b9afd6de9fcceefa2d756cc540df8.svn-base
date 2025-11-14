import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { environment } from 'environments/environment';

import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAuthenticationService } from 'app/shared/services/apis/authentication.service';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';

import { PrimeNG  } from 'primeng/config';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { EIMMessageComponent } from '../message/message.component';
import { Dialog, DialogModule } from 'primeng/dialog';
/**
 * ログインコンポーネント
 * @example
 *		<eim-login [authenticationService]="authenticationService">
 *		</eim-login>
 */
@Component({
    selector: 'eim-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],  	
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		TranslateModule,

		InputTextModule,
		ButtonModule,
		SelectModule,
		DialogModule,

		EIMMessageComponent,
  ],
    providers: [		
	],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
    standalone: true
})
export class EIMLoginComponent implements OnInit, AfterViewInit {

	/** フォーカス対象 */
	@ViewChild('focusTarget', { static: true }) focusTarget: ElementRef;

	/** 認証サービス */
	@Input()
	public authenticationService: EIMAuthenticationService;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 正規表現：パスワード */
	public regexpPassword: string = EIMConstantService.REGULAR_EXPRESSION_PASSWORD;

	/** フォームグループ */
	public loginForm: UntypedFormGroup;

	/** 言語リスト */
	public languages: any[] = [];

	/** ロゴURL */
	public logoSrc: string = environment.baseURL + 'src/assets/EIM_logo.svg';

	/** オブジェクトId */
	public objId: number = null;

	/** フォルダフラグ */
	public isFolder = false;

	/** リンク親オブジェクトID */
	public linkParentObjId: number = null;

	/** ダウンロードPrivateドキュメントオブジェクトID */
	public privateFileDownloadObjId: number = null;

	/** ダウンロードPublicドキュメントオブジェクトID */
	public publicFileDownloadObjId: number = null;

	/** 帳票管理 ログイン直後に開くアコーディオン */
	public openAccordion: string = null;

	/** フォントサイズ */
	fontSizeClass = 'eim-font-size-m';

	/** 初期表示完了イベント */
	public init = new Subject<any>();
	public init$ = this.init.asObservable();

	/** ログイン完了イベント */
	public login = new Subject<any>();
	public login$ = this.login.asObservable();

	/**
	 * コンストラクタです.
	 */
	constructor(
		public translate: TranslateService,
		public localStorageService: EIMLocalStorageService,
		public activatedRoute: ActivatedRoute,
		public router: Router,
		public cacheService: EIMCacheService,
		public formBuilder: UntypedFormBuilder,
		public config: PrimeNG,
	) {

			// フォーム
			this.loginForm = formBuilder.group(
				{
					'userCode': new UntypedFormControl(),
					'password': new UntypedFormControl(),
					'language': new UntypedFormControl()
				}
			);
		}

	/**
	 * ログインボタン押下可否を返却します.
	 */
	public canLogin(): boolean {
		return this.loginForm.valid;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		this.activatedRoute.queryParams.subscribe( (params: any) => {
			this.objId = params.objId;
			if (params.isFolder === 'true') {
				this.isFolder = true;
			}
			this.linkParentObjId = params.linkParentObjId ;
			this.privateFileDownloadObjId = params.privateFileDownloadObjId;
			this.publicFileDownloadObjId = params.publicFileDownloadObjId;
			this.openAccordion = params.openAccordion;

			if (this.objId || this.openAccordion) {
				// 初期表示完了イベント
				this.init.next({url: this.getUrl(), params: this.getParams()});
			}
		});

		this.authenticationService.getLanguageList()
		.subscribe(
				(languages: any) => {

					const newlanguages = [];
					for (let i = 0; i < languages.length; i++) {
						let optionLabel: string = languages[i].name;
						let optionValue: string = languages[i].langId;
						newlanguages.push({label: optionLabel, value: optionValue});
					}
					this.languages = newlanguages;

					// ローカルストレージに選択言語リストを設定
					this.localStorageService.setSelectableLangIdList(languages);

					// ローカルストレージから初期値を設定
					this.loginForm.controls['userCode'].setValue(this.localStorageService.getUserCode());
					if (!this.localStorageService.getLangId()) {
						this.loginForm.controls['language'].setValue(this.languages[0].value);
					} else {
						this.loginForm.controls['language'].setValue(this.localStorageService.getLangId());
					}
				}
		);
	}

	/**
	 * 子コンポーネントのビュー生成後の処理です.
	 */
	ngAfterViewInit() {

		this.focusTarget.nativeElement.focus();
	}

	/**
	 * ログインボタン押下時のイベントハンドラです.
	 */
	onLogin() {

		// ログインに使用するユーザコードとパスワードを保持して
		// ログイン成功時に保持したユーザコードとパスワードをローカルストレージに保存する
		// (バインドしている値だとログイン成功時にキー入力で値が変わる可能性があるため)
		let userCode: string = this.loginForm.controls['userCode'].value;
		let password: string = this.loginForm.controls['password'].value;
		let langId: string = this.loginForm.controls['language'].value;

		// 言語切替
		this.translate.use(langId);

		// ログイン
		this.authenticationService.login(userCode, password, langId)
			.subscribe(
					(user) => {
						let url: string;
						let params: any;

						// ローカルストレージに保存
						this.localStorageService.setUserCode(userCode);
						this.localStorageService.setUserId(user['id']);
						this.localStorageService.setLangId(langId);

						url = this.getUrl();
						params = this.getParams();

						// キャッシュサービスにログインユーザを保存
						let userDomain: EIMUserDomain = (user as EIMUserDomain);
						this.cacheService.setLoginUser(userDomain);

						// PrimeNGの設定を読み込む
						this.translate.get('EIM.CALENDAR').subscribe(res => this.config.setTranslation(res));

						// ログイン完了イベント
						window.setTimeout(() => {
							this.login.next({url: url, params: params});
						});
					}
			);
	}

	/**
	 * メイン画面のURLを返却します.
	 * @return メイン画面のURL
	 */
	public getUrl(): string {
		let url: string;
		url = this.authenticationService.getMainUrl();
		return url;
	}

	/**
	 * URLパラメータを取得します.
	 * @return URLパラメータ(キーバリュー)
	 */
	public getParams(): any {
		let params: any = {};
		if (this.objId) {
			params.objId = this.objId;
		}
		if (this.linkParentObjId) {
			params.linkParentObjId = this.linkParentObjId;
		}
		params.isFolder = this.isFolder;
		if (this.privateFileDownloadObjId) {
			params.privateFileDownloadObjId = this.privateFileDownloadObjId;
		}
		if (this.publicFileDownloadObjId) {
			params.publicFileDownloadObjId = this.publicFileDownloadObjId;
		}
		if (this.openAccordion) {
			params.openAccordion = this.openAccordion;
		}
		return params;
	}

}
