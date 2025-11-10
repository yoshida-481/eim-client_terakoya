import { Component, ViewChild, forwardRef, Input, Output, EventEmitter } from '@angular/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from "app/shared/services/constant.service";
import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService } from "app/shared/services/message.service";
import { EIMDataGridSingleSelectorComponent } from "app/shared/components/data-grid-single-selector/data-grid-single-selector.component";
import { EIMFormListColumnSingleSelectorComponentService } from "app/forms/components/form-list-column-selector/form-list-column-single-selector.component.service";
import { EIMSingleSelectorComponent } from "app/shared/components/single-selector/single-selector.component";
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from "app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service";
import { EIMDataGridColumn } from "app/shared/components/data-grid/data-grid.component";

import { EIMFormTypeDisplayColumn, EIMFormTypeDisplayColumnColumn } from 'app/shared/services/apis/local-storage.service';

/**
 * 表示列編集（対象一覧用）コンポーネント
 * @example
 * 		<eim-form-list-column-single-selector
 * 			[data]="data"
 * 			[multiple]="false">
 * 		</eim-form-list-column-single-selector>
 */
@Component({
    selector: 'eim-form-list-column-single-selector',
    templateUrl: './form-list-column-single-selector.component.html',
    styleUrls: ['./form-list-column-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMFormListColumnSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMFormListColumnSingleSelectorComponent) }],
    standalone: false
})
export class EIMFormListColumnSingleSelectorComponent extends EIMDataGridSingleSelectorComponent implements EIMSelectable {

	/** 複数選択可否 */
	@Input()
		public multiple: boolean = false;

	/** 属性タイプ検索条件 */
	public formTypeSearchCondition: any = {
		formTypeName: [""],
	};

	/** 表示カラム */
	public columns: any[] = [
		{field: 'definitionName', headerName: this.translateService.instant('EIM.LABEL_02021'), width: 280, suppressFilter: true},
		{field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 145, suppressFilter:true},
	];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,

			public formListColumnSingleSelectorComponentService: EIMFormListColumnSingleSelectorComponentService
	) {
		super(formListColumnSingleSelectorComponentService, messageService);
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	public ngOnInit() {
		super.ngOnInit();
		this.setData(this.data);
	}
}
