import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChildren, forwardRef } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMListComponentInfo, EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from '../data-grid-single-selector.component.service';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';

/**
 * 単一選択データグリッドテンプレートコンポーネント
 * @example
 * 		<eim-template-data-grid-single-selector #template
 *			[componentService]="componentService"
 *			[data]="data"
 *			[(condition)]="condition"
 *			[multiple]="multiple"
 *			[columns]="columns"
 *			[filterFlag]="false">
 *		</eim-template-data-grid-single-selector>
 */
@Component({
    selector: 'eim-template-data-grid-single-selector',
    templateUrl: './template-data-grid-single-selector.component.html',
    standalone: false
})
export class EIMTemplateDataGridSingleSelectorComponent {
	/** コンポーネントサービス */
	@Input() public componentService: EIMDataGridSingleSelectorComponentService;
	/** データ */
	@Input() public data: any[];
	/** 条件 */
	@Input() public condition: any;
	/** 複数フラグ */
	@Input() public multiple = false;
	/** データグリッドカラム */
	@Input() public columns: EIMDataGridColumn[] = [];
	/** フィルタアイコンフラグ */
	@Input() public filterFlag = false;
	/** 同一行判定関数 */
	@Input() public equals: (a: any, b: any) => boolean = this.defaultEquals;
	/** 検索結果リスト */
	@ViewChild('searchResultList', { static: true }) searchResultList: EIMDataGridComponent;

	/** 単一選択データグリッドコンポーネント情報 */
	public info: EIMDataGridSingleSelectorComponentInfo = {};

	/**
	 * コンストラクタです.
	 */
	constructor() {}

	/**
	 * 実行します.
	 */
	public onSubmit() {
		this.componentService.search(this.info, this.condition);
	}

	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一行かどうか
	 */
	protected defaultEquals(obj1: any, obj2: any): boolean {
		return (obj1.objId === obj2.objId);
	 }
}
