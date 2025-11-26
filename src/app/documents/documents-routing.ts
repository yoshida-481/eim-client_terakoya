import { Routes } from '@angular/router';

import { EIMDocumentsComponent } from './documents.component';
import { EIMDocumentLoginComponent } from './components/login/login.component';
import { EIMDocumentAuthenticationGuard } from './shared/guards/authentication.guard';
import { EIMDocumentsPdfViewerComponent } from './components/documents-pdf-viewer/documents-pdf-viewer.component';
import { EIMDocumentAuthenticationService } from './shared/services/apis/authentication.service';
import { EIMDocumentsCacheService } from './shared/services/documents-cache.service';
import { EIMDocumentsUserService } from './shared/services/apis/documents-user.service';
import { EIMContentsApproveWorkflowDiagramComponentService } from './components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component.service';
import { EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService } from './components/contents-approve-workflow-diagram/contents-approve-for-approver-selectable-workflow-diagram.component.service';
import { EIMDialogManagerComponentService } from './shared/components/dialog-manager/dialog-manager.component.service';
import { EIMRevisionHistoryDiagramComponentService } from './components/revision-history-diagram/revision-history-diagram.component.service';
import { EIMAttributeTypeSelectorComponentService } from './components/attribute-type-selector/attribute-type-selector.component.service';
import { EIMAttributeTypeMultipleSelectorComponentService } from './components/attribute-type-selector/attribute-type-multiple-selector.component.service';
import { EIMContentsSingleSelectorComponentService } from './components/contents-selector/contents-single-selector.component.service';
import { EIMContentsMultipleSelectorComponentService } from './components/contents-selector/contents-multiple-selector.component.service';
import { EIMWorkspaceCreatorComponentService } from './components/workspace-creator/workspace-creator.component.service';
import { EIMApproveService } from './shared/services/apis/approve.service';
import { EIMAttributeTypeService } from './shared/services/apis/attribute-type.service';
import { EIMContentsTypeService } from './shared/services/apis/contents-type.service';
import { EIMFileObjectCreatorService } from 'app/shared/services/apis/file-object-creator.service';
import { EIMDocumentFileObjectCreatorService } from './shared/services/apis/document-file-object-creator.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMDocumentFileService } from './shared/services/apis/document-file.service';
import { EIMUserService } from 'app/shared/services/apis/user.service';
import { EIMDocumentFormService } from './shared/services/apis/document-form.service';
import { EIMTagService } from './shared/services/apis/tag.service';
import { EIMCirculationService } from './shared/services/apis/circulation.service';
import { EIMObjectTypeService } from './shared/services/apis/object-type.service';
import { EIMDocumentService } from './shared/services/apis/document.service';
import { EIMFolderService } from './shared/services/apis/folder.service';
import { EIMWorkspaceService } from './shared/services/apis/workspace.service';
import { EIMHierarchicalContentsService } from './shared/services/apis/hierarchical-contents.service';
import { EIMRevisionHistoryService } from './shared/services/apis/revision-history.service';
import { EIMTableService } from './shared/services/apis/table.service';
import { EIMDocumentsEntryService } from './shared/services/apis/documents-entry.service';
import { EIMWorkflowService } from './shared/services/apis/workflow.service';
import { EIMSecurityService } from './shared/services/apis/security.service';
import { EIMContentsService } from './shared/services/apis/contents.service';
import { EIMPlaceRendererComponentService } from './shared/components/renderer/place-renderer.component.service';
import { EIMPublicFileRendererComponentService } from './shared/components/renderer/public-file-renderer.component.service';
import { EIMObjectNameRendererComponentService } from './shared/components/renderer/object-name-renderer.component.service';
import { EIMAccordionSearchRendererComponentService } from './shared/components/renderer/accordion-search-renderer.component.service';
import { EIMCompareFileNameRendererComponentService } from './shared/components/renderer/compare-file-name-renderer.component.service';
import { EIMStatusRendererComponentService } from './shared/components/renderer/status-renderer.component.service';
import { EIMTagNameRendererComponentService } from './shared/components/renderer/tag-name-renderer.component.service';
import { EIMPageRendererComponentService } from './shared/components/renderer/page-renderer.component.service';
import { EIMContentsPropertyComponentService } from './components/contents-property/contents-property.component.service';
import { EIMHistoryRendererComponentService } from './shared/components/renderer/history-renderer.component.service';
import { EIMDocumentsAttributeDomainService } from './shared/services/documents-attribute-domain.service';
import { EIMAttributeTreeComponentService } from './components/attribute-tree/attribute-tree.component.service';
import { EIMAttributeTreeService } from './shared/services/apis/attribute-tree.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMContextMenuService } from './shared/services/apis/context-menu.service';
import { EIMFileSelectRendererComponentService } from './shared/components/renderer/file-select-renderer.component.service';
import { EIMFunctionTypeRendererComponentService } from './shared/components/renderer/function-type-renderer.component.service';
import { EIMDocumentTypeChangeRendererComponentService } from './shared/components/renderer/document-type-change-renderer.component.service';
import { EIMSelectorClearRendererComponentService } from './shared/components/renderer/selector-clear-renderer.component.service';
import { EIMAttributeRendererComponentService } from './shared/components/renderer/attribute-renderer.component.service';
import { EIMLumpDocumentsCheckinRendererComponentService } from './shared/components/renderer/lump-documents-checkin-renderer.component.service';
import { EIMContentsPropertyService } from './shared/services/contents-property.service';
import { EIMContentsTableService } from './shared/services/contents-table.service';
import { EIMContentsNameRenameGeneralPipe } from './shared/pipes/contents-name-rename-general.pipe';
import { EIMApproveInfoManagementService } from './shared/services/approve-info-manegement.service';
import { EIMApproverSingleSelectorComponentService } from './components/approver-selector/approver-single-selector.component.service';
import { EIMObjectTypeTreeMultipleSelectorComponentSerivce } from './components/object-type-tree-selector/object-type-tree-multiple-selector.component.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMBoxAuthorizationService } from 'app/shared/services/apis/box-authorization.service';
import { EIMBoxFileService } from 'app/shared/services/apis/box-file.service';
import { EIMBoxFolderService } from 'app/shared/services/apis/box-folder.service';
import { EIMBoxContentsListComponentService } from './components/box-contents-list/box-contents-list.component.service';
import { EIMBoxFileDragComponentService } from './components/box-file-drag/box-file-drag.component.service';
import { EIMBoxNameRendererComponentService } from './shared/components/renderer/box-name-renderer.component.service';
import { EIMPublicDocumentService } from './shared/services/apis/public-document.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMDocumentSessionStorageService } from './shared/services/apis/document-session-storage.service';
import { EIMThumbnailService } from './shared/services/apis/document-thumbnail.service';
import { EIMDocumentsHttpService } from './shared/services/documents-http.service';
import { BoxEIMFileDragComponentService } from './components/eim-file-drag/eim-file-drag.component.service';
import { EIMDocumentsCheckinRendererComponentService } from './shared/components/renderer/documents-checkin-renderer.component.service';
import { EIMDropdownInputRendererComponentService } from './shared/components/renderer/dropdown-input-renderer.component.service';

export const documentsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' as 'full' },
      { path: 'login', component: EIMDocumentLoginComponent, canActivate: [EIMDocumentAuthenticationGuard], title: 'Login' },
      { path: 'login?objId=:id&privateFileDownloadObjId=:privateFileDownloadObjId&publicFileDownloadObjId=:publicFileDownloadObjId', component: EIMDocumentLoginComponent, canActivate: [EIMDocumentAuthenticationGuard], title: 'LoginId' },
      { path: 'main', component: EIMDocumentsComponent, canActivate: [EIMDocumentAuthenticationGuard], title: 'Main' },
      { path: 'main?objId=:id&privateFileDownloadObjId=:privateFileDownloadObjId&publicFileDownloadObjId=:publicFileDownloadObjId', component: EIMDocumentsComponent, canActivate: [EIMDocumentAuthenticationGuard], title: 'MainId' },
      { path: 'pdfViewer', component: EIMDocumentsPdfViewerComponent, canActivate: [EIMDocumentAuthenticationGuard], title: 'PdfViewer' },
    ],
    providers: [ // documentsルートの共通インスタンス
      EIMDocumentAuthenticationGuard,
      EIMDocumentAuthenticationService,

      // documents.module.tsから引っ越し
      EIMContentsApproveWorkflowDiagramComponentService,
      EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService,
      EIMDialogManagerComponentService,
      EIMRevisionHistoryDiagramComponentService,
      EIMAttributeTypeSelectorComponentService,
      EIMAttributeTypeMultipleSelectorComponentService,
      EIMContentsSingleSelectorComponentService,
      EIMContentsMultipleSelectorComponentService,
      EIMWorkspaceCreatorComponentService,
      EIMApproveService,
      EIMAttributeTypeService,
      EIMContentsTypeService,
      { provide: EIMFileObjectCreatorService, useClass: EIMDocumentFileObjectCreatorService },
      { provide: EIMFileService, useClass: EIMDocumentFileService },
      { provide: EIMUserService, useClass: EIMDocumentsUserService },
      EIMDocumentFormService,
      EIMTagService,
      EIMCirculationService,
      EIMObjectTypeService,
      EIMDocumentService,
      EIMFolderService,
      EIMWorkspaceService,
      EIMHierarchicalContentsService,
      EIMDocumentsUserService,
      EIMRevisionHistoryService,
      EIMTableService,
      EIMDocumentsEntryService,
      EIMWorkflowService,
      EIMSecurityService,
      EIMContentsService,
      EIMPlaceRendererComponentService,
      EIMPublicFileRendererComponentService,
      EIMObjectNameRendererComponentService,
      EIMAccordionSearchRendererComponentService,
      EIMCompareFileNameRendererComponentService,
      EIMStatusRendererComponentService,
      EIMTagNameRendererComponentService,
      EIMPageRendererComponentService,
      EIMContentsPropertyComponentService,
      EIMHistoryRendererComponentService,
      EIMDocumentsAttributeDomainService,
      EIMAttributeTreeComponentService,
      EIMAttributeTreeService,
      EIMSessionStorageService,
      EIMContextMenuService,
      EIMFileSelectRendererComponentService,
      EIMFunctionTypeRendererComponentService,
      EIMDocumentTypeChangeRendererComponentService,
      EIMSelectorClearRendererComponentService,
      EIMAttributeRendererComponentService,
      EIMLumpDocumentsCheckinRendererComponentService,
      EIMDocumentsCacheService,
      EIMContentsPropertyService,
      EIMContentsTableService,
      EIMContentsNameRenameGeneralPipe,
      EIMApproveInfoManagementService,
      EIMApproverSingleSelectorComponentService,
      EIMObjectTypeTreeMultipleSelectorComponentSerivce,
      EIMDocumentFileService,
      { provide: EIMEntryService, useClass: EIMDocumentsEntryService },
      EIMBoxAuthorizationService,
      EIMBoxFileService,
      EIMBoxFolderService,
      EIMBoxContentsListComponentService,
      EIMBoxFileDragComponentService,
      EIMBoxNameRendererComponentService,
      EIMPublicDocumentService,
      EIMAdminsSecurityService,
      EIMAdminsCacheService,
      EIMApproveInfoManagementService,
      EIMDocumentSessionStorageService,
      EIMThumbnailService,
      EIMDocumentsHttpService,
      BoxEIMFileDragComponentService,
      EIMDocumentsCheckinRendererComponentService,
      EIMDropdownInputRendererComponentService
    ]
  }
];
