import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFormDTO } from 'app/shared/dtos/form.dto';
import { EIMAttributeDTO } from 'app/shared/dtos/attribute.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

@Injectable()
export class EIMFormSearchService {

	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
	) {
	}


	/**
	 * 帳票を検索します.
	 */
	public search(criteria, displayProgressDialog = true): Observable<EIMFormDTO[]> {
		return this.httpService.post('/rest/form/search.mvc', criteria, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			let data: any[] = this.domainService.createObjectList(res.value, (json: any) => {return new EIMFormDTO(json); });
			return of(this.copyListToProperty(data));
		}));
	}

	public copyListToProperty(srcList: any[]): any[] {
		let targetList: any[] = [];

		for (let i = 0; i < srcList.length; i++) {
			let target: any = {};
			let src: any = srcList[i];
			Object.assign(target, src);
			for (let j = 0; j < src.attributeList.length; j++) {
				let attribute: EIMAttributeDTO = src.attributeList[j];
				target['attType_' + attribute.attributeType.id] = attribute;
			}
			targetList.push(target);
		}

		return targetList;
	}

}

