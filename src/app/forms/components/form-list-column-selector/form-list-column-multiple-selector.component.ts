import { Component, forwardRef, ContentChild, ViewChild, Input, AfterViewInit } from '@angular/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMMultipleSelectorComponent } from "app/shared/components/multiple-selector/multiple-selector.component";

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMDataGridComponent } from "app/shared/components/data-grid/data-grid.component";
import { EIMFormListColumnSingleSelectorComponent } from "app/forms/components/form-list-column-selector/form-list-column-single-selector.component";

import { EIMFormListColumnMultipleSelectorComponentService } from 'app/forms/components/form-list-column-selector/form-list-column-multiple-selector.component.service';
import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMFormListColumnSingleSelectorComponentService } from './form-list-column-single-selector.component.service';

/**
 * 表示列編集（選択済み一覧用）コンポーネント
 * @example
 *	<eim-form-list-column-multiple-selector
 *		[columns]="columns"
 *		[selectedData]="selectedData">
 *	</eim-form-list-column-multiple-selector>
 */
@Component({
    selector: 'eim-form-list-column-multiple-selector',
    templateUrl: './form-list-column-multiple-selector.component.html',
    styleUrls: ['./form-list-column-multiple-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFormListColumnMultipleSelectorComponent) },
    ],
    standalone: false
})
export class EIMFormListColumnMultipleSelectorComponent extends EIMMultipleSelectorComponent {
	
	/** デフォルトカラム（システム管理画面で設定した表示列） */
	@Input() defaultColumns: any[];
	
	/** データグリッド変更フラグ */
	public isDirty: boolean = false;
	
	/**
	 * コンストラクタです.
	 * @param multipleSelectorComponentService 複数選択コンポーネントサービス
	 * @param formListColumnMultipleSelectorComponentService 属性タイプ複数選択コンポーネントサービス
	 * @param translateService 翻訳サービス
	 */
	constructor(
		protected translateService: TranslateService,
		protected multipleSelectorComponentService: EIMMultipleSelectorComponentService,
		protected dataGridComponentService: EIMDataGridComponentService,
		
		protected formListColumnMultipleSelectorComponentService: EIMFormListColumnMultipleSelectorComponentService
	) {
		super(translateService, multipleSelectorComponentService, dataGridComponentService);
		this.componentService = formListColumnMultipleSelectorComponentService;
		this.columns = [
		                {field: 'definitionName', headerName: this.translateService.instant('EIM.LABEL_02021'), width: 280, suppressSorting: true, suppressFilter: true},
		                {field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 145, suppressSorting: true, suppressFilter:true},
		                ];
	}
	
	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (a.columnId == b.columnId);
	}
	
	/**
	 * デフォルトボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDefault(event:any):void {
		this.isDirty = (<EIMFormListColumnMultipleSelectorComponentService>this.componentService).default(this.info, this.defaultColumns);
	}
	
	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickUp(event:any):void {
		this.isDirty = (<EIMFormListColumnMultipleSelectorComponentService>this.componentService).up(this.info) || this.isDirty;
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event:any):void {
		this.isDirty = (<EIMFormListColumnMultipleSelectorComponentService>this.componentService).down(this.info) || this.isDirty;
	}
	
	/**
	 * 追加ボタン選択時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickAdd(event: any): void {
		this.isDirty = (<EIMFormListColumnMultipleSelectorComponentService>this.componentService).add(this.info) || this.isDirty;
	}

	/**
	 * 削除ボタン選択時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDelete(event: any): void {
		this.isDirty = (<EIMFormListColumnMultipleSelectorComponentService>this.componentService).delete(this.info, this.selectedList.getSelectedData()) || this.isDirty;
	}
}