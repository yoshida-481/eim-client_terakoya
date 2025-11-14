import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { GetLocaleTextParams, GridApi, GridOptions, SuppressKeyboardEventParams } from 'ag-grid-community';

import { EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * データグリッドコンポーネント情報インタフェース.
 */
export interface EIMDataGridComponentInfo extends EIMListComponentInfo<any> {
	rowCount?: number;
	hitCount?: number;
	selectedRowCount?: number;
	errored?: EventEmitter<any>;
	gridOptions?: GridOptions;
	gridApi?: GridApi;
	canEmitChangeEvent?: boolean;
	settingStateFlag?: boolean;
	equals?(checkTargetData: any, selectData: any): boolean;
	// アコーディオン選択インデックス
	accordionActiveIndex?: number;
	/** gridAPI初期化前の処理をためておくキュー */
	pendingActions?: (() => void)[];
}

/**
 * データグリッドコンポーネントサービス.
 */
@Injectable()
export class EIMDataGridComponentService implements EIMListComponentService<any> {

	/**
	 * コンストラクタです.
	 */
	constructor(protected translateService: TranslateService) {}


	/**
	 * 初期化します.
	 * @param info データグリッドコンポーネント情報
	 * @param serviceParam パラメータ
	 * @param initialized 初期化イベントエミッタ
	 * @param selected 選択イベントエミッタ
	 */
	public initialize(info: EIMDataGridComponentInfo, serviceParam: any = {}, initialized?: EventEmitter<any>, selected?: EventEmitter<any>): void {

		if (info.data === undefined) {
			return;
		}
		if (initialized) {
			initialized.emit({selectedData: info.selectedData, serviceParam: serviceParam});
		}

		if (selected && info.selectedData.length > 0) {
			selected.emit({selectedData: info.selectedData, serviceParam: serviceParam});
		}
	}


	/**
	 * 行を設定します.
	 * @param info データグリッドコンポーネント情報
	 * @param data 第1階層のノード配列
	 */
	public setData(info: EIMDataGridComponentInfo, data: any[]): void {

		const action = () => {
			info.gridApi.setGridOption('rowData', data);
			info.gridApi.resetRowHeights();
		}

		if (info.gridApi) {
			action();
		}
		else {
			info.pendingActions.push(action);
		}
		// AG-Grid v31以降: 初期設定用にgridOptionsに保存（グリッド作成前の参照用）
		info.gridOptions.rowData = data;
		info.data = data;

		info.rowCount = (data != null ? data.length : 0);
		info.selectedRowCount = 0;

	}

	/**
	 * 行を取得します.
	 * @param info データグリッドコンポーネント情報
	 * @return 行データ
	 */
	public getData(info: EIMDataGridComponentInfo): any[] {
	  let rowData = [];
	  if (!info.gridApi) {
	  	return rowData;
	  }
	  info.gridApi.forEachNode( function(node) {
	      rowData.push(node.data);
	  });
	  return rowData;
	}

	/**
	 * 行を選択します.
	 * @param info データグリッドコンポーネント情報
	 * @param selectedData 選択する行
	 * @param selected 選択イベントエミッタ
	 */
	public select(info: EIMDataGridComponentInfo, selectedData: any[], selected?: EventEmitter<any>, selectedDocumentLink?: boolean): void {
		if (!selected) {
			info.canEmitChangeEvent = false;
		}

		let targetData: any[] = selectedData;
		if (!selectedData) {
			targetData = [];
		} else if (!Array.isArray(selectedData)) {
			targetData = [selectedData];
		}
		let data: any[] = [];

		const action = () => {
			info.gridApi.forEachNode( function (node) {
				let nodeSelected = false;
				for (let i = 0; i < targetData.length; i++) {
					if (info.equals(node.data, targetData[i])) {
						if (selectedDocumentLink) {
							if (node.data.isDocumentLink === true || node.data.isDocumentLink === 'true' ) {
								nodeSelected = true;
								data.push(node.data);
							}
						} else {
							nodeSelected = true;
							data.push(node.data);
						}
					}
				}
				node.setSelected(nodeSelected);
			});
		}

		if (info.gridApi) {
			action();
		}
		else {
			info.pendingActions.push(action);
		}
		
		info.selectedData = data;

		if (selected) {
			selected.emit(info.selectedData);
		}
		info.canEmitChangeEvent = true;
	}


	/**
	 * 行選択イベントハンドラ.
	 * @param info データグリッドコンポーネント情報
	 * @param selectedData 選択する行
	 * @param selected 選択イベントエミッタ
	 */
	public onSelect(info: EIMDataGridComponentInfo, selectedData: any[], selected?: EventEmitter<any>): void {
		if (selected && info.canEmitChangeEvent) {
			if (info.settingStateFlag) {
				info.settingStateFlag = false;
			} else {
			selected.emit(info.selectedData);
			}
		}
	}

	/**
	 * GridOptionsを設定します.
	 * @param gridOptions GridOptions
	 * @return 設定済みのGridOptions
	 */
	public setGridOptions(gridOptions: GridOptions): GridOptions {
		gridOptions.rowSelection = gridOptions.rowSelection;
		if (gridOptions.defaultColDef) {
			gridOptions.defaultColDef.resizable = true;
			gridOptions.defaultColDef.sortable = true;
			gridOptions.defaultColDef.filter = true;
			gridOptions.defaultColDef.suppressKeyboardEvent = (params: SuppressKeyboardEventParams) => {
				return true;
			};
			gridOptions.defaultColDef.suppressHeaderMenuButton = false;
		} else {
			gridOptions.defaultColDef = {
				resizable: true,
				sortable: true,
				filter: true,
				suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => {
					return true;
				},
				suppressHeaderMenuButton: false
			}
		}
		gridOptions.animateRows = true;
		gridOptions.suppressAutoSize = false;
		gridOptions.suppressHorizontalScroll = gridOptions.suppressHorizontalScroll;
		gridOptions.loading = false;
		gridOptions.suppressNoRowsOverlay = true;
		gridOptions.suppressCellFocus = true;
		gridOptions.suppressDragLeaveHidesColumns = true;
		gridOptions.headerHeight = gridOptions.headerHeight;
		gridOptions.rowStyle = gridOptions.rowStyle;
		gridOptions.columnMenu = 'legacy';
		gridOptions.getLocaleText = (params: GetLocaleTextParams) => {
			let gridKey = 'EIM.GRID.' + params.key;
			let value = this.translateService.instant(gridKey);
			return value === gridKey ? params.defaultValue : value;
		}
		return gridOptions;
	}

	/**
	 * カラムのサイズを自動調整します.最長のセルの幅に合わせて調整します.
	 * @param info データグリッドコンポーネント情報
	 * @param fieldName 調整するカラムのフィールド名
	 */
	public autoSizeColumn(info: EIMDataGridComponentInfo, fieldName: string): void {
		info.gridApi.autoSizeColumns([fieldName]);
	}

	/**
	 * 数値型のカラムを生成します.
	 * @param headerName ヘッダラベル
	 * @param fieldPath フィールドパス
	 * @returns 数値型のカラム
	 */
	public createLongColumn(headerName: string, fieldPath: string[]): EIMDataGridColumn {
		let column: EIMDataGridColumn = {
			headerName: headerName,
			fieldPath: fieldPath,
			type: EIMDataGridColumnType.number,
		};

		return column;
	}

	/**
	 * 文字列型のカラムを生成します.
	 * @param headerName ヘッダラベル
	 * @param fieldPath フィールドパス
	 * @returns 文字列型のカラム
	 */
	public createStringColumn(headerName: string, fieldPath: string[]): EIMDataGridColumn {
		let column: EIMDataGridColumn = {
			headerName: headerName,
			fieldPath: fieldPath,
			type: EIMDataGridColumnType.text,
			width: 30
		};

		return column;
	}

	/**
	 * 日付型（日時）のカラムを生成します.
	 * @param headerName ヘッダラベル
	 * @param fieldPath フィールドパス
	 * @returns 日付型（日時）のカラム
	 */
	public createDateTimeColumn(headerName: string, fieldPath: string[]): EIMDataGridColumn {
		let column: EIMDataGridColumn = {
			headerName: headerName,
			fieldPath: fieldPath,
			type: EIMDataGridColumnType.dateTime,
			width: EIMConstantService.COLUMN_WIDTH_DATETIME
		};

		return column;
	}

	/**
	 * テキスト型のカラムを生成します.
	 * @param headerName ヘッダラベル
	 * @param fieldPath フィールドパス
	 * @returns テキスト型のカラム
	 */
	public createTextColumn(headerName: string, fieldPath: string[]): EIMDataGridColumn {
		let column: EIMDataGridColumn = {
			headerName: headerName,
			fieldPath: fieldPath,
			type: EIMDataGridColumnType.largeText
		};

		return column;
	}

	/**
	 * 実数型のカラムを生成します.
	 * @param headerName ヘッダラベル
	 * @param fieldPath フィールドパス
	 * @returns 実数型のカラム
	 */
	public createDoubleColumn(headerName: string, fieldPath: string[]): EIMDataGridColumn {
		let column: EIMDataGridColumn = {
			headerName: headerName,
			fieldPath: fieldPath,
			type: EIMDataGridColumnType.number,
		};

		return column;
	}

	/**
	 * オブジェクト型のカラムを生成します.
	 * @param headerName ヘッダラベル
	 * @param fieldPath フィールドパス
	 * @returns オブジェクト型のカラム
	 */
	public createObjectColumn(headerName: string, fieldPath: string[]): EIMDataGridColumn {
		let column: EIMDataGridColumn = {
			headerName: headerName,
			fieldPath: fieldPath,
			type: EIMDataGridColumnType.object,
		};

		return column;
	}

	/**
	 * ユーザ型のカラムを生成します.
	 * @param headerName ヘッダラベル
	 * @param fieldPath フィールドパス
	 * @returns ユーザ型のカラム
	 */
	public createUserColumn(headerName: string, fieldPath: string[]): EIMDataGridColumn {
		let column: EIMDataGridColumn = {
			headerName: headerName,
			fieldPath: fieldPath,
			type: EIMDataGridColumnType.user,
		};

		return column;
	}

	/**
	 * コード型のカラムを生成します.
	 * @param headerName ヘッダラベル
	 * @param fieldPath フィールドパス
	 * @returns コード型のカラム
	 */
	public createCodeColumn(headerName: string, fieldPath: string[]): EIMDataGridColumn {
		let column: EIMDataGridColumn = {
			headerName: headerName,
			fieldPath: fieldPath,
			type: EIMDataGridColumnType.code,
		};

		return column;
	}

	/**
	 * 属性値表示用のカラムを生成します.
	 *
	 * @param headerName ヘッダラベル
	 * @param valueType 属性データ型
	 * @param fieldPath フィールドパス（例：['attributeMap', definitionName, 'values']）
	 */
	public createAttributeColumn(headerName: string, valueType: string, fieldPath: string[]): EIMDataGridColumn {

		//let fieldPath = ['attributeMap', definitionName, 'values'];

		switch (valueType) {
			case 'LONG':
				return this.createLongColumn(headerName, fieldPath);

			case 'STRING':
				return this.createStringColumn(headerName, fieldPath);

			case 'DATE':
				return this.createDateTimeColumn(headerName, fieldPath);

			case 'TEXT':
				return this.createTextColumn(headerName, fieldPath);

			case 'DOUBLE':
				return this.createDoubleColumn(headerName, fieldPath);

			case 'OBJECT':
				return this.createObjectColumn(headerName, fieldPath);

			case 'USER':
				return this.createUserColumn(headerName, fieldPath);

			case 'CODE':
				return this.createCodeColumn(headerName, fieldPath);

		}

		return null;
	}
	
	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一行かどうか
	 */
	public defaultEquals(obj1: any, obj2: any): boolean {
		if (obj1.treeNodeId !== undefined && obj2.treeNodeId !== undefined) {
			return obj1.treeNodeId === obj2.treeNodeId;
		}

		if (obj1.objId !== undefined && obj2.objId !== undefined) {
			return (obj1.objId === obj2.objId);
		}

		if (obj1.id !== undefined && obj2.id !== undefined) {
			return (obj1.id === obj2.id);
		}
		
		return false;
	}


}
