import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMLoginCheckResult, EIMAuthenticationGuard } from 'app/shared/guards/authentication.guard';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EIMDocumentAuthenticationService } from '../services/apis/authentication.service';
import { EIMDocumentsCacheService } from '../services/documents-cache.service';
import { EIMDocumentsHttpService } from '../services/documents-http.service';

/**
 * ログインチェックパラメータ
 */
interface EIMDocumentLoginCheckParams {
	/** 言語ID */
	langId?: string;
	/** クライアントタイムゾーンオフセット */
	userTzOffset: number;
	/** noSsoが指定されている場合true */
	noSso: boolean;
}

/**
 * ドキュメント管理用認証ガード
 */
@Injectable()
export class EIMDocumentAuthenticationGuard extends EIMAuthenticationGuard<EIMLoginCheckResult> {

	constructor(
		protected router: Router,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected sessionStorageService: EIMSessionStorageService,
		protected httpService: EIMDocumentsHttpService,
		protected authenticationService: EIMDocumentAuthenticationService,
		protected cacheService: EIMDocumentsCacheService,
	) {
		super(router, translateService, localStorageService, sessionStorageService, authenticationService);
	}

	protected checkLogin(): Observable<EIMLoginCheckResult> {
		// ローカルストレージで保持している言語IDがあれば渡す
		const clientLangId = this.localStorageService.getLangId();

		// セッションに設定するuserTzOffsetを渡す
		const clientTzOffset = new Date().getTimezoneOffset() * 60 * 1000;

		// クエリ中のnoSsoパラメータ
		const noSso = super.isNoSso();

		const params: EIMDocumentLoginCheckParams = {
			langId: clientLangId,
			userTzOffset: clientTzOffset,
			noSso,
		};

		return this.httpService.postForForm('/app/document/session/actLoginCheck.jsp', params, false, false)
			.pipe(map(res => {
				const { attr: { sso, internalAuth, langId, updateLang }, user } = res.value.result;

				const loginUser = new EIMUserDomain();
				loginUser.id = Number(user.attr.userId);
				loginUser.name = String(user.attr.userName);
				loginUser.code = String(user.attr.userCode);
				loginUser.kana = String(user.attr.userKana);
				loginUser.mail = String(user.attr.userMail);
				loginUser.admin = Number(user.attr.userAdmin);

				const result: EIMLoginCheckResult = {
 					sso: sso === 'true',
					internalAuth: internalAuth === 'true',
					user: loginUser,
					langId: String(langId),
					updateLang: updateLang === 'true',
				};

				return result;
			}));
	}

	protected additionalCheckLogin(res: EIMLoginCheckResult) {
		// キャッシュにユーザ情報を設定
		this.cacheService.setLoginUser(res.user);
	}

}
