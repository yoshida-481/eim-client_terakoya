import { EIMLocalStorageService } from './apis/local-storage.service';
import { Output, EventEmitter, Injectable, Directive } from '@angular/core';
import { of, Observable } from 'rxjs';


import { FileUploader, FileUploaderOptions, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { TranslateService } from '@ngx-translate/core';
import { EIMJSONService } from './json.service';
import { EIMMessageService, EIMMessageType } from './message.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMServerConfigService } from './server-config.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { HttpParameterCodec } from '@angular/common/http';

export class optionsDTO {
	headers?: HttpHeaders | {
		[header: string]: string | string[];
	};
	observe?: 'body';
	params?: HttpParams | {
		[param: string]: string | string[];
	};
	reportProgress?: boolean;
	responseType: 'text';
	withCredentials?: boolean;
}

export class BrowserStandardEncoder implements HttpParameterCodec {
	encodeKey(key: string): string {
	return encodeURIComponent(key);
	}

	encodeValue(value: string): string {
	return encodeURIComponent(value);
	}

	decodeKey(key: string): string {
	return decodeURIComponent(key);
	}

	decodeValue(value: string): string {
	return decodeURIComponent(value);
   }
  }

/**
 * HTTPサービスです。<br/>
 * @class EIMHttpService
 * @module EIMSharedModule
 */
@Injectable()
export class EIMHttpService {

	/** リクエスト開始イベントエミッタ */
	@Output()
	public started: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** イベントエミッタ */
	@Output()
	public startedDialog: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** リクエスト終了イベントエミッタ */
	@Output()
	public ended: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 選択対象変更イベントエミッタ */
	@Output()
	public focusChanged: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** コンテクストルート */
	public contextRoot = null;

	// アクセス中のリクエスト数
	private count = 0;
	// アクセス中のリクエスト数(プログレスバー表示問い合わせ除く)
	private countWithoutNonDisplayProgress = 0;

	constructor(
		private http: HttpClient,
		private jsonService: EIMJSONService,
		private messageService: EIMMessageService,
		private sessionTimeoutService: EIMSessionTimeoutService,
		private serverConfigService: EIMServerConfigService,
		private translateService: TranslateService,
		private localStorageService: EIMLocalStorageService,
	) { }

	/**
	 * HTTP GETサービスを呼び出します.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public get(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		this.beginRequest(displayProgressDialog);
		let options: optionsDTO = this.getOptions(params);
		options.responseType = 'text';

		return this.http.get((this.contextRoot ?? this.serverConfigService.getContextPath()) + url, options)
			.pipe(map((res) => {
				let json: any;
				try {
					json = this.convertJSON(res, url);
				} catch (err) {
					if (err instanceof SyntaxError) {
						let jsonErrorMessage: string = this.translateService.instant('EIM.ERROR_00010');
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, jsonErrorMessage);
						}
						err['url'] = url;
						err['params'] = params;
						err['message'] = jsonErrorMessage;
						throw err;
					}
				}

				// エラーチェック
				if (json.error) {
					if (this.sessionTimeoutService.checkSessionTimeout(this.getErrorMessage(json))) {
						this.sessionTimeoutService.doSessionTimeout(this.getErrorMessage(json));
					} else {
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, this.getErrorMessage(json));
						}
					}

					let error = new Error(this.getErrorMessage(json));
					error['url'] = url;
					error['params'] = params;
					error['message'] = this.getErrorMessage(json);
					throw error;
				}
				this.endRequest(displayProgressDialog);
				return { value: json };
			})).pipe(catchError((error: any) => {
				if (error['url']) {
					// レスポンスでエラーメッセージが返却された場合
					this.endRequest(displayProgressDialog);

					if (!error['message']) {
						// レスポンスのエラーメッセージのフォーマットが想定外の場合(サーバに届かなかった場合等)
						let message: string = this.translateService.instant('EIM.ERROR_00005');
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, message);
						}
					}

					throw error;
				} else {
					this.endRequest(displayProgressDialog);

					let message: string = this.translateService.instant('EIM.ERROR_00005');
					if (displayErrorDialog) {
						this.messageService.show(EIMMessageType.error, message);
					}

					error['url'] = url;
					error['params'] = params;
					error['message'] = message;
					throw error;
				}
			}));
	}

	/**
	 * HTTP GETサービスを呼び出します.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public getBlob(url: string): Observable<Blob> {
		return this.http.get(this.serverConfigService.getContextPath() + url, { responseType: 'blob' });
	}

	/**
	 * HTTP POSTサービスを呼び出します.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public post(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const options = { headers: headers };
		const body = JSON.stringify(params);
		options['responseType'] = 'text';

		this.beginRequest(displayProgressDialog);
		return this.http.post((this.contextRoot ?? this.serverConfigService.getContextPath()) + url, body, options)
			.pipe(map((res) => {

				let json: any;
				try {
					json = this.convertJSON(res, url);
				} catch (err) {
					if (err instanceof SyntaxError) {
						let jsonErrorMessage: string = this.translateService.instant('EIM.ERROR_00010');
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, jsonErrorMessage);
						}
						err['url'] = url;
						err['params'] = params;
						err['message'] = jsonErrorMessage;
						throw err;
					}
				}

				// エラーチェック
				if (json.error) {
					if (this.sessionTimeoutService.checkSessionTimeout(this.getErrorMessage(json))) {
						this.sessionTimeoutService.doSessionTimeout(this.getErrorMessage(json));
					} else {
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, this.getErrorMessage(json));
						}
					}
					let error = new Error(this.getErrorMessage(json));
					error['url'] = url;
					error['params'] = params;
					error['message'] = this.getErrorMessage(json);
					throw error;
				}

				this.endRequest(displayProgressDialog);
				return { value: json };
			}), catchError((error: any) => {
				if (error['url']) {
					// レスポンスでエラーメッセージが返却された場合
					this.endRequest(displayProgressDialog);

					if (!error['message']) {
						// レスポンスのエラーメッセージのフォーマットが想定外の場合(サーバに届かなかった場合等)
						let message: string = this.translateService.instant('EIM.ERROR_00005');
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, message);
						}
					}

					throw error;
				} else {
					this.endRequest(displayProgressDialog);

					let message: string = this.translateService.instant('EIM.ERROR_00005');
					if (displayErrorDialog) {
						this.messageService.show(EIMMessageType.error, message);
					}

					error['url'] = url;
					error['params'] = params;
					error['message'] = message;
					throw error;
				}
			}));
	}

	/**
	 * HTTP POSTサービスを呼び出します.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public postFileList(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {
		
		this.beginRequest(displayProgressDialog);
		return this.http.post(this.serverConfigService.getContextPath() + url, params)
			.pipe(map((res) => {

				// エラーチェック
				if (res['error'] && displayErrorDialog) {
					const errorMessage = this.getErrorMessage(res) || this.translateService.instant('EIM.ERROR_00005');
					this.messageService.show(EIMMessageType.error, errorMessage);
					
				}

				if (displayProgressDialog) {
                    this.endRequest(displayProgressDialog);
                }

				return { value: res };
			}), catchError((error: any) => {
	
				// レスポンスでエラーメッセージが返却された場合
				if (displayProgressDialog) {
					this.endRequest(displayProgressDialog);
				}

				let errorMessage = this.translateService.instant('EIM.ERROR_00005');

				if (error.error?.message) {
					errorMessage = error.error.message;
				}
				
				if (displayErrorDialog) {
					this.messageService.show(EIMMessageType.error, errorMessage);
				}

				error['url'] = url;
				error['params'] = params;
				error['message'] = errorMessage;
				throw error;
			
			}));
	}

	/**
	 * HTTP POSTサービスを呼び出します.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public postForForm(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {
		let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
		let options = { headers: headers };
		options['responseType'] = 'text';

		const urlParams = new HttpParams({
			encoder: new BrowserStandardEncoder(),fromObject: this.createParamWidthoutUndefined(params),
		});

		this.beginRequest(displayProgressDialog);
		return this.http.post((this.contextRoot ?? this.serverConfigService.getContextPath()) + url, urlParams.toString(), options)
			.pipe(map((res) => {

				let json: any;
				try {
					json = this.convertJSON(res, url);
				} catch (err) {
					if (err instanceof SyntaxError) {
						let jsonErrorMessage: string = this.translateService.instant('EIM.ERROR_00010');
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, jsonErrorMessage);
						}
						err['url'] = url;
						err['params'] = params;
						err['message'] = jsonErrorMessage;
						throw err;
					}
				}

				// エラーチェック
				if (json.error) {
					if (this.sessionTimeoutService.checkSessionTimeout(this.getErrorMessage(json))) {
						this.sessionTimeoutService.doSessionTimeout(this.getErrorMessage(json));
					} else {
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, this.getErrorMessage(json));
						}
					}
					let error = new Error(this.getErrorMessage(json));
					error['url'] = url;
					error['params'] = params;
					error['message'] = this.getErrorMessage(json);
					throw error;
				}

				this.endRequest(displayProgressDialog);
				return { value: json };
			})).pipe(catchError((error: any) => {
				if (error['url']) {
					// レスポンスでエラーメッセージが返却された場合
					this.endRequest(displayProgressDialog);

					if (!error['message']) {
						// レスポンスのエラーメッセージのフォーマットが想定外の場合(サーバに届かなかった場合等)
						let message: string = this.translateService.instant('EIM.ERROR_00005');
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, message);
						}
					}

					throw error;
				} else {
					this.endRequest(displayProgressDialog);

					let message: string = this.translateService.instant('EIM.ERROR_00005');
					if (displayErrorDialog) {
						this.messageService.show(EIMMessageType.error, message);
					}

					error['url'] = url;
					error['params'] = params;
					error['message'] = message;
					throw error;
				}
			}));

	}

	/**
	 * アップロードサービスを呼び出します.
	 *
	 * @param url URL
	 * @param uploader ファイルアップローダ
	 * @return エミッタ
	 */
	public upload(url: string, uploader: FileUploader, fileItem: FileItem, params?: any, converter?: (json: any) => any, displayProgressDialog = true, displayErrorDialog = true): EventEmitter<any> {
		let completed: EventEmitter<any> = new EventEmitter<any>();

		this.beginRequest(displayProgressDialog);

		let options: FileUploaderOptions = {
			url: (this.contextRoot ?? this.serverConfigService.getContextPath()) + url
		};
		options.additionalParameter = params;

		// 引数のuploaderを使用すると、個別のリクエスト単位でパラメータの設定ができないため
		// 個別にuploaderをインスタンス化する
		let myUploader: FileUploader = new FileUploader(options);
		myUploader.addToQueue([fileItem._file]);

		myUploader.onSuccessItem = (item, res: string, status: number, headers: ParsedResponseHeaders): any => {
			this.endRequest(displayProgressDialog);

			myUploader.clearQueue();
			myUploader.cancelAll();

			let json: any = this.jsonService.xml2json(res);

			// エラーチェック
			if (json.error) {
				// セッションタイムアウトかどうかを判定する
				if (this.sessionTimeoutService.checkSessionTimeout(this.getErrorMessage(json))) {
					this.sessionTimeoutService.doSessionTimeout(this.getErrorMessage(json));
				} else {
					if (displayErrorDialog) {
						this.messageService.show(EIMMessageType.error, this.getErrorMessage(json));
					}
				}
				completed.error({
					url: this.serverConfigService.getContextPath() + url,
					uploader: uploader,
					fileItem: fileItem,
					params: params,
					message: this.getErrorMessage(json)});

			} else if (converter) {
				completed.emit(converter(json));

			} else {
				completed.emit(json);
			}
		}

		myUploader.onErrorItem = (item, response, status, headers) => {
			this.endRequest(displayProgressDialog);

			myUploader.clearQueue();
			myUploader.cancelAll();

			let message: string;
			if (status == 0) {
				// フォルダ等アップロードできないファイルの場合
				message = this.translateService.instant('EIM.ERROR_00006');
			} else {
				message = this.translateService.instant('EIM.ERROR_00005');
			}
			if (displayErrorDialog) {
				this.messageService.show(EIMMessageType.error, message);
			}

			completed.error({
				url: this.serverConfigService.getContextPath() + url,
				uploader: uploader,
				fileItem: fileItem,
				params: params,
				message: message});
		}

		myUploader.uploadAll();

		return completed;
	}

	/**
	 * アップロードサービスを呼び出します.
	 *
	 * @param url URL
	 * @param uploader ファイルアップローダ
	 * @return エミッタ
	 */
	public uploadList(url: string, uploader: FileUploader, fileList: File[], params?: any, converter?: (json: any) => any, displayProgressDialog = true, displayErrorDialog = true): EventEmitter<any> {
		let completed: EventEmitter<any> = new EventEmitter<any>();

		this.beginRequest(displayProgressDialog);

			let options: FileUploaderOptions = {
				url: this.serverConfigService.getContextPath() + url
			};
			options.additionalParameter = params;

			// 引数のuploaderを使用すると、個別のリクエスト単位でパラメータの設定ができないため
			// 個別にuploaderをインスタンス化する
			let myUploader: FileUploader = new FileUploader(options);

			myUploader.addToQueue(fileList);

			myUploader.onSuccessItem = (item, res: string, status: number, headers: ParsedResponseHeaders): any => {
				this.endRequest(displayProgressDialog);

				myUploader.clearQueue();
				myUploader.cancelAll();

				let json: any = this.jsonService.xml2json(res);

				// エラーチェック
				if (json.error) {
					// セッションタイムアウトかどうかを判定する
					if (this.sessionTimeoutService.checkSessionTimeout(this.getErrorMessage(json))) {
						this.sessionTimeoutService.doSessionTimeout(this.getErrorMessage(json));
					} else {
						if (displayErrorDialog) {
							this.messageService.show(EIMMessageType.error, this.getErrorMessage(json));
						}
					}
					completed.error({
						url: this.serverConfigService.getContextPath() + url,
						uploader: uploader,
						fileItem: fileList,
						params: params,
						message: this.getErrorMessage(json)
					});

				} else if (converter) {
					completed.emit(converter(json));

				} else {
					completed.emit(json);
				}
			}

			myUploader.onErrorItem = (item, response, status, headers) => {
				this.endRequest(displayProgressDialog);

				myUploader.clearQueue();
				myUploader.cancelAll();

				let message: string;
				if (status == 0) {
					// フォルダ等アップロードできないファイルの場合
					message = this.translateService.instant('EIM.ERROR_00006');
				} else {
					message = this.translateService.instant('EIM.ERROR_00005');
				}
				if (displayErrorDialog) {
					this.messageService.show(EIMMessageType.error, message);
				}

				completed.error({
					url: this.serverConfigService.getContextPath() + url,
					uploader: uploader,
					fileItem: fileList,
					params: params,
					message: message
				});
			}

			myUploader.uploadAll();

		return completed;
	}
	/**
	 * リクエストの前処理を行います.
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 */
	public beginRequest(displayProgressDialog: boolean): void {
		this.count++;
		if (displayProgressDialog) {
			if (this.countWithoutNonDisplayProgress == 0) {
				this.started.emit();
			}
			this.countWithoutNonDisplayProgress++;
		}
		document.querySelectorAll('body').item(0).classList.add('eim-wait-cursor');
		window.setTimeout(() => {
			this.startedDialog.emit();
		}, 1000);


	}

	/**
	 * リクエストの後処理を行います.
	 * @param displayProgressDialog 進捗ダイアログを表示するかどうか
	 */
	public endRequest(displayProgressDialog: boolean): void {
		this.count--;
		if (this.count <= 0) {
			document.querySelectorAll('body').item(0).classList.remove('eim-wait-cursor');
		}
		if (displayProgressDialog) {
			this.countWithoutNonDisplayProgress--;
			if (this.countWithoutNonDisplayProgress <= 0) {
				this.ended.emit();
			}
		}
	}

	/**
	 * リクエスト処理中かどうかを返却します.
	 * @return リクエスト処理中かどうか
	 */
	public isInRequest(): boolean {
		return this.count > 0;
	}

	/**
	 * パラメータをリクエストオプションに変換して返却します.
	 * @param params パラメータ
	 * @return リクエストオプション
	 */
	private getOptions(params: any): optionsDTO {
		let ua: string = window.navigator.userAgent.toLowerCase();
		let isIE = (ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0);

		let headers = new HttpHeaders({});
		if (isIE) {
			headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'If-Modified-Since': (new Date(0)).toUTCString() });
		}
		let options = new optionsDTO();
		options.headers = headers;

		if (params) {
			options.params = new HttpParams({
				fromObject: this.createParamWidthoutUndefined(params),
			});
		};
		return options;
	}

	/** 問い合わせ完了後のフォーカス対象を変更する
	 * @param element フォーカス対象エレメント
	*/
	public setFocusElement(element: HTMLElement): void {
		this.focusChanged.emit([element]);
	}

	/**
	 * サーバからの返却値からエラーメッセージを抽出する
	 * @param json サーバからの返却値
	 * @return エラーメッセージ
	 */
	private getErrorMessage(json: any): string {
		let message: string;
		if (json.error.attr) {
			message = json.error.attr.message;
		} else {
			message = json.error.message;
		}

		// XMLエンコードをデコードする
		message = message.replace(/&amp;/g, '&')
											.replace(/&lt;/g, '<')
											.replace(/&gt;/g, '>')
											.replace(/&#039;/g, '\'')
											.replace(/&#034;/g, '"');

		return message;
	}

	/**
	 * レスポンスをJSON形式に変換して返却します.
	 * @param res レスポンス
	 * @param url URL
	 * @return JSON形式に変換したレスポンス
	 */
	private convertJSON(res, url): any {
		if (url.indexOf('.mvc') > -1
			&& res.indexOf('<error') === -1) { // セッションが切れている場合XMLで返却されるため
			if (res == '') {
				return {}
			}

			let resultJson = null;
			try {
				resultJson = JSON.parse(res);
			} catch (e) {
				// エラー処理かチェック
				let resStrJson = res.toString().replace(/[\u0000-\u0019]+/g, "");
				if (JSON.parse(resStrJson).error) {
					resultJson = this.getJsonErrorMessage(res.toString());
				} else {
					throw e;
				}
			}
			return resultJson;
		} else {
			return this.jsonService.xml2json(res);
		}
	}

	/**
 	* エラーメッセージをJSON形式に変換して返却します.
 	* @param resStr レスポンス
 	* @return JSON形式に変換したエラーメッセージ
 	*/
	private getJsonErrorMessage(resStr: string): any {

		// エラーメッセージ取得
		let startIndex: number = resStr.indexOf("message") + 10;
		let endIndex: number = resStr.indexOf("\"", startIndex);
		let errorMessage: string = resStr.substring(startIndex, endIndex);

		// JSON形式で使用不可の文字を全て削除
		resStr = resStr.replace(/[\u0000-\u0019]+/g, "");
		let resultJson = JSON.parse(resStr);

		// エラーメッセージを設定
		if (resultJson.error.attr && resultJson.error.attr.message != null) {
			resultJson.error.attr.message = errorMessage;
		} else if (resultJson.error && resultJson.error.message != null) {
			resultJson.error.message = errorMessage;
		}
		return resultJson;
	}

	/**
	 * パラメータからundefinedを除外したパラメータを生成します.
	 * @param params パラメータ
	 * @returns パラメータからundefinedを除外したパラメータ
	 */
	private createParamWidthoutUndefined(params: any): any {
		let newParams: any = {};
		for (const key in params) {
			if (Array.isArray(params[key])) {
				newParams[key] = params[key].filter(item => item !== undefined)
			} else {
				if (params[key] !== null && params[key] !== undefined) {
					newParams[key] = params[key];
				}
			}
		}

		return newParams;
	}
}
