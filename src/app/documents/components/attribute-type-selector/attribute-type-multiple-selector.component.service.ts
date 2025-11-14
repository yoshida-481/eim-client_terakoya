import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';


/**
 * 属性タイプ複数選択コンポーネントサービス
 */
@Injectable()
export class EIMAttributeTypeMultipleSelectorComponentService extends EIMMultipleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
		super();
	}

	/**
	 * 初期表示時にデータを設定します.
	 */
	public setData(info: EIMMultipleSelectionComponentInfo): void {
		window.setTimeout(() => {
			info.selectedList.setData(info.selectedData);
			(<any>info.searchResultList).filter(info.selectedData);
		});
	}
}
