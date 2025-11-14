import { Injectable } from '@angular/core';
import { EIMMenuItem } from '../shared.interface';

export interface EIMMenuChangeDetectionServiceInfo {
	keyValueMap: Map<string, any>,
}

/**
 * メニューの変更検知サービス
 */
@Injectable()
export class EIMMenuChangeDetectionService {

	// 変更チェック対象のプロパティ名リスト（表示に関連するプロパティのみ）
	protected readonly CHECK_TARGET_PROPERTIES: string[] = [
		// 'label',
		'icon',
		// 'command',
		// 'url',
		// 'items',
		// 'expanded',
		'disabled',
		'visible',
		'target',
		'escape',
		// 'routerLinkActiveOptions',
		'separator',
		'badge',
		'tooltip',
		'tooltipPosition',
		'badgeStyleClass',
		'style',
		'styleClass',
		'title',
		// 'id',
		// 'automationId',
		'tabindex',
		// 'routerLink',
		// 'queryParams',
		// 'fragment',
		// 'queryParamsHandling',
		// 'preserveFragment',
		// 'skipLocationChange',
		// 'replaceUrl',
		// 'state',
		// 'tooltipOptions'
		// 'name',
		'items',
		'rKey',
		'isUnavailable'
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
	}

	/**
	 * メニュー要素のDiffer情報を生成します.
	 * @param rootMenuItems メニュー要素配列
	 * @return メニュー要素のDiffer情報
	 */
	public createDifferInfo(rootMenuItems: EIMMenuItem[]): EIMMenuChangeDetectionServiceInfo {
		let info: EIMMenuChangeDetectionServiceInfo = {
			keyValueMap: new Map<string, any>()
		}

		if (rootMenuItems) {
			this.createDifferInfoRecursive(info, 'root', rootMenuItems);
		}
		return info;
	}

	/**
	 * メニュー要素の変更があったかチェックします.
	 * @param info メニュー要素のDiffer情報
	 * @param rootMenuItems メニュー要素配列
	 * @return メニュー要素の変更があった場合true
	 */
	public isChanged(info: EIMMenuChangeDetectionServiceInfo, rootMenuItems: EIMMenuItem[]): boolean {
		const isChanged = this.isChangedRecursive(info, 'root', rootMenuItems);
		if (isChanged) {
			this.createDifferInfoRecursive(info, 'root', rootMenuItems);
		}
		return isChanged;
	}

	/**
	 * メニュー要素のDiffer情報を生成します.(再帰)
	 * @param info メニュー要素のDiffer情報
	 * @param keyName Differ情報Mapのキー名（root_<階層1のラベル名>_<階層2のラベル名>_<階層3のラベル名>）
	 * @param menuItems メニュー要素配列
	 * @return メニュー要素のDiffer情報
	 */
	protected createDifferInfoRecursive(info: EIMMenuChangeDetectionServiceInfo, keyName: string, menuItems: EIMMenuItem[]): void {

		// keyValueMapを設定
		for (let i = 0; i < menuItems.length; i++) {
			// 画面に表示するラベルをキーに設定します
			if (!menuItems[i].label) {
				continue;
			}

			let keyValueObject = {};
			info.keyValueMap.set(keyName + '_' + menuItems[i].label, keyValueObject);
			for (let j = 0; j < this.CHECK_TARGET_PROPERTIES.length; j++) {
				keyValueObject[this.CHECK_TARGET_PROPERTIES[j]] = menuItems[i][this.CHECK_TARGET_PROPERTIES[j]];
			}

			if (menuItems[i].items) {
				this.createDifferInfoRecursive(info, keyName + '_' + menuItems[i].label, menuItems[i].items);
			}
		}
	}

	/**
	 * メニュー要素の変更があったかチェックします.(再帰)
	 * @param info メニュー要素のDiffer情報
	 * @param keyName Differ情報Mapのキー名（root_<階層1のラベル名>_<階層2のラベル名>_<階層3のラベル名>）
	 * @param menuItems メニュー要素配列
	 * @returns メニュー要素の変更があった場合true
	 */
	protected isChangedRecursive(info: EIMMenuChangeDetectionServiceInfo, keyName: string, menuItems: EIMMenuItem[]): boolean {

		// keyValueで値の変更をチェック
		for (let i = 0; i < menuItems.length; i++) {
			const menuItem = menuItems[i];
			if (!menuItem.label) {
				continue;
			}

			// keyValueで値の変更をチェック
			const keyValueObject = info.keyValueMap.get(keyName + '_' + menuItem.label);
			if (!keyValueObject) {
				return false;
			}

			for (let j = 0; j < this.CHECK_TARGET_PROPERTIES.length; j++) {
				if (keyValueObject[this.CHECK_TARGET_PROPERTIES[j]] !== menuItems[i][this.CHECK_TARGET_PROPERTIES[j]]) {
					// console.log(keyName + '\t' + menuItem.label + '\t' + this.CHECK_TARGET_PROPERTIES[j] + '\told:' + keyValueObject[this.CHECK_TARGET_PROPERTIES[j]] + '\tnew:' + menuItems[i][this.CHECK_TARGET_PROPERTIES[j]]);
					return true;
				}
			}

			if (menuItems[i].items) {
				let isChanged = this.isChangedRecursive(info, keyName + '_' + menuItems[i].label, menuItems[i].items);
				if (isChanged) {
					return true;
				}
			}
		}
		return false;
	}

}

