import { EIMDataGridSingleSelectorComponent } from '../data-grid-single-selector/data-grid-single-selector.component';
import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMSelectorComponent, EIMSelectorComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';

/**
 * 複数選択コンポーネント情報インターフェース
 */
export interface EIMMultipleSelectionComponentInfo extends EIMSelectorComponentInfo<any> {
	searchResultList?: EIMSingleSelectorComponent,
	selectedList?: EIMDataGridComponent,
	columns: EIMDataGridColumn[],
	equals: (a: any, b: any) => boolean,
	selectedData: any[],
	widthBalance: number
}

/**
 * 複数選択コンポーネントサービス
 */
@Injectable()
export class EIMMultipleSelectorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor() {}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param info 複数選択コンポーネント情報
	 */
	public initialize(info: EIMMultipleSelectionComponentInfo): void {
		this.setData(info);
	}

	/**
	 * 追加します.
	 * @param info 複数選択コンポーネント情報
	 */
	public add(info: EIMMultipleSelectionComponentInfo): void {

		// 検索結果の選択行を選択一覧に追加
		// （検索結果には選択行が含まれない前提）
		let addData: any = info.searchResultList.getSelectedData();
		info.selectedList.addRowData(addData);

		if ((<EIMDataGridSingleSelectorComponent>info.searchResultList).info.dataGrid) {
			// 左ペインがデータグリッドの場合
			let searchResultDataGrid: EIMDataGridComponent = (<EIMDataGridSingleSelectorComponent>info.searchResultList).info.dataGrid;
			let rowIndex: number = searchResultDataGrid.getFirstRowIndex();
			let scrollTop: number = searchResultDataGrid.getScrollTop();
			(<any>info.searchResultList).filter(info.selectedList.getData());
			searchResultDataGrid.setSelectRow(rowIndex, scrollTop);
		}
	}

	/**
	 * 削除します.
	 * @param info 複数選択コンポーネント情報
	 * @param selectedData 選択データ
	 */
	public delete(info: EIMMultipleSelectionComponentInfo, selectedData: any[]): void {

		let rowIndex: number = info.selectedList.getFirstRowIndex();
		let scrollTop: number = info.selectedList.getScrollTop();
		info.selectedList.removeRowData(selectedData);
		info.selectedList.setSelectRow(rowIndex, scrollTop);

		(<any>info.searchResultList).filter(info.selectedList.getData());
	}

	/**
	 * single-selectorから発火されるfetchedイベントハンドラ
	 * @param info 複数選択コンポーネント情報
	 * @param target パラメータ
	 */
	public onFetch(info: EIMMultipleSelectionComponentInfo, target: any[]): void {
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * データを設定します.
	 * @param info 複数選択コンポーネント情報
	 */
	protected setData(info: EIMMultipleSelectionComponentInfo): void {
		info.selectedList.setData(info.selectedData);
		(<any>info.searchResultList).filter(info.selectedList.getData());
	}
}
