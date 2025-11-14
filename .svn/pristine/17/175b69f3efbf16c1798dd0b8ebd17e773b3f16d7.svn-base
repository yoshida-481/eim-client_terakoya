import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMDataTypeDomain } from 'app/admins/shared/domains/dataType.domain';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { Dropdown } from 'primeng/dropdown';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMAttributeUpdatorComponent } from 'app/admins/components/attribute-updator/attribute-updator.component';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';

/**
 * 帳票用属性登録コンポーネント
 * @example
 *
 *      <eim-form-attribute-updator
 *          [nameList]="nameList"
 *          [path]="path"
 *          [codeType]="codeType">
 *      </eim-form-attribute-updator>
 */
@Component({
    selector: 'eim-form-attribute-updator',
    templateUrl: './form-attribute-updator.component.html',
    styleUrls: ['./form-attribute-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormAttributeUpdatorComponent) }
    ],
    standalone: false
})

export class EIMFormAttributeUpdatorComponent extends EIMAttributeUpdatorComponent implements OnInit, EIMUpdatable {
	/** 属性フォーム */
	@ViewChild('attributeUpdatorForm', { static: true }) attributeUpdatorForm: NgForm;

	/** UIコントロールコンボボックス */
	@ViewChild('uiControlDropdown', { static: true }) uiControlDropdown: Dropdown;

	/** データ型リスト */
	@Input() dataTypeList: EIMDataTypeDomain[];

	/** 必須項目チェックボックス */
	public essential = false;

	/** UIコントロールリスト */
	public uiControlSelectItems: SelectItem[] = [];

	/** コードリスト */
	public codeItems: SelectItem[] = [{label: '　', value: ''}];

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
	public update(): void {
		this.attributeType.definitionName = this.definitionName;
		this.attributeType.namespace = this.inputNamespace;
		this.attributeType.valTypeId = this.dataType;
		this.attributeType.isMultiple = this.checkMultiple;
		this.setOtherName(this.attributeType);
		this.attributeType.initValueList = this.default.getDefaultList();
		this.attributeType.required = this.essential;
		this.attributeType.uicontrolId = this.uiControlType;
		this.attributeType.uicontrolName = this.uiControlDropdown.selectedOption.label;
		this.attributeType.refmasterTypeName = this.uiControlDropdown.selectedOption.refmasterTypeName;
		// 帳票システム管理では入力項目がない項目を定義
		this.attributeType.inputRuleCheck = false;
		this.attributeType.namespace = EIMAdminsConstantService.NAMESPACE_FORM_USER;

		// 更新処理実行
		this.attributeService.updateForForm(this.attributeType).subscribe(
			(data: EIMAttributeTypeDTO) => {
				this.updated.emit([data]);
			}
		);
	}

	/**
	 * 属性登録可否を返却します.
	 * @return 属性登録可否
	 */
	public updatable(): boolean {
		return this.attributeUpdatorForm.dirty && this.attributeUpdatorForm.valid && this.uiControlType != null;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.init();
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
		this.essential = this.attributeType.required;

		if (this.checkMultiple) {
			this.uiControlSelectItems = this.defaultMultipleUIControlList[this.dataType];
		} else {
			this.uiControlSelectItems = this.defaultUIControlList[this.dataType];
		}
		this.uiControlType = this.attributeType.uicontrolId;
		this.codeType = this.attributeType.codeTypeName;
		for (let i = 0; i < this.attributeType.codeList.length; i++) {
			this.codeItems.push({label: this.attributeType.codeList[i].name, value: this.attributeType.codeList[i].id});
		}
		// コード型の場合、コード選択欄を必須とする.
		this.requiredCodeTypeFlag = this.dataType === EIMAdminsConstantService.VALUE_TYPE_CODE;
		this.default.codeItems = this.codeItems;
		this.default.uiControlType = this.uiControlType;
		this.default.setDefault(this.attributeType.initValueList);
	}

	/**
	 * コードタイプ選択画面呼び出しのイベントハンドラです.
	 * @param event イベント
	 */
	onCodeTypeSelect(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showCodeTypeSelector({
			selected: (data: EIMCodeTypeDomain) => {
				this.attributeUpdatorForm.form.markAsDirty();
				this.attributeType.codeTypeId = data.id;
				this.attributeType.codeTypeName = data.definitionName;
				this.codeType = data.definitionName;
				let codeItems: SelectItem[] = [{label: '　', value: null}];
				let codeList = data.codeList;
				for (let i = 0; i < codeList.length; i++) {
					if (!codeList[i].disable) {
						codeItems.push({label: codeList[i].name, value: codeList[i].id});
					}
				}
				this.codeItems = codeItems;
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * コードタイプ削除メニュー押下時イベントハンドラです.
	 * @param event イベント
	 */
	onClear(event: any): void {
		this.attributeType.codeTypeId = null
		this.attributeType.codeTypeName = null
		this.codeType = null;
		this.codeItems = [];
	}

	/**
	 * 入力データ変更時イベントハンドラです.
	 * @param event イベント
	 */
	onDataChange(event: any): void {
		if (this.checkMultiple) {
			this.uiControlSelectItems = this.defaultMultipleUIControlList[this.dataType];
		} else {
			this.uiControlSelectItems = this.defaultUIControlList[this.dataType];
		}
		window.setTimeout(() => {
			this.uiControlType = this.uiControlDropdown.selectedOption.value;
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
}
