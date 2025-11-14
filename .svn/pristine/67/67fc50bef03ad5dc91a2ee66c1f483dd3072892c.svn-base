import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMContentsSearchComponentService, EIMContentsSearchDetailCondition } from 'app/documents/components/contents-search/contents-search.component.service';
import { EIMDataGridComponentService, EIMDataGridComponentInfo } from 'app/shared/components/data-grid/data-grid.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

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

import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMFolderService, EIMFolder, EIMFolderType } from 'app/documents/shared/services/apis/folder.service';
import { EIMTableService, EIMTable, EIMHierarchicalTable, EIMTableItem } from 'app/documents/shared/services/apis/table.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';

/**
 * コンテンツ選択コンポーネントサービス
 */
@Injectable()
export class EIMContentsSingleSelectorComponentService extends EIMContentsSearchComponentService {
	/**
	 * コンストラクタです.
	 * @param messageService メッセージサービス
	 * @param translateService 翻訳サービス
	 * @param attributeTypeService 属性タイプサービス
	 */
	constructor(
		protected serverConfigService: EIMServerConfigService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected dateService: EIMDateService,
		protected documentFormService: EIMDocumentFormService,
		protected documentsCacheService: EIMDocumentsCacheService,
		protected folderService: EIMFolderService,
		protected tableService: EIMTableService,
		protected translateService: TranslateService,
		protected placeRendererComponentService: EIMPlaceRendererComponentService,
		protected statusRendererComponentService: EIMStatusRendererComponentService,
		protected pageRendererComponentService: EIMPageRendererComponentService,
		protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
		protected publicFileRendererComponentService: EIMPublicFileRendererComponentService,
		protected historyRendererComponentService: EIMHistoryRendererComponentService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService,
		protected attributeRendererComponentService: EIMAttributeRendererComponentService,
		protected contentsTableService: EIMContentsTableService,
		protected messageService: EIMMessageService,
		protected documentFileService: EIMDocumentFileService,
		protected documentSessionStorageService: EIMDocumentSessionStorageService,
	) {
		super(
			serverConfigService,
			dialogManagerComponentService,
			dateService,
			documentFormService,
			documentsCacheService,
			folderService,
			tableService,
			translateService,
			placeRendererComponentService,
			statusRendererComponentService,
			pageRendererComponentService,
			dateTimeRendererComponentService,
			publicFileRendererComponentService,
			historyRendererComponentService,
			hierarchicalDomainService,
			attributeRendererComponentService,
			contentsTableService,
			messageService,
			documentFileService,
			documentSessionStorageService,
		);
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (a.attTypeId === b.attTypeId);
	}
}
