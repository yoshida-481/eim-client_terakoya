import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemComponent } from "app/shared/components/input-form-item/input-form-item.component";
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from "app/shared/components/input-form-item/input-form-item.component.service";
import { EIMObjectTypeDomain } from "app/shared/domains/entity/object-type.domain";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMTaskTemplateFileInputFormItemComponent } from "./task-template-file-input-form-item.component";
import { EIMTaskInputFormItemDomain } from "../task-form/task-form.component";
import { EIMSimpleObjectDTO } from "app/shared/dtos/simple-object.dto";

/**
 * 雛型ファイル入力フォームアイテム情報
 */
export interface EITaskTemplateFileInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
	searchMasterDisplayConfig?: any;
	documentObjectTypes?: EIMObjectTypeDomain[];
	templateDocumentDtos: EIMSimpleObjectDTO[];
	outputDocumentDtos?: EIMSimpleObjectDTO[];
	isTemplateFilesEditable: boolean;
	taskObjectId?: number;
};

/**
 * 雛型ファイル入力フォームアイテムのコンポーネントサービス
 */
@Injectable()
export class EIMTaskTemplateFileInputFormItemComponentService extends EIMInputFormItemComponentService {

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 対応するコンポーネントを返却します.
	 *
	 *
	 * @returns 対応するコンポーネント
	 */
	public override getComponent(): Type<EIMInputFormItemComponent> {
		return EIMTaskTemplateFileInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

//		if (inputFormItem.uiControlId === 'uIControlSearchTaskTemplateDocumentField' && inputFormItem.uiControlType === 'ObjectSearch') {
		if (inputFormItem.definitionName === '雛型ファイル') {
			return true;
		}
		return false;
	};

	/**
	 * 対応するコンポーネントを初期化します.
	 *
	 * @param inputFormItemComponent 対応するコンポーネント
	 * @param inputFormItem 入力フォーム情報
	 */
	public override initializeComponent(
			inputFormItemComponent: EIMTaskTemplateFileInputFormItemComponent,
			inputFormItem: EIMTaskInputFormItemDomain): void {
		super.initializeComponent(inputFormItemComponent, inputFormItem);

		if (inputFormItem.documentObjectTypes !== null) {
			inputFormItemComponent.documentObjectTypes = inputFormItem.documentObjectTypes;
		}

		if (inputFormItem.templateDocumentDtos !== null) {
			inputFormItemComponent.templateDocumentDtos = inputFormItem.templateDocumentDtos;
		}
	
		if (inputFormItem.outputDocumentDtos !== null) {
			inputFormItemComponent.outputDocumentDtos = inputFormItem.outputDocumentDtos;
		}

		if (inputFormItem.isTemplateFilesEditable !== null) {
			inputFormItemComponent.isTemplateFilesEditable = inputFormItem.isTemplateFilesEditable;
		}
				
		if (inputFormItem.taskObjectId !== null) {
			inputFormItemComponent.taskObjectId = inputFormItem.taskObjectId;
		}
	}

	/**
	 * 対応するコンポーネントを初期化します.
	 *
	 * @param inputFormItemComponent 対応するコンポーネント
	 * @param inputFormItem 入力フォーム情報
	 */
	public override createInputFormDomain(inputFormItemComponent: EITaskTemplateFileInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem: EIMTaskInputFormItemDomain = super.createInputFormDomain(inputFormItemComponent);

		inputFormItem.searchMasterDisplayConfig = inputFormItemComponent.searchMasterDisplayConfig;
		inputFormItem.documentObjectTypes = inputFormItemComponent.documentObjectTypes;
		inputFormItem.templateDocumentDtos = inputFormItemComponent.templateDocumentDtos;
		inputFormItem.outputDocumentDtos = inputFormItemComponent.outputDocumentDtos;

		inputFormItem.isTemplateFilesEditable = inputFormItemComponent.isTemplateFilesEditable;

		inputFormItem.taskObjectId = inputFormItemComponent.taskObjectId;

		return inputFormItem;
	};

}
