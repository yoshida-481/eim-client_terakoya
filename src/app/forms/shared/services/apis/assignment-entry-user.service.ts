import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

//import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMUserDTO } from "app/shared/dtos/user.dto";
import { EIMUserDomain } from "app/shared/domains/entity/user.domain";
import { EIMEntryUserDTO } from "app/shared/dtos/entry-user.dto";
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

@Injectable()
export class EIMAssignmentEntryUserService {

	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
	) {
	}


	/**
	 * 指定された条件に合致する帳票ワークスペース参加ユーザを取得します.
	 */
	public getList(criteria, displayProgressDialog: boolean = true):Observable<EIMEntryUserDTO[]> {
		return this.httpService.post('/rest/assignmentEntryUser/getList.mvc', criteria, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMEntryUserDTO(_json);
					}));
		}));
	}
}