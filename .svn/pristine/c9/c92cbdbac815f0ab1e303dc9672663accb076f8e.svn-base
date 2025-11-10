import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

export interface EIMSecurity {
	secId?: number,
	secName?: string,
	secDefName?: string,
	entryList?: EIMEntry[],
	updateRole?: boolean,
}
export interface EIMSecurityCommon {
	objId?: Number,
	objTypeId?: Number,
	objTypeName?: string,
	objName?: string,
	createUserName?: string,
	createDate?: string,
	modifyUserName?: string,
	modifyDate?: string,
	isWorkSpace?: boolean,
	latest?: boolean,
	secId?: number,
	secName?: string,
	secDefName?: string,
	entryList?: EIMEntry[],
	updateRole?: boolean,
	checkedParentLowerSuccession?: boolean,
	checkedThisLowerSuccession?: boolean,
	lowerSuccessionSecId?: number,
	lowerSuccessionSecName?: string,
}
export interface EIMEntry {
	objId?: number,
	entryId?: number,
	entryTypeId?: number,
	entryTypeName?: string,
	entryName?: string,
	entryObjId?: string,
	entryObjName?: string,
	priority?: number,
}

/**
 * セキュリティAPIサービス
 */
@Injectable()
export class EIMSecurityService {

	/**
	 * セキュリティサービス.
	 */
	constructor(
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService) {}

	/**
	 * セキュリティを取得します.
	 */
	public getProperty(id: number): Observable<EIMSecurity> {
		return this.httpService.get('/app/document/security/dspProperty.jsp',
				{objId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.convertToEIMSecurity(res.value.object));
			}));
	}

	/**
	 * アクセスセキュリティ、フォルダ構成管理セキュリティを取得します.
	 */
	public getSecurityCommonProperty(id: number): Observable<EIMSecurityCommon> {
		return this.httpService.get('/app/document/security/dspProperty.jsp',
				{objId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.convertToEIMSecurityCommon(res.value.object));
			}));
	}

	/**
	 * セキュリティリストを取得します.
	 */
	public getSecurityList(initFlag: boolean, securityName: string, objId: number): Observable<EIMSecurity[]> {
		if (objId > 0) {
			// objId値あり
			return this.httpService.postForForm('/app/document/security/dspSecurityTree.jsp',
					{initFlag: initFlag, securityName: securityName, objId: objId})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.secList.security, this.convertToEIMSecurity));
			}));
		} else {
			// objId値なしの場合、objIdを設定しない
			return this.httpService.postForForm('/app/document/security/dspSecurityTree.jsp',
					{initFlag: initFlag, securityName: securityName})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.secList.security, this.convertToEIMSecurity));
			}));
		}
	}

	/**
	 * アクセスエントリーリストを取得します.
	 */
	public getEntryList(id: number): Observable<EIMEntry[]> {
		return this.httpService.get('/app/document/security/dspEntryList.jsp',
				{secId: id}, false)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.entryList.entry, this.convertToEIMEntry));
			}));
	}

	/**
	 * アクセスロールリストを取得します.
	 */
	public getRoleList(id: number): Observable<any[]> {
		return this.httpService.get('/app/document/security/dspRoleList.jsp',
				{entryId: id}, false)
			.pipe(mergeMap((res: any) => {
				let children: any[] = Array.isArray(res.value.roleList.role) ? res.value.roleList.role : [res.value.roleList.role];
				let objects: any[] = [];
				for (let i = 0; i < children.length; i++) {
					let object: any = children[i].attr;
					object.permit = children[i].stsec.attr.permit;
					objects.push(object);
				}
				return of(objects);
			}));
	}

	/**
	 * セキュリティを適用します.
	 */
	public applySecurity(objId: number, secId: number, checkedLowerSuccession?: boolean, lowerSuccessionSecId?: number, isNotApplyUnderFolder?: boolean): Observable<any> {
		let params: any = {};
		params['objId'] = objId;
		params['secId'] = secId;
		if (checkedLowerSuccession !== null) {
			params['checkedLowerSuccession'] = checkedLowerSuccession;
		}
		if (lowerSuccessionSecId) {
			params['lowerSuccessionSecId'] = lowerSuccessionSecId;
		}
		if (isNotApplyUnderFolder !== null) {
			params['isNotApplyUnderFolder'] = isNotApplyUnderFolder;
		}

		return this.httpService.postForForm('/app/document/security/actApplySecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * jsonからセキュリティを作成します.
	 * @param json jsonデータ
	 * @return セキュリティ
	 */
	public convertToEIMSecurity(json: any): EIMSecurity {
		return {
			secId: Number(json.attr.secId),
			secName: json.attr.secName ? json.attr.secName : json.attr.label,
			updateRole: json.attr.updateRole && json.attr.updateRole === 'true' ? true : false,
		}
	}

	// jsonのデータを変換する
	protected convertToEIMSecurityCommon(json: any): EIMSecurityCommon {
		return {
			objId: Number(json.attr.objId),
			objTypeId: Number(json.attr.objId),
			objTypeName: json.attr.objTypeName,
			objName: json.attr.objName,
			createUserName: json.attr.createUserName,
			createDate: json.attr.createDate,
			modifyUserName: json.attr.modifyUserName,
			modifyDate: json.attr.modifyDate,
			isWorkSpace: json.attr.isWorkSpace && json.attr.isWorkSpace === 'true' ? true : false,
			latest: json.attr.latest && json.attr.latest === 'true' ? true : false,
			secId: Number(json.attr.secId),
			secName: json.attr.secName,
			secDefName: json.attr.secDefName,
			updateRole: json.attr.updateRole && json.attr.updateRole === 'true' ? true : false,
			checkedParentLowerSuccession: json.attr.checkedParentLowerSuccession && json.attr.checkedParentLowerSuccession === 'true' ? true : false,
			checkedThisLowerSuccession: json.attr.checkedThisLowerSuccession && json.attr.checkedThisLowerSuccession === 'true' ? true : false,
			lowerSuccessionSecId: Number(json.attr.lowerSuccessionSecId),
			lowerSuccessionSecName: json.attr.lowerSuccessionSecName,
		}
	}

	protected convertToEIMEntry(json: any): EIMEntry {
		return {
			objId: Number(json.attr.entryId),
			entryId: Number(json.attr.entryId),
			entryTypeId: Number(json.attr.entryTypeId),
			entryTypeName: json.attr.entryTypeName,
			entryName: json.attr.entryObjName,
			entryObjId: json.attr.entryObjId,
			entryObjName: json.attr.entryObjName,
			priority: Number(json.attr.priority),
		}
	}

	/**
	 * エントリーを削除します.
	 * @param secId   セキュリティID
	 * @param entryId エントリーID
	 * @return        削除結果
	 */
	public deleteEntry(secId: number, entryId: number): Observable<any> {
		let params: any = {};
		params['secId'] = secId;
		params['entryId'] = entryId;

		return this.httpService.postForForm('/app/document/security/actDeleteEntry.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}

	/**
	 * エントリーを登録します.
	 * @param secId セキュリティID
	 * @param entryData エントリー情報
	 * @return エントリー
	 */
	 public createEntry(secId: number, entryData: any[]): Observable<any> {
		let params: any = {};
		let entryObjIdList: number[] = [];
		let entryTypeIdList: number[] = [];
			params['secId'] = secId;

		let loopCnt = entryData.length;
		let entry: any;
		for ( let idx = 0; idx < entryData.length; idx++ ) {
			entry = entryData[idx];
			entryObjIdList.push(entry.entryId);
			entryTypeIdList.push(entry.entryTypeId);

		}

		params['entryObjId'] = entryObjIdList;
		params['entryTypeId'] = entryTypeIdList;

		return this.httpService.postForForm('/app/document/security/actCreateEntry.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.statusSecurity);
		}));
	}

	/**
	 * アクセス権限を更新します.
	 * @param secId セキュリティID
	 * @param entryId ワークフローID
	 * @param isDefaultSec ステータス別セキュリティID
	 * @param roleList 権限リスト
	 * @return 更新結果
	 */
	 public updateRole(secId: number, entryId: number, isDefaultSec: boolean, roleList: any[]): Observable<any> {
		let params: any = {};
		params['secId'] = secId;
		params['entryId'] = entryId;
		params['isDefaultSec'] = isDefaultSec;

		let roleNameList = [];
		for (let i = 0; i < roleList.length; i++) {
			roleNameList.push(roleList[i].name);
			params[roleList[i].name] = roleList[i].roleId + ',' + roleList[i].roleChk + ',' + roleList[i].permit;
		}
		params['roleNameList'] = roleNameList.join(',');

		return this.httpService.postForForm('/app/document/security/actUpdateRole.jsp', params).pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * エントリーの優先順位を更新します.
	 * @param secId セキュリティID
	 * @param entryId エントリーID
	 * @param dstPriority 優先順位
	 * @return 更新結果
	 */
	 public updateEntryPriority(secId: number, entryId: number, dstPriority: number): Observable<any> {
		let params: any = {};
		params['secId'] = secId;
		params['entryId'] = entryId;
		params['dstPriority'] = dstPriority;

		return this.httpService.postForForm('/app/document/security/actUpdatePriority.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}
}
