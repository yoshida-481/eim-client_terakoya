import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from './hierarchical-domain.service';
import { EIMHierarchicalDomain } from 'app/shared/shared.interface';

import { xml2js } from 'xml-js';

/**
 * JSONサービス
 */
@Injectable()
export class EIMJSONService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		private hierarchicalDomainService: EIMHierarchicalDomainService) {}

	/**
	 * XMLをJSON形式に変換して返却します.
	 * @param xml 変換対象
	 * @return 変換後のJSON
	 */
	public xml2json(xml: string): any {
		return xml2js(xml, {compact: true, attributesKey: 'attr'});
	}

	/**
	 * JSON内の属性キーを削除します.
	 * @param json 変換対象
	 * @return 削除後のJSON
	 */
	public deleteAttributesKey(json: any): any {
		let keys: string[] = Object.keys(json);
		for (let i = 0; i < keys.length; i++) {
			if (Array.isArray(json[keys[i]])) {
				let array: any[] = json[keys[i]]
				for (let j = 0; j < array.length; j++) {
					if (typeof array[j] === 'object') {
						this.deleteAttributesKey(array[j]);
					}
				}
			} else {
				if (typeof json[keys[i]] === 'object') {
					this.deleteAttributesKey(json[keys[i]]);
				}
		}

			if (keys[i] === 'attr') {
				this.setAttribute(json, json[keys[i]]);
			}
		}
		return json;
	}

	/**
	 * JSONの子階層に変換をかけて返却します.
	 * @param jsonChildren JSONの子階層
	 * @param converter 変換関数((json: any): any)
	 */
	public getJsonChildren(jsonChildren: any, converter?: (json: any) => any): any[] {
		let retChildren: any[];
		if (!jsonChildren) {
			retChildren = [];
		} else if (Array.isArray(jsonChildren)) {
			retChildren = jsonChildren;
		} else {
			retChildren = [jsonChildren];
		}

		if (converter) {
			for (let i = 0; i < retChildren.length; i++) {
				retChildren[i] = converter(retChildren[i]);
			}
		}

		return retChildren;
	}

	/**
	 * JSONの各階層を変換し階層ドメイン形式で返却します.
	 * @param jsonParents 変換対象のJSON
	 * @param childNodeName 子階層のノード名
	 * @param converter 変換関数((json: any): any)
	 */
	public convertHierarchicalDomain(jsonParents: any, childNodeName: string, converter: (json: any) => any): any[] {

		let domains: any[] = [];
		let parents: any[];
		if (!jsonParents) {
			parents = [];
		} else if (Array.isArray(jsonParents)) {
			parents = jsonParents;
		} else {
			parents = [ jsonParents ];
		}

		for (let i = 0; i < parents.length; i++) {
			let parentDomain = converter(parents[i]);

			let childDomain: EIMHierarchicalDomain[] = [];
			if (parents[i][childNodeName]) {
				childDomain = this.convertHierarchicalDomain(parents[i][childNodeName], childNodeName, converter);
			}
			if (parentDomain != null) {
				this.hierarchicalDomainService.setChildren(parentDomain, childDomain);
				domains.push(parentDomain);
			}
		}
		return domains;
	}

	/**
	 * JSONに属性を設定します.
	 * @param json JSON
	 * @param attr 属性オブジェクト
	 */
	private setAttribute(json, attr): void {
		let keys: string[] = Object.keys(attr);
		for (let i = 0; i < keys.length; i++) {
			json[keys[i]] = attr[keys[i]];
		}
		delete json['attr'];
	}

}
