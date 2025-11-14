import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, forwardRef, ElementRef } from '@angular/core';
import { of, Observable } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMContentsSingleSelectorComponentService } from 'app/documents/components/contents-selector/contents-single-selector.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMContentsSearchComponent } from 'app/documents/components/contents-search/contents-search.component';
import { EIMContentsSearchComponentService } from 'app/documents/components/contents-search/contents-search.component.service';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';

import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMValueTypeRendererComponent } from 'app/shared/components/renderer/value-type-renderer.component';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMAttributeTypeService } from 'app/documents/shared/services/apis/attribute-type.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMStatusRendererComponentService } from 'app/documents/shared/components/renderer/status-renderer.component.service';
import { EIMPageRendererComponentService } from 'app/documents/shared/components/renderer/page-renderer.component.service';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMAttributeRendererComponentService } from 'app/documents/shared/components/renderer/attribute-renderer.component.service';
import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMFolderService, EIMFolder, EIMFolderType } from 'app/documents/shared/services/apis/folder.service';
import { EIMTableService, EIMTable, EIMHierarchicalTable, EIMTableItem } from 'app/documents/shared/services/apis/table.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';

/**
 * コンテンツ選択コンポーネント
 * @example
 * 		<eim-contents-single-selector
 * 			[multiple]="false"
 * 			[data]="data"
 * 			[selectedData]="selectedData"
 * 		>
 * 		</eim-contents-single-selector>
 */
@Component({
    selector: 'eim-contents-single-selector',
    templateUrl: './contents-single-selector.component.html',
    styleUrls: ['./contents-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMContentsSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMContentsSingleSelectorComponent) }],
    standalone: false
})
export class EIMContentsSingleSelectorComponent extends EIMContentsSearchComponent {

	/** 複数選択可否 */
	@Input()
		public multiple = false;


	/** 属性タイプ検索条件 */
	public attributeTypeSearchCondition: any = {attributeTypeName: ['']};

	/** 表示カラム */
	public columns: any[] = [
		{field: 'objName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 250, suppressFilter: true},
	];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected dateService: EIMDateService,
		protected placeRendererComponentService: EIMPlaceRendererComponentService,
		protected statusRendererComponentService: EIMStatusRendererComponentService,
		protected pageRendererComponentService: EIMPageRendererComponentService,
		protected publicFileRendererComponentService: EIMPublicFileRendererComponentService,
		protected historyRendererComponentService: EIMHistoryRendererComponentService,
		public contentsSearchComponentService: EIMContentsSearchComponentService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected documentFormService: EIMDocumentFormService,
		protected folderService: EIMFolderService,
		protected tableService: EIMTableService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected serverConfigService: EIMServerConfigService,
		protected contentsTableService: EIMContentsTableService,
		protected messageService: EIMMessageService,
		public contentsSingleSelectorComponentService: EIMContentsSingleSelectorComponentService,
		protected documentFileService: EIMDocumentFileService,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,
		protected elmRef: ElementRef,
	) {
		super(
			translateService,
			dialogManagerComponentService,
			dateService,
			placeRendererComponentService,
			statusRendererComponentService,
			pageRendererComponentService,
			publicFileRendererComponentService,
			historyRendererComponentService,
			contentsSearchComponentService,
			hierarchicalDomainService,
			documentFormService,
			folderService,
			tableService,
			documentsCacheService,
			serverConfigService,
			contentsTableService,
			messageService,
			documentFileService,
			documentSessionStorageService,
			elmRef,
		);
	}
}
