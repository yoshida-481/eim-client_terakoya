import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMFormEventDTO } from 'app/shared/dtos/form-event.dto';
import { EIMFormEventDomain } from 'app/shared/domains/form-event.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * 帳票イベントAPIのサービスです.
 */
@Injectable()
export class EIMFormEventService {

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
	public getList(criteria): Observable<EIMFormEventDTO[]> {
		return this.httpService.post('/rest/formEvent/getList.mvc', criteria)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value, (json:any) => {return new EIMFormEventDTO(json);}));
		}));
	}
	/**
	 * 前回の帳票イベントを取得します.
	 */
	public getLatestByForm(form: EIMFormDomain, displayProgressDialog: boolean = true): Observable<EIMFormEventDomain> {
		return this.httpService.post('/rest/formEvent/getLatestByForm.mvc', form, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormEventDomain(res.value));
		}));
	}

	/**
	 * 前回の帳票イベントを取得します.
	 */
	public getPreviousByForm(criteria): Observable<EIMFormEventDomain> {
		return this.httpService.post('/rest/formEvent/getPreviousByForm.mvc', criteria)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFormEventDomain(res.value));
		}));
	}
}

