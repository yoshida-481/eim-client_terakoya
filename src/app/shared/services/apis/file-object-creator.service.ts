import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFileObjectCreatorDomain } from 'app/shared/domains/file-object-creator.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * ファイルオブジェクト登録APIサービス
 */
@Injectable()
export class EIMFileObjectCreatorService {

  constructor(
  		protected domainService: EIMDomainService,
  		protected httpService: EIMHttpService,
  		protected jsonService: EIMJSONService) {}

	/**
	 * 一時ファイルオブジェクトを登録します.
	 */
	public create(fileObjectCreator: EIMFileObjectCreatorDomain): Observable<EIMFileObjectCreatorDomain> {
    return this.httpService.post('/rest/fileObjectCreator/create.mvc', fileObjectCreator)
		.pipe(mergeMap((res: any) => {
			return of(new EIMFileObjectCreatorDomain(res.value));
		}));
	}

	/**
	 * 一時ファイルオブジェクトを複製します.
	 */
	public copy(fileObjectCreator: EIMFileObjectCreatorDomain): Observable<EIMFileObjectCreatorDomain[]> {
    return this.httpService.post('/rest/fileObjectCreator/copy.mvc', fileObjectCreator)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMFileObjectCreatorDomain(_json);
					}));
		}));
	}

	/**
	 * 一時ファイルオブジェクトを削除します.
	 */
	public delete(fileObjectCreator: EIMFileObjectCreatorDomain): Observable<null> {
    return this.httpService.post('/rest/fileObjectCreator/delete.mvc', fileObjectCreator);
	}
}
