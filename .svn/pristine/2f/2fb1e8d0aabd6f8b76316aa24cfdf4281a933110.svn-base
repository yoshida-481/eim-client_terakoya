import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * 属性タイプAPIサービス
 */
@Injectable()
export class EIMAttributeTypeService {


	/**
	 * コンストラクタです.
	 */
	constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected domainService: EIMDomainService) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性タイプのリストを取得します.
	 * @return 属性タイプのリスト
	 */
	public getList(objTypeId: number, relationViewFlag?: boolean): Observable<EIMAttributeTypeDTO[]> {
		let params: any = {};
		params['objTypeId'] = objTypeId;

	    return this.httpService.postForForm('/admin/object/dspAttributeType.jsp', params, relationViewFlag)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.attTypes.attType,
					(_json: any) => {
						return  new EIMAttributeTypeDTO(_json);
					}));
		}));
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性タイプ並べ替えを登録します.
	 * @param attTypeIdList 属性タイプIDリスト
	 * @return 並べ替え結果
	 */
	public sortAttribute(attTypeIdList: any[], objTypeId: number): Observable<any> {
		if (!attTypeIdList) {
			return;
		}
		let params: any = {attTypeId: attTypeIdList, objTypeId: objTypeId};
	    return this.httpService.postForForm('/admin/object/actSortAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}

}
