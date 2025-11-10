import {
	Component,
	ComponentRef,
	ComponentFactory,
	EventEmitter,
	NgModule,
	OnDestroy,
	ViewContainerRef,
	SimpleChange,
	OnChanges,
	Input,
	ViewChild,
	AfterViewInit
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { EIMAttributeService } from 'app/shared/services/attribute.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';

import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMHierarchicalLayoutDomain } from 'app/shared/domains/hierarchical-layout.domain';
import { EIMHierarchicalGroupDomain } from 'app/shared/domains/hierarchical-group.domain';

import { EIMHierarchicalAttributeListInputFormItemComponentService } from './hierarchical-attribute-list-input-form-item.component.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';

/**
 *
 * 階層属性リスト入力コンポーネント
 * @example
 *      <eim-hierarchical-attribute-list-input-form-item
 *          [componentService]="attributeListInputFormItemComponentService"
 *          [(attributeList)]="attributeList"
 *          [(attributeTypeLayoutList)]="attributeTypeLayoutList"
 *          [(hierarchicalLayoutList)]="hierarchicalLayoutList"
 *          disabled="false"
 *          [form]="form"
 *          [statusTypeId]="statusTypeId">
 *      </eim-hierarchical-attribute-list-input-form-item>
 */
@Component({
    selector: 'eim-hierarchical-attribute-list-input-form-item',
    templateUrl: './hierarchical-attribute-list-input-form-item.component.html',
    styleUrls: ['./hierarchical-attribute-list-input-form-item.component.css'],
    standalone: false
})
export class EIMHierarchicalAttributeListInputFormItemComponent {

	/** コンポーネントサービス */
	@Input()
		public componentService: EIMHierarchicalAttributeListInputFormItemComponentService;

	/** 階層レイアウト配列 */
	@Input() public hierarchicalLayoutList: EIMHierarchicalLayoutDomain[] = null;

	/** 属性タイプレイアウト配列 */
	@Input() public attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] = null;

	/** 属性配列 */
	@Input() public attributeList: EIMAttributeDomain[] = null;

	/** フォームグループ */
	@Input() public form: UntypedFormGroup;

	/** 属性レイアウト配列 */
	@Input() public disabled: boolean = false;

	/** 属性タイプIdと属性のMap */
	@Input() public attributeMap: Object = null;

	/** ステータスタイプID */
	@Input() public statusTypeId: number;

	/** 階層レイアウトかどうか */
	public isHierarchical: boolean = true;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeListInputFormItemComponentService: EIMHierarchicalAttributeListInputFormItemComponentService,
			protected cacheService: EIMFormsCacheService,
	) {}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChange) {
		if (!this.componentService) {
			this.componentService = this.attributeListInputFormItemComponentService;
		}

		if (!(<any>changes).attributeTypeLayoutList
				|| (<any>changes).attributeTypeLayoutList.currentValue == null
				|| !(<any>changes).hierarchicalLayoutList	// 階層レイアウトでない場合hierarchicalLayoutListはnull
				|| !(<any>changes).attributeList
				|| (<any>changes).attributeList.currentValue == null) {
			return;
		}

		if ((this.hierarchicalLayoutList == null || this.hierarchicalLayoutList.length == 0) && this.attributeMap == null) {
			// 第1階層の場合hierarchicalLayoutListがなければ階層なし
			// 第1階層以降の場合attributeMapが設定済みでなければ階層なし
			this.isHierarchical = false;
		}

		if (!this.attributeMap) {
			// 第1階層の場合

			this.attributeMap = this.componentService.getAttributeObjectMap(this.attributeTypeLayoutList, this.attributeList, this.hierarchicalLayoutList);

			// 階層の開閉を設定
			this.setAutoExpandChildren(this.hierarchicalLayoutList);
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 階層の開閉を設定します.
	 * 以下のいずれかの条件で開きます.
	 * 1.設定ファイルでデフォルト開く設定がある場合<br>
	 * 2.入力済み項目がある場合<br>
	 * 3.必須属性がある場合
	 * @param layouts 階層レイアウト情報
	 * @return layoutsの中に自動で開く(上記2,3のいずれかの条件を満たす)階層があるかどうか
	 */
	protected setAutoExpandChildren(layouts: EIMHierarchicalLayoutDomain[]): boolean {
		let existsAutoExpand: boolean = false;

		for (let i = 0; i < layouts.length; i++) {
			let layout: any = layouts[i];
			if (layout instanceof EIMHierarchicalGroupDomain) {
				// 初期表示時展開するか設定
				let hierarchicalLayout: EIMHierarchicalGroupDomain = (<EIMHierarchicalGroupDomain>layout);
				let childLayouts: EIMHierarchicalLayoutDomain[] = hierarchicalLayout.hierarchicalLayoutList;
				let existsAutoExpandChildren: boolean = this.setAutoExpandChildren(childLayouts);
				if (existsAutoExpandChildren) {
					existsAutoExpand = true;
				}

				if (existsAutoExpandChildren || hierarchicalLayout.defaultExpand) {
					hierarchicalLayout['_expand'] = true;
				} else {
					hierarchicalLayout['_expand'] = false;
				}
			} else if (layout.attributeTypeLayout) {
				// 必須項目かどうか
				if (layout.attributeTypeLayout.required) {
					existsAutoExpand = true;
					continue;
				}

				// 入力済みかどうか
				let valueList: any[] = this.attributeMap[layout.attributeTypeLayout.id].getValueList();
				let initialValueList: any[] = layout.attributeTypeLayout.getInitialValueList();
				if (valueList.length !== initialValueList.length) {
					existsAutoExpand = true;
					continue;
				}
				for (let j = 0; j < valueList.length; j++) {
					let value = valueList[j];
					let initialValue = initialValueList[j];
					if (layout.attributeTypeLayout.valueType === EIMConstantService.VALUE_TYPE_NAME_CODE) {
						value = value.id;
					} else if (layout.attributeTypeLayout.valueType === EIMConstantService.VALUE_TYPE_NAME_USER
							&& initialValue ===  EIMConstantService.ATTRIBUTE_DEFAULT_VALUE_LOGIN_USER) {
						value = value.id;
						initialValue = this.cacheService.getLoginUser().id;
					}
					if (value !== initialValue) {
						existsAutoExpand = true;
						break;
					}
				}

			}
		}
		return existsAutoExpand;
	}
}
