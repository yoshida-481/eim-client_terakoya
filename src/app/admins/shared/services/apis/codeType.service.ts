import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


/**
 * コードタイプAPIサービス
 */
@Injectable()
export class EIMCodeTypeService {

	constructor(
			private httpService: EIMHttpService,
			private domainService: EIMDomainService,
			private jsonService: EIMJSONService) {}


	/**
	 * コードタイプを作成します.
	 * @param codeType 作成対象コードタイプ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 作成したコードタイプ
	 */
	public create(codeType: EIMCodeTypeDomain): Observable<EIMCodeTypeDomain> {
		return this.httpService.post('/rest/codeType/create.mvc', codeType)
			.pipe(mergeMap((res: any) => {
				return of(new EIMCodeTypeDomain(res.value))
			}));
	}

	/**
	 * コードタイプを更新します.
	 * @param codeType 更新対象コードタイプ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 作成したコードタイプ
	 */
	public update(codeType: EIMCodeTypeDomain): Observable<number> {
		return this.httpService.post('/rest/codeType/update.mvc', codeType)
			.pipe(mergeMap(() => {
				return of(codeType.id);
			}));
	}

	/**
	 * コードタイプを削除します.
	 * @param codeType 削除対象コードタイプ
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 作成したコードタイプ
	 */
	public delete(codeType: EIMCodeTypeDomain): Observable<number> {
		return this.httpService.post('/rest/codeType/delete.mvc', codeType)
			.pipe(mergeMap(() => {
				return of(codeType.id);
		}));
	}

	/**
	 * IDからコードタイプを取得します.
	 * @param codeTypeId コードタイプID
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 作成したコードタイプ
	 */
	public getById(codeTypeId: number): Observable<EIMCodeTypeDomain> {
		return this.httpService.postForForm('/rest/codeType/getById.mvc', {id: codeTypeId})
			.pipe(mergeMap((res: any) => {
				return of(new EIMCodeTypeDomain(res.value))
			}));
	}

	/**
	 * 定義名称からコードタイプを取得します.
	 * @param definitionName 定義名称
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 作成したコードタイプ
	 */
	public getByDefinitionName(definitionName: string): Observable<EIMCodeTypeDomain> {
		return this.httpService.postForForm('/rest/codeType/getByDefinitionName.mvc', definitionName)
			.pipe(mergeMap((res: any) => {
				return of(new EIMCodeTypeDomain(res.value))
			}));
	}

	/**
	 * コードタイプ一覧を取得します.
	 * @param criteria 検索条件
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 作成したコード
	 */
	public getList(criteria): Observable<EIMCodeTypeDomain[]> {
		return this.httpService.post('/rest/codeType/getList.mvc', criteria, false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMCodeTypeDomain(_json);
					}));
		}));
	}

		/**
	 * コードタイプを複製します.
	 * @param codeType1 対象コードタイプ1
	 * @param codeType2 対象コードタイプ2
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 作成したコード
	 */
	public copy(codeType1: EIMCodeTypeDomain, codeType2: EIMCodeTypeDomain): Observable<EIMCodeTypeDomain> {
		return this.httpService.post('/rest/codeType/copy.mvc', {codeType1: codeType1, codeType2: codeType2})
			.pipe(mergeMap((res: any) => {
					return of(new EIMCodeTypeDomain(res.value))
				}));
	}

}
