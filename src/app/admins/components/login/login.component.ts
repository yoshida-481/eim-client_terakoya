import { Component, ViewChild, OnInit, AfterViewInit, Input, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EIMAdminsAuthenticationService } from 'app/admins/shared/services/apis/authentication.service';
import { EIMUserService } from 'app/admins/shared/services/apis/user.service';
import { Subject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAuthenticationService } from 'app/shared/services/apis/authentication.service';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMAdminsApplicationService } from 'app/admins/shared/services/apis/admins-application.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { EIMMessageComponent } from 'app/shared/components/message/message.component';

/**
 * ログインコンポーネント
 * @example
 *		<eim-admins-login>
 *		</eim-admins-login>
 */
@Component({
	selector: 'eim-admins-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		EIMMessageComponent,
		ButtonDirective,
		Select,
		InputTextModule
	],
	providers: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMAdminsLoginComponent implements OnInit, AfterViewInit {

	/** フォーカス対象 */
	@ViewChild('focusTarget', { static: true }) focusTarget: ElementRef;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 正規表現：パスワード */
	public regexpPassword: string = EIMConstantService.REGULAR_EXPRESSION_PASSWORD;

	/** フォームグループ */
	public loginForm: UntypedFormGroup;

	/** 言語リスト */
	public languages: any[] = [];

	/** モードリスト */
	public adminApps: any[] = [];

	/** ロゴURL */
	public logoSrc: string = environment.baseURL + 'src/assets/EIM_logo.svg';

	/** オブジェクトId */
	public objId: number = null;

	/** フォントサイズ */
	public fontSizeClass = 'eim-font-size-m';

	/** 初期表示完了イベント */
	public init = new Subject<any>();
	public init$ = this.init.asObservable();

	/** ログイン完了イベント */
	public login = new Subject<any>();
	public login$ = this.login.asObservable();

	/**
	 * コンストラクタです.
	 * @param authenticationService 認証サービス
	 * @param userService ユーザサービス
	 * @param router ルータ
	 * @param title タイトル
	 */
	constructor(
		public authenticationService: EIMAdminsAuthenticationService,
		public adminsApplicationService: EIMAdminsApplicationService,
		public translate: TranslateService,
		public localStorageService: EIMLocalStorageService,
		public activatedRoute: ActivatedRoute,
		protected userService: EIMUserService,
		public router: Router,
		public cacheService: EIMCacheService,
		public formBuilder: UntypedFormBuilder,
		protected title: Title,
	) {
		// フォーム
		this.loginForm = formBuilder.group(
			{
				'userCode': new UntypedFormControl(),
				'password': new UntypedFormControl(),
				'language': new UntypedFormControl(),
				'adminAppId': new UntypedFormControl()
			}
		);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * ログインボタン押下可否を返却します.
	 * @return 押下可否
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
		// 言語リストの取得
		this.authenticationService.getLanguageList().subscribe(
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
				if (this.localStorageService.getLangId() == null) {
					this.loginForm.controls['language'].setValue(this.languages[0].value);
				} else {
					this.loginForm.controls['language'].setValue(this.localStorageService.getLangId());
				}
			}
		);

		// アプリケーションリストの取得
		this.adminsApplicationService.getApplicationList().subscribe(
			(adminApps: any) => {
				const tmpAdminApps = [];
				let selectedAdminApps = null;
				for (let i = 0; i < adminApps.length; i++) {
					let optionLabel: string = adminApps[i].name;
					let optionValue: string = adminApps[i].id;
					tmpAdminApps.push({label: optionLabel, value: optionValue});

					if (optionValue === this.localStorageService.getAdminAppId()) {
						selectedAdminApps = optionValue;
					}
				}
				this.adminApps = tmpAdminApps;
				// ローカルストレージに選択モードリストを設定
				this.localStorageService.setSelectableAdminAppIdList(adminApps);

				// ローカルストレージから初期値を設定
				this.loginForm.controls['userCode'].setValue(this.localStorageService.getUserCode());
				if (selectedAdminApps == null) {
					this.loginForm.controls['adminAppId'].setValue(this.adminApps[0].value);
				} else {
					this.loginForm.controls['adminAppId'].setValue(selectedAdminApps);
				}
			}
		);

		this.title.setTitle(EIMAdminsConstantService.WINDOW_TITLE);
	}

	/**
	 * 子コンポーネントのビュー生成後の処理です.
	 */
	ngAfterViewInit() {
		this.focusTarget.nativeElement.focus();
		this.login$.subscribe( (data: any) => {
			this.router.navigate([data.url], {queryParams: data.params});
		});
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
		let adminAppId: string = this.loginForm.controls['adminAppId'].value;
		// 言語切替
		this.translate.use(langId);

		// ログイン
		this.authenticationService.login(userCode, password, langId, adminAppId).subscribe(
			(user) => {
				let url: string;
				let params: any;

				// ローカルストレージに保存
				this.localStorageService.setUserCode(userCode);
				this.localStorageService.setUserId(user['id']);
				this.localStorageService.setLangId(langId);
				this.localStorageService.setAdminAppId(adminAppId);

				url = this.getUrl();
				params = this.getParams();

				// キャッシュサービスにログインユーザを保存
				let userDomain: EIMUserDomain = (user as EIMUserDomain);
				this.cacheService.setLoginUser(userDomain);
				// ログイン完了イベント
				this.login.next({url: url, params: params});
			}
		);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * URLパラメータを取得します.
	 * @return URLパラメータ(キーバリュー)
	 */
	private getParams(): any {
		let params: any = {};
		if (this.objId) {
			params.objId = this.objId;
		}
		return params;
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
}
