import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMDirectoryDTO } from 'app/admins/shared/dtos/directory.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


/**
 * フォーマットAPIサービス
 */
@Injectable()
export class EIMAdminsFormatService {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected domainService: EIMDomainService) {
	}


	/**
	 * フォーマットを取得します.
	 * @param formatId フォーマットID
	 * @return フォーマット
	 */
	public get(formatId: number): Observable<EIMFormatDTO> {
		let params: any = {};
		params['formatId'] = formatId;

		return this.httpService.postForForm('/admin/format/dspFormat.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormatDTO(res.value.format));
			}
		));
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * フォーマットのリストを取得します.
	 * @return フォーマットのリスト
	 */
	public getList(): Observable<EIMFormatDTO[]> {
		return this.httpService.get('/admin/format/dspFormatTree.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.formats.format,
					(_json: any) => {
						return  new EIMFormatDTO(_json);
					}
				));
		}));
	}


	/**
	 * フォーマットを登録します.
	 * @param nameList 言語リスト
	 * @param path ディレクトリ
	 * @param boxFolderId BOXフォルダID
	 * @return フォーマット
	 */
	public create(nameList: any, path: string, boxFolderId: string): Observable<EIMFormatDTO> {
		let params: any = this.nameListToParam(nameList)
		params['path'] = path;
		params['boxFolderId'] = boxFolderId;

		return this.httpService.postForForm('/admin/format/actCreateFormat.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormatDTO(res.value.format));
			}
		));
	}


	/**
	 * フォーマットを更新します.
	 * @param nameList 言語リスト
	 * @param formatId フォーマットID
	 * @param boxFolderId BOXフォルダID
	 * @return フォーマット
	 */
	public update(nameList: any, formatId: number, boxFolderId: string): Observable<EIMFormatDTO> {
		let params: any = this.nameListToParam(nameList)
		params['formatId'] = formatId;
		params['boxFolderId'] = boxFolderId;

		return this.httpService.postForForm('/admin/format/actUpdateFormat.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMFormatDTO(res.value.format));
			}
		));
	}


	/**
	 * フォーマットを削除します.
	 * @param formatId フォーマットID
	 * @return フォーマット
	 */
	public delete(formatId: number): Observable<string> {
		let params: any = {};
		params['formatId'] = formatId;

		return this.httpService.postForForm('/admin/format/actDeleteFormat.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}
		));
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * データ変換
	 * @param nameList 言語リスト
	 * @return フォーマット
	 */
	private nameListToParam(nameList: any): {} {
		let params: any = {};
		let languageId = 'otherLId';
		let languageName = 'otherName';
		let languageIdTmp: string;
		let languageNameTmp: string;
		let keys = Object.keys(nameList);
		let languageCnt = keys.length;

		params['otherCnt'] = languageCnt;

		for (let idx = 0; idx < languageCnt; idx++) {
			languageIdTmp = languageId + idx;
			languageNameTmp = languageName + idx;
			params[languageIdTmp] = keys[idx];
			params[languageNameTmp] = nameList[keys[idx]];

		}
		return params;
	}

}
