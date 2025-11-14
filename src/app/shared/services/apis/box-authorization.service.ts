import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMBoxUserDomain } from 'app/shared/domains/box-user.domain';

/**
 * Box認可サービス
 */
@Injectable()
export class EIMBoxAuthorizationService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
		protected serverConfigService: EIMServerConfigService,
	) {
	}

	/**
	 * 企業アカウントを使用します.
	 * @return 企業アカウントのユーザ情報
	 */
	useEnterpriseAccount(): Observable<void> {
		return this.httpService.post('/rest/box/authorization/useEnterpriseAccount.mvc');
	}

	/**
	 * Boxログインユーザ情報を取得します.
	 * @param displayProgressDialog 進捗ダイアログを表示する場合true
	 * @param displayErrorDialog エラーダイアログを表示する場合true
	 * @return Boxログインユーザ情報
	 */
	getLoginUser(displayProgressDialog = true, displayErrorDialog = true): Observable<EIMBoxUserDomain> {
		return this.httpService.get('/rest/box/authorization/login-user.mvc', undefined, displayProgressDialog, displayErrorDialog)
			.pipe(
				map(res => {
					const user = this.domainService.createObject(res.value, json => new EIMBoxUserDomain(json));
					return user;
				}),
			);
	}

}
