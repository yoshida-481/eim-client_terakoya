import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { EIMSearchInputFormItemComponent } from '../search-input-form-item.component';

/**
 * テキスト検索条件入力フォームアイテムコンポーネント
 * @example
 *      <eim-text-search-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [options]="option"
 *          inputType]="text"
 *          [label]="label"
 *          [required]="true"
 *          maxlength="255"
 *          pattern=""
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-text-search-input-form-item>
 */
@Component({
    selector: 'eim-text-search-input-form-item',
    templateUrl: './text-search-input-form-item.component.html',
    styleUrls: ['./text-search-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMTextSearchInputFormItemComponent, multi: true },
    ],
    standalone: false
})
export class EIMTextSearchInputFormItemComponent extends EIMSearchInputFormItemComponent {

	/**
	 * コンストラクタです.
	 */
	constructor() {
		super();
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onChange(event, index) {
		if (this.formControl == null) {
			return;
		}

		if (this.inputType == 'number') {
			// 数値の場合は指定長さで切り捨て
			this.value[index] = event.currentTarget.value.substr(0, this.maxlength);
		} else {
			this.value[index] = event.currentTarget.value;
		}

		// update the form
		this.formControl.setValue(this.value[index]);
		this.formControl.markAsDirty();
	}
}
