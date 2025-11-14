import { Component, IterableDiffers, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor,
	Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { SelectItem } from 'primeng/api'

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMDialogSharedManagerComponentService } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';

import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMResponsibleObjectRoleSingleSelectorComponentService } from '../responsible-object-role-selector/responsible-object-role-single-selector.component.service';
import { EIMResponsibleObjectRoleMultipleSelectorComponentService } from '../responsible-object-role-selector/responsible-object-role-multiple-selector.component.service';
import { EIMObjectRoleDomain } from 'app/shared/domains/entity/object-role.domain';

/**
 * 担当業務役割入力フォームアイテムコンポーネント
 * @example
 *      <eim-responsible-object-role-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-responsible-object-role-input-form-item>
 */
@Component({
	selector: 'eim-responsible-object-role-input-form-item',
	templateUrl: './responsible-object-role-input-form-item.component.html',
	styleUrls: ['./responsible-object-role-input-form-item.component.scss'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: EIMResponsibleObjectRoleInputFormItemComponent, multi: true}
	],
	standalone: false
})
export class EIMResponsibleObjectRoleInputFormItemComponent extends EIMInputFormItemComponent {

	/** 画面表示役割情報配列 */
	public objectRoleSelectItems: SelectItem[] = null;
	/** 選択したユーザのID配列 */
	public selectedData: number[] = [];
	/** 表示中のダイアログ名 */
	public viewDialogName = null;
	/** オブジェクトロール情報リスト */
	public selectedObjectRoles: EIMObjectRoleDomain[] = null;
	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public responsibleObjectRoleSingleSelectorComponentService: EIMResponsibleObjectRoleSingleSelectorComponentService,
		public responsibleObjectRoleMultipleSelectorComponentService: EIMResponsibleObjectRoleMultipleSelectorComponentService,
		protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,
		protected differs: IterableDiffers,
	) {
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

		this.initObjectRoleSelectItems(value);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 * @param index 複数値属性のインデックス
	 */
	onChange(event) {
		// update the form
		let prevValue = this.value;

		this.formControls[0].setValue(this.value);
		this.formControls[0].markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, -1, prevValue));
	}

	/**
	 * 選択ボタン押下時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickSearch(event): void {
		if (this.multiple) {
			this.viewDialogName = 'objectRoleMultipleSelector';
		} else {
			this.viewDialogName = 'objectRoleSingleSelector';
		}
	}

	public onSelectedObjectRole(objectRoles: EIMObjectRoleDomain[]): void {

		this.selectedObjectRoles = objectRoles;

		this.viewDialogName = null;

		this.value.splice(0);
		this.objectRoleSelectItems = [];
		for (let objectRole of objectRoles) {
			this.value.push(objectRole.id);
			this.objectRoleSelectItems.push(this.convertObjectRoleToSelectItem(objectRole));
		}

		this.onChange(null);
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

		let deleteIndex = -1;
		for (let i = 0; i < this.value.length; i++) {
			let objectRoleId: number = this.value[i];
			if (objectRoleId === id) {
				deleteIndex = i;
			}
		}
		this.value.splice(deleteIndex, 1);
		this.objectRoleSelectItems.splice(deleteIndex, 1);
		this.selectedObjectRoles.splice(deleteIndex, 1);
		this.onChange(event);
	}

	/**
	 * ダイアログクローズ時のイベントハンドラです.
	 */
	public onCloseDialog() {
		this.viewDialogName = null;
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
	    return this.value.length == 0 ? {'required': {value: control.value}} : null;
	  };
	}

	/**
	 * 初期表示時に選択アイテムを設定します.
	 * @param objectRoles マスタ情報
	 */
	private initObjectRoleSelectItems(objectRoleIds: number[]): void {
		this.objectRoleSelectItems = [];

		// this.valueには選択済みのオブジェクトロールIDリストが設定されている
		for (let i = 0; i < objectRoleIds.length; i++) {

			let objectRoleId = objectRoleIds[i];
			if (objectRoleId === undefined) {
				continue;
			}

			// コンポーネント初期化時に受け取ったオブジェクトロール情報取得
			let targetObjectRole: EIMObjectRoleDomain = {id: objectRoleId, name: null};
			if (!this.selectedObjectRoles) {
				this.objectRoleSelectItems.push(this.convertObjectRoleToSelectItem(targetObjectRole));
				continue;
			}
			for (let j = 0; j < this.selectedObjectRoles.length; j++) {

				let objectRole = this.selectedObjectRoles[j];
				if (objectRole.id === objectRoleId) {
					targetObjectRole = objectRole;
				}
			}
			this.objectRoleSelectItems.push(this.convertObjectRoleToSelectItem(targetObjectRole));
		}
	}

	/**
	 * オブジェクトロール情報を選択アイテム情報に変換します.
	 *
	 * @param objectRole オブジェクトロール情報
	 * @returns 選択アイテム情報
	 */
	private convertObjectRoleToSelectItem(objectRole: EIMObjectRoleDomain): SelectItem {

		return {label: objectRole?.name ?? '', value: objectRole};
	}

	/**
	 * 既存のマスタ情報と、指定のマスタ情報に変更があるかどうかを返却します.
	 * @param newValue 選択されたマスタ情報
	 * @return 変更があるかどうか
	 */
	private isChange(newValue: any[]): boolean {
		if (this.value.length != newValue.length) {
			return true;
		}

		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i].id != newValue[i].id) {
				return true;
			}
		}
		return false;

	}
}
