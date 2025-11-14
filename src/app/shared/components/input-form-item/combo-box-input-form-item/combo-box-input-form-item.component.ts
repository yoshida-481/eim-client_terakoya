import {
	Component, IterableDiffers, Input,
	ViewContainerRef, TemplateRef, Output, EventEmitter,
} from '@angular/core';

import {
	NG_VALUE_ACCESSOR, ControlValueAccessor
} from '@angular/forms';

import { EIMInputFormItemComponent } from '../input-form-item.component';

/**
 * コンボボックス入力フォームアイテムコンポーネント
 * @import
 *    import { EIMComboBoxInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.module';
 * @example
 *
 *      <eim-combo-box-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="false"
 *          [disabled]="false"
 *          [multiple]="false"
 *          [options]="options">
 *      </eim-combo-box-input-form-item>
 */
@Component({
    selector: 'eim-combo-box-input-form-item',
    templateUrl: './combo-box-input-form-item.component.html',
    styleUrls: ['./combo-box-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMComboBoxInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMComboBoxInputFormItemComponent extends EIMInputFormItemComponent {

	/** コンボボックスに表示する項目情報配列 */
	@Input() public options: any[] = [];

	/** 選択値変更イベントエミッタ */
	@Output() public changed: EventEmitter<any> = new EventEmitter<any>();

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
		// 初期値はvalueに値が入ってくるのでsuper.writeValueの第2引数は使用していない
		super.writeValue(value, null);
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
		if (!this.formControls[index]) {
			return;
		}
		// update the form
		let prevValue = this.value[index];

		if (event.value === null) {
			this.value[index] = "";
		} else {
			this.value[index] = event.value;
		}
		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}

}
