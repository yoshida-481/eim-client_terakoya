import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { of, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMAttributeTypeSelectorComponentService } from 'app/documents/components/attribute-type-selector/attribute-type-selector.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';

import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMValueTypeRendererComponent } from 'app/shared/components/renderer/value-type-renderer.component';

/**
 * 属性タイプ選択コンポーネント
 * @example
 * 		<eim-attribute-type-selector
 * 			[multiple]="false"
 * 			[data]="data"
 * 			[selectedData]="selectedData"
 * 		>
 * 		</eim-attribute-type-selector>
 */
@Component({
    selector: 'eim-attribute-type-selector',
    templateUrl: './attribute-type-selector.component.html',
    styleUrls: ['./attribute-type-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeTypeSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMAttributeTypeSelectorComponent) }],
    standalone: false
})
export class EIMAttributeTypeSelectorComponent extends EIMDataGridSingleSelectorComponent implements EIMSelectable {

	/** 複数選択可否 */
	@Input()
		public multiple = false;


	/** 属性タイプ検索条件 */
	public attributeTypeSearchCondition: any = {attributeTypeName: ['']};

	/** 表示カラム */
	public columns: any[] = [
		{field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 250, suppressFilter: true},
		{field: 'attValTypeId', headerName: this.translateService.instant('EIM.LABEL_02023'), width: 100, suppressFilter: true, cellRendererFramework: EIMValueTypeRendererComponent},
	];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,

			public attributeTypeSelectorComponentService: EIMAttributeTypeSelectorComponentService
	) {
		super(attributeTypeSelectorComponentService, messageService);
	}

}
