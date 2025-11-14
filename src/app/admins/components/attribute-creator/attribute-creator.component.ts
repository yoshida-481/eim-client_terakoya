import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMAttributeDefaultComponent } from 'app/admins/components/attribute-default/attribute-default.component';
import { EIMSpnameDTO } from 'app/admins/shared/dtos/spname.dto';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * 属性登録コンポーネント
 * @example
 *
 *      <eim-attribute-creator>
 *      </eim-attribute-creator>
 */
@Component({
  selector: 'eim-attribute-creator',
  templateUrl: './attribute-creator.component.html',
  styleUrls: ['./attribute-creator.component.css'],
  providers: [
    {provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeCreatorComponent)}
  ],
  standalone: false,
})

export class EIMAttributeCreatorComponent implements OnInit, EIMCreatable {
	/** 属性フォーム */
	@ViewChild('attributeCreatorForm', { static: true }) attributeCreatorForm: NgForm;

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
	public dataType = EIMAdminsConstantService.VALUE_TYPE_INTEGER;

	/** 定義名称 */
	public definitionName = '';

	/** 選択ネームスペース */
	public inputNamespace = '';

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();


	/** ネームスペースリスト */
	public namespaceSelectItems: SelectItem[] = [{label: this.translateService.instant('EIM_ADMINS.LABEL_02043'), value: ''}];

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

	/** コードタイプ名称 */
	public codeTypeName: string;

	/** コードタイプID */
	public codeTypeId: number;

	/** コードタイプ必須フラグ */
	public requiredCodeTypeFlag = false;

	/** コード型以外選択時用退避コードタイプ名称 */
	protected tempCodeTypeName: string;

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
	 * 属性を登録します.
	 */
	public create(): void {
		let attribute: EIMAdminAttributeTypeDomain = new EIMAdminAttributeTypeDomain();
		attribute.definitionName = this.definitionName;
		attribute.namespace = this.inputNamespace;
		attribute.valTypeId = this.dataType;
		attribute.isMultiple = this.checkMultiple;
		attribute.codeTypeId = this.codeTypeId;
		attribute.codeTypeName = this.codeTypeName;
		this.setOtherName(attribute);
		attribute.defValueList = this.default.getDefaultList();
		// 汎用システム管理では入力項目がない項目を定義
		attribute.required = false;
		attribute.inputRuleCheck = false;
		// 登録処理実行
		this.attributeService.create(attribute).subscribe(
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
		return this.namespaceSelectItems.length > 0 && this.attributeCreatorForm.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/** データ型変更時のイベントハンドラです.
	 * @param event イベント
	 */
	onDataTypeChange(event: any): void {
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
	}
	/**
	 * コードタイプ選択画面呼び出しのイベントハンドラです.
	 * @param event イベント
	 */
	onCodeTypeSelect(event: any): void {
		let dialogId: string = this.adminDialogManagerComponentService.showCodeTypeSelector({
			selected: (data: EIMCodeTypeDomain) => {
				this.codeTypeName = data.definitionName;
				this.tempCodeTypeName = data.definitionName;
				this.codeTypeId = data.id;
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
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		this.attributeService.getNamespaceList().subscribe(
			(namespaceList: EIMSpnameDTO[]) => {
				for (let i = 0; i < namespaceList.length; i++) {
					this.namespaceSelectItems.push({label: namespaceList[i].name, value: namespaceList[i].name});
				}
				this.inputNamespace = '';
			}, (err: any) => {
				this.errored.emit();
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 属性タイプに対し、入力された言語別名称を設定します.
	 * @param attribute 対象属性タイプ
	 */
	protected setOtherName(attribute: EIMAdminAttributeTypeDomain): void {
		for (let i = 0; i < this.languages.length; i++) {
			attribute.lang.push({otherLId: this.languages[i].lang, otherName: this.nameList[this.languages[i].lang]});
		}
		attribute.otherCnt = this.languages.length;
	}
}
