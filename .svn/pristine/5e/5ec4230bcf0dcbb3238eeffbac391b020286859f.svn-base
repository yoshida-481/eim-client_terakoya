import { Output, EventEmitter, Injectable, Directive } from '@angular/core';
import { of, Observable } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService, EIMMessageType } from './message.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMServerConfigService } from './server-config.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { HttpParameterCodec } from '@angular/common/http';

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
 * RestAPI用のHTTPサービスです。<br/>
 * @class EIMHttpService
 * @module EIMSharedModule
 */
@Injectable()
export class EIMHttpForRestAPIService {

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

	// アクセス中のリクエスト数
	private count = 0;
	// アクセス中のリクエスト数(プログレスバー表示問い合わせ除く)
	private countWithoutNonDisplayProgress = 0;

	/** jsonのコンテントタイプ */
	private static readonly CONTENT_TYPE_JSON = 'application/json; charset=utf-8';

	/** x-www-form-urlencodedのコンテントタイプ */
	private static readonly CONTENT_TYPE_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';
	/**
	 * コンストラクタです.
	 */
	constructor(
		private http: HttpClient,
		private messageService: EIMMessageService,
		private sessionTimeoutService: EIMSessionTimeoutService,
		private serverConfigService: EIMServerConfigService,
		private translateService: TranslateService,
	) { }

	/**
	 * HTTP GETサービスを呼び出します.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public get(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let headers = new HttpHeaders({});
		let optionParams = params === null ? null :
				new HttpParams({
					encoder: new BrowserStandardEncoder(), fromObject: this.createParamWidthoutUndefined(params),
				});

		let options = {
			headers: headers,
			params: optionParams,
			observe: 'response' as 'body'
		}

		this.beginRequest(displayProgressDialog);

		return this.http.get(this.serverConfigService.getContextPath() + url, options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };
			}))
			// エラー発生時
			.pipe(catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));
	}

	/**
	 * HTTP POSTサービスを呼び出します.<br>
	 * コンテントタイプにapplication/x-www-form-urlencodedを使用します.<br>
	 * サーバサイドにて引数paramsに対応するドメインが存在せず、キーバリュー形式でリクエストする場合に使用してください.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public post(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let headers = new HttpHeaders({ 'Content-Type': EIMHttpForRestAPIService.CONTENT_TYPE_X_WWW_FORM_URLENCODED });
		const body = new HttpParams({
			encoder: new BrowserStandardEncoder(),fromObject: this.createParamWidthoutUndefined(params),
		});

		let options = {
			headers: headers,
			observe: 'response' as 'body'
		}

		this.beginRequest(displayProgressDialog);
		return this.http.post(this.serverConfigService.getContextPath() + url, body.toString(), options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };
			}))
			// エラー発生時
			.pipe(catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));

	}

	/**
	 * HTTP POSTサービスを呼び出します.<br>
	 * コンテントタイプにapplication/jsonを使用します.<br>
	 * サーバサイドにて引数paramsに対応するドメインが存在する場合に使用してください.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public postJson(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let headers = new HttpHeaders({ 'Content-Type': EIMHttpForRestAPIService.CONTENT_TYPE_JSON });
		const body = JSON.stringify(params, this.replacer);

		let options = {
			headers: headers,
			observe: 'response' as 'body'
		}

		this.beginRequest(displayProgressDialog);
		return this.http.post(this.serverConfigService.getContextPath() + url, body, options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };

			}))
			// エラー発生時
			.pipe(catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));

	}

	/**
	 * HTTP POSTサービスを呼び出します.<br>
	 * コンテントタイプにmultipart/form-dataを使用します.<br>
	 * ファイルを送付する場合や、サーバサイドにて引数paramsに対応するドメインが存在せず、マップ形式でリクエストする場合に使用してください.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public postMultipart(url: string, params?: any, file?: File | File[], displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		const headers = new HttpHeaders({});
		const body = this.createFormData(params);
		if (file) {
			if (file instanceof Array) {
				for (let _file of file) {
					body.append('files', _file);
				}
			} else {
				body.append('file', file);
			}
		}

		let options = {
			headers: headers,
			observe: 'response' as 'body'
		}

		this.beginRequest(displayProgressDialog);
		return this.http.post(this.serverConfigService.getContextPath() + url, body, options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };
			}),
			// エラー発生時
			catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));
	}

	/**
	 * HTTP PUTサービスを呼び出します.
	 * コンテントタイプにapplication/x-www-form-urlencodedを使用します.<br>
	 * サーバサイドにて引数paramsに対応するドメインが存在せず、キーバリュー形式でリクエストする場合に使用してください.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public put(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let headers = new HttpHeaders({ 'Content-Type': EIMHttpForRestAPIService.CONTENT_TYPE_X_WWW_FORM_URLENCODED });
		const body = new HttpParams({
			encoder: new BrowserStandardEncoder(),fromObject: this.createParamWidthoutUndefined(params),
		});

		let options = {
			headers: headers,
			observe: 'response' as 'body'
		}

		this.beginRequest(displayProgressDialog);
		return this.http.put(this.serverConfigService.getContextPath() + url, body.toString(), options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };
			}))
			// エラー発生時
			.pipe(catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));

	}

	/**
	 * HTTP PUTサービスを呼び出します.
	 * コンテントタイプにapplication/jsonを使用します.<br>
	 * サーバサイドにて引数paramsに対応するドメインが存在する場合に使用してください.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public putJson(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let headers = new HttpHeaders({ 'Content-Type': EIMHttpForRestAPIService.CONTENT_TYPE_JSON });
		let body = JSON.stringify(params, this.replacer);

		let options = {
			headers: headers,
			observe: 'response' as 'body'
		}

		this.beginRequest(displayProgressDialog);
		return this.http.put(this.serverConfigService.getContextPath() + url, body, options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };
			}))
			// エラー発生時
			.pipe(catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));

	}

	/**
	 * HTTP PUTサービスを呼び出します.<br>
	 * コンテントタイプにmultipart/form-dataを使用します.<br>
	 * ファイルを送付する場合や、サーバサイドにて引数paramsに対応するドメインが存在せず、マップ形式でリクエストする場合に使用してください.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public putMultipart(url: string, params?: any, file?: File | File[], displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		const headers = new HttpHeaders({});
		const body = this.createFormData(params);
		if (file) {
			if (file instanceof Array) {
				for (let _file of file) {
					body.append('files', _file);
				}
			} else {
				body.append('file', file);
			}
		}

		const options = {
			headers: headers,
			observe: 'response' as 'body'
		};

		this.beginRequest(displayProgressDialog);

		return this.http.put(this.serverConfigService.getContextPath() + url, body, options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };
			}),
			// エラー発生時
			catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));
	}

	/**
	 * HTTP Deleteサービスを呼び出します.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public delete(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let headers = new HttpHeaders({});
		let optionParams = params === null ? null :
				new HttpParams({
					encoder: new BrowserStandardEncoder(), fromObject: this.createParamWidthoutUndefined(params),
				});

		let options = {
			headers: headers,
			params: optionParams,
			observe: 'response' as 'body'
		}

		this.beginRequest(displayProgressDialog);

		return this.http.delete(this.serverConfigService.getContextPath() + url, options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };
			}),
			// エラー発生時
			catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));
	}

	/**
	 * HTTP Deleteサービスを呼び出します.
	 * コンテントタイプにapplication/jsonを使用します.<br>
	 * サーバサイドにて引数paramsに対応するドメインが存在する場合に使用してください.
	 *
	 * @param {string} url URL
	 * @param {any} [params] パラメータ
	 * @return {Observable<any>} オブザーバ
	 */
	public deleteJson(url: string, params?: any, displayProgressDialog = true, displayErrorDialog = true): Observable<any> {

		let headers = new HttpHeaders({ 'Content-Type': EIMHttpForRestAPIService.CONTENT_TYPE_JSON });
		let body = JSON.stringify(params);

		let options = {
			headers: headers,
			body: body,
			observe: 'response' as 'body'
		};

		this.beginRequest(displayProgressDialog);

		return this.http.request('delete', this.serverConfigService.getContextPath() + url, options)
			// 正常終了時
			.pipe(map((res) => {

				this.endRequest(displayProgressDialog);

				return { value: res['body'] };
			}),
			// エラー発生時
			catchError((error: any) => {

				this.endRequest(displayProgressDialog);
				error['url'] = url;
				return this.handleErrorResponse(error, displayErrorDialog);

			}));
	}

	/**
	 * ファイルをダウンロードします.
	 *
	 * @param {string} url URL
	 * @param {boolean} forceDownload ファイルダウンロードするかどうか
	 * @param {any} [params] パラメータ
	 */
	public downloadFile(url: string, forceDownload: boolean, params?: any): void {

		let httpParams: HttpParams = new HttpParams({
			encoder: new BrowserStandardEncoder(), fromObject: this.createParamWidthoutUndefined(params),
		});

		let ref = null;
		try {
			if (forceDownload) {
				ref = window.open(this.serverConfigService.getContextPath() + url + '?' + httpParams.toString(), 'workFrame');
			} else {
				// ビルドしてサーバに配置するとブラウザのタブが開きます
				ref = window.open(this.serverConfigService.getContextPath() + url + '?' + httpParams.toString());
			}
		} catch(e) {
			console.log(JSON.stringify(e));
		} finally {
			if (!ref) {
				console.log('cant open window');
			}

		}
	}

	/**
	 * レスポンスのエラーをハンドリングします.
	 * エラーダイアログを表示し、エラーをスルーします.
	 * またセッションタイムアウトの場合、セッションタイムアウトの処理を実施します？
	 *
	 * @param error エラー情報
	 * @param displayErrorDialog エラーダイアログを表示するかどうか
	 */
	protected handleErrorResponse(error, displayErrorDialog: boolean): Observable<any> {

		// エラーメッセージ取得
		let errorMessage: string = null;
		if (error?.error?.error?.message) {
			errorMessage = error.error.error.message;
		} else {
			// レスポンスのエラーメッセージのフォーマットが想定外の場合(サーバに届かなかった場合等)
			errorMessage = this.translateService.instant('EIM.ERROR_00005');
		}

		// タイムアウトのチェック
		if (error.status === 401) {
			if (this.sessionTimeoutService.checkSessionTimeout(errorMessage)) {
				this.sessionTimeoutService.doSessionTimeout(errorMessage);
				throw error;
			}
		}

		if (displayErrorDialog) {
			this.messageService.show(EIMMessageType.error, errorMessage);
		}

		throw error;

	}

	/**
	 * 文字列がJSONかどうか判定します.
	 *
	 * @param str 文字列
	 * @returns JSONならtrue
	 */
	protected isJson(str) {
		try {
			JSON.parse(str);
		} catch (error) {
			return false;
		}
		return true;
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

	/** 問い合わせ完了後のフォーカス対象を変更する
	 * @param element フォーカス対象エレメント
	*/
	public setFocusElement(element: HTMLElement): void {
		this.focusChanged.emit([element]);
	}

	/**
	 * レスポンスをJSON形式に変換して返却します.
	 * @param res レスポンス
	 * @param url URL
	 * @return JSON形式に変換したレスポンス
	 */
	private convertJSON(headers, body, url): any {

		// レスポンスがJSONの場合
		if (headers.get('Content-Type') && headers.get('Content-Type').startsWith('application/json')) {

			let resultJson = null;
			try {
				resultJson = JSON.parse(body);
			} catch (e) {
				// エラー処理かチェック
				let resStrJson = body.toString().replace(/[\u0000-\u0019]+/g, "");
				if (JSON.parse(resStrJson).error) {
					resultJson = this.getJsonErrorMessage(body.toString());
				} else {
					throw e;
				}
			}
			return resultJson;
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

			if (newParams[key] instanceof Object) {
				newParams[key] = JSON.stringify(newParams[key]);
			}
		}

		return newParams;
	}

	/**
	 * FormDataを生成します.
	 *
	 * @param params パラメータ
	 * @returns FormData
	 */
	private createFormData(params): FormData {
		if (!params) {
			return null;
		}

		const formData = new FormData();
		Object.keys(params).forEach(key => {
			if (!params[key]) {
				return;
			}

			if (typeof params[key] === 'string') {
				// Stringの場合は変換しない
				formData.append(key, params[key]);
			} else {
				formData.append(key, JSON.stringify(params[key], this.replacer));
			}
		});

		return formData;
	}

	/** 
	 * JSON.stringifyのreplacerです.
	 * 値がMapの場合にエントリ配列に変換します.
	 * 
	 * @param key キー
	 * @param value 値
	 */
	private replacer(key, value) {
		if(value instanceof Map) {
			const retValue = {};
			for (const [mapKey, mapValue] of value.entries()) {
				retValue[mapKey] = mapValue;
			}
			return retValue;

		} else if(value instanceof Set) {
			return Array.from(value);

		} else {
		  return value;
		}
	  }

}
