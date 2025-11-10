import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChildren, forwardRef, AfterViewInit } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMListComponentInfo, EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from './data-grid-single-selector.component.service';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTemplateDataGridSingleSelectorComponent } from './template-data-grid-single-selector/template-data-grid-single-selector.component';
import { EIMDataGridComponentService } from '../data-grid/data-grid.component.service';

/**
 * データグリッド単一選択コンポーネント
 */
@Component({
    selector: 'eim-data-grid-single-selector',
    templateUrl: './data-grid-single-selector.component.html',
    styleUrls: ['./data-grid-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMDataGridSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMDataGridSingleSelectorComponent) }],
    standalone: false
})
export class EIMDataGridSingleSelectorComponent extends EIMSingleSelectorComponent implements EIMSelectable, OnInit, AfterViewInit {

	@ViewChild('template', { static: true })
		template: EIMTemplateDataGridSingleSelectorComponent;

	/** コンポーネントサービス */
	@Input()
		public componentService: EIMDataGridSingleSelectorComponentService;

	/** データ */
	@Input()
		public data: any[];

	/** 選択データ */
	@Input()
		public selectedData: any[];

	/** カラム */
	@Input()
		public columns: EIMDataGridColumn[] = [];

	/** 同一行判定関数 */
	@Input()
		public equals: (a: any, b: any) => boolean = null;

	/** 検索条件 */
	@Input()
		public condition: any;

	/** 複数行選択可フラグ */
	@Input()
		public multiple = false;

	/** 選択イベントエミッタ */
	@Output()
		public selected: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** データグリッド単数選択コンポーネント情報 */
	public info: EIMDataGridSingleSelectorComponentInfo = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected dataGridSingleSelectorComponentService: EIMDataGridSingleSelectorComponentService,
  		protected messageService: EIMMessageService,
	) {
		super();
		if (!this.componentService) {
			this.componentService = dataGridSingleSelectorComponentService;
		}
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 行を設定します.
	 * @param data データ
	 */
	public setData(data: any[]): void {
		if (data && data.length > 0) {
			this.info.data = data;
		} else {
			this.info.data = [];
		}
		super.setData(this.info.data);
		this.template.searchResultList.setData(this.info.data);

	}

	/**
	 * 行を取得します.
	 * @return 行データ
	 */
	public getData(): any[] {
		return this.template.searchResultList.getData();
	}

	/**
	 * 選択行を返却します.
	 */
	public getSelectedData(): any[] {
		return this.template.searchResultList.getSelectedData();
	}

	/**
	 * フィルタを実行します.
	 * @param unvisibleData 非表示データ
	 */
	public filter(unvisibleData: any[]): void {
		this.componentService.filter(this.template.searchResultList.info, unvisibleData);
	}

	/**
	 * カラムをセットします.
	 * @param columns セットするカラム
	 */
	protected setColumns(): void {
    this.template.searchResultList.setColumns(this.columns);
  }

	/**
	 * 選択します.
	 */
	public select(): void {
		this.selected.emit(this.convertDtosToDomains(this.template.searchResultList.getSelectedData()));
	}

	/**
	 * 選択可否を返却します.
	 * @return 選択可ならtrue
	 */
	public selectable(): boolean {
		return (
				this.template.searchResultList &&
				this.template.searchResultList.getSelectedData() &&
				this.template.searchResultList.getSelectedData().length == 1);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	public ngOnInit(): void {
		this.template.info = this.info;
// this.template.columns = this.columns;
		this.template.searchResultList.setColumns(this.columns);

		if (!this.equals) {
			this.equals = this.componentService.equals;
		}
		this.info.equals = this.equals;

		if (this.data && this.data.length > 0) {
			this.info.data = this.data;
		} else {
			this.info.data = [];
		}
	}

	/**
	 * ビュー初期化イベントハンドラです.
	 */
	public ngAfterViewInit() {
		this.info.dataGrid = this.template.searchResultList;
	}

	/**
	 * サブミットのイベントハンドラです.
	 */
	public onSubmit() {
		this.componentService.search(this.info, this.condition);
	}

}
