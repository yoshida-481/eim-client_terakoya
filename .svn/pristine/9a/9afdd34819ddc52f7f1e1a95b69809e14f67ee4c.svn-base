import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { mergeMap } from 'rxjs/operators';
import { EIMDomainService } from '../domain.service';
import { EIMMembersDomain } from 'app/shared/domains/entity/members.domain';

/**
 * メンバーズサービスサービスクラスです.
 */
@Injectable()
export class EIMMembersService {

	constructor(
		protected jsonService: EIMJSONService,
		protected httpForRestAPIService: EIMHttpForRestAPIService,
		protected domainService: EIMDomainService
	) {
	}

	/**
	 * メンバーズを更新します.
	 * @param members メンバーズ情報
	 */
	public update(members: EIMMembersDomain) {

		return this.httpForRestAPIService.putJson('/apis/members', members, true, true)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクトIDをキーにメンバーズを取得します.
	 * @param オブジェクトID
	 * @return メンバーズ情報
	 */
	public getByObjectId(id: number): Observable<EIMMembersDomain> {

		return this.httpForRestAPIService.get('/apis/members/object/' + id, {}, true, true)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

}
