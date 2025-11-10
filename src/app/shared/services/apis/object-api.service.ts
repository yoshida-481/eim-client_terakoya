import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';

import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMSimpleSearchObjectCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-object.criteria';
import { EIMSimpleSearchRelatedObjectCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-related-object.criteria';
import { EIMHttpForRestAPIService } from '../http-for-rest-api.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';

/**
 * オブジェクト登録APIのパラメータ
 */
export class EIMObjectAPIServiceCreateParam {

	/** 登録対象のDTO */
	dto: any = null;

	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToObjectDomainConverterId?: String = null;

	/** フォーマット定義名称（ファイル登録時に使用） */
	formatDefinitionName?: String = null;

	/** 親オブジェクトID */
	parentObjectId?: number = null;

	/** 登録するファイル */
	file?: File = null;

	/** アダプタのBeanId */
	adapterId?: String = null;

	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'formFormatResultDTOConverter' = null;

	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: String = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクト一括登録APIのパラメータ
 */
export class EIMObjectAPIServiceCreateListParam {

	/** 登録対象のDTOリスト */
	dtos: any[] = null;

	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToObjectDomainConverterId?: String = null;

	/** フォーマット定義名称（ファイル登録時に使用） */
	formatDefinitionName?: String = null;

	/** 親オブジェクトID */
	parentObjectId?: number = null;

	/** 登録するファイルリスト */
	files?: File[] = null;

	/** アダプタのBeanId */
	adapterId?: String = null;

	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'listFormatResultDTOConverter' | 'treeFormatResultDTOConverter' = null;

	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: String = null;

	/** パラメータ */
	exParameter?: object = null;

}

/**
 * オブジェクト取得APIのパラメータ
 */
export class EIMObjectAPIServiceGetParam {

	/** 取得対象のオブジェクトID */
	id: number = null;

	/** 返却属性タイプ定義名称パスリスト */
	resultAttributeTypeDefinitionNamePaths?: string[][];

	/** 取得対象のオブジェクト型属性の参照階層 */
	refObjectExpansionLevel?: number = 0;
	
	/** アダプタのBeanId */
	adapterId?: String = null;

	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'formFormatResultDTOConverter' = null;

	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: string = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクト一括取得APIのパラメータ
 */
export class EIMObjectAPIServiceGetListParam {

	/** オブジェクト取得条件 */
	objectCriteria: EIMSimpleSearchObjectCriteria = null;

	/** 関連先のオブジェクト取得条件 */
	relatedObjectCriterias?: EIMSimpleSearchRelatedObjectCriteria[] = null;

	/** 関連先のオブジェクト取得条件の繰り返し回数 */
	repeatRelatedObjectCriteriasNum? = 1;

	/** アダプタのBeanId */
	adapterId?: string = null;

	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'listFormatResultDTOConverter' | 'treeFormatResultDTOConverter' = null;

	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: string = null;

	/** コンパレータのBeanId（取得結果のソート用） */
	comparatorIds?: string[] = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクト更新APIのパラメータ
 */
export class EIMObjectAPIServiceUpdateParam {

	/** 更新対象のDTO */
	dto: any = null;

	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToObjectDomainConverterId?: String = null;

	/** フォーマット定義名称（ファイル更新時に使用） */
	formatDefinitionName?: String = null;

	/** 更新するファイル */
	file?: File = null;

	/** 更新属性タイプ定義名称パスリスト */
	updateAttributeTypeDefinitionNamePaths?: string[][];

	/** オブジェクトのプロパティを更新した時、EIMOBJテーブルの更新日/更新者を更新するかどうか */
	isUpdateModificationInfo?: boolean = null;

	/** 更新後のオブジェクト情報を返却するかどうか */
	isRetrieveLatestObject?: boolean = null;

	/** アダプタのBeanId */
	adapterId?: String = null;

	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'formFormatResultDTOConverter' = null;

	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: String = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクト一括更新APIのパラメータ
 */
export class EIMObjectAPIServiceUpdateListParam {

	/** 更新対象のDTOリスト */
	dtos: any[] = null;

	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToObjectDomainConverterId?: String = null;

	/** フォーマット定義名称（ファイル更新時に使用） */
	formatDefinitionName?: String = null;

	/** 更新するファイルリスト */
	files?: File[] = null;

	/** 更新属性タイプ定義名称パスリスト */
	updateAttributeTypeDefinitionNamePaths?: string[][];

	/** オブジェクトのプロパティを更新した時、EIMOBJテーブルの更新日/更新者を更新するかどうか */
	isUpdateModificationInfo?: boolean = null;

	/** 更新後のオブジェクト情報リストを返却するかどうか */
	isRetrieveLatestObjects?: boolean = null;

	/** アダプタのBeanId */
	adapterId?: String = null;

	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'listFormatResultDTOConverter' | 'treeFormatResultDTOConverter' = null;

	/** 簡易DTOコンバータのBeanId */
	dtoConverterId?: String = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクト削除APIのパラメータ
 */
export class EIMObjectAPIServiceDeleteParam {

	/** 削除対象のオブジェクトID */
	dto: any = null;

	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToObjectDomainConverterId?: String = null;

	/** アダプタのBeanId */
	adapterId?: String = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクト一括削除APIのパラメータ
 */
export class EIMObjectAPIServiceDeleteListParam {

	/** 削除対象のDTOリスト */
	dtos: any[] = null;

	/** DTOをObjectDomainに変換するコンバータのBeanId */
	jsonToObjectDomainConverterId?: String = null;

	/** アダプタのBeanId */
	adapterId?: String = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクトファイルダウンロードAPIのパラメータ
 */
export class EIMObjectAPIServiceDownloadFileParam {

	/** ダウンロード対象のオブジェクト */
	dto: any = null;

	/** フォーマット定義名称 */
	formatDefinitionName: string;

	/** ファイルダウンロードするかどうか(falseの場合はファイルオープンする) */
	forceDownload: boolean = true;

	/** アダプタのBeanId */
	adapterId?: String = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクト一括ファイルダウンロードAPIのパラメータ
 */
export class EIMObjectAPIServiceDownloadFileListParam {

	/** オブジェクト取得条件 */
	objectCriteria: EIMSimpleSearchObjectCriteria = null;

	/** 関連先のオブジェクト取得条件 */
	relatedObjectCriterias?: EIMSimpleSearchRelatedObjectCriteria[] = null;

	/** 関連先のオブジェクト取得条件の繰り返し回数 */
	repeatRelatedObjectCriteriasNum? = 1;

	/** フォーマット定義名称rリスト */
	formatDefinitionNames?: string[];

	/** ダウンロードするZIPファイル名 */
	zipFileName?: string;

	/** アダプタのBeanId */
	adapterId?: string = null;

	/** 簡易結果DTOコンバータのBeanId */
	resultConverterId?: 'listFormatResultDTOConverter' | 'treeFormatResultDTOConverter' = null;

	/** パラメータ */
	exParameter?: object = null;
}

/**
 * オブジェクトAPIサービス
 */
@Injectable()
export class EIMObjectAPIService {

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
	 * オブジェクト情報を登録します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return オブザーバブル
	 */
	public create(params: EIMObjectAPIServiceCreateParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		// fileを除いたパラメータを生成
		let _params: EIMObjectAPIServiceCreateParam = {
			dto: this.filterNullAttribute(params.dto),
			jsonToObjectDomainConverterId: params.jsonToObjectDomainConverterId,
			formatDefinitionName: params.formatDefinitionName,
			parentObjectId: params.parentObjectId,

			adapterId: params.adapterId,
			resultConverterId: params.resultConverterId,
			dtoConverterId: params.dtoConverterId,
			exParameter: params.exParameter
		}

		// データとファイルを登録する場合
		if (params.file) {
			return this.httpService.postMultipart('/apis/objects/with-file', {jsonParam: _params}, params.file, 
					displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value);
				}));
		}
		// データのみ登録する場合
		else {
			return this.httpService.postJson('/apis/objects', _params, 
					displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value);
				}));
		}
	}

	/**
	 * オブジェクト情報を一括登録します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return オブザーバブル
	 */
	public createList(params: EIMObjectAPIServiceCreateListParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		// filesを除いたパラメータを生成
		let _params: EIMObjectAPIServiceCreateListParam = {
			dtos: params.dtos,
			jsonToObjectDomainConverterId: params.jsonToObjectDomainConverterId,
			formatDefinitionName: params.formatDefinitionName,
			parentObjectId: params.parentObjectId,

			adapterId: params.adapterId,
			resultConverterId: params.resultConverterId,
			dtoConverterId: params.dtoConverterId,
			exParameter: params.exParameter
		}
		for (let i = 0; i < _params.dtos.length; i++) {
			_params.dtos[i] = this.filterNullAttribute(params.dtos[i]);
		}

		// データとファイルを登録する場合
		if (params.files) {
			return this.httpService.postMultipart('/apis/objects/bulk/with-files', {jsonParam: _params}, params.files, 
					displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value);
				}));
		}
		// データのみ登録する場合
		else {
			return this.httpService.postJson('/apis/objects/bulk', _params, 
					displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value);
				}));
		}
	}

	/**
	 * オブジェクト情報を取得します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return オブザーバブル
	 */
	public get(params: EIMObjectAPIServiceGetParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let reqParams = JSON.parse(JSON.stringify(params));
		delete reqParams.id;
		return this.httpService.get('/apis/objects/' + params.id, reqParams, 
				displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクト情報を一括取得します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return オブザーバブル
	 */
	public getList(params: EIMObjectAPIServiceGetListParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		return this.httpService.postJson('/apis/objects/search-result', params, 
				displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * オブジェクト情報を更新します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return オブザーバブル
	 */
	public update(params: EIMObjectAPIServiceUpdateParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		if (!params.dto.id) {
			throw new Error('更新する際はDTOのIDを指定してください。');
		}

		// fileを除いたパラメータを生成
		let dto = this.filterNullAttribute(params.dto);
		dto = this.filterTargetAttributeOnly(dto, params.updateAttributeTypeDefinitionNamePaths);
		let _params: EIMObjectAPIServiceUpdateParam = {
			dto: dto,
			jsonToObjectDomainConverterId: params.jsonToObjectDomainConverterId,
			formatDefinitionName: params.formatDefinitionName,
			updateAttributeTypeDefinitionNamePaths: params.updateAttributeTypeDefinitionNamePaths,
			isUpdateModificationInfo: params.isUpdateModificationInfo,
			isRetrieveLatestObject: params.isRetrieveLatestObject,

			adapterId: params.adapterId,
			resultConverterId: params.resultConverterId,
			dtoConverterId: params.dtoConverterId,
			exParameter: params.exParameter
		}

		// データとファイルを更新する場合
		if (params.file) {
			return this.httpService.putMultipart('/apis/objects/' + _params.dto.id + '/with-file', 
					{jsonParam: _params}, params.file, 
					displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value);
				}));
		}
		// データのみ更新する場合
		else {
			return this.httpService.putJson('/apis/objects/' + _params.dto.id, _params, 
					displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value);
				}));

		}
	}

	/**
	 * オブジェクト情報を一括更新します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return オブザーバブル
	 */
	public updateList(params: EIMObjectAPIServiceUpdateListParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<any[]> {

		// filesを除いたパラメータを生成
		let _params: EIMObjectAPIServiceUpdateListParam = {
			dtos: params.dtos,
			jsonToObjectDomainConverterId: params.jsonToObjectDomainConverterId,
			formatDefinitionName: params.formatDefinitionName,
			updateAttributeTypeDefinitionNamePaths: params.updateAttributeTypeDefinitionNamePaths,
			isUpdateModificationInfo: params.isUpdateModificationInfo,
			isRetrieveLatestObjects: params.isRetrieveLatestObjects,

			adapterId: params.adapterId,
			resultConverterId: params.resultConverterId,
			dtoConverterId: params.dtoConverterId,
			exParameter: params.exParameter
		}
		for (let i = 0; i < params.dtos.length; i++) {
			let dto = this.filterNullAttribute(params.dtos[i]);
			dto = this.filterTargetAttributeOnly(dto, params.updateAttributeTypeDefinitionNamePaths);
	
			params.dtos[i] = dto;
		}

		// データとファイルを更新する場合
		if (params.files) {
			return this.httpService.putMultipart('/apis/objects/bulk/with-files', 
					{jsonParam: _params}, params.files, 
					displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value);
				}));
		} 
		// データのみ更新する場合
		else {
			return this.httpService.putJson('/apis/objects/bulk', _params, 
					displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value);
				}));
		}
	}

	/**
	 * オブジェクト情報を削除します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return ユーザリスト
	 */
	public delete(params: EIMObjectAPIServiceDeleteParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<null> {

		if (!(params?.dto?.id ?? null)) {
			throw new Error('更新する際はDTOのIDを指定してください。');
		}

		// DTOのプロパティを必要なプロパティに絞る
		const dto = {id: params.dto.id, type: params.dto.type};
		const _params: EIMObjectAPIServiceDeleteParam = {
			dto: dto,
			jsonToObjectDomainConverterId: params.jsonToObjectDomainConverterId,
			adapterId: params.adapterId,
			exParameter: params.exParameter
		}
		return this.httpService.delete('/apis/objects/' + params.dto.id, _params, 
				displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(null);
			}));
	}

	/**
	 * オブジェクト情報を一括削除します.
	 * @param params パラメータ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか（デフォルト：表示する）
	 * @param displayErrorDialog エラーダイアログを表示するかどうか（デフォルト：表示する）
	 * @return ユーザリスト
	 */
	public deleteList(params: EIMObjectAPIServiceDeleteListParam, 
			displayProgressDialog = true, displayErrorDialog = true): Observable<null> {

		if ((params?.dtos?.length ?? 0) === 0) {
			throw new Error('削除するDTOを1件以上指定してください。');
		}

		// DTOのプロパティを必要なプロパティに絞る
		const dtos = [];
		for (let i = 0; i < params.dtos.length; i++) {
			dtos.push({id: params.dtos[i].id, type: params.dtos[i].type});
		}
		const _params: EIMObjectAPIServiceDeleteListParam = {
			dtos: dtos,
			jsonToObjectDomainConverterId: params.jsonToObjectDomainConverterId,
			adapterId: params.adapterId,
			exParameter: params.exParameter
		}
		return this.httpService.delete('/apis/objects/bulk', _params, 
				displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(null);
			}));
	}

	/**
	 * オブジェクトのファイルをダウンロードします.
	 * @param params パラメータ
	 */
	public downloadFile(params: EIMObjectAPIServiceDownloadFileParam): void {

		if (!params.dto.id) {
			throw new Error('ダウンロードする際はDTOのIDを指定してください。');
		}

		this.httpService.downloadFile('/apis/objects/' + params.dto.id + '/file', params.forceDownload, params);
	}

	/**
	 * オブジェクトのファイルを一括ダウンロードします.
	 * @param params パラメータ
	 */
	public downloadFileList(params: EIMObjectAPIServiceDownloadFileListParam): void {

		this.httpService.downloadFile('/apis/objects/bulk/file', true, params);
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

				attribute.values = attribute.values.filter(v => v !== null && v !== '');
		});

		return dto;
	}

	/**
	 * 属性リストから更新対象外の属性を除去します.
	 *
	 * @param dto 除去する対象のDTO
	 * @param updateAttributeTypeDefinitionNamePaths 更新属性タイプ定義名称パスリスト
	 */
	protected filterTargetAttributeOnly(
			dto: any, updateAttributeTypeDefinitionNamePaths: string[][]): any {

		if (dto.attributeMap) {
			return this.filterTargetAttributeOnlyForSimpleObjectDTO(dto, updateAttributeTypeDefinitionNamePaths);
		}

		return dto;
	}

	/**
	 * 属性リストから更新対象外の属性を除去します.
	 * 
	 * @param dto 除去する対象のDTO
	 * @param updateAttributeTypeDefinitionNamePaths 更新属性タイプ定義名称パスリスト
	 * @returns 
	 */
	protected filterTargetAttributeOnlyForSimpleObjectDTO(
			dto: EIMSimpleObjectDTO, updateAttributeTypeDefinitionNamePaths: string[][]): EIMSimpleObjectDTO {

		if (!updateAttributeTypeDefinitionNamePaths || updateAttributeTypeDefinitionNamePaths.length === 0) {
			return dto;
		}

		// カスタム属性定義名称セット生成
		const updateAttributeTypeDefinitionNameSet: Set<string> = new Set();
		for (const updateAttributeTypeDefinitionNamePath of updateAttributeTypeDefinitionNamePaths) {

			if (updateAttributeTypeDefinitionNamePath.length < 1) {
				continue;
			}
			if (updateAttributeTypeDefinitionNamePath[0] !== 'attributeMap') {
				continue;
			}

			// 属性タイプ全更新の場合（['attributeMap']）
			if (updateAttributeTypeDefinitionNamePath.length === 1) {

				updateAttributeTypeDefinitionNameSet.add('*');
			}
			// 属性タイプ個別指定の場合（['attributeMap', '...']）
			else {
				updateAttributeTypeDefinitionNameSet.add(updateAttributeTypeDefinitionNamePath[1]);

			}
		}

		const attributeMap = {};
		Object.keys(dto.attributeMap).map((key) => {

			if (!updateAttributeTypeDefinitionNameSet.has('*') && !updateAttributeTypeDefinitionNameSet.has(key)) {
				return;
			}

			attributeMap[key] = dto.attributeMap[key];
		});

		dto.attributeMap = attributeMap;

		return dto;
	}
}
