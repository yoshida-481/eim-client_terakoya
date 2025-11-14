import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EIMFormAuthenticationService } from 'app/forms/shared/services/apis/authentication.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';
import { EIMAuthenticationGuard, EIMLoginCheckResult } from 'app/shared/guards/authentication.guard';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * ログインチェックパラメータ
 */
interface EIMFormLoginCheckParams {
	/** 言語ID */
	langId?: string;
	/** noSsoが指定されている場合true */
	noSso: boolean;
}

/**
 * 帳票管理用認証ガード
 */
@Injectable()
export class EIMFormAuthenticationGuard extends EIMAuthenticationGuard<EIMLoginCheckResult> {

	constructor(
		protected router: Router,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected sessionStorageService: EIMSessionStorageService,
		protected httpService: EIMHttpService,
		protected authenticationService: EIMFormAuthenticationService,
		protected cacheService: EIMFormsCacheService,
	) {
		super(router, translateService, localStorageService, sessionStorageService, authenticationService);
	}

	protected checkLogin(): Observable<EIMLoginCheckResult> {
		// クライアント側で保持している言語IDを渡す
		const langId = this.localStorageService.getLangId();

		// クエリ中のnoSsoパラメータ
		const noSso = this.isNoSso();

		const params: EIMFormLoginCheckParams = {
			langId,
			noSso,
		};

		return this.httpService.post('/rest/authenticate/checkLogin.mvc', params, false, false)
			.pipe(map(res => res.value));
	}

	protected additionalCheckLogin(res: EIMLoginCheckResult) {
		// キャッシュにユーザ情報を設定
		this.cacheService.setLoginUser(res.user);
	}

}
