import iconv from 'iconv-lite';

import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/operators';
import { EIMDocumentsHttpService } from '../documents-http.service';
// Angular13より未定義IFとなるため拡張する
declare global {
	interface Navigator {
		msSaveBlob?: (blob: any, defaultName?: string) => boolean;
		msSaveOrOpenBlob?: (blob: any, defaultName?: string) => boolean;
	}
}
	

/**
 * 文書管理用ファイルAPIサービス
 */
@Injectable()
export class EIMDocumentFileService extends EIMFileService {

  constructor(
  		protected domainService: EIMDomainService,
  		protected httpService: EIMDocumentsHttpService,
  		protected jsonService: EIMJSONService,
  		protected serverConfigService: EIMServerConfigService, ) {
  	super(domainService, httpService, jsonService, serverConfigService);
  }

  /**
   * 単一のファイルをダウンロードします.
   * @param id ファイルオブジェクトのID
   */
  public download(id: number): void {
		window.open(
			(this.contextRoot ?? this.serverConfigService.getContextPath()) +
			'/eim/app/document/file_io/retrieve_document_file.mvc' +
			'?objectId=' + id +
			'&navigateToURLFlg=true', 'workFrame');
	}

	/**
	 * CSVファイルをダウンロードします.
	 * @param opeHistAppId 操作履歴に出力するアプリケーションのID
	 * @param fileName ファイル名
	 * @param csv 出力するCSVの文字列
	 */
	public downloadCSV(opeHistAppId: string, fileName: string, csv: string): void {
		// 操作履歴を登録
		let params: any = {};
		params['fileName'] = fileName;
		params['appId'] = opeHistAppId;
		let result: any = {};
		this.httpService.postForForm('/common/opehist/actCreateOpehistForCsvDouwnload.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}))
		.subscribe(
				(object: any) => {
					// CSVの改行コードを変換し、エンコーディングする
					let newLine: string = this.serverConfigService.csvDownloadNewLine
					csv = csv.replace(/\r\n/g, newLine);

					let encoding: string = this.serverConfigService.csvDownloadCharset;

					let bomFlg = true;
					// UTF8(BOM有)設定の場合
					if (encoding === 'UTF-8_BOM') {
						// エンコーディングはUTF-8
						encoding = 'UTF-8';

						// UTF8(BOM無)の場合
					} else if (encoding === 'UTF-8') {
						// ボム付与フラグをOFF
						bomFlg = false;
					}
					let bodyBuf = iconv.encode(csv, encoding, {addBOM: bomFlg});

					// CSVを出力する
					let blob = new Blob([bodyBuf], { 'type': 'application/x-msdownload' });

					let link: HTMLAnchorElement = document.getElementById('eimCsvCownload') as HTMLAnchorElement;
					if (!link) {
						link = document.createElement('a');
						link.id = 'eimCsvCownload';
					}
					link.setAttribute('download', fileName);
					link.href = URL.createObjectURL(blob);

					if (window.navigator.msSaveBlob) {
						// IEの場合
						window.navigator.msSaveOrOpenBlob(blob, fileName);
					} else {
						// IE以外の場合
						let evt = document.createEvent( 'MouseEvents' );
						evt.initEvent( 'click', false, true );
						link.dispatchEvent( evt );
					}
				});
	}

	/**
	 * 分割ファイルのページ指定表示を実行します.
	 * @param params コンテンツ検索コンポーネント情報
	 */
	public pageOpen(params: any): void {

		// ページタイトルを取得
		this.httpService.get('/rest/search/file_download/page_title.mvc?objectId=' + params.objId, null, false)
		.pipe(map((res: any) => {

			let pageTitle = res.value.pageTitle;
			let url = this.serverConfigService.getContextPath() +
						'/rest/search/file_download/retrieve_page/' + encodeURI(pageTitle) +
						'?objectId=' + params.objId + '#page=' + params.page;

			let userAgent = window.navigator.userAgent.toLowerCase();

			// IEのみ挙動が異なるため処理分岐
			if(userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
				let w = window.open("", "_blank");
				// faviconは入れても認識してくれない
				w.document.write("<html><head><title>" + pageTitle + "</title><object data='" + url + "' type='application/pdf' width='100%' height='100%'></object></head></html>");
			} else {
				let w = window.open(url, "_blank");
				setTimeout(function(){
					w.document.head.insertAdjacentHTML('afterbegin','<link rel="icon" type="image/x-icon" href="/src/favicon.ico">');
				}, 1000);
			}
		}))
		.subscribe();
	}
}
