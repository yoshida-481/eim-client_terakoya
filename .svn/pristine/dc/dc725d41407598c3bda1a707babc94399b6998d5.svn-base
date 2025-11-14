import { EIMFormCriteria } from '../../../../shared/domains/criteria/form.criteria';
import { EIMAttributeTypeDomain } from '../../../../shared/domains/entity/attribute-type.domain';
import { EIMAttributeTypeDTO } from '../../../../shared/dtos/attribute-type.dto';
import { EIMHttpService } from '../../../../shared/services/http.service';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


@Injectable()
export class EIMFormCsvDownloadService {

	/**
	 * コンストラクタです.
	 * @param httpService HTTPサービス
	 */
	constructor(
		protected httpService: EIMHttpService,
	) {
	}

	/**
	 * 属性タイプリストを取得します.
	 * @param objectTypeDefinitionName オブジェクトタイプ定義名称
	 * @return 属性タイプリスト
	 */
	public getAttributeTypeList(objectTypeDefinitionName: string): Observable<EIMAttributeTypeDTO[]> {
		return this.httpService.get('/rest/formCsvDownload/getAttributeTypeList.mvc', {objTypeDefName: objectTypeDefinitionName})
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * CSVファイルを生成します.
	 * @param criteria 検索条件
	 * @param attributeTypeList ダウンロード対象属性タイプリスト
	 * @return CSVファイルパス
	 */
	public createCsvFile(criteria: EIMFormCriteria, attributeTypeList: EIMAttributeTypeLayoutDomain[]): Observable<any> {
		return this.httpService.post('/rest/formCsvDownload/createCsvFile.mvc', {criteria: criteria, attribtueTypeLayoutList: attributeTypeList})
		.pipe(mergeMap((res: any) => {
			return of(res.value.filePath);
		}));
	}
}
