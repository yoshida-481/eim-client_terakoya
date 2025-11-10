import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemComponent } from "app/shared/components/input-form-item/input-form-item.component";
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from "app/shared/components/input-form-item/input-form-item.component.service";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMTaskOutputFolderInputFormItemComponent } from "./task-output-folder-input-form-item.component";
import { EIMTaskConstantService } from "app/tasks/services/task-constant.service";

/**
 * 成果物保存先入力フォームアイテム情報
 */
export interface EIMTaskOutputFolderInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
	workspaceId: number
};

/**
 * 成果物保存先入力フォームコンポーネントサービス
 * @see {@link EIMInputFormItemComponentService}
 */
@Injectable()
export class EIMTaskOutputFolderInputFormItemComponentService extends EIMInputFormItemComponentService {

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
		return EIMTaskOutputFolderInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.<br>
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

		// 成果物保存先
		if (inputFormItem.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER) {
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
	public override initializeComponent(inputFormItemComponent: EIMTaskOutputFolderInputFormItemComponent, inputFormItem: EIMInputFormItemDomain): void {

		super.initializeComponent(inputFormItemComponent, inputFormItem);

		inputFormItemComponent.workspaceId = inputFormItem['workspaceId'];
	}

	/**
	 * フォームに設定する入力フォームアイテム情報を生成します.<br>
	 * フォームに個別に入力フォームを追加する場合に使用します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItemComponent コンポーネント初期化パラメータ
	 * @returns 入力フォームアイテム情報
	 */
	public override createInputFormDomain(inputFormItemComponent: EIMTaskOutputFolderInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = super.createInputFormDomain(inputFormItemComponent);

		inputFormItem['workspaceId'] = inputFormItemComponent.workspaceId;

		return inputFormItem;
	};

}
