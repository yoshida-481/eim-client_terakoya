import { Component, IterableDiffers, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor,
	Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { EIMEntry } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';


export interface SelectEntry {
	label: string;
	value: any;
	icon: string;
}

/**
 * ワークスペース管理者入力フォームアイテムコンポーネント
 * @example
 *      <eim-workspace-administrator-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *          [readOnly]="false"
 *      >
 *      </eim-workspace-administrator-item>
 */
@Component({
    selector: 'eim-workspace-administrator-item',
    templateUrl: './workspace-administrator-item.component.html',
    styleUrls: ['./workspace-administrator-item.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: EIMWorkSpaceAdministratorItemComponent, multi: true }
    ],
    standalone: false
})
export class EIMWorkSpaceAdministratorItemComponent extends EIMInputFormItemComponent {

	/** 情報表示のみフラグ */
	@Input() readOnly = false;

	/** 画面表示ユーザ情報配列 */
	public users: SelectEntry[];

	/** 選択したユーザのID配列 */
	public selectedData: number[] = [];

	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
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

		this.setUserSelectItem();
	}

	/**
	 * 表示対象データを設定します.
	 * @param data 対象ユーザデータ
	 */
	public setData(data): void {
		let isChange: boolean = this.isChange(data);

		this.value.splice(0, this.value.length);
		Array.prototype.push.apply(this.value, data);
		this.setUserSelectItem();

		if (isChange) {
			this.onChange(event, 0);
		}
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
		this.formControls[index].setValue(this.value);
		this.formControls[index].markAsDirty();
	}

	/**
	 * 選択ボタン押下時のイベントハンドラ.
	 * @param event イベント
	 */
	onClickSearch(event): void {
		let users: EIMEntry[] = [];
		for (let i = 0; i < this.users.length; i++) {
			users.push(this.users[i].value);
		}
		let dialogId: string = this.dialogManagerComponentService.showWorkspaceAdministratorSelector(
			null,
			users,
			{
				selected: (data) => {
					this.dialogManagerComponentService.close(dialogId);
					let isChange: boolean = this.isChange(data);
					this.value.splice(0, this.value.length);
					Array.prototype.push.apply(this.value, data);
					this.setUserSelectItem();
					if (isChange) {
						this.onChange(event, 0);
						this.dirty = true;
					}
				}
			}
		);
	}

	/**
	 * 削除ボタン押下時のイベントハンドラ.
	 * @param event イベント
	 * @param id 削除対象のユーザID
	 */
	onClickDelete(event, entry?: EIMEntry): void {
		// アンカータグを使用しているため、この記述がないと前画面に遷移してしまう
		event.preventDefault();
		let id: number;
		if (entry) {
			id = entry.entryId;
		} else {
			id = this.selectedData[0];
		}

		let deleteIndex = -1;
		for (let i = 0; i < this.value.length; i++) {
			let user: EIMEntry = this.value[i];
			if (user.entryId === id) {
				deleteIndex = i;
				break;
			}
		}
		this.value.splice(deleteIndex, 1);
		this.users.splice(deleteIndex, 1);
		this.onChange(event, 0);
		this.dirty = true;
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
	 */
	private setUserSelectItem(): void {
		this.users = [];
		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i] === '') {
				continue;
			}
			// 初期描写時はEIMEntryDTOの形式で取得されるためキーを変更
			if (this.value[i].entryObjName) {
				this.value[i].entryName = this.value[i].entryObjName;
			}
			this.users.push({label: this.value[i].entryName, value: this.value[i], icon: this.getIcon(this.value[i])});
		}
	}

	/**
	 * 選択対象のアイコンを定義します.
	 * @param user 対象エントリ
	 */
	private getIcon(user: any): string {
		let rtIcon = '';
		switch (user.entryTypeId) {
			case EIMDocumentsConstantService.ENTRY_TYPE_USER:
				rtIcon = 'fa eim-icon-user fa-fw';
				break;
			case EIMDocumentsConstantService.ENTRY_TYPE_GROUP:
				rtIcon = 'fa eim-icon-group fa-fw';
				break;
			case EIMDocumentsConstantService.ENTRY_TYPE_ROLE:
				rtIcon = 'fa eim-icon-role fa-fw';
				break;
			case EIMDocumentsConstantService.ENTRY_TYPE_COMPLEX_GROUP:
				rtIcon = 'fa eim-icon-complex-group fa-fw';
				break;
		}
		return rtIcon
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
}
