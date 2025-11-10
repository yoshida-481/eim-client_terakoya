import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';

import { EIMDocumentsEntryService, EIMEntry } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';
import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';
import { EIMDocumentsHttpService } from '../documents-http.service';

/** 公開対象ドキュメント情報インターフェース */
export interface EIMPublicDocument {
	objId?: number;
	typeId?: number;
	objName?: string;
	revision?: number;
	destination?: EIMEntry[];
	publicComment?: string;
	sendNotifyMailTiming?: number;
	statusId?: number;
	statusTypeId?: number;
	statusMDateLong?: number;
	timing?: number;
	reply?: number;
	isDocument?: boolean; // ファイル名レンダラーでダウンロードを実行するために必要
	publisherName?: string;
	publisherId?: string;
	fullPath?: string,
	securityId?: number,
	expiration?: boolean
}

/**
 * ドキュメントAPIサービス
 */
@Injectable()
export class EIMDocumentFormService {

	/**
	 * ドキュメント(帳票)サービス.
	 */
	constructor(
		protected httpService: EIMDocumentsHttpService,
		protected jsonService: EIMJSONService,
		protected entryService: EIMDocumentsEntryService,
		protected domainService: EIMDomainService,

	) {}

	/**
	 * ドキュメント(帳票)を作成します（オブジェクトのみ、実ファイルは含まない）
	 * @param document ドキュメント(帳票)
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return ドキュメント(帳票)
	 */
	public create(document: EIMContentsDomain, displayProgressDialog = true): Observable<EIMContentsDomain> {
		return this.httpService.post('/rest/documentform/create.mvc', document, displayProgressDialog)
			.pipe(mergeMap((res: any) => {
				return of(new EIMContentsDomain(res.value));
			}));
	}


	/**
	 * ドキュメントを更新します（オブジェクトのみ、実ファイルは含まない）
	 * @param document ドキュメント(帳票)
	 * @return ドキュメント(帳票)
	 */
	public update(document: EIMContentsDomain): Observable<EIMContentsDomain> {
		return this.httpService.post('/rest/documentform/update.mvc', document)
			.pipe(mergeMap((res: any) => {
				return of(new EIMContentsDomain(res.value));
			}));
	}

	/**
	 * ドキュメントを公開します
	 * @param object ドキュメント(帳票)
	 * @return
	 */
	public doPublic(object: any): Observable<any[]> {

		let params: any = {};
		// 公開設定
		params['localPDFOutputSet'] = object.localPDFOutputSet;
		params['immediatePublicFlag'] = true;
		params['statusId'] = object.statusId;
		params['baseEventTypeId'] = EIMDocumentsConstantService.BASE_EVENT_TYPE_ID_APPROVAL;
		params['statusMDateLong'] = object.statusMDateLong; // ステータス最終更新日
		params['functionType'] = 'approve';
		// 公開対象
		params['objId'] = object.objId;
		params['publicComment'] = object.publicComment;
		params['publisherId'] = this.getPublisherId(object.destination);	// 公開通知先({エントリタイプID}:{エントリID},{エントリタイプID}:{エントリID}の形式)
		params['reply'] = object.reply;		// 受信確認OFFの場合0、ONの場合1
		params['sendNotifyMailTiming'] = this.getTiming(object.sendNotifyMailTiming);		// 即時：0、定時：1、なし：3
		params['timing'] = EIMConstantService.MAILNOTICE_METHOD_NOTHING;		// 即時：0、定時：1、なし：3
		// 通知タイプ
		switch (Number(object.sendNotifyMailTiming)) {
			case 0:
				params['immediateMailTypeId'] = EIMDocumentsConstantService.MAIL_TYPE_ID_PUBLIC_NOTIFICATION;
				break;
			case 1:
				params['accumulateMailTypeId'] = EIMDocumentsConstantService.MAIL_TYPE_ID_PUBLIC_NOTIFICATION;
				break;
			case 2:
				params['nothingMailTypeId'] = EIMDocumentsConstantService.MAIL_TYPE_ID_PUBLIC_NOTIFICATION;
				break;
			default:
				break;
		}
		if (object.localPDFOutputSet === true) {
			// PDF変換オプションを設定した場合
			params['localPDFOutputSet'] = object.localPDFOutputSet;
			params['doSignPDF'] = object.doSignPDF;
			params['doSetSecurity'] = object.doSetSecurity;
			params['doSignPDFAndSetSecurity'] = object.doSignPDFAndSetSecurity;
			params['insertApproveDate'] = object.insertApproveDate;
			params['insertApproveUser'] = object.insertApproveUser;
			params['insertPage'] = object.insertPage;
			params['insertPlace'] = object.insertPlace;
			params['insertPlaceX'] = object.insertPlaceX;
			params['insertPlaceY'] = object.insertPlaceY;
			params['doSetSecurityPassword'] = object.doSetSecurityPassword;
			params['securityPassword'] = object.securityPassword;
			params['doSetReferencePassword'] = object.doSetReferencePassword;
			params['referencePassword'] = object.referencePassword;
			params['forbidPrint'] = object.forbidPrint;
			params['forbidEdit'] = object.forbidEdit;
			params['forbidAnnotate'] = object.forbidAnnotate;
			params['forbidReproduce'] = object.forbidReproduce;
		}

		return this.httpService.postForForm('/rest/app/document/workflow/doEvent.mvc', params)
		.pipe(mergeMap((res: any) => {
			return of(object);
		}));
	}

	/**
	 * ドキュメント(帳票)を取得します.
	 * @param id ドキュメント(帳票)ID
	 * @return ドキュメント(帳票)
	 */
	public getDocumentById(id: number): Observable<EIMContentsDomain> {
		return this.httpService.get('/rest/documentform/getById.mvc', {id: id})
			.pipe(mergeMap((res: any) => {
				return of(new EIMContentsDomain(res.value));
			}));
	}

	public getPreviousObjectList(idList: number[]): Observable<any[]> {
		return this.httpService.get('/app/document/object/dspPreviousObjectList.jsp', {objId: idList})
		.pipe(mergeMap((res: any) => {
			let children: any[] = this.jsonService.getJsonChildren(res.value.objList.object);
			let objects: any[] = [];
			for (let i = 0; i < children.length; i++) {
				let object: any = children[i].attr;
				objects.push(object);

			}
			return of(objects);
		}));
	}

	/**
	 * ドキュメント(帳票)に紐づく過去版のドキュメント(帳票)IDを取得します.
	 * @param idList ドキュメント(帳票)ID
	 * @returnドキュメント(帳票)IDをキー、過去版のドキュメント(帳票)IDリスト（バージョン番号昇順）を値とするマップ
	 */
	public getPreviousAllObjectList(idList: number[]): Observable<Map<number, number[]>> {
		return this.httpService.get('/app/document/object/dspPreviousAllObjectList.jsp', { objId: idList })
			.pipe(map((res: any) => {
				const children = this.jsonService.getJsonChildren(res.value.objList.object);
				const objectMap = new Map<number, number[]>();
				for (const { attr } of children) {
					const { objId, previousObjId } = attr;
					const id = Number(objId);
					const prev = Number(previousObjId);
					let prevs: number[];
					if (objectMap.has(id)) {
						prevs = objectMap.get(id);
					} else {
						prevs = [];
						objectMap.set(id, prevs);
					}
					prevs.push(prev);
				}
				return objectMap;
			}));
	}


	/**
	 * 検索
	 */
	 public search(condition: any): Observable<any[]> {

		return this.httpService.postForForm('/rest/app/document/search.mvc', condition)
			.pipe(mergeMap((res: any) => {
				let children: any[] = this.jsonService.getJsonChildren(res.value.contentList);
				let children2: any[] = this.jsonService.getJsonChildren(res.value.facetFieldList);
				let objects: any[] = [];
				let objects2: any[] = [];
				let object: any;
				for (let i = 0; i < children.length; i++) {

					object = children[i];
					// TODO 複数値属性未対応
//					for (let key in children[i]) {
//						if (key !== 'attr') {
//							object[key] = this.getMultiValue(children[i][key]);
//						}
//					}
					objects.push(object);

				}
				for (let i = 0; i < children2.length; i++) {

					object = children2[i];
					// TODO 複数値属性未対応
//					for (let key in children[i]) {
//						if (key !== 'attr') {
//							object[key] = this.getMultiValue(children[i][key]);
//						}
//					}
					objects2.push(object);
				}
				let objects3: any[] = [objects,objects2,res.value.numFounds];
				return of(objects3);
			}));
	}

	/**
	 * サジェスチョン検索
	 */
	 public searchSuggestions(condition: any): Observable<any[]> {

		return this.httpService.postForForm('/rest/app/document/search/suggest.mvc', condition, false);
	}

	/**
	 * ページ検索
	 */
	public pageSearch(condition: any): Observable<any[]> {

		return this.httpService.postForForm('/rest/app/document/search/pages.mvc',
				condition, false)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}


	/**
	 * 公開対象のドキュメントを取得します.
	 * @param objId ドキュメントのオブジェクトId
	 */
	public getImmediatePublicDocument(objId: number): Observable<any[]> {

		let params: any = {};
		params['objId'] = objId;

		return this.httpService.get('/app/document/approve/dspImmediatePublicDocumentList.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.convertToPublicDocument(res.value.object.attr));
			}));
	}


	/**
	 * 属性情報(Property)を取得します.
	 */
	public getObjectProperty(id: number): Observable<any> {
		return this.httpService.get('/app/document/object/dspProperty.jsp', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(res.value.object.attr);
			}));
	}

	/**
	 * 属性情報(Attribute)を取得します.
	 * @param objTypeId オブジェクトタイプID
	 * @param parentObjId 親オブジェクトID
	 * @return 取得結果
	 */
	public getObjectAttribute(objTypeId: number, parentObjId: number, objId?: number): Observable<any> {

		let param;
		if (parentObjId === null) {
			param = {objId: objId, objTypeId: objTypeId};
		} else {
			param = {parentObjId: parentObjId, objTypeId: objTypeId};
		}

		return this.httpService.get('/app/document/object/dspAttribute.jsp', param)
			.pipe(mergeMap((res: any) => {

				let children: any[] = Array.isArray(res.value.attList.attribute) ? res.value.attList.attribute : [res.value.attList.attribute];
				let objects: any[] = [];
				for (let i = 0; i < children.length; i++) {
					objects.push(children[i].attr);
				}
				return of(objects);
			}));
	}


	/**
	 * アクセス履歴を取得します.
	 * @param id オブジェクトID
	 * @return Observable
	 */
	public getAccessHistory(id: number): Observable<any> {
		return this.httpService.get('/app/document/object/dspAccessList.jsp', {objId: id})
			.pipe(mergeMap((res: any) => {
				let children: any[] = Array.isArray(res.value.accessList.access) ? res.value.accessList.access : [res.value.accessList.access];
				let objects: any[] = [];
				for (let i = 0; i < children.length; i++) {
					objects.push(children[i].attr);
				}
				return of(objects);
			}));
	}

	/**
	 * チェックアウトします.
	 */
	public checkout(objIds: number[]): Observable<any> {

		let params: any = {};
		for (let i = 0; i < objIds.length; i++) {
			params['objId' + i] = objIds[i];
		}

		params['isReturnRevUpObjectId'] = true;

		return this.httpService.postForForm('/app/document/object/actCheckout.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.objectList.object,
						(json) => {
							json.objId = Number(json.attr.objId);
							json.revUpObjId = Number(json.attr.revUpObjId);
							delete json.attr;
							return json;
						}));
			}));
	}

	/**
	 * チェックアウト取り消しをします.
	 */
	public cancelCheckout(objId: number): Observable<any> {

		let params: any = {};
		params['objId'] = objId;
		params['isReturnObjectId'] = true;

		return this.httpService.postForForm('/app/document/object/actCancelCheckout.jsp', params)
			.pipe(mergeMap((res: any) => {
				let json: any = {};
				json.objId = res.value.object.attr.objId;
				json.cancelObjId = res.value.object.attr.cancelObjId;
				return of(json);
			}));
	}

	/**
	 * チェックイン情報を取得します.
	 */
	public getCheckinDocument(id: number): Observable<any> {
		return this.httpService.get('/app/document/object/dspCheckin.jsp', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(res.value.object.attr);
			}));
	}

	/**
	 * 一括登録をする。
	 * @param uploader アップローダ
	 * @param fileItem アップロード対象
	 * @param params 追加情報
	 * @return 成功可否
	 */
	public uploadZIPFile(uploader: FileUploader, fileItem: FileItem, params: any): EventEmitter<any> {
		return this.httpService.upload('/app/document/object/actLumpUpload.jsp',
				uploader, fileItem, params, (json: any): any => {
					return json.objList;
				});
	}

	/**
	 * 一括登録確認をする。
	 * @param objId オブジェクトID
	 * @param data 登録対象
	 * @param property プロパティ
	 * @param expirationDate 有効期限
	 * @param createUserId 作成者ID
	 * @return 成功可否
	 */
	public createLumpDocument(objId: number, data: any, property: any, expirationDate: any, createUserId: any, documentTypeId: number): Observable<any> {
		let params: any = {};
	  params['objId'] = objId;
		params['objNum'] = data.length;
		params['property'] = property;
		params['expireDate'] = expirationDate;
		params['createUserId'] = createUserId;
		params['documentTypeId'] = documentTypeId;
		for ( let i  = 0; i < data.length; i++) {
			params['path_' + i] = data[i].path;
			params['objType_' + i ] = data[i].objType;
			params['objName_' + i] = data[i].objName;
		}

		return this.httpService.postForForm('/app/document/object/actConfirmLumpUpload.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.object.object,
					(_json: any) => {
						return {objId: _json.attr.objId, objName: _json.attr.objName};
					}));

			}));
	}

  /**
   * アップロード対象のフォルダとドキュメントの登録可否チェックを行います。
   * 
   * @param params 
   * @return チェック結果
   */
  public confirmUploadTarget(params: any): Observable<any> {
    return this.httpService
      .postFileList("/rest/common/lumpFolder/confirm.mvc", params)
      .pipe(
        mergeMap((res: any) => {
          return of(res.value);
        })
      );
  }

  /**
   * フォルダアップロードをする。
   * @param uploader アップローダ
   * @param fileItem アップロード対象
   * @param params 追加情報
   * @return 成功可否
   */
  public uploadFolder(params: any): Observable<any> {
		return this.httpService.postFileList('/rest/common/lumpFolder/upload.mvc', params)
			.pipe(mergeMap((res: any) => {
          return of(res.value);
			}));
  }
	/**
	 * 差換えをする。
	 * @param uploader アップローダ
	 * @param fileItem ファイル
	 * @param data リクエストパラメータ
	 * @return 成功可否
	 */
	public fileReplacementExecutor(uploader: FileUploader, fileItem: FileItem, data: any):  Observable<any> {
		let params: any = {};
	  params['objId'] = data.objId;
	  params['fileName'] = data.fileName;
	  params['parentObjId'] = data.parentObjId;

		return this.httpService.upload('/app/document/object/actReplaceDocument.jsp',
				uploader, fileItem, params, (json: any): any => {
					return of(json);
				});
	}

	/**
	 * OCR処理設定を設定します.
	 * @param content ドキュメント
	 * @param ocrSettingValue OCR処理設定値
	 * @return 成功可否
	 */
	public ocrSettingUpdator(content: any[], ocrSettingValue: number): Observable<any> {
		let params: any[] = [];
		let reqObjIdArray: number[] = [];

		for ( let i = 0; i < content.length; i++ ) {
			let xml = content[i];
			reqObjIdArray.push(xml.objId);
		}

		params['objId'] = reqObjIdArray;
		params['ocrSettingValue'] = ocrSettingValue;

		return this.httpService.postForForm('/app/document/object/actOcrSetting.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.object);
			}));
	}

	/**
	 * OCR処理設定を実行します.
	 * @param objIds 実行対象オブジェクトID
	 * @return 成功可否
	 */
	public ocrExecute(objIds: number[]): Observable<any> {
		let params: any = {objId: objIds};
		return this.httpService.postForForm('/app/document/object/actOcrExecute.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}

	/**
	 * OCR処理設定を取り消します.
	 * @param objIds 実行対象オブジェクトID
	 * @return 成功可否
	 */
	public ocrCancel(objIds: number[]): Observable<any> {
		let params: any = {objId: objIds};
		return this.httpService.postForForm('/app/document/object/actOcrCancel.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}

	/**
	 * ZIPダウンロード対象を取得します.
	 * @param objIds ZIPダウンロード対象オブジェクトID
	 * @return 成功可否
	 */
	public urlRequest(objIds: number[]): Observable<any> {
		let params: any = {objId: objIds};
		return this.httpService.postForForm('/app/document/object/dspZIPDownload.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}

	/**
	 * ZIPダウンロードします.
	 * @param objIds ZIPダウンロード対象オブジェクトID
	 * @param docLinks ZIPダウンロード対象ドキュメントリンクフラグ
	 * @param eSignFile 電子署名・暗号化フラグ
	 * @return 成功可否
	 */
	public zipDownloadExecute(objIds: number[], docLinks: string[], eSignFile): Observable<any> {
		let params: any = {objId: objIds, isDocumentLink: docLinks, eSignFile: eSignFile};
		return this.httpService.postForForm('/app/document/user/actSendReplyMailZIPDownload.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}

	/**
	 * 表紙ドキュメントを作成します
	 * @param document ドキュメント(帳票)
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return ドキュメント(帳票)
	 */
	public createCover(document: EIMFormDomain, displayProgressDialog = true): Observable<EIMContentsDomain> {
		return this.httpService.post('/rest/coverdocumentform/createCover.mvc', document, displayProgressDialog)
			.pipe(mergeMap((res: any) => {
				return of(new EIMContentsDomain(res.value));
			}));
	}

	/**
	 * リンク設定情報を取得します.
	 */
	public getObjectLinkSettings(objId: number, parentObjId: number, isDocumentLink: string): Observable<any> {
		return this.httpService.get('/app/document/object/dspObjLinkSettings.jsp', {objId: objId, parentObjId: parentObjId, isDocumentLink: isDocumentLink})
			.pipe(mergeMap((res: any) => {
				return of(res.value.objectList.object.attr);
			}));
	}

	/**
	 * リンク設定有無をチェックします.
	 * @param isFolder フォルダ可否
	 * @param objIds 公開取消対象オブジェクトID
	 * @return リンク設定可否
	 */
	public actCheckHasDocLinkService(isFolder: boolean, objId: number): Observable<any> {
		let params: any = {isFolder: isFolder, objId: objId};
		return this.httpService.postForForm('/app/document/object/actCheckHasDocLinkForPublicCancel.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.result.attr);
			}));
	}

	/**
	 * リンク設定情報を更新します.
	 */
	public updateObjectLinkSettings(objId: number, parentObjId: number, isDocumentLink: string, linkUpdateTiming: string): Observable<any> {
		let params: any = {};
	  params['objId'] = objId;
	  params['parentObjId'] = parentObjId;
	  params['isDocumentLink'] = isDocumentLink;
	  params['linkUpdateTiming'] = linkUpdateTiming;
		return this.httpService.postForForm('/app/document/object/actObjLinkSettings.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}

	/**
	 * 指定されたIDの帳票に対応するすべてのリビジョンのオブジェクトIDを取得します.
	 * @param objId オブジェクトID
	 */
	public getAllRevisionById(objId: number): Observable<number[]> {
		const params = { id: objId };
		return this.httpService.get('/rest/documentform/getAllRevisionById.mvc', params)
			.pipe(map((res: any) => res.value));
	}

	/**
	 * 公開PDFの事前登録をします。
	 * @param uploader アップローダ
	 * @param fileItem ファイル
	 * @param data リクエストパラメータ
	 * @return 成功可否
	 */
	 public publicFilePreRegister(uploader: FileUploader, fileItem: FileItem, data: any):  Observable<any> {
		let params: any = {};
	  params['objId'] = data.objId;

		return this.httpService.upload('/rest/public-document/preRegistPublicPdf.mvc',
				uploader, fileItem, params, (json: any): any => {
					return json;
				});

	}

	/**
	 * 事前登録した公開PDFを削除します。
	 * @param objId
	 * @return 成功可否
	 */
	 public preRegistPublicFileDelete(objId: number): Observable<EIMContentsDomain> {
		let ids: number[] = [];
		ids.push(objId);
		let params: any = {ids: ids};
		return this.httpService.post('/rest/public-document/deletePreRegistPdf.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res);
			}));
	}

	private getMultiValue(object: any): any[] {
			let values: any[] = [];

			if (!object.attValue) { return values; }

			if (Array.isArray(object.attValue)) {
				for (let i = 0; i < object.attValue.length; i++) {
					values.push(object.attValue[i].attr.value);
				}
			} else {
				values.push(object.attValue.attr.value);
			}
			return values;
		}

	/**
	 * 公開通知先を取得します.
	 * @param destinations 公開通知先リスト
	 * @return 公開通知先
	 */
	private getPublisherId(destinations: any[]): string {

		let publisherId = '';

		for (let j = 0; j < destinations.length; j++) {
			let element: string = destinations[j].entryTypeId + ':' + destinations[j].entryId;
			if (publisherId !== '') { publisherId += ','; }
			publisherId += element;
		}

		return publisherId;
	}

	/**
	 * タイミングを取得します.
	 * @param notificationType 通知タイプ
	 * @return タイミング
	 */
	private getTiming(notificationType: string): number {

		let timing = 0;

		switch (Number(notificationType)) {
			case 0: // 即時
				timing = 0;
				break;
			case 1: // 定時
				timing = 1;
				break;
			case 2: // なし
				timing = 3;
				break;
			default:
		}

		return timing;
	}


	/**
	 * 公開対象ドキュメントに変換します.
	 * @param targets 変換対象
	 * @return 公開対象ドキュメントリスト
	 */
	private convertToPublicDocument(target: any): any {

		// 公開通知先リスト生成
		let destinations: EIMEntry[] = [];
		let publisherIds: string[] = [];
		if (target.publisherId != null && target.publisherId.length > 0) {
			publisherIds = (target.publisherId).split(',');
		}
		let publisherNames: string[] = [];
		if (target.publisherName != null && target.publisherName.length > 0) {
			publisherNames = (target.publisherName).split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
		}

		if (publisherIds.length > 0 && publisherNames.length > 0) {
			for (let j = 0; j < publisherIds.length; j++) {

				let publisherIdElements: string[] = publisherIds[j].split(':');
				publisherNames[j] = publisherNames[j].slice(1).slice(0 ,-1).replace( /""/g, '"' );

				let destination: EIMEntry = {
							entryId: Number(publisherIdElements[1]),
							entryName: publisherNames[j],
							entryTypeId: Number(publisherIdElements[0]),
							entryTypeName: this.entryService.getEntryTypeName(Number(publisherIdElements[0])),
						}
				destinations.push(destination);
			}
		}

		// 公開通知タイプ
		let sendNotifyMailTiming = undefined;
		switch (target.immediatePublic) {
			case 'immediate':
				sendNotifyMailTiming = 0;
				break;
			case 'scheduled':
				sendNotifyMailTiming = 1;
				break;
			case 'off':
				sendNotifyMailTiming = 2;
				break;
			default:
		}

		// 公開対象ドキュメント生成
		let publicDocument: EIMPublicDocument = {
					objId: target.objId,
					typeId: target.objTypeId,
					objName: target.objName,
					revision: target.rev,
					destination: destinations,
					publicComment: target.publicComment,
					sendNotifyMailTiming: sendNotifyMailTiming,
					statusId: target.statusId,
					statusTypeId: target.statusTypeId,
					statusMDateLong: target.statusMDateLong,
					reply: target.reply,
					isDocument: target.isDocument,
					publisherName: target.publisherName,
					publisherId: target.publisherId,
					fullPath: target.fullPath,
					securityId: target.securityId
				}

		return publicDocument;
	}


	/**
	 * 取得した名称一覧をカンマ区切りの名称に変換します.
	 * @param nameList 名称一覧
	 * @return 名称
	 */
	protected convertName(nameList: string[]): any {
		let names: String = '';
		for (let i = 0; i < nameList.length; i++) {
			names += nameList[i];
			names += EIMConstantService.DELIMITER_COMMA;
		}
		// 最後のカンマを除去
		names = names.substring(0, names.length - 1);
		return names;
	}

}
