import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMContentsNameRenameGeneralPipe } from 'app/documents/shared/pipes/contents-name-rename-general.pipe';
import { TranslateService } from '@ngx-translate/core';
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

export interface EIMFormatInfo {
	formatId?: number;
	formatName?: string;
	label?: string;
	typeLabel?: string;
	path?: string;
	typeName?: string;
}


/**
 * クラスAPIサービス
 */
@Injectable()
export class EIMClassService {

	constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected documentsCacheService: EIMDocumentsCacheService,
			protected serverConfigService: EIMServerConfigService,
			protected contentsNameRenameGeneralPipe: EIMContentsNameRenameGeneralPipe,
			protected translateService: TranslateService) {}

	/**
	 * クラスタイプ一覧の階層を取得します.
	 * @param selectedObjTypeId 選択したオブジェクトタイプID
	 * @return nodeData クラスタイプ一覧階層データ
	 */
	public getHierarchical(selectedObjTypeId?: number): Observable<EIMHierarchicalObjectTypeDomain[]> {
		let params: any = {};
		if (selectedObjTypeId) {
			params['selectedObjTypeId'] = selectedObjTypeId;
		}
		return this.httpService.get('/admin/object/dspObjectTypeTree.jsp', params)
		.pipe(mergeMap((res: any) => {
			let nodeList = res.value.nodes.node;
			let nodeData: any[] = this.jsonService.convertHierarchicalDomain(
				nodeList, 'node',
				(json: any): EIMHierarchicalObjectTypeDomain => {
					let objType: EIMHierarchicalObjectTypeDomain = new EIMHierarchicalObjectTypeDomain();
					objType.id = Number(json.attr.objTypeId);
					objType.name = json.attr.label;
					objType.definitionName =  json.attr.rootObjTypeDefName;
					return objType;
				});
			return of(nodeData)
		}));
	}

	/**
	 * フォーマットリストを取得します.
	 * @param name 検索文字列
	 * @return 検索結果
	 */
	public getFormatList(name: string): Observable<EIMFormatInfo[]> {
		let params: any = {};
		params['formatName'] = name;
		return this.httpService.postForForm('/admin/object/dspFormatList.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.formats.format, this.convertToFormatInfo));
			}));
	}

	/**
	 * フォーマット情報のコンバート
	 * @param json JSON
	 * @return コンバート結果
	 */
	private convertToFormatInfo(json: any): EIMFormatInfo {
		return {
			formatId: Number(json.attr.formatId),
			formatName: json.attr.formatName,
			typeLabel: json.attr.formatName,
			path: json.attr.path,
			typeName : 'format',
		}
	}
}
