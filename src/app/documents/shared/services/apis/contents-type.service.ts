import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMContentsTypeDomain } from 'app/documents/shared/domains/contents-type.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

export interface EIMDocumentType {
	objTypeId: number,
	objTypeName: string,
}

/**
 * コンテンツタイプAPIサービス
 */
@Injectable()
export class EIMContentsTypeService {

	/**
	 * 帳票タイプサービス.
	 */
	constructor(
		private httpService: EIMDocumentsHttpService,
		private jsonService: EIMJSONService) {}

	/**
	 * 帳票タイプを取得します.
	 * @param id ドキュメントタイプID
	 * @param parentId 親ID
	 * @return 帳票タイプ
	 */
	public getByIdAndParent(id: number, parentId: number): Observable<EIMContentsTypeDomain> {
		return this.httpService.get('/rest/documentformtype/getByIdAndParent.mvc', {id: id, parentId: parentId})
			.pipe(mergeMap((res: any) => {
				return of(new EIMContentsTypeDomain(res.value));
			}));
	}

}
