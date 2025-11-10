import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx-translate
import { TranslateModule } from '@ngx-translate/core';

// Primeng
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MenubarModule } from 'primeng/menubar';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BlockUIModule} from 'primeng/blockui';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CardModule } from 'primeng/card';

// ag-grid
import { AgGridModule } from 'ag-grid-angular';

import { EIMFileSelectRendererComponent } from 'app/documents/shared/components/renderer/file-select-renderer.component';
import { EIMDirectEditingRendererComponent } from './shared/components/renderer/direct-editing-renderer.component';
import { EIMDocumentTypeChangeRendererComponent } from 'app/documents/shared/components/renderer/document-type-change-renderer.component';
import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMAccordionSearchRendererComponent } from 'app/documents/shared/components/renderer/accordion-search-renderer.component';
import { EIMPublicFileRendererComponent } from 'app/documents/shared/components/renderer/public-file-renderer.component';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMSelectorClearRendererComponent } from 'app/documents/shared/components/renderer/selector-clear-renderer.component';
import { EIMTagNameRendererComponent } from 'app/documents/shared/components/renderer/tag-name-renderer.component';
import { EIMPublicDestinationRendererComponent } from 'app/documents/shared/components/renderer/public-destination-renderer.component';
import { EIMNotificationTypeRendererComponent } from 'app/documents/shared/components/renderer/notification-type-renderer.component';
import { EIMPublicNotificationTypeRendererComponent } from 'app/documents/shared/components/renderer/public-notification-type-renderer.component';
import { EIMTransitionDestinationRendererComponent } from 'app/documents/shared/components/renderer/transition-destination-renderer.component';
import { EIMFunctionTypeRendererComponent } from 'app/documents/shared/components/renderer/function-type-renderer.component';


import { EIMAttributeRendererComponent } from 'app/documents/shared/components/renderer/attribute-renderer.component';
import { EIMTextEditorRendererComponent } from 'app/documents/shared/components/renderer/text-editor-renderer.component';
import { EIMExpirationDateRendererComponent } from 'app/documents/shared/components/renderer/expiration-date-renderer.component';
import { EIMTypePathRendererComponent } from 'app/documents/shared/components/renderer/type-path-renderer.component';
import { EIMLumpDocumentsCheckinRendererComponent } from 'app/documents/shared/components/renderer/lump-documents-checkin-renderer.component';
import { EIMSignEncryptionRendererComponent } from 'app/documents/shared/components/renderer/sign-encription-cell-renderer.component';

import { EIMStatusRendererComponent } from './shared/components/renderer/status-renderer.component';
import { EIMPageRendererComponent } from './shared/components/renderer/page-renderer.component';
import { EIMProcessingResultRendererComponent } from './shared/components/renderer/processing-result-renderer.component';

// ng2-file-upload
import { FileUploadModule } from 'ng2-file-upload';

// angular-split
import { AngularSplitModule } from 'angular-split';

// ngx-clipboard
import { ClipboardModule } from 'ngx-clipboard';

// EIM共通モジュール
import { EIMSharedModule } from 'app/shared/shared.module';

// EIMドキュメント用コンポーネント
import { EIMAttributeTypeSelectorComponent } from 'app/documents/components/attribute-type-selector/attribute-type-selector.component';
import { EIMContentsSingleSelectorComponent } from 'app/documents/components/contents-selector/contents-single-selector.component';
import { EIMContentsApproveWorkflowDiagramComponent } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component';
import { EIMCoverCreatorComponent } from 'app/documents/components/cover-creator/cover-creator.component';
import { EIMContentsApproveExecutorComponent } from 'app/documents/components/contents-approve-executor/contents-approve-executor.component';
import { EIMContentsApproveRequestExecutorComponent } from 'app/documents/components/contents-approve-request-executor/contents-approve-request-executor.component';
import { EIMDocumentMainComponent } from './components/document-main/document-main.component';
import { EIMDocumentCreatorComponent } from './components/document-creator/document-creator.component';
import { EIMDocumentPublicComponent } from './components/document-public/document-public.component';
import { EIMContentsSearchComponent } from './components/contents-search/contents-search.component';
import { EIMDialogManagerComponent } from './shared/components/dialog-manager/dialog-manager.component';
import { EIMContentsPropertyComponent } from './components/contents-property/contents-property.component';
import { EIMContentsAttributeListInputFormItemComponent } from './components/contents-attribute-list-input-form-item/contents-attribute-list-input-form-item.component';
import { EIMFolderCreatorComponent } from './components/folder-creator/folder-creator.component';
import { EIMAccessHistoryComponent } from './components/access-history/access-history.component';
import { EIMOCRSettingUpdatorComponent } from './components/ocr-setting-updator/ocr-setting-updator.component';
import { EIMMasterContentsApproveWorkflowDiagramComponent } from 'app/documents/components/master-contents-approve-workflow-diagram/master-contents-approve-workflow-diagram.component';
import { EIMRevisionHistoryComponent } from './components/revision-history/revision-history.component';
import { EIMSecurityChangeComponent } from './components/security-change/security-change.component';
import { EIMSecuritySelectorComponent } from './components/security-selector/security-selector.component';
import { EIMDocumentCheckinComponent } from './components/document-checkin/document-checkin.component';
import { EIMLumpDocumentCreatorComponent } from 'app/documents/components/lump-document-creator/lump-document-creator.component';
import { EIMLumpDocumentCreatorConfirmationComponent } from 'app/documents/components/lump-document-creator/lump-document-creator-confirmation.component';
import { EIMLumpFolderCreatorComponent } from 'app/documents/components/lump-folder-creator/lump-folder-creator.component';
import { EIMObjectTypeTreeSelectorComponent } from './components/object-type-tree-selector/object-type-tree-selector.component';
import { EIMFolderTreeSelectorComponent } from './components/folder-tree-selector/folder-tree-selector.component';
import { EIMPublicFileCombineExecutorComponent } from 'app/documents/components/public-file-combine-executor/public-file-combine-executor.component';
import { EIMPublicFileCompareExecutorComponent } from 'app/documents/components/public-file-compare-executor/public-file-compare-executor.component';
import { EIMTableConfigComponent } from './components/table-config/table-config.component';
import { EIMTableCreatorComponent } from './components/table-creator/table-creator.component';
import { EIMTagCreatorComponent } from 'app/documents/components/tag-creator/tag-creator.component';
import { EIMDocumentPublicDestinationSelectorComponent } from './components/document-public-destination-selector/document-public-destination-selector.component';
import { EIMContentsStatusPropertyComponent } from './components/contents-status-property/contents-status-property.component';
import { EIMApproverSingleSelectorComponent } from './components/approver-selector/approver-single-selector.component';
import { EIMApproverMultipleSelectorComponent } from './components/approver-selector/approver-multiple-selector.component';
import { EIMWorkspaceCreatorComponent } from 'app/documents/components/workspace-creator/workspace-creator.component';
import { EIMObjectTypeAttributeComponent } from 'app/documents/components/workspace-creator/object-type-attribute.component';
import { EIMFileReplacementExecutorComponent } from './components/file-replacement-executor/file-replacement-executor.component';
import { EIMLinkUpdatoComponent } from 'app/documents/components/link-updator/link-updator.component';
import { EIMFolderConfigurationSecurityApplicableComponent } from './components/folder-configuration-security-applicable/folder-configuration-security-applicable.component';
import { EIMAccessSecurityApplicableComponent } from './components/access-security-applicable/access-security-applicable.component';
import { EIMAccessSecurityEditComponent } from './components/access-security-edit/access-security-edit.component';
import { EIMPDFSettingUpdatorComponent } from './components/pdf-setting-updator/pdf-setting-updator.component';
import { EIMPDFElectronicSignatureApplicableComponent } from './components/pdf-electronic-signature-applicable/pdf-electronic-signature-applicable.component'
import { EIMRelationFileInputFormItemComponent } from 'app/documents/shared/components/input-form-item/relation-file-input-form-item/relation-file-input-form-item.component';
import { EIMWorkSpaceAdministratorItemComponent } from 'app/documents/components/workspace-creator/workspace-administrator-item.component';
import { EIMNotfiedUserSelectorComponent } from 'app/documents/components/notfied-user-selector/notfied-user-selector.component';
import { EIMPublicFilePreSetterComponent } from './components/public-file-pre-setter/public-file-pre-setter.component';
import { EIMThumbnailCreatorComponent } from './components/thumbnail-creator/thumbnail-creator.component';

// EIMドキュメント用パイプ
import { EIMContentsAccessRolePipe } from './shared/pipes/contents-access-role.pipe';
import { EIMContentsNameRenameGeneralPipe } from './shared/pipes/contents-name-rename-general.pipe';

// サービス
import { EIMApproverRendererComponent } from 'app/documents/shared/components/renderer/approver-renderer.component';
import { EIMContentsPublicCancelExecutorComponent } from 'app/documents/components/contents-public-cancel-executor/contents-public-cancel-executor.component';
import { EIMFavoriteListComponent } from 'app/documents/components/favorite-list/favorite-list.component';
import { EIMCheckoutListComponent } from 'app/documents/components/checkout-list/checkout-list.component';
import { EIMAttributeTypeNameRendererComponent } from 'app/documents/shared/components/renderer/attribute-type-name-renderer.component';
import { EIMSelectableSecuritySelectorComponent } from 'app/documents/components/selectable-security-selector/selectable-security-selector.component';
import { EIMPublicFileCompareListComponent } from 'app/documents/components/public-file-compare-list/public-file-compare-list.component';
import { EIMPublicFileSecurityExecutorComponent } from 'app/documents/components/public-file-security-executor/public-file-security-executor.component';
import { EIMSecurityNameRendererComponent } from 'app/documents/shared/components/renderer/security-name-renderer.component';
import { EIMTagAllocationApplicantComponent } from 'app/documents/components/tag-allocation-applicant/tag-allocation-applicant.component';
import { EIMAccordionSearchComponent } from 'app/documents/components/accordion-search/accordion-search.component';
import { EIMCirculationSituationComponent } from 'app/documents/components/circulation-situation/circulation-situation.component';
import { EIMCompareFileNameRendererComponent } from 'app/documents/shared/components/renderer/compare-file-name-renderer.component';
import { EIMDocumentsAttributeInputFormItemComponent } from 'app/documents/components/documents-attribute-input-form-item/documents-attribute-input-form-item.component';

import { EIMBoxMainComponent } from 'app/documents/components/box-main/box-main.component';
import { EIMBoxContentsListComponent } from 'app/documents/components/box-contents-list/box-contents-list.component';
import { EIMBoxFileDragComponent } from 'app/documents/components/box-file-drag/box-file-drag.component';
import { EIMBoxNameRendererComponent } from 'app/documents/shared/components/renderer/box-name-renderer.component';
import { EIMLumpFolderCreatorConfirmationComponent } from './components/lump-folder-creator/lump-folder-creator-confirmation.component';
import { EIMPdfViewerComponent } from './shared/components/renderer/pdf-viewer.component';
import { EIMThumbnailViewerComponent } from './components/thumbnail-viewer/thumbnail-viewer.component';
import { BoxEIMFileDragComponent } from "./components/eim-file-drag/eim-file-drag.component";
import { EIMDocumentCreatorConfirmationComponent } from "./components/document-creator/document-creator-confirmation.component";
import { EIMDocumentsCheckinRendererComponent } from "./shared/components/renderer/documents-checkin-renderer.component";
import { BoxSelectorComponent } from "app/documents/components/box-selector/box-selector.component";
import { EIMDropdownInputRendererComponent } from "app/documents/shared/components/renderer/dropdown-input-renderer.component";
import { EIMCheckBoxComponent } from 'app/shared/components/checkbox/checkbox.component';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';

/**
 * ドキュメント管理モジュール
 */
@NgModule({
	declarations: [
		EIMFileSelectRendererComponent,
		EIMDirectEditingRendererComponent,
		EIMDocumentTypeChangeRendererComponent,
		EIMPdfViewerComponent,
		EIMObjectNameRendererComponent,
		EIMAccordionSearchRendererComponent,
		EIMCompareFileNameRendererComponent,
		EIMHistoryRendererComponent,
		EIMProcessingResultRendererComponent,
		EIMTextEditorRendererComponent,
		EIMExpirationDateRendererComponent,
		EIMLumpDocumentsCheckinRendererComponent,
		EIMDocumentsCheckinRendererComponent,
		EIMDocumentCreatorComponent,
		EIMPublicFileRendererComponent,
		EIMPlaceRendererComponent,
		EIMStatusRendererComponent,
		EIMPageRendererComponent,
		EIMSelectorClearRendererComponent,
		EIMPublicDestinationRendererComponent,
		EIMApproverRendererComponent,
		EIMNotificationTypeRendererComponent,
		EIMPublicNotificationTypeRendererComponent,
		EIMTagNameRendererComponent,
		EIMTransitionDestinationRendererComponent,
		EIMFunctionTypeRendererComponent,
		EIMAttributeRendererComponent,
		EIMTypePathRendererComponent,
		EIMAttributeTypeNameRendererComponent,
		EIMSecurityNameRendererComponent,

		EIMAttributeTypeSelectorComponent,
		EIMContentsSingleSelectorComponent,
		EIMContentsApproveWorkflowDiagramComponent,
		EIMCoverCreatorComponent,
		EIMDocumentPublicComponent,
		EIMContentsPublicCancelExecutorComponent,
		EIMCheckoutListComponent,
		EIMContentsApproveRequestExecutorComponent,
		EIMContentsApproveExecutorComponent,
		EIMDocumentMainComponent,
		EIMDocumentCreatorComponent,
		EIMContentsPropertyComponent,
		EIMContentsSearchComponent,
		EIMDialogManagerComponent,
		EIMAccessHistoryComponent,
		EIMOCRSettingUpdatorComponent,
		EIMMasterContentsApproveWorkflowDiagramComponent,
		EIMRevisionHistoryComponent,
		EIMSecurityChangeComponent,
		EIMSecuritySelectorComponent,
		EIMContentsAccessRolePipe,
		EIMContentsNameRenameGeneralPipe,
		EIMDocumentCheckinComponent,
		EIMLumpDocumentCreatorComponent,
		EIMLumpDocumentCreatorConfirmationComponent,
		EIMDocumentCreatorConfirmationComponent,
		EIMLumpFolderCreatorComponent,
		EIMLumpFolderCreatorConfirmationComponent,
		EIMObjectTypeTreeSelectorComponent,
		EIMFolderTreeSelectorComponent,
		EIMPublicFileCombineExecutorComponent,
		EIMPublicFileCompareExecutorComponent,
		EIMTableConfigComponent,
		EIMTableCreatorComponent,
		EIMTagCreatorComponent,
		EIMDocumentPublicDestinationSelectorComponent,
		EIMContentsAttributeListInputFormItemComponent,
		EIMFolderCreatorComponent,
		EIMFavoriteListComponent,
		EIMPublicFileCompareListComponent,
		EIMContentsStatusPropertyComponent,
		EIMWorkspaceCreatorComponent,
		EIMObjectTypeAttributeComponent,
		EIMFileReplacementExecutorComponent,
		EIMPublicFileSecurityExecutorComponent,
		EIMFolderConfigurationSecurityApplicableComponent,
		EIMAccessSecurityApplicableComponent,
		EIMAccessSecurityEditComponent,
		EIMAccordionSearchComponent,
		EIMCirculationSituationComponent,
		EIMPDFSettingUpdatorComponent,
		EIMPDFElectronicSignatureApplicableComponent,
		EIMRelationFileInputFormItemComponent,
		EIMWorkSpaceAdministratorItemComponent,
		EIMNotfiedUserSelectorComponent,
		EIMDocumentsAttributeInputFormItemComponent,
		EIMPublicFilePreSetterComponent,
		EIMThumbnailViewerComponent,
		EIMThumbnailCreatorComponent,

		EIMApproverSingleSelectorComponent,
		EIMApproverMultipleSelectorComponent,
		EIMLinkUpdatoComponent,
		EIMSelectableSecuritySelectorComponent,
		EIMTagAllocationApplicantComponent,
		EIMSignEncryptionRendererComponent,
		EIMNotfiedUserSelectorComponent,

		EIMBoxMainComponent,
		EIMBoxContentsListComponent,
		EIMBoxFileDragComponent,
		EIMBoxNameRendererComponent,
		BoxEIMFileDragComponent,
		BoxSelectorComponent,
		EIMDropdownInputRendererComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		PanelModule,
		TranslateModule,
		AccordionModule,
		CheckboxModule,
		ButtonModule,
		PaginatorModule,
		SelectButtonModule,
		MenubarModule,
		ContextMenuModule,
		DialogModule,
		InputTextModule,
		DatePickerModule,
		ToastModule,
		BreadcrumbModule,
		SelectModule,
		TooltipModule,
		TreeModule,
		TabsModule,
		ConfirmDialogModule,
		BlockUIModule,
		AutoCompleteModule ,
		ToggleButtonModule,
		CardModule,
		AgGridModule,

		FileUploadModule,
		AngularSplitModule,
		ClipboardModule,
		EIMSharedModule,

		//Standalone Component
		EIMCheckBoxComponent,
		EIMRadioButtonComponent,
	],
	exports: [
		EIMContentsApproveRequestExecutorComponent,
		EIMContentsApproveExecutorComponent,
		EIMCoverCreatorComponent,
		EIMDocumentMainComponent,
		EIMDocumentCreatorComponent,
		EIMDocumentPublicComponent,
		EIMCheckoutListComponent,
		EIMContentsPublicCancelExecutorComponent,
		EIMContentsSearchComponent,
		EIMDialogManagerComponent,
		EIMContentsPropertyComponent,
		EIMSecurityChangeComponent,
		EIMSecuritySelectorComponent,
		EIMDocumentCheckinComponent,
		EIMLumpDocumentCreatorComponent,
		EIMLumpDocumentCreatorConfirmationComponent,
		EIMLumpFolderCreatorComponent,
		EIMLumpFolderCreatorConfirmationComponent,
		EIMDocumentCreatorConfirmationComponent,
		EIMDocumentCreatorComponent,
		EIMMasterContentsApproveWorkflowDiagramComponent,
		EIMObjectTypeTreeSelectorComponent,
		EIMFolderTreeSelectorComponent,
		EIMPublicFileCombineExecutorComponent,
		EIMPublicFileCompareExecutorComponent,
		EIMPublicFileSecurityExecutorComponent,
		EIMTableConfigComponent,
		EIMTableCreatorComponent,
		EIMTagCreatorComponent,
		EIMDocumentPublicDestinationSelectorComponent,
		EIMContentsAttributeListInputFormItemComponent,
		EIMAccordionSearchComponent,
		EIMCirculationSituationComponent,
		EIMFolderCreatorComponent,
		EIMFavoriteListComponent,
		EIMPublicFileCompareListComponent,
		EIMTransitionDestinationRendererComponent,
		EIMFunctionTypeRendererComponent,
		EIMFolderConfigurationSecurityApplicableComponent,
		EIMAccessSecurityApplicableComponent,
		EIMAccessSecurityEditComponent,
		EIMPDFSettingUpdatorComponent,
		EIMPDFElectronicSignatureApplicableComponent,
		EIMRelationFileInputFormItemComponent,
		EIMWorkSpaceAdministratorItemComponent,
		EIMNotfiedUserSelectorComponent,
		EIMDocumentsAttributeInputFormItemComponent,
		EIMThumbnailCreatorComponent,

		EIMApproverSingleSelectorComponent,
		EIMApproverMultipleSelectorComponent,
		EIMWorkspaceCreatorComponent,
		EIMLinkUpdatoComponent,
		EIMObjectTypeAttributeComponent,
		EIMSelectableSecuritySelectorComponent,
		EIMTagAllocationApplicantComponent,
		EIMMasterContentsApproveWorkflowDiagramComponent,
	],

	providers: [
		// bootstrapApplicationで実装したAngularアプリでは、NgModule の providersはDIツリーに登録されないため、実装しないこと
		// documentsRoutesのprovidersに登録することを検討してください。
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EIMDocumentsModule { }
