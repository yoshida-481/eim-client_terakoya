import { EIMDocumentsEntryService } from './../../../../documents/shared/services/apis/documents-entry.service';
import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';



/**
 * ドキュメントAPIサービス
 */
@Injectable()
export class EIMAdminsDocumentFormService extends EIMDocumentFormService {

	/**
	 * ドキュメント(帳票)サービス.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected entryService: EIMDocumentsEntryService,
		protected domainService: EIMDomainService,
	) {
		super(httpService, jsonService, entryService, domainService);
	}

	/**
	 * ドキュメント(帳票)を取得します.
	 * @param id ドキュメント(帳票)ID
	 * @return ドキュメント(帳票)
	 */
	public getDocumentById(id: number): Observable<EIMContentsDomain> {
		return this.httpService.get('/rest/admin/form-workspace/getByIdAdmin.mvc', {id: id})
			.pipe(mergeMap((res: any) => {
				return of(new EIMContentsDomain(res.value));
			}));
	}

	/**
	 * 属性情報(Property)を取得します.
	 */
	public getObjectProperty(id: number): Observable<any> {
		return this.httpService.get('/admin/object/dspProperty.jsp', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(res.value.object.attr);
			}));
	}
}
