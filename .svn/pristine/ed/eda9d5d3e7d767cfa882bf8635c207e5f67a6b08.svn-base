import { EIMHttpService } from 'app/shared/services/http.service';
import { Injectable, Output } from '@angular/core';

import { environment } from '../../../environments/environment';
import { EIMServerConfigService } from './server-config.service';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

interface ActiveXObject {
  new (s: string): any;
}
declare var ActiveXObject: ActiveXObject;

/**
 * WebDAVサービス
 */
@Injectable()
export class EIMWebDAVService {

	constructor(
			private httpService: EIMHttpService,
			protected serverConfigService: EIMServerConfigService,
			protected cacheService: EIMCacheService,
	) {
	}

	/**
	 * WebDAV編集が有効かどうか判定します.
	 *
	 * @return WebDAV編集可否
	 */
	public enable(): boolean {
		/*
		// ブラウザ種別チェック
		let ua: string = window.navigator.userAgent.toLowerCase();
		if (!(ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0)) {
			return false;
		}

		// セッションID取得チェック
		if (!this.cookieService.get('JSESSIONID')) {
			return false;
		}
		*/
		return true;
	}

	/**
	 * WebDAV編集可能なファイルかどうか判定します.
	 *
	 * @param fileName ファイル名
	 * @return WebDAV編集可否
	 */
	public editable(fileName: string): boolean {
		// 引数チェック
		if (!fileName) {
			return false;
		}

		// 拡張子チェック
		let ext: string = fileName.substring(fileName.lastIndexOf('.'));
		if (!this.serverConfigService.isWebDavTargetExcelExt(ext) &&
				!this.serverConfigService.isWebDavTargetWordExt(ext) &&
				!this.serverConfigService.isWebDavTargetPowerPointExt(ext)) {
			return false;
		}

		return true;
	}

	/**
	 * WebDAV編集します.
	 *
	 * @param objId ファイルオブジェクトのID
	 * @param fileName ファイル名
	 */
	/*
	public edit(objId: number, fileName: string): void {

		let sharePoitDocument = new ActiveXObject("SharePoint.OpenDocuments.2");

		let url: string = environment.scheme + environment.host + environment.port + this.serverConfigService.contextPath +
				'/WebDAVServlet/' + this.cookieService.get('JSESSIONID') + '/' + objId + '/' + fileName;;

		let fileType: string;
		let ext: string = fileName.substring(fileName.lastIndexOf("."));
		if (this.serverConfigService.isWebDavTargetExcelExt(ext)) {
			fileType = 'Excel.Sheet';
		} else if (this.serverConfigService.isWebDavTargetWordExt(ext)) {
			fileType = 'Word.Document';
		} else if (this.serverConfigService.isWebDavTargetPowerPointExt(ext)) {
			fileType = 'PowerPoint.Slide';
		}

		sharePoitDocument.EditDocument(url, fileType);

	}
	*/
	/**
	 * WebDAV編集します.
	 *
	 * @param objId ファイルオブジェクトのID
	 * @param fileName ファイル名
	 */
	public edit(objId: number, fileName: string): void {

		let url: string = this.serverConfigService.getContextPathUrl() + '/WebDAVServlet/' + this.cacheService.getJSessionId() + '/' + objId + '/' + encodeURIComponent(fileName);

		let prefix: string;
		// モード:編集
		// let mode:string = 'ofe|u|'
		// モード:読み取り
		let mode = 'ofv|u|'
		let ext: string = fileName.substring(fileName.lastIndexOf('.'));
		if (this.serverConfigService.isWebDavTargetExcelExt(ext)) {
			prefix = 'ms-excel:';
		} else if (this.serverConfigService.isWebDavTargetWordExt(ext)) {
			prefix = 'ms-word:';
		} else if (this.serverConfigService.isWebDavTargetPowerPointExt(ext)) {
			prefix = 'ms-powerpoint:';
		}
		url = prefix + mode + url;
		window.open(url, 'workFrame');
	}

	/**
	 * WebDAV編集が可能かどうか取得します.
	 * @param id 対象オブジェクトID
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 * @return WebDAV編集可否(不可能な場合エラーを返却します)
	 */
	public checkStatus(id: number, displayProgressDialog = false): Observable<boolean> {
		return this.httpService.postForForm('/rest/webDAV/checkStatus.mvc', {id: id}, displayProgressDialog)
			.pipe(mergeMap((res: any) => {
				return of(true);
			}));
	}

}
