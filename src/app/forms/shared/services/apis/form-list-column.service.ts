import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

//import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

@Injectable()
export class EIMFormListColumnService {

	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
	) {
	}


	/**
	 * 表示列情報を含む帳票タイプを取得します.
	 */
	public getByFormType(id:number, displayProgressDialog: boolean = true):Observable<EIMFormTypeDomain> {
		return this.httpService.post('/rest/formListColumn/getByFormType.mvc', {id: id}, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormTypeDomain(res.value));
		}));
	}
	
}
