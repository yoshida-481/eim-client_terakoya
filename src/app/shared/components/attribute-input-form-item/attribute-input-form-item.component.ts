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
import { UntypedFormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMSearchMasterDisplayConfigDomain } from 'app/shared/domains/search-master-display-config.domain';

import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 *
 * 属性入力コンポーネントです。<br/>
 * @class EIMAttributeInputFormItemComponent
 * @module EIMSharedComponentModule
 * @constructor
 * @example
 *      <eim-attribute-input-form-item
 *          [form]="form"
 *          [(attribute)]="attribute"
 *          [(attributeTypeLayout)]="attributeTypeLayout"
 *          [disable]="false"
 *          [dirty]="false"
 *          [statusTypeId]="statusTypeId">
 *      </eim-attribute-input-form-item>
 */
@Component({
    selector: 'eim-attribute-input-form-item',
    templateUrl: './attribute-input-form-item.component.html',
    styleUrls: ['./attribute-input-form-item.component.css'],
    standalone: false
})
export class EIMAttributeInputFormItemComponent implements OnInit {

	/** 属性レイアウト */
	@Input() public attributeTypeLayout: EIMAttributeTypeLayoutDomain = null;

	/** 属性 */
	@Input() public attribute: EIMAttributeDomain = null;

	/** 無効かどうか */
	@Input() public disabled = false;

	/** フォームグループ */
	@Input() public form: UntypedFormGroup;

	/** 編集したかどうか */
	@Input() public dirty = false;

	/** ステータスタイプID */
	@Input() public statusTypeId: number;

	/** UIコントロールID */
	public uiControlId: string;
	/** UIコントロールタイプ */
	public uiControlType: string;
	/** フォームコントローラの名前 */
	public name: string;
	/** ラベル */
	public label: string;
	/** 必須かどうか */
	public required: boolean;
	/** 最大文字数 */
	public maxLength: number;
	/** パターン */
	public pattern: string;
	/** 複数値属性かどうか */
	public multiple: boolean;
	/** 親オブジェクトID */
	public pearentObjId = '';
	/** 値 */
	public value: any[] = [];
	/** コード一覧 */
	public options: any[] = [];
	/** 参照タイプマスタの画面定義 */
	public searchMasterDisplayConfig: EIMSearchMasterDisplayConfigDomain;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
	) { }

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
		this.uiControlId = this.attributeTypeLayout.uiControlId;
		this.uiControlType = this.attributeTypeLayout.uiControlType;
		if (this.statusTypeId) {
			this.name = "attr_" + this.attribute.attributeType.id + "_" + this.statusTypeId;
		} else {
			this.name = 'attr_' + this.attribute.attributeType.id;
		}
		this.label = this.attribute.attributeType.name;
		this.required = this.attributeTypeLayout.required;
		this.multiple = this.attributeTypeLayout.multiple;
		this.pearentObjId = this.attributeTypeLayout.pearentObjId;
		this.disabled = this.disabled;

		switch (this.attributeTypeLayout.valueType) {
			case 'LONG':
				this.value = this.attribute.longList;
				this.maxLength = EIMConstantService.NUMBER_MAX_LENGTH;
				this.pattern = EIMConstantService.NUMBER_PATTERN;
				break;
			case 'DATE':
				this.value = this.attribute.dateList;
				break;
			case 'DOUBLE':
				this.value = this.attribute.doubleList;
				this.maxLength = EIMConstantService.REAL_NUMBER_MAX_LENGTH;
				this.pattern = EIMConstantService.REAL_PATTERN;
				break;
			case 'TEXT':
				this.value = this.attribute.textList;
				// テキストは文字数制限しない
				// this.maxLength = EIMDocumentsConstantService.TEXT_MAX_LENGTH;
				break;
			case 'STRING':
				this.value = this.attribute.stringList;
				this.maxLength = EIMConstantService.STRING_MAX_LENGTH;
				break;
			case 'OBJECT':
				this.value = this.attribute.objectList;
				break;
			case 'USER':
				this.value = this.attribute.userList;
				break;
			case 'CODE':
				this.value = this.attribute.codeList;
				break;
		}

		// コード一覧生成
		if (this.attributeTypeLayout.codeType != null) {

			let options: any[] = [];

			// コンボボックスの場合のみ先頭に未選択用のカラムを追加
			if (this.uiControlId == 'uIControlComboBox') {
				options.push({ label: '　', value: null });
			}

			//無効フラグがONの値が設定されている場合は、カラムに表示する
			for (let x = 0; x < this.attributeTypeLayout.codeType.codeList.length; x++) {
				let code = this.attributeTypeLayout.codeType.codeList[x];
				if (code.disable === true) {
					//単数
					if (!this.multiple) {
						if (this.attribute.codeList.length == 0) {
							continue;
						} else {
							if (code.id != this.attribute.codeList[0].id) {
								continue;
							}
						}
						//複数
					} else {
						if (this.attribute.codeList.length == 0) {
							continue;
						} else {
							let isCodeDisableFlag: boolean = false;
							for (let y = 0; y < this.attribute.codeList.length; y++) {
								if (code.id == this.attribute.codeList[y].id) {
									isCodeDisableFlag = true
								}
							}
							if (!isCodeDisableFlag) {
								continue;
							}
						}
					}
				}
				options.push({ label: code.name, value: code });
			}
			this.options = options;

			// options(リスト)内の選択行とvalue（選択行）のインスタンスを合わせる必要がある。
			let codeMap: Map<string, any> = new Map<string, any>();
			for (let i = 0; i < this.options.length; i++) {
				if (!this.options[i].value || !this.options[i].value.code) {
					continue;
				}
				codeMap.set(this.options[i].value.code, this.options[i].value)
			}

			for (let i = 0; i < this.attribute.codeList.length; i++) {
				if ((<any>this.attribute.codeList[i]) == '') {
					continue;
				}
				this.attribute.codeList[i] = codeMap.get(this.attribute.codeList[i].code);

			}
		}

		this.searchMasterDisplayConfig = this.attributeTypeLayout.searchMasterDisplayConfig;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}