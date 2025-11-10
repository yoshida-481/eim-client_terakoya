import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * ファイルAPIサービス
 */
@Injectable()
export class EIMFileService {

  /** コンテキストルート */
  public contextRoot = null;

  constructor(
  		protected domainService: EIMDomainService,
  		protected httpService: EIMHttpService,
  		protected jsonService: EIMJSONService,
			protected serverConfigService: EIMServerConfigService,
	) {}
  public upload(uploader: FileUploader, fileItem: FileItem): EventEmitter<any> {
		return this.httpService.upload('/eim/framework/file_io/create_file.mvc',
				uploader, fileItem, {}, (json: any): any => {return json.result.attr; });
  }

  /**
   * 単一のファイルをダウンロードします.
   * @param id ファイルオブジェクトのID
   */
  public download(id: number): void {
		window.open(
			this.serverConfigService.getContextPath() +
			'/eim/framework/file_io/retrieve_file.mvc' +
			'?objectId=' + id +
			'&navigateToURLFlg=true', 'workFrame');
  }

	/**
	 * 単一のファイルをダウンロードします.
	 * @param fileName ファイル名（サーバサイドのパス付）
	 */
	public downloadByFileName(fileName: string): void {
		let form: any = window.document.getElementById('formDownloadForm');
		form.action = this.serverConfigService.getContextPath() + '/eim/form/file_io/retrieve_file.mvc';
		form.elements.fileName.value = fileName;

		form.submit();
	}

  public checkin(uploader: FileUploader, fileItem: FileItem, params: any): EventEmitter<any> {
		return this.httpService.upload('/app/document/object/actCheckin.jsp',
				uploader, fileItem, params, (json: any): any => {
					return json.object.attr;
				});
	}

	public downloadZipPrivateDocuments(objIds: number[]): void {

		let form: any = window.document.getElementById('zipDownloadForm');
		form.action = this.serverConfigService.getContextPath() + '/servlet/ZIPDownloadPrivateDocuments';
		form.elements.objId.value = objIds;
		form.elements.isCommaConcatObjId.value = true;
		form.submit();

	}

	/**
	 * ダウンロード
	 * @param objIds オブジェクトIDの配列
	 * @param docLinks オブジェクトリンクフラグの配列
	 * @param eSignFile 署名・暗号化済ドキュメントをダウンロードするかどうか
	 */
	public downloadZipMixedDocuments(objIds: number[], docLinks: string[], eSignFile: boolean): void {

		// フォームを生成
		let form = document.createElement('form');
		form.action = this.serverConfigService.getContextPath() + '/servlet/ZIPDownloadMixedDocuments';
		form.target = 'workFrame';
		form.acceptCharset = 'UTF-8';
		form.method = 'POST';

		// ウインドウ生成
		let _window = window.open('about:blank', 'workFrame');

		// エレメントを生成しフォームに追加
		let eSignFileElm = document.createElement('input');
		eSignFileElm.type = 'hidden';
		eSignFileElm.name = String(eSignFile);
		eSignFileElm.value = 'true';
		form.appendChild(eSignFileElm);
		for (let i = 0; i < objIds.length; i++) {
			let objIdElm = document.createElement('input');
			objIdElm.type = 'hidden';
			objIdElm.name = 'objId';
			objIdElm.value = String(objIds[i]);
			form.appendChild(objIdElm);
			let isDocumentLinkElm = document.createElement('input');
			isDocumentLinkElm.type = 'hidden';
			isDocumentLinkElm.name = 'isDocumentLink';
			isDocumentLinkElm.value = docLinks[i];
			form.appendChild(isDocumentLinkElm);
		}

		// ボディに設定
		document.body.appendChild(form);

		// ダウンロード実行
		form.submit();

		// ボディからフォームを除去
		document.body.removeChild(form);
	}

	/**
	 * 原本ファイルダウンロード
	 */
	public downloadPrivateDocument(objId: number): void {
		// ↓↓ダウンロード修正
		if (this.isSafari()) {
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadPrivateDocument?objId=' + objId, '_blank');
			_window.document.title = "DownloadFileName";
		}else{
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadPrivateDocument?objId=' + objId, 'checkoutFrame');
		}
	}
	/**
	 * 原本ファイルダウンロード
	 */
	public getPrivateDocument(objId: number): Observable<Blob> {
		return this.httpService.getBlob('/servlet/DownloadPrivateDocument?objId=' + objId);
	}

	/**
	 * 公開ファイルダウンロード
	 */
	public downloadPublicDocument(objId: number): void {
		// ↓↓ダウンロード修正
		if (this.isSafari()) {
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadPublicDocument?objId=' + objId, '_blank');
		}else{
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadPublicDocument?objId=' + objId, 'checkoutFrame');
		}
	}

	/**
	 * 公開ファイルダウンロード
	 */
	public getPublicDocument(objId: number): Observable<Blob> {
		return this.httpService.getBlob('/servlet/DownloadPublicDocument?objId=' + objId);
	}

	/**
	 * プレビュー用PDFドキュメントのダウンロード
	 */
	public getPreviewPdfDocument(objId: number): Observable<Blob> {
		return this.httpService.getBlob('/servlet/DownloadPreviewDocument?objId=' + objId);
	}

	/**
	 * 最新版原本ファイルダウンロード
	 */
	public downloadPrivateLatestDocument(objId: number): void {
		// ↓↓ダウンロード修正
		if (this.isSafari()) {
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadPrivateLatestDocument?objId=' + objId, '_blank');
		}else{
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadPrivateLatestDocument?objId=' + objId, 'workFrame');
		}
	}

	/**
	 * 最新版公開ファイルダウンロード
	 */
	public downloadPublicLatestDocument(objId: number): void {
		// ↓↓ダウンロード修正
		if (this.isSafari()) {
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadPublicLatestDocument?objId=' + objId, '_blank');
		}else{
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadPublicLatestDocument?objId=' + objId, 'workFrame');
		}
	}

	/**
	 * マイドキュメントダウンロード
	 */
	public downloadMyDocument(objId: number): void {
		// ↓↓ダウンロード修正
		if (this.isSafari()) {
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadMyDocument?objId=' + objId, '_blank');
		}else{
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadMyDocument?objId=' + objId, 'workFrame');
		}
	}

	/**
	 * 暗号化ドキュメントダウンロード
	 */
	public downloadSignencrDocument(objId: number): void {
		// ↓↓ダウンロード修正
		if (this.isSafari()) {
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadSignencrDocument?objId=' + objId, '_blank');
		}else{
			let _window = window.open(this.serverConfigService.getContextPath() + '/servlet/DownloadSignencrDocument?objId=' + objId, 'checkoutFrame');
		}
	}
	/**
	 * リンクショートカットダウンロード
	 */
	public downLoadUrlLinkFile(objNameList: string[], urlList: string[], kind: any): void {

		// フォームを生成
		let form = document.createElement('form');
		form.action = (this.contextRoot ?? this.serverConfigService.getContextPath()) + '/servlet/DownLoadUrlLinkFile';
		form.target = 'workFrame';
		form.acceptCharset = 'UTF-8';
		form.method = 'POST';

		// 送信するパラメータを生成
		let searchResult = '';
		searchResult = searchResult + '<urlLinkList>';

		for (let i = 0; i < objNameList.length; i++) {
			let url = urlList[i].replace('&', '&amp;');
			let objName = objNameList[i];
			searchResult = searchResult + '<urlData';
			searchResult = searchResult + ' linkFileName="' + objName + '"';
			searchResult = searchResult + ' urlString="' + url + '"';
			searchResult = searchResult + ' kind="' + kind + '"';
			searchResult = searchResult + '/>';
		}
		searchResult = searchResult + '</urlLinkList>';

		// ウインドウ生成
		let _window = window.open('about:blank', 'workFrame');

		// エレメントを生成し、ボディに設定
		let element = document.createElement('input');
		element.type = 'hidden';
		element.name = 'searchResult'
		element.value = searchResult;
		form.appendChild(element);
		document.body.appendChild(form);

		// ダウンロード実行
		form.submit();

		// ボディからフォームを除去
		document.body.removeChild(form);
	}

	/**
	 * アクセス履歴CSV出力を実行します.
	 * @param ids 出力対象IDリスト
	 */
	public downloadAccHistCSVFile(objectList: any[]) {

		let form = document.createElement('form');
		form.action = this.serverConfigService.getContextPath() + '/servlet/DownloadAccHistCSVFileWithSearch';
		form.target = 'workFrame';
		form.acceptCharset = 'UTF-8';
		form.method = 'POST';

		let param = '<objectList>';
		for (let i = 0; i < objectList.length; i++) {
			param = param + '  <object ';
			param = param + 'id="' + objectList[i].objId + '" ';
			param = param + 'name="' + objectList[i].objName + '"';
			param = param + '/>';
		}
		param = param + '</objectList>';
		// ウインドウ生成
		let _window = window.open('about:blank', 'workFrame');

		// エレメントを生成し、ボディに設定
		let element = document.createElement('input');
		element.type = 'hidden';
		element.name = 'targetObject'
		element.value = param;
		form.appendChild(element);
		document.body.appendChild(form);

		// ダウンロード実行
		form.submit();

		// ボディからフォームを除去
		document.body.removeChild(form);
	}

	/**
	 * // ↓↓ダウンロード修正
	 * 使用ブラウザがSafariかどうか返却します.
	 * @return 使用ブラウザがSafariの場合true
	 */
	public isSafari(): boolean {
		const userAgent = window.navigator.userAgent.toLowerCase();

		if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {

		} else if (userAgent.indexOf('edge') !== -1) {

		} else if (userAgent.indexOf('chrome') !== -1) {

		} else if (userAgent.indexOf('safari') !== -1) {
			return true;
		} else if (userAgent.indexOf('firefox') !== -1) {

		} else if (userAgent.indexOf('opera') !== -1) {

		} else {

		}
		return false;
	}
}
