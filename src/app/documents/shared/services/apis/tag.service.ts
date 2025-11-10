import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';


/** タグ一覧情報 */
export interface EIMTagList {
	objId?: number;
	objName?: string;
	objTypeName?: string;
	path?: string;
}

/** タグ割当情報 */
export interface EIMTagInfo {
	objId?: number;
	objName?: string;
	objTypeName?: string;
	isDspPdfIcon?: boolean;
	isDspPubIconForNoWF?: boolean;
	statusTypeKind?: string;
	isDocumentLink?: boolean;
	isWorkflowFolder?: boolean;
	expiration?: boolean;
	readOnly?: boolean;
	path?: string;
	rev?: number;
	signencr?: number;
	addUser?: string;
	addDate?: string;
	addDateTime?: string;
}

/**
 * タグAPIサービス
 */
@Injectable()
export class EIMTagService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected dateService: EIMDateService,
		protected domainService: EIMDomainService,
		protected attributeService: EIMDocumentsAttributeDomainService,
		protected serverConfigService: EIMServerConfigService
) {}

	/**
	 * 取得したjsonデータをドメインに変換します.
	 * @param json jsonデータ
	 * @return 変換結果
	 */
	private convertToEIMTagList(json: any): EIMTagList {
		return {
			objId: json.attr.objId,
			objName: json.attr.objName,
			objTypeName: json.attr.objTypeName,
			path: json.attr.path,
		}
	}

	/**
	 * 取得したjsonデータをドメインに変換します.
	 * @param json jsonデータ
	 * @return 変換結果
	 */
	private convertToEIMTagInfo(json: any): EIMTagInfo {
		return {
			objId: json.attr.objId,
			objName: json.attr.objName,
			objTypeName: json.attr.objTypeName,
			isDspPdfIcon: json.attr.isDspPdfIcon,
			isDspPubIconForNoWF: json.attr.isDspPubIconForNoWF,
			statusTypeKind: json.attr.statusTypeKind,
			isDocumentLink: json.attr.isDocumentLink,
			isWorkflowFolder: json.attr.isWorkflowFolder,
			expiration: json.attr.expiration,
			readOnly: json.attr.readOnly,
			path: json.attr.path,
			rev: json.attr.rev,
			signencr: json.attr.signencr,
			addUser: json.attr.addUser,
			addDate: json.attr.addDate,
			addDateTime: json.attr.addDateTime,
		}
	}

	/**
	 * 引数のIDに紐づくタグ一覧を取得します.
	 * @param id タグID
	 * @return タグ一覧
	 */
	public getObjectAddedTagList(id: number): Observable<any> {
		return this.httpService.get('/app/document/tag/dspAddedTag.jsp', {objId: id}).pipe(mergeMap((res: any) => {
			return of(this.jsonService.getJsonChildren(res.value.tagList.tagObject, this.convertToEIMTagList));
		}));
	}

	/**
	 * 引数のIDに紐づくタグ割当情報を取得します.
	 * @param id タグID
	 * @return タグ割当情報
	 */
	public getObjectAssignedTagInfoList(id: number): Observable<any> {
		return this.httpService.get('/app/document/tag/dspTag.jsp', {objId: id}).pipe(mergeMap((res: any) => {
			return of(this.jsonService.getJsonChildren(res.value.objectList.object, this.convertToEIMTagInfo));
		}));
	}

	/**
	 * 引数のIDに紐づくタグ割当権限情報を取得します.
	 * @param id タグID
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 * @return タグ割当権限情報
	 */
	public getAssignedTagAdminInfo(id: number, displayErrorDialog: boolean): Observable<any> {
		return this.httpService.get('/app/document/tag/dspAddTagA.jsp', {objId: id}, true, displayErrorDialog)
		.pipe(mergeMap((res: any) => {
			return of(this.jsonService.getJsonChildren(res.value.objectList.object, this.convertToEIMTagInfo));
		}));
	}

	/**
	 * 選択したタグを割当てます．
	 * @param isAddedFolder
	 * @param objId
	 * @param objIdToAddDelTag
	 * @return 割当結果
	 */
	public applyTagAllocation(isAddedFolder: boolean[], objId: number, objIdToAddDelTag: number[]): Observable<any> {
		let params: any = {};
		params.isAddedFolder = isAddedFolder.join(',');
		params.objId = objId;
		params.objIdToAddDelTag = objIdToAddDelTag.join(',');

		return this.httpService.postForForm('/app/document/tag/actAddTagA.jsp', params).pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * タグ割当情報エクスポート.
	 * @param id タグID
	 * @param displayErrorDialog エラーダイアログ表示フラグ
	 */
	public getExportList(id: number, displayErrorDialog): void {
		let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadExportList?objId=' + id, 'checkoutFrame');
	}

	/**
	 * タグを作成します.
	 * @param contents コンテンツ
	 * @param parentObjId 親オブジェクトID
	 * @return タグ作成結果
	 */
	public create(contents: EIMContentsDomain, parentObjId: number): Observable<null> {
		// パラメータを設定
		let params: any = {
				objId: parentObjId,
				objTypeId: contents.type.id,
				objName: contents.name,
				createUserId: contents.creationUser.id,
				isDspAttributeInfo: 1,
				isReturnObjectId: true,
		};

		// 表示している属性一覧を取得
		let attributeTypeLayoutList = contents.formLayout.objectTypeLayout.attributeTypeLayoutList;
		let attributeList: EIMAttributeDomain[] = this.attributeService.getVisibleAttributeList(contents.attributeList, attributeTypeLayoutList);

		// 各属性をパラメータに設定
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMAttributeDomain = attributeList[i];
			let attrKeyPrefix: string = 'attType_' + attribute.attributeType.id + '_';
			// 属性値
			this.attributeService.setAttributeParams(params, attrKeyPrefix, attribute);
		  // 読み込み専用
			let isReadOnly = false;
			for (let j = 0; j < attributeTypeLayoutList.length; j++) {
				let attributeTypeLayout = attributeTypeLayoutList[j];
				if (attribute.attributeType.id === attributeTypeLayout.id && attributeTypeLayout.successionFlag) {
					isReadOnly = true;
				}
			}
			params[attrKeyPrefix + 'readOnly'] = isReadOnly;
		}
		return this.httpService.postForForm('/app/document/tag/actCreateTag.jsp', params).pipe(mergeMap((res: any) => {
			return of(res.value.object.attr);
		}));
	}
}
