
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMWorkflow } from 'app/documents/shared/services/apis/workflow.service';
import { EIMEntryDTO } from 'app/shared/dtos/entry.dto';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMWorkspaceDTO } from 'app/admins/shared/dtos/workspace.dto';
import { EIMWorkspaceService, EIMWorkspaceProperty, EIMWorkspace, EIMSelectableObjectType, EIMSelectableSecurity } from 'app/documents/shared/services/apis/workspace.service';
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * ワークスペースAPIサービス
 */
@Injectable()
export class EIMAdminWorkspaceService extends EIMWorkspaceService {

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ワークスペースのリストを取得します.
	 * @return ワークスペースのリスト
	 */
	public getList(): Observable<EIMWorkspaceDTO[]> {
	    return this.httpService.get('/admin/workspace/dspWorkSpaceTree.jsp')
			.pipe(mergeMap((res: any) => {
				let wsList = res.value.wsList.workSpace;
				return of(this.domainService.createObjectList(wsList,
					(_json: any) => {
						return  new EIMWorkspaceDTO(_json);
					}));
		}));
	}

		/**
	 * ワークスペースを作成します.
	 */
	public create(workspace: EIMWorkspace): Observable<any> {
		let params: any = {
			objName: workspace.objName,
			secId: workspace.secId,
			docAllFlag: workspace.docAllFlag,
			folderAllFlag: workspace.folderAllFlag,
			tagAllFlag: workspace.tagAllFlag,
			secAllFlag: workspace.secAllFlag,
			isDspAttributeInfo: workspace.isDspAttributeInfo,
			docList: workspace.docList,
			folderList: workspace.folderList,
			tagList: workspace.tagList,
			secList: workspace.secList,
			entryTypeList: workspace.entryTypeList,
			entryList: workspace.entryList,
		};
		if (workspace.lowerSuccessionSecId) {
			params.lowerSuccessionSecId = workspace.lowerSuccessionSecId;
		}

		return this.httpService.postForForm('/admin/workspace/actCreateWorkSpace.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res.value.object.attr);
	  }));
	}

	/**
	 * ワークスペースを更新します.
	 */
	public update(workspace: EIMWorkspace): Observable<any> {
		let params: any = {
			objName: workspace.objName,
			objId: workspace.objId,
			secId: workspace.secId,
			checkedLowerSuccession: workspace.checkedLowerSuccession,
			lowerSuccessionSecId: workspace.lowerSuccessionSecId,
			isUpdateSecurity: workspace.isUpdateSecurity,
			docAllFlag: workspace.docAllFlag,
			folderAllFlag: workspace.folderAllFlag,
			tagAllFlag: workspace.tagAllFlag,
			secAllFlag: workspace.secAllFlag,
			isDspAttributeInfo: workspace.isDspAttributeInfo,
			docList: workspace.docList,
			folderList: workspace.folderList,
			tagList: workspace.tagList,
			secList: workspace.secList,
			entryTypeList: workspace.entryTypeList,
			entryList: workspace.entryList,
		};

		return this.httpService.postForForm('/admin/workspace/actUpdateWorkSpace.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res);
	  }));
	}

		/**
	 * ワークスペースを削除します.
	 */
	public delete(objId: number): Observable<any> {
		let params: any = {
			objId: objId,
		};
		return this.httpService.postForForm('/admin/workspace/actDeleteWorkSpace.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res);
	  }));
	}

	/**
	 * ワークスペース情報を取得します.
	 * @param objId 対象ワークスペースID
	 * @return 承認依頼用オブジェクト情報
	 */
	public dspProperty(objId: number): Observable<EIMWorkspaceProperty> {
		let params: any = {
			wsId: objId,
		};
		return this.httpService.get('/admin/workspace/dspProperty.jsp', params)
				.pipe(mergeMap((res: any) => {
					return of(super.convertToWorkspaceProperty(res));
				}));
	}

	public getAdminEntryList(objId: number): Observable<EIMEntryDTO[]> {
		let params: any = {
			wsId: objId,
		};
		return this.httpService.get('/admin/workspace/dspAdminEntryList.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value.entryList.entry,
				(_json: any) => {
					return new EIMEntryDTO(_json.attr);
				}));
	  }));
	}

	/**
	 * 選択ワークスペースの編集/削除可否を取得します.
	 * @param objId 対象ワークスペースID
	 * @return 編集/削除可否
	 */
	public dspWorkspaceAuth(objId: number): Observable<any> {
		let params: any = {
			objId: objId,
		};
		return this.httpService.get('/admin/folder/dspWorkspaceAuth.jsp', params, false)
		.pipe(mergeMap((res: any) => {
			return of(res);
	  }));
	}

		/**
	 * ワークフロー（マスタ）情報を取得します.
	 * @param objTypeId オブジェクトタイプID
	 * @return ワークフロー（マスタ）情報
	 */
	public getWorkFlow(objTypeId: number): Observable<EIMWorkflow> {
		return this.httpService.get('/admin/workspace/dspObjectWorkFlow.jsp',
				{objTypeId: objTypeId}, false)
			.pipe(mergeMap((res: any) => {
				if (!res.value.statusTypeList) {
					return [];
				}
				let workflow: EIMWorkflow = {
						objId: Number(res.value.statusTypeList.attr.workflowId),
						objName: res.value.statusTypeList.attr.workflowName,
						statusTypes: []
				};

				let statusTypeJson: any[] = res.value.statusTypeList.statusType;
				if (!statusTypeJson) {
					statusTypeJson = [];
				} else if (!Array.isArray(statusTypeJson)) {
					statusTypeJson = [statusTypeJson];
				}

				for (let i = 0; i < statusTypeJson.length; i++) {
					workflow.statusTypes.push({
							objId: statusTypeJson[i].attr.statusTypeId,
							objName: statusTypeJson[i].attr.statusTypeName
					});
				}
				return of(workflow);
			}));
	}

	/**
	 * ワークスペース使用制限タイプ情報を取得します.
	 * @param objId 対象ワークスペースID
	 * @return 使用制限タイプ情報
	 */
	public dspSelectableObjectTypeTree(objId: number): Observable<EIMSelectableObjectType> {
		return this.httpService.get('/admin/workspace/dspSelectableObjectTypeTree.jsp', {wsId: objId})
				.pipe(mergeMap((res: any) => {
					let data: EIMSelectableObjectType = {
						documentTypeList: {
							objType: this.jsonService.convertHierarchicalDomain(res.value.result.documentTypeList.objType, 'objType',
							(json: any): EIMHierarchicalObjectTypeDomain => {

								let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
								objType.id = Number(json.attr.objTypeId);
								objType.name = json.attr.objTypeName;
								objType.selected = json.attr.selected === 'true';
								return objType;
							}),
							isAllDocType: (res.value.result.documentTypeList.attr.isAllDocType === 'true'),
						},
						folderTypeList: {
							objType: this.jsonService.convertHierarchicalDomain(res.value.result.folderTypeList.objType, 'objType',
							(json: any): EIMHierarchicalObjectTypeDomain => {

								let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
								objType.id = Number(json.attr.objTypeId);
								objType.name = json.attr.objTypeName;
								objType.selected = json.attr.selected === 'true';
								return objType;
							}),
							isAllFolderType: (res.value.result.folderTypeList.attr.isAllFolderType === 'true'),
						},
						tagTypeList: {
							objType: this.jsonService.convertHierarchicalDomain(res.value.result.tagTypeList.objType, 'objType',
							(json: any): EIMHierarchicalObjectTypeDomain => {

								let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
								objType.id = Number(json.attr.objTypeId);
								objType.name = json.attr.objTypeName;
								objType.selected = json.attr.selected === 'true';
								return objType;
							}),
							isAllTagType: (res.value.result.tagTypeList.attr.isAllTagType === 'true'),
						},
					};
					return of(data);
				}));
	}

	/**
	 * ワークスペース使用制限セキュリティ情報を取得します.
	 * @param objId 対象ワークスペースID
	 * @return 使用制限セキュリティ情報
	 */
	public dspSelectableSecurity(objId: number): Observable<EIMSelectableSecurity> {
		return this.httpService.get('/admin/workspace/dspSelectableSecurityTree.jsp', {wsId: objId})
				.pipe(mergeMap((res: any) => {
					let data: EIMSelectableSecurity = {
						security: this.jsonService.getJsonChildren(res.value.result.secList.security,
							(json: any): EIMSecurity => {
								return {
									secId : Number(json.attr.secId),
									secName: json.attr.secName,
								}
							}),
						isAllSec: (res.value.result.secList.attr.isAllSec === 'true'),
					};
					return of(data);
				}));
	}


	/**
	 * 使用可能セキュリティリストを取得します.
	 */
	public getAllSecurityList(initFlag: boolean, securityName: string): Observable<EIMSecurity[]> {
		return this.httpService.postForForm('/admin/workspace/dspAllSecurityList.jsp',
				{initFlag: initFlag, securityName: securityName})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.secList.security, this.sercurityService.convertToEIMSecurity));
			}));
	}
}
