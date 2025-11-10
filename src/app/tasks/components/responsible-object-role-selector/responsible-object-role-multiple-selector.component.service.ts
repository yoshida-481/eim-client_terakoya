import { Injectable } from '@angular/core';

import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';

/**
 * 担当複数選択コンポーネントサービス
 */
@Injectable()
export class EIMResponsibleObjectRoleMultipleSelectorComponentService extends EIMMultipleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * データを設定します.
	 * オブジェクト情報リストをオブジェクトマスタDTOリストに変換します.
	 * @param info 複数選択コンポーネント情報
	 */
	// public setData(info: EIMMultipleSelectionComponentInfo): void {

	// 	// if (!info.selectedData || info.selectedData.length == 0) {
	// 	// 	info.selectedList.setData(data);
	// 	// 	(<any>info.searchResultList).filter(data);
	// 	// 	return;
	// 	// }

	// 	// for (let i = 0; i < info.selectedData.length; i++) {
	// 	// 	data.push(info.selectedData[i]);
	// 	// }
	// 	// info.selectedList.setData(data);
	// 	// (<any>info.searchResultList).filter(data);
	// }

}
