import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';
import { EIMDateService } from 'app/shared/services/date.service';
import {
	Component,
	ComponentRef,
	ComponentFactory,
	EventEmitter,
	NgModule,
	OnInit,
	OnDestroy,
	ViewContainerRef,
	SimpleChange,
	OnChanges,
	Input,
	ViewChild,
	AfterViewInit
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { UntypedFormGroup, NgForm } from '@angular/forms';

/**
 *
 * ユーザ属性値設定コンポーネントです。<br/>
 * @example
 *      <eim-user-attribute-input-form-item
 *          [form]="form"
 *          [attribute]="attribute">
 *      </eim-user-attribute-input-form-item>
 */
@Component({
    selector: 'eim-user-attribute-input-form-item',
    templateUrl: './user-attribute-input-form-item.component.html',
    styleUrls: ['./user-attribute-input-form-item.component.css'],
    standalone: false
})
export class EIMUserAttributeInputFormItemComponent implements OnInit {

	/** フォーム */
	@Input() public form: UntypedFormGroup;
	/** ユーザ属性用属性タイプ */
	@Input() public attribute: EIMUserAttributeDTO;
	/** pTooltipで表示する非省略ラベル文言が必要かどうか */
	@Input() public pTooltipLabelFlg = false;
	/** 属性名称 */
	public label: string;
	/** データ型 */
	public valTypeId = 0;
	/** 複数値属性かどうか */
	public multiple = false;
	/** フォームコントローラの名前 */
	public name: string;
	/** 数値型最大文字数 */
	public numberMaxLength: number = EIMConstantService.NUMBER_MAX_LENGTH;
	/** 数値型最大文字数 */
	public realMaxLength: number = EIMConstantService.REAL_NUMBER_MAX_LENGTH
	/** 文字列型最大文字数 */
	public stringMaxLength: number = EIMConstantService.STRING_MAX_LENGTH;
	/** 数値型パターン */
	public numberPattern: string =  EIMConstantService.NUMBER_PATTERN;
	/** 実数型パターン */
	public realPattern: string =  EIMConstantService.REAL_PATTERN;
	/** 入力値 */
	public value: any[] = [];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		private dateService: EIMDateService,
	) {
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
		this.valTypeId = this.attribute.valTypeId;
		this.value = this.attribute.attMultipleList;
		this.label = this.attribute.attTypeName;
		this.multiple = this.attribute.isMultiple;
		this.name = 'attr_' + this.attribute.attTypeName;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

}
