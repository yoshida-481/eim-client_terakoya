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
	AfterViewInit,
	SimpleChanges
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { EIMAttributeService } from 'app/shared/services/attribute.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';

import { EIMAttributeListInputFormItemComponentService } from './attribute-list-input-form-item.component.service';

/**
 *
 * 属性リスト入力コンポーネント
 * @example
 *      <eim-attribute-list-input-form-item
 *          [componentService]="attributeListInputFormItemComponentService"
 *          [(attributeList)]="attributeList"
 *          [(attributeTypeLayoutList)]="attributeTypeLayoutList"
 *          disabled="false"
 *          [form]="form"
 *          [statusTypeId]="statusTypeId">
 *      </eim-attribute-list-input-form-item>
 */
@Component({
    selector: 'eim-attribute-list-input-form-item',
    templateUrl: './attribute-list-input-form-item.component.html',
    styleUrls: ['./attribute-list-input-form-item.component.css'],
    standalone: false
})
export class EIMAttributeListInputFormItemComponent implements OnChanges {

	/** コンポーネントサービス */
	@Input()
		public componentService: EIMAttributeListInputFormItemComponentService;

	/** 属性レイアウト配列 */
	@Input() public attributeTypeLayoutList:EIMAttributeTypeLayoutDomain[] = null;

	/** 属性配列 */
	@Input() public attributeList:EIMAttributeDomain[] = null;

	/** フォームグループ */
	@Input() public form: UntypedFormGroup;

	/** 属性レイアウト配列 */
	@Input() public disabled = false;

	/** ステータスタイプID */
	@Input() public statusTypeId: number;

	/** 対応するレイアウトと属性の配列 */
	public layoutAndAttributeList: any[];


	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeListInputFormItemComponentService: EIMAttributeListInputFormItemComponentService,
	) {}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges) {
		if (!this.componentService) {
			this.componentService = this.attributeListInputFormItemComponentService;
		}

		if ((!(<any>changes).attributeTypeLayoutList || (<any>changes).attributeTypeLayoutList.currentValue == null)
				&& (!(<any>changes).attributeList || (<any>changes).attributeList.currentValue == null)) {
			return;
		}

		this.layoutAndAttributeList = this.componentService.getVisibleLayoutAndAttributeList(this.attributeTypeLayoutList, this.attributeList);
	}

}
