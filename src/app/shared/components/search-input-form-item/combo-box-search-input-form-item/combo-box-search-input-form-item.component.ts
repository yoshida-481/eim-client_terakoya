import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { EIMSearchInputFormItemComponent } from '../search-input-form-item.component';

/**
 * コンボボックス検索条件入力フォームアイテムコンポーネント
 * @import
 *    import { EIMSearchComboBoxInputFormItemComponent } from 'app/shared/components/search-input-form-item/search-input-form-item.module';
 * @example
 *
 *      <eim-combo-box-search-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="false"
 *          [disabled]="false"
 *          [multiple]="false"
 *          [options]="options">
 *      </eim-combo-box-search-input-form-item>
 */
@Component({
    selector: 'eim-combo-box-search-input-form-item',
    templateUrl: './combo-box-search-input-form-item.component.html',
    styleUrls: ['./combo-box-search-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMSearchComboBoxInputFormItemComponent, multi: true },
    ],
    standalone: false
})
export class EIMSearchComboBoxInputFormItemComponent extends EIMSearchInputFormItemComponent {

	/** コンボボックスに表示する項目情報配列 */
	@Input() public options: any[] = [];

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
		if (value != null && value[0] === undefined) {
			value.splice(0, value.length);
			value.push(this.options[0].value);
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
		if (this.formControl == null) {
			return;
		}
		// update the form
		this.value[index] = event.value;
		this.formControl.setValue(this.value[index]);
		this.formControl.markAsDirty();
	}

}
