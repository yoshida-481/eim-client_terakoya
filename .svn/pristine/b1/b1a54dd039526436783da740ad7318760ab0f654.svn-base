import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { of, Observable, pipe, Operator ,  Subject } from 'rxjs';
import { tap } from 'rxjs/operators';


import { TranslateService } from '@ngx-translate/core';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMTableService, EIMTable, EIMHierarchicalTable, EIMTableItem } from 'app/documents/shared/services/apis/table.service';

// レンダラー
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMAttributeRendererComponent } from 'app/documents/shared/components/renderer/attribute-renderer.component';
import { EIMAttributeRendererComponentService } from 'app/documents/shared/components/renderer/attribute-renderer.component.service';
import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMNumberService } from 'app/shared/services/number.service';
import { EIMDocumentSessionStorageService } from './apis/document-session-storage.service';
import { EIMDateRendererComponent } from 'app/shared/components/renderer/date-renderer.component';
import { EIMDateRendererComponentService } from 'app/shared/components/renderer/date-renderer.component.service';

/**
 * テーブルメニューインタフェース
 */
export interface EIMTableMenuItem extends EIMMenuItem {
	table?: EIMTable;
}

/**
 * テーブル情報サービス.
 */
@Directive()
@Injectable()
export class EIMContentsTableService {

	private defaultTable: EIMTable = {label: '', tableId: null, tableDefName: null};
	private customizeTables: EIMHierarchicalTable[] = [];
	private userTables: EIMTable[] = [];
	public selectedTable: EIMTable;

	/** メニューアイテム セパレータ */
	private menuSeparator: EIMMenuItem = {separator: true};

	public tableMenuItems: EIMMenuItem[] = [];

	/** テーブル読み込み完了イベントエミッタ */
	@Output()
		public loadCompleted: EventEmitter<any> = new EventEmitter<any>();

	/** テーブル選択イベントエミッタ */
	@Output()
		public selectTableCompleted: EventEmitter<any> = new EventEmitter<any>();

	/** テーブル更新完了イベントエミッタ */
	@Output()
		public updateTableCompleted: EventEmitter<any> = new EventEmitter<any>();

	/** 更新通知発行予約フラグ */
	public isReservingUpdate = false;

	constructor(
			protected translateService: TranslateService,
			private tableService: EIMTableService,
			private hierarchicalDomainService: EIMHierarchicalDomainService,
			private dateRendererComponentService: EIMDateRendererComponentService,
			private dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
			private attributeRendererComponentService: EIMAttributeRendererComponentService,
			private dateService: EIMDateService,
			private numberService: EIMNumberService,
			private documentSessionStorageService: EIMDocumentSessionStorageService,

	) {

	}

	public initialize(): void {

		this.defaultTable = {label: '', tableId: null, tableDefName: null};
		this.customizeTables = [];
		this.userTables = [];
		this.tableMenuItems = [];

		this.fetchTableList().subscribe( () => {
			// 選択テーブルのアイテムリストを読み込む
			this.fetchTableItemList(this.selectedTable).subscribe( () => {
				// テーブルからテーブルメニューを生成する
				this.tableMenuItems = this.createTableMenu();
				// 選択テーブルからカラムを生成する
				let columns: EIMDataGridColumn[] = this.createTableColumns(this.selectedTable);
				this.loadCompleted.emit({selectedTable: this.selectedTable, menuItems: this.tableMenuItems, columns: columns});
			});

		});
	}


	/**
	 * テーブルリストをサーバから読み込む.
	 */
	private fetchTableList(): Observable<any> {
		
		// カスタマイズデフォルトテーブルを取得する
		return this.tableService.getCustomizeDefaultList()
		.pipe(tap(customizeTables => {
			// カスタマイズデフォルトテーブルをセットする
			this.customizeTables = customizeTables;
		}))
		.pipe(mergeMap( () => {

			return this.tableService.getList()
			.pipe(tap( (userTables) => {
				// ユーザテーブルをセットする
				this.userTables = userTables;

				// 選択テーブルを特定する
				this.selectedTable = this.findSelectedTable(this.customizeTables) || this.findSelectedTable(this.userTables);

				if (!this.selectedTable) {
					this.defaultTable.selected = true;
					this.selectedTable = this.defaultTable;
				}
			}));

		}));

	}

	/**
	 * 選択テーブルを特定する.
	 * @param tables
	 */
	private findSelectedTable(tables: EIMHierarchicalTable[]): EIMTable {
		for (const table of tables) {
			if (table.selected) {
				return table;
			}
			if (table.children && table.children.length) {
				const selected = this.findSelectedTable(table.children);
				if (selected) {
					return selected;
				}
			}
		}
		return null;
	}

	/**
	 * テーブルアイテムリストをサーバから読み込む.
	 */
	private fetchTableItemList(table: EIMTable): Observable<any> {
		if (this.isDefaultTable(table)) {
			// デフォルトテーブルの場合
			return of(null);
		}

		// テーブルアイテム取得
		return this.tableService.getTableItemList(table.tableId, table.tableDefName)
			.pipe(map( (tableItems) => {
				table.tableItemList = tableItems;
			}
		));
	}

	/**
	 * テーブルメニューを生成します.
	 */
	private createTableMenu(): EIMMenuItem[] {
		let menuItems: EIMMenuItem[] = [];

		let customizeTableMenuItems: EIMMenuItem[] = [];
		let userTableMenuItems: EIMMenuItem[] = [];

		// カスタマイズテーブル
		for (let i = 0; i < this.customizeTables.length; i++) {
			let table: EIMHierarchicalTable = this.customizeTables[i];
			let converted = this.hierarchicalDomainService.convert([table], this.createTableMenuItem);
			Array.prototype.push.apply(customizeTableMenuItems,
				this.hierarchicalDomainService.update(converted, (menuItem: any) => {

					if (menuItem.children && menuItem.children.length > 0) {
						menuItem.items = menuItem.children;
						menuItem.command = (event) => {};
					} else {
						menuItem.items = null;
						menuItem.command = (event) => {this.selectTable(menuItem.table); };
					}
				}));
		}

		// ユーザテーブル
		for (let i = 0; i < this.userTables.length; i++) {
			let table: EIMTable = this.userTables[i];
			userTableMenuItems.push(this.createTableMenuItem(table));
		}

		// デフォルトテーブル
		this.defaultTable.label = this.translateService.instant('EIM_DOCUMENTS.LABEL_03021');

		menuItems.push(this.createTableMenuItem(this.defaultTable));

		// カスタムテーブル
		if (customizeTableMenuItems.length > 0) {
			menuItems.push(Object.assign({}, this.menuSeparator));
			Array.prototype.push.apply(menuItems, customizeTableMenuItems);
		}
		// ユーザテーブル
		if (userTableMenuItems.length > 0) {
			menuItems.push(Object.assign({}, this.menuSeparator));
			Array.prototype.push.apply(menuItems, userTableMenuItems);
		}

		return menuItems;
	}

	/**
	 * テーブルメニューアイテム生成します.
	 */
	private createTableMenuItem(table: EIMTable): EIMMenuItem {
		let menuItem: EIMTableMenuItem = {
			label: table.label,
			command: (event) => {this.selectTable(menuItem.table); },
			icon: table.selected ? 'eim-icon-check' : 'eim-icon-none',
			table: table
		};
		return menuItem;
	}

	/**
	 * テーブルメニューアイテム選択.
	 */
	public selectTable(table: EIMTable): void {

		// 選択状態を保存
		this.tableService.select(table.tableId, table.tableDefName)
			.subscribe(json => {
				// 選択状態をクリア
				this.defaultTable.selected = false;
				this.hierarchicalDomainService.update(this.customizeTables, (domain: any) => domain.selected = false);
				this.hierarchicalDomainService.update(this.userTables, (domain: any) => domain.selected = false);

				// 選択設定
				table.selected = true;
				// 選択テーブルをセットする
				this.selectedTable = table;

				// テーブルアイテム取得
				this.fetchTableItemList(table).subscribe( () => {
					// テーブルからテーブルメニューを生成する
					this.tableMenuItems = this.createTableMenu();
					// 選択テーブルからカラムを生成する
					let columns: EIMDataGridColumn[] = this.createTableColumns(this.selectedTable);
					// イベントをディスパッチ
					this.selectTableCompleted.emit({selectedTable: this.selectedTable, menuItems: this.tableMenuItems, columns: columns});
				});

			});
	}

	/**
	 * テーブルアイテムからカラムを生成します.
	 */
	public createTableColumns(table: EIMTable): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		if (this.isDefaultTable(table)) {
			// デフォルト
			// 更新者'
			columns.push({field: 'modifyUserName', headerName: this.translateService.instant('EIM.LABEL_02032')});
			// 更新日時
			columns.push({field: 'modifyDateTime', headerName: this.translateService.instant('EIM.LABEL_02033'), width: EIMConstantService.COLUMN_WIDTH_DATETIME, type: EIMDataGridColumnType.dateTime,
				cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
			});
			// プロパティ
			columns.push({field: 'property', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02086')});
		} else if(table.tableItemList !== undefined) {
			// デフォルト以外

			for (let i = 0; i < table.tableItemList.length; i++) {
				let tableItem: EIMTableItem = table.tableItemList[i];
				let field: string;

				if (tableItem.attTypeDefName == '作成日') {
					// 作成日時
					columns.push({field: 'createDateTime', headerName: this.translateService.instant('EIM.LABEL_02031'), width: EIMConstantService.COLUMN_WIDTH_DATETIME, type: EIMDataGridColumnType.dateTime,
						cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
					});
				} else if (tableItem.attTypeDefName == '更新日') {
					// 更新日時
					columns.push({field: 'modifyDateTime', headerName: this.translateService.instant('EIM.LABEL_02033'), width: EIMConstantService.COLUMN_WIDTH_DATETIME, type: EIMDataGridColumnType.dateTime,
						cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
					});
				} else if (tableItem.attTypeDefName == '作成者') {
					columns.push({field: 'createUserName', headerName: tableItem.attTypeName});
				} else if (tableItem.attTypeDefName == '更新者') {
					columns.push({field: 'modifyUserName', headerName: tableItem.attTypeName});
				} else if (tableItem.attTypeDefName == 'プロパティ') {
					columns.push({field: 'property', headerName: tableItem.attTypeName});
				} else if (tableItem.attTypeDefName == 'パス') {
					columns.push({field: 'path', headerName: tableItem.attTypeName});
				} else if (tableItem.attTypeDefName == '有効期限') {
					columns.push({field: 'effectiveTerm', headerName: tableItem.attTypeName, type: EIMDataGridColumnType.date,
						cellRendererFramework: EIMDateRendererComponent, valueGetter: this.dateRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
					});
				} else if (tableItem.attTypeDefName == 'サイズ') {
					columns.push({field: 'fileSize', headerName: tableItem.attTypeName});
				} else {
					if (tableItem.attIsMultiple) {
						field = 'attType_' + tableItem.attTypeId + '_multivalue';
					} else {
						field = 'attType_' + tableItem.attTypeId;
					}
					// 日付型属性
					if ( Number(tableItem.attValTypeId) === 3) {
						if (tableItem.attIsMultiple) {
							columns.push({field: field, headerName: tableItem.attTypeName, type: EIMDataGridColumnType.date, 
								cellRendererFramework: EIMAttributeRendererComponent, valueGetter: this.attributeRendererComponentService.valueGetter});
						} else {
							columns.push({field: field, headerName: tableItem.attTypeName, type: EIMDataGridColumnType.date, 
								cellRendererFramework: EIMDateRendererComponent, valueGetter: this.dateRendererComponentService.valueGetter, comparator: this.dateService.dateComparator});	
						}

					// 数値型属性、実数型属性
					} else if ( Number(tableItem.attValTypeId) === 1 || Number(tableItem.attValTypeId) === 5) {
						columns.push({field: field, headerName: tableItem.attTypeName, cellRendererFramework: EIMAttributeRendererComponent, valueGetter: this.attributeRendererComponentService.valueGetter, comparator: this.numberService.numberComparator});
					} else {
						columns.push({field: field, headerName: tableItem.attTypeName, cellRendererFramework: EIMAttributeRendererComponent, valueGetter: this.attributeRendererComponentService.valueGetter});
					}
				}
			}
	
		}

		return columns;
	}

	/**
	 * テーブル更新を通知します.
	 */
	public doUpdateTable(): void {
		this.fetchTableList().subscribe( () => {
			// 選択テーブルのアイテムリストを読み込む
			this.fetchTableItemList(this.selectedTable).subscribe( () => {
				// テーブルからテーブルメニューを生成する
				this.tableMenuItems = this.createTableMenu();
				// 選択テーブルからカラムを生成する
				let columns: EIMDataGridColumn[] = this.createTableColumns(this.selectedTable);

				this.updateTableCompleted.emit({selectedTable: this.selectedTable, menuItems: this.tableMenuItems, columns: columns});
			});

		});
		this.isReservingUpdate = false;
	}

	private isDefaultTable(table: EIMTable): boolean {
		return (!table.tableId && !table.tableDefName ? true : false);
	}

}
