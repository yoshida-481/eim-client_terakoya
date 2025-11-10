import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMAuthenticationService, EIMUser } from 'app/shared/services/apis/authentication.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';

import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

/**
 * ドキュメント管理認証APIサービス
 */
@Injectable()
export class EIMDocumentAuthenticationService extends EIMAuthenticationService {

	/** ログイン画面のURL */
	public loginUrl = '/documents/login'; // タスク管理等他の管理画面から利用する際、ログイン画面を切り替えられるようにする

	constructor(
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected documentsCacheService: EIMDocumentsCacheService,
		private router: Router,
	) {
		super(httpService, jsonService);
	}

	/**
	 * 言語リストを取得します.
	 */
	public getLanguageList(): Observable<EIMLanguageDTO[]> {
		return this.httpService.postForForm('/app/document/conf/dspLanguageXML.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.langlist.language, this.convertToEIMLanguage.bind(this)));
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
		params['userCode'] = userCode;
		params['userPass'] = userPass;
		params['langId'] = langId;
		params['locale'] = 'ja-JP';
		params['userTzOffset'] = tz;

		return this.httpService.postForForm('/app/document/session/actLogin.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.user.attr);
			}));
	}

	/**
	 * ログアウトします.
	 */
	public logout(): Observable<any> {
		// キャッシュをクリアする
		this.documentsCacheService.clearAll();

		return this.httpService.postForForm('/app/document/session/actLogout.jsp')
		.pipe(mergeMap((res: any) => {
			return of(res.value.windowAction.attr.windowClose);
		}));
	}

	/**
	 * ログイン後メイン画面URLを取得します.
	 */
	public getMainUrl(): string {
		return '/documents/main';
	}

	/**
	 * ログインURLを取得します.
	 */
	public getLoginUrl(): string {
		return this.loginUrl;
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

		return this.httpService.postForForm('/app/document/user/actPasswordChange.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
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
		return this.httpService.postForForm('/app/document/session/actLanguageChange.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.user.attr);
			}));
	}

	/**
	 * パスワード変更時の注意書きを取得します.
	 * @returns パスワード変更画面に表示する注意書き文言文字列
	 */
	public getNotesMessage(): Observable<string> {
		return this.httpService.get('/app/document/session/getNotesPasswordMessage.jsp')
				.pipe(mergeMap((res: any) => {
					return of(res.value.notesMessage.attr.message);
				}));
	}

	private convertToEIMLanguage(json: any): EIMLanguageDTO {
		return {
			name: json.label._text,
			langId: json.data._text,
			nameList: this.jsonService.getJsonChildren(
				json.namelist.item,
				item => ({ lang: item.lang._text, value: item.name._text })),
		};
	}
}
