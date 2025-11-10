import { Injectable } from '@angular/core';

import { EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMWorkflowMailKindSingleSelectorComponent } from 'app/admins/components/workflow-mail-kind-selector/workflow-mail-kind-single-selector.component';

/**
 * メール種別複数選択コンポーネントサービス
 */
@Injectable()
export class EIMWorkflowMailKindMultipleSelectorComponentSerivce extends EIMMultipleSelectorComponentService {

	/** 複数選択コンポーネント情報 */
	private info: EIMMultipleSelectionComponentInfo;

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
	 * 初期化します.
	 * @param info 複数選択コンポーネント情報
	 */
	public initialize(info: EIMMultipleSelectionComponentInfo): void {
		this.info = info;
		this.setData(info);
	}

	/**
	 * 追加します.
	 * @param info 複数選択コンポーネント情報
	 */
	public add(info: EIMMultipleSelectionComponentInfo): void {
		this.info = info;

		// 選択データ取得
		let addData = this.getSelectDataList();
		// 選択データがない場合、追加不可
		if (!addData || addData.length === 0) {
			return;
		}

		// 検索結果の選択行を選択一覧に追加
		info.selectedList.addRowData(addData);

		if (info.searchResultList) {
			// 左ペインがデータグリッドの場合
			let mailTypeList: EIMDataGridComponent = (<EIMWorkflowMailKindSingleSelectorComponent>info.searchResultList).mailTypeList;
			let rowIndex: number = mailTypeList.getFirstRowIndex();
			let scrollTop: number = mailTypeList.getScrollTop();
			(<any>info.searchResultList).filter(info.selectedList.getData());
		}
	}

	/**
	 * 削除します.
	 * @param info 複数選択コンポーネント情報
	 * @param selectedData 選択データ
	 */
	public delete(info: EIMMultipleSelectionComponentInfo, selectedData: any[]): void {
		this.info = info;
		let rowIndex: number = info.selectedList.getFirstRowIndex();
		let scrollTop: number = info.selectedList.getScrollTop();
		info.selectedList.removeRowData(selectedData);
		info.selectedList.setSelectRow(rowIndex, scrollTop);

		(<any>info.searchResultList).filter(info.selectedList.getData());
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 選択データを取得する.
	 * @param target 判定対象
	 * @return 判定結果
	 */
	private getSelectDataList(): any[] {
		let selectedData: any = this.info.searchResultList.getSelectedData();
		let loopCnt = selectedData.length;
		let addData: any[] = [];

		// 対象が選択済みの場合、追加不可
		for (let idx = 0; idx < loopCnt; idx++) {
			if (!this.isInclude(selectedData[idx])) {
				addData.push(selectedData[idx]);
			}
		}
		return addData;
	}

	/**
	 * 選択済に含まれているか判定します.
	 * @param target 判定対象
	 * @return 判定結果
	 */
	private isInclude(target: any): boolean {
		let selectedData = this.info.selectedList.getData();
		let loopCnt = selectedData.length;
		for (let idx = 0; idx < loopCnt; idx++) {
			if (target.id === selectedData[idx].id) {
				return true;
			}
		}
		return false;
	}

}
