import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemComponent } from "app/shared/components/input-form-item/input-form-item.component";
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from "app/shared/components/input-form-item/input-form-item.component.service";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMRelationFileInputFormItemComponent } from "./relation-file-input-form-item.component";

export interface EIMRelationFileInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
	// pearentObjId?: any;

};

@Injectable()
export class EIMRelationFileInputFormItemComponentService extends EIMInputFormItemComponentService {

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
		return EIMRelationFileInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

		if (inputFormItem.uiControlId === 'uIControlSearchDocumentField') {
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
	public override initializeComponent(inputFormItemComponent: EIMRelationFileInputFormItemComponent, inputFormItem: EIMInputFormItemDomain): void {
		super.initializeComponent(inputFormItemComponent, inputFormItem);

		// if (inputFormItem.pearentObjId != null) {
		// 	inputFormItemComponent.pearentObjId = inputFormItem.pearentObjId;
		// }
	}

	/**
	 * 対応するコンポーネントを初期化します.
	 *
	 * @param inputFormItemComponent 対応するコンポーネント
	 * @param inputFormItem 入力フォーム情報
	 */
	public override createInputFormDomain(inputFormItemComponent: EIMRelationFileInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = super.createInputFormDomain(inputFormItemComponent);

		// inputFormItem.pearentObjId = inputFormItemComponent.pearentObjId;

		return inputFormItem;
	};

}
