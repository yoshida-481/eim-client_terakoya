import { Component, IterableDiffers, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor,
	Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { SelectItem } from 'primeng/api'

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMDialogSharedManagerComponentService} from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';

import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMResponsibleObjectRoleSingleSelectorComponentService } from '../responsible-object-role-selector/responsible-object-role-single-selector.component.service';
import { EIMResponsibleObjectRoleMultipleSelectorComponentService } from '../responsible-object-role-selector/responsible-object-role-multiple-selector.component.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';

/**
 * 成果物保存先入力フォームアイテムコンポーネント
 * @example
 *      <eim-task-output-folder-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-task-output-folder-input-form-item>
 */
@Component({
	selector: 'eim-task-output-folder-input-form-item',
	templateUrl: './task-output-folder-input-form-item.component.html',
	styleUrls: ['./task-output-folder-input-form-item.component.scss'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: EIMTaskOutputFolderInputFormItemComponent, multi: true}
	],
	standalone:false
})
export class EIMTaskOutputFolderInputFormItemComponent extends EIMInputFormItemComponent {

	/** 画面表示役割情報配列 */
	public objectRoles: SelectItem[] = null;
	/** 選択したユーザのID配列 */
	public selectedData: number[] = [];
	/** 表示中のダイアログ名 */
	public viewDialogName = null;

	/** プロジェクトに対応するワークスペースのID */
	public workspaceId = 0;

	/** 選択パス */
	public path = '';

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

		this.setObjectRoleSelectItems(value);

		let folder: EIMSimpleObjectDTO = this.value[0];
		if (folder) {
			this.path = (folder?.attributeMap['パス']?.values[0] ?? '/') + folder.name;
		} else {
			this.path = '';
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
	onChange(event) {
		// update the form
		let prevValue = this.value;

		this.formControls[0].setValue(this.value);
		this.formControls[0].markAsDirty();
		this.form.markAsDirty();

		// 選択値変更イベントをエミット
		this.changed.emit(this.createChangedEmitValue(this, event, -1, prevValue));
	}

	/**
	 * 選択ボタン押下時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickSearch(event): void {
		this.viewDialogName = 'folderSingleSelector';
	}

	public onSelectedFolder(event): void {

		this.viewDialogName = null;

		// this.value.splice(0);
		// this.objectRoles = [];
		// for (let objectRole of objectRoles) {
		// 	this.value.push(objectRole.id);
		// 	this.objectRoles.push({label: objectRole.name, value: objectRole});
		// }
		let folder: EIMSimpleObjectDTO = event.dto;
		this.value[0] = folder;
		if (folder) {
			this.path = (folder.attributeMap['パス'].values[0] ?? '/') + folder.name;
		} else {
			this.path = '';
		}

		this.onChange(null);
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
	 * マスタを画面表示します.
	 * @param objectRoles マスタ情報
	 */
	private setObjectRoleSelectItems(objectRoles: EIMObjectDomain[]): void {
		this.objectRoles = [];

		// this.valueには選択済みのオブジェクトロールIDリストが設定されている
		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i] === undefined) {
				continue;
			}
			this.objectRoles.push({label: this.getDisplayValue(this.value[i]), value: this.value[i].id});
		}
	}

	/**
	 * 一覧に表示する値を取得します.
	 * @param object マスタ情報
	 * @return 一覧に表示する値
	 */
	private getDisplayValue(object: EIMObjectDomain): string {
		// if (!this.searchMasterDisplayConfig) {
		// 	return '';
		// }

		// let targetDefinitionName: string = this.searchMasterDisplayConfig.displayFieldAttributeType.definitionName;
		// if (targetDefinitionName == 'name') {
		// 	return object.name;
		// }

		// for (let i = 0; object.attributeList.length; i++) {
		// 	if (object.attributeList[i].attributeType.definitionName == targetDefinitionName) {
		// 		// 選択画面からの戻り値の場合
		// 		let attribute: EIMAttributeDomain | EIMAttributeDTO = object.attributeList[i];
		// 		if (attribute['valueList']) {
		// 			return String(attribute['valueList']);
		// 		}
		// 		// 初期表示の場合
		// 		return String(attribute.getValueList());
		// 	}
		// }
		return '';
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
