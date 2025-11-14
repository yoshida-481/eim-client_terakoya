import {
	Component, IterableDiffers, Input, SimpleChange,
	ViewContainerRef, TemplateRef, Output, EventEmitter
} from '@angular/core';

import { FormGroup, FormControl, NgForm, NG_VALUE_ACCESSOR, ControlValueAccessor,
	Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { EIMInputFormItemComponent } from '../input-form-item.component';

/**
 * ラジオボタン入力フォームアイテムコンポーネント
 * 単数値での使用が前提のため、multipleの値は無視します.
 * @import
 *    import { EIMCheckBoxInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.module';
 * @example
 *
 *      <eim-radio-button-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="false"
 *          [disabled]="false"
 *          [multiple]="false"
 *          [options]="options">
 *      </eim-radio-button-input-form-item>
 */
@Component({
    selector: 'eim-radio-button-input-form-item',
    templateUrl: './radio-button-input-form-item.component.html',
    styleUrls: ['./radio-button-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMRadioButtonInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMRadioButtonInputFormItemComponent extends EIMInputFormItemComponent {

	/** ラジオボタンに表示する項目情報配列 */
	@Input() public options: any[] = [];

	/** 選択値変更イベントエミッタ */
	@Output() public changed: EventEmitter<any> = new EventEmitter<any>();

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl  = true;

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
	}

	/**
	 * 選択値を返却します.
	 * @return 選択値
	 */
	get selectedValue(): any {
		return this.value[0];
	}

	/**
	 * 選択値を設定します.
	 * @param 選択値
	 */
	set selectedValue(value: any) {
		const prevValue = this.value[0];
		this.value[0] = value;
		this.formControls[0].setValue(this.value);
		this.formControls[0].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, null, 0, prevValue));
	}
}
