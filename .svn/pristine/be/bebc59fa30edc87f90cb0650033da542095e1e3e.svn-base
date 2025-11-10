import { EIMFormsCacheService } from '../forms-cache.service';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMAuthenticationService, EIMUser } from 'app/shared/services/apis/authentication.service';
import { EIMChangePasswordDomain } from 'app/shared/domains/change-password.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


@Injectable()
export class EIMFormAuthenticationService extends EIMAuthenticationService {

	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected formsCacheService: EIMFormsCacheService,
		protected router: Router,
	) {
		super(httpService, jsonService);
	}

	/**
	 * 言語リストを取得します.
	 */
	public getLanguageList(): Observable<any> {
		return this.httpService.post('/rest/authenticate/getLanguageList.mvc')
			.pipe(mergeMap((res: any) => {
				return of(res.value);
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

		return this.httpService.post('/rest/authenticate/login.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * ログアウトします.
	 */
	public logout(): Observable<null> {
		
		// キャッシュをクリアする
		this.formsCacheService.clearAll();
		
		return this.httpService.post('/rest/authenticate/logout.mvc')
		.pipe(mergeMap((res: any) => {
			return of(null);
		}));
	}

	/**
	 * ログイン後メイン画面URLを取得します.
	 */
	public getMainUrl(): string {
		return '/forms/main';
	}

	/**
	 * ログインURLを取得します.
	 */
	public getLoginUrl(): string {
		return '/forms/login';
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
	 * パスワード変更時の注意書きを取得します.
	 * @returns パスワード変更画面に表示する注意書き文言文字列
	 */
	public getNotesMessage(): Observable<string> {
		return this.httpService.get('/rest/authenticate/getNotesPasswordMessage.mvc')
				.pipe(mergeMap((res: any) => {
					return of(res.value.notesMessage);
				}));
	}

}
