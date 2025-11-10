import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

/**
 * コンテンツAPIサービス
 */
@Injectable()
export class EIMContentsService {

	constructor(
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected attributeService: EIMDocumentsAttributeDomainService,
	) {}

	/**
	 * 更新します.
	 */
	public update(contents: EIMContentsDomain): Observable<null> {
		// パラメータを設定
		let params: any = {
				objId: contents.id,
				objName: contents.name,
		};
		let attributeTypeLayoutList = contents.formLayout.objectTypeLayout.attributeTypeLayoutList;

		contents.attributeList = this.attributeService.getVisibleAttributeList(contents.attributeList, attributeTypeLayoutList)
		for (let i = 0; i < contents.attributeList.length; i++) {
			let attribute: EIMAttributeDomain = contents.attributeList[i];

			let attrKeyPrefix: string = 'attType_' + attribute.attributeType.id + '_';

			// 属性値
			this.attributeService.setAttributeParams(params, attrKeyPrefix, attribute);

			// 読み込み専用
			let isReadOnly = false;
			for (let j = 0; j < attributeTypeLayoutList.length; j++) {
				let attributeTypeLayout = attributeTypeLayoutList[j];
				if (Number(attribute.attributeType.id) === Number(attributeTypeLayout.id) && attributeTypeLayout.successionFlag) {
					isReadOnly = true;
				}
			}
			params[attrKeyPrefix + 'readOnly'] = isReadOnly;

			// 下位引継ぎ
			if (attribute['_lowSuccession']) {
				params[attrKeyPrefix + 'lowerSuccession'] = 1;
			}
		}

		// 名称割当
		params['attType_nameAllocate'] = contents['_nameAllocationAttributeTypeId'];

		return this.httpService.postForForm('/app/document/object/actUpdateAttribute.jsp', params)
		.pipe(mergeMap((res: any) => {
					return of(null);
		}));
	}

	/**
	 * 改名対象情報を取得します.
	 */
	public getRenameInfo(objId: number): Observable<any> {
		return this.httpService.get('/app/document/object/dspRename.jsp', {objId: objId})
			.pipe(mergeMap((res: any) => {
						return of(res.value.object);
			}));
	}

	/**
	 * 改名をします.
	 */
	public rename(objId: number, objName: string): Observable<any> {
		return this.httpService.postForForm('/app/document/object/actRenameObject.jsp', {objId: objId, objName: objName, isDspAttributeInfo: 0})
			.pipe(mergeMap((res: any) => {
						return of(res);
			}));
	}

	/**
	 * 署名・暗号化をします.
	 * objIds 対象オブジェクトID一覧
	 */
	public createSignencrDocument(objIds: number[]): Observable<null> {
		return this.httpService.postForForm('/app/document/object/actSignencr.jsp', {objId: objIds})
			.pipe(mergeMap((res: any) => {
						return of(null);
			}));
	}

	/**
	 * 削除をします.
	 */
	public delete(objIds: any[], parentObjIds: any[], isFolders: any[], isDocumentLinks: any[]): Observable<any> {

		// ObjIdを降順ソート
		objIds.sort((a, b) => {
			return (a < b ? 1 : -1);
		});
		return this.httpService.postForForm('/app/document/object/actDeleteObject.jsp', {objId: objIds, parentObjId: parentObjIds, isFolder: isFolders, isDocumentLink: isDocumentLinks})
			.pipe(mergeMap((res: any) => {
						return of(res);
			}));
	}

	/**
	 * 対象のドキュメントオブジェクトがブランチコピー可能かチェックします.
	 * objId 対象オブジェクトID
	 */
	public checkBranchCopy(objId: number): Observable<any> {
		return this.httpService.postForForm('/app/document/object/actCheckBranchCopy.jsp', {objId: objId})
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}
	/**
	 * 貼り付けをします.
	 * pasteTypes : COPY / CUT / BRANCH_COPY
	 */
	public paste(objIds: number[], parentObjIds: number[], pasteTypes: string[], isDocumentLinks: boolean[], fromParentObjIds: number[]): Observable<any> {
		return this.httpService.postForForm('/app/document/object/actPasteObject.jsp', {objId: objIds, parentObjId: parentObjIds, pasteType: pasteTypes, isDocumentLink: isDocumentLinks, fromParentObjId: fromParentObjIds})
			.pipe(mergeMap((res: any) => {
				let children: any[] = Array.isArray(res.value.object.object) ? res.value.object.object : [res.value.object.object];
				let objects: any[] = [];
				for (let i = 0; i < children.length; i++) {
					objects.push(children[i].attr);
				}
				return of(objects);
			}));
	}

	/**
	 * リンク貼り付けをします.
	 * pasteTypes : COPY / CUT / BRANCH_COPY
	 */
	public pasteLink(objIds: number[], linkUpdateTimings: number[], parentObjIds: number[], pasteTypes: string[], isDocumentLinks: boolean[]): Observable<any> {
		return this.httpService.get('/app/document/object/actPasteObjectLink.jsp', {objId: objIds, linkUpdateTiming: linkUpdateTimings, parentObjId: parentObjIds, pasteType: pasteTypes, isDocumentLink: isDocumentLinks})
			.pipe(mergeMap((res: any) => {
				let children: any[] = Array.isArray(res.value.object.object) ? res.value.object.object : [res.value.object.object];
				let objects: any[] = [];
				for (let i = 0; i < children.length; i++) {
					objects.push(children[i].attr);
				}
				return of(objects);
			}));
	}

	/**
	 * 存在チェックをします.
	 */
	public checkExistence(objId: number, parentObjId: number, isCheckDeleteRole: boolean, isDocumentLink: boolean, isCheckCut: boolean): Observable<any> {
		return this.httpService.get('/app/document/object/actCheckObjectExistWithParent.jsp',
				{ObjectId: objId, ParentObjectId: parentObjId, IsCheckDeleteRoll: isCheckDeleteRole, IsDocumentLink: isDocumentLink, IsCheckCut: isCheckCut}
		)
		.pipe(mergeMap((res: any) => {
			let object: any = {};
			object.objId = res.value.object_exist.attr.objId;
			return of(object);
		}));
	}

	/**
	 * 初期化をします.
	 * @param docIds 対象ドキュメント
	 * @param objId　フォルダ
	 * @return Observable
	 */
	public checkCombineAuthority(docIds?: string, objId?: string ): Observable<any> {
		return this.httpService.postForForm('/app/document/object/dspJoinDocuments.jsp',
				{doclds: docIds, objId: objId})
		.pipe(mergeMap((res: any) => {
			let object: any = {};
			object = res.value.results.object.attr;
			return of(object);
		}));
	}

	/**
	 * 結合処理をします.
	 * @param objTypeId オブジェクトタイプ
	 * @param fileName ファイル名
	 * @param olderObjId フォルダID
	 * @param 対象ドキュメント
	 * @return Observable
	 */
	public combine(objTypeId?: string , fileName?: string , folderObjId?: string, joinedDocIds?: string): Observable<any> {
		return this.httpService.postForForm('/app/document/object/actJoinDocuments.jsp',
				{docTypeId: objTypeId, fileName: fileName, folderObjId: folderObjId, joinedDocIds: joinedDocIds}
		)
		.pipe(mergeMap((res: any) => {
			return of(res);
		}));
	}

	/**
	 * 比較処理をします.
	 * @param orgObjId 比較元ドキュメント
	 * @param dstObjId 比較元ドキュメント
	 * @param isCompMail メール通知可否
	 * @param doAnalyzeLayout レイアウト解析可否
	 * @param compFileName ファイル名
	 * @return Observable
	 */
	public actFileCompare(orgObjId: string , dstObjId: string , isCompMail: string, doAnalyzeLayout: string, compFileName: string): Observable<any> {
		return this.httpService.postForForm('/app/document/object/actDocCompare.jsp',
				{orgObjId: orgObjId, dstObjId: dstObjId, isCompMail: isCompMail, doAnalyzeLayout: doAnalyzeLayout, compFileName: compFileName}
		)
		.pipe(mergeMap((res: any) => {
			return of(res);
		}));
	}

	/**
	 * リンク更新を実行します.
	 * @param selectedData 対象オブジェクトリスト
	 * @param parentObjId 親オブジェクトID
	 * @return 処理結果
	 */
	public actUpdateObjectLink(selectedData: any[], parentObjId: number): Observable<any> {

		let param = {};
		for (let i = 0; i < selectedData.length; i++) {
			param['objId_' + i] = selectedData[i].objId;
		}
		param['objNum'] = selectedData.length;
		param['parentObjId'] = parentObjId;

		return this.httpService.get('/app/document/object/actUpdateObjectLink.jsp', param)
		.pipe(mergeMap((res: any) => {
			let object = res.value.object
			let data = [];

			if (object.hasOwnProperty('attr') && object.attr.hasOwnProperty('objId')) {
				data.push({objId: object.attr.objId});
			}

			for (let i = 0; i < object.length; i++) {
				data.push({objId: object[i].attr.objId});
			}
			return of(data);
		}));
	}
}
