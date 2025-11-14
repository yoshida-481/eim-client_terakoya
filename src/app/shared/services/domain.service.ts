import { Injectable, Output, Injector, StaticProvider } from '@angular/core';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMJsonConvertibleDTO } from '../dtos/json-convertible.dto';

/**
 * ドメインサービス
 */
@Injectable()
export class EIMDomainService {

	/**
	 * コンストラクタです.
	 */
	constructor() {
	}

	/**
	 * JSONからオブジェクトを生成します.
	 */
	public createObject(json: any, createDomain: (json: any) => any): any {

		if (json == null) {
			return;
		}
		return createDomain(json);
	}

	/**
	 * JSONからオブジェクトリストを生成します.
	 */
	public createObjectList(jsons: any[], createDomain: (json: any) => any): any[] {

		const domains: any[] = [];

		if (jsons == null) {
			return domains;
		}
		if (Array.isArray(jsons)) {
			for (let i = 0; i < jsons.length; i++) {
				domains.push(createDomain(jsons[i]));
			}
		} else {
			domains.push(createDomain(jsons));
		}


		return domains;
	}

	/**
	 * JSONからオブジェクトリストを生成します.
	 */
	public createObjectListFromClass(jsons: any[], Class: typeof EIMJsonConvertibleDTO): any[] {

		if (jsons == null) {
			return null;
		}

		const domains: any[] = [];

		if (Array.isArray(jsons)) {
			for (let i = 0; i < jsons.length; i++) {
				domains.push(new Class(jsons[i]));
			}
		} else {
			domains.push(new Class(jsons));
		}


		return domains;
	}

	/**
	 * JSONからオブジェクトマップを生成します.
	 */
	public createObjectMap(jsons: any[], createKey: (json: any) => any, createDomain: (json: any) => any): any {

		const map: any = {};

		if (jsons == null) {
			return map;
		}
		for (let i = 0; i < jsons.length; i++) {
			map[createKey(jsons[i])] = createDomain(jsons[i]);
		}

		return map;
	}

	/**
	 * nameListからセッション言語の名称を返却します.
	 */
	public getName(nameList: any[]) {
		const providers: StaticProvider[] = [{ provide: EIMLocalStorageService, useClass: EIMLocalStorageService }];
		const injector = Injector.create({providers});
		const localStorageService: EIMLocalStorageService = injector.get(EIMLocalStorageService);
		const langId = localStorageService.getLangId();
		if (nameList == null || langId == null) {
			return null;
		}

		for (let i = 0; i < nameList.length; i++) {
			const otherName: any = nameList[i];
			// JSONレスポンスの場合
			if (langId === otherName.langId) {
				return otherName.name;
			}
			// XMLレスポンスの場合
			if ( otherName.attr ) {
				if (langId === otherName.attr.lang) {
					return otherName.attr.value;
				}
			} else {
				if (langId === otherName.lang) {
					return otherName.value;
				}
			}

		}

		return null;
	}

	/**
	 * プロパティがtrueかどうか判定します.
	 * @param domain ドメイン
	 * @param propertyName プロパティ名
	 * @return trueならtrue
	 */
	public isTrue(domain: any, propertyName: string): boolean {
		if (!domain.hasOwnProperty(propertyName)) {
			return false;
		}

		if (domain[propertyName] === true || domain[propertyName] === 'true') {
			return true;
		}

		return false;
	}

	/**
	 * プロパティがfalseかどうか判定します.
	 * @param domain ドメイン
	 * @param propertyName プロパティ名
	 * @return falseならtrue
	 */
	public isFalse(domain: any, propertyName: string): boolean {
		if (!domain.hasOwnProperty(propertyName)) {
			return false;
		}

		if (domain[propertyName] === false || domain[propertyName] === 'false') {
			return true;
		}

		return false;
	}

	/**
	 * 文字列を日付型に変換します.
	 * @param dateString 日付文字列
	 * @return 日付
	 */
	public convertDate(dateString: string): Date {
		if (!dateString) {
			return null;
		}
		return new Date(dateString);
	}

	/**
	 * 文字列を日付型(クライアントタイムゾーンの00:00:00に初期化)に変換します.
	 * @param dateString YYYY-MM-DD
	 * @return 日付
	 */
	public convertDateZero(dateString: string): Date {
		if (!dateString) {
			return;
		}
		let offset: number = new Date().getTimezoneOffset() / 60;
		let date: Date = new Date(dateString + 'T00:00:00Z');
		date.setHours(date.getHours() + offset);
		return date;
	}

}
