import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';


import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFileObjectCreatorDomain } from 'app/shared/domains/file-object-creator.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { EIMFileObjectCreatorService } from 'app/shared/services/apis/file-object-creator.service';
import { EIMHttpService } from 'app/shared/services/http.service';

/**
 * タスク用のファイルオブジェクト登録APIサービス
 * 文書管理のAPサーバのエンドポイントを呼び出さないよう、EIMHttpServiceの代わりにEIMHttpForRestAPIServiceを使用しています.
 */
@Injectable()
export class EIMTaskFileObjectCreatorService extends EIMFileObjectCreatorService {

	constructor(
  		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
  		protected httpForRestAPIService: EIMHttpForRestAPIService,
  		protected jsonService: EIMJSONService) {

		super(domainService, httpService, jsonService);
	}

	/**
	 * 一時ファイルオブジェクトを登録します.
	 */
	public create(fileObjectCreator: EIMFileObjectCreatorDomain): Observable<EIMFileObjectCreatorDomain> {
    return this.httpForRestAPIService.postJson('/rest/fileObjectCreator/create.mvc', fileObjectCreator)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFileObjectCreatorDomain(res.value));
		}));
	}

	/**
	 * 一時ファイルオブジェクトを複製します.
	 */
	public copy(fileObjectCreator: EIMFileObjectCreatorDomain): Observable<EIMFileObjectCreatorDomain[]> {
    return this.httpForRestAPIService.postJson('/rest/fileObjectCreator/copy.mvc', fileObjectCreator)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMFileObjectCreatorDomain(_json);
					}));
		}));
	}

	/**
	 * 一時ファイルオブジェクトを削除します.
	 */
	public delete(fileObjectCreator: EIMFileObjectCreatorDomain): Observable<null> {
    return this.httpForRestAPIService.postJson('/rest/fileObjectCreator/delete.mvc', fileObjectCreator);
	}
}
