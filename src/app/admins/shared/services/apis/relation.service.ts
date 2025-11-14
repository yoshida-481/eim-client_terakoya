import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMRelationTypeDTO } from 'app/admins/shared/dtos/relation-type.dto';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * リレーションAPIサービス.
 */
@Injectable()
export class EIMRelationService {

	/**
	 * リレーションサービス.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService
	) {}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーションのリストを取得します.
	 * @return リレーションのリスト
	 */
	public getList(): Observable<EIMRelationTypeDTO[]> {
		return this.httpService.get('/admin/relation/dspRelationTypeTree.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.relationTypes.relationType,
					(_json: any) => {
						return  new EIMRelationTypeDTO(_json);
					}));
			}));
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーションを登録します.
	 * @param nameList 言語リスト
	 * @param mutual 相互／非相互
	 * @param revup リビジョンアップ
	 * @return リレーション
	 */
	public create(nameList: any, mutual: number, revup: number): Observable<any> {
		let params: any = this.nameListToParam(nameList);
		params['mutual'] = mutual;
		params['revup'] = revup;

		return this.httpService.postForForm('/admin/relation/actCreateRelationType.jsp', params).pipe(mergeMap((res: any) => {
	  	return of(res.value.relationType);
	  }));
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーションを更新します.
	 * @param nameList 言語リスト
	 * @param relationTypeId リレーションID
	 * @param revup リビジョンアップ
	 * @return リレーション
	 */
	public update(nameList: any, relationTypeId: number, revup: number): Observable<any> {
		let params: any = this.nameListToParam(nameList);
		params['relationTypeId'] = relationTypeId;
		params['revup'] = revup;

		return this.httpService.postForForm('/admin/relation/actUpdateRelationType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.relationType);
	  }));
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーションを削除します.
	 * @param relationTypeId リレーションID
	 */
	public delete(relationTypeId: number): Observable<any> {
	    return this.httpService.postForForm('/admin/relation/actDeleteRelationType.jsp', {relationTypeId: relationTypeId})
			.pipe(mergeMap((res: any) => {
				return of(res.value);
	  }));
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーションを取得します.
	 * @param relationTypeId リレーションID
	 * @return リレーション
	 */
	public get(relationTypeId: number): Observable<any> {
	    return this.httpService.postForForm('/admin/relation/dspRelationType.jsp', {relationTypeId: relationTypeId})
			.pipe(mergeMap((res: any) => {
				return of(res.value.relationType);
	  }));
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性タイプのリストを取得します.
	 * @param relationTypeId リレーションタイプID
	 * @return 属性タイプのリスト
	 */
	public getAttributeTypeList(relationTypeId: number): Observable<EIMAttributeTypeDTO[]> {
	    return this.httpService.postForForm('/admin/relation/dspAttributeType.jsp', {relationTypeId: relationTypeId}, false)
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
	 * リレーションに属性を登録します.
	 * @param relationTypeId リレーションタイプID
	 * @param attTypeId 属性タイプID
	 * @return 属性
	 */
	public createAttributeType(relationTypeId: number, attTypeId: any): Observable<any> {
		let params: any = {};
		params['attTypeId'] = attTypeId;
		params['relationTypeId'] = relationTypeId;

		return this.httpService.postForForm('/admin/relation/actApplyAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.attType);
	  }));
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーションの属性を削除します.
	 * @param relationTypeId リレーションタイプID
	 * @param attTypeId 属性タイプID
	 * @return フォーマット
	 */
	public deleteAttributeType(relationTypeId: number, attTypeId: number): Observable<any> {
		let params: any = {};
		params['relationTypeId'] = relationTypeId;
		params['attTypeId'] = attTypeId;

		return this.httpService.postForForm('/admin/relation/actReleaseAttributeType.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
	  }));
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
