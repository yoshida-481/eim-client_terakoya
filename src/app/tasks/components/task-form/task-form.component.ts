import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
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
import { EIMTaskTemplateFileInputFormItemComponentService } from '../task-template-file-input-form-item/task-template-file-input-form-item.component.service';
import { EIMResponsibleObjectRoleInputFormItemComponentService } from '../responsible-object-role-input-form-item/responsible-object-role-input-form-item.component.service';
import { EIMTaskObjectRoleEntryInputFormItemComponentService } from '../task-object-role-entry-input-form-item/task-object-role-entry-input-form-item.component.service';
import { EIMTaskOutputFileInputFormItemComponentService } from '../task-output-file-input-form-item/task-output-file-input-form-item.component.service';
import { EIMTaskOutputFolderInputFormItemComponentService } from '../task-output-folder-input-form-item/task-output-folder-input-form-item.component.service';
import { EIMInputFormItemResolverComponent } from 'app/shared/components/input-form-item-resolver/input-form-item-resolver.component';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMUrlInputFormItemComponentService } from 'app/shared/components/input-form-item/url-input-form-item/url-input-form-item.component.service';
import { EIMTaskAttachementFileInputFormItemComponentService } from '../task-attachement-file-input-form-item/task-attachement-file-input-form-item.component.service';

/**
 * タスク管理用入力フォームアイテムドメイン
 */
export class EIMTaskInputFormItemDomain extends EIMInputFormItemDomain {

	// -----------------------------
	// 雛型ファイル入力コンポーネント用
	// -----------------------------
	/** 雛型ドキュメントオブジェクトタイプ情報リスト */
	documentObjectTypes?: EIMObjectTypeDomain[];

	/** 雛型ドキュメント情報リスト */
	templateDocumentDtos?: EIMSimpleObjectDTO[];

	/** 成果物ドキュメント情報リスト */
	outputDocumentDtos?: EIMSimpleObjectDTO[];

	/** 雛型ファイル編集可能フラグ（雛型ファイルの追加/削除をきょかするかどうかのフラグ。タスクマスタの場合にtrueにする） */
	isTemplateFilesEditable?: boolean;

	taskObjectId?: number;
}

/**
 * タスク管理用フォームコンポーネントです.
 * @example
 *
 *		<eim-task-form
 *			[form]="form"
 *			[disabled]="disabled"
 *			(changed)="onChanged($event)">
 *		</eim-task-form>
 */
 @Component({
	selector: 'eim-task-form',
	templateUrl: './task-form.component.html',
	styleUrls: ['./task-form.component.scss'],
	standalone: false
})
export class EIMTaskFormComponent extends EIMFormComponent  {

	/** フォームグループ */
	@Input() public form: FormGroup;
	@ViewChildren('itemResolver') itemResolvers: QueryList<EIMInputFormItemResolverComponent>;


	// public inputFormItems: EIMInputFormItemDomain[] = null;
	// public dto = null;
	// public inputFormItemComponentServices: EIMInputFormItemComponentService[] = null;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected textAreaInputFormItemComponentService: EIMTextAreaInputFormItemComponentService,
		protected calendarInputFormItemComponentService: EIMCalendarInputFormItemComponentService,
		protected attachementFileInputFormItemComponentService: EIMTaskAttachementFileInputFormItemComponentService,
		protected checkBoxInputFormItemComponentService: EIMCheckBoxInputFormItemComponentService,
		protected comboBoxInputFormItemComponentService: EIMComboBoxInputFormItemComponentService,
		protected masterInputFormItemComponentService: EIMMasterInputFormItemComponentService,
		protected numberInputFormItemComponentService: EIMNumberInputFormItemComponentService,
		protected radioButtonInputFormItemComponentService: EIMRadioButtonInputFormItemComponentService,
		protected richTextInputFormItemComponentService: EIMRichTextInputFormItemComponentService,
		protected userInputFormItemComponentService: EIMUserInputFormItemComponentService,
		protected urlInputFormItemComponentService: EIMUrlInputFormItemComponentService,

		// 以下拡張
		protected taskTemplateFileInputFormItemComponentService: EIMTaskTemplateFileInputFormItemComponentService,
		protected responsibleObjectRoleInputFormItemComponentService: EIMResponsibleObjectRoleInputFormItemComponentService,
		protected taskObjectRoleEntryInputFormItemComponentService: EIMTaskObjectRoleEntryInputFormItemComponentService,
		protected taskOutputFileInputFormItemComponentService: EIMTaskOutputFileInputFormItemComponentService,
		protected taskOutputFolderInputFormItemComponentService: EIMTaskOutputFolderInputFormItemComponentService

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
	 * 使用するフォームのコンポーネントサービスリストを返却します.
	 *
	 * @return コンポーネントサービスリスト
	 */
	public getComponentServices(): EIMInputFormItemComponentService[] {

		return [
			this.taskTemplateFileInputFormItemComponentService,
			this.responsibleObjectRoleInputFormItemComponentService,
			this.taskObjectRoleEntryInputFormItemComponentService,
			this.taskOutputFileInputFormItemComponentService,
			this.taskOutputFolderInputFormItemComponentService,
			this.urlInputFormItemComponentService,

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
	 * 属性タイプレイアウト情報をフォーム情報に変換します.
	 *
	 * @param attributeTypeLayout 属性タイプレイアウト情報
	 * @param dto DTO
	 * @return フォーム情報
	 */
	public convertToInputFormItem(attributeTypeLayout: EIMAttributeTypeLayoutDomain, formFormatResult: EIMFormFormatResultDTO): EIMTaskInputFormItemDomain {

		let inputFormItem: EIMTaskInputFormItemDomain = super.convertToInputFormItem(attributeTypeLayout, formFormatResult);

		// 雛型ファイル用の追加パラメータ
		inputFormItem.documentObjectTypes = formFormatResult.info['documentObjectTypes'];
		inputFormItem.templateDocumentDtos = formFormatResult.dto.exAttributeMap['templateDocumentDtos'];
		// 成果物
		inputFormItem.outputDocumentDtos = 
				formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT]?.values;

		return inputFormItem;
	}

	/**
	 * 入力フォームアイテムリストを設定します.
	 *
	 * @param inputFormItems 入力フォームアイテムリスト
	 */
	public setInputFormItems(inputFormItems: EIMInputFormItemDomain[]): void {

		// 共通設定
		for (let i = 0; i < inputFormItems.length; i++) {
			
			const inputFormItem: EIMInputFormItemDomain = inputFormItems[i];

			// 開始予定日/終了予定日
			if (inputFormItem.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE 
					|| inputFormItem.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE) {
				inputFormItem.styleClass += ' eim-md-6';
			}

			// 進捗率
			if (inputFormItem.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE) {
				inputFormItem.minValue = 0;
				inputFormItem.maxValue = 100;
				inputFormItem.restriction = '\\0-9';
				inputFormItem.rightMessage = '%';
				inputFormItem.styleClass += ' eim-task-input-form-item-progress-rate';
			}

			// メモ
			if (inputFormItem.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_MEMO) {
				inputFormItem.styleClass += ' eim-task-input-form-item-memo';
			}

		}

		super.setInputFormItems(inputFormItems);
	}

	/**
	 * input-form-item-resolversを取得します.
	 */
	public getItemResolvers() {
		return this.itemResolvers;
	}
}
