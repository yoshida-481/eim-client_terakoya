import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


/**
 * 属性タイプAPIサービス
 */
@Injectable()
export class EIMCodeService {

	constructor(
			private httpService: EIMHttpService,
			private domainService: EIMDomainService,
			private jsonService: EIMJSONService) {}


	/**
	 * コードを作成します.
	 * @param codeType コードタイプ
	 * @param code コード
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 作成したコード
	 */
	public create(codeType: EIMCodeTypeDomain, code: EIMCodeDomain, displayProgressDialog = false): Observable<EIMCodeDomain> {
		return this.httpService.post('/rest/code/create.mvc', {codeType, code}, displayProgressDialog)
			.pipe(mergeMap((res: any) => {
				return of(new EIMCodeDomain(res.value));
			}));
	}

	/**
	 * コードを更新します.
	 * @param code コード
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 更新対象コードID
	 */
	public update(code: EIMCodeDomain, displayProgressDialog = true): Observable<number> {
		return this.httpService.post('/rest/code/update.mvc', code, displayProgressDialog)
			.pipe(mergeMap(() => {
				return of(code.id);
			}));
	}

	/**
	 * コードを削除します.
	 * @param code コード
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return 削除対象コードID
	 */
	public delete(code: EIMCodeDomain): Observable<number> {
		return this.httpService.post('/rest/code/delete.mvc', code)
			.pipe(mergeMap(() => {
				return of(code.id);
		}));
	}

	/**
	 * IDからコードを取得します.
	 * @param id コードID
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return コード
	 */
	public getById(id: number): Observable<EIMCodeDomain> {
		return this.httpService.postForForm('/rest/code/getById.mvc', {id: id})
			.pipe(mergeMap((res: any) => {
				return of(new EIMCodeDomain(res.value));
			}));
	}

	/**
	 * コードタイプと紐づくコードを取得します.
	 * @param codeTypeId コードタイプID
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return コード
	 */
	public getList(codeTypeId: number, displayProgressDialog = false): Observable<EIMCodeDomain[]> {
		return this.httpService.post('/rest/code/getList.mvc', {codeTypeId: codeTypeId}, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
				(_json: any) => {
					return new EIMCodeDomain(_json);
				}));
		}));
	}

	/**
	 * コードの名称を変更します.
	 * @param code コード
	 * @param otherName 定義名称
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return コード
	 */
	public setOtherName(code: EIMCodeDomain, otherName1: string, otherName2: string, displayProgressDialog = true): Observable<EIMCodeDomain[]> {
		return this.httpService.post('/rest/code/setOtherName.mvc', {code: code, otherName1: otherName1, otherName2: otherName2}, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
				(_json: any) => {
					return new EIMCodeDomain(_json);
				}));
		}));
	}

	/**
	 * コードから名称を除去します.
	 * @param code コード
	 * @param otherName 定義名称
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return コード
	 */
	public removeOtherName(code: EIMCodeDomain, otherName: string, displayProgressDialog = true): Observable<EIMCodeDomain[]> {
		return this.httpService.post('/rest/code/removeOtherName.mvc', {code: code, otherName1: otherName}, displayProgressDialog)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
				(_json: any) => {
					return new EIMCodeDomain(_json);
				}));
		}));
	}

	/**
	 * 複数のコードタイプIDから一覧を取得します.
	 * @param criteria 検索条件
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return コード一覧
	 */
	public getListMapCodeTypeIds(criteria): Observable<EIMCodeTypeDomain[]> {
		return this.httpService.post('/rest/code/getListMapCodeTypeIds.mvc', criteria)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}

	/**
	 * コードタイプIDから一覧を取得します.
	 * @param codeTypeId コードタイプID
	 * @param codeValue コード値
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return コード一覧
	 */
	public getListMapCodeTypeIdsByTypeAndValue(codeTypeId: number, codeValue: string): Observable<EIMCodeTypeDomain[]> {
		return this.httpService.post('/rest/code/getListMapCodeTypeIdsByTypeAndValue.mvc', {codeTypeId: codeTypeId, codeValue: codeValue})
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}

		/**
	 * コードの並び替えを行います.
	 * @param codeType コードタイプ
	 * @param codeList コードリスト
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 */
	public sortSequence(codeType: EIMCodeTypeDomain, codeList: EIMCodeDomain[], displayProgressDialog = true): Observable<number> {
		return this.httpService.post('/rest/code/sortSequence.mvc', {codeType: codeType, codeList: codeList}, displayProgressDialog).pipe(mergeMap(() => {
			return of(codeType.id);
		}));
	}
}
