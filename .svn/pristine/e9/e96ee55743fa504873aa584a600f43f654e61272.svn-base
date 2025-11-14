import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

export interface EIMAttrType {
	attTypeId?: number,
	attTypeName?: string,
	valTypeName?: string,
	attValTypeId?: number,
}

/**
 * 属性タイプAPIサービス
 */
@Injectable()
export class EIMAttributeTypeService {

	constructor(
			private httpService: EIMDocumentsHttpService,
			private jsonService: EIMJSONService) {}

	/**
	 * 属性タイプリストを取得します.
	 */
	public getListByName(name: string): Observable<EIMAttrType[]> {
		return this.httpService.postForForm('/app/document/table/dspAttributeTypeList.jsp',
				{attTypeName: name})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.attTypes.attType, this.convertToEIMAttrType));
			}));
	}

	private convertToEIMAttrType(json: any): EIMAttrType {
		return {
			attTypeId: Number(json.attr.attTypeId),
			attTypeName: json.attr.attTypeName,
			valTypeName: json.attr.valTypeName,
			attValTypeId: Number(json.attr.attValTypeId),
		}
	}
}
