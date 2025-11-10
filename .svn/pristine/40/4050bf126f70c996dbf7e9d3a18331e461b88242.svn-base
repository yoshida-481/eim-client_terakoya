import { Component, ComponentRef, ComponentFactory, EventEmitter, NgModule, OnChanges, OnDestroy, ViewContainerRef, SimpleChange, Input, Output, ViewChild, AfterViewInit, SimpleChanges } from '@angular/core';
import { FormsModule, UntypedFormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { EIMAttributeListInputFormItemComponent } from 'app/shared/components/attribute-list-input-form-item/attribute-list-input-form-item.component';
import { EIMAttributeListInputFormItemComponentService } from 'app/shared/components/attribute-list-input-form-item/attribute-list-input-form-item.component.service';

import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMContentsAttributeTypeLayoutDomain } from 'app/documents/shared/domains/contents-attribute-type-layout.domain';

/**
 * 属性リスト入力コンポーネント
 * @example
 *
 *      <eim-contents-attribute-list-input-form-item
 *          [componentService]="attributeListInputFormItemComponentService"
 *          [(attributeList)]="attributeList"
 *          [(attributeTypeLayoutList)]="attributeTypeLayoutList"
 *          disabled="false"
 *          [form]="form"
 *          enableSuccessionSetting="true">
 *      </eim-contents-attribute-list-input-form-item>
 */
@Component({
    selector: 'eim-contents-attribute-list-input-form-item',
    templateUrl: './contents-attribute-list-input-form-item.component.html',
    styleUrls: ['./contents-attribute-list-input-form-item.component.css'],
    providers: [],
    standalone: false
})
export class EIMContentsAttributeListInputFormItemComponent
		extends EIMAttributeListInputFormItemComponent
		implements OnChanges {

	/** 下位引継設定有無 */
	@Input() public enableSuccessionSetting = false;

	/** チェックボックスクリックエミッタ */
	@Output() attrCheckBoxClicked: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected attributeListInputFormItemComponentService: EIMAttributeListInputFormItemComponentService,
	) {
		super(attributeListInputFormItemComponentService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (!(<any>changes).attributeTypeLayoutList
				|| (<any>changes).attributeTypeLayoutList.currentValue == null
				|| !(<any>changes).attributeList
				|| (<any>changes).attributeList.currentValue == null) {
			return;
		}

		super.ngOnChanges(changes);

		// チェックボックスコントローラを追加
		for (let i = 0; i < this.attributeList.length; i++) {
			this.form.addControl('successionFlag_' + i, new UntypedFormControl());
		}

		// 下位引継ぎチェックボックスチェック対象の属性タイプIDSetを取得
		let lowSuccessionCheckIdSet: any = this.getLowSuccessionAttributeTypeIdSet(this.attributeList);

		for (let i = 0; i < this.layoutAndAttributeList.length; i++) {
			let attributeTypeLayout: EIMContentsAttributeTypeLayoutDomain = this.layoutAndAttributeList[i].attributeTypeLayout;
			let attribute: EIMAttributeDomain = this.layoutAndAttributeList[i].attribute;

			// コピー貼り付け可能かどうか
			attribute['_enableCopy'] = this.isCopyTarget(attribute.attributeType.valueType);

			// コピー貼り付け対象かどうか
			if (attribute['_enableCopy']) {
				// デフォルト対象
				attribute['_copyTarget'] = true;
			}

			// 下位引継ぎチェックボックスのON/OFFを設定
			if (lowSuccessionCheckIdSet[attribute.attributeType.id]) {
				attribute['_lowSuccession'] = true;
			} else {
				attribute['_lowSuccession'] = false;
			}

			// 上位の下位引継ぎ属性によるチェックボックスのON/OFFを設定
			if (attributeTypeLayout.successionFlag) {
				// 上位に下位引継ぎが設定されている属性の変更は不可
				attribute['_lowSuccession'] = true;
				attribute['_successionFlag'] = true;
				attributeTypeLayout['_disabled'] = true;
			}
			attributeTypeLayout['_isProperty'] = (attribute.attributeType.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_PROPERTY);
			attributeTypeLayout['_isExpiredate'] = (attribute.attributeType.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_EXPIREDATE);
		}
	}

	/**
	 * チェックボックスクリックイベントハンドラです.
	 * @param item 属性情報
	 */
	onClick(item: any) {
		this.attrCheckBoxClicked.emit(item);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 属性配列から、下位引継情報を保持している属性情報を取得します.
	 * @param attributes 属性情報配列
	 * @return 下位引継情報を保持している属性情報
	 */
	private getLowSuccessionAttribute(attributes: EIMAttributeDomain[]): EIMAttributeDomain {
		// 下位への引継ぎ属性取得
		let lowSuccessionAttribute: EIMAttributeDomain;
		for (let i = 0; i < attributes.length; i++) {
			let attribute: EIMAttributeDomain = attributes[i];
			if (attribute.attributeType.definitionName === EIMDocumentsConstantService.ATTRIBUTE_TYPE_FOLDER_TO_LOW_ATTR) {
				lowSuccessionAttribute = attribute;
				break;
			}
		}
		return lowSuccessionAttribute;
	}

	/**
	 * 下位引継がチェックされた属性タイプIDのSetを返却します.
	 * @param attributes 属性情報配列
	 * @return 下位引継がチェックされた属性タイプIDのSet
	 */
	private getLowSuccessionAttributeTypeIdSet(attributes: EIMAttributeDomain[]): any {
		let idSet: any = {};

		let lowSuccessionAttribute: EIMAttributeDomain = this.getLowSuccessionAttribute(attributes);
		if (!lowSuccessionAttribute) {
			return idSet;
		}

		// 属性タイプIDのセットを作成する
		let ids: number[] = lowSuccessionAttribute.longList;
		for (let i = 0; i < ids.length; i++) {
			idSet[ids[i]] = true;
		}

		return idSet;
	}

	/**
	 * コピー対象かどうかを判定します.
	 */
	private isCopyTarget(valueType: string) {
		if (valueType !== 'OBJECT') {
			return true;
		} else {
			return false;
		}
	}

}
