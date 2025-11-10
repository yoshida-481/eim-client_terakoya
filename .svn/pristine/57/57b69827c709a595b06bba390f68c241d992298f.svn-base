import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';


import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

export interface EIMHierarchicalContents extends EIMHierarchicalDomain {
	objId: number,
	objTypeId: number,
	objTypeName: string,
	objName: string,
	isWorkflowFolder: boolean,
	tagListKind: number,
	secName?: string, // ワークスペースのみ
}
export interface EIMFolderType {
	objTypeId: number,
	objTypeName: string,
	children: EIMFolderType[]
}

/**
 * 階層コンテンツAPIサービス
 */
@Injectable()
export class EIMHierarchicalContentsService {

	constructor(
		private httpService: EIMDocumentsHttpService,
		private jsonService: EIMJSONService,
		private hierarchicalDomainService: EIMHierarchicalDomainService) {}

	/**
	 * コンテンツルート階層を取得します.
	 * @param isReturnFirstWSFolder 1番上のワークスペース配下のフォルダも返却する場合true
	 * @param targetRootObjectIds ルートのオブジェクトIDリスト（ルートを絞る場合に指定）
	 */
	public getRoot(isReturnFirstWSFolder = true, targetRootObjectIds?: Number[]): Observable<any> {

		let params = {isReturnFirstWSFolder: isReturnFirstWSFolder};
		if (targetRootObjectIds) {
			params['targetRootObjectIds'] = targetRootObjectIds.join(',');
		}

		return this.httpService.get('/app/document/folder/dspFolderTree.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.convertHierarchicalDomain(res.value.nodes.node, 'node', this.convertToEIMHierarchicalContents));
			}));
	}

	/**
	 * 指定オブジェクトを元にルートまでのツリー情報を取得します.
	 * @param id オブジェクトID
	 * @param targetRootObjectIds ルートのオブジェクトIDリスト（ルートを絞る場合に指定）
	 */
	public getFolderTreeForTarget(id: number, targetRootObjectIds?: Number[]): Observable<any> {

		let params = {ObjectId: id};
		if (targetRootObjectIds) {
			params['targetRootObjectIds'] = targetRootObjectIds.join(',');
		}

		return this.httpService.get('/app/document/folder/dspFolderTreeForTarget.jsp', params)
			.pipe(mergeMap((res: any) => {
					return of(this.jsonService.convertHierarchicalDomain(res.value.nodes.node, 'node', this.convertToEIMHierarchicalContents));
				}));
	}

	private convertToEIMHierarchicalContents(json: any): EIMHierarchicalContents {

		return {
			objId: json.attr.objId,
			objName: json.attr.label,
			objTypeId: json.attr.objTypeId,
			objTypeName: json.attr.objTypeName,
			isWorkflowFolder: json.attr.isWorkflowFolder,
			tagListKind: json.attr.tagListKind,
			secName: json.attr.secName
		}
	}

}
