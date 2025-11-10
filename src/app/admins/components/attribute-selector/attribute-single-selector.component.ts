import { EIMAttributeTypeNameRendererComponent } from 'app/admins/shared/components/renderer/attribute-type-name-renderer.component';
import { EIMCheckEssentialRendererComponent } from 'app/admins/shared/components/renderer/check-essential-renderer.component';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { of, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMAttributeSingleSelectorComponentService } from 'app/admins/components/attribute-selector/attribute-single-selector.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';

import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMValueTypeRendererComponent } from 'app/shared/components/renderer/value-type-renderer.component';
import { EIMTextInputFormItemComponent } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

/**
 * 属性選択コンポーネント
 * @example
 * 		<eim-attribute-selector
 * 			[multiple]="true"
 * 			[data]="data"
 * 			[selectedData]="selectedData"
 * 			[adminAppId]="adminAppId"
 * 			[relationFlag]="relationFlag"
 * 			[attrTreeFlag]="attrTreeFlag">
 * 		</eim-attribute-selector>
 */
@Component({
	selector: 'eim-attribute-single-selector',
	templateUrl: './attribute-single-selector.component.html',
	styleUrls: ['./attribute-single-selector.component.css'],
	providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeSingleSelectorComponent)},
	            {provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMAttributeSingleSelectorComponent)}],
	standalone: false,
})
export class EIMAttributeSingleSelectorComponent extends EIMDataGridSingleSelectorComponent implements AfterViewInit, EIMSelectable, OnInit {

	@ViewChild('attributeSearch')
		attributeSearch: EIMTextInputFormItemComponent;

	/** 複数選択可否 */
	@Input() multiple = true;

	/** 呼出し元識別子 */
	@Input() adminAppId: string;
	@Input() relationFlag = false;
	@Input() attrTreeFlag = false;
	@Input() documentTypeFlag = false;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 属性検索条件 */
	public condition: any = {
		attributeName: [''],
		adminAppId: '',
		relationFlag: false,
		attrTreeFlag: false,
		documentTypeFlag: false,
};

	public attributeNameLabel: string;

	/** 表示カラム */
	public columns: any[];

	public generalClassColumns: any[] = [
		{field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 150, suppressFilter: true},
		{field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 150, cellRendererFramework: EIMAttributeTypeNameRendererComponent, suppressFilter: true},
		{field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 120, suppressFilter: true},
		{field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 95, suppressFilter: true},
		{field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 100, suppressFilter: true},
		{field: 'defValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 120, cellRendererFramework: EIMDefaultListRendererComponent, suppressFilter: true},
	];
	public documentClassColumns: any[] = [
		{field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 200, cellRendererFramework: EIMAttributeTypeNameRendererComponent, suppressFilter: true},
		{field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 120, suppressFilter: true},
		{field: 'inputRuleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02256'), width: 80, suppressFilter: true},
		{field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 95, suppressFilter: true},
		{field: 'uiControlName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02243'), width: 120, suppressFilter: true},
		{field: 'initValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 120, cellRendererFramework: EIMDefaultListRendererComponent, suppressFilter: true},
	];
	public formClassColumns: any[] = [
		{field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 150, suppressFilter: true},
		{field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 150, cellRendererFramework: EIMAttributeTypeNameRendererComponent, suppressFilter: true},
		{field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 120, suppressFilter: true},
		{field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 95, suppressFilter: true},
		{field: 'uiControlName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02243'), width: 100, suppressFilter: true},
		{field: 'attTypeEssential', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02244'), width: 65, cellRendererFramework: EIMCheckEssentialRendererComponent, suppressFilter: true},
		{field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 120, suppressFilter: true},
		{field: 'initValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 120, cellRendererFramework: EIMDefaultListRendererComponent, suppressFilter: true},
	];

	public attrTreeColumns: any[] = [
		{field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 250, cellRendererFramework: EIMAttributeTypeNameRendererComponent, suppressFilter: true},
		{field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 120, suppressFilter: true},
		{field: 'inputRuleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02256'), width: 80, suppressFilter: true},
		{field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 95, suppressFilter: true},
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,
			public attributeSingleSelectorComponentService: EIMAttributeSingleSelectorComponentService,
	) {
		super(attributeSingleSelectorComponentService, messageService);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		// 呼出し元によって表示項目を設定
		switch (this.adminAppId) {
			case EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT:
				if (this.attrTreeFlag) {
					this.columns = this.attrTreeColumns;
					this.attributeNameLabel = this.translateService.instant('EIM_ADMINS.LABEL_02016');
					break;
				} else {
					this.columns = this.documentClassColumns;
					this.attributeNameLabel = this.translateService.instant('EIM_ADMINS.LABEL_02016');
					break;
				}
			case EIMAdminsConstantService.ADMIN_APP_ID_FORM:
			case EIMAdminsConstantService.ADMIN_APP_ID_TASK:
				this.columns = this.formClassColumns;
				this.attributeNameLabel = this.translateService.instant('EIM_ADMINS.LABEL_02004');
				break;
			case EIMAdminsConstantService.ADMIN_APP_ID_GENERAL:
				this.columns = this.generalClassColumns;
				this.attributeNameLabel = this.translateService.instant('EIM_ADMINS.LABEL_02004');
				break;
			default:
				break;
		}
		this.condition.adminAppId = this.adminAppId;
		this.condition.relationFlag = this.relationFlag;
		this.condition.attrTreeFlag = this.attrTreeFlag;
		this.condition.documentTypeFlag = this.documentTypeFlag;
		super.ngOnInit();
		this.attributeSingleSelectorComponentService.search(this.info, this.condition);
	}
}
