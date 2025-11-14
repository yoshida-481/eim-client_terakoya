import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMInputFormItemComponent } from "../input-form-item.component";
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from "../input-form-item.component.service";
import { EIMTextAreaInputFormItemComponent } from "./text-area-input-form-item.component";

export interface EIMTextAreaInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
	maxlength?: number;

};

/**
 * テキストエリア入力フォームコンポーネントサービス
 * @see {@link EIMInputFormItemComponentService}
 */
@Injectable()
export class EIMTextAreaInputFormItemComponentService extends EIMInputFormItemComponentService {

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
		return EIMTextAreaInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.<br>
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

		if (inputFormItem.uiControlId === 'uIControlTextArea') {
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
	public override initializeComponent(inputFormItemComponent: EIMTextAreaInputFormItemComponent, inputFormItem: EIMInputFormItemDomain): void {

		if (inputFormItem.maxlength != null) {
			inputFormItemComponent.maxlength = inputFormItem.maxlength;
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
	public override createInputFormDomain(inputFormItemComponent: EIMTextAreaInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = super.createInputFormDomain(inputFormItemComponent);

		inputFormItem.maxlength = inputFormItemComponent.maxlength;

		inputFormItem.uiControlId = 'uIControlTextArea';

		return inputFormItem;
	};

}
