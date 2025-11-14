import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { EIMAuthenticationService } from '../services/apis/authentication.service';
import { EIMConstantService } from '../services/constant.service';

/**
 * ログインチェック結果
 */
export interface EIMLoginCheckResult {
	// SSOログインの場合true
	sso: boolean;
	// EIM独自認証の場合true
	internalAuth: boolean;
	// ユーザ情報
	user: EIMUserDomain;
	// 言語ID
	langId: string;
	// 言語の更新が必要な場合true
	updateLang: boolean;
}

/**
 * 認証ガード抽象クラス
 */
export abstract class EIMAuthenticationGuard<T extends EIMLoginCheckResult>  {

	constructor(
		protected router: Router,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected sessionStorageService: EIMSessionStorageService,
		protected authenticationService: EIMAuthenticationService,
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.updateLangList()
			.pipe(flatMap(_ => this.checkLogin()))
			.pipe(
				flatMap(res => {
					if (state.url.indexOf(this.authenticationService.getLoginUrl()) === 0) {
						return this.onCheckLogin(res, route, state);
					}
					if (state.url.indexOf(this.authenticationService.getMainUrl()) === 0) {
						return this.onCheckMain(res, route, state);
					}
					return of(true);
				}),
				catchError(() => {
					// エラーが発生した場合はそのまま遷移させる
					this.sessionStorageService.removeItem(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME,
						EIMConstantService.SESSIONSTORAGE_KEY_SSO);
					return of(true);
				}));
	}

	/**
	 * 言語リストを更新します.
	 */
	updateLangList(): Observable<any> {
		// 選択言語リストがローカルストレージに未設定の場合は取得
		const langIdList = this.localStorageService.getSelectableLangIdList();
		if (!langIdList || !langIdList.length) {
			return this.authenticationService.getLanguageList()
				.pipe(tap(languages => {
					// ローカルストレージに選択言語リストを設定
					this.localStorageService.setSelectableLangIdList(languages);
				}));
		}
		return of(null);
	}

	/**
	 * ログインチェック成功後のログイン画面用のイベントハンドラ.
	 * @param res ログインチェック結果
	 * @param route ActivatedRouteSnapshot
	 * @param state RouterStateSnapshot
	 */
	onCheckLogin(res: T, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		this.updateStorage(res);
		this.additionalCheckLogin(res);
		const updateCurrentLang = this.updateCurrentLang(res);

		// SSOログインの場合はメイン画面に遷移させる
		// SSOログインでない場合はそのままログイン画面に遷移させる
		const activate = !res.sso;
		return updateCurrentLang.pipe(map(_ => {
			if (!activate) {
				this.router.navigate([this.authenticationService.getMainUrl()], { queryParams: route.queryParams });
			}
			return activate;
		}));
	}

	/**
	 * ログインチェックを呼び出します.
	 * @return ログインチェック結果
	 */
	protected abstract checkLogin(): Observable<T>;

	/**
	 * ログインチェック成功後のイベントハンドラで行う追加処理.
	 * @param res ログインチェック結果
	 */
	protected additionalCheckLogin(res: T) { }

	/**
	 * noSsoが指定されているか否かを返却します.
	 * @return `noSso`が指定されている場合`true`
	 */
	protected isNoSso(): boolean {
		return location.search.substring(1).split('&').some(x => {
			const kv = x.split('=');
			if (kv.length !== 2) {
				return false;
			}
			const k = kv[0].toLowerCase();
			if (k !== 'nosso') {
				return false;
			}
			const v = kv[1].toLowerCase();
			if (v !== 'true' && v !== '1') {
				return false;
			}
			return true;
		});
	}

	/**
	 * ログインチェック成功後のログイン画面用のイベントハンドラ.
	 * @param res ログインチェック結果
	 * @param route ActivatedRouteSnapshot
	 * @param state RouterStateSnapshot
	 */
	private onCheckMain(res: T, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		this.updateStorage(res);
		this.additionalCheckLogin(res);
		const updateCurrentLang = this.updateCurrentLang(res);

		return updateCurrentLang;
	}

	/**
	 * ストレージ情報を更新します.
	 */
	private updateStorage(res: T) {
		if (res.sso) {
			// セッションストレージSSOでログインしたことを保存
			this.sessionStorageService.set(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME,
				EIMConstantService.SESSIONSTORAGE_KEY_SSO, true);
		} else {
			this.sessionStorageService.removeItem(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME,
				EIMConstantService.SESSIONSTORAGE_KEY_SSO);
		}

		if (res.internalAuth) {
			// セッションストレージEIMANAGER独自認証でログインしたことを保存
			this.sessionStorageService.set(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME,
				EIMConstantService.SESSIONSTORAGE_KEY_INTERNAL_AUTH, true);
		} else {
			this.sessionStorageService.removeItem(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME,
				EIMConstantService.SESSIONSTORAGE_KEY_INTERNAL_AUTH);
		}

		// ローカルストレージにユーザ情報、言語IDを設定
		this.localStorageService.setUserCode(res.user.code);
		this.localStorageService.setUserId(res.user.id);
		this.localStorageService.setLangId(res.langId);
	}

	/**
	 * 現在の言語を更新します.
	 */
	private updateCurrentLang(res: T): Observable<boolean> {
		// 言語を再読み込みする
		// 読み込み完了待ちのためダミーでラベルを取得しておく
		const currentLang = this.translateService.currentLang;
		return (res.updateLang || res.langId !== currentLang)
			? this.translateService.use(res.langId)
				.pipe(flatMap(_ => this.translateService.get('EIM.LABEL_01003')))
				.pipe(map(_ => true))
			: of(true);
	}

}
