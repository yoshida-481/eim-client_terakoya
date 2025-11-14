import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMContentsTypeDomain } from 'app/documents/shared/domains/contents-type.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';

export interface EIMDocumentType {
	objTypeId: number,
	objTypeName: string,
}

/**
 * サムネイルAPIサービス
 */
@Injectable()
export class EIMThumbnailService {

	/**
	 * サムネイルサービス.
	 */
	constructor(
		private httpService: EIMHttpService,
		private jsonService: EIMJSONService) {}

	/**
	 * サムネイルを取得します.
	 * @param id ドキュメントタイプID
	 * @return サムネイル
	 */
	public getImage(id: number): Observable<String> {
		return this.httpService.get('/rest/thumbnailpreview/getImage.mvc', {id: id}, false)
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}
	));
	}

	/**
	 * サムネイルを取得します.
	 * @param id ドキュメントタイプID
	 * @return サムネイル
	 */
	public checkExistsPdf(id: number): Observable<String> {
		return this.httpService.get('/rest/thumbnailpreview/checkExistsPdf.mvc', {id: id})
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}
	));
	}

}
