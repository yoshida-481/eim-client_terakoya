import {Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSearchInputFormItemComponent } from '../search-input-form-item.component';

/**
 * カレンダ検索条件入力フォームアイテムコンポーネント
 * @example
 *      <eim-calendar-search-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-calendar-search-input-form-item>
 */
@Component({
    selector: 'eim-calendar-search-input-form-item',
    templateUrl: './calendar-search-input-form-item.component.html',
    styleUrls: ['./calendar-search-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMSearchCalendarInputFormItemComponent, multi: true },
    ],
    standalone: false
})
export class EIMSearchCalendarInputFormItemComponent extends EIMSearchInputFormItemComponent {

	/** カレンダー年範囲 */
	public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

	/** デリミタ「~」 */
	public DELIMITER_TIDE: string = EIMConstantService.DELIMITER_TIDE ;

	/**
	 * コンストラクタです.
	 */
	constructor(protected translateService: TranslateService) {
		super();
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * カレンダはchangeイベントを送出せず、代わりにonSelectイベントを送出する.
	 * onSelectはchangeイベントと違い、$eventはvalueを表すため、別メソッドで値、ダーティーを設定する.
	 * @param value 選択した値
	 * @param index 複数値属性のインデックス
	 */
	onSelect(value, index) {
		if (!this.formControl) {
			return;
		}
		// update the form
		this.value[index] = value;
		this.formControl.setValue(this.value[index]);
		this.formControl.markAsDirty();
	}

	/**
	 * 入力イベントハンドラ.
	 * @param value 選択した値
	 * @param index 複数値属性のインデックス
	 */
	onInput(value: any, index: number): void {
		if (!this.formControl) {
			return;
		}
		this.formControl.setValue(this.value[index]);
		this.formControl.markAsDirty();
	}

	/**
	 * クリアボタンクリックイベントハンドラ.
	 * @param event イベント
	 * @param calendar 選択したカレンダー
	 * @param index 複数値属性のインデックス
	 */
	onClickClear(value, calendar, index) {
		if (!this.formControl) {
			return;
		}
		let crrentDate = new Date();
		calendar.currentMonth = crrentDate.getMonth();
		calendar.currentYear = crrentDate.getFullYear();

		// update the form
		this.value[index] = '';
		this.formControl.setValue(this.value[index]);
		this.formControl.markAsDirty();
	}

	/**
	 * 今日ボタンクリックイベントハンドラ
	 * @param value 選択した値
	 * @param calendar 選択したカレンダー
	 * @param index 複数値属性のインデックス
	 */
	onClickToday(value, calendar, index): void {
		if (!this.formControl) {
			return;
		}
		let crrentDate = new Date();
		calendar.currentMonth = crrentDate.getMonth();
		calendar.currentYear = crrentDate.getFullYear();
	}

}
