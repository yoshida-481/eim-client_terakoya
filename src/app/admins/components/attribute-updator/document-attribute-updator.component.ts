import { EIMDataTypeDomain } from 'app/admins/shared/domains/dataType.domain';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMAdminsAttributeDomainService } from './../../shared/services/admins-attribute-domain.service';
import { Dropdown } from 'primeng/dropdown';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMAttributeUpdatorComponent } from 'app/admins/components/attribute-updator/attribute-updator.component';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';


/**
 * ドキュメント用属性更新コンポーネント
 * @example
 *
 *      <eim-document-attribute-updator
 *          [dataTypeList]="dataTypeList"
 *          [attributeType]="attributeType">
 *      </eim-document-attribute-updator>
 */
@Component({
    selector: 'eim-document-attribute-updator',
    templateUrl: './document-attribute-updator.component.html',
    styleUrls: ['./document-attribute-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentAttributeUpdatorComponent) }
    ],
    standalone: false
})
export class EIMDocumentAttributeUpdatorComponent extends EIMAttributeUpdatorComponent implements OnInit, EIMUpdatable {
	/** 属性フォーム */
	@ViewChild('customAttributeUpdatorForm', { static: true }) customAttributeUpdatorForm: NgForm;

	/** UIコントロールコンボボックス */
	@ViewChild('uiControlDropdown', { static: true }) uiControlDropdown: Dropdown;

	/** データ型リスト */
	@Input() dataTypeList: EIMDataTypeDomain[];

	/** UIコントロールリスト */
	public uiControlSelectItems: SelectItem[] = [];

	/** 入力規則チェック時用ダミーUIコントロールリスト */
	public listUIControlList: any = [{label: '　', value: null}];

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

	/** 入力規則 */
	public inputRule = false;

	/** UIコントロール操作不可フラグ(オブジェクト型の際) */
	public uiControlDisabled = false;

	/** 入力規則選択不可フラグ */
	public disableRule = false;

	/** UIコントロール */
	public uiControlType = '';

	/** コードリスト */
	public codeItems: SelectItem[] = [{label: null, value: null}];

	/** 選択可能データ型リスト */
	public dataTypeSelectItems: SelectItem[] = [
		{label: this.translateService.instant('EIM.VALUETYPE.LONG'), value: EIMAdminsConstantService.VALUE_TYPE_INTEGER},
		{label: this.translateService.instant('EIM.VALUETYPE.STRING'), value: EIMAdminsConstantService.VALUE_TYPE_STRING},
		{label: this.translateService.instant('EIM.VALUETYPE.DATE'), value: EIMAdminsConstantService.VALUE_TYPE_DATE},
		{label: this.translateService.instant('EIM.VALUETYPE.TEXT'), value: EIMAdminsConstantService.VALUE_TYPE_TEXT},
		{label: this.translateService.instant('EIM.VALUETYPE.DOUBLE'), value: EIMAdminsConstantService.VALUE_TYPE_DOUBLE},
		{label: this.translateService.instant('EIM.VALUETYPE.OBJECT'), value: EIMAdminsConstantService.VALUE_TYPE_OBJECT},
		{label: this.translateService.instant('EIM.VALUETYPE.USER'), value: EIMAdminsConstantService.VALUE_TYPE_USER},
		{label: this.translateService.instant('EIM.VALUETYPE.CODE'), value: EIMAdminsConstantService.VALUE_TYPE_CODE},
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
	 * 属性を更新します.
	 */
	public update(): void {
		this.attributeType.definitionName = this.definitionName;
		this.attributeType.valTypeId = this.dataType;
		this.attributeType.isMultiple = this.checkMultiple;
		this.setOtherName(this.attributeType);
		this.attributeType.initValueList = this.default.getDefaultList();
		this.attributeType.uicontrolId = this.uiControlType
		this.attributeType.inputRuleCheck = this.inputRule;
		this.attributeType.uicontrolName = this.uiControlDropdown.selectedOption.label;
		this.attributeType.refmasterTypeName = this.uiControlDropdown.selectedOption.refmasterTypeName;
		// ドキュメントシステム管理では入力項目がない項目を定義
		this.attributeType.namespace = '';
		this.attributeType.required = false;

		// 更新処理実行
		this.attributeService.updateForDocument(this.attributeType).subscribe(
			(data: EIMAttributeTypeDTO) => {
				this.updated.emit([data]);
			}
		);
	}

	/**
	 * 属性更新可否を返却します.
	 * @return 属性更新可否
	 */
	public updatable(): boolean {
		return this.customAttributeUpdatorForm.valid && this.customAttributeUpdatorForm.dirty;
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
		this.inputRule = this.attributeType.inputRuleCheck;
		this.onDataChange();
		this.uiControlType = this.attributeType.uicontrolId;
		this.codeType = this.attributeType.codeTypeName;
		for (let i = 0; i < this.attributeType.codeList.length; i++) {
			this.codeItems.push({label: this.attributeType.codeList[i].name, value: this.attributeType.codeList[i].id});
		}
		this.default.codeItems = this.codeItems;
		this.default.uiControlType = this.uiControlType;
		this.default.setDefault(this.attributeType.initValueList);
		this.uiControlDisabled = this.dataType === EIMAdminsConstantService.VALUE_TYPE_OBJECT
	}

	/**
	 * 入力値変更時イベントハンドラです.
	 * @param event イベント
	 */
	onDataChange(event?: any): void {
		if (this.dataType === EIMAdminsConstantService.VALUE_TYPE_OBJECT
				|| this.dataType === EIMAdminsConstantService.VALUE_TYPE_USER || this.dataType === EIMAdminsConstantService.VALUE_TYPE_CODE) {
			// オブジェクト型/ユーザ型/コード型の時、リスト定義は不可
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
