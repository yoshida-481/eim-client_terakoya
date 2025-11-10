import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAuthenticationService, EIMUser } from 'app/shared/services/apis/authentication.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * 管理権限の種類
 */
export interface EIMAuth {
	authId: string;
	authValue: number;
	nameList: { [key: string]: string; };
}

/**
 * システム管理者の種類
 */
export interface EIMAdminType {
	authorityList: { [key: string]: string; };
	nameList: { [key: string]: string; };
}

/**
 * アプリケーション種別ごとに表示する管理権限の一覧
 */
export interface EIMAuthListApplication {
	applicationId?: string;
	authArray: EIMAuth[];
}

/**
 * アプリケーション種別ごとに表示するシステム管理者の一覧
 */
export interface EIMAdminTypeListApplication {
	applicationId?: string;
	adminTypeArray: EIMAdminType[];
}

/**
 * 管理者権限情報全体
 */
export interface EIMAdminAuth {
	authListApplicationArray: EIMAuthListApplication[];
	adminTypeListApplicationArray: EIMAdminTypeListApplication[];
}

/**
 * ドキュメント管理認証APIサービス
 */
@Injectable()
export class EIMAdminsAuthenticationService extends EIMAuthenticationService {

	/** アプリケーションID */
	private adminAppId = 'general';

	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected documentsCacheService: EIMAdminsCacheService,
		private serverConfigService: EIMServerConfigService,
		private router: Router,
	) {
		super(httpService, jsonService);
	}

	/**
	 * 言語リストを取得します.
	 */
	public getLanguageList(): Observable<EIMLanguageDTO[]> {
		return this.httpService.postForForm( '/admin/conf/dspLanguageXML.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.langlist.language, this.convertToEIMLanguage));
			}));
	}

	/**
	 * ログインします.
	 * @param userCode ユーザコード
	 * @param userPass パスワード
	 * @param langId 言語ID
	 * @param adminAppId 管理画面のID
	 */
	public login(userCode: string, userPass: string, langId: string, adminAppId?: string): Observable<EIMUser> {
		// 表示モード指定を、保管
		this.adminAppId = adminAppId;
		return this.httpService.get('/admin/session/actSetAppId.jsp', {appId: adminAppId}).pipe(mergeMap((
			(res: any) => {
				let tz: number = new Date().getTimezoneOffset() * 60 * 1000;
				let params: any = {};
				params['userCode'] = userCode;
				params['userPass'] = userPass;
				params['langId'] = langId;
				params['locale'] = 'ja-JP';
				params['userTzOffset'] = tz;

				return this.httpService.postForForm('/admin/session/actLogin.jsp', params).pipe(mergeMap((
					(loginRes: any) => {
						return of(loginRes.value);
					}
				)));
			}
		)));
	}

	/**
	 * ログアウトします.
	 */
	public logout(): Observable<any> {
		// キャッシュをクリアする
		this.documentsCacheService.clearAll();

		return this.httpService.postForForm('/admin/session/actLogout.jsp')
		.pipe(mergeMap((res: any) => {
			return of(res.value.windowAction.attr.windowClose);
		}));
	}

	/**
	 * クッキーに設定するための言語IDを取得します.
	 */
	public getLangId(): Observable<any> {

		return this.httpService.get('/admin/session/actCookie.jsp')
		.pipe(mergeMap((res: any) => {
			return of(res.value.user);
		}));
	}

	/**
	 * ロゴ画像を取得します.
	 * @param screenType
	 */
	public getLogoImageExist(screenType: string): Observable<any> {
		return this.httpService.postForForm('/admin/session/actLogoImageExist.jsp', {screenType: screenType})
		.pipe(mergeMap((res: any) => {
			return of(res);
		}));
	}

	/**
	 * ロゴ画像を取得します.
	 * @param logoImageFileName
	 */
	public getLogoImage(logoImageFileName: string): Observable<any> {
		return this.httpService.get('/admin/session/dspLogoImage.jsp', {logoImageFileName: logoImageFileName})
		.pipe(mergeMap((res: any) => {
			return of(res);
		}));
	}

	/**
	 * システム管理種別毎で表示するチェックボックスの定義を取得します.
	 * @return 表示するチェックボックスの定義
	 */
	public getAdminAuth(): Observable<EIMAdminAuth> {
		return this.httpService.get( '/admin/conf/dspAdminAuthXML.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.convertToEIMAdminAuth(res.value.adminAuth));
			}));
	}

	/**
	 * ログイン後メイン画面URLを取得します.
	 * @return メイン画面URL
	 */
	public getMainUrl(): string {
		switch (this.adminAppId) {
			case 'document':
				return '/admins/document/init';
			case 'form':
				return '/admins/form/init';
			case 'task':
				return '/admins/task/init';
			case 'general':
				return '/admins/general/init';
		}
	}

	/**
	 * ログインURLを取得します.
	 * @return ログインURL
	 */
	public getLoginUrl(): string {
		return '/admins/login';
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
	 * @return パスワード変更結果
	 */
	public changePassword(currentPassword: string, newPassword: string): Observable<any> {
		let params: any = {};
		params['currentPassword'] = currentPassword;
		params['newPassword'] = newPassword;
		return this.httpService.postForForm('/admin/user/actPasswordChange.jsp', params).pipe(mergeMap((
			(res: any) => {
				return of(res.value);
			}
		)));
	}

	/**
	 * 表示言語を変更します.
	 * @param langId 言語ID
	 */
	public changeLanguage(langId: string): Observable<EIMUser> {
		const params: any = {
			langId,
		};
		return this.httpService.postForForm('/admin/session/actLanguageChange.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.user.attr);
			}));
	}

	/**
	 * ログイン言語DTOを変換します.
	 * @param json 変換対象
	 * @return 変換結果
	 */
	private convertToEIMLanguage(json: any): EIMLanguageDTO {
		let nameList = [];
		if (json.namelist.item instanceof Array) {
		for (let i = 0; i < json.namelist.item.length; i++) {
			let item = json.namelist.item[i];
			nameList.push({lang: item.lang._text, value: item.name._text});
			}
		} else {
			nameList.push({lang: json.namelist.item.lang._text, value: json.namelist.item.name._text})
		}
		return {
			name: json.label._text,
			langId: json.data._text,
			nameList: nameList
		}
	}

	/**
	 * 権限情報リスト
	 * @param json
	 */
	private convertToEIMAuth(jsonAuth: any): EIMAuth {
		let nameList: { [key: string]: string; } = {};
		for (let nameIdx in jsonAuth.nameList.name) {
			if (nameIdx) {
				let aName = jsonAuth.nameList.name[nameIdx];
				nameList[aName.attr.lang] = aName.attr.langname;
			}
		}
		return {
			authId: jsonAuth.attr.id,
			authValue: Number(jsonAuth.attr.value),
			nameList: nameList,
		};
	}

	/**
	 * 管理種別権限情報リスト
	 * @param json
	 * @return 管理者権限
	 */
	private convertToEIMAuthListApplication(jsonAuthListApplication: any): EIMAuthListApplication {
		let authArray: EIMAuth[] = [];
		if (jsonAuthListApplication.auth.length) {
			// auth が複数件ある場合
			for (let idx in jsonAuthListApplication.auth) {
				if (idx) {
					authArray.push(this.convertToEIMAuth(jsonAuthListApplication.auth[idx]));
				}
			}
		} else {
			// auth が単数の場合
			authArray.push(this.convertToEIMAuth(jsonAuthListApplication.auth));
		}
		return {
			applicationId: jsonAuthListApplication.attr.id,
			authArray: authArray,
		};
	}

	/**
	 * システム管理者タイプ情報のコンバート
	 * @param json
	 * @return
	 */
	private convertToEIMAdminType(jsonAdminType: any): EIMAdminType {
		// 管理者タイプ名のラベル
		let nameList: { [key: string]: string; } = {};
		for (let nameIdx in jsonAdminType.nameList.name) {
			if (nameIdx) {
				let aName = jsonAdminType.nameList.name[nameIdx];
				nameList[aName.attr.lang] = aName.attr.langname;
			}
		}
		// チェックを入れる管理権限
		let authorityList: { [key: string]: string; } = {};
		for (let authorityIdx in jsonAdminType.authorityList.authority) {
			if (authorityIdx) {
				let aAuthority = jsonAdminType.authorityList.authority[authorityIdx];
				authorityList[aAuthority.attr.id] = aAuthority.attr.enable;
			}
		}
		return {
			nameList: nameList,
			authorityList: authorityList,
		};
	}

	/**
	 * 管理者権限の対応リスト
	 * @param json
	 */
	private convertToEIMAdminTypeListApplication(jsonAdminTypeListApplication: any): EIMAdminTypeListApplication {
		let adminTypeArray: EIMAdminType[] = [];
		if (jsonAdminTypeListApplication.adminType.length) {
			// adminType （システム管理者の種類）が複数件ある場合
			for (let idx in jsonAdminTypeListApplication.adminType) {
				if (idx) {
					adminTypeArray.push(this.convertToEIMAdminType(jsonAdminTypeListApplication.adminType[idx]));
				}
			}
		} else {
			// adminType （システム管理者の種類）が単数の場合
			adminTypeArray.push(this.convertToEIMAdminType(jsonAdminTypeListApplication.adminType));
		}
		return {
			applicationId: jsonAdminTypeListApplication.attr.id,
			adminTypeArray: adminTypeArray,
		};
	}

	private hoge(): boolean {
		return true;
	}

	/**
	 * 管理者権限情報のコンバート
	 * @param jsonAdminAuth
	 * @return JSONからコンバートした管理者権限情報
	 */
	private convertToEIMAdminAuth(jsonAdminAuth: any): EIMAdminAuth {

		// システム管理種別毎で表示するチェックボックスの定義
		let jsonAuthListApplication = jsonAdminAuth.authList.application;
		let authListApplicationArray: EIMAuthListApplication[] = [];
		if (jsonAuthListApplication.length) {
			// authList.application が複数ある場合
			for (let idx in jsonAuthListApplication) {
				if (idx) {
					authListApplicationArray.push(this.convertToEIMAuthListApplication(jsonAuthListApplication[idx]));
				}
			}
		} else {
			// authList.application が単数の場合
			authListApplicationArray.push(this.convertToEIMAuthListApplication(jsonAuthListApplication));
		}

		// システム管理者タイプ⇔チェックされる管理者権限の対応表
		let jsonAdminTypeListApplications = jsonAdminAuth.adminTypeList.application;
		let adminTypeListApplicationArray: EIMAdminTypeListApplication[] = [];
		if (jsonAdminTypeListApplications.length) {
			// adminTypeList.application が複数件ある場合
			for (let idx in jsonAdminTypeListApplications) {
				if (idx) {
					adminTypeListApplicationArray.push(this.convertToEIMAdminTypeListApplication(jsonAdminTypeListApplications[idx]));
				}
			}
		} else {
			// adminTypeList.application が単数の場合
			adminTypeListApplicationArray.push(this.convertToEIMAdminTypeListApplication(jsonAdminTypeListApplications));
		}

		return {
			adminTypeListApplicationArray: adminTypeListApplicationArray,
			authListApplicationArray: authListApplicationArray,
		}
	}

}
