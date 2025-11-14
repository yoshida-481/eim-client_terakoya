import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMInputFormItemComponent } from "../input-form-item.component";
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from "../input-form-item.component.service";
import { EIMNumberInputFormItemComponent } from "./number-input-form-item.component";

export interface EIMNumberInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
	valueType: 'LONG' | 'DOUBLE',
	maxlength?: number,
	restriction?: string,
	enableSeparate?: boolean,
	minValue?: number,
	maxValue?: number
};

/**
 * 数値入力フォームコンポーネントサービス
 * @see {@link EIMInputFormItemComponentService}
 */
@Injectable()
export class EIMNumberInputFormItemComponentService extends EIMInputFormItemComponentService {

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 対応するコンポーネントを返却します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @returns 対応するコンポーネント
	 */
	public override getComponent(): Type<EIMInputFormItemComponent> {
		return EIMNumberInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.<br>
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

		if (inputFormItem.uiControlId === 'uIControlTextInput'
				&& ( inputFormItem.valueType === 'LONG' || inputFormItem.valueType === 'DOUBLE' )) {
			return true;
		}
		return false;
	};

	/**
	 * 対応するコンポーネントを初期化します.<br>
	 * 動的にコンポーネントを追加する際に使用します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItemComponent 対応するコンポーネント
	 * @param inputFormItem 入力フォーム情報
	 */
	public override initializeComponent(inputFormItemComponent: EIMNumberInputFormItemComponent, inputFormItem: EIMInputFormItemDomain): void {

		// 未指定の場合はEIMInputFormItemDomainの初期値を使用する
		inputFormItemComponent.maxlength = inputFormItem.maxlength;

		if (inputFormItem.restriction != null) {
			inputFormItemComponent.restriction = inputFormItem.restriction;
		}

		if (inputFormItem.enableSeparate != null) {
			inputFormItemComponent.enableSeparate = inputFormItem.enableSeparate;
		}

		if (inputFormItem.minValue != null) {
			inputFormItemComponent.minValue = inputFormItem.minValue;
		}

		if (inputFormItem.maxValue != null) {
			inputFormItemComponent.maxValue = inputFormItem.maxValue;
		}
		super.initializeComponent(inputFormItemComponent, inputFormItem);
	}

	/**
	 * フォームに設定する入力フォームアイテム情報を生成します.<br>
	 * フォームに個別に入力フォームを追加する場合に使用します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItemComponent コンポーネント初期化パラメータ
	 * @returns 入力フォームアイテム情報
	 */
	public override createInputFormDomain(inputFormItemComponent: EIMNumberInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = super.createInputFormDomain(inputFormItemComponent);

		inputFormItem.maxlength = inputFormItemComponent.maxlength;
		inputFormItem.restriction = inputFormItemComponent.restriction;
		inputFormItem.enableSeparate = inputFormItemComponent.enableSeparate;
		if (inputFormItemComponent.minValue !== undefined) {
			inputFormItem.minValue = inputFormItemComponent.minValue;
		}
		if (inputFormItemComponent.maxValue !== undefined) {
			inputFormItem.maxValue = inputFormItemComponent.maxValue;
		}
		inputFormItem.uiControlId = 'uIControlTextInput';

		inputFormItem.valueType = inputFormItemComponent.valueType;

		return inputFormItem;
	};

}
