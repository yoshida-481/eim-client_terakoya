import {
	Component,
	SimpleChange,
	OnChanges,
	Input,
	SimpleChanges,
	Output,
	EventEmitter,
} from '@angular/core';
import { EIMFlatTypeHierarchicalAttributeListInputFormItemComponentService } from './flat-type-hierarchical-attribute-list-input-form-item.component.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';
import { EIMHierarchicalAttributeListInputFormItemComponent } from 'app/forms/shared/components/hierarchical-attribute-list-input-form-item/hierarchical-attribute-list-input-form-item.component';
import { AttributeTypeLayoutOption } from '../../services/form-attribute-type-layout-option-builder.service';

/**
 *
 * 階層属性リスト入力コンポーネント
 * @example
 *      <eim-hierarchical-attribute-list-input-form-item
 *          [componentService]="attributeListInputFormItemComponentService"
 *          [(attributeList)]="attributeList"
 *          [(attributeTypeLayoutList)]="attributeTypeLayoutList"
 *          [(hierarchicalLayoutList)]="hierarchicalLayoutList"
 *          [disabled]="disabled"
 *          [form]="form"
 *          [statusTypeId]="statusTypeId">
 *      </eim-hierarchical-attribute-list-input-form-item>
 */
@Component({
    selector: 'eim-flat-type-hierarchical-attribute-list-input-form-item',
    templateUrl: './flat-type-hierarchical-attribute-list-input-form-item.component.html',
    styleUrls: ['./flat-type-hierarchical-attribute-list-input-form-item.component.css'],
    standalone: false
})
export class EIMFlatTypeHierarchicalAttributeListInputFormItemComponent extends EIMHierarchicalAttributeListInputFormItemComponent {

	/** 親の階層レベル */
	@Input() public parentLevel = 0;

	/** 選択値変更イベントエミッタ */
	@Output() public changed: EventEmitter<any> = new EventEmitter<any>();

	/** 表示情報 */
	@Input() public attributeTypeLayoutOption: AttributeTypeLayoutOption = {
		// 業務タイプ定義名称
		businessTypeDefinitionName: '',
		// 帳票タイプ定義名称
		formTypeDefinitionName: '',
		// 属性タイプ定義名称と上メッセージのMap
		attributeTypeDefinitionNameAndTopMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称と下メッセージのMap
		attributeTypeDefinitionNameAndBottomMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称と左メッセージのMap
		attributeTypeDefinitionNameAndLeftMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称と下メッセージのMap
		attributeTypeDefinitionNameAndRightMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称と入力部品のオプションパラメータのMap
		attributeTypeDefinitionNameAndOptionParamsMap: new Map<string, any>(),
		// // 非表示属性タイプ定義名称Set
		unvisibleAttributeTypeDefinitionNameSet: new Set<string>(),
		// ラベル非表示属性タイプ定義名称Set
		unvisibleLabelAttributeTypeDefinitionNameSet: new Set<string>(),
		// 非活性属性タイプ定義名称Set
		disabledAttributeTypeDefinitionNameSet: new Set<string>(),
	};
	
	/** 本コンポーネントの階層レベル（親の階層レベル+1） */
	public level = 1; // 3階層目以降ならグループラベル表示にする

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeListInputFormItemComponentService: EIMFlatTypeHierarchicalAttributeListInputFormItemComponentService,
			protected cacheService: EIMFormsCacheService,
	) {
		super(attributeListInputFormItemComponentService, cacheService);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChange) {
		super.ngOnChanges(changes);

		this.level = this.parentLevel + 1;
	}


	/**
	 * 値変更後のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangeValue(event): void {
		// 選択値変更イベントをエミット
		this.changed.emit(event);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	
}
