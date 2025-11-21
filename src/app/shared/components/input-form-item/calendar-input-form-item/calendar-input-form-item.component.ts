import {	Component, IterableDiffers, Input, ViewContainerRef, TemplateRef, Inject, LOCALE_ID, ViewChild, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMInputFormItemComponent } from '../input-form-item.component';
import { EIMDateService } from 'app/shared/services/date.service';

/**
 * カレンダ入力フォームアイテムコンポーネント
 * @example
 *      <eim-calendar-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *          [pTooltipLabelFlg]="pTooltipLabelFlg"
 *          [showTime]="false"
 *      >
 *      </eim-calendar-input-form-item>
 */
@Component({
    selector: 'eim-calendar-input-form-item',
    templateUrl: './calendar-input-form-item.component.html',
    styleUrls: ['./calendar-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMCalendarInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMCalendarInputFormItemComponent extends EIMInputFormItemComponent  implements OnInit {

	@ViewChildren('calendar')
	public calendar: QueryList<ElementRef>;
	
	/** 時分秒を表示するかどうか */
	@Input() public showTime = false;

	/** Date型ではなくNumber型のデータを使用するかどうか */
	@Input() public useTimeNumber = false;

	/** カレンダー年範囲 */
	public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

	public times: number[];

	/** 時 */
	public hours: number[] = [];

	/** 分 */
	public minutes: number[] = [];

	/** 秒 */
	public seconds: number[] = [];

	/** 時分秒フォーカス時の値 */
	protected forcusValue: number = null;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected differs: IterableDiffers,
			protected dateService: EIMDateService) {
		super(differs);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	public writeValue(_value: any) {
		let value;

		// Date型ではなくNumber型のデータを使用する場合
		if (this.useTimeNumber) {

			// this.timesの値変更がngModelに設定した変数に連動する
			// this.valueは画面表示用にDate型でデータを保持する
			// したがって、this.valueを変更した際はthis.timesを更新しないとngModelで指定した変数に反映されない。

			this.times = _value;

			value = [];
			if (Array.isArray(_value)) {
				for (let date of _value) {
					value.push(new Date(Number(_value)));
				}
			} else {
				value.push(new Date(Number(_value)));
			}
		}
		// Date型のデータを使用する場合
		else {
			value = _value;

			// timesを初期化
			this.times = [];
			if (Array.isArray(value)) {
				for (let date of value) {
					this.times.push(Number(value));
				}
			} else {
				this.times.push(Number(value));
			}
		}

		super.writeValue(value);

		// 時分秒を初期化
		if (!this.showTime) {
			return;
		}

		if (value && value.length > 0 && value[0] !== '') {
			this.hours = [];
			this.minutes = [];
			this.seconds = [];

			for (let i = 0; i < value.length; i++) {
				let date: Date = value[i];
				this.hours.push(date.getHours());
				this.minutes.push(date.getMinutes());
				this.seconds.push(date.getSeconds());
			}
		} else {
				this.hours = [];
				this.minutes = [];
				this.seconds = [];
		}

	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit(): void {

		this.addValidators(this.dateValidatorFn());
	}

	/**
	 * プラスクリック時のハンドラです。
	 * 該当入力行の直下に新しい入力行を挿入します。
	 * @param index プラスボタンをクリックした同一属性値入力内の行のインデックス
	 */
	onPlusClick(index: number) {
		super.onPlusClick(index);

		this.times.splice(index + 1, 0, null);

		if (!this.showTime) {
			return;
		}

		this.hours.splice(index + 1, 0, null);
		this.minutes.splice(index + 1, 0, null);
		this.seconds.splice(index + 1, 0, null);
	}

	/**
	 * マイナスクリック時のハンドラです。
	 * 該当入力行を削除します。
	 * 同一属性値内の各フォームはdirty扱いとなります。
	 * @param index マイナスボタンをクリックした同一属性値入力内の行のインデックス
	 */
	onMinusClick(index: number) {
		super.onMinusClick(index);

		this.times.splice(index, 1);

		if (!this.showTime) {
			return;
		}

		if (this.value.length === this.hours.length) {
			return;
		}

		this.hours.splice(index, 1);
		this.minutes.splice(index, 1);
		this.seconds.splice(index, 1);
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * カレンダはchangeイベントを送出せず、代わりにonSelectイベントを送出する.
	 * onSelectはchangeイベントと違い、$eventはvalueを表すため、別メソッドで値、ダーティーを設定する.
	 * @param value 選択した値
	 * @param index 複数値属性のインデックス
	 */
	onSelect(value, index): void {
		if (!this.formControls[index]) {
			return;
		}
		// update the form
		let prevValue = this.formControls[index].value;

		this.value[index] = value;
		if (this.showTime) {
			if (!this.hours[index]) {
				// 空の状態から選択した場合
				this.hours[index] = 0;
				this.minutes[index] = 0;
				this.seconds[index] = 0;
			}
			this.setTime(index);
		}

		this.times[index] = (value as Date).getTime();

		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));

	}

	/**
	 * フォーカスアウトイベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onBlur(event: any, index: number): void {

		if (!this.formControls[index]) {
			return;
		}

		// 日付のフォーマットチェック
		// 日付が正しくなければ確定扱いしない
		const dateStr: string = event.currentTarget.value;
		const isValidDate = this.dateService.isValidDate(dateStr);
		if (!isValidDate) {

			return;
		}

		this.value[index] = this.dateService.getDate(dateStr);

		if (!this.showTime) {
			if (!this.hours[index]) {
				this.hours[index] = 0;
				this.minutes[index] = 0;
				this.seconds[index] = 0;
			}
		}
		this.setTime(index);

		let prevValue = this.formControls[index].value;

		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}

	/**
	 * クリアボタンクリックイベントハンドラ.
	 * @param event イベント
	 * @param calendar 選択したカレンダー
	 * @param index 複数値属性のインデックス
	 */
	onClickClear(value, calendar, index): void {
		if (!this.formControls[index]) {
			return;
		}
		// update the form
		let prevValue = this.formControls[index].value;

		this.value[index] = '';
		if (!this.showTime) {
			this.hours[index] = null;
			this.minutes[index] = null;
			this.seconds[index] = null;
		}
		let crrentDate = new Date();
		calendar.currentMonth = crrentDate.getMonth();
		calendar.currentYear = crrentDate.getFullYear();

		this.times[index] = null;

		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}

	/**
 	* 今日ボタンクリックイベントハンドラ
 	* @param value 選択した値
 	* @param calendar 選択したカレンダー
 	* @param index 複数値属性のインデックス
 	*/
	onClickToday(value, calendar, index): void {
		if (!this.formControls[index]) {
			return;
		}
		// update the form
		let prevValue = this.formControls[index].value;

		this.value[index] = new Date();

		calendar.currentMonth = this.value[index].getMonth();
		calendar.currentYear = this.value[index].getFullYear();

		this.times[index] = (value as Date).getTime();

		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}

	/**
	* カレンダーボタンクリックイベントハンドラ.
	* @param value 選択した値
	* @param calendar 選択したカレンダー
	* @param index 複数値属性のインデックス
	*/
	openCalendar(value, calendar, index) {
		if (this.value[index] !== null && this.value[index] !== '') {
			let date: Date = this.value[index];
			// 設定値と選択しているカレンダーの日にちが異なる場合は、合わせる。
			if (date.getMonth() !== calendar.currentMonth || date.getFullYear() !== calendar.currentYear) {
				calendar.currentMonth = date.getMonth();
				calendar.currentYear = date.getFullYear();
			}
		}
	}

	/**
	 * スピナーフォーカスイベントハンドラ.
	 * @param index インデックス
	 * @param kind スピナータイプ
	 */
	onFocusSpiner(index: number, kind: string): void {
		switch (kind) {
			case 'hour':
					this.forcusValue = this.hours[index];
				break;
			case 'minute':
				this.forcusValue = this.minutes[index];
				break;
			case 'second':
				this.forcusValue = this.seconds[index];
				break;
		}
		let elementName = this.name + '_' + kind + '_' + index;
		let element = document.getElementById(elementName);
		element['selectionStart'] = 0;
		element['selectionEnd'] = 2;
	}

	/**
	 * スピナーフォーカスアウトイベントハンドラ.
	 * @param index インデックス
	 * @param kind スピナータイプ
	 */
	onBlurSpiner(index: number, kind: string): void {
		let value = null;
		switch (kind) {
			case 'hour':
				value = this.hours[index];
				break;
			case 'minute':
				value = this.minutes[index];
				break;
			case 'second':
				value = this.seconds[index];
				break;
		}

		if (this.forcusValue !== value) {
			this.onChangeTime(index);
			this.forcusValue = null;
		}
	}

	/**
	 * 時分秒を変更した場合
	 * @param index 複数値属性の場合のインデックス(単数値属性の場合は0)
	 */
	onChangeTime(index: number): void {
		this.setTime(index);

		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 値が変更されたかどうかを返却します.
	 * @return 変更された場合true
	 */
	protected isChangedValue(): boolean {
		if (this.value.length === 0) {
			// 値が未入力の場合
			if (this.formControls.length !== 1) {
				return true;
			}

			if (this.formControls[0].value !== '') {
				return true;
			}

		} else {
			// 値が入力済みの場合
			if (this.value.length !== this.formControls.length) {
				return true;
			}

			for (let i = 0; i < this.value.length; i++) {

				// this.formControlsのみnullの場合
				if (this.value[i] !== null && this.value[i] !== '' && (this.formControls[i].value === null || this.formControls[i].value === '')) {
					return true;
				}

				// this.valueのみnullの場合
				if ((this.value[i] === null || this.value[i] === '' ) && this.formControls[i].value !== null && this.formControls[i].value !== '') {
					return true;
				}

				// どちらもnullの場合
				if ((this.value[i] === null || this.value[i] === '' ) && (this.formControls[i].value === null || this.formControls[i].value === '')) {
					continue;
				}

				if (this.value[i].getTime() !== this.formControls[i].value.getTime()) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 時分秒を設定します.
	 * @param index 複数値属性の場合のインデックス(単数値属性の場合は0)
	 */
	protected setTime(index: number): void {
		this.value[index].setHours(this.hours[index]);
		this.value[index].setMinutes(this.minutes[index]);
		this.value[index].setSeconds(this.seconds[index]);

		this.times[index] = this.value[index].getTime();
	}

	/**
	 * 日付のバリデータ関数です.
	 */
	protected dateValidatorFn(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {

			const index = control['index'];
			if(!index){
				return null;
			}

			let ef: ElementRef = this.calendar.toArray()[index];
			if (!ef) {
				// 初期表示時に複数値が存在する場合は、まだ２件目以降のコンポーネントが表示されておらず、
				// efが空になるため、スキップする。
				return null;
			}

			const activeElement: any = ef['el'].nativeElement?.children?.[0]?.children?.[0];
			let nowValue = activeElement?.value;

			// 未入力
			if (nowValue === null || nowValue === '') {
				return null;
			}
			const isValid = this.dateService.isValidDate(nowValue);
			return isValid ? null : { date: true };
		};
	}
}
