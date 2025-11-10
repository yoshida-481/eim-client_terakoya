import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { getProperty, setProperty } from 'dot-prop';
import { EIMRendererComponentRowData } from './renderer.component.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectTypeInputRendererComponentService } from 'app/tasks/components/object-type-input-renderer/object-type-renderer.component.service';

/**
 * cellRendererParamsに指定するドロップダウンレンダラーのパラメータ
 */
export class EIMDropdownInputRendererComponentParam {
	/** ドロップダウンのオプション */
	options?: any;
	/** ドロップダウンのオプション取得関数 */
	optionsFunction?: any;
	/** 編集可否判定関数 */
	editableFunction?: (dto: any) => boolean;
	/** 値選択時のコールバック関数 */
	onChangeFunction?: (value: any, rowData: EIMRendererComponentRowData) => void;
}

/**
 * ドロップダウンレンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMDropdownInputRendererComponent
 *
 */
@Component({
		selector: 'eim-dropdown-renderer',
		template: `
			<ng-container *ngIf="!editable">
				<div>{{editedValueString}}</div>
			</ng-container>
			<ng-container *ngIf="editable">
				<p-select #dropdown id="dropdown" class="eim-dropdown"
						[options]="options" appendTo="body" [autoDisplayFirst]="false"
						[(ngModel)]="values[0]" (onChange)="onChange($event)">
				</p-select>
			</ng-container>
		`,
	styles: [`
		::ng-deep eim-dropdown-input-renderer .p-select-label {
			height: 17px;
		}
	`],
	standalone: false,
})
export class EIMDropdownInputRendererComponent implements AgRendererComponent, OnInit, OnDestroy {

	/** レンダラパラメータ */
	public params: any;

	/** 選択値 */
	public values: any;
	/** オプション */
	public options: any;

	/** 更新した値(非編集用) */
	public editedValueString: string;

	/** 編集可能かどうか */
	public editable;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected rendererComponentService: EIMObjectTypeInputRendererComponentService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit() {
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy() {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {

		this.params = params;
		let field: string = params.colDef.field;
		let cellRendererParams: EIMDropdownInputRendererComponentParam = this.params.colDef.cellRendererParams;
		if (!cellRendererParams) {
			return;
		}

		// 表示値を取得
		this.values = getProperty(params.data, field, null);
		if (this.values === null || this.values.length === 0) {
			setProperty(params.data, field, [null])
			this.values = getProperty(params.data, field, null);
		}

		// options
		if (cellRendererParams.optionsFunction) {
			this.options = cellRendererParams.optionsFunction(params.data);
		} else {
			this.options = cellRendererParams.options;
		}

		// 更新値を設定
		this.editedValueString = this.values[0] === null ? '' : this.getLabel(this.values[0]);

		// editable
		this.editable = this.isEditable(params.data, cellRendererParams ? cellRendererParams.editableFunction : null);
	}

	/**
	 * 値選択時のイベントハンドラです.
	 * 値選択時のコールバック関数を呼び出します.
	 * @param event イベント
	 */
	public onChange(event): void {
		if (this.params.onChangeFunction) {
			this.params.onChangeFunction(event.value, {field: this.params.colDef.field, dto: this.params.data});
		}

		this.rendererComponentService.checkChanged(event);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 編集可能かどうかを返却します.
	 *
	 * @param dto DTO
	 * @param editableFunction 編集可能取得関数
	 * @returns 編集可能かどうか（可能ならtrue）
	 */
	protected isEditable(dto: any, editableFunction: (dto: any) => boolean): boolean {

		if (!editableFunction) {
			return true;
		}
		return editableFunction(dto);
	}

	/**
	 * オプションから値に対応するラベルを返却します.
	 * @param value 値
	 * @returns ラベル
	 */
	protected getLabel(value): string {
		for (let option of this.options) {
			if (option.value === value) {
				return option.label;
			}
		}

		return '';
	}
}
