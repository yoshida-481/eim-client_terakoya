import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemComponent } from "app/shared/components/input-form-item/input-form-item.component";
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from "app/shared/components/input-form-item/input-form-item.component.service";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMTaskObjectRoleEntryInputFormItemComponent } from "./task-object-role-entry-input-form-item.component";

/**
 * 業務役割担当入力フォームアイテム情報
 */
export interface EIMTaskObjectRoleEntryInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {

	/** エントリ設定対象のオブジェクトID */
	targetObjectId: number
};

/**
 * 業務役割担当入力フォームコンポーネントサービス
 * @see {@link EIMInputFormItemComponentService}
 */
@Injectable()
export class EIMTaskObjectRoleEntryInputFormItemComponentService extends EIMInputFormItemComponentService {

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
		return EIMTaskObjectRoleEntryInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.<br>
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

		if (inputFormItem.name === 'taskObjectRoleEntry') {
			return true;
		}
		return false;
	};

	/**
	 * フォームに設定する入力フォームアイテム情報を生成します.<br>
	 * フォームに個別に入力フォームを追加する場合に使用します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItemComponent コンポーネント初期化パラメータ
	 * @returns 入力フォームアイテム情報
	 */
	public override createInputFormDomain(inputFormItemComponent: EIMTaskObjectRoleEntryInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = super.createInputFormDomain(inputFormItemComponent);

		inputFormItem['targetObjectId'] = inputFormItemComponent.targetObjectId;

		return inputFormItem;
	};

}
