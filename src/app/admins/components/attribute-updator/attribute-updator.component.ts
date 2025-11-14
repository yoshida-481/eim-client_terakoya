import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import { EIMAttributeDefaultComponent } from 'app/admins/components/attribute-default/attribute-default.component';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';

/**
 * 属性登録コンポーネント
 * @example
 *
 *      <eim-attribute-updator
 *          [nameList]="nameList"
 *          [path]="path"
 *          [codeType]="codeType">
 *      </eim-attribute-updator>
 */
@Component({
    selector: 'eim-attribute-updator',
    templateUrl: './attribute-updator.component.html',
    styleUrls: ['./attribute-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeUpdatorComponent) }
    ],
    standalone: false
})

export class EIMAttributeUpdatorComponent implements OnInit, EIMUpdatable {
	/** 属性フォーム */
	@ViewChild('attributeUpdatorForm', { static: true }) attributeUpdatorForm: NgForm;

	/** デフォルト値(初期値)入力欄 */
	@ViewChild('default', { static: true }) default: EIMAttributeDefaultComponent;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** デフォルト値複数値保持フラグ */
	public checkMultiple = false;

	/** データ型設定値 */
	public dataType = 1;

	public dataTypeName = '';

	/** 定義名称 */
	public definitionName = '';

	/** 選択ネームスペース */
	public inputNamespace = '';

	/** 対象属性タイプ */
	@Input() attributeType: EIMAdminAttributeTypeDomain;

	/** 作成完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** ネームスペースリスト */
	public namespaceSelectItems: SelectItem[] = [{label: this.translateService.instant('EIM_ADMINS.LABEL_02043'), value: ''}];

	/** 選択可能データ型リスト */
	public dataTypeSelectItems: SelectItem[] = [
		{label: this.translateService.instant('EIM.VALUETYPE.LONG'), value: 1},
		{label: this.translateService.instant('EIM.VALUETYPE.STRING'), value: 2},
		{label: this.translateService.instant('EIM.VALUETYPE.DATE'), value: 3},
		{label: this.translateService.instant('EIM.VALUETYPE.TEXT'), value: 4},
		{label: this.translateService.instant('EIM.VALUETYPE.DOUBLE'), value: 5},
		{label: this.translateService.instant('EIM.VALUETYPE.OBJECT'), value: 6},
		{label: this.translateService.instant('EIM.VALUETYPE.USER'), value: 7},
		{label: this.translateService.instant('EIM.VALUETYPE.CODE'), value: 8},
	];

	/** コードタイプ */
	@Input() codeType: string;

	/** コードタイプ必須フラグ */
	public requiredCodeTypeFlag = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeService: EIMAdminAttributeService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService
	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性を更新します.
	 */
	public update(): void {
		this.attributeType.definitionName = this.definitionName;
		this.attributeType.namespace = this.inputNamespace;
		this.attributeType.valTypeId = this.dataType;
		this.attributeType.isMultiple = this.checkMultiple;
		this.setOtherName(this.attributeType);
		this.attributeType.defValueList = this.default.getDefaultList();
		// 汎用システム管理では入力項目がない項目を定義
		this.attributeType.required = false;
		this.attributeType.inputRuleCheck = false;

		// 登録処理実行
		this.attributeService.update(this.attributeType).subscribe(
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
		return this.namespaceSelectItems.length > 0 && this.attributeUpdatorForm.dirty && this.attributeUpdatorForm.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.attributeService.getNamespaceList().subscribe(
			(namespaceList: EIMSpnameDTO[]) => {
				for (let i = 0; i < namespaceList.length; i++) {
					this.namespaceSelectItems.push({label: namespaceList[i].name, value: namespaceList[i].name});
				}
				this.init();
				this.default.setDefault(this.attributeType.defValueList);
			}, (err: any) => {
				this.errored.emit();
		});
	}

	/**
	 * コードタイプ選択画面呼び出しのイベントハンドラです.
	 * @param event イベント
	 */
	onCodeTypeSelect(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showCodeTypeSelector({
			selected: (data: EIMCodeTypeDomain) => {
				this.attributeUpdatorForm.form.markAsDirty();
				this.attributeType.codeTypeName = data.definitionName;
				this.attributeType.codeTypeId = data.id;
				this.codeType = data.definitionName;
				this.adminDialogManagerComponentService.close(dialogId);
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * コードクリアメニュー押下時のイベントハンドラです.
	 * @param event イベント
	 */
	onClear(event: any): void {
		this.attributeType.codeTypeId = null
		this.attributeType.codeTypeName = null
		this.codeType = null;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	protected setOtherName(attribute: EIMAdminAttributeTypeDomain): void {
		attribute.lang = [];
		for (let i = 0; i < this.languages.length; i++) {
			attribute.lang.push({otherLId: this.languages[i].lang, otherName: this.nameList[this.languages[i].lang]});
		}
		attribute.otherCnt = this.languages.length;
	}

	/** 属性更新画面共通の処理を行います. */
	protected init(): void {
		this.languages = this.localStorageService.getLanguages();
		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		// 初期値取得
		this.definitionName = this.attributeType.definitionName.slice(this.attributeType.definitionName.indexOf(':') + 1);
		this.inputNamespace = this.attributeType.namespace;
		this.default.multiple = this.checkMultiple = this.attributeType.isMultiple;
		this.dataTypeName = this.attributeType.valTypeName;
		for (let i = 0; i < this.dataTypeSelectItems.length; i++) {
			if (this.dataTypeSelectItems[i].label === this.dataTypeName) {
				this.default.valTypeId = this.dataType = this.dataTypeSelectItems[i].value;
				break;
			}
		}
		let otherNameList = this.attributeType.lang;
		for (let i = 0; i < otherNameList.length; i++) {
			this.nameList[otherNameList[i].otherLId] = otherNameList[i].otherName;
		}
		// コード型の場合、コード選択欄を必須とする.
		this.requiredCodeTypeFlag = this.dataType === EIMAdminsConstantService.VALUE_TYPE_CODE;
		this.codeType = this.attributeType.codeTypeName;
	}
}
