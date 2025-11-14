import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

/** 回付状況一覧 */
export interface EIMCirculationList {
	objId?: number;
	objTypeId?: number;
	objName?: string;
	number?: string;
	isWorkflowFolder?: boolean;
	isFolder?: boolean;
	isDocument?: boolean;
	isFullPath?: boolean;
	objTypeName?: string;
	rev?: number;
	isPDFJoinFailed?: boolean;
	statusId?: number;
	statusTypeName?: string;
	statusTypeKind?: number;
	readOnly?: boolean;
	isPublished?: boolean;
	isProcessingPublic?: boolean;
	isDspPubIconForNoWF?: boolean;
	isNoWFPublic?: boolean;
	requestUser?: string;
	requestDate?: string;
	nextApprover?: string;
	path?: string;
	ocrProcessStatus?: number;
	ocrResultStatus?: number;
	expiration?: boolean;
	lockUserName?: string;
	isDocumentLink?: boolean;
	isDspPdfIcon?: boolean;
	pdfConversionStatus?: number;
	isOldVer?: boolean;
	isPdfPreRegistered?: boolean;
}

/**
 * 回付状況確認APIサービス
 */
@Injectable()
export class EIMCirculationService {

	/**
	 * コンストラクタ
	 */
	constructor(
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
	) {
	}

	/**
	 * 検索条件に合致する回付状況一覧を取得します.
	 * @param params 検索条件
	 * @return 回付状況一覧検索結果
	 */
	public getCirculationList(params: any): Observable<EIMCirculationList[]> {
		return this.httpService.postForForm('/app/document/approve/actCirculationSearch.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.objList.object, this.convertToEIMCirculationList));
			}));
	}

	/**
	 * 回付状況一覧に変換します.
	 * @param json 変換対象
	 * @return 回付状況一覧
	 */
	private convertToEIMCirculationList(json: any): EIMCirculationList {
		return {
			objId: Number(json.attr.objId),
			objTypeId: Number(json.attr.objTypeId),
			objName: json.attr.objName,
			number: json.attr.number,
			isWorkflowFolder: json.attr.isWFFolder === 'true' ? true : false,
			isFolder: json.attr.isFolder === 'true' ? true : false,
			isDocument: json.attr.isDocument === 'true' ? true : false,
			isFullPath: json.attr.isFullPath === 'true' ? true : false,
			objTypeName: json.attr.objTypeName,
			rev: json.attr.rev === '-' ? null : Number(json.attr.rev) ,
			isPDFJoinFailed: json.attr.isPDFJoinFailed === 'true' ? true : false,
			statusId: Number(json.attr.statusId),
			statusTypeName: json.attr.statusTypeName,
			statusTypeKind: Number(json.attr.statusTypeKind),
			readOnly: json.attr.readOnly === 'true' ? true : false,
			isPublished: json.attr.isPublished === 'true' ? true : false,
			isProcessingPublic: json.attr.isProcessingPublic === 'true' ? true : false,
			isDspPubIconForNoWF: json.attr.isDspPubIconForNoWF === 'true' ? true : false,
			isNoWFPublic: json.attr.isNoWFPublic === 'true' ? true : false,
			requestUser: json.attr.requestUser,
			requestDate: json.attr.requestDate,
			nextApprover: json.attr.nextApprover === '' ? '-' : json.attr.nextApprover,
			path: json.attr.path,
			ocrProcessStatus: Number(json.attr.ocrProcessStatus),
			ocrResultStatus: Number(json.attr.ocrResultStatus),
			expiration: json.attr.expiration === 'true' ? true : false,
			lockUserName: json.attr.lockUserName,
			isDocumentLink: json.attr.isDocumentLink === 'true' ? true : false,
			isDspPdfIcon: json.attr.isDspPdfIcon === 'true' ? true : false,
			pdfConversionStatus: Number(json.attr.pdfConversionStatus),
			isOldVer: json.attr.isOldVer === 'true' ? true : false,
			isPdfPreRegistered: json.attr.isPdfPreRegistered === 'true' ? true : false,
		}
	}
}
