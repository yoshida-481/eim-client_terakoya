import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMAuthenticationService, EIMUser } from 'app/shared/services/apis/authentication.service';
import { EIMChangePasswordDomain } from 'app/shared/domains/change-password.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMAdminAuthTypeDomain } from 'app/shared/domains/entity/admin-auth-type.domain';
import { EIMDomainService } from 'app/shared/services/domain.service';

/**
 * ポータルの認証サービスクラスです.
 */
@Injectable()
export class EIMPortalAuthenticationService extends EIMAuthenticationService {

	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected router: Router,
		protected httpForRestAPIService: EIMHttpForRestAPIService,
		private domainService: EIMDomainService,
	) {
		super(httpService, jsonService);
	}

	/**
	 * 言語リストを取得します.
	 */
	public getLanguageList(): Observable<EIMLanguageDTO[]> {
		return this.httpForRestAPIService.get('/apis/languages')
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * 管理権限タイプ一覧を取得します.
	 * @return 管理権限タイプ一覧
	 */
	public getAdminAuth(appId: String): Observable<EIMAdminAuthTypeDomain[]> {
		return this.httpForRestAPIService.get('/apis/admin-auth-types', { appId: appId })
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value, (_json: any) => {
					return new EIMAdminAuthTypeDomain(_json);
				}))
			}));
	}

	/**
	 * ログインします.
	 * @param userCode ユーザコード
	 * @param userPass パスワード
	 * @param langId 言語ID
	 */
	public login(userCode: string, userPass: string, langId: string): Observable<EIMUser> {

		let tz: number = new Date().getTimezoneOffset() * 60 * 1000;

		let params: any = {};
		params['code'] = userCode;
		params['password'] = userPass;
		params['langId'] = langId;
		params['userTzOffset'] = tz;

		return this.httpForRestAPIService.post('/apis/authentications', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ログアウトします.
	 */
	public logout(): Observable<null> {

		// キャッシュをクリアする
		// this.formsCacheService.clearAll();

		// return this.httpForRestAPIService.post('/apis/logout')
		// .pipe(mergeMap((res: any) => {
		// 	return of(null);
		// }));

		// TODO eim-form利用で問題ないか（ログイン同様、taskで独自実装が必要か？
		return this.httpService.post('/rest/authenticate/logout.mvc')
		.pipe(mergeMap((res: any) => {
			return of(null);
		}));
	}

	/**
	 * ログイン後メイン画面URLを取得します.
	 */
	public getMainUrl(): string {
		return '/portals/main';
	}

	/**
	 * ログインURLを取得します.
	 */
	public getLoginUrl(): string {
		return '/portals/login';
	}

	/**
	 * ログイン画面に遷移します.
	 */
	public goToLogin(): void {
		this.router.navigate([this.getLoginUrl()]);
	}

	/**
	 * パスワードを変更します.
	 * @param currentPassword 現在のパスワード
	 * @param newPassword 新しいパスワード
	 */
	public changePassword(currentPassword: string, newPassword: string): Observable<any> {

		let params: any = {};
		params['currentPassword'] = currentPassword;
		params['newPassword'] = newPassword;

		let changePasswordDomain: EIMChangePasswordDomain = new EIMChangePasswordDomain();
		changePasswordDomain.currentPassword = currentPassword;
		changePasswordDomain.newPassword = newPassword;

		return this.httpService.post('/rest/authenticate/changePassword.mvc', changePasswordDomain)
			.pipe(mergeMap((res: any) => {
				return of(null);
			}));
	}

	/**
	 * 表示言語を変更します.
	 * @param langId 言語ID
	 */
	public changeLanguage(langId: string): Observable<EIMUser> {
		const params: any = {
			langId,
		};
		return this.httpService.post('/rest/authenticate/changeLanguage.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * セッションユーザを取得します.
	 * @param langId 言語ID
	 */
	public getSessionUser(displayProgressDialog: boolean = true, displayErrorDialog: boolean = true): Observable<EIMUserDTO> {
		return this.httpService.get('/apis/authentications/getSessionUser.mvc', null, displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(new EIMUserDTO(res.value));
			}));
	}
}
