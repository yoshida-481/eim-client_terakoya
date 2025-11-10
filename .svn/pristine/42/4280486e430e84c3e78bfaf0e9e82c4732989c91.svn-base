import {
  Component, IterableDiffers, ViewChildren, Input,
  ViewContainerRef, TemplateRef,
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR, ControlValueAccessor
} from '@angular/forms';

import { EIMInputFormItemComponent } from '../input-form-item.component';

/**
 * リッチテキスト入力フォームアイテムコンポーネント
 * @example
 *      <eim-rich-text-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          maxlength="255"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-rich-text-input-form-item>
 */
@Component({
    selector: 'eim-rich-text-input-form-item',
    templateUrl: './rich-text-input-form-item.component.html',
    styleUrls: ['./rich-text-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMRichTextInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMRichTextInputFormItemComponent extends EIMInputFormItemComponent {

	/** エディタコンポーネント */
	@ViewChildren('editor')
		editor: any;

	/**
	 * コンストラクタです.
	 */
	constructor(protected differs: IterableDiffers) {
    super(differs);
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

		if (event.range != null || !event.oldRange) {
			// フォーカスアウト以外は処理しない
			return;
		}

		if (this.value == this.formControls[index].value) {
			// 変更がなければ処理しない
			return;
		}

		let prevValue = this.value[index];

		this.formControls[index].setValue(this.value[index]);

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}
}
