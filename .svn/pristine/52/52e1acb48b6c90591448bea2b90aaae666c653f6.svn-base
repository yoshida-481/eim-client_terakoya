import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';


import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

export interface EIMHierarchicalContents extends EIMHierarchicalDomain {
	label: string,
	objTypeId: number,
	objTypeName: string,
	objName: string,
	rootObjTypeDefName: string,
	isRootType: boolean,
}
/*
export interface EIMFolderType {
	objTypeId: number,
	objTypeName:string,
	children:EIMFolderType[]
}
*/
/**
 * 階層コンテンツAPIサービス
 */
@Injectable()
export class EIMHierarchicalContentsService {

	constructor(
		private httpService: EIMHttpService,
		private jsonService: EIMJSONService,
		private hierarchicalDomainService: EIMHierarchicalDomainService) {}

	/**
	 * コンテンツルート階層を取得します.
	 * @param isReturnFirstWSFolder 1番上のワークスペース配下のフォルダも返却する場合true
	 */
	public getRoot(isReturnFirstWSFolder = true): Observable<any> {

		return this.httpService.get('/admin/object/dspObjectTypeTree.jsp', {isReturnFirstWSFolder: isReturnFirstWSFolder})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.convertHierarchicalDomain(res.value.nodes.node, 'node', this.convertToEIMHierarchicalContents));
			}));
	}

	/**
	 * 指定オブジェクトを元にルートまでのツリー情報を取得します.
	 */
	public getFolderTreeForTarget(id: number): Observable<any> {

		return this.httpService.get('/admin/object/dspAttributeType.jsp',
				{objTypeId: id})
			.pipe(mergeMap((res: any) => {
					return of(this.jsonService.convertHierarchicalDomain(res.value.nodes.node, 'node', this.convertToEIMHierarchicalContents));
				}));
	}

	private convertToEIMHierarchicalContents(json: any): EIMHierarchicalContents {

		return {
			label: json.attr.label,
			objName: json.attr.label,
			objTypeId: Number(json.attr.objTypeId),
			objTypeName: json.attr.objTypeName,
			rootObjTypeDefName: json.attr.rootObjTypeDefName,
			isRootType: json.attr.isRootType
		}
	}

}
