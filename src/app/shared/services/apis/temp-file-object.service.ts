import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMTempFileObjectDomain } from 'app/shared/domains/temp-file-object.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * 添付ファイルオブジェクトAPIサービス
 */
@Injectable()
export class EIMTempFileObjectService {

	constructor(
			private domainService: EIMDomainService,
			private httpService: EIMHttpService,
			private jsonService: EIMJSONService) {}

	/**
	 * 一時ファイルを登録します.
	 */
	public create(dto: EIMTempFileObjectDomain): Observable<EIMObjectDomain> {
    return this.httpService.post('/rest/tempFileObject/create.mvc', dto)
		.pipe(mergeMap((res: any) => {
			return of(new EIMObjectDomain(res.value));
		}));
	}
}
