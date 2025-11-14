import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMSecurityDTO } from 'app/admins/shared/dtos/security.dto';
import { EIMEntryDTO } from 'app/shared/dtos/entry.dto';
import { EIMRoleDTO } from 'app/admins/shared/dtos/role.dto';
import { EIMStatusTypeDTO } from 'app/admins/shared/dtos/status-type.dto';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import {EIMObjectSecurityDTO} from 'app/admins/shared/dtos/object-security.dto';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

export interface EIMSecurityTreeNode extends EIMTreeNode {
	isBranch?: boolean;
	secId?: number;
	secLabel?: string;
	workflowId?: number;
	workflowLabel?: string;
	stSecId?: number;
	stTypeId?: number;
	stSecLabel?: string;
}

export interface EIMHierarchicalSecurityDomain extends EIMHierarchicalDomain {
	id?: number,
	secId?: number,
	workflowId?: number,
	stSecId?: number,
	stTypeId?: number,
	label?: string,
	isBranch?: boolean,
}

export interface EIMSecurity {
	secId?: number,
	secName?: string,
	entryList?: EIMEntryDTO[],
	updateRole?: boolean,
}


/**
 * セキュリティAPIサービス
 */
@Injectable()
export class EIMAdminsSecurityService {

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
	 * ネームスペースリストを返却します.
	 * @return ネームスペースのリスト
	 */
	public getNamespaceList(): Observable<any[]> {

		return this.httpService.get('/admin/conf/dspNamespaceXML.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.namespaceConf.namespaceList.namespace,
					(_json: any) => {
						return new EIMSpnameDTO(_json);
					}));
		}));
	}


	/**
	 * オブジェクトのセキュリティを取得します.
	 * @param objId オブジェクトID
	 * @return オブジェクト
	 */
	public getProperty(objId: number): Observable<EIMObjectSecurityDTO> {
		let params: any = {};
		params['objId'] = objId;

		return this.httpService.postForForm('/admin/security/dspProperty.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObject(res.value,
					(_json: any) => {
						return new EIMObjectSecurityDTO(_json);
					}));
		}));
	}


	/**
	 * アクセスセキュリティ、フォルダ構成管理セキュリティを取得します.
	 *  @param id オブジェクトID
	 */
	public getSecurityCommonProperty(id: number): Observable<EIMObjectSecurityDTO> {
		return this.httpService.get('/admin/security/dspProperty.jsp', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObject(res.value,
					(_json: any) => {
						return new EIMObjectSecurityDTO(_json);
					}));
			}));
	}


	/**
	 * ステータスセキュリティTreeを返却します.
	 * @param securityName セキュリティ名
	 * @param initFlag 初期検索フラグ
	 * @return セキュリティTree
	 */
	public getList(securityName: string, initFlag = true): Observable<any> {
		let params: any = {};
		params['initFlag'] = initFlag;
		params['securityName'] = securityName;

		return this.httpService.postForForm('/admin/security/dspStatusSecurityTree.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.convertSecurityToTreeNodes(res.value.secList.security));
		}));
	}


	/**
	 * セキュリティ一覧を返却します.
	 * @param initFlag 初期検索フラグ
	 * @param securityName セキュリティ名
	 * @param objId オブジェクトID
	 * @return セキュリティ一覧
	 */
	public getSecurityList(initFlag: boolean, securityName: string, objId: number): Observable<EIMSecurityDTO[]> {
		let params: any = {};
		params['initFlag'] = initFlag;
		params['securityName'] = securityName;

		return this.httpService.postForForm('/admin/security/dspSecurityTree.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.secList.security,
					(_json: any) => {
						return  new EIMSecurityDTO(_json);
					}));
		}));
	}


	/**
	 * アクセスエントリーのリストを返却します.
	 * @param secId セキュリティID
	 * @return アクセスエントリーのリスト
	 */
	public getEntryList(secId: number): Observable<EIMEntryDTO[]> {
		let params: any = {};
		params['secId'] = secId;

		return this.httpService.postForForm('/admin/security/dspEntryList.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.entryList.entry,
					(_json: any) => {
						return new EIMEntryDTO(_json);
					}));

		}));
	}


	/**
	 * アクセス権限のリストを返却します.
	 * @param entryId エントリID
	 * @param stSecId ステータスセキュリティID
	 * @return アクセス権限のリスト
	 */
	public getRoleList(entryId: number, stSecId?: number): Observable<EIMRoleDTO[]> {
		let params: any = {};
		params['entryId'] = entryId;

		if (stSecId) {
			params['stSecId'] = stSecId;
		}
		return this.httpService.postForForm('/admin/security/dspRoleList.jsp', params, false)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.roleList.role,
					(_json: any) => {
						return  new EIMRoleDTO(_json);
					}));
		}));
	}


	/**
	 * ステータスタイプのリストを返却します.
	 * @param workflowId エントリID
	 * @return ステータスタイプのリスト
	 */
	public getStatusTypeList(workflowId: number): Observable<EIMStatusTypeDTO[]> {
		let params: any = {};
		params['workFlowId'] = workflowId;

		return this.httpService.postForForm('/admin/workflow/dspStatusTypeList.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.statusTypeList.statusType,
					(_json: any) => {
						return  new EIMStatusTypeDTO(_json);
					}));
		}));
	}


	/**
	 * セキュリティを登録します.
	 * @param nameList 言語リスト
	 * @param namespace ネームスペース
	 * @return セキュリティ
	 */
	public create(nameList: any, namespace?: string): Observable<any> {
		let params: any = this.nameListToParam(nameList);

		if (namespace) {
			params['namespace'] = namespace;
		}

		return this.httpService.postForForm('/admin/security/actCreateSecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.security.attr);
		}));
	}


	/**
	 * セキュリティを適用します.
	 * @param objId オブジェクトID
	 * @param secId セキュリティID
	 */
	public applySecurity(objId: number, secId: number): Observable<any> {
		let params: any = {};
		params['objId'] = objId;
		params['secId'] = secId;

		return this.httpService.postForForm('/admin/security/actApplySecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}


	/**
	 * セキュリティを取得します.
	 * @param secId セキュリティID
	 * @return セキュリティ
	 */
	public get(secId: number): Observable<any> {
		let params: any = {};
		params['secId'] = secId;

		return this.httpService.postForForm('/admin/security/dspSecurity.jsp', params)
			.pipe(mergeMap((res: any) => {

				return of(res.value.security);
		}));
	}


	/**
	 * セキュリティを更新します.
	 * @param nameList 言語リスト
	 * @param secId セキュリティID
	 * @param namespace ネームスペース
	 * @return セキュリティ
	 */
	public update(nameList: any, secId: number, namespace?: string): Observable<any> {
		let params: any = this.nameListToParam(nameList)
		params['secId'] = secId;
		params['namespace'] = namespace;

		return this.httpService.postForForm('/admin/security/actUpdateSecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.security.attr);
		}));
	}


	/**
	 * セキュリティを削除します.
	 * @param secId セキュリティID
	 */
	public delete(secId: number): Observable<any> {
		let params: any = {};
		params['secId'] = secId;

		return this.httpService.postForForm('/admin/security/actDeleteSecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}


	/**
	 * ステータス別セキュリティを削除します.
	 * @param secId セキュリティID
	 */
	public deleteStatus(secId: number): Observable<any> {
		let params: any = {};
		params['secId'] = secId;

		return this.httpService.postForForm('/admin/security/actDeleteStatusSecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}


	/**
	 * セキュリティからワークフローを削除します.
	 * @param secId セキュリティID
	 * @param wfId ワークフローID
	 */
	public deleteWorkflow(secId: number, wfId: number): Observable<any> {
		let params: any = {};
		params['secId'] = secId;
		params['wfId'] = wfId;

		return this.httpService.postForForm('/admin/security/actDeleteStatusSecuritiesInWF.jsp', params)
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

		return this.httpService.postForForm('/admin/security/actCreateEntry.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.statusSecurity);
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

		return this.httpService.postForForm('/admin/security/actUpdatePriority.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
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

		return this.httpService.postForForm('/admin/security/actDeleteEntry.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}


	/**
	 * ステータス別セキュリティを登録します.
	 * @param secId    セキュリティID
	 * @param wfId     ワークフローID
	 * @param stTypeId ステータスタイプID
	 * @return         セキュリティID
	 */
	public createStatus(secId: number, wfId: number, stTypeId: number): Observable<any> {
		let params: any = {};
		params['secId'] = secId;
		params['wfId'] = wfId;
		params['stTypeId'] = stTypeId;

		return this.httpService.postForForm('/admin/security/actCreateStatusSecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.statusSecurity.attr);
		}));
	}


	/**
	 * ステータス別セキュリティを更新します.
	 * @param secId    セキュリティID
	 * @param wfId     ワークフローID
	 * @param stSecId  ステータス別セキュリティID
	 * @param stTypeId ステータスタイプID
	 * @return         セキュリティID
	 */
	public updateStatus(secId: number, wfId: number, stSecId: number, stTypeId: number): Observable<any> {
		let params: any = {};
		params['secId'] = secId;
		params['wfId'] = wfId;
		params['stSecId'] = stSecId;
		params['stTypeId'] = stTypeId;

		return this.httpService.postForForm('/admin/security/actUpdateStatusSecurity.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.security.attr);
		}));
	}



	/**
	 * ステータス別セキュリティを複写します.
	 * @param secId    セキュリティID
	 * @param fromStatusTypeIdList 複写元ステータスタイプリスト
	 * @param toStatusTypeIdList 複写先ステータスタイプリスト
	 * @return セキュリティID
	 */
	public copyStatus(secId: number, fromStatusTypeIdList: string, toStatusTypeIdList: string): Observable<any> {
		let params: any = {};
		params['secId'] = secId;
		params['fromStatusTypeIds'] = fromStatusTypeIdList;
		params['toStatusTypeIds'] = toStatusTypeIdList;

		return this.httpService.get('/admin/security/actCopyStatusSecurity.jsp', params).pipe(mergeMap((res: any) => {
			return of(res.value.security.attr);
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

		return this.httpService.postForForm('/admin/security/actUpdateRole.jsp', params).pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}



	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * セキュリティからツリー要素を生成します.
	 * @param security セキュリティ
	 * @return ツリー要素リスト
	 */
	private convertSecurityToTreeNodes(security: any, pearent?: any): EIMSecurityTreeNode[] {
		let rtTreeNode: EIMSecurityTreeNode[] = [];

		if (!security) {
			return rtTreeNode;
		}

		if (security instanceof Array === false) {
			security = [security];
		}

		// ツリーの子要素を再帰的に生成
		for (let i = 0; i < security.length; i++) {

			// ツリー要素を生成
			let secData = this.convertToEIMHierarchicalSecurity(security[i]);
			let treeNode: EIMSecurityTreeNode = {
				label: security[i].attr.label,
				objId: secData.id,
				expandedIcon: 'fa-fw fa-lg eim-icon-security',
				collapsedIcon: 'fa-fw fa-lg eim-icon-security',
				data: secData,
				parent: pearent,
			}

			let childlen: EIMSecurityTreeNode[] = [];
			// ワークフロー
			if (security[i].workflow) {
				if (security[i].workflow instanceof Array === false) {
					let temps: any[] = [];
					security[i].workflow = [security[i].workflow];
				}
				treeNode.expanded = false;
				childlen = this.convertSecurityToTreeNodes(security[i].workflow, treeNode);
			}

			// ステータス別セキュリティ
			if (security[i].statusSecurity) {
				if (security[i].statusSecurity instanceof Array === false) {
					security[i].statusSecurity = [security[i].statusSecurity];
				}
				treeNode.expanded = false;
				childlen = this.convertSecurityToTreeNodes(security[i].statusSecurity, treeNode);
			}

			treeNode.children = childlen;
			rtTreeNode.push(treeNode);
		}

		return rtTreeNode;
	}

	private convertToEIMHierarchicalSecurity(json: any): EIMHierarchicalSecurityDomain {

		let resSecurity = {};
		let treeId: number = null;

		let workflowId: number  = null;
		if (json.attr.id !== void 0) {
			workflowId = Number(json.attr.id);
		}

		let statusTypeId: number = null;
		if (json.attr.statusTypeId !== void 0) {
			statusTypeId = Number(json.attr.statusTypeId);
		}

		let secId: number = null;
		if (json.attr.secId !== void 0) {
			secId = Number(json.attr.secId);
		}

		let stSecId: number = null;
		if (statusTypeId && secId) {
			stSecId = secId;
			secId = null;
		}

		if (workflowId) {
			treeId = workflowId;
		} else if (stSecId) {
			treeId = stSecId;
		} else {
			treeId = secId;
		}

		if (workflowId) {
			resSecurity['workflowId'] = workflowId;
		}

		if (stSecId) {
			resSecurity['stSecId'] = stSecId;
			resSecurity['stTypeId'] = statusTypeId;
		}

		if (secId) {
			resSecurity['secId'] = secId;
		}

		resSecurity['id'] = treeId;
		resSecurity['label'] = json.attr.label;
		resSecurity['isBranch'] = json.attr.isBranch;

		return resSecurity;

	}


	/**
	 * データ変換
	 * @param nameList 言語リスト
	 * @return セキュリティ
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
}
