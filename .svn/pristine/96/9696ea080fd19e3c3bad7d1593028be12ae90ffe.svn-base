import { Component, EventEmitter, Input, Output, SimpleChanges, Inject, OnDestroy, OnChanges, OnInit, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';
import { EIMCalendarInputFormItemComponentService } from 'app/shared/components/input-form-item/calendar-input-form-item/calendar-input-form-item.component.service';
import { EIMCheckBoxInputFormItemComponentService } from 'app/shared/components/input-form-item/check-box-input-form-item/check-box-input-form-item.component.service';
import { EIMComboBoxInputFormItemComponentService } from 'app/shared/components/input-form-item/combo-box-input-form-item/combo-box-input-form-item.component.service';
import { EIMInputFormItemComponentService } from 'app/shared/components/input-form-item/input-form-item.component.service';
import { EIMMasterInputFormItemComponentService } from 'app/shared/components/input-form-item/master-input-form-item/master-input-form-item.component.service';
import { EIMNumberInputFormItemComponentService } from 'app/shared/components/input-form-item/number-input-form-item/number-input-form-item.component.service';
import { EIMRadioButtonInputFormItemComponentService } from 'app/shared/components/input-form-item/radio-button-input-form-item/radio-button-input-form-item.component.service';
import { EIMRichTextInputFormItemComponentService } from 'app/shared/components/input-form-item/rich-text-input-form-item/rich-text-input-form-item.component.service';
import { EIMTextAreaInputFormItemComponentService } from 'app/shared/components/input-form-item/text-area-input-form-item/text-area-input-form-item.component.service';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { EIMUserInputFormItemComponentService } from 'app/shared/components/input-form-item/user-input-form-item/user-input-form-item.component.service';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';

/**
 * システム管理用フォームコンポーネント用入力フォームアイテムドメインクラス
 */
export class EIMAdminInputFormItemDomain extends EIMInputFormItemDomain {

}

@Component({
	selector: 'eim-admin-form',
	templateUrl: './admin-form.component.html',
	styleUrls: ['./admin-form.component.scss'],
	standalone: false,
})
/**
 * システム管理用フォームコンポーネント
 * @example
 *
 *		<eim-admin-form
 *			[form]="form"
 *			[disabled]="disabled"
 *			(changed)="onChanged($event)">
 *		</eim-admin-form>
 */
export class EIMAdminFormComponent extends EIMFormComponent  {

	/** フォームグループ */
	@Input() public form: FormGroup;


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

		// 以下システム管理用拡張

	) {
		super(
			textInputFormItemComponentService,
			textAreaInputFormItemComponentService,
			calendarInputFormItemComponentService,
			attachementFileInputFormItemComponentService,
			checkBoxInputFormItemComponentService,
			comboBoxInputFormItemComponentService,
			masterInputFormItemComponentService,
			numberInputFormItemComponentService,
			radioButtonInputFormItemComponentService,
			richTextInputFormItemComponentService,
			userInputFormItemComponentService,

			);
		this.inputFormItemComponentServices = this.getComponentServices();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性タイプレイアウト情報をフォーム情報に変換します.
	 *
	 * @param attributeTypeLayout 属性タイプレイアウト情報
	 * @param form フォーム形式簡易結果DTO
	 * @return フォーム情報
	 */
	public convertToInputFormItem(attributeTypeLayout: EIMAttributeTypeLayoutDomain, form: EIMFormFormatResultDTO): EIMAdminInputFormItemDomain {

		let inputFormItem: EIMAdminInputFormItemDomain = super.convertToInputFormItem(attributeTypeLayout, form);

		return inputFormItem;
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
}
