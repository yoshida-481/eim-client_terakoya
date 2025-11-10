import { Component, Input, forwardRef, ViewChild, ElementRef, IterableDiffers, Output, EventEmitter, ViewChildren, QueryList, IterableChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { EIMTextInputFormItemComponent } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMInputFormItemComponentChangedEmitValueDomain } from '../input-form-item.component';

/**
 * 数値入力のコンポーネントです.
 * フォーカスイン中の値は不定です.dirtyは更新しますが正しい値が確定するのはフォーカスアウト時となります.
 * @example
 *
 *      <eim-number-input-form-item
 *          [maxlength]="maxlength"
 *          [restriction]="restriction"
 *          [readonly]="readonly"
 *      ></eim-number-input-form-item>
 */
@Component({
    selector: 'eim-number-input-form-item',
    templateUrl: './number-input-form-item.component.html',
    styleUrls: ['./number-input-form-item.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => EIMNumberInputFormItemComponent),
        },
    ],
    standalone: false
})
export class EIMNumberInputFormItemComponent extends EIMTextInputFormItemComponent {

	/** 入力エレメント */
	@ViewChildren('input')
	public input: QueryList<ElementRef>;

	// ** 最大文字数 */
	@Input() public maxlength: number;
	//public maxlength: number; // 整数の場合は15桁

	/** 制限パターン */
	@Input() public restriction = '';

	/** カンマ区切り表示するかどうか */
	@Input() public enableSeparate: boolean;

	/** 属性タイプの型 */
	@Input() public valueType: string;

	/** 最小数 */
	@Input() public minValue: number = Number.MIN_VALUE;

	/** 最大数 */
	@Input() public maxValue: number = Number.MAX_VALUE;

	/** 選択値変更イベントエミッタ */
	@Output() public changed: EventEmitter<any> = new EventEmitter<any>();

	public displayValues: string[] = [];

	/** 入力内容初期化時の値(''だと画面に反映できないため)  */
	static readonly CLEARED_DISPLAY_VALUE = ' ';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected differs: IterableDiffers,
		protected decimalPipe: DecimalPipe,
		protected elementRef: ElementRef,
		protected translateService: TranslateService
	) {
		super(differs, translateService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 値をコンポーネントに書き込みます.
	 * ControlValueAccessorの実装です.
	 * @param value 更新後の値
	 */
	writeValue(value: string): void {
		super.writeValue(value);

		if (this.value === undefined) {
			return;
		}
		if (!this.value) {
			return;
		}
		if (!this.value.length) {
			return;
		}

		this.displayValues = [];
		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i] !== undefined && this.value[i] !== null) {
				if ( this.value[i] === '') {
					this.displayValues.push('');
				} else {
					this.displayValues.push(this.convertCommaNumber(Number(this.value[i])));
				};
			} else {
				this.displayValues.push('');
			}
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * ペースト時のイベントハンドラです.
	 * @param event イベント
	 * @param index 属性値インデックス
	 */
	onPaste(event: any, index: number): void {

		// 親のペースト時のイベントハンドラを呼びdirtyを付与
		super.onPaste(event, index);

		// ペースト対象の文字列
		let pasteStr = (event.clipboardData).getData('text');

		// 変更後の値
		let newValue = this.getChangedValue(index, pasteStr);

		// カンマ除去して判定
		let removeCommaNewValue = newValue.split(',').join('');
		if (isNaN(Number(removeCommaNewValue))) {
			// 数値フォーマットでない場合、元に戻す
			event.preventDefault();
			return;
		}

		// 使用できない文字列を使用していないかチェック
		if (!this.isValidValue(removeCommaNewValue)) {
			event.preventDefault();
			return;
		}

		// 文字列長判定
		if (removeCommaNewValue && removeCommaNewValue.length > Number(this.maxlength)) {
			// 最大文字列長を超えた場合、元に戻す
			event.preventDefault();
			return;
		}

		// 不要な文字が含まれる場合、除去後に数値に直す
		if (removeCommaNewValue && newValue && this.removeInvalidCharactor(removeCommaNewValue).length !== newValue.length) {
			this.displayValues[index] = Number(this.removeInvalidCharactor(removeCommaNewValue)) + '';
			event.preventDefault();
			return;
		}

		// 数値に直す（例 010→10）
		if (newValue !== (Number(newValue) + '')) {
			this.displayValues[index] = Number(this.removeInvalidCharactor(removeCommaNewValue)) + '';
			event.preventDefault();
			return;
		}
	}

	/**
	 * キープレス時のイベントハンドラです.
	 * IME OFFの場合のみハンドルします.
	 * @param event イベント
	 * @param index 属性値インデックス
	 */
	onKeyPress(event: any, index: number): void {

		// 親のキープレス時のイベントハンドラを呼びdirtyを付与
		super.onKeyPress(event, index);

		// 変更前の値
		const nowValue = this.removeInvalidCharactor(event.target.value);

		// 変更後の値
		const newValue = this.getChangedValue(index, event.key);

		// 使用できない文字列を使用していないかチェック
		if (!this.isValidValue(event.key)) {
			event.preventDefault();
			return;
		}

		// 文字列長判定
		if (newValue && newValue.length > Number(this.maxlength)) {
			// 最大文字列長を超えた場合、元に戻す
			event.preventDefault();
			return;
		}

		if (event.charCode === 45 && nowValue.indexOf('-') !== -1) {
			// マイナス重複
			event.preventDefault();
			return;
		}

		if (event.charCode === 46 && nowValue.indexOf('.') !== -1) {
			// 小数点重複
			event.preventDefault();
			return;
		}

		if (this.isInvalidNumber(newValue)) {
			// 数値フォーマットでない場合、元に戻す
			event.preventDefault();
			return;
		}

		const newValueNum = Number(newValue);
		if (newValueNum < this.minValue || this.maxValue < newValueNum) {
			// 数値範囲外の場合、元に戻す
			event.preventDefault();
			return;
		}
	}

	/**
	 * フォーカスイン時のイベントハンドラです.
	 * カンマ付きの表示をカンマ無しに変更します.
	 * @param event イベント
	 * @param index 属性値インデックス
	 */
	onFocusIn(event: any, index: number): void {
		let displayValue = this.displayValues[index];
		if (displayValue === EIMNumberInputFormItemComponent.CLEARED_DISPLAY_VALUE) {
			this.displayValues[index] = '';
		}
		if (displayValue) {
			this.displayValues[index] = this.displayValues[index].split(',').join('');
		}

	}

	/**
	 * フォーカスアウト時のイベントハンドラです.
	 * バンドル変数に反映し、表示をカンマ付きに変更します.
	 * @param event イベント
	 * @param index 属性値インデックス
	 */
	onFocusOut(event: any, index: number): void {

		let displayValue = event.target.value;

		// 変更後の値
		const newValue = this.removeInvalidCharactor(displayValue);

		if (newValue === '' || newValue === null || this.isInvalidNumber(newValue)) {

			this.value[index] = '';
			this.displayValues[index] = EIMNumberInputFormItemComponent.CLEARED_DISPLAY_VALUE;
			this.formControls[index].setValue('');

			this.formControls[index].markAsDirty();
			return;
		}

		this.value[index] = Number(newValue);

		if (this.enableSeparate) {
			// カンマセパレータ追加
			let num = this.convertCommaNumber(this.value[index]);
			if (this.value[index] !== null && num != null) {
				this.displayValues[index] = num + '';
			}
		}
		// 選択値変更イベントをエミット
		this.changed.emit({event: event, index: index});

		this.formControls[index].markAsDirty();

	}

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

		this.value[index] = event.currentTarget.value;
		this.formControls[index].setValue(this.value[index]);
		this.formControls[index].markAsDirty();

		// 属性値を数値に変換
		let emitValue: EIMInputFormItemComponentChangedEmitValueDomain = this.createChangedEmitValue(this, event, index, prevValue);
		if (emitValue.currentValue !== null) {
			emitValue.currentValue = Number(emitValue.currentValue);
		}
		if (emitValue.previousValue !== null) {
			emitValue.previousValue = Number(emitValue.previousValue);
		}
		this.changed.emit(emitValue);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 値変更時のコールバック関数です.
	 * @param changes 変更内容
	 */
	 protected changeValue(changes: IterableChanges<any>): void {
		if (!this.value || this.value.length !== this.displayValues.length) {
			return;
		}

		for (let i = 0; i < this.value.length; i++) {
			this.displayValues[i] = '';
			if (this.value[i] !== null) {
				this.displayValues[i] = this.convertCommaNumber(this.value[i]) + '';
			}
		}
		return;
	}

	/**
	 * 画面に表示されている値を返却します.
	 * @param index 属性値インデックス
	 * @return 画面に表示されている値
	 */
	protected getValue(index: number): any {
		if (!this.input) {
			return null;
		}
		let ef: ElementRef = this.input.toArray()[index];
		if (ef && ef.nativeElement) {
			return ef.nativeElement.value;
		}
		return null;
	}

	/**
	 * カンマ付きの数値に変換して返却します.
	 * @param value 値
	 * @return カンマ付きの数値
	 */
	protected convertCommaNumber(value: number): string {
		if (this.restriction.indexOf('.') !== -1) {
			// 実数の場合
			return this.decimalPipe.transform(value, '1.1-15');
		}
		return this.decimalPipe.transform(value);
	}

	/**
	 * 入力文字列が数値ではないかを返却します.
	 * @param value 入力文字列
	 * @return 数値ではない場合true
	 */
	protected isInvalidNumber(value: string): boolean {
		if (value && value.indexOf('-') === 0 && this.restriction.indexOf('\\-') === 0) {
			return false;
		}
		const num = Number(this.removeInvalidCharactor(value));
		if (isNaN(num)) {
			return true;
		}
		return Number(value) !== Number(num);
	}

	/**
	 * 入力文字が制限されていない文字かどうかを返却します.
	 * @param charCode 文字コード
	 * @param index 属性値インデックス
	 * @return 制限されていない文字、かつ最大文字数以内の場合true
	 */
	protected isValidValue(value: string): boolean {
		let regex = new RegExp('[' + this.restriction + ']*');
        let numberValues = regex.exec(value);
        if (numberValues === null || numberValues[0] !== value) {
            return false;
        }
        return true;
	}

	/**
	 * 制限文字を削除して返却します.
	 * @param newValue 設定する文字列
	 */
	protected removeInvalidCharactor(newValue: string): string {
		if (newValue) {
			// 許容文字以外削除
			let restriction = new RegExp('[^' + this.restriction + ']', 'g');
			newValue = newValue.replace(restriction, '');
		}

		// ハイフン除去
		let isMunus = false;
		if (newValue && newValue.indexOf('-') === 0 && this.restriction.indexOf('\\-') === 0) {
			isMunus = true;
		}
		newValue = newValue.split('-').join('');
		if (isMunus) {
			newValue = '-' + newValue;
		}

		if (newValue) {
			// 許容文字数以降削除
			newValue = newValue.substr(0, this.maxlength);
		}

		return newValue;
	}

	/**
	 * 変更後の値を返却します.
	 * @param index 属性値インデックス
	 * @param replaceStr 置き換え文字列
	 */
	protected getChangedValue(index: number, replaceStr: string): string {
		let ef: ElementRef = this.input.toArray()[index];
		const activeElement: any = ef.nativeElement;
		let nowValue = activeElement.value;
		return nowValue.substring(0, activeElement.selectionStart) + replaceStr + nowValue.substring(activeElement.selectionEnd, nowValue.length);
	}
}
