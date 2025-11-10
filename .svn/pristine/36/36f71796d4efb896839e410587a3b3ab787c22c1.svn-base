import { Injectable, Type } from "@angular/core";
import { EIMInputFormItemDomain } from "app/shared/domains/input-form-item.domain";
import { EIMInputFormItemComponent } from "./input-form-item.component";
import { ValidatorFn } from "@angular/forms";

/**
 * 入力フォームコンポーネント初期化パラメータインタフェーズ
 */
export interface EIMInputFormItemComponentDomain {
	/** フォームコントローラの名前 */
	name: string;

	/** 値 */
	value: any[];

	/** ラベル(デフォルト:'') */
	label?: string;

	/** 多重度(デフォルト:false) */
	multiple?: boolean;

	/** 可視性(デフォルト:true) */
	// visible?: boolean;

	/** 必須区分(デフォルト:false) */
	required?: boolean;

	/** 無効区分(デフォルト:false) */
	disabled?: boolean;

	/** 上メッセージ */
	topMessage?: string;

	/** 右メッセージ */
	rightMessage?: string;

	/** 下メッセージ */
	bottomMessage?: string;

	/** 左メッセージ */
	leftMessage?: string;

	/** 属性タイプ定義名称(EIMInputFormItemComponentService#visibleFunction()内での部品識別用) */
	definitionName?: string;

	/** スタイルクラス（スペース区切りでクラス名を指定） */
	styleClass?: string;

	/** バリデータ */
	validators?: ValidatorFn[];

};

/**
 * 入力フォームコンポーネントサービスクラス
 */
@Injectable()
export class EIMInputFormItemComponentService {

	/**
	 * 対応するコンポーネントを返却します.
	 *
	 *
	 * @returns 対応するコンポーネント
	 */
	public getComponent(): Type<EIMInputFormItemComponent> {
		return null;
	}

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.<br>
	 * EIMInputFormItemResolverComponentにて表示対象とするかどうか判定するために使用します.
	 * @see {@link EIMInputFormItemResolverComponent}
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {
		return false;
	}

	/**
	 * 対応するコンポーネントを初期化します.<br>
	 * 動的にコンポーネントを追加する際に使用します.
	 *
	 * @example
	 * EIMFormFormatResultDTOを引数にsetFormFormatResult()を呼び出します.<br>
	 * 呼出し後は以下の流れで入力フォームを追加します.<br>
	 * <br>
	 * １．EIMFormComponentに設定されている使用可能な入力フォームアイテムコンポーネントサービス
	 * （EIMInputFormItemComponentService）のリストと、レイアウト情報から生成した入力フォーム情報をリゾルバコンポーネントに渡します.
	 * ２．EIMInputFormItemResolverComponentにて入力フォームアイテムコンポーネントサービスリストより
	 * 表示対象の入力フォームアイテムコンポーネントサービスを判定します.（this.visibleFunction()）
	 * ３．this.initializeComponent()を使用して生成したコンポーネントに入力フォーム情報を設定します.
	 * ```
	 * 		this.form.setFormFormatResult(formFormatResult);
	 * ```
	 * @see {@link EIMFormComponent}
	 * @see {@link EIMInputFormItemResolverComponent}
	 *
	 * @param inputFormItemComponent 対応するコンポーネント
	 * @param inputFormItem 入力フォーム情報
	 */
	public initializeComponent(inputFormItemComponent: EIMInputFormItemComponent, inputFormItem: EIMInputFormItemDomain): void {
		inputFormItemComponent.name = inputFormItem.name;
		if (inputFormItem.label != null) {
			inputFormItemComponent.label = inputFormItem.label;
		}
		if (inputFormItem.multiple != null) {
			inputFormItemComponent.multiple = inputFormItem.multiple;
		}
		// component.visible = inputFormItem.visible == null ? true : inputFormItem.visible;
		if (inputFormItem.required != null) {
			inputFormItemComponent.required = inputFormItem.required;
		}
		if (inputFormItem.disabled != null) {
			inputFormItemComponent.disabled = inputFormItem.disabled;
		}
		if (inputFormItem.topMessage != null) {
			inputFormItemComponent.topMessage = inputFormItem.topMessage;
		}
		if (inputFormItem.rightMessage != null) {
			inputFormItemComponent.rightMessage = inputFormItem.rightMessage;
		}
		if (inputFormItem.bottomMessage != null) {
			inputFormItemComponent.bottomMessage = inputFormItem.bottomMessage;
		}
		if (inputFormItem.leftMessage != null) {
			inputFormItemComponent.leftMessage = inputFormItem.leftMessage;
		}
		if (inputFormItem.validators != null) {
			inputFormItemComponent.validators = inputFormItem.validators;
		}

		inputFormItemComponent.writeValue(inputFormItem.values);
	}

	/**
	 * フォームに設定する入力フォームアイテム情報を生成します.<br>
	 * フォームに個別に入力フォームを追加する場合に使用します.
	 *
	 * @example
	 * 以下のように入力フォームを追加します.<br>
	 * 引数のEIMInputFormItemComponentDomainを拡張する場合は、
	 * EIMInputFormItemComponentServiceを拡張したクラスにてドメインを定義してください.
	 * ```
	 * 		let inputFormItems: EIMInputFormItemDomain[] = [];
	 *
	 * 		// 名称の入力フォーム追加
	 * 		inputFormItems.push(this.xxxInputFormItemComponentService.createInputFormDomain({
	 *			name: 'attr_name', label: this.translateService.instant('EIM_XXXS.LABEL_XXX'),
	 *			value: this.name, disabled: false, required: true
	 *		}));

	 *		this.form.setInputFormItems(inputFormItems);
	 * ```
	 *
	 * @param inputFormItemComponent コンポーネント初期化パラメータ
	 * @returns 入力フォームアイテム情報
	 */
	public createInputFormDomain(inputFormItemComponent: EIMInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = new EIMInputFormItemDomain();

		inputFormItem.name = inputFormItemComponent.name;
		inputFormItem.values = inputFormItemComponent.value;
		inputFormItem.label = inputFormItemComponent.label ? inputFormItemComponent.label : '';
		inputFormItem.multiple = inputFormItemComponent.multiple ? inputFormItemComponent.multiple : false;
		// inputFormItem.visible = inputFormItemComponent.visible;
		inputFormItem.required = inputFormItemComponent.required ? inputFormItemComponent.required : false;
		if (typeof inputFormItemComponent.disabled !== 'undefined') {
			// disabledは未設定の場合はEIMFormComponentで設定する
			inputFormItem.disabled = inputFormItemComponent.disabled;
		}
		inputFormItem.topMessage = inputFormItemComponent.topMessage
		inputFormItem.rightMessage = inputFormItemComponent.rightMessage
		inputFormItem.bottomMessage = inputFormItemComponent.bottomMessage
		inputFormItem.leftMessage = inputFormItemComponent.leftMessage
		inputFormItem.definitionName = inputFormItemComponent.definitionName;
		inputFormItem.styleClass = inputFormItemComponent.styleClass;
		inputFormItem.validators = inputFormItemComponent.validators;

		return inputFormItem;
	}

}