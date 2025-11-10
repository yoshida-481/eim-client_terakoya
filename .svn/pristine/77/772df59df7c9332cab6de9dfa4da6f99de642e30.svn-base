import { Component, EventEmitter, Input, Output, SimpleChanges, Inject, OnDestroy, OnChanges, OnInit, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMAttachementFileInputFormItemComponentService } from '../input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';
import { EIMCalendarInputFormItemComponentService } from '../input-form-item/calendar-input-form-item/calendar-input-form-item.component.service';
import { EIMCheckBoxInputFormItemComponentService } from '../input-form-item/check-box-input-form-item/check-box-input-form-item.component.service';
import { EIMComboBoxInputFormItemComponentService } from '../input-form-item/combo-box-input-form-item/combo-box-input-form-item.component.service';
import { EIMInputFormItemComponentService } from '../input-form-item/input-form-item.component.service';
import { EIMMasterInputFormItemComponentService } from '../input-form-item/master-input-form-item/master-input-form-item.component.service';
import { EIMNumberInputFormItemComponentService } from '../input-form-item/number-input-form-item/number-input-form-item.component.service';
import { EIMRadioButtonInputFormItemComponentService } from '../input-form-item/radio-button-input-form-item/radio-button-input-form-item.component.service';
import { EIMRichTextInputFormItemComponentService } from '../input-form-item/rich-text-input-form-item/rich-text-input-form-item.component.service';
import { EIMTextAreaInputFormItemComponentService } from '../input-form-item/text-area-input-form-item/text-area-input-form-item.component.service';
import { EIMUserInputFormItemComponentService } from '../input-form-item/user-input-form-item/user-input-form-item.component.service';
import { EIMTextInputFormItemComponentService } from '../input-form-item/text-input-form-item/text-input-form-item.component.service';
import { EIMInputFormItemComponentChangedEmitValueDomain } from '../input-form-item/input-form-item.component';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * フォームコンポーネント
 * @example
 *
 *		<eim-form
 *			[form]="form"
 *			[disabled]="disabled"
 *			(changed)="onChanged($event)">
 *		</eim-form>
 */
 @Component({
	selector: 'eim-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	standalone: false,
})
export class EIMFormComponent  {

	/** フォームグループ */
	@Input() public form: FormGroup;

	/** 無効かどうか */
	@Input() public disabled = false;

	/** 選択値変更イベントエミッタ */
	@Output() public changed: EventEmitter<EIMInputFormItemComponentChangedEmitValueDomain> =
			new EventEmitter<EIMInputFormItemComponentChangedEmitValueDomain>();


	/** 入力フォームアイテム情報リスト */
	public inputFormItems: EIMInputFormItemDomain[] = null;
	//public dto = null;
	/** 入力フォームアイテムコンポーネントサービス */
	public inputFormItemComponentServices: EIMInputFormItemComponentService[] = null;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected textAreaInputFormItemComponentService: EIMTextAreaInputFormItemComponentService,
		protected calendarInputFormItemComponentService: EIMCalendarInputFormItemComponentService,
		protected attachementFileInputFormItemComponentService: EIMAttachementFileInputFormItemComponentService,
		protected checkBoxInputFormItemComponentService: EIMCheckBoxInputFormItemComponentService,
		protected comboBoxInputFormItemComponentService: EIMComboBoxInputFormItemComponentService,
		protected masterInputFormItemComponentService: EIMMasterInputFormItemComponentService,
		protected numberInputFormItemComponentService: EIMNumberInputFormItemComponentService,
		protected radioButtonInputFormItemComponentService: EIMRadioButtonInputFormItemComponentService,
		protected richTextInputFormItemComponentService: EIMRichTextInputFormItemComponentService,
		protected userInputFormItemComponentService: EIMUserInputFormItemComponentService,

	) {

		this.inputFormItemComponentServices = this.getComponentServices();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * フォーム形式結果情報を設定します.
	 * フォーム形式結果情報から入力フォームを生成し画面表示します.
	 * @param form フォーム形式結果情報
	 * @param excluedeDefinitionNameSet 表示対象から除外する属性タイプ定義名称のセット
	 * @param nameSpaceSet ネームスペースセット（指定したネームスペースの属性に絞る)
	 */
	public setFormFormatResult(form: EIMFormFormatResultDTO, excluedeDefinitionNameSet: Set<string> = null, nameSpaceSet: Set<string> = null): void {

		this.inputFormItems = this.convertFormFormatResultToInputFormItems(form, excluedeDefinitionNameSet, nameSpaceSet);

	}

	/**
	 * フォーム形式結果ドメインから入力フォームアイテムドメインリストに変換します.
	 *
	 * @param form フォーム形式結果情報（form.info.attributeTypeLayoutsが設定されている必要があります）
	 * @param excluedeDefinitionNameSet 表示対象から除外する属性タイプ定義名称のセット
	 * @param nameSpaceSet ネームスペースセット（指定したネームスペースの属性に絞る)
	 * @return 入力フォームアイテムドメインリスト
	 */
	public convertFormFormatResultToInputFormItems(form: EIMFormFormatResultDTO, excluedeDefinitionNameSet: Set<string> = null, nameSpaceSet: Set<string> = null): EIMInputFormItemDomain[] {

		// フィルタ対象のネームスペース
		const nameSpaces = nameSpaceSet == null ? null : Array.from(nameSpaceSet);

		let inputFormItems: EIMInputFormItemDomain[] = [];
		for (const layout of form.info.attributeTypeLayouts) {

			// 非表示対象の場合
			if (layout.visible !== true) {
				continue;
			}

			// 表示対象から除外する属性タイプ定義名称のセットに含まれる場合はスキップ
			if (excluedeDefinitionNameSet &&
					excluedeDefinitionNameSet.has(layout.definitionName)) {
				continue;
			}

			// 表示対象のネームスペースではない場合はスキップ
			if (nameSpaces) {

				let isTarget = false;
				for (const nameSpace of nameSpaces) {

					if (layout.definitionName.indexOf(nameSpace) === 0) {

						isTarget = true;
					}
				}
				
				if (!isTarget) {
					continue;
				}
			}

			inputFormItems.push(this.convertToInputFormItem(layout, form));
		}

		return inputFormItems;
	}

	/**
	 * 属性タイプレイアウト情報をフォーム情報に変換します.
	 *
	 * @param attributeTypeLayout 属性タイプレイアウト情報
	 * @param dto DTO
	 * @return フォーム情報
	 */
	public convertToInputFormItem(attributeTypeLayout: EIMAttributeTypeLayoutDomain, form: EIMFormFormatResultDTO): EIMInputFormItemDomain {

		let dto = form.dto;

		if (!attributeTypeLayout) {
			return null;
		}

		// 属性値
		let attrDefName = attributeTypeLayout.definitionName;
		if (!dto.attributeMap) {
			dto.attributeMap = {};
		}
		if (!dto.attributeMap[attrDefName]?.values) {
			dto.attributeMap[attrDefName] = {valueType: attributeTypeLayout.valueType, values: []};
		}

		// フォーム情報設定
		let inputFormItem: EIMInputFormItemDomain = new EIMInputFormItemDomain();
		inputFormItem.definitionName = attributeTypeLayout.definitionName;
		inputFormItem.name = attributeTypeLayout.definitionName;
		inputFormItem.label = attributeTypeLayout.name;
		inputFormItem.values = dto.attributeMap[attrDefName].values;
		inputFormItem.codeType = attributeTypeLayout.codeType;
		inputFormItem.uiControlId = attributeTypeLayout.uiControlId;
		inputFormItem.uiControlType = attributeTypeLayout.uiControlType;
		inputFormItem.valueType = attributeTypeLayout.valueType;
		inputFormItem.multiple = attributeTypeLayout.multiple;
		inputFormItem.visible = attributeTypeLayout.visible;
		inputFormItem.disabled = this.disabled ?? false;
		inputFormItem.searchMasterDisplayConfig = attributeTypeLayout.searchMasterDisplayConfig;
		inputFormItem.required = attributeTypeLayout.required;

		// 文字列の場合
		if (inputFormItem.valueType === 'STRING') {
			inputFormItem.maxlength = EIMConstantService.STRING_MAX_LENGTH;
		}

		// 数値の場合
		else if (inputFormItem.valueType === 'LONG') {
			// 入力制限
			inputFormItem.restriction = '\\-0-9';
		}

		// 実数の場合
		else if (inputFormItem.valueType === 'DOUBLE') {
			// 入力制限
			inputFormItem.restriction = '\\-0-9.';
		}

		// 日付型の場合
		else if (inputFormItem.valueType === 'DATE') {
			for (let i = 0; i < inputFormItem.values.length; i++) {
				if (!inputFormItem.values[i] || inputFormItem.values[i] === '') {
					inputFormItem.values[i] = null;
				} else {
					inputFormItem.values[i] = new Date(inputFormItem.values[i]);
				}
			}
		}

		// コード型の場合
		else if (inputFormItem.valueType === 'CODE' && attributeTypeLayout.codeType?.codeList) {
			inputFormItem.options = [];

			// 設定済みコードセット
			let codeSet: Set<string> = new Set();
			dto.attributeMap[attrDefName].values.forEach((value: EIMCodeDomain) => {
				codeSet.add(value.code);
			});

			// options設定
			for (let i = 0; i < attributeTypeLayout.codeType.codeList.length; i++) {

				// 該当コード未設定で無効ならばリストに表示しない
				let code: EIMCodeDomain = attributeTypeLayout.codeType.codeList[i];
				if (!codeSet.has(code.code) && code.disable) {
					continue;
				}

				inputFormItem.options.push({label: code.name, value: code});
			}

			// options(リスト)内の選択行とvalue（選択行）のインスタンスを合わせる必要がある。
			this.convertValuesFromOptions(attributeTypeLayout, dto);
		}

		return inputFormItem;
	}

	/**
	 * 入力フォームアイテムリストを設定します.
	 *
	 * @param inputFormItems 入力フォームアイテムリスト
	 */
	public setInputFormItems(inputFormItems: EIMInputFormItemDomain[]): void {

		this.inputFormItems = inputFormItems;

		if (!inputFormItems) {
			return;
		}

		for (let i = 0; i < inputFormItems.length; i++) {

			const inputFormItem: EIMInputFormItemDomain = inputFormItems[i];
			if (typeof inputFormItem.disabled === 'undefined') {
				inputFormItem.disabled = this.disabled;
			}
		}
	}

	/**
	 * DTOを設定します.
	 *
	 * @param dto DTO
	 */
	// public setDto(dto: any): void {
	// 	this.dto = dto;
	// }

	/**
	 * 属性値変更時のイベントハンドラです.
	 *
	 * @param emitValue 入力フォームコンポーネントの値変更イベントエミッタの設定値
	 */
	public onChange(emitValue: EIMInputFormItemComponentChangedEmitValueDomain): void {
		this.changed.emit(emitValue);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 使用するフォームのコンポーネントサービスリストを返却します.
	 *
	 * @return コンポーネントサービスリスト
	 */
	protected getComponentServices(): EIMInputFormItemComponentService[] {

		return [
			this.textInputFormItemComponentService,
			this.textAreaInputFormItemComponentService,
			this.calendarInputFormItemComponentService,
			this.attachementFileInputFormItemComponentService,
			this.checkBoxInputFormItemComponentService,
			this.comboBoxInputFormItemComponentService,
			this.masterInputFormItemComponentService,
			this.numberInputFormItemComponentService,
			this.radioButtonInputFormItemComponentService,
			this.richTextInputFormItemComponentService,
			this.userInputFormItemComponentService,
		];

	}

	/**
	 * 選択済みのコード情報リストを返却します.
	 * 画面初期表示時に選択させるため、optionsと同じオブジェクト（属性タイプレイアウト情報内のコード情報）を返却します.
	 *
	 * @param attributeTypeLayout 属性タイプレイアウト情報
	 * @param dto DTO
	 * @return 選択済みのコード情報リスト
	 */
	protected convertValuesFromOptions(attributeTypeLayout: EIMAttributeTypeLayoutDomain, dto: any): EIMCodeDomain[] {

		let attrDefName = attributeTypeLayout.definitionName;

		let codeMap: Map<string, EIMCodeDomain> = new Map();
		attributeTypeLayout.codeType.codeList.forEach((code: EIMCodeDomain) => {
			codeMap.set(code.code, code);
		});

		let values: EIMCodeDomain[] = [];
		for (let i = 0; i < dto.attributeMap[attrDefName].values.length; i++) {

			const code: EIMCodeDomain = codeMap.get(dto.attributeMap[attrDefName].values[i]?.code);
			if (code) {
				values.push(code);
			}
		}

		dto.attributeMap[attrDefName].values.splice(0, values.length);
		for (let i = 0; i < values.length; i++) {
			
			dto.attributeMap[attrDefName].values.push(values[i]);
		}

		return values;
	}
}
