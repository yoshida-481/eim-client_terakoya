import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMInputFormItemComponent } from "../input-form-item.component";
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from "../input-form-item.component.service";
import { EIMCalendarInputFormItemComponent } from "./calendar-input-form-item.component";

export interface EIMCalendarInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
	/** 時分秒を表示するかどうか */
	showTime?: boolean;

	/** Date型ではなくNumber型のデータを使用するかどうか */
	useTimeNumber?: boolean;
};

/**
 * カレンダ入力フォームコンポーネントサービス
 * @see {@link EIMInputFormItemComponentService}
 */
@Injectable()
export class EIMCalendarInputFormItemComponentService extends EIMInputFormItemComponentService {

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
		return EIMCalendarInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.<br>
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

		if (inputFormItem.uiControlId === 'uIControlDateField') {
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
	public override initializeComponent(inputFormItemComponent: EIMCalendarInputFormItemComponent, inputFormItem: EIMInputFormItemDomain): void {

		if (inputFormItem['showTime'] === true || inputFormItem['showTime'] === false) {
			inputFormItemComponent.showTime = inputFormItem['showTime'];
		}

		if (inputFormItem['useTimeNumber'] === true || inputFormItem['useTimeNumber'] === false) {
			inputFormItemComponent.useTimeNumber = inputFormItem['useTimeNumber'];
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
	public override createInputFormDomain(inputFormItemComponent: EIMCalendarInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = super.createInputFormDomain(inputFormItemComponent);

		inputFormItem.uiControlId = 'uIControlDateField';

		// 独自拡張部分
		if (inputFormItemComponent.showTime === true || inputFormItemComponent.showTime === false) {
			inputFormItem['showTime'] = inputFormItemComponent.showTime;
		}

		if (inputFormItemComponent.useTimeNumber === true || inputFormItemComponent.useTimeNumber === false) {
			inputFormItem['useTimeNumber'] = inputFormItemComponent.useTimeNumber;
		}

		return inputFormItem;
	};

}
