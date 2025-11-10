import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMUserCriteriaDTO } from 'app/shared/dtos/criteria/user-criteria.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * ユーザAPIサービス
 */
@Injectable()
export class EIMUserService {

	/** 検索タイプ:キーワード検索 */
	public static USER_SERVICE_SEARCH_TYPE_KEYWORD = 'keyword';
	/** 検索タイプ:ユーザID、名前検索 */
	public static USER_SERVICE_SEARCH_TYPE_ID_AND_NAME = 'idAndName';

	/** 検索タイプ */
	public searchType = EIMUserService.USER_SERVICE_SEARCH_TYPE_ID_AND_NAME;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected domainService: EIMDomainService,
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService) {}

	/**
	 * ユーザを検索します.
	 * @param criteria 検索条件
	 * @return ユーザ一覧
	 */
	public searchUser(criteria: EIMUserCriteriaDTO): Observable<EIMUserDTO[]> {
		return this.httpService.post('/rest/user/getList.mvc', criteria)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMUserDTO(_json);
					}));
		}));
	}

	/**
	 * キーワードでユーザを検索します.
	 * 未実装です.継承先で実装してください.
	 * @param keyword 検索キーワード
	 * @param disableUserFilter 無効ユーザ絞り込み有無（true/false)
	 * @param systemUserFilter systemユーザ絞り込み有無（true/false)
	 * @param parentObjId 親フォルダのID（親フォルダのセキュリティで絞る場合に指定）
	 * @return ユーザリスト
	 */
  public searchUserByKeyword(keyword: string, disableUserFilter = true, systemUserFilter = true, parentObjId?: number): Observable<EIMUserDTO[]> {
		return new Observable();
	}
}
