import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

export interface EIMDocumentType {
	objTypeId: number,
	objTypeName: string,
}

/**
 * 帳票タイプAPIサービス
 */
@Injectable()
export class EIMFormTypeService {

	/**
	 * 帳票タイプサービス.
	 */
	constructor(
		public domainService: EIMDomainService,
		public httpService: EIMHttpService,
		public jsonService: EIMJSONService) {}

	/**
	 * 帳票タイプを取得します.
	 * @param id 帳票タイプID
	 * @param parentId 親ID
	 * @return 帳票タイプ
	 */
	public getById(id:number):Observable<EIMFormTypeDomain> {
		return this.httpService.get('/rest/formType/getById.mvc', {id: id})
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormTypeDomain(res.value));
			}));
	}

		/**
	 * 帳票タイプ一覧を取得します.
	 */
	public getList(criteria):Observable<EIMFormTypeDTO[]> {
		return this.httpService.post('/rest/formType/getList.mvc', criteria)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value, (json:any) => {return new EIMFormTypeDTO(json);}));
		}));
	}

}
