import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMDirectoryDTO } from 'app/admins/shared/dtos/directory.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


/**
 * フォーマットディレクトリAPIサービス
 */
@Injectable()
export class EIMAdminsDirectoryService {

	/**
	 * コンストラクタです.
	 */
  constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected domainService: EIMDomainService) {}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ディレクトリを返却します.
	 * @param dirId ディレクトリID
	 * @return ディレクトリ
	 */
	public get(dirId: number): Observable<any> {
		let params: any = {};
		params['dirId'] = dirId;

		return this.httpService.postForForm('/admin/format/dspDirectory.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObject(res.value.dir,
					(_json: any) => {
						return new EIMDirectoryDTO(_json);
					}));
		}));

	}


	/**
	 * ディレクトリのリストを返却します.
	 * @param formatId フォーマットID
	 * @return ディレクトリのリスト
	 */
	public getList(formatId: number): Observable<EIMDirectoryDTO[]> {
		let params: any = {};
		params['formatId'] = formatId;

		return this.httpService.postForForm('/admin/format/dspDirectoryList.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.directories.directory,
					(_json: any) => {
						return new EIMDirectoryDTO(_json);
					}));
		}));
	}


	/**
	 * ディレクトリを登録します.
	 * @param formatId フォーマットID
	 * @param path ディレクトリ名
	 * @param status ステータス
	 * @return 登録結果
	 */
	public create(formatId: number, path: string, status: number): Observable<string> {
		let params: any = {};
		params['formatId'] = formatId;
		params['path'] = path;
		params['status'] = status;

		return this.httpService.postForForm('/admin/format/actCreateDirectory.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}


	/**
	 * ディレクトリを更新します.
	 * @param formatId フォーマットID
	 * @param dirId ディレクトリID
	 * @param path ディレクトリ名
	 * @param status ステータス
	 * @return ディレクトリ
	 */
	public update(formatId: number, dirId: number, path: string, status: number): Observable<EIMDirectoryDTO> {
		let params: any = {};
		params['formatId'] = formatId;
		params['dirId'] = dirId;
		params['path'] = path;
		params['status'] = status;

		return this.httpService.postForForm('/admin/format/actUpdateDirectory.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(new EIMDirectoryDTO(res.value.dir));
		}));
	}


	/**
	 * ディレクトリを削除します.
	 * @return 削除の結果
	 */
	public delete(formatId: number, dirId: number): Observable<string> {
		let params: any = {};
		params['formatId'] = formatId;
		params['dirId'] = dirId;

	    return this.httpService.postForForm('/admin/format/actDeleteDirectory.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}
}
