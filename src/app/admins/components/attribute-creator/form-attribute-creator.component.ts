import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMDataTypeDomain } from 'app/admins/shared/domains/dataType.domain';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { Dropdown } from 'primeng/dropdown';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMAttributeCreatorComponent } from 'app/admins/components/attribute-creator/attribute-creator.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';

/**
 * 帳票用属性登録コンポーネント
 * @example
 *
 *      <eim-form-attribute-creator
 *          [nameList]="nameList"
 *          [path]="path"
 *          [codeType]="codeType">
 *      </eim-form-attribute-creator>
 */
@Component({
  selector: 'eim-form-attribute-creator',
  templateUrl: './form-attribute-creator.component.html',
  styleUrls: ['./form-attribute-creator.component.css'],
  providers: [
    {provide: EIMComponent, useExisting: forwardRef(() => EIMFormAttributeCreatorComponent)}
  ],
  standalone: false,
})

export class EIMFormAttributeCreatorComponent extends EIMAttributeCreatorComponent implements OnInit, EIMCreatable {
	/** 属性フォーム */
	@ViewChild('attributeCreatorForm', { static: true }) attributeCreatorForm: NgForm;

	/** UIコントロールコンボボックス */
	@ViewChild('uiControlDropdown', { static: true }) uiControlDropdown: Dropdown;

	/** データ型リスト */
	@Input() dataTypeList: EIMDataTypeDomain[];

	/** 必須項目チェックボックス */
	public essential = false;

	/** UIコントロールリスト */
	public uiControlSelectItems: SelectItem[] = [];

	/** コードリスト */
	public codeItems: SelectItem[] = [];

	/** UIコントロールリスト */
	public defaultUIControlList: any = {
		1: [{label: '　', value: null}],
		2: [{label: '　', value: null}],
		3: [{label: '　', value: null}],
		4: [{label: '　', value: null}],
		5: [{label: '　', value: null}],
		6: [{label: '　', value: null}],
		7: [{label: '　', value: null}],
		8: [{label: '　', value: null}],
	}

	/** 複数選択時UIコントロールリスト */
	public defaultMultipleUIControlList: any = {
		1: [{label: '　', value: null}],
		2: [{label: '　', value: null}],
		3: [{label: '　', value: null}],
		4: [{label: '　', value: null}],
		5: [{label: '　', value: null}],
		6: [{label: '　', value: null}],
		7: [{label: '　', value: null}],
		8: [{label: '　', value: null}],
	}

	/** UIコントロール */
	public uiControlType = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeService: EIMAdminAttributeService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
		super(attributeService, translateService, localStorageService, adminDialogManagerComponentService)
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性を登録します.
	 */
	public create(): void {
		let attribute: EIMAdminAttributeTypeDomain = new EIMAdminAttributeTypeDomain();
		attribute.definitionName = this.definitionName;
		attribute.valTypeId = this.dataType;
		attribute.isMultiple = this.checkMultiple;
		attribute.codeTypeId = this.codeTypeId;
		attribute.codeTypeName = this.codeTypeName;
		this.setOtherName(attribute);
		attribute.initValueList = this.default.getDefaultList();
		attribute.required = this.essential;
		attribute.uicontrolId = this.uiControlType
		attribute.uicontrolName = this.uiControlDropdown.selectedOption.label;
		attribute.uicontrolType = this.uiControlDropdown.selectedOption.type;
		attribute.refmasterTypeName = this.uiControlDropdown.selectedOption.refmasterTypeName;

		// 帳票システム管理では入力項目がない項目を定義
		attribute.inputRuleCheck = false;
		attribute.namespace = EIMAdminsConstantService.NAMESPACE_FORM_USER;
		// 登録処理実行
		this.attributeService.createForForm(attribute).subscribe(
			(data: EIMAttributeTypeDTO) => {
				this.created.emit([data]);
			}
		);
	}

	/**
	 * 属性登録可否を返却します.
	 * @return 属性登録可否
	 */
	public creatable(): boolean {
		return this.attributeCreatorForm.valid && this.uiControlType != null;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		for (let i = 0; i < this.dataTypeList.length; i++) {
			let dataType = this.dataTypeList[i];
			if (dataType.uiControlList.length === 0) {
				continue;
			}
			if (dataType.multiple) {
				this.defaultMultipleUIControlList[dataType.valTypeId] = dataType.uiControlList;
			} else {
				this.defaultUIControlList[dataType.valTypeId] = dataType.uiControlList;
			}
		}
		this.languages = this.localStorageService.getLanguages();
		this.uiControlSelectItems = this.defaultUIControlList[this.dataType];
		window.setTimeout(() => {
			this.uiControlType = this.uiControlSelectItems[0]?.value;
		});
	}

	/**
	 * コードタイプ選択画面呼び出しのイベントハンドラです.
	 * @param event イベント
	 */
	onCodeTypeSelect(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showCodeTypeSelector({
			selected: (data: EIMCodeTypeDomain) => {
				this.codeTypeId = data.id;
				this.codeTypeName = data.definitionName;
				this.tempCodeTypeName = data.definitionName;
				let codeItems: SelectItem[] = [{label: '　', value: null}];
				let codeList = data.codeList;
				for (let i = 0; i < codeList.length; i++) {
					if (!codeList[i].disable) {
						codeItems.push({label: codeList[i].name, value: codeList[i].id});
					}
				}
				this.codeItems = codeItems;
				this.adminDialogManagerComponentService.close(dialogId);
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * コードタイプ削除メニュー押下時イベントハンドラです.
	 * @param event イベント
	 */
	onClear(event: any): void {
		this.codeTypeName = null;
		this.tempCodeTypeName = null;
		this.codeTypeId = null;
		this.codeItems = [];
	}

	/**
	 * データ変更時のイベントハンドラです.
	 * @param event イベント
	 */
	onDataChange(event?: any): void {
		this.enableInput();
		window.setTimeout(() => {
			this.uiControlType = this.uiControlSelectItems[0]?.value;
		});
	}

	/**
	 * 複数値設定フラグ変更時のイベントハンドラです.
	 * @param event イベント
	 */
	onMultipleChange(event?: any): void {
		this.enableInput();
		window.setTimeout(() => {
			if (this.checkMultiple) {
				this.uiControlType = this.defaultMultipleUIControlList[this.dataType][0].value;
			} else {
				this.uiControlType = this.defaultUIControlList[this.dataType][0].value;
			}
		});
	}

	/**
	 * UIコントロール変更時イベントハンドラです.
	 * @param event イベント
	 */
	onUIChange(event: any): void {
		if (this.checkMultiple) {
			this.uiControlSelectItems = this.defaultMultipleUIControlList[this.dataType];
		} else {
			this.uiControlSelectItems = this.defaultUIControlList[this.dataType];
		}
	}

		// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 各入力値変更後の各項目の活性状態を制御します.
	 */
	private enableInput(): void {
		if (this.dataType === EIMAdminsConstantService.VALUE_TYPE_CODE) {
			// コード型の場合、コード選択欄を必須とする.
			this.requiredCodeTypeFlag = true;
			this.codeTypeName = this.tempCodeTypeName;
		} else {
			window.setTimeout(() => {
				this.requiredCodeTypeFlag = false;
				this.codeTypeName = null;
			});
		}
		if (this.checkMultiple) {
			this.uiControlSelectItems = this.defaultMultipleUIControlList[this.dataType];
		} else {
			this.uiControlSelectItems = this.defaultUIControlList[this.dataType];
		}
	}
}
