import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMObjectMasterDTO } from 'app/shared/dtos/object-master.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * オブジェクトマスタAPIサービス
 */
@Injectable()
export class EIMObjectMasterService {

  /**
   * コンストラクタです.
   */
	constructor(
  		private domainService: EIMDomainService,
			private httpService: EIMHttpService,
			private jsonService: EIMJSONService) {}

  public getList(criteria: any): Observable<EIMObjectMasterDTO[]> {
    return this.httpService.post('/rest/objectMaster/getList.mvc', criteria)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMObjectMasterDTO(_json);
					}));

		}));
}
}
