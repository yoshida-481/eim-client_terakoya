import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';


import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';

import { EIMObjectMasterDTO } from 'app/shared/dtos/object-master.dto';

/**
 * マスタ複数選択コンポーネントサービス
 */
@Injectable()
export class EIMMasterMultipleSelectorComponentService extends EIMMultipleSelectorComponentService {

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
	public setData(info: EIMMultipleSelectionComponentInfo): void {

		let data: EIMObjectMasterDTO[] = [];

		if (!info.selectedData || info.selectedData.length == 0) {
			info.selectedList.setData(data);
			(<any>info.searchResultList).filter(data);
			return;
		}

		for (let i = 0; i < info.selectedData.length; i++) {
			let master: EIMObjectMasterDTO = new EIMObjectMasterDTO(info.selectedData[i]);
			data.push(master);
		}
		info.selectedList.setData(data);
		(<any>info.searchResultList).filter(data);
	}

}
