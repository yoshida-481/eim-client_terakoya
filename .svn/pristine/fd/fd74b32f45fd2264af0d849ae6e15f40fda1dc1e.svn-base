import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMInputFormItemComponent } from "../input-form-item.component";
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from "../input-form-item.component.service";
import { EIMMasterInputFormItemComponent } from "./master-input-form-item.component";

export interface EIMMasterInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
	searchMasterDisplayConfig?: any;

};

/**
 * マスタ入力フォームコンポーネントサービス
 * @see {@link EIMInputFormItemComponentService}
 */
@Injectable()
export class EIMMasterInputFormItemComponentService extends EIMInputFormItemComponentService {

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
		return EIMMasterInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.<br>
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

		if (inputFormItem.uiControlId === 'uIControlSearchField' && inputFormItem.uiControlType === 'ObjectSearch') {
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
	public override initializeComponent(inputFormItemComponent: EIMMasterInputFormItemComponent, inputFormItem: EIMInputFormItemDomain): void {

		if (inputFormItem.searchMasterDisplayConfig != null) {
			inputFormItemComponent.searchMasterDisplayConfig = inputFormItem.searchMasterDisplayConfig;
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
	public override createInputFormDomain(inputFormItemComponent: EIMMasterInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = super.createInputFormDomain(inputFormItemComponent);

		inputFormItem.searchMasterDisplayConfig = inputFormItemComponent.searchMasterDisplayConfig;

		inputFormItem.uiControlId = 'uIControlSearchField';
		inputFormItem.uiControlType = 'ObjectSearch';

		return inputFormItem;
	};

}
