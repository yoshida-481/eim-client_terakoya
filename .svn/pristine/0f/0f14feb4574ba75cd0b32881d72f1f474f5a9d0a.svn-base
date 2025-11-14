
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { EIMWorkflow } from 'app/documents/shared/services/apis/workflow.service';
import { EIMHierarchicalObjectTypeDomain } from 'app/admins/shared/domains/hierarchical-object-type.domain';
import { EIMEntryDTO } from 'app/shared/dtos/entry.dto';
import { EIMSecurity, EIMSecurityService } from 'app/documents/shared/services/apis/security.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';


/** ワークスペース情報 */
export interface EIMWorkspace {
	objName: string,
	objId?: number,
	secId: number,
	lowerSuccessionSecId?: number,
	checkedLowerSuccession?: string,
	isUpdateSecurity?: string,
	isManualDeleteFlag: boolean,
	docAllFlag: boolean,
	folderAllFlag: boolean,
	tagAllFlag: boolean,
	secAllFlag: boolean,
	isDspAttributeInfo: number,
	docList?: number[],
	folderList?: number[],
	tagList?: number[],
	secList?: number[],
	entryTypeList?: number[],
	entryList?: number[],
}

/** ワークスペースプロパティ情報 */
export interface EIMWorkspaceProperty {
	objId: number,
	objTypeId: number,
	objTypeName: string,
	objName: string,
	secId: number,
	secName: string,
	secDefName: string,
	checkedThisLowerSuccession: boolean,
	lowerSuccessionSecId?: number,
	lowerSuccessionSecName?: string,
	nameAllocate: number,
	isManualDeleteFlag: boolean,
	isWorkspaceSystemAuth: boolean,
}

/** 使用可能オブジェクトタイプ情報 */
export interface EIMSelectableObjectType {
	documentTypeList: {
		isAllDocType: boolean,
		objType: EIMHierarchicalObjectTypeDomain[],
	},
	folderTypeList: {
		isAllFolderType: boolean,
		objType: EIMHierarchicalObjectTypeDomain[],
	},
	tagTypeList: {
		isAllTagType: boolean,
		objType: EIMHierarchicalObjectTypeDomain[],
	},
}

/** 使用可能セキュリティ情報 */
export interface EIMSelectableSecurity {
	isAllSec: boolean,
	security: EIMSecurity[],
}

/**
 * ワークスペースAPIサービス
 */
@Injectable()
export class EIMWorkspaceService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected dateService: EIMDateService,
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService,
		protected sercurityService: EIMSecurityService,
		protected attributeService: EIMDocumentsAttributeDomainService) {}

	/**
	 * ワークスペースのリストを取得します.
	 * @return ワークスペースのリスト
	 */
	public getList(): Observable<any[]> {
		return this.httpService.get('/admin/workspace/dspWorkSpaceTree.jsp')
		.pipe(mergeMap((res: any) => {
			let wsList = res.value.wsList.workSpace;
			return of(this.domainService.createObjectList(wsList,
				(_json: any) => {
					return  new _json;
				}));
	}));
}

	/**
	 * ワークスペースを作成します.
	 * @param workspace ワークスペース情報
	 * @return 作成完了ワークスペース情報
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
			isManualDeleteFlag: workspace.isManualDeleteFlag,
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
		return this.httpService.postForForm('/app/document/workspace/actCreateWorkSpace.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res.value.object.attr);
		}));
	}

	/**
	 * ワークスペースを更新します.
	 * @param workspace ワークスペース情報
	 * @return 更新完了ワークスペース情報
	 */
	public update(workspace: EIMWorkspace): Observable<any> {
		let params: any = {
			objName: workspace.objName,
			objId: workspace.objId,
			secId: workspace.secId,
			checkedLowerSuccession: workspace.checkedLowerSuccession,
			lowerSuccessionSecId: workspace.lowerSuccessionSecId,
			isUpdateSecurity: workspace.isUpdateSecurity,
			isManualDeleteFlag: workspace.isManualDeleteFlag,
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
		return this.httpService.postForForm('/app/document/workspace/actUpdateWorkSpace.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res);
		}));
	}

	/**
	 * ワークスペースを削除します.
	 * @param objId 削除対象ワークスペースID
	 * @return 削除完了ワークスペース情報
	 */
	public delete(objId: number): Observable<any> {
		let params: any = {
			objId: objId,
		};
		return this.httpService.postForForm('/app/document/workspace/actDeleteWorkSpace.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res);
		}));
	}

	/**
	 * ワークスペース情報を取得します.
	 * @param objId 対象ワークスペースID
	 * @return 承認依頼用オブジェクト情報
	 */
	public dspProperty(objId: number, displayProgressDialog?: boolean): Observable<EIMWorkspaceProperty> {
		let params: any = {
			wsId: objId,
		};
		return this.httpService.get('/app/document/workspace/dspProperty.jsp', params, displayProgressDialog)
				.pipe(mergeMap((res: any) => {
					return of(this.convertToWorkspaceProperty(res));
				}));
	}

	/**
	 * ワークスペース管理者情報を取得します.
	 * @param objId 対象ワークスペースID
	 * @return ワークスペース管理者情報
	 */
	public getAdminEntryList(objId: number, displayProgressDialog?: boolean): Observable<EIMEntryDTO[]> {
		let params: any = {
			wsId: objId,
		};
		return this.httpService.get('/app/document/workspace/dspAdminEntryList.jsp', params, displayProgressDialog)
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
		return this.httpService.get('/app/document/folder/dspWorkspaceAuth.jsp', params, false)
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
		return this.httpService.get('/app/document/workspace/dspObjectWorkFlow.jsp',
				{objTypeId: objTypeId}, false)
			.pipe(mergeMap((res: any) => {
				if (!res.value.statusTypeList) {
					return of(null);
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
	public dspSelectableObjectTypeTree(objId: number, displayProgressDialog?: boolean): Observable<EIMSelectableObjectType> {
		return this.httpService.get('/app/document/workspace/dspSelectableObjectTypeTree.jsp', {wsId: objId}, displayProgressDialog)
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
	public dspSelectableSecurity(objId: number, displayProgressDialog?: boolean): Observable<EIMSelectableSecurity> {
		return this.httpService.get('/app/document/workspace/dspSelectableSecurityTree.jsp', {wsId: objId}, displayProgressDialog)
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
	 * @param initFlag 初期表示時検索フラグ
	 * @param securityName 検索名称
	 * @return 使用可能セキュリティ検索結果
	 */
	public getAllSecurityList(initFlag: boolean, securityName: string): Observable<EIMSecurity[]> {
		return this.httpService.postForForm('/app/document/workspace/dspAllSecurityList.jsp',
				{initFlag: initFlag, securityName: securityName})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.secList.security, this.sercurityService.convertToEIMSecurity));
			}));
	}

	/**
	 * 使用可能セキュリティリストを取得します.
	 * @param _json 変換対象JSON
	 * @return ワークスペースプロパティ情報
	 */
	protected convertToWorkspaceProperty(_json: any): EIMWorkspaceProperty {
		let property: EIMWorkspaceProperty = {
			objId: Number(_json.value.object.attr.objId),
			objTypeId: Number(_json.value.object.attr.objTypeId),
			objTypeName: _json.value.object.attr.objTypeName,
			objName: _json.value.object.attr.objName,
			secId: Number(_json.value.object.attr.secId),
			secName: _json.value.object.attr.secName,
			secDefName: _json.value.object.attr.secDefName,
			checkedThisLowerSuccession: _json.value.object.attr.checkedThisLowerSuccession === 'true',
			nameAllocate: Number(_json.value.object.attr.nameAllocate),
			isManualDeleteFlag: _json.value.object.attr.isManualDeleteFlag === 'true',
			isWorkspaceSystemAuth:_json.value.object.attr.isWorkspaceSystemAuth === 'true',
		};

		if (property.checkedThisLowerSuccession) {
			property.lowerSuccessionSecId = Number(_json.value.object.attr.lowerSuccessionSecId);
			property.lowerSuccessionSecName = _json.value.object.attr.lowerSuccessionSecName;
		}
		return property;
	}

}
