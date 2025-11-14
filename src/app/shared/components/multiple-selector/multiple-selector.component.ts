import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, OnDestroy, SimpleChanges, forwardRef } from '@angular/core';
import { of, Observable ,  Subscription } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';

import { EIMSelectorComponent, EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo } from './multiple-selector.component.service';
import { EIMDataGridComponentService } from '../data-grid/data-grid.component.service';

/**
 * 複数選択コンポーネント
 * @example
 *	<eim-multiple-selector #attributeTypeListMultiple
 *		[componentService]="componentService"
 *		[columns]="columns"
 *		[selectedData]="selectedData">
 *		[widthBalance]="widthBalance">
 *	</eim-multiple-selector>
 */
@Component({
    selector: 'eim-multiple-selector',
    templateUrl: './multiple-selector.component.html',
    styleUrls: ['./multiple-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMMultipleSelectorComponent) }],
    standalone: false
})
export class EIMMultipleSelectorComponent implements OnInit, AfterViewInit, OnDestroy, EIMSelectorComponent<any>, EIMSelectable {
	@ContentChild(EIMSingleSelectorComponent, { static: true })
		searchResultList: EIMSingleSelectorComponent;
	@ViewChild('selectedList', { static: true })
		selectedList: EIMDataGridComponent;

	/** コンポーネントサービス */
	@Input() public componentService: EIMMultipleSelectorComponentService;
	/** カラム定義　未指定の場合で、左ペインがEIMDataGridSingleSelectorComponentの場合はcolumnsを引き継ぎます */
	@Input() columns: EIMDataGridColumn[] = [];
	/** 選択済みデータ */
	@Input() selectedData: any[];
	/** 必須かどうか */
	@Input() public required = false;
	/** 左ペインラベル */
	@Input() public leftLabel = '';
	/** 右ペインラベル */
	@Input() public rightLabel = '';
	/** 幅バランス */
	@Input() public widthBalance = 50;
	/** 選択イベントエミッタ */
	@Output() public selected: EventEmitter<any[]> = new EventEmitter<any[]>();
	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 複数選択コンポーネント情報 */
	public info: EIMMultipleSelectionComponentInfo;

	/** シングルセレクタ情報取得完了サブスクリプション */
	protected fetched: Subscription;

	/** 検索結果一覧のエラー発生サブスクリプション */
	protected searchResultListErrored: Subscription;

	/**
	 * コンストラクタです.
	 * @param multipleSelectorComponentService 複数選択コンポーネントサービス
	 */
	constructor(
		protected translateService: TranslateService,
		protected multipleSelectorComponentService: EIMMultipleSelectorComponentService,
		protected dataGridComponentService: EIMDataGridComponentService
	) {
		if (this.leftLabel === '') {
			this.leftLabel = this.translateService.instant('EIM.LABEL_02037');
		}
		if (this.rightLabel === '') {
			this.rightLabel = this.translateService.instant('EIM.LABEL_02038');
		}
	}



	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択情報を取得します.
	 */
	public getSelectedData(): any[] {
		return this.selectedList.getSelectedData();
	}

	/**
	 * 選択リストを取得します.
	 */
	public getData(): any[] {
		return this.selectedList.getData();
	}

	/**
	 * 選択リストを設定します.
	 * @param data
	 */
	public setData(data: any[]) {
		return this.selectedList.setData(data);
	}

	/**
	 * 選択します.
	 */
	public select(): void {
		this.selected.emit(this.searchResultList.convertDtosToDomains(this.selectedList.getData()));
	}

	/**
	 * 選択可否を判定します.
	 */
	public selectable(): boolean {
		if (this.required) {
			return (this.getData().length > 0);
		} else {
			return true;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値を初期化後の処理です.
	 */
	public ngOnInit(): void {
		if (!this.componentService) {
			this.componentService = this.multipleSelectorComponentService;
		}
		this.info = {
			searchResultList: this.searchResultList,
			selectedList: this.selectedList,
			columns: this.columns,
			equals: null,
			selectedData: this.selectedData,
			widthBalance: this.widthBalance,
		}
		this.fetched = this.searchResultList.fetched.subscribe((target: any) => { this.componentService.onFetch(this.info, target); });
		this.setColumns();
	}

	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 */
	public ngAfterViewInit() {

		window.setTimeout(() => {
			if (this.searchResultList instanceof EIMDataGridSingleSelectorComponent) {
				if (this.columns == null || this.columns.length === 0) {
					this.columns = this.searchResultList.columns;
					this.setColumns();
				}

				// 同一行判定関数を設定
				if (this.searchResultList.equals) {
					this.info.equals = this.searchResultList.equals;
				}
				else {
					// 指定がなければデフォルトの同一行判定関数を設定
					this.info.equals = this.dataGridComponentService.defaultEquals;
				}
			}
			else {

				// デフォルトの同一行判定関数を設定
				this.info.equals = this.dataGridComponentService.defaultEquals;
			}

			this.componentService.initialize(this.info);

			if (this.searchResultList.hasOwnProperty('errored')) {
				this.searchResultListErrored = this.searchResultList['errored'].subscribe((result) => this.errored.emit(result));
			}
		});
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	public ngOnDestroy(): void {
		if (this.fetched && !this.fetched.closed) {
			this.fetched.unsubscribe();
		}
		if (this.searchResultListErrored && !this.searchResultListErrored.closed) {
			this.searchResultListErrored.unsubscribe();
		}
	}

	/**
	 * 追加ボタン選択時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickAdd(event: any): void {
		this.componentService.add(this.info);
	}

	/**
	 * 削除ボタン選択時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDelete(event: any): void {
		this.componentService.delete(this.info, this.selectedList.getSelectedData());
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * カラム定義を設定します.
	 */
	protected setColumns(): void {
		this.selectedList.setColumns(this.columns);
	}

}
