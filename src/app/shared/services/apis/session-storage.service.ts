import { Injectable } from '@angular/core';

/**
 * セッションストレージサービス
 */
@Injectable()
export class EIMSessionStorageService {

	/**
	 * コンストラクタです.
	 */
	constructor() {}

	/**
	 * 値を設定します.
	 * @param subSystemName サブシステム名
	 * @param key キー名
	 * @param value 値
	 */
	public set(subSystemName: string, key: string, value: any): void {
		sessionStorage.setItem(subSystemName + '_' + key, JSON.stringify(value));
	}

	/**
	 * 値を取得します.
	 * @param subSystemName サブシステム名
	 * @param key キー名
	 * @return 値
	 */
	public get(subSystemName: string, key: string): any {
		return JSON.parse(sessionStorage.getItem(subSystemName + '_' + key));
	}

	/**
	 * 値を削除します.
	 * @param subSystemName サブシステム名
	 * @param key キー名
	 */
	public removeItem(subSystemName: string, key: string): void {
		sessionStorage.removeItem(subSystemName + '_' + key);
	}
}
