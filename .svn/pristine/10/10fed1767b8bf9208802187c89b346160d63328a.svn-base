import { Injectable } from '@angular/core';
import { EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMCacheEntrySearchAttributeTypeDTO } from 'app/admins/shared/dtos/cache-entry-search-attribute-type.dto';
import { EIMCacheEntryDTO } from 'app/admins/shared/dtos/cache-entry.dto';
import { TranslateService } from '@ngx-translate/core';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

/**
 * キャッシュ管理キャッシュエントリサービス
 */
@Injectable()
export abstract class EIMCacheMonistorViewCacheEntryService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dateService: EIMDateService,
		protected localStorageService: EIMLocalStorageService
	) {
	}

	/**
	 * キャッシュエントリ一覧に表示するカラムリストを返却します.
	 * @param attributeTypes 属性タイプリスト
	 * @return カラムリスト
	 */
	public abstract getColumns(attributeTypes?: EIMCacheEntrySearchAttributeTypeDTO[]): EIMDataGridColumn[];

	/**
	 * キャッシュエントリ情報を画面表示用にコンバートします.
	 * @param entry キャッシュエントリ情報
	 * @param attributeTypes 属性タイプリスト
	 * @return コンバート後のオブジェクト
	 */
	public abstract convertToObject(entry: EIMCacheEntryDTO, attributeTypes?: EIMCacheEntrySearchAttributeTypeDTO[]): any;

	/**
	 * オブジェクトからパラメータ名をたどって値を返却します.
	 * @param object オブジェクト
	 * @param paramNames パラメータ名のリスト
	 * @return オブジェクトの値
	 */
	protected getValue(object: any, paramNames: string[]): any {
		if (paramNames === null || paramNames.length === 0) {
			return object;
		}
		if (paramNames[0] === '') {
			return object;
		}
		if (object[paramNames[0]] === undefined) {
			return null;
		}

		const childEntry = object[paramNames[0]];
		if (childEntry === null) {
			return null;
		}

		paramNames.shift();
		return this.getValue(childEntry, paramNames);
	}

	/**
	 * オブジェクトからパラメータ名をたどって文字列を返却します.
	 * @param object オブジェクト
	 * @param paramName パラメータ名
	 * @return オブジェクトの値
	 */
	protected getStringValue(object: any, paramName: string): string {
		const paramNames: string[] = paramName.split('.');
		const value: string = this.getValue(object, paramNames);

		return value;
	}

	/**
	 * オブジェクトからパラメータ名をたどって数値を返却します.
	 * @param object オブジェクト
	 * @param paramName パラメータ名
	 * @return オブジェクトの値
	 */
	protected getNumberValue(object: any, paramName: string): Number {
		const paramNames: string[] = paramName.split('.');
		const value: string = this.getValue(object, paramNames);

		if (value === null) {
			return null;
		}

		return Number(value);
	}

	/**
	 * オブジェクトからパラメータ名をたどって日付を返却します.
	 * @param object オブジェクト
	 * @param paramName パラメータ名
	 * @return オブジェクトの値
	 */
	protected getDateValue(object: any, paramName: string): String {
		const paramNames: string[] = paramName.split('.');
		const value: string = this.getValue(object, paramNames);

		if (value === null) {
			return null;
		}

		return this.dateService.getDateTimeString(Number(value));
	}

	/**
	 * オブジェクトからパラメータ名をたどって真偽値を返却します.
	 * @param object オブジェクト
	 * @param paramName パラメータ名
	 * @return オブジェクトの値
	 */
	protected getBooleanValue(object: any, paramName: string): Boolean {
		const paramNames: string[] = paramName.split('.');
		const value: string = this.getValue(object, paramNames);

		if (value === null) {
			return null;
		}

		return value || value === 'true' ? true : false;
	}

	/**
	 * オブジェクトからパラメータ名をたどって名称を返却します.
	 * @param object オブジェクト
	 * @param paramName パラメータ名
	 * @return オブジェクトの値
	 */
	protected getNameValue(object: any, paramName: string): string {
		const paramNames: string[] = paramName.split('.');
		const value: any[] = this.getValue(object, paramNames);

		if (value === null) {
			return null;
		}

		let name = '';
		const langId = this.localStorageService.getLangId();
		for (let i = 0; i < value.length; i++) {
			if (langId !== value[i].langId) {
				continue;
			}
			name = value[i].name;
		}
		return name;
	}

	/**
	 * オブジェクトからリストまでのパラメータ名をたどってリスト値を取得.
	 * さらに各リストの下のオブジェクトをパラメタ名をたどって取得し"|"で連結して返却します.
	 * @param object オブジェクト
	 * @param listParramName リストまでのパラメータ名
	 * @param method リストは以下の取得メソッド
	 * @param paramName パラメータ名
	 * @return オブジェクトの値
	 */
	protected getListValue(object: any, listParamName: string,
			method: (object: any, paramName: string) => any, paramName = ''): string {
		const listParamNames: string[] = listParamName.split('.');
		const list: any[] = this.getValue(object, listParamNames);

		if (list === null) {
			return null;
		}

		let listValue = '';
		for (let i = 0; i < list.length; i++ ) {
			const value = method(list[i], paramName);
			if (value === null) {
				continue;
			}

			if (listValue.length > 0) {
				listValue += '|';
			}
			listValue += value;
		}
		return listValue;
	}
}
