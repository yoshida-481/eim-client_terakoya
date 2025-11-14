import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo, } from 'app/shared/components/multiple-selector/multiple-selector.component.service';

import { EIMSelectorComponent, EIMSelectorComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMFormListColumnMultipleSelectorComponentService } from 'app/forms/components/form-list-column-selector/form-list-column-multiple-selector.component.service';




/**
 * 属性タイプ複数選択コンポーネントサービス
 */
@Injectable()
export class EIMClassFormListColumnMultipleSelectorComponentService extends EIMFormListColumnMultipleSelectorComponentService {


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 追加します.
	 * @param info 複数選択コンポーネント情報
	 */
	public add(info: EIMMultipleSelectionComponentInfo): boolean {
		let selectedData: any = info.searchResultList.getSelectedData();
		if (!selectedData || selectedData.length === 0) {
			return false;
		}
		let selectedList = info.selectedList.getData();
		let addData = [];

		for (let i = 0; i < selectedData.length; i++) {
			let exist = true;
			for (let j = 0; j < selectedList.length; j++) {
				if (this.equals(selectedData[i], selectedList[j])) {
					exist = false;
				}
			}
			if (exist) {
				addData.push(selectedData[i]);
			}
		}

		info.selectedList.addRowData(addData);
		let action = false;
		if (addData.length > 0) {
			action = true;
		}
		let index = info.selectedList.getData().length - 1;

		let bkEquals = info.selectedList;
		let bkInfoEquals = info.selectedList.info.equals;
		info.selectedList.equals = this.equals;
		info.selectedList.info.equals = this.equals;
		info.selectedList.select(addData);
		info.selectedList = bkEquals;
		info.selectedList.info.equals = bkInfoEquals;
		info.selectedList.ensureIndexVisible(index);
		// 追加行を選択
		let searchResultDataGrid: EIMDataGridComponent = (<EIMDataGridSingleSelectorComponent>info.searchResultList).info.dataGrid;
		let rowIndex: number = searchResultDataGrid.getFirstRowIndex();
		let scrollTop: number = searchResultDataGrid.getScrollTop();
		(<any>info.searchResultList).filter(info.selectedList.getData());
		searchResultDataGrid.setSelectRow(rowIndex, scrollTop);

		return action;
	}

	/**
	 * 削除します.
	 * @param info 複数選択コンポーネント情報
	 * @param selectedData 選択データ
	 */
	public delete(info: EIMMultipleSelectionComponentInfo, selectedData: any[]): boolean {
		let safeSelectedData: any[] = [];
		let action = false;
		for (let i = 0; i < selectedData.length; i++) {
			if (selectedData[i].name !== 'ID') {
				safeSelectedData.push(selectedData[i]);
				action = true;
			}
		}
		let rowIndex: number = info.selectedList.getFirstRowIndex();
		let scrollTop: number = info.selectedList.getScrollTop();
		info.selectedList.removeRowData(safeSelectedData);
		info.selectedList.setSelectRow(rowIndex, scrollTop);
		(<any>info.searchResultList).filter(info.selectedList.getData());

		// 表示対象一覧で表示列から削除されたデータを選択
		this.selectDataSearchResultList(safeSelectedData, info);

		return action;
	}

	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param info 複数選択コンポーネント情報
	 */
	public up(info: EIMMultipleSelectionComponentInfo): boolean {
		let action = super.up(info);

		let rowIndex: number = info.selectedList.getFirstRowIndex();
		if (-1 < rowIndex) {
			info.selectedList.ensureIndexVisible(rowIndex);
		}

		return action;
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param info 複数選択コンポーネント情報
	 */
	public down(info: EIMMultipleSelectionComponentInfo): boolean {
		let action = super.down(info);

		let rowIndex: number = info.selectedList.getFirstRowIndex();
		if (-1 < rowIndex) {
			info.selectedList.ensureIndexVisible(rowIndex);
		}

		return action;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------



	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 表示対象一覧に削除データを選択する.
	 * @param selectedData 選択データ
	 */
	private selectDataSearchResultList(selectedData: any[], info): void {
		// 表示対象一覧データグリッド取得
		let searchResultList = (<EIMDataGridSingleSelectorComponent>info.searchResultList).info.dataGrid;

		let bkEquals = searchResultList.equals;
		let bkInfoEquals = searchResultList.info.equals;
		searchResultList.equals = this.equals;
		searchResultList.info.equals = this.equals;
		searchResultList.select(selectedData);
		searchResultList.equals = bkEquals;
		searchResultList.info.equals = bkInfoEquals;

		let rowIndex = searchResultList.getFirstRowIndex();
		if (-1 < rowIndex) {
			searchResultList.ensureIndexVisible(rowIndex);
		}
	}

	/**
	 * 比較します.
	 * @param data1
	 * @param data2
	 */
	private equals(data1: any, data2: any) {
		if (data1.columnId === data2.columnId) {
			return true;
		}
		return false;
	}

}

