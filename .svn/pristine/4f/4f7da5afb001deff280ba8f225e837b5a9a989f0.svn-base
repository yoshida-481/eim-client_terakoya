import { Component, Input, IterableDiffers, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMDateRendererComponentService } from 'app/shared/components/renderer/date-renderer.component.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { getProperty } from 'dot-prop';
import { EIMRendererComponentRowData } from './renderer.component.service';

/**
 * cellRendererParamsに指定する日付レンダラーのパラメータ
 */
export class EIMDateRendererComponentParam {
	editableFunction?: (dto: any) => boolean;
	onChangeFunction?: (value: any, rowData: EIMRendererComponentRowData) => void;
}

/**
 * 日付レンダラーコンポーネント
 * @example
 *
 *      <eim-date-renderer>
 *      </eim-date-renderer>
 */
@Component({
    selector: 'eim-date-renderer',
    template: `
    <div class="eim-date-renderer">
			<ng-container *ngIf="!editable">
   		 	<div [ngStyle]="style">{{dateString}}</div>
			</ng-container>
			<ng-container *ngIf="editable">
				<div class="eim-form-item" style="width: 100%; margin: 0px; height: 100%; display: flex; align-items: center;">
					<div class="eim-form-input" style="height: 100%; margin: 0px; display: flex; align-items: center;">
						<p-calendar name="{{name}}"
								dateFormat="{{ 'EIM.CALENDAR.DATE_FORMAT' | translate }}" appendTo="body" selectOtherMonths="true"
								[showButtonBar]="true" [monthNavigator]="true" [yearNavigator]="true" [yearRange]="CALENDAR_YEAR_RANGE" [showIcon]="true"
								[(ngModel)]="editedValue"
								(onClearClick)="onClickClear($event)" (onSelect)="onSelect($event)" (onInput)="onInput($event)" ngDefaultControl></p-calendar>
					</div>
				</div>
			</ng-container>
    </div>
    `,
    styles: [`
			::ng-deep .eim-date-renderer {
				height: 100%;
				width: 100%;
				position: relative;
			}
		`],
    standalone: false
})
export class EIMDateRendererComponent implements AgRendererComponent {

	/** フォームグループ */
	@Input() public form: FormGroup;

	/** カレンダー年範囲 */
	public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	private params: any;
	public dateString: string;
	public style;

	public name = '';
	/** 更新した値 */
	public editedValue; // 元データに反映指せないよう別パラメータとする

	/** 編集可能かどうか */
	public editable;

	constructor(
			protected dateRendererComponentService: EIMDateRendererComponentService,
	) {}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		let field: string = params.colDef.field;
		let cellRendererParams: EIMDateRendererComponentParam = this.params.colDef.cellRendererParams;

		this.name = ''; // params.colDef.field + '_' + params.data.id;

		// 表示値を取得
		let value = null;
		let tmpValue: any = getProperty(params.data, field);
		if (tmpValue instanceof Array) {
			value = tmpValue[0];
		} else {
			value = tmpValue;
		}
		this.dateString = this.dateRendererComponentService.getLabel(value);

		// 更新値を設定
		// 元データに反映指せないよう別パラメータとする
		this.editedValue = new Date(value);

		if (this.params.data[params.colDef.field + '_color']) {
			this.style = {'position': 'absolute', 'top': '0', 'bottom': '0', 'margin': 'auto', 'height': '17px', 'width': '100%',
				'background-color': '#' + this.params.data[params.colDef.field + '_color'] , 'display': 'flex', 'align-items': 'center'};
		} else {
			this.style= {'position': 'absolute', 'top': '0', 'bottom': '0', 'margin': 'auto', 'height': '17px', 'width': '100%'};
		}

		// editable
		this.editable = this.isEditable(params.data, cellRendererParams ? cellRendererParams.editableFunction : null);

	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * 日付選択時のイベントハンドラです.
	 * @param value 日付
	 */
	onSelect(value: any) {
		if (this.params.onChangeFunction) {
			this.params.onChangeFunction(value.getTime(), {field: this.params.colDef.field, dto: this.params.data});
		}
	}

	/**
	 * 日付入力時のイベントハンドラです.
	 * @param value 日付
	 */
	onInput(value: any) {
		if (this.params.onChangeFunction) {
			this.params.onChangeFunction(value.getTime(), {field: this.params.colDef.field, dto: this.params.data});
		}
	}

	/**
	 * クリアボタンクリックイベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onClickClear(value: any) {
		if (this.params.onChangeFunction) {
			this.params.onChangeFunction(null, {field: this.params.colDef.field, dto: this.params.data});
		}
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
			return false;
		}
		return editableFunction(dto);
	}

}
