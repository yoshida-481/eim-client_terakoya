import { Component, ElementRef, Input, IterableDiffers, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { getProperty, setProperty } from 'dot-prop';
import { EIMRendererComponentRowData } from './renderer.component.service';
import { EIMInputRendererComponent, EIMInputRendererComponentParam } from './input-renderer.component';

export class EIMCalendarInputRendererComponentParam 
		extends EIMInputRendererComponentParam {

	editableFunction?: (dto: any) => boolean;
	/** 値選択時のコールバック関数 */
	onChangeFunction?: (value: any, rowData: EIMRendererComponentRowData) => void;
}

/**
 * 日付入力レンダラーコンポーネント
 * @example
 *
 *      <eim-calendar-input-renderer>
 *      </eim-calendar-input-renderer>
 */
@Component({
    selector: 'eim-calendar-input-renderer',
    template: `
    <div class="eim-calendar-input-renderer">
			<ng-container *ngIf="!editable">
   		 	<div>{{editedValueString}}</div>
			</ng-container>
			<ng-container *ngIf="editable">
				<div class="eim-form-item" style="width: 100%; margin: 0px; height: 100%; display: flex; align-items: center;">
					<div class="eim-form-input" style="height: 100%; margin: 0px; display: flex; align-items: center;">
						<p-datepicker #calendar name="{{name}}"
								[ngClass]="{'eim-invalid': !isValid}"
								dateFormat="{{ 'EIM.CALENDAR.DATE_FORMAT' | translate }}" appendTo="body" selectOtherMonths="true"
								[showButtonBar]="true" [monthNavigator]="true" [yearNavigator]="true" [yearRange]="CALENDAR_YEAR_RANGE" [showIcon]="true"
								[(ngModel)]="editedValue"
								(onClearClick)="onClickClear($event)" (onSelect)="onSelect($event)"
								(onBlur)="onFocusOut($event)" ngDefaultControl></p-datepicker>
					</div>
				</div>
			</ng-container>
    </div>
    `,
	styleUrls: ['./calendar-input-renderer.component.scss'],
	standalone: false,
})
export class EIMCalendarInputRendererComponent extends EIMInputRendererComponent implements AgRendererComponent {

	/** フォームグループ */
	@Input() public form: FormGroup;

	@ViewChildren('calendar')
	public calendar: QueryList<ElementRef>;
	
	/** カレンダー年範囲 */
	public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	/** レンダラパラメータ */
	private params: any;
	
	/** 選択値 */
	public values: any;
	
	/** 編集可能時の日付 */
	public editedValue: Date;

	/** 編集可能時の変更前日付 */
	public prevEditedValue: Date;

	/** 編集不可時のラベル */
	public editedValueString: string;

	public name = '';

	/** 編集可能かどうか */
	public editable;

	/** 入力値が有効かどうか */
	public isValid = true;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected dateService: EIMDateService,
	) {
		super();
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {

		super.agInit(params);

		this.params = params;
		let field: string = params.colDef.field;
		let cellRendererParams: EIMCalendarInputRendererComponentParam = 
				this.params.colDef.cellRendererParams;

		this.name = ''; // params.colDef.field + '_' + params.data.id;

		// 表示値を取得
		this.values = getProperty(params.data, field, null);
		if (this.values === null || this.values.length === 0) {
			setProperty(params.data, field, [null])
			this.values = getProperty(params.data, field, null);
		}

		// 表示ラベルを設定
		this.prevEditedValue = null;
		if (this.values === null || this.values.length === 0 || this.values[0] === null) {
			this.editedValue = null;
			this.editedValueString = '';
		} else {
			this.editedValue = new Date(this.values[0]);
			this.prevEditedValue = new Date(this.values[0]);
			this.editedValueString = this.dateService.getDateString(this.editedValue);
		}

		// editable
		this.editable = this.isEditable(params.data, cellRendererParams ? cellRendererParams.editableFunction : null);

		// 入力値の検証
		this.isValid = this.validate(this.params);

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
	 * カレンダ選択イベントハンドラ.
	 * @param event イベント
	 */
	onSelect(event: any): void {
		if (this.editedValue) {
			setProperty(this.params.data, this.params.colDef.field, [this.editedValue.getTime()]);
			this.values[0] = this.editedValue.getTime();
			this.prevEditedValue = new Date(this.editedValue.getTime());
		}
		else {
			this.values[0] = null;
			this.prevEditedValue = null;
		}

		// 入力値の検証
		this.isValid = this.validate(this.params);

		if (this.params.onChangeFunction) {
			this.params.onChangeFunction(this.editedValue ? this.editedValue.getTime() : null, {field: this.params.colDef.field, dto: this.params.data});
		}
	}

	/**
	 * フォーカスアウトイベントハンドラ.
	 * 直接入力時の値を設定します.
	 * @param event イベント
	 */
	onFocusOut(event): void {

		let ef: ElementRef = this.calendar.toArray()[0];
		const activeElement: any = ef['el'].nativeElement?.children?.[0]?.children?.[0];
		const nowValue = activeElement?.value;
		this.editedValue = this.dateService.getDate(nowValue);

		// 変更がない（直接入力ではない場合は何もしない）
		if (this.prevEditedValue === null && this.editedValue === null) {
			return;
		}
		if (this.prevEditedValue !== null && this.editedValue !== null && this.prevEditedValue.getTime() === this.editedValue.getTime()) {
			return;
		}


		if (this.editedValue) {
			this.values[0] = this.editedValue.getTime();
			this.prevEditedValue = new Date(this.editedValue.getTime());
		}
		else {
			this.values[0] = null;
			this.prevEditedValue = null;
		}

		// 入力値の検証
		this.isValid = this.validate(this.params);

		if (this.params.onChangeFunction) {
			this.params.onChangeFunction(this.editedValue ? this.editedValue.getTime() : null, {field: this.params.colDef.field, dto: this.params.data});
		}
	}

	/**
	 * クリアボタンクリックイベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onClickClear(value: any) {
		this.values[0] = null;
		this.prevEditedValue = null;

		// 入力値の検証
		this.isValid = this.validate(this.params);

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
			return true;
		}
		return editableFunction(dto);
	}

}
