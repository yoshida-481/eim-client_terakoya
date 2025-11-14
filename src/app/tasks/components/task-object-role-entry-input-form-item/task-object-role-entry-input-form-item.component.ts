import { Component, IterableDiffers, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor,
	Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { SelectItem } from 'primeng/api'

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMDialogSharedManagerComponentService} from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';

import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMSelectTarget } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { TranslateService } from '@ngx-translate/core';

/**
 * 担当業務役割入力フォームアイテムコンポーネント
 * @example
 *      <eim-task-object-role-entry-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-task-object-role-entry-input-form-item>
 */
@Component({
	selector: 'eim-task-object-role-entry-input-form-item',
	templateUrl: './task-object-role-entry-input-form-item.component.html',
	styleUrls: ['./task-object-role-entry-input-form-item.component.scss'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: EIMTaskObjectRoleEntryInputFormItemComponent, multi: true}
	],
	standalone: false
})
export class EIMTaskObjectRoleEntryInputFormItemComponent extends EIMInputFormItemComponent {

	/** エントリ設定対象のオブジェクトID */
	public targetObjectId: number;

	/** エントリ情報配列 */
	public entries: SelectItem[];
	/** 選択したユーザのID配列 */
	public selectedData: number[] = [];
	/** 表示中のダイアログ名 */
	public viewDialogName = null;
	/** エントリ選択済み一覧のカラムリスト */
	public columns: EIMDataGridColumn[] = [];
	/** エントリ一覧選択対象 */
	public selectTarget: EIMSelectTarget = {
		user: true,
		group: true,
		role: false,
		compGroup: false,
		userDefGroup: false,
	}
	public destination = [];


	/** 複数値の場合でもフォームコントロールを1つにするかどうか */
	protected isSingleFormControl = true;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,
			protected differs: IterableDiffers,
			protected translateService: TranslateService) {
		super(differs);

		this.columns.push({
			field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 145, suppressFilter: true
		});
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

		this.setMasterSelectItem(value);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラです.
	 */
	ngOnInit(): void {
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
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
		this.viewDialogName = 'entrySelector';
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
			let master: EIMObjectDomain = this.value[i];
			if (master.id == id) {
				deleteIndex = i;
			}
		}
		this.value.splice(deleteIndex, 1);
		this.entries.splice(deleteIndex, 1);
		this.onChange(event);
	}

	public onSelectedEntries(entries): void {
		this.viewDialogName = null;

		this.value.splice(0);
		this.entries = [];
		for (let entry of entries) {
			this.value.push(entry);
			this.entries.push({label: entry.entryName, value: entry});
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
	 * @param masters マスタ情報
	 */
	private setMasterSelectItem(masters: EIMObjectDomain[]): void {
		this.entries = [];
		for (let i = 0; i < this.value.length; i++) {
			if (this.value[i] == '') {
				continue;
			}
			this.entries.push({label: this.getDisplayValue(this.value[i]), value: this.value[i].id});
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
