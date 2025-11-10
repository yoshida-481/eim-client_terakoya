import {
	Component, IterableDiffers, Input, SimpleChange,
	ViewContainerRef, TemplateRef,
} from '@angular/core';

import {
	NG_VALUE_ACCESSOR, ControlValueAccessor
} from '@angular/forms';

import { EIMInputFormItemComponent } from '../input-form-item.component';

/**
 * チェックボックス入力フォームアイテムコンポーネント
 * 複数値での使用が前提のため、multipleの値は無視します.
 * @import
 *    import { EIMCheckBoxInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.module';
 * @example
 *
 *      <eim-check-box-input-form-item
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
    selector: 'eim-check-box-input-form-item',
    templateUrl: './check-box-input-form-item.component.html',
    styleUrls: ['./check-box-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMCheckBoxInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMCheckBoxInputFormItemComponent extends EIMInputFormItemComponent {

	/** チェックボックスに表示する項目情報配列 */
	@Input() public options: any[] = [];

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	protected selectedValues: any[];

	/**
	 * コンストラクタです.
	 */
	constructor(protected differs: IterableDiffers) {
		super(differs);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 値をコンポーネントに書き込みます.
	 * ControlValueAccessorの実装です.
	 * @param value 値
	 */
	public writeValue(value: any) {
		super.writeValue(value, {});

		// p-checkboxのngModelはチェックを変更するたび、valueのポインタを変更している
		// そのため、データの変更が途切れてしまう
		// シャローコピーしたデータを使用し、変更時onChangeにて設定し直す
		this.selectedValues = [].concat(value);
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
		// update the form
		let prevValue = this.value[index];

		this.value.splice(0, this.value.length);
		// シャローコピーする
		// concatでもポインタが変わってしまうため手動でコピーする
		for (let i = 0; i < this.selectedValues.length; i++) {
			this.value.push(this.selectedValues[i]);
		}

		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}
}
