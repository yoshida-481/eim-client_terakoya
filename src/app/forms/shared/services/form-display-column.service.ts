import { EIMFormsConstantService } from './forms-constant.service';
import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { of, Observable ,  Subject } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';

import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMFormListColumnService } from 'app/forms/shared/services/apis/form-list-column.service';

// レンダラー
import { EIMIdRendererComponent } from 'app/forms/shared/components/renderer/id-renderer.component';
import { EIMFormAttributeRendererComponent } from 'app/forms/shared/components/renderer/attribute-renderer.component';
import { EIMFormAttributeRendererComponentService } from 'app/forms/shared/components/renderer/attribute-renderer.component.service';

import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';


// ドメイン
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';


import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';

import { EIMLocalStorageService, EIMFormTypeDisplayColumn, EIMFormTypeDisplayColumnColumn } from 'app/shared/services/apis/local-storage.service';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMNumberService } from 'app/shared/services/number.service';

/**
 * 表示列サービス.
 */
@Directive()
@Injectable()
export class EIMFormDisplayColumnService {

	/** 表示列選択イベントエミッタ */
	@Output()
	public selectedDisplayColumnCompleted: EventEmitter<any> = new EventEmitter<any>();

	/** 表示列更新完了イベントエミッタ */
	@Output()
	public updatedDisplayColumnCompleted: EventEmitter<any> = new EventEmitter<any>();

	constructor(
			protected translateService: TranslateService,
			protected formsCacheService: EIMFormsCacheService,
			protected formListColumnService: EIMFormListColumnService,
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			protected attributeRendererComponentService: EIMFormAttributeRendererComponentService,
			protected localStorageService: EIMLocalStorageService,
			protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
			protected formCacheService: EIMFormsCacheService,
			protected dateService: EIMDateService,
			protected numberService: EIMNumberService,
	) {

		/**
		 * 表示列更新イベントハンドラ
		 * @param displayColumn 表示列
		 */
		this.updatedDisplayColumnCompleted.subscribe( (displayColumn: EIMFormTypeDisplayColumn) => {
			// ローカルストレージに保存する
			let loginUserId: number = this.formCacheService.getLoginUser().id;
			this.localStorageService.setFormTypeDisplayColumn(loginUserId, displayColumn);

			let formType: EIMFormTypeDomain = formsCacheService.displayColumnFormTypeMap.get(displayColumn.formTypeId);
			let columns: EIMDataGridColumn[] = this.createDisplayColumns(formType, displayColumn);

			this.selectedDisplayColumnCompleted.emit({columns: columns, formType: formType, displayColumn: displayColumn});
		});
	}

	/**
	 * 開いているアコーディオンと選択した帳票ワークスペース・帳票タイプ・帳票タイプフォルダをもとに
	 * 表示列を生成してイベントを発行する.
	 * @param type アコーディオンインデックス
	 * @param params 選択ツリーノードを含む本関数に渡さたパラメータ。発行するイベントにも渡される。
	 */
	public selectDisplayColumn(type?: number, params?: any): void {
		let formTypeId: number;
		let columns: EIMDataGridColumn[];
		let isChangeType: boolean = false;
		let displayColumn: EIMFormTypeDisplayColumn;
		let savedFormType: EIMFormTypeDomain;

		if (params.selectedTreeNode) {
			formTypeId = params.selectedTreeNode.formTypeId;
		}

		if (type === EIMFormsConstantService.MAIN_ACCORDION_INDEX_WORKSPACE || type === EIMFormsConstantService.MAIN_ACCORDION_INDEX_PROCESSING) {
			// ワークスペースツリー or 処理待ちツリー

			if (formTypeId) {

				savedFormType = this.formsCacheService.displayColumnFormTypeMap.get(formTypeId);

				if (savedFormType) {
					// 帳票タイプ取得済みの場合
					displayColumn = this.getDisplayColumn(savedFormType);
					columns = this.createDisplayColumns(savedFormType, displayColumn);
				} else {
					this.fetchDisplayColumn(formTypeId).subscribe( (formType: EIMFormTypeDomain) => {
						// マップに格納
						this.formsCacheService.displayColumnFormTypeMap.set(formTypeId, formType);
						displayColumn = this.getDisplayColumn(formType);
						columns = this.createDisplayColumns(formType, displayColumn);
						this.selectedDisplayColumnCompleted.emit({columns: columns, formType: formType, displayColumn: displayColumn, params: params});
					});
					return;
				}


			} else {
				// ごみ箱の場合
				// デフォルト列構成を返却する
				columns = this.getDefaultColumns();
			}

		} else if (type === EIMFormsConstantService.MAIN_ACCORDION_INDEX_SEARCH) {
			// 検索
			columns = this.getSearchDefaultColumns();
		}

		this.selectedDisplayColumnCompleted.emit({columns: columns, formType: savedFormType, displayColumn: displayColumn, params: params});

	}

	public fetchDisplayColumn(formTypeId: number): Observable<any> {
		return this.formListColumnService.getByFormType(formTypeId, false);
	}

	/**
	 * 表示列からカラムリストを作成する.
	 * ローカルストレージに保存されている表示列情報(属性タイプIDの並び)を元に作成する.
	 * ローカルストレージに存在している場合、表示属性タイプと並び順はローカルストレージに従う。
	 * ローカルストレージに存在していない場合、systemSettingFormListColumnsを使用する。
	 */
	public createDisplayColumns(formType: EIMFormTypeDomain, displayColumn: EIMFormTypeDisplayColumn): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];
		let attributeTypeMap: Map<number, EIMAttributeTypeDomain> = new Map<number, EIMAttributeTypeDomain>();
		let column: EIMDataGridColumn;

		// 属性タイプをマップに格納する
		formType.attributeTypeList.forEach( (attributeType: EIMAttributeTypeDomain ) => {
			attributeTypeMap.set(attributeType.id, attributeType);
		});

		if (displayColumn && displayColumn.columns.length > 0) {
			for (let i = 0; i < displayColumn.columns.length; i++) {
				column = null;
				let displayColumnColumn: EIMFormTypeDisplayColumnColumn = displayColumn.columns[i];
				let columnId: string = displayColumnColumn.columnId;
				let width: number = displayColumnColumn.width;
				let sort: string = displayColumnColumn.sort;

				if (this.isSystemColumn(columnId)) {
					column = this.createColumn(columnId, null, null, width, sort);
				} else {
					let attributeType: EIMAttributeTypeDomain = attributeTypeMap.get(Number(columnId));
					if (attributeType) {
						column = this.createColumn(columnId, attributeType.name, attributeType.valueType, width, sort);
					}
				}

				if (column) {
					columns.push(column);
				}
			}
		} else {
			for (let i = 0; i < formType.formListColumn.systemSettingFormListColumns.length; i++) {
				let layout: EIMAttributeTypeLayoutDomain = formType.formListColumn.systemSettingFormListColumns[i];
				column = this.createColumn(layout.formListColumnId, layout.name, layout.valueType);
				columns.push(column);
			}
		}

		return columns;
	}

	/**
	 * 表示列をローカルストレージから取得する.
	 * ローカルストレージから取得後、表示列の列の名称を属性タイプの名称でセットし直す.
	 * ローカルストレージに存在しない場合は表示列を作成して返却する.
	 * @param formType 帳票タイプ
	 * @return 表示列
	 */
	public getDisplayColumn(formType: EIMFormTypeDomain): EIMFormTypeDisplayColumn {
		let displayColumn: EIMFormTypeDisplayColumn;

		let loginUserId: number = this.formCacheService.getLoginUser().id;
		displayColumn = this.localStorageService.getFormTypeDisplayColumn(loginUserId, formType.id);
		if (displayColumn) {
			// 名称を設定する
			this.setNameToDisplayColumn(formType, displayColumn);
		} else {
			// 表示列を作成する
			displayColumn = this.createDisplayColumn(formType);
		}

		return displayColumn;
	}

	/**
	 * 表示列の列幅を設定する
	 * @param displayColumn 表示列
	 * @param field 列
	 * @param width 幅
	 */
	public setDisplayColumnSize(displayColumn: EIMFormTypeDisplayColumn, field: string, width: number): void {

		// 対象の列を特定する
		for (let i = 0; i < displayColumn.columns.length; i++) {
			let column: EIMFormTypeDisplayColumnColumn = displayColumn.columns[i];
			if (field === this.getFieldByColumnId(column.columnId)) {
				column.width = width;
				break;
			}
		}

		// 表示列をローカルストレージに保存する
		let loginUserId: number = this.formCacheService.getLoginUser().id;
		this.localStorageService.setFormTypeDisplayColumn(loginUserId, displayColumn);
	}

	/**
	 * 表示列のカラムを移動する
	 * @param displayColumn 表示列
	 * @param field フィールドID
	 * @param toIndex 移動先インデックス
	 * @return 移動後の表示列
	 */
	public moveDisplayColumn(displayColumn: EIMFormTypeDisplayColumn, field: string, toIndex: number): void {

		let currentIndex: number = -1;
		let tempColumn: EIMFormTypeDisplayColumnColumn;

		// 指定カラムIDが何番目なのかを特定する
		for (let i = 0; i < displayColumn.columns.length; i++) {
			let column: EIMFormTypeDisplayColumnColumn = displayColumn.columns[i];

			if (field == this.getFieldByColumnId(column.columnId)) {
				currentIndex = i;
				tempColumn = column;
				break;
			}
		}

		// 順番を入れ替える
		displayColumn.columns.splice(currentIndex, 1);
		displayColumn.columns.splice(toIndex, 0, tempColumn);

		// 表示列をローカルストレージに保存する
		let loginUserId: number = this.formCacheService.getLoginUser().id;
		this.localStorageService.setFormTypeDisplayColumn(loginUserId, displayColumn);
	}

	/**
	 * 表示列のソートを設定する
	 * @param displayColumn 表示列
	 * @param field フィールド
	 * @param sort 'asc'：昇順、'desc'：降順
	 */
	public setDisplayColumnSort(displayColumn: EIMFormTypeDisplayColumn, field: string, sort: string) {
		for (let i = 0; i < displayColumn.columns.length; i++) {
			let column: EIMFormTypeDisplayColumnColumn = displayColumn.columns[i];
			column.sort = null;
			if (field && field == this.getFieldByColumnId(column.columnId)) {
				column.sort = sort;
			}
		}
		// 表示列をローカルストレージに保存する
		let loginUserId: number = this.formCacheService.getLoginUser().id;
		this.localStorageService.setFormTypeDisplayColumn(loginUserId, displayColumn);
	}

	/**
	 * 表示列に名称をセットする.
	 * @param formType 帳票タイプ
	 * @param displayColumn 表示列
	 */
	private setNameToDisplayColumn(formType: EIMFormTypeDomain, displayColumn: EIMFormTypeDisplayColumn): void {
		let map: Map<string, EIMAttributeTypeDomain> = new Map<string, EIMAttributeTypeDomain>();
		let columns: EIMFormTypeDisplayColumnColumn[] = [];
		// マップを作成する
		for (let i = 0; i < formType.attributeTypeList.length; i++) {
			let attributeType: EIMAttributeTypeDomain = formType.attributeTypeList[i];
			map.set(String(attributeType.id), attributeType);
		}

		for (let i = 0; i < displayColumn.columns.length; i++) {
			let column: EIMFormTypeDisplayColumnColumn = displayColumn.columns[i];
			let columnId: string = column.columnId;
			if (this.isSystemColumn(columnId)) {
				column.definitionName = this.getColumnName(columnId);
				column.name = this.getColumnName(columnId);
				columns.push(column);
			} else {
				let attributeType: EIMAttributeTypeDomain = map.get(columnId);
				if (attributeType) {
					column.definitionName = attributeType.definitionName;
					column.name = attributeType.name;
					columns.push(column);
				}
			}
		}
		displayColumn.columns = columns;
	}

	/**
	 * 帳票タイプのシステムデフォルト表示列で表示列を作成する.
	 * @param formType 帳票タイプ
	 * @return 表示列カラム
	 */
	public createDisplayColumn(formType: EIMFormTypeDomain): EIMFormTypeDisplayColumn {
		let displayColumn: EIMFormTypeDisplayColumn = {};

		displayColumn.formTypeId = formType.id;
		displayColumn.columns = [];

		for (let i = 0; i < formType.formListColumn.systemSettingFormListColumns.length; i++) {
			let layout: any = formType.formListColumn.systemSettingFormListColumns[i];

			let column: EIMFormTypeDisplayColumnColumn = {};
			column.columnId = layout.formListColumnId;
			if (layout.definitionName) {
				column.name = layout.name;
				column.definitionName = layout.definitionName;
			} else {
				let name: string = this.getColumnName(column.columnId);
				column.name = name;
				column.definitionName = name;
			}

			displayColumn.columns.push(column);
		}

		return displayColumn;
	}

	/**
	 * カラム名を取得する.
	 * @param columnId カラムID
	 * @return カラム名
	 */
	public getColumnName(columnId: string): string {
		let name: string;
		if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_NAME) {
			name = this.translateService.instant('EIM.LABEL_02027');
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_TITLE) {
			name = this.translateService.instant('EIM.LABEL_02028');
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_STATUS_TYPE_NAME) {
			name = this.translateService.instant('EIM.LABEL_02029');
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_USER_NAME) {
			name = this.translateService.instant('EIM.LABEL_02030');
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_DATE) {
			name = this.translateService.instant('EIM.LABEL_02031');
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_USER_NAME) {
			name = this.translateService.instant('EIM.LABEL_02032');
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_DATE) {
			name = this.translateService.instant('EIM.LABEL_02033');
		}
		return name;
	}

	/**
	 * カラムを作成する.
	 * @param columnId カラムID
	 * @param columnName カラム名
	 * @param valueType データ型
	 * @param width 幅
	 * @return データグリッドカラム
	 */
	public createColumn(columnId: string, columnName: string, valueType: string, width?: number, sort?: string): EIMDataGridColumn {
		let column: any = {};

		if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_NAME) {
			column = this.getColumnId();
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_TITLE) {
			column = this.getColumnTitle();
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_STATUS_TYPE_NAME) {
			column = this.getColumnStatusTypeName();
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_USER_NAME) {
			column = this.getColumnCreationUser();
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_DATE) {
			column = this.getColumnCreationDate();
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_USER_NAME) {
			column = this.getColumnModificationUser();
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_DATE) {
			column = this.getColumnModificationDate();
		// 数値型属性、実数型属性
		} else if ( valueType === 'LONG' || valueType === 'DOUBLE') {
			column = {field: 'attType_' + columnId, headerName: columnName, cellRendererFramework: EIMFormAttributeRendererComponent, valueGetter: this.attributeRendererComponentService.valueGetter, comparator: this.numberService.numberComparator };
		} else {
			column = {field: 'attType_' + columnId, headerName: columnName, cellRendererFramework: EIMFormAttributeRendererComponent, valueGetter: this.attributeRendererComponentService.valueGetter};
		}

		if (width) {
			column.width = width;
		}

		if (sort) {
			column.sort = sort;
		}

		return column;
	}

	/**
	 * システムカラムかどうかを判定する
	 * @param columnId カラムID
	 * @return システムカラムの場合:true、システムカラムではない場合:false
	 */
	public isSystemColumn(columnId: string): boolean {
		let result: boolean = false;
		if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_NAME) {
			result = true;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_TITLE) {
			result = true;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_STATUS_TYPE_NAME) {
			result = true;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_USER_NAME) {
			result = true;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_DATE) {
			result = true;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_USER_NAME) {
			result = true;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_DATE) {
			result = true;
		}
		return result;
	}

	/**
	 * カラムIDに対応するフィールド名を取得する.
	 * @param columnId カラムID
	 * @return フィールド名
	 */
	public getFieldByColumnId(columnId: string): string {
		let field: string;
		if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_NAME) {
			field = EIMFormsConstantService.GRID_COLUMN_FIELD_NAME;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_TITLE) {
			field = EIMFormsConstantService.GRID_COLUMN_FIELD_TITLE;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_STATUS_TYPE_NAME) {
			field = EIMFormsConstantService.GRID_COLUMN_FIELD_STATUS_TYPE_NAME;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_USER_NAME) {
			field = EIMFormsConstantService.GRID_COLUMN_FIELD_CREATION_USER_NAME;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_DATE) {
			field = EIMFormsConstantService.GRID_COLUMN_FIELD_CREATION_DATE;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_USER_NAME) {
			field = EIMFormsConstantService.GRID_COLUMN_FIELD_MODIFICATION_USER_NAME;
		} else if (columnId === EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_DATE) {
			field = EIMFormsConstantService.GRID_COLUMN_FIELD_MODIFICATION_DATE;
		} else {
			field = 'attType_' + columnId;
		}

		return field;
	}

	/**
	 * 固定カラムを生成します.
	 * @return グリッドカラムリスト
	 */
	public getDefaultColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];
		columns.push(this.getColumnId());
		columns.push(this.getColumnTitle());
		columns.push(this.getColumnStatusTypeName());
		columns.push(this.getColumnCreationUser());
		columns.push(this.getColumnCreationDate());
		columns.push(this.getColumnModificationUser());
		columns.push(this.getColumnModificationDate());
		columns.push(this.getColumnFormTypeName());
		return columns;
	}

	/**
	 * 検索カラムを生成します.
	 * @return データグリッドカラムリスト
	 */
	public getSearchDefaultColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = this.getDefaultColumns();
		return columns;
	}

	/**
	 * IDグリッドカラムを取得する.
	 * @return データグリッドカラム
	 */
	protected getColumnId(): EIMDataGridColumn {
		return {field: EIMFormsConstantService.GRID_COLUMN_FIELD_NAME, headerName: this.translateService.instant('EIM.LABEL_02027'), width: 150, cellRendererFramework: EIMIdRendererComponent};
	}

	/**
	 * タイトルグリッドカラムを取得する.
	 * @return データグリッドカラム
	 */
	protected getColumnTitle(): EIMDataGridColumn {
		return {field: EIMFormsConstantService.GRID_COLUMN_FIELD_TITLE, headerName: this.translateService.instant('EIM.LABEL_02028'), width: 300};
	}

	/**
	 * ステータスタイプ名称グリッドカラムを取得する.
	 * @return データグリッドカラム
	 */
	protected getColumnStatusTypeName(): EIMDataGridColumn {
		return {field: EIMFormsConstantService.GRID_COLUMN_FIELD_STATUS_TYPE_NAME, headerName: this.translateService.instant('EIM.LABEL_02029'), width: 150};
	}

	/**
	 * 作成者グリッドカラムを取得する.
	 * @return データグリッドカラム
	 */
	protected getColumnCreationUser(): EIMDataGridColumn {
		return {field: EIMFormsConstantService.GRID_COLUMN_FIELD_CREATION_USER_NAME, headerName: this.translateService.instant('EIM.LABEL_02030'), width: 150};
	}

	/**
	 * 作成日時グリッドカラムを取得する.
	 * @return データグリッドカラム
	 */
	protected getColumnCreationDate(): EIMDataGridColumn {
		return {
			field: EIMFormsConstantService.GRID_COLUMN_FIELD_CREATION_DATE, headerName: this.translateService.instant('EIM.LABEL_02031'), width: 150,
			cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
		};
	}

	/**
	 * 更新者グリッドカラムを取得する.
	 * @return データグリッドカラム
	 */
	protected getColumnModificationUser(): EIMDataGridColumn {
		return {field: EIMFormsConstantService.GRID_COLUMN_FIELD_MODIFICATION_USER_NAME, headerName: this.translateService.instant('EIM.LABEL_02032'), width: 150};
	}

	/**
	 * 更新日時グリッドカラムを取得する.
	 * @return データグリッドカラム
	 */
	protected getColumnModificationDate(): EIMDataGridColumn {
		return {
			field: EIMFormsConstantService.GRID_COLUMN_FIELD_MODIFICATION_DATE, headerName: this.translateService.instant('EIM.LABEL_02033'), width: 150,
			cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
		};
	}

	/**
	 * 帳票タイプ名称グリッドカラムを取得する.
	 * @return データグリッドカラム
	 */
	protected getColumnFormTypeName(): EIMDataGridColumn {
		return {field: EIMFormsConstantService.GRID_COLUMN_FIELD_FORM_TYPE_NAME, headerName: this.translateService.instant('EIM_FORMS.LABEL_02014'), width: 150};
	}

}
