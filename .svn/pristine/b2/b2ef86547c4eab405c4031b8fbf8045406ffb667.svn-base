import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';

import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMHttpForRestAPIService } from '../http-for-rest-api.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';

/**
 * リレーション登録APIのパラメータ
 */
export class EIMRelationAPIServiceCreateParam {
	/** アダプタのBeanId */
	adapterId?: String = null;
	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToRelationDomainConverterId?: String = null;
	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'formFormatResultDTOConverter' = null;
	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: String = null;

	/** 登録対象のDTO */
	dto: any = null;
}

/**
 * リレーション取得APIのパラメータ
 */
export class EIMRelationAPIServiceGetParam {
	/** アダプタのBeanId */
	adapterId?: String = null;
	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'formFormatResultDTOConverter' = null;
	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: string = null;

	/** 取得対象のオブジェクトID */
	id: number = null;
	/** 返却属性タイプ定義名称パスリスト */
	resultAttributeTypeDefinitionNamePaths?: string[][];

}

/**
 * リレーション更新APIのパラメータ
 */
export class EIMRelationAPIServiceUpdateParam {
	/** アダプタのBeanId */
	adapterId?: String = null;
	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToRelationDomainConverterId?: String = null;
	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'formFormatResultDTOConverter' = null;
	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: String = null;

	/** 更新対象のDTO */
	dto: any = null;
}

/**
 * リレーション削除APIのパラメータ
 */
export class EIMRelationAPIServiceDeleteParam {
	/** アダプタのBeanId */
	adapterId?: String = null;
	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToRelationDomainConverterId?: String = null;
	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: String = null;

	/** 削除対象のDTO */
	dto: any = null;
}

/**
 * リレーションAPIサービス
 */
@Injectable()
export class EIMRelationAPIService {

	/**
	 * コンストラクタです.
	 * @param httpService
	 * @param jsonService
	 * @param translateService
	 */
	constructor(
		protected httpService: EIMHttpForRestAPIService,
		protected jsonService: EIMJSONService,
		protected translateService: TranslateService
	) { }

	/**
	 * リレーション情報を登録します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return リレーション情報のObservable
	 */
	public create(params: EIMRelationAPIServiceCreateParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		params.dto = this.filterNullAttribute(params.dto);

		return this.httpService.postJson('/apis/relations', params, 
				displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * リレーション情報を取得します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return リレーション情報のObservable
	 */
	public get(params: EIMRelationAPIServiceGetParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let reqParams = JSON.parse(JSON.stringify(params));
		delete reqParams.id;
		return this.httpService.get('/apis/relations/' + params.id, reqParams, 
				displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * リレーション情報を更新します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return リレーション情報のObservable
	 */
	public update(params: EIMRelationAPIServiceUpdateParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		params.dto = this.filterNullAttribute(params.dto);

		return this.httpService.putJson('/apis/relations/' + params.dto.id, params, 
				displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * リレーション情報を削除します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return 空のObservable
	 */
	public delete(params: EIMRelationAPIServiceDeleteParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<null> {

		return this.httpService.delete('/apis/relations/' + params.dto.id, params, 
				displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(null);
			}));
	}

	/**
	 * 空の属性値を除去します.
	 *
	 * @param dto 除去する対象のDTO
	 */
	protected filterNullAttribute(dto: any): any {

		if (dto.attributeMap) {
			return this.filterNullAttributeForSimpleObjectDTO(dto);
		}

		return dto;
	}

	protected filterNullAttributeForSimpleObjectDTO(_dto: EIMSimpleObjectDTO): EIMSimpleObjectDTO {

		// clone
		let dto = {..._dto};
		dto.attributeMap = {..._dto.attributeMap}

		Object.keys(dto.attributeMap).map((key) => {
				let attribute = dto.attributeMap[key];

				attribute.values = attribute.values.filter(v => v !== '');
		});

		return dto;
	}
}
