import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

/**
 * 文書管理初期状態
 */
export interface EIMDocumentInitState {
	// アコーディオン選択インデックス
	accordionIndex: number;
	// アコーディオン間の情報
	state: {
		colState: any[];
		sortState: any[];
	}[];
	// ツリーエリアサイズ
	treeAreaSize?: number;
}

export interface EIMFormTypeDisplayColumnColumn {
	// カラムID(属性タイプの場合は属性タイプID)
	columnId?: string;
	// 幅
	width?: number;
	// 名称
	name?: string;
	// 定義名称
	definitionName?: string;
	// ソート(昇順：'asc', 降順：'desc')
	sort?: string;
}

export interface EIMFormTypeDisplayColumn {
	// 帳票タイプID
	formTypeId?: number;
	// カラム
	columns?: EIMFormTypeDisplayColumnColumn[];
}

/**
 * ローカルストレージサービス
 */
@Injectable()
export class EIMLocalStorageService {

	// 表示列キー接頭辞
	private FORM_TYPE_DISPLAY_COLUMN_PREFIX = 'FORM_TYPE_DISPLAY_COLUMN_PREFIX';

	constructor(
		// protected messageService: EIMMessageService,
		// private router: Router,
			) {}

	/**
	 * ユーザコードを取得します.
	 */
	public getUserCode(): string {
		return localStorage.getItem('userCode');
	}

	/**
	 * ユーザIDを取得します.
	 */
	public getUserId(): number {
		let userId: string = localStorage.getItem('userId');
		return userId ? +userId : null;
	}

	/**
	 * 言語Idを取得します.
	 */
	public getLangId(): string {
		if (localStorage.getItem('langId') === void 0) {
			return null;
		}
		return localStorage.getItem('langId');
	}

	/**
	 * 選択言語Idリストを取得します.
	 */
	public getSelectableLangIdList(): any[] {
		if (localStorage.getItem(this.getApplicationNameSpace() + 'selectableLangIdList') === void 0) {
			return null;
		}
		let langIdList: string[];
		let json: string = localStorage.getItem(this.getApplicationNameSpace() + 'selectableLangIdList');
		if (json) {
			langIdList = JSON.parse(json);
		}
		return langIdList;
	}

	/**
	 * 使用言語の言語一覧を取得します.
	 */
	public getLanguages(): any[] {
		let selectedLanguageId = this.getLangId();
		let languageSets: any[] = this.getSelectableLangIdList();
		// 言語取得失敗時の処理
		// if (!languageSets || languageSets.length === 0) {
		// 	window.setTimeout(() => {
		// 		this.messageService.show(EIMMessageType.error, EIMAdminsConstantService.LANGUAGE_NOT_EXIST,
		// 			() => {
		// 			// ログイン画面に遷移する
		// 			this.router.navigate(['/admins/login']);
		// 	});
		// });
		// 	return;
		// }
		for (let i = 0; i < languageSets.length; i++) {
			if (languageSets[i].langId === selectedLanguageId) {
				return languageSets[i].nameList;
			}
		}
	}

	/**
	 * システム管理アプリケーション種別IDを取得します.
	 */
	public getAdminAppId(): string {
		if (localStorage.getItem('adminAppId') === void 0) {
			return null;
		}
		return localStorage.getItem('adminAppId');
	}

	/**
	 * 選択したシステム管理アプリケーション種別IDリストを取得します.
	 */
	public getSelectableAdminAppIdList(): any[] {
		if (localStorage.getItem('selectableAdminAppIdList') === void 0) {
			return null;
		}
		let adminAppIdList: string[];
		let json: string = localStorage.getItem('selectableAdminAppIdList');
		if (json) {
			adminAppIdList = JSON.parse(json);
		}
		return adminAppIdList;
	}

	/**
	 * 使用モードのモード一覧を取得します.
	 */
	public getAdminApps(): any[] {
		let selectedAdminAppId = this.getAdminAppId();
		let adminAppSets: any[] = this.getSelectableAdminAppIdList();
		for (let i = 0; i < adminAppSets.length; i++) {
			if (adminAppSets[i].adminAppId === selectedAdminAppId) {
				return adminAppSets[i].nameList;
			}
		}
	}

	/**
	 * 文字サイズを取得します.
	 */
	public getFontSize(): string {
		if (localStorage.getItem('fontSize') === void 0) {
			return null;
		}
		return localStorage.getItem('fontSize');
	}

	/**
	 * ユーザコードを設定します.
	 */
	public setUserCode(value: string): void {
		localStorage.setItem('userCode', value);
	}

	/**
	 * ユーザIDを設定します.
	 */
	public setUserId(value: number): void {
		let key = 'userId';
		if (value) {
			localStorage.setItem(key, value.toString());
		} else {
			localStorage.removeItem(key);
		}
	}

	/**
	 * 言語Idを設定します.
	 */
	public setLangId(value: string): void {
		localStorage.setItem('langId', value);
	}

	/**
	 * 選択言語Idリストを設定します.
	 */
	public setSelectableLangIdList(langIdList: any[]): void {
		localStorage.setItem(this.getApplicationNameSpace() + 'selectableLangIdList', JSON.stringify(langIdList));
	}

	/**
	 * モードIdを設定します.
	 */
	public setAdminAppId(value: string): void {
		localStorage.setItem('adminAppId', value);
	}

	/**
	 * 選択モードIdリストを設定します.
	 */
	public setSelectableAdminAppIdList(adminAppIdList: any[]): void {
		localStorage.setItem('selectableadminAppIdList', JSON.stringify(adminAppIdList));
	}

	/**
	 * 文字サイズを設定します.
	 */
	public setFontSize(value: string): void {
		localStorage.setItem('fontSize', value);
	}

	/**
	 * 表示列を取得します.
	 */
	public getFormTypeDisplayColumn(loginUserId: number, formTypeId: number): EIMFormTypeDisplayColumn {
		let key: string = this.FORM_TYPE_DISPLAY_COLUMN_PREFIX + '_' + loginUserId + '_' + formTypeId;
		let displayColumn: EIMFormTypeDisplayColumn = null;
		let json: string = localStorage.getItem(key);
		if (json) {
			displayColumn = JSON.parse(json);
		}
		return displayColumn;
	}

	/**
	 * 表示列を設定します.
	 */
	public setFormTypeDisplayColumn(loginUserId: number, displayColumn: EIMFormTypeDisplayColumn): void {
		let key: string = this.FORM_TYPE_DISPLAY_COLUMN_PREFIX + '_' + loginUserId + '_' + displayColumn.formTypeId;
		localStorage.setItem(key, JSON.stringify(displayColumn));
	}

	/**
	 * 表示列を削除します.
	 */
	public deleteFormTypeDisplayColumn(loginUserId: number, formTypeId: number): void {
		let key: string = this.FORM_TYPE_DISPLAY_COLUMN_PREFIX + '_' + loginUserId + '_' + formTypeId;
		localStorage.removeItem(key);
	}

	/**
	 * 文書管理初期状態を取得します.
	 */
	public getDocumentInitState(): EIMDocumentInitState {
		const userId = this.getUserId();
		const key = 'DOCUMENT_INIT_STATE_' + userId;
		const item = localStorage.getItem(key);
		if (!item) {
			return {
				accordionIndex: 0,
				state: []
			};
		}
		return JSON.parse(item);
	}

	/**
	 * 文書管理初期状態を設定します.
	 * @param state 初期表示状態
	 */
	public setDocumentInitState(state: EIMDocumentInitState): void {
		const userId = this.getUserId();
		const key = 'DOCUMENT_INIT_STATE_' + userId;
		localStorage.setItem(key, JSON.stringify(state));
	}

	/**
	 * 帳票管理初期表示アコーディオンインデックス番号を取得します.
	 */
	public getFormInitOpenAccorditonIndex(loginUserId: number): number {
		let key: string = 'FORM_INIT_OPEN_ACCORDION_INDEX_' + loginUserId;
		if (localStorage.getItem(key) === void 0) {
			return 0;
		}
		return Number(localStorage.getItem(key));
	}

	/**
	 * 帳票管理初期表示アコーディオンインデックス番号を設定します.
	 */
	public setFormInitOpenAccorditonIndex(loginUserId: number, value: number): void {
		let key: string = 'FORM_INIT_OPEN_ACCORDION_INDEX_' + loginUserId
		localStorage.setItem(key, String(value));
	}

	/**
	 * CSVダウンロード対象属性タイプIDを取得します。
	 * @param typeName オブジェクトタイプ定義名称
	 * @return 属性タイプIDリスト
	 */
	public getCsvDownloadItem(typeName: string): number[] {
		if (localStorage.getItem('csvDownloadItem') === void 0) {
			return null;
		}

		let items: any[] = JSON.parse(localStorage.getItem('csvDownloadItem'));
		if (items !== null && items !== void 0) {
			for (let i = 0; i < items.length; i++) {
				if (items[i].typeName === typeName) {
					let attrTypeIdList: number[] =  items[i].attrTypeIdList;
					return attrTypeIdList;
				}
			}
		}
		return null;
	}

	/**
	 * CSVダウンロード対象属性タイプIDを設定します.
	 * @param typeName オブジェクトタイプ定義名称
	 * @param attrTypeIdList 属性タイプIDリスト
	 */
	public setCsvDownloadItem(typeName: string, attrTypeIdList: number[]) {

		let csvDownloadItems: any[] = [];
		if (localStorage.getItem('csvDownloadItem') != null && localStorage.getItem('csvDownloadItem') !== void 0) {
			let items: any[] = JSON.parse(localStorage.getItem('csvDownloadItem'));
			for (let i = 0; i < items.length; i++) {
				if (items[i].typeName !== typeName) {
					csvDownloadItems.push(items[i]);
				}
			}
		}

		let csvDownloadItem: any = new Object();
		csvDownloadItem.typeName = typeName;
		csvDownloadItem.attrTypeIdList = attrTypeIdList;
		csvDownloadItems.push(csvDownloadItem);

		localStorage.setItem('csvDownloadItem', JSON.stringify(csvDownloadItems));
	}

	/**
	 * 名称変更ダイアログ表示を取得します.
	 */
	public getDispConfirmRenameFile(): string {
		if (localStorage.getItem('dispConfirmRenameFile') === void 0) {
			return null;
		}
		return localStorage.getItem('dispConfirmRenameFile');
	}
	/**
	 * 名称変更ダイアログ表示を設定します.
	 */
	public setDispConfirmRenameFile(value: string): void {
		localStorage.setItem('dispConfirmRenameFile', value);
	}
	/**
	 * ファイル上書きダイアログ表示を取得します.
	 */
	public getDispConfirmUpdateFile(): string {
		if (localStorage.getItem('dispConfirmUpdateFile') === void 0) {
			return null;
		}
		return localStorage.getItem('dispConfirmUpdateFile');
	}
	/**
	 * 名称変更ダイアログ表示を設定します.
	 */
	public setDispConfirmUpdateFile(value: string): void {
		localStorage.setItem('dispConfirmUpdateFile', value);
	}

	/**
	 * ユーザ情報を取得します.
	 */
	public getUserItems(): any {
		const userId = this.getUserId();
		if (!userId) {
			return {};
		}
		const items = localStorage.getItem(userId.toString());
		if (!items) {
			return {};
		}
		return JSON.parse(items);
	}

	/**
	 * ユーザ情報を設定します.
	 * @param items 初期表示状態
	 */
	public setUserItems(items: any): void {
		const userId = this.getUserId();
		if (userId) {
			localStorage.setItem(userId.toString(), JSON.stringify(items));
		}
	}

	/**
	 * キーを指定してユーザ情報を取得します.
	 * 
	 * @param keys キー配列（['a', 'b']を指定すると、＜ユーザID＞/a/bの情報を返却します）
	 */
	public getUserItemByKeys(keys: string[]): any {
		let items = this.getUserItems();
		for (let i = 0; i < keys.length; i++) {
			items = items?.[keys[i]] ?? null;
			if (items === null) {
				return null;
			}
		}
		return items;
	}

	/**
	 * キーを指定してユーザ情報を設定します.
	 * 
	 * @param keys キー配列（['a', 'b']を指定すると、＜ユーザID＞/a/bに指定した情報を設定します）
	 * @param item 設定する情報
	 */
	public setUserItemByKeys(keys: string[], item: any): void {
		const items = this.getUserItems();
		let childItems = items;
		for (let i = 0; i < keys.length; i++) {
			if ((childItems?.[keys[i]] ?? null) === null) {
				childItems[keys[i]] = {};
			}

			if (i === keys.length -1 && item === null) {
				delete childItems[keys[i]];
			}

			childItems = childItems[keys[i]];
		}
		Object.assign(childItems, item)

		this.setUserItems(items);
	}

	/**
	 * ユーザ情報から指定のキー情報を削除します.
	 * 
	 * @param keys キー配列（['a', 'b']を指定すると、＜ユーザID＞/a/bに指定した情報を設定します）
	 */
	public removeUserItemByKeys(keys: string[]): void {
		const items = this.getUserItems();
		let childItems = items;
		for (let i = 0; i < keys.length; i++) {
			if ((childItems?.[keys[i]] ?? null) === null) {
				childItems[keys[i]] = {};
			}

			if (i === keys.length -1) {
				delete childItems[keys[i]];
			}

			childItems = childItems[keys[i]];
		}
		this.setUserItems(items);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * アプリケーションのネームスペースを取得する。
	 * @return アプリケーションのネームスペース
	 */
	private getApplicationNameSpace(): string {
		const pathname: string = window.location.pathname;
		const hash: string = window.location.hash.split('/')[1];
		return pathname + hash + '_';
	}
}
