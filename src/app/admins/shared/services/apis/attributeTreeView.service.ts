import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttrTreeDTO } from 'app/admins/shared/dtos/attrTree.dto';
import { EIMAttrTreeUpdateDTO } from 'app/admins/shared/dtos/attrTreeUpdate.dto';
import { EIMAttrTreeItemDTO } from 'app/admins/shared/dtos/attrTreeItem.dto';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * 属性ツリーAPIサービス
 */
@Injectable()
export class EIMAttrTreeService {

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
	 * 属性ツリービューを取得します.
	 * @param attrTreeId 属性ツリーID
	 * @return 属性ツリー更新用DTO
	 */
	public get(attrTreeId: number): Observable<EIMAttrTreeUpdateDTO> {
		return this.httpService.postForForm('/admin/attrTree/dspAttrTree.jsp', {attrTreeId: attrTreeId})
		.pipe(mergeMap((res: any) => {

			return of(new EIMAttrTreeUpdateDTO (res.value.attrTree));
	}));
}

	/**
	 * 属性ツリービューのリストを取得します.
	 * @return 属性ツリーのリスト
	 */
	public getList(): Observable<EIMAttrTreeDTO[]> {
	    return this.httpService.get('/admin/attrTree/dspAttrTreeList.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.attrTreeList.attrTree,
					(_json: any) => {
						return  new EIMAttrTreeDTO(_json);
					}));
		}));
	}

	/**
	 * 属性リストを取得します（属性選択呼出し）.
	 * @return 属性選択のリスト
	 */
	public getAttributeTypeList(): Observable<EIMAttributeTypeDTO[]> {
		return this.httpService.get('/admin/attrTree/dspAttributeTypeList.jsp')
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value.attTypes.attType,
				(_json: any) => {
					return  new EIMAttributeTypeDTO(_json);
				}));
	}));
}

	/**
	 * 属性ツリービューの属性リストを取得します.
	 * @param attTypeName 検索文字列
	 * @return 属性選択のリスト
	 */
	public postAttributeTypeList(attTypeName: any): Observable<EIMAttributeTypeDTO[]> {
		return this.httpService.postForForm('/admin/attrTree/dspAttributeTypeList.jsp', {attTypeName: attTypeName})
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value.attTypes.attType,
				(_json: any) => {
					if ( _json.attr.valTypeName !== 'テキスト型' && _json.attr.valTypeName !== 'Text') {
						return new EIMAttributeTypeDTO(_json);
					}
				}));
	}));
}

	/**
	 * 属性ツリーに紐づく属性階層順序のリストを返却します.
	 * @param attrTreeID 属性ツリーID
	 * @return 属性階層順序のリスト
	 */
	public getAttrTreeItemList(attrTreeId: number): Observable<EIMAttrTreeItemDTO[]> {
		return this.httpService.postForForm('/admin/attrTree/dspAttrTreeItemList.jsp', {attrTreeId: attrTreeId}, false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.attrTreeItemList.attrTreeItem,
					(_json: any) => {
						return new EIMAttrTreeItemDTO(_json);
					}));
		}));
	}

	/**
	 * 属性ツリーを登録します.
	 * @param nameList 言語リスト
	 * @param classifyTarget 分類対象
	 * @return 属性ツリーID
	 */
	public create(nameList: any, classifyTarget: string): Observable<number> {
		let params: any = this.nameListToParam(nameList);
		params['classifyTarget'] = classifyTarget;

	    return this.httpService.postForForm('/admin/attrTree/actCreateAttrTree.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(Number(res.value.attrTree.attr.attrTreeId));
		}));
	}

	/**
	 * 属性ツリーを更新します.
	 * @param attrTreeID 属性ツリーID
	 * @param nameList 言語リスト
	 * @param classifyTarget 分類対象
	 * @return 属性ツリーID
	 */
	public update(attrTreeId: number, nameList: any, classifyTarget: string): Observable<number> {
		let params: any = this.nameListToParam(nameList);
		params['attrTreeId'] = attrTreeId;
		params['classifyTarget'] = classifyTarget;

		return this.httpService.postForForm('/admin/attrTree/actUpdateAttrTree.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(Number(attrTreeId));
		}));
	}

		/**
	 * 属性ツリーを削除します.
	 * @param attrTreeId 属性ツリーID
	 * @return 属性ツリーID
	 */
	public delete(attrTreeId: number): Observable<number> {
		return this.httpService.postForForm('/admin/attrTree/actDeleteAttrTree.jsp', {attrTreeId: attrTreeId})
		.pipe(mergeMap((res: any) => {
			return of(res.value);
	}));
}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性階層順序を更新します.
	 * @param attrTreeId 属性ツリーID
	 * @param attrTypeIdList 属性タイプIDリスト
	 * @param operationList オペレーションリスト
	 * @param viewNoValuesFlagList 属性値無有無フラグリスト
	 * @return 属性階層順序
	 */
	public updateItemList(attrTreeId: number , attrTypeIdList: any, operationList: any, viewNoValuesFlagList: any): Observable<any> {
		let params: any = {}
		params['attrTreeId'] = attrTreeId;
		params['attrTypeIdList'] = attrTypeIdList;
		params['operationList'] = operationList;
		params['viewNoValuesFlagList'] = viewNoValuesFlagList;

		return this.httpService.postForForm('/admin/attrTree/actUpdateAttrTreeItemList.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res);
		}));
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * データ変換
	 * @param nameList 言語リスト
	 * @return 編集後言語リスト
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
