import { EIMDataTypeDomain } from 'app/admins/shared/domains/dataType.domain';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { Dropdown } from 'primeng/dropdown';
import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMAttributeCreatorComponent } from 'app/admins/components/attribute-creator/attribute-creator.component';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

/**
 * ドキュメント用属性登録コンポーネント
 * @example
 *
 *      <eim-document-attribute-creator
 *          [dataTypeList]="dataTypeList">
 *      </eim-document-attribute-creator>
 */
@Component({
  selector: 'eim-document-attribute-creator',
  templateUrl: './document-attribute-creator.component.html',
  styleUrls: ['./document-attribute-creator.component.css'],
  providers: [
    {provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentAttributeCreatorComponent)}
  ],
  standalone: false,
})

export class EIMDocumentAttributeCreatorComponent extends EIMAttributeCreatorComponent implements OnInit, EIMCreatable {
	/** 属性フォーム */
	@ViewChild('customAttributeCreatorForm', { static: true }) customAttributeCreatorForm: NgForm;

	/** UIコントロールコンボボックス */
	@ViewChild('uiControlDropdown', { static: true }) uiControlDropdown: Dropdown;

	/** データ型リスト */
	@Input() dataTypeList: EIMDataTypeDomain[];

	/** UIコントロールリスト */
	public uiControlSelectItems: SelectItem[] = [];

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

	/** リスト値選択時用ダミーUIコントロールリスト */
	public listUIControlList: any = [{label: '　', value: null}];

	/** 入力規則 */
	public inputRule = false;

	/** 入力規則選択不可フラグ */
	public disableRule = false;

	/** UIコントロール */
	public uiControlType = '';

	/** 選択可能データ型リスト */
	public dataTypeSelectItems: SelectItem[] = [
		{label: this.translateService.instant('EIM.VALUETYPE.LONG'), value: EIMAdminsConstantService.VALUE_TYPE_INTEGER},
		{label: this.translateService.instant('EIM.VALUETYPE.STRING'), value: EIMAdminsConstantService.VALUE_TYPE_STRING},
		{label: this.translateService.instant('EIM.VALUETYPE.DATE'), value: EIMAdminsConstantService.VALUE_TYPE_DATE},
		{label: this.translateService.instant('EIM.VALUETYPE.TEXT'), value: EIMAdminsConstantService.VALUE_TYPE_TEXT},
		{label: this.translateService.instant('EIM.VALUETYPE.DOUBLE'), value: EIMAdminsConstantService.VALUE_TYPE_DOUBLE},
		{label: this.translateService.instant('EIM.VALUETYPE.OBJECT'), value: EIMAdminsConstantService.VALUE_TYPE_OBJECT},
		{label: this.translateService.instant('EIM.VALUETYPE.USER'), value: EIMAdminsConstantService.VALUE_TYPE_USER},
	];

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
		attribute.uicontrolId = this.uiControlType;
		attribute.inputRuleCheck = this.inputRule;
		attribute.uicontrolName = this.uiControlDropdown.selectedOption.label;
		attribute.uicontrolType = this.uiControlDropdown.selectedOption.type;
		attribute.refmasterTypeName = this.uiControlDropdown.selectedOption.refmasterTypeName;

		// ドキュメントシステム管理では入力項目がない項目を定義
		attribute.namespace = '';
		attribute.required = false;

		// 登録処理実行
		this.attributeService.createForDocument(attribute).subscribe(
			(data: EIMAttributeTypeDTO) => {
				this.created.emit([data]);
			},
			(err: any) => {
		});
	}

	/**
	 * 属性登録可否を返却します.
	 * @return 属性登録可否
	 */
	public creatable(): boolean {
		return this.customAttributeCreatorForm.valid;
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
		window.setTimeout(() => {this.uiControlType = this.uiControlSelectItems[0]?.value; });
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

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 各入力値変更後の各項目の活性状態を制御します.
	 */
	private enableInput(): void {
		if (this.dataType === EIMAdminsConstantService.VALUE_TYPE_OBJECT || this.dataType === EIMAdminsConstantService.VALUE_TYPE_USER) {
			// オブジェクト型かユーザ型の時、リスト定義は不可
			this.disableRule = true;
			this.inputRule = false;
		} else {
			this.disableRule = false;
		}
		if (this.inputRule) {
			this.uiControlSelectItems = this.listUIControlList;
			return;
		}
		if (this.checkMultiple) {
			this.uiControlSelectItems = this.defaultMultipleUIControlList[this.dataType];
		} else {
			this.uiControlSelectItems = this.defaultUIControlList[this.dataType];
		}
	}

}
