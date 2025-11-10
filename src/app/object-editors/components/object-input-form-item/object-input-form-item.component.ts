import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, UntypedFormControl, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent } from 'app/shared/shared.interface';

import { EIMSearchInputFormItemComponent } from 'app/shared/components/search-input-form-item/search-input-form-item.component';
import { EIMObjectEditorDialogManagerComponentService } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * 関連ドキュメント入力フォームアイテムコンポーネント
 * @example
 *      <eim-object-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-object-input-form-item>
 */
@Component({
    selector: 'eim-object-input-form-item',
    templateUrl: './object-input-form-item.component.html',
    styleUrls: ['./object-input-form-item.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMObjectInputFormItemComponent) },
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMObjectInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMObjectInputFormItemComponent extends EIMSearchInputFormItemComponent {

	protected itemsForLoop: any[] = [];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService
	) {
		super();
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
			if (this.value.length === 0) {
				this.value.push({id: undefined, name: ''});
			}
		} else {
			this.value = [value];
		}

		this.itemsForLoop = [];
		for (let i = 0; i < this.value.length; i++) {
			this.itemsForLoop.push(this.value[i].name);
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

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * コンテンツ選択画面表示ボタンクリックイベントハンドラ
	 * @param index インデックス
	 */
	onClickContentsSingleSelector(index: number): void {

		// 単数の場合
		let dialogId: string = this.objectEditorDialogManagerComponentService.showObjectSelector(
			{
				selected: (data: any) => {
					this.objectEditorDialogManagerComponentService.close(dialogId);
					this.itemsForLoop[index] = data.name + '[' + data.id + ']';
					this.value[index] = {id: data.id, name: this.itemsForLoop[index]};
					this.onChange();
				}
			}
		);
	}

	/**
	 * ファイル削除クリック時イベントハンドラです.
	 * @param index インデックス
	 */
	onClickDelete(index: number): void {
		this.itemsForLoop[index] = '';
		this.value[index] = {id: null, name: ''};
		this.onChange();
	}

	/**
	 * 入力内容変更イベントハンドラです.
	 */
	onChange(): void {
		this.formControl.setValue(this.value[0]);
		this.formControl.markAsDirty();
	}


	/**
	 * プラスクリック時のハンドラです。
	 * 該当入力行の直下に新しい入力行を挿入します。
	 * dirty扱いとなります。
	 * @param index インデックス
	 */
	onPlusClick(index: number) {
		this.value.splice(index + 1, 0, {id: null, name: ''});
		this.itemsForLoop.splice(index + 1, 0, '');
		let formControl = new UntypedFormControl(this.value[index + 1], Validators.compose(this.validators));

		// フォームに追加する際、既存のインデックスを含むキーを更新する
		let prefix: string = this.name + '_';
		let keys: string[] = this.getFormControlKeysByPrefix(prefix);
		keys.sort(function(a, b) {
			if ( a > b ) { return -1 };
			if ( a < b ) { return 1 };
			return 0;
		});
		for (let i = 0; i < keys.length; i++) {
			let preIndex: number = Number(keys[i].slice(prefix.length));
			if (preIndex > index) {
				// 追加する位置より下のkeyを更新する
				this.form.setControl(prefix + (preIndex + 1), this.form.controls[prefix + preIndex]);
				this.form.removeControl(prefix + preIndex);
			}
		}
		this.form.addControl(prefix + (index + 1), formControl);

		this.formControl.markAsDirty();
	}

	/**
	 * マイナスクリック時のハンドラです。
	 * 該当入力行を削除します。
	 * dirty扱いとなります。
	 * @param index インデックス
	 */
	onMinusClick(index: number) {
		if (this.value.length > 1) {
			// コントローラ入れ替え
			let prefix: string = this.name + '_';
			for (let i = 0; i < this.value.length; i++) {
				if (index < i) {
					this.form.setControl(prefix + (i - 1), this.form.controls[prefix + i]);
				}
			}
			this.form.removeControl(prefix + (this.value.length - 1));

			this.value.splice(index, 1);
			this.itemsForLoop.splice(index, 1);

			this.formControl.markAsDirty();
		}
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
