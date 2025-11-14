import { Injectable, Output } from '@angular/core';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';

/**
 * スプリットステートサービス
 * @example
 *  HTML
 *    <as-split-area id="splitLeft" [size]="splitSetting.splitLeft.size"/>
 *    <as-split-area [size]="100 - splitSetting.splitLeft.size"/>
 *  TS
 *    public splitSetting = {
 *      splitLeft: {size: 25},
 *    }
 */
@Injectable()
export class EIMSplitStateService {

	/**
	 * コンストラクタです.
	 */
	constructor() {
	}

	/**
	 * 画面の状態を復元します.
	 * @param splitSetting スプリットの設定（<id>:{size: number}）
	 * @param state 状態
	 */
	public setState(state: any, splitSetting: any): void {
		let ids: string[] = Object.keys(splitSetting);
		for (let i = 0; i < ids.length; i++) {
			if (!state[ids[i]]) {
				continue;
			}

			splitSetting[ids[i]].size = state[ids[i]].size;
		}
	}

	/**
	 * 画面の状態を返却します.
	 * @param splitSetting スプリットの設定（<id>:{size: number}）
	 * @return 状態
	 */
	public getState(splitSetting: any): any {
		let state = {};
		let splitAreas = document.getElementById('split').getElementsByTagName('split-area');
		for (let i = 0; i < splitAreas.length; i++) {
			let splitArea: any = splitAreas[i];
			if (!splitArea.id || !splitSetting[splitArea.id]) {
				continue;
			}
			state[splitArea.id] = {};
			state[splitArea.id].size = this.getFlexBasisPercentage(splitArea['style'].flexBasis);
		}

		return state;
	}

	/**
	 * FlexBasisの設定から%の値を返却します.
	 * @param flexBasisStr FlexBasis設定値
	 * @return %の値
	 */
	private getFlexBasisPercentage(flexBasisStr: string): number {
		flexBasisStr = flexBasisStr.replace('calc(', '');
		flexBasisStr = flexBasisStr.split('%')[0];
		let work = flexBasisStr.split(' ');
		flexBasisStr = work[work.length - 1];
		return Number(flexBasisStr);

	}

}
