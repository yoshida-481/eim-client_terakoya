import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { EIMAdminAppDTO } from 'app/shared/dtos/admin-app.dto';

export interface EIMUser {
	userCode?: string;
}

/**
 * 認証APIサービス
 */
@Injectable()
export class EIMAuthenticationService {

	constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService
	) {
	}


	/**
	 * 言語リストを取得します.
	 */
	public getLanguageList(): Observable<EIMLanguageDTO[]> {
		return null;
	}

	/**
	 * ログインします.
	 */
	public login(userCode: string, userPass: string, langId: string, adminAppId?: string): Observable<EIMUser> {
		// アプリケーションごとのサービスで実装
		return null;
	}

	/**
	 * ログイン後メイン画面URLを取得します.
	 */
	public getMainUrl(): string {
		// アプリケーションごとのサービスで実装
		return null;
	}

	/**
	 * ログインURLを取得します.
	 */
	public getLoginUrl(): string {
		// アプリケーションごとのサービスで実装
		return null;
	}

	/**
	 * ログアウトします.
	 */
	public logout(): Observable<any> {
		// アプリケーションごとのサービスで実装
		return null;
	}

		/**
	 * パスワードを変更します.
	 * @param currentPassword 現在のパスワード
	 * @param newPassword 新しいパスワード
	 */
	public changePassword(currentPassword: string, newPassword: string): Observable<any> {
		// アプリケーションごとのサービスで実装
		return of(null);
	}

	/**
	 * 表示言語を変更します.
	 * @param langId 言語ID
	 */
	public changeLanguage(langId: string): Observable<EIMUser> {
		// アプリケーションごとのサービスで実装
		return null;
	}

	/**
	 * パスワード変更時の注意書きを取得します.
	 * @returns パスワード変更画面に表示する注意書き文言文字列
	 */
	getNotesMessage(): Observable<string> {
		// アプリケーションごとのサービスで実装
		return null;
	}

}
