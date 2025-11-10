import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMContentsNameRenameGeneralPipe } from 'app/documents/shared/pipes/contents-name-rename-general.pipe';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

export interface EIMAttrType {
	attTypeId?: number,
	attTypeName?: string,
	objTypeId?: number,
	objTypeName?: string,
	valTypeId?: number,
	valTypeName?: string,
	attTypeEssential?: boolean;
	inputRuleValue?: string;
	isMultipleValue?: string;
}

/**
 * オブジェクトタイプAPIサービス
 */
@Injectable()
export class EIMObjectTypeService {

	constructor(
			protected httpService: EIMDocumentsHttpService,
			protected jsonService: EIMJSONService,
			protected documentsCacheService: EIMDocumentsCacheService,
			protected serverConfigService: EIMServerConfigService,
			protected contentsNameRenameGeneralPipe: EIMContentsNameRenameGeneralPipe,
			protected translateService: TranslateService) {}

	/**
	 * オブジェクトタイプIDから属性タイプリストを取得します.
	 */
	public getListByObjectTypeId(objTypeId: number): Observable<EIMAttrType[]> {
		return this.httpService.postForForm('/app/document/workspace/dspObjectAttributeType.jsp',
				{objTypeId: objTypeId}, false)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.attTypes.attType, this.convertToEIMAttrType));
			}));
	}

	/**
	 * オブジェクトタイプ一覧の階層を取得します.
	 * 結果はキャッシュされます.
	 * @param workspaceObjId ワークスペースID（ワークスペースで絞り込まない場合はnullを指定する）
	 * @param typeName 取得対象のタイプ定義名称
	 */
	public getHierarchical(workspaceObjId: number, typeName: string): Observable<EIMHierarchicalObjectTypeDomain[]> {

		let data: EIMHierarchicalObjectTypeDomain[] = this.documentsCacheService.getHierarchicalObjectTypes(workspaceObjId, typeName);
		if (data.length > 0) {
			return of(data);
		}

		if (!workspaceObjId) {
			// ワークスペースの使用可能タイプでの絞り込みなし
			return this.httpService.get('/app/document/workspace/dspAllObjectTypeTree.jsp')
				.pipe(mergeMap((res: any) => {
					let nodes: any[] =
						this.jsonService.convertHierarchicalDomain(this.getTargetObjectType(res.value.objTypeList.objType, typeName), 'objType',
							(json: any): EIMHierarchicalObjectTypeDomain => {

								let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
								objType.id = Number(json.attr.objTypeId);
								objType.name = json.attr.objTypeName;

								return objType;
							});

					if (workspaceObjId == 0) {
						// 一般ドキュメントタイプ追加
						if (this.serverConfigService.isGeneralDocVisible) {
							let generalDocumentObjType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
							generalDocumentObjType.id = nodes[0].id;
							generalDocumentObjType.name = nodes[0].name;
							generalDocumentObjType.parent = null;
							generalDocumentObjType.children = [];
							nodes[0].children.splice(0, 0, generalDocumentObjType);
						}
						this.documentsCacheService.setHierarchicalObjectTypes(workspaceObjId, typeName, nodes[0].children);
						return of(nodes[0].children);
					}

					this.documentsCacheService.setHierarchicalObjectTypes(workspaceObjId, typeName, nodes);
					return of(nodes)
				}));
		}
		if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT) {
			return this.httpService.get('/app/document/object/dspFixedFormDocumentList.jsp', {objId: workspaceObjId})
				.pipe(mergeMap((res: any) => {

					let nodes: any[] =
						this.jsonService.convertHierarchicalDomain(res.value.objTypeList.objTypecreateFixedFormDocument, 'objTypecreateFixedFormDocument',
							(json: any): EIMHierarchicalObjectTypeDomain => {

								let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
								objType.id = Number(json.attr.objTypeId);
								objType.name = json.attr.label;

								return objType;
							});

					// 一般ドキュメントタイプ追加
					if (this.serverConfigService.isGeneralDocVisible) {
						let generalDocumentObjTypeJson: any = res.value.objTypeList.objTypeGeneralDocument;
						let generalDocumentObjType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
						generalDocumentObjType.id = Number(generalDocumentObjTypeJson.attr.objTypeId);
						generalDocumentObjType.name = this.contentsNameRenameGeneralPipe.transform(generalDocumentObjTypeJson.attr.label);
						generalDocumentObjType.parent = null;
						generalDocumentObjType.children = [];
						nodes.splice(0, 0, generalDocumentObjType);
					}

					this.documentsCacheService.setHierarchicalObjectTypes(workspaceObjId, typeName, nodes);

					return of(nodes);
				}));
		} else if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER) {
			let isReturnGeneralFolder: boolean = this.serverConfigService.isGeneralFolVisible;
			return this.httpService.get('/app/document/folder/dspFixedFormFolderList.jsp', {objId: workspaceObjId, isReturnGeneralFolder: isReturnGeneralFolder})
			.pipe(mergeMap((res: any) => {

				let nodes: any[] =
					this.jsonService.convertHierarchicalDomain(res.value.objTypeList.objType, 'objType',
						(json: any): EIMHierarchicalObjectTypeDomain => {

							let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
							objType.id = Number(json.attr.objTypeId);
							objType.name = json.attr.label;

							return objType;
						});

				// 一般フォルダタイプ追加
				if (this.serverConfigService.isGeneralFolVisible) {
					let generalFolderObjTypeJson: any = res.value.objTypeList.objTypeGeneralFolder;
					let generalFolderObjType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
					generalFolderObjType.id = Number(generalFolderObjTypeJson.attr.objTypeId);
					generalFolderObjType.name =  this.contentsNameRenameGeneralPipe.transform(generalFolderObjTypeJson.attr.label);
					generalFolderObjType.parent = null;
					generalFolderObjType.children = [];
					nodes.splice(0, 0, generalFolderObjType);
				}

				this.documentsCacheService.setHierarchicalObjectTypes(workspaceObjId, typeName, nodes);

				return of(nodes)
			}));
		} else if (typeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG) {
			return this.httpService.get('/app/document/tag/dspFixedFormTagList.jsp', {objId: workspaceObjId})
			.pipe(mergeMap((res: any) => {

				let nodes: any[] =
					this.jsonService.convertHierarchicalDomain(res.value.objTypeList.objType, 'objType',
						(json: any): EIMHierarchicalObjectTypeDomain => {

							let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
							objType.id = Number(json.attr.objTypeId);
							objType.name = json.attr.label;

							return objType;
						});

				// 一般タグタイプ追加
					let generalTagObjTypeJson: any = res.value.objTypeList;
					let generalTagObjType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
					generalTagObjType.id = Number(generalTagObjTypeJson.attr.generalTagId);
					generalTagObjType.name = this.contentsNameRenameGeneralPipe.transform(this.translateService.instant('EIM_DOCUMENTS.TAG'));
					generalTagObjType.parent = null;
					generalTagObjType.children = [];
					nodes.splice(0, 0, generalTagObjType);

				this.documentsCacheService.setHierarchicalObjectTypes(workspaceObjId, typeName, nodes);

				return of(nodes)
			}));
		} else {
			return of([]);
		}
	}

	/**
	 * オブジェクトタイプ定義名称に合致するJSONを返却します.
	 * @param json JSON
	 * @param objectTypeName 検索するオブジェクトタイプ定義名称
	 * @return オブジェクトタイプのJSON
	 */
	private getTargetObjectType(objectTypeJsons: any[], objectTypeName: string): any[] {
		for (let i = 0; i < objectTypeJsons.length; i++) {
			if (objectTypeJsons[i].attr.rootObjTypeDefName === objectTypeName) {
				return [objectTypeJsons[i]];
			}
		}

		return [];
	}

	private addPath(data: EIMHierarchicalDomain[]): void {
	}

	private convertToEIMAttrType(json: any): EIMAttrType {
		return {
			attTypeId: Number(json.attr.attTypeId),
			attTypeName: json.attr.attTypeName,
			objTypeId: Number(json.attr.objTypeId),
			objTypeName: json.attr.objTypeName,
			valTypeId: Number(json.attr.valTypeId),
			valTypeName: json.attr.valTypeName,
			attTypeEssential: json.attr.attTypeEssential === 'true' ? true : false,
			inputRuleValue: json.attr.inputRuleValue,
			isMultipleValue: json.attr.isMultipleValue,
		}
	}
}
