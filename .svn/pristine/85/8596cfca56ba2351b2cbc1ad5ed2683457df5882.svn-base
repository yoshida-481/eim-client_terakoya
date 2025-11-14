import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFileObjectCreatorService } from 'app/shared/services/apis/file-object-creator.service';
import { EIMFileObjectCreatorDomain } from 'app/shared/domains/file-object-creator.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

/**
 * ドキュメントファイルオブジェクト登録APIサービス
 */
@Injectable()
export class EIMDocumentFileObjectCreatorService extends EIMFileObjectCreatorService {

  constructor(
			protected domainService: EIMDomainService,
			protected httpService: EIMDocumentsHttpService,
			protected jsonService: EIMJSONService) {

  	super(domainService, httpService, jsonService);
  }

	/**
	 * 一時ファイルオブジェクトを複製します.
	 */
	public copy(dto: EIMFileObjectCreatorDomain): Observable<EIMFileObjectCreatorDomain[]> {
    return this.httpService.post('/rest/fileObjectCreator/copy.mvc', dto)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMFileObjectCreatorDomain(_json);
					}));
		}));
	}
}
