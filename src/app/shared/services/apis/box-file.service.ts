import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMBoxFileDomain } from 'app/shared/domains/box-file.domain';
import { FileUploader, FileItem } from "ng2-file-upload";
import { HttpClient } from "@angular/common/http";
import { EIMMessageService, EIMMessageType } from "../message.service";

/**
 * BoxファイルAPIサービス
 */
@Injectable()
export class EIMBoxFileService {

	/** 一時格納フォルダオブジェクトID*/
	public tmpObjId: number;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
		protected serverConfigService: EIMServerConfigService,
		private messageService: EIMMessageService,
	) {
	}

	/**
	 * EIMのファイルをBoxにコピーします.
	 * @param eimObjectId コピー元EIMドキュメントオブジェクトID
	 * @param parentBoxFolderId コピー先BoxフォルダID
	 * @param formatId コピー元EIMドキュメントフォーマットID
	 * @param boxFileId BoxファイルID(Boxファイルを上書きする場合に指定)
	 * @return コピー先のBoxファイル情報
	 */
	copyFromEIMFile(eimObjectId: number, parentBoxFolderId: String, formatId: String, boxFileId: String): Observable<EIMBoxFileDomain> {
		const params: any = {
			objectId: eimObjectId,
			parentBoxFolderId: parentBoxFolderId,
			formatId: formatId,
			boxFileId: boxFileId
		};
		return this.httpService.post('/rest/box/files/eim-file.mvc', params)
			.pipe(map((res) => this.domainService.createObject(res.value,
				(json) => new EIMBoxFileDomain(json))));
	}

	/**
	 * Boxファイルをダウンロードします.
	 * @param id BoxファイルID
	 */
	download(id: String) {
		// try {
		//   window.open(
		//     this.serverConfigService.getContextPath() +
		//       "/rest/box/files/" +
		//       id +
		//       "/contents.mvc",
		//     "workFrame"
		//   );
		//   this.messageService.show(EIMMessageType.error, "エラー");
		// } catch (error) {
		//   this.messageService.show(EIMMessageType.error, "エラー");
		// }

		console.log("ダウンロード");
		let url =
			this.serverConfigService.getContextPath() + "/rest/box/files/" + id + "/contents.mvc";
		// ダウンロードが可能か事前チェック
		fetch(url, { method: "GET" })
			.then((response) => {
				const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				return response.json(); // エラー情報がJSONで返ってくる場合
			} else {
			// 正常なファイルレスポンス（octet-streamなど）
				return null;
			}}) 
			.then((data) => {
				if (data && data.error && data.error.message) {
					this.messageService.show(EIMMessageType.error, data.error.message);
				} else {
					window.open(
						this.serverConfigService.getContextPath() +
						"/rest/box/files/" +
						id +
						"/contents.mvc",
						"workFrame"
					);
				}
			});
	}

	/**
	 * Boxファイルを一時格納フォルダに取得します
	 * @param selectedBoxFile Boxファイル情報
	 * @param createUserId 作成者ID
	 */
	getBoxFile(selectedBoxFile: EIMBoxFileDomain[], createUserId: any) {
		const params = selectedBoxFile.map((file) => ({
			fileId: file.id,
			createUserId: createUserId,
		}));
		return this.httpService
			.post("/rest/box/documents/contents/temp.mvc", params)
			.pipe(
				map((response) => {
					this.tmpObjId = response.value;
				})
			);
	}

	/**
	 * Boxファイル登録可否を確認します
	 * @param additonalParametar パラメータ
	 */
	confirmBoxFile(additionalParameter: any): Observable<number[]> {
		const params = {
			objType: "document",
			objId: additionalParameter.objId,
			documentTypeId: additionalParameter.documentTypeId,
			createUserId: additionalParameter.createUserId,
			tmpObjId: this.tmpObjId,
		};

		return this.httpService.post(
			"/rest/box/documents/contents/confirm.mvc",
			params
		);
	}

	/**
	 * Boxファイルを削除します
	 * @param id BoxファイルID
	 * @param type オブジェクトタイプ
	 * @param name オブジェクト名
	 * @param path オブジェクトパス
	 */
	deleteBoxFile(
		id: String,
		type: String,
		name: String,
		path: String
	): Observable<number[]> {
		const params = {
			id: id,
			type: type,
			name: name,
			path: path,
		};
		return this.httpService.post(
			"/rest/box/documents/contents/delete.mvc",
			params
		);
	}
}
