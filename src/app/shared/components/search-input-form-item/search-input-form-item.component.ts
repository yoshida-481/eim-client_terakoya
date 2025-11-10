import { Component, Input, ViewContainerRef, TemplateRef, forwardRef, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, ValidatorFn } from '@angular/forms';

const noop = () => {
};

@Component({
    selector: 'eim-search-input-form-item',
    templateUrl: './search-input-form-item.component.html',
    styleUrls: ['./search-input-form-item.component.css'],
    standalone: false
})
export class EIMSearchInputFormItemComponent implements ControlValueAccessor, OnDestroy {

	/** フォームグループ */
	@Input() public form: UntypedFormGroup;

	/** 名称 */
	@Input() public name = '';

	/** ラベル文言 */
	@Input() public label = '';

	/** タイプ */
	@Input() public inputType = 'text';

	/** 必須かどうか */
	@Input() public required = false;

	/** 最大入力可能バイト数 */
	@Input() public maxlength = 524288;

	/** 入力フォーマット */
	@Input() public pattern: string;

	/** 無効かどうか */
	@Input() public disabled = false;

	/** 複数値属性かどうか */
	@Input() public multiple = false;

	/** 編集したかどうか */
	@Input() public dirty = false;

	/** 入力値 */
	public value: any;

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	/** フォームコントロール */
	protected formControl: UntypedFormControl = null;
	/** バリデータ */
	protected validators: ValidatorFn[] = [];

	/**
	 * コンストラクタです.
	 */
	constructor() {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 値をコンポーネントに書き込みます.
	 * ControlValueAccessorの実装です.
	 * @param value 値
	 * @param initValue 複数コンポーネントで未入力の場合に設定する初期値
	 */
	public writeValue(value: any, initValue?: any) {
		if (value === undefined) {
			return;
		}

		if (value == null) {
			this.value = [];
		} else if (Array.isArray(value)) {
			this.value = value;
		} else {
			this.value = [value];
		}


		if (value && this.form) {
			if (!value.length) {
				value = [value];
			}
			this.setValidators();

			let formControl = new UntypedFormControl(this.value, Validators.compose(this.validators));
			this.formControl = formControl;
			this.form.addControl(this.name, formControl);
			if (this.dirty) {
				formControl.markAsDirty();
			}
		}
	}

	/**
	 * 値変更時のハンドラを登録します.
	 * 本コンポーネントでは何も登録しません.
	 * ControlValueAccessorの実装です.
	 */
	public registerOnChange(fn: (value: any) => void) {
	}

	/**
	 * タッチ時のハンドラを登録します.
	 * 本コンポーネントでは何も登録しません.
	 * ControlValueAccessorの実装です.
	 */
	public registerOnTouched(fn: any) {
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.form) {
			return;
		}

		this.form.removeControl(this.name);
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

		// update the form
		this.value[index] = event.currentTarget.value;
		this.formControl.setValue(this.value[index]);
		this.formControl.markAsDirty();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 最大値のバリデータを設定します.
	 */
	protected setValidators(): void {
		if (this.maxlength) {
			this.addValidators(Validators.maxLength(this.maxlength));
		}
	}

	/**
	 * バリデータを追加します.
	 * @param validator 追加するバリデータ
	 */
	protected addValidators(validator: ValidatorFn): void {
		this.validators.push(validator);
	}

	/**
	 * フォームから該当属性のフォームコントローラのキー一覧を返却します.
	 * @param prefix キーの接頭辞
	 * @return フォームコントローラのキー一覧
	 */
	protected getFormControlKeysByPrefix(prefix: string): string[] {
		let retKeys: string[] = [];

		let allKeys: string[] = Object.keys(this.form.controls);
		for (let i = 0; i < allKeys.length; i++) {
			if (allKeys[i].startsWith(prefix)) {
				retKeys.push(allKeys[i]);
			}
		}
		return retKeys;
	}
}
