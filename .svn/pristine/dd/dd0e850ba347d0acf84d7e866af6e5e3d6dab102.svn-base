import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMHierarchicalObjectTypeDomain } from 'app/admins/shared/domains/hierarchical-object-type.domain';
import { EIMContentsNameRenameGeneralPipe } from 'app/documents/shared/pipes/contents-name-rename-general.pipe';
import { TranslateService } from '@ngx-translate/core';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';


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
export class EIMAdminsObjectTypeService {

	constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected adminsCacheService: EIMAdminsCacheService,
			protected serverConfigService: EIMServerConfigService,
			protected contentsNameRenameGeneralPipe: EIMContentsNameRenameGeneralPipe,
			protected translateService: TranslateService) {}

	/**
	 * オブジェクトタイプIDから属性タイプリストを取得します.
	 */
	public getListByObjectTypeId(objTypeId: number): Observable<EIMAttrType[]> {
		return this.httpService.postForForm('/admin/workspace/dspObjectAttributeType.jsp',
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

		let data: EIMHierarchicalObjectTypeDomain[] = this.adminsCacheService.getHierarchicalObjectTypes(workspaceObjId, typeName);
		if (data.length > 0) {
			return of(data);
		}

		if (!workspaceObjId) {
			// ワークスペースの使用可能タイプでの絞り込みなし
			return this.httpService.get('/admin/workspace/dspAllObjectTypeTree.jsp').pipe(mergeMap((res: any) => {
				let nodes: any[] =
					this.jsonService.convertHierarchicalDomain(this.getTargetObjectType(res.value.objTypeList.objType, typeName), 'objType',
						(json: any): EIMHierarchicalObjectTypeDomain => {

							let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
							objType.id = Number(json.attr.objTypeId);
							objType.name = json.attr.objTypeName;

							return objType;
						}
					);
				this.addPath(nodes);
				this.adminsCacheService.setHierarchicalObjectTypes(workspaceObjId, typeName, nodes);
				return of(nodes)
			}));
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
