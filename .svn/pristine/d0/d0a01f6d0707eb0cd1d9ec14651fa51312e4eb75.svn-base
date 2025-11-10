import { Component, Input, IterableDiffers, DoCheck, ViewContainerRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor,
	Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { SelectItem } from 'primeng/api'

import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMDialogSharedManagerComponentService } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';
import { EIMInputFormItemComponent } from '../input-form-item.component';

/**
 * ユーザ入力フォームアイテムコンポーネント
 * @example
 *      <eim-user-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-user-input-form-item>
 */
@Component({
    selector: 'eim-user-input-form-item',
    templateUrl: './user-input-form-item.component.html',
    styleUrls: ['./user-input-form-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMUserInputFormItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMUserInputFormItemComponent extends EIMInputFormItemComponent implements DoCheck {


	/** チップス */
	@ViewChild('chips', { static: true }) chips: any;

	/** 画面表示ユーザ情報配列 */
	public users: SelectItem[];
	/** 選択したユーザのID配列 */
	private selectedData: number[] = [];
	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;
	/** デフォルトチップトークン */
	protected defaultChipToken = null;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,
			protected differs: IterableDiffers) {
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
		if (value === undefined) {
			return;
		}

		if (value != null) {
			if (!Array.isArray(value)) {
				value = [value];
			}

			if (value.length === 0) {
				// 初期表示時空データの場合はngDoCheckが呼ばれない
				// ngDoCheckで初期表示完了の判定ができないため
				// ここで初期化フラグをONにする。
				this.initialized = true;
			}

			value.sort(function(a, b) {
				if ( a.code < b.code ) {
					return -1;
				}
				if ( a.code > b.code ) {
					return 1;
				}
				return 0;
			});
		}

		super.writeValue(value);

		this.setUserSelectItem(value);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 値変更検出時のハンドラです.
	 * ユーザ入力フォームアイテムコンポーネントは外からの値更新を検知して
	 * ユーザ一覧に表示できる情報に変換しています.
	 */
	ngDoCheck() {
		const change = this.differ.diff(this.value);
		if (change === null) {
			return;
		}
		if (this.value === undefined) {
			return;
		}
		if (this.initialized) {
			window.setTimeout(() => {
				if (!this.isChangedValue()) {
					return;
				}

				for (let i = 0; i < this.formControls.length; i++) {
					this.formControls[i].markAsDirty();
				}
				this.setUserSelectItem(this.value);
			});
		}
		this.initialized = true;
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	public onChange(event, index) {
		// update the form
		let prevValue = this.value[index];

		this.formControls[index].setValue(this.value);
		this.formControls[index].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, index, prevValue));
	}

	/**
	 * 選択ボタン押下時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickSearch(event): void {
		let dialogId: string;
		let callbacks = {
				selected: (data) => {
					this.deleteUndefinedToken();
					this.dialogManagerComponentService.close(dialogId);
					let isChange: boolean = this.isChange(data);

					this.value.splice(0, this.value.length);
					Array.prototype.push.apply(this.value, data);
					this.setUserSelectItem(this.value);

					if (this.value.length === 0) {
						let chips =  this.chips.el.nativeElement.children[0].children[0];
						chips.appendChild(this.defaultChipToken);
					}

					if (isChange) {
						this.onChange(event, 0);
					}
				}
		};
		if (this.multiple) {
			dialogId = this.dialogManagerComponentService.showUserMultiSelector(this.value, callbacks);
		} else {
			dialogId = this.dialogManagerComponentService.showUserSelector(callbacks);
		}
	}

	/**
	 * 削除ボタン押下時のイベントハンドラ.
	 * @param event イベント
	 * @param id 削除対象のユーザID
	 */
	public onClickDelete(event, id?: number): void {
		// アンカータグを使用しているため、この記述がないと前画面に遷移してしまう
		event.preventDefault();

		if (!id) {
			id = this.selectedData[0];
		}

		if(this.defaultChipToken == null) {
			this.deleteUndefinedToken();
		}

		let deleteIndex = -1;
		for (let i = 0; i < this.value.length; i++) {
			let user: EIMUserDTO = this.value[i];
			if (user.id === id) {
				deleteIndex = i;
			}
		}
		this.value.splice(deleteIndex, 1);
		this.users.splice(deleteIndex, 1);

		if (this.value.length === 0) {
			let chips =  this.chips.el.nativeElement.children[0].children[0];
			chips.appendChild(this.defaultChipToken);
		}

		this.onChange(event, 0);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 必須バリデータ関数を返却します.
	 * リストの件数をチェックします.
	 * @return 必須バリデータ関数
	 */
	protected requiredValidatorFn(): ValidatorFn {
	  return (control: AbstractControl): ValidationErrors | null => {
	    return this.value.length === 0 ? {'required': {value: control.value}} : null;
	  };
	}

	/**
	 * ユーザを画面表示します.
	 * @param users ユーザ情報
	 */
	private setUserSelectItem(users: EIMUserDTO[]): void {
		this.users = [];
		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i] == '') {
				continue;
			}
			this.users.push({label: this.value[i].code + ' / ' + this.value[i].name, value: this.value[i].id});
		}
	}

	/**
	 * 既存のユーザ情報と、指定のユーザ情報に変更があるかどうかを返却します.
	 * @param newValue 選択されたユーザ情報
	 * @return 変更があるかどうか
	 */
	private isChange(newValue: any[]): boolean {
		if (this.value.length !== newValue.length) {
			return true;
		}

		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i].code !== newValue[i].code) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 値が変更されたかどうかを返却します.
	 * @return 変更された場合true
	 */
	protected isChangedValue(): boolean {
		if (this.value.length !== this.users.length) {
			return true;
		}

		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i].id !== this.users[i].value) {
				return true;
			}
		}

		return false;
	}

	/**
	 *
	 */
	protected deleteUndefinedToken(): void {
		let chips =  this.chips.el.nativeElement.children[0].children[0];
		if (0 < chips.children.length) {
			for(let i=0; i<chips.children.length; i++) {
				let defaultChipToken = chips.children[i];
				if (defaultChipToken.className === 'p-autocomplete-input-chip') {
					chips.removeChild(defaultChipToken);
					this.defaultChipToken = defaultChipToken;
					break;
				}
			}
		}
	}

}
