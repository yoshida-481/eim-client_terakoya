import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';

/**
 * 単体選択データグリッドコンポーネント情報インターフェース
 */
export interface EIMDataGridSingleSelectorComponentInfo extends EIMListComponentInfo<any> {
	dataGrid?: EIMDataGridComponent;
}

/**
 * 単体選択データグリッドコンポーネントサービス
 */
@Injectable()
export class EIMDataGridSingleSelectorComponentService extends EIMDataGridComponentService {

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 */
	constructor(protected translateService: TranslateService) {
		super(translateService);
	}

	/**
	 * 行を設定します.
	 * @param info データグリッドコンポーネント情報
	 * @param data 第1階層のノード配列
	 */
	public setData(info: EIMDataGridComponentInfo, data: any[]): void {
		super.setData(info, data);

		// 合計数、選択数を更新
		this.updateRowCountAndSelectedData(info);
	}

	/**
	 * フィルタを実行します.
	 * @param info 単体選択データグリッドコンポーネント情報
	 * @param unvisibleData 非表示データ
	 */
	public filter(info: EIMDataGridComponentInfo, unvisibleData: any[]): void {

		info.gridApi.setGridOption('isExternalFilterPresent', this.isExternalFilterPresent);
		info.gridApi.setGridOption('doesExternalFilterPass', (node): boolean => {
			return this.doesExternalFilterPass(info, node, unvisibleData);
		});
		info.gridApi.onFilterChanged();

		// 合計数、選択数を更新
		this.updateRowCountAndSelectedData(info);
	}

	/**
	 * 検索します.
	 * @param info 単体選択データグリッドコンポーネント情報
	 * @param condition 検索条件
	 */
	public search(info: EIMListComponentInfo<any>, condition: any): void {

	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return this.defaultEquals(a, b);
	}

	/**
	 * 外部フィルタが存在するかどうか.
	 * @return 存在する場合trueを返却.
	 */
	protected isExternalFilterPresent(): boolean {
		return true;
	}

	/**
	 * 外部フィルタを実行します.
	 * @param node ノード
	 * @param unvisibleData 非表示データ
	 * @return 表示対象ならtrueを返却
	 */
	protected doesExternalFilterPass(info: EIMDataGridComponentInfo, node, unvisibleData?: any[]): boolean {

		if (node.hasOwnProperty('data')) {
			node = node.data;
		}
		for (let i = 0; i < unvisibleData.length; i++) {
			if (this.equals(node, unvisibleData[i])) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 件数を更新します.
	 * @param info 単体選択データグリッドコンポーネント情報
	 */
	protected updateRowCountAndSelectedData(info: EIMDataGridComponentInfo): void {
		// 合計数から外部フィルタされた行数を除く
		info.rowCount = info.gridApi.getDisplayedRowCount();

		// 選択数からフィルタされた行数を除く
		let selectedData: any[] = [];
		for (let i = 0; i < info.selectedData.length; i++) {
			let node = info.selectedData[i];
			if (info.gridOptions.doesExternalFilterPass(node)) {
				selectedData.push(info.selectedData[i]);
			}
		}
		this.select(info, selectedData);

	}
}
