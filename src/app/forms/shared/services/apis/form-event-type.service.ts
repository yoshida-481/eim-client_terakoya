import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMFormEventDTO } from 'app/shared/dtos/form-event.dto';
import { EIMFormEventDomain } from 'app/shared/domains/form-event.domain';
import { EIMFormEventTypeDomain } from "app/shared/domains/form-event-type.domain";
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * 帳票イベントAPIのサービスです.
 */
@Injectable()
export class EIMFormEventTypeService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
	) {
	}

	/**
	 * 帳票イベント一覧を取得します.
	 */
	public forcastEventType(criteria): Observable<EIMFormEventTypeDomain> {
		return this.httpService.post('/rest/formEventType/forecastEventType.mvc', criteria)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormEventTypeDomain(res.value));
		}));
	}
}

