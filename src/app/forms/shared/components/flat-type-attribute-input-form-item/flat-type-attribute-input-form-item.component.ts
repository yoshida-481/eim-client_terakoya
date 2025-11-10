import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
} from '@angular/core';
//import { formDirectiveProvider } from '@angular/forms/src/directives/reactive_directives/form_group_directive';
import { TranslateService } from '@ngx-translate/core';
import { EIMAttributeInputFormItemComponent } from 'app/shared/components/attribute-input-form-item/attribute-input-form-item.component';
//import { ColorPicker } from 'primeng/primeng';
import { EIMAttributeTypeLayoutDTO } from 'app/shared/dtos/attribute-type-layout.dto';
import { AttributeTypeLayoutOption } from '../../services/form-attribute-type-layout-option-builder.service';
import { EIMSearchMasterDisplayConfigDomain } from 'app/shared/domains/search-master-display-config.domain';

/**
 *
 * 属性入力コンポーネントです。<br/>
 * @example
 *      <eim-flat-type-attribute-input-form-item
 *          [form]="form"
 *          [(attribute)]="attribute"
 *          [(attributeTypeLayout)]="attributeTypeLayout"
 *          [disabled]="false"
 *          [dirty]="false"
 *          [statusTypeId]="statusTypeId">
 *      </eim-flat-type-attribute-input-form-item>
 */
@Component({
    selector: 'eim-flat-type-attribute-input-form-item',
    templateUrl: './flat-type-attribute-input-form-item.component.html',
    styleUrls: ['./flat-type-attribute-input-form-item.component.css'],
    standalone: false
})

export class EIMFlatTypeAttributeInputFormItemComponent extends EIMAttributeInputFormItemComponent implements OnInit {

	// 表示情報
	@Input() public attributeTypeLayoutOption: AttributeTypeLayoutOption = {
		// 業務タイプ定義名称
		businessTypeDefinitionName: '',
		// // 帳票タイプ定義名称
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
		// 非表示属性タイプ定義名称Set
		unvisibleAttributeTypeDefinitionNameSet: new Set<string>(),
		// ラベル非表示属性タイプ定義名称Set
		unvisibleLabelAttributeTypeDefinitionNameSet: new Set<string>(),
		// 非活性属性タイプ定義名称Set
		disabledAttributeTypeDefinitionNameSet: new Set<string>(),
	};

	/** 選択値変更イベントエミッタ */
	@Output() public changed: EventEmitter<any> = new EventEmitter<any>();

	@Output() public csvDownloadFormTypeMap: Map<string, EIMAttributeTypeLayoutDTO[]> = new Map<string, EIMAttributeTypeLayoutDTO[]>();

	/**  入力制限　*/
	@Input() public restriction = '';

	/** カンマ区切り表示するかどうか */
	public enableSeparate: boolean;

	/** 入力欄下のメッセージ */
	public topMessage = '';
	public bottomMessage ='';
	public leftMessage = '';
	public rightMessage = '';

	/** 時分秒を表示するかどうか */
	public showTimeAttributeDefinitionNameSet = new Set();

	/** 属性タイプの型 */
	public valueType: string;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
	) {
		super(translateService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		super.ngOnInit();

		// ラベル非表示切り替え.
		if (this.attributeTypeLayoutOption.unvisibleLabelAttributeTypeDefinitionNameSet.has(this.attribute.attributeType.definitionName)) {
			this.label = null;
		}

		// 非活性設定
		if (this.attributeTypeLayoutOption.disabledAttributeTypeDefinitionNameSet.has(this.attribute.attributeType.definitionName)) {
			this.disabled = true;
		};

		// 入力制限
		switch (this.attributeTypeLayout.valueType) {
			case 'LONG':
				// 属性タイプの型（LONG）を取得
				this.valueType = this.attributeTypeLayout.valueType;
				// 入力部品のオプションパラメータ
				let optionParams = this.attributeTypeLayoutOption.attributeTypeDefinitionNameAndOptionParamsMap.get(this.attribute.attributeType.definitionName);
				if (optionParams) {
					this.restriction = optionParams.restriction;
					this.maxLength = optionParams.maxlength;
					this.enableSeparate = optionParams.enableSeparate;
				}
				break;
			case 'DOUBLE':
				// 属性タイプの型（DOUBLE）を取得
				this.valueType = this.attributeTypeLayout.valueType;
				// 入力部品のオプションパラメータ
				let doubleOptionParams = this.attributeTypeLayoutOption.attributeTypeDefinitionNameAndOptionParamsMap.get(this.attribute.attributeType.definitionName);
				if (doubleOptionParams) {
					this.restriction = doubleOptionParams.restriction;
					this.maxLength = doubleOptionParams.maxlength;
					this.enableSeparate = doubleOptionParams.enableSeparate;
				}
				break;
		}

		// 上下左右メッセージ設定メソッド呼び出し.
		this.setMesseage();
	}

	/**
	 * 値変更後のイベントハンドラです.
	 * @param event イベント
	 */
	public onChange(event): void {
		// 選択値変更イベントをエミット
		event.attribute = this.attribute;
		this.changed.emit(event);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 表示情報から設定した上下左右メッセージをプロパティに代入するメソッドです.
	 */
	protected setMesseage(): void {
		// 属性タイプ定義名称を取得
		let attributeDefName = this.attribute.attributeType.definitionName;
		// 各メッセージに値を代入
		this.topMessage = this.attributeTypeLayoutOption.attributeTypeDefinitionNameAndTopMessageMap.get(attributeDefName);
		this.bottomMessage = this.attributeTypeLayoutOption.attributeTypeDefinitionNameAndBottomMessageMap.get(attributeDefName);
		this.leftMessage = this.attributeTypeLayoutOption.attributeTypeDefinitionNameAndLeftMessageMap.get(attributeDefName);
		this.rightMessage = this.attributeTypeLayoutOption.attributeTypeDefinitionNameAndRightMessageMap.get(attributeDefName);
	}
}
