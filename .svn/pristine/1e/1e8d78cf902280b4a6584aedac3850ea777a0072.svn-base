import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDocumentsHttpService } from '../documents-http.service';

/**
 * ドキュメントAPIサービス
 */
@Injectable()
export class EIMDocumentService {

	constructor(
		private httpService: EIMDocumentsHttpService,
		private jsonService: EIMJSONService) { }

	/**
	 * ファイルをアップロードします.
	 */
	public upload(uploader: FileUploader, fileItem: FileItem, parentId: number, typeId: number, createUserId: number, displayProgressDialog = true, displayErrorDialog = true): EventEmitter<any[]> {

		return this.httpService.upload('/app/document/object/actCreateDocument.jsp',
			uploader, fileItem,
			{ objId: parentId, objTypeId: typeId, createUserId: createUserId, fileName: fileItem.file.name },
			(json: any): any => { return json.object.attr; }, displayProgressDialog, displayErrorDialog);
	}

	/**
	 * Boxからのファイルをアップロードします.
	 */
	public uploadFromBox(tmpObjId: number, data: any, parentObjId: number, typeId: number, createUserId: number, documentTypeId: number, path: String, boxPath: String, documentAttributesList: any, displayProgressDialog = true, displayErrorDialog = true
	) {
		const params = {
			objId: parentObjId,
			objTypeId: typeId,
			objNum: data.length,
			createUserId: createUserId,
			documentTypeId: documentTypeId,
			boxPath: boxPath,
			tmpObjId: tmpObjId,
			displayProgressDialog,
			displayErrorDialog,
		};

		for (let i = 0; i < data.length; i++) {
			params["path_" + i] = path;
			params["objType_" + i] = "document";
			params["objName_" + i] = data[i].file.name;
			params["sameNameObj_" + i] = data[i].sameNameObj;
			params["attributeList_" + i] = documentAttributesList[i].attributeList;
		}

		return this.httpService.post(
			"/rest/box/documents/contents/createDocument.mvc",
			params
		);
	}
}
