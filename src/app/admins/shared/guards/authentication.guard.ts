import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EIMAdminsAuthenticationService } from 'app/admins/shared/services/apis/authentication.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * システム管理認証ガード
 */
@Injectable()
export class EIMAdminAuthenticationGuard  {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected router: Router,
		protected sessionStorageService: EIMSessionStorageService,
		protected httpService: EIMHttpService,
		protected authenticationService: EIMAdminsAuthenticationService,
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		this.sessionStorageService.removeItem(EIMConstantService.SESSIONSTORAGE_SUBSYSTEM_NAME,
			EIMConstantService.SESSIONSTORAGE_KEY_SSO);

		// システム管理はSSOログイン不可
		// SSOログインした場合、セッションにADMIN_APP_IDがないのでエラーが返却される
		return this.httpService.postForForm('/admin/session/actLoginCheck.jsp', {}, false, false)
			.pipe(
				// 成功した場合(通常ログイン後)はメイン画面に遷移させる
				map(_ => true),
				// エラーが発生した場合はログイン画面に遷移させる
				catchError(() => {
					this.router.navigate([this.authenticationService.getLoginUrl()], { queryParams: route.queryParams });
					return of(false);
				}));
	}

}
