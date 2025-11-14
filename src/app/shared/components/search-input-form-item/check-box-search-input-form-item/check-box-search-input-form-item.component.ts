import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { EIMSearchInputFormItemComponent } from '../search-input-form-item.component';

/**
 * チェックボックス検索条件入力フォームアイテムコンポーネント
 * 複数値での使用が前提のため、multipleの値は無視します.
 * @import
 *    import { EIMSearchCheckBoxInputFormItemComponent } from 'app/shared/components/search-input-form-item/search-input-form-item.module';
 * @example
 *
 *      <eim-check-box-searchinput-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="false"
 *          [disabled]="false"
 *          [multiple]="false"
 *          [options]="options">
 *      </eim-check-box-input-form-item>
 */
@Component({
    selector: 'eim-check-box-search-input-form-item',
    templateUrl: './check-box-search-input-form-item.component.html',
    styleUrls: ['./check-box-search-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMSearchCheckBoxInputFormItemComponent, multi: true },
    ],
    standalone: false
})
export class EIMSearchCheckBoxInputFormItemComponent extends EIMSearchInputFormItemComponent {

	public checkValue: boolean;

	/**
	 * コンストラクタです.
	 */
	constructor() {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 値をコンポーネントに書き込みます.
	 *
	 * @param value 値
	 */
	public writeValue(value: any) {
		// 初期状態を設定
		if (value !== undefined && value != null) {
			if (value[0] == 1) {
				this.checkValue = true;
			} else {
				this.checkValue = false;
			}
		}

		super.writeValue(value, {});
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onChange(event, index) {
		if (this.checkValue) {
			this.value[index] = 1;
		} else {
			this.value[index] = 0;
		}

		this.formControl.setValue(this.value);
		this.formControl.markAsDirty();
	}
}
