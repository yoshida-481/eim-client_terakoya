import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';

import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMContentsSearchComponent } from 'app/documents/components/contents-search/contents-search.component';

/**
 * コンテンツ選択（複数選択）コンポーネントサービス
 */
@Injectable()
export class EIMContentsMultipleSelectorComponentService extends EIMMultipleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
	) {
		super();
	}

	/**
	 * 追加します.
	 * @param info 複数選択コンポーネント情報
	 */
	public add(info: EIMMultipleSelectionComponentInfo): void {
		// 検索結果の選択行を選択一覧に追加
		// （検索結果には選択行が含まれない前提）
		let addData: any = info.searchResultList.getSelectedData();
		let okData = [];
		let selectedData = info.selectedList.getData();
		if (!addData) {
			return;
		}
		loop: for (let i = 0; i < addData.length; i++) {
			let data = addData[i];
			for (let m = 0; m < okData.length; m++) {
				// 同一オブジェクトのページ違いが選択されている場合、対象から外す
				let selectOne = okData[m];
				if (Number(data.objId) === Number(selectOne.objId)) {
					continue loop;
				}
			}
			for (let m = 0; m < selectedData.length; m++) {
				let selectOne = selectedData[m];
				if (Number(data.objId) === Number(selectOne.objId)) {
					continue loop;
				}
			}
			okData.push(data);
		}

		info.selectedList.addRowData(okData);

		let rowIndex: number = (<EIMContentsSearchComponent>info.searchResultList).searchResultList.getFirstRowIndex();
		let scrollTop: number = (<EIMContentsSearchComponent>info.searchResultList).searchResultList.getScrollTop();
		(<any>info.searchResultList).filter(info.selectedList.getData());
		(<EIMContentsSearchComponent>info.searchResultList).searchResultList.setSelectRow(rowIndex, scrollTop);
	}

	/**
	 * 初期表示時にデータを設定します.
	 * @param info 複数選択コンポーネント情報
	 */
	public setData(info: EIMMultipleSelectionComponentInfo): void {
		window.setTimeout(() => {
			info.selectedList.setData(info.selectedData);
			(<any>info.searchResultList).filter(info.selectedData);
		});
	}
}
