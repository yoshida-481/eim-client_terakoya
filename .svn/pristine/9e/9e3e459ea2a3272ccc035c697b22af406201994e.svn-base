import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo, } from 'app/shared/components/multiple-selector/multiple-selector.component.service';

import { EIMSelectorComponent, EIMSelectorComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridSingleSelectorComponent } from "app/shared/components/data-grid-single-selector/data-grid-single-selector.component";




/**
 * 属性タイプ複数選択コンポーネントサービス
 */
@Injectable()
export class EIMFormListColumnMultipleSelectorComponentService extends EIMMultipleSelectorComponentService {
	
	
/**
	 * デフォルトに戻します.
	 * @param info 複数選択コンポーネント情報
	 * @param defaultColumns デフォルトカラム
	 */
	public default(info: EIMMultipleSelectionComponentInfo, defaultColumns: any[]): boolean {
		info.selectedList.setData(defaultColumns);
		(<any>info.searchResultList).filter(info.selectedList.getData());
		return true;
	}
	
	/**
	 * 追加します.
	 * @param info 複数選択コンポーネント情報
	 */
	public add(info: EIMMultipleSelectionComponentInfo): boolean {
		let addData: any = info.searchResultList.getSelectedData();
		let action:boolean = false;
		info.selectedList.addRowData(addData);
		if (addData.length > 0) {
			action = true;
		}
		let rowIndex: number = (<EIMDataGridSingleSelectorComponent>info.searchResultList).info.dataGrid.getFirstRowIndex();
		let scrollTop: number = (<EIMDataGridSingleSelectorComponent>info.searchResultList).info.dataGrid.getScrollTop();
		(<any>info.searchResultList).filter(info.selectedList.getData());
		(<EIMDataGridSingleSelectorComponent>info.searchResultList).info.dataGrid.setSelectRow(rowIndex, scrollTop);
		return action;
	}
	
	/**
	 * 削除します.
	 * @param info 複数選択コンポーネント情報
	 * @param selectedData 選択データ
	 */
	public delete(info: EIMMultipleSelectionComponentInfo, selectedData: any[]): boolean {
		let safeSelectedData :any[] = [];
		let action:boolean = false;
		for (let i = 0; i<selectedData.length; i++) {
			if (selectedData[i].name != "ID") {
				safeSelectedData.push(selectedData[i]);
				action = true;
			}
		}		
		let rowIndex: number = info.selectedList.getFirstRowIndex();
		let scrollTop: number = info.selectedList.getScrollTop();
		info.selectedList.removeRowData(safeSelectedData);
		info.selectedList.setSelectRow(rowIndex, scrollTop);
		(<any>info.searchResultList).filter(info.selectedList.getData());
		return action;
	}
	
	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param info 複数選択コンポーネント情報
	 */
	public up(info: EIMMultipleSelectionComponentInfo):boolean {

		let moveCnt:number = 0;
		let moveAttrTypes:any[] = [];
		let action:boolean = false;
		for(let i = 0; i < info.selectedList.getData().length; i++) {
			for(let j = 0; j < info.selectedList.getSelectedData().length; j++) {
				if(info.selectedList.getData()[i].columnId == info.selectedList.getSelectedData()[j].columnId) {

					// 選択アイテムのインデックス取得
					let rowNum:number = this.getAttrTypeRowNum(info, info.selectedList.getSelectedData()[j].columnId);
					if(rowNum > moveCnt) {
						// 1つ上の行へ移動
						let moveAttrType = this.moveAttrType(info, info.selectedList.getData()[i].columnId, true);
						moveAttrTypes.push(moveAttrType);
						action = true;
					}
					moveCnt++;
				}
			}
		}
		// 移動行を選択
		this.selectedAttrType(info, moveAttrTypes);
		return action;
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param info 複数選択コンポーネント情報
	 */
	public down(info: EIMMultipleSelectionComponentInfo):boolean {

		let rowCnt:number = info.selectedList.getData().length - 1;
		let moveCnt:number = 0;
		let moveAttrTypes:any[] = [];
		let action:boolean = false;
		
		for(let i = info.selectedList.getData().length - 1; i > -1; i--) {
			for(let j = 0; j < info.selectedList.getSelectedData().length; j++) {
				if(info.selectedList.getData()[i].columnId == info.selectedList.getSelectedData()[j].columnId) {

					// 選択アイテムのインデックス取得
					let rowNum:number = this.getAttrTypeRowNum(info, info.selectedList.getSelectedData()[j].columnId);
					if(rowNum < rowCnt - moveCnt) {
						// 1つ下の行へ移動
						let moveAttrType = this.moveAttrType(info, info.selectedList.getData()[i].columnId, false);
						moveAttrTypes.push(moveAttrType);
						action = true;
					}
					moveCnt++;
				}
			}
		}

		// 移動行を選択
		this.selectedAttrType(info, moveAttrTypes);
		return action;
	}
	
	/**
	 * 属性タイプリストの行番号を取得します.
	 * @param info 複数選択コンポーネント情報
	 * @param id 属性タイプId
	 */
	private getAttrTypeRowNum(info: EIMMultipleSelectionComponentInfo, id:number):number {
		for(let i = 0; i < info.selectedList.getData().length; i++) {
			if(info.selectedList.getData()[i].columnId == id) {
				return i;
			}
		}
	}
	
	/**
	 * 属性タイプを移動します.
	 * @param info 複数選択コンポーネント情報
	 * @param id 属性タイプId
 	 * @param isUp 上へ移動の場合、true
 	 * @return 属性タイプ
	 */
	private moveAttrType(info: EIMMultipleSelectionComponentInfo, id:number, isUp:boolean):any {

		for(let i = 0; i < info.selectedList.getData().length; i++) {
			if(info.selectedList.getData()[i].columnId == id) {

				// 移動対象属性タイプ情報を保持
				let rowNum:number = this.getAttrTypeRowNum(info, id);
				let target:any = Object.assign({}, info.selectedList.getData()[i]);

				// 削除
				this.deleteAttrType(info, id);
				// 追加
				if(isUp) {
					this.insertAttrType(info, target, rowNum - 1);
				} else {
					this.insertAttrType(info, target, rowNum + 1);
				}
				return target;
			}
		}
		return null;
	}
	
	/**
	 * 属性タイプを削除します.
	 * @param info 複数選択コンポーネント情報
	 * @param id 属性タイプId
	 */
	private deleteAttrType(info: EIMMultipleSelectionComponentInfo, id:number):void {
		// 属性タイプ一覧から除去
		for(let i = 0; i < info.selectedList.getData().length; i++) {
			if(info.selectedList.getData()[i].columnId == id) {
				let target:any[] = [];
				target.push(info.selectedList.getData()[i]);
				info.selectedList.removeRowData(target);
				return;
			}
		}
	}

	/**
	 * 属性タイプを追加します.
	 * @param info 複数選択コンポーネント情報
	 * @param attrType 属性タイプ
	 * @param index インデックス
	 */
	private insertAttrType(info: EIMMultipleSelectionComponentInfo, attrType:any, index:number):void {
		let target:any[] = [];
		target.push(attrType);
		info.selectedList.addRowDataToIndex(target, index);
	}
	
	/**
	 * 属性タイプを選択します.
	 * @param info 複数選択コンポーネント情報
	 * @param attrTypes 属性タイプリスト
	 */
	private selectedAttrType(info: EIMMultipleSelectionComponentInfo, attrTypes:any[]):void {

		info.selectedList.info.gridApi.forEachNode(
			function(node) {
				for(let i = 0; i < attrTypes.length; i++) {
					if(node.data.columnId == attrTypes[i].columnId) {
						node.setSelected(true);
					}
				}
			}
		);

		info.selectedList.info.selectedData = attrTypes;
	}
}
