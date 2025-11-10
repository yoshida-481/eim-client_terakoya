import { Routes } from '@angular/router';

import { EIMPortalsComponent } from './portals.component';
import { EIMPortalLoginComponent } from './components/login/login.component';
import { EIMPortalAuthenticationGuard } from './guards/authentication.guard';
import { EIMWorkspacesComponent } from './components/workspaces/workspaces.component';
import { EIMProjectMasterManagerComponent } from 'app/tasks/components/project-master-manager/project-master-manager.component';
import { EIMTaskManagerComponent } from 'app/tasks/components/task-manager/task-manager.component';
import { EIMWorkspaceHomeComponent } from './components/workspace-home/workspace-home.component';
import { EIMWorkspaceMemberComponent } from './components/workspace-member/workspace-member.component';
import { EIMWorkspaceTaskComponent } from './components/workspace-task/workspace-task.component';
import { EIMWorkspaceDocumentsComponent } from './components/workspace-documents/workspace-documents.component';
import { EIMWorkspaceSearchComponent } from './components/workspace-search/workspace-search.component';
import { EIMFileManagerComponent } from 'app/tasks/components/file-manager/file-manager.component';
import { EIMPortalAuthenticationService } from './services/apis/portal-authentication.service';
import { EIMFormAuthenticationService } from 'app/forms/shared/services/apis/authentication.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';
import { EIMDocumentAuthenticationService } from 'app/documents/shared/services/apis/authentication.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';

import { EIMTaskService } from 'app/tasks/services/apis/task.service';

import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';
import { EIMContentsApproveWorkflowDiagramComponentService } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component.service';
import { EIMContentsApproveForApproverSelectableWorkflowDiagramComponentService } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-for-approver-selectable-workflow-diagram.component.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMRevisionHistoryDiagramComponentService } from 'app/documents/components/revision-history-diagram/revision-history-diagram.component.service';
import { EIMAttributeTypeSelectorComponentService } from 'app/documents/components/attribute-type-selector/attribute-type-selector.component.service';
import { EIMAttributeTypeMultipleSelectorComponentService } from 'app/documents/components/attribute-type-selector/attribute-type-multiple-selector.component.service';
import { EIMContentsSingleSelectorComponentService } from 'app/documents/components/contents-selector/contents-single-selector.component.service';
import { EIMContentsMultipleSelectorComponentService } from 'app/documents/components/contents-selector/contents-multiple-selector.component.service';
import { EIMWorkspaceCreatorComponentService } from 'app/documents/components/workspace-creator/workspace-creator.component.service';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMAttributeTypeService } from 'app/documents/shared/services/apis/attribute-type.service';
import { EIMContentsTypeService } from 'app/documents/shared/services/apis/contents-type.service';
import { EIMFileObjectCreatorService } from 'app/shared/services/apis/file-object-creator.service';
import { EIMDocumentFileObjectCreatorService } from 'app/documents/shared/services/apis/document-file-object-creator.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { EIMUserService } from 'app/shared/services/apis/user.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMTagService } from 'app/documents/shared/services/apis/tag.service';
import { EIMCirculationService } from 'app/documents/shared/services/apis/circulation.service';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMDocumentService } from 'app/documents/shared/services/apis/document.service';
import { EIMFolderService } from 'app/documents/shared/services/apis/folder.service';
import { EIMWorkspaceService } from 'app/documents/shared/services/apis/workspace.service';
import { EIMHierarchicalContentsService } from 'app/documents/shared/services/apis/hierarchical-contents.service';
import { EIMRevisionHistoryService } from 'app/documents/shared/services/apis/revision-history.service';
import { EIMTableService } from 'app/documents/shared/services/apis/table.service';
import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMWorkflowService } from 'app/documents/shared/services/apis/workflow.service';
import { EIMSecurityService } from 'app/documents/shared/services/apis/security.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMPublicFileRendererComponentService } from 'app/documents/shared/components/renderer/public-file-renderer.component.service';
import { EIMObjectNameRendererComponentService } from 'app/documents/shared/components/renderer/object-name-renderer.component.service';
import { EIMAccordionSearchRendererComponentService } from 'app/documents/shared/components/renderer/accordion-search-renderer.component.service';
import { EIMCompareFileNameRendererComponentService } from 'app/documents/shared/components/renderer/compare-file-name-renderer.component.service';
import { EIMStatusRendererComponentService } from 'app/documents/shared/components/renderer/status-renderer.component.service';
import { EIMTagNameRendererComponentService } from 'app/documents/shared/components/renderer/tag-name-renderer.component.service';
import { EIMPageRendererComponentService } from 'app/documents/shared/components/renderer/page-renderer.component.service';
import { EIMContentsPropertyComponentService } from 'app/documents/components/contents-property/contents-property.component.service';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { EIMAttributeTreeComponentService } from 'app/documents/components/attribute-tree/attribute-tree.component.service';
import { EIMAttributeTreeService } from 'app/documents/shared/services/apis/attribute-tree.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMContextMenuService } from 'app/documents/shared/services/apis/context-menu.service';
import { EIMFileSelectRendererComponentService } from 'app/documents/shared/components/renderer/file-select-renderer.component.service';
import { EIMFunctionTypeRendererComponentService } from 'app/documents/shared/components/renderer/function-type-renderer.component.service';
import { EIMDocumentTypeChangeRendererComponentService } from 'app/documents/shared/components/renderer/document-type-change-renderer.component.service';
import { EIMSelectorClearRendererComponentService } from 'app/documents/shared/components/renderer/selector-clear-renderer.component.service';
import { EIMAttributeRendererComponentService } from 'app/documents/shared/components/renderer/attribute-renderer.component.service';
import { EIMLumpDocumentsCheckinRendererComponentService } from 'app/documents/shared/components/renderer/lump-documents-checkin-renderer.component.service';
import { EIMContentsPropertyService } from 'app/documents/shared/services/contents-property.service';
import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';
import { EIMContentsNameRenameGeneralPipe } from 'app/documents/shared/pipes/contents-name-rename-general.pipe';
import { EIMApproveInfoManagementService } from 'app/documents/shared/services/approve-info-manegement.service';
import { EIMApproverSingleSelectorComponentService } from 'app/documents/components/approver-selector/approver-single-selector.component.service';
import { EIMObjectTypeTreeMultipleSelectorComponentSerivce } from 'app/documents/components/object-type-tree-selector/object-type-tree-multiple-selector.component.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMBoxAuthorizationService } from 'app/shared/services/apis/box-authorization.service';
import { EIMBoxFileService } from 'app/shared/services/apis/box-file.service';
import { EIMBoxFolderService } from 'app/shared/services/apis/box-folder.service';
import { EIMBoxContentsListComponentService } from 'app/documents/components/box-contents-list/box-contents-list.component.service';
import { EIMBoxFileDragComponentService } from 'app/documents/components/box-file-drag/box-file-drag.component.service';
import { EIMBoxNameRendererComponentService } from 'app/documents/shared/components/renderer/box-name-renderer.component.service';
import { EIMPublicDocumentService } from 'app/documents/shared/services/apis/public-document.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';
import { EIMThumbnailService } from 'app/documents/shared/services/apis/document-thumbnail.service';
import { EIMDocumentsHttpService } from 'app/documents/shared/services/documents-http.service';
import { BoxEIMFileDragComponentService } from 'app/documents/components/eim-file-drag/eim-file-drag.component.service';
import { EIMTaskIconClassFunctionService } from 'app/tasks/services/task-icon-class-function.service';
import { EIMResponsibleObjectRoleInputFormItemComponentService } from 'app/tasks/components/responsible-object-role-input-form-item/responsible-object-role-input-form-item.component.service';
import { EIMTaskOutputFileInputFormItemComponentService } from 'app/tasks/components/task-output-file-input-form-item/task-output-file-input-form-item.component.service';
import { EIMTaskOutputFolderInputFormItemComponentService } from 'app/tasks/components/task-output-folder-input-form-item/task-output-folder-input-form-item.component.service';
import { EIMTaskWorkflowDiagramComponentService } from 'app/tasks/components/workflow-diagram/task-workflow-diagram.component.service';
import { EIMTaskUpdatorComponentService } from 'app/tasks/components/task-updator/task-updator.component.service';
import { EIMTaskTemplateFileInputFormItemComponentService } from 'app/tasks/components/task-template-file-input-form-item/task-template-file-input-form-item.component.service';
import { EIMResponsibleObjectRoleSingleSelectorComponentService } from 'app/tasks/components/responsible-object-role-selector/responsible-object-role-single-selector.component.service';
import { EIMResponsibleObjectRoleMultipleSelectorComponentService } from 'app/tasks/components/responsible-object-role-selector/responsible-object-role-multiple-selector.component.service';
import { EIMProjectMemberSingleSelectorComponentService } from 'app/tasks/components/project-member-selector/project-member-single-selector.component.service';
import { EIMTaskObjectRoleEntryInputFormItemComponentService } from 'app/tasks/components/task-object-role-entry-input-form-item/task-object-role-entry-input-form-item.component.service';
import { EIMObjectTypeInputFormItemComponentService } from 'app/tasks/components/object-type-input-form-item/object-type-input-form-item.component.service';
import { EIMTaskEntryListSingleSelectorComponentService } from 'app/tasks/components/entry-list-selector/task-entry-list-single-selector.component.service';
import { EIMTaskFileObjectCreatorService } from 'app/tasks/services/apis/task-file-object-creator.service';
import { EIMTemplateFileIconClassFunctionService } from 'app/tasks/services/template-file-icon-class-function.service';
import { EIMTaskAttachementFileInputFormItemComponentService } from 'app/tasks/components/task-attachement-file-input-form-item/task-attachement-file-input-form-item.component.service';
import { EIMFormEventService } from 'app/forms/shared/services/apis/form-event.service';
import { EIMStatusChangeWorkflowDiagramComponentService } from 'app/forms/components/status-change-workflow-diagram/status-change-workflow-diagram.component.service';
import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMFormWorkspaceEntryUserService } from 'app/forms/shared/services/apis/form-workspace-entry-user.service';
import { EIMAssignmentEntryUserService } from 'app/forms/shared/services/apis/assignment-entry-user.service';
import { EIMFormEventTypeService } from 'app/forms/shared/services/apis/form-event-type.service';


export const portalsRoutes: Routes = [
	{
		path: '',
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
			{ path: 'login', component: EIMPortalLoginComponent, canActivate: [EIMPortalAuthenticationGuard] },
			{ path: 'login/:id', component: EIMPortalLoginComponent, canActivate: [EIMPortalAuthenticationGuard] },
			{
				path: 'main', component: EIMPortalsComponent, canActivate: [EIMPortalAuthenticationGuard],
				children: [
					// { path: 'workspaces', component: EIMWorkspacesComponent},
					{
						path: 'workspaces/:workspaceTreeNodeId', component: EIMWorkspacesComponent,
						children: [
							{ path: 'home', component: EIMWorkspaceHomeComponent },
							{ path: 'members', component: EIMWorkspaceMemberComponent },
							{ path: 'objects', component: EIMWorkspaceSearchComponent },
							{ path: 'documents', component: EIMWorkspaceDocumentsComponent },
							{ path: 'tasks', component: EIMWorkspaceTaskComponent },
						]
					},
					{ path: 'documents', component: EIMFileManagerComponent },
					{ path: 'tasks', component: EIMTaskManagerComponent },
					{ path: 'project-masters', component: EIMProjectMasterManagerComponent },
					// { path: 'project-manager', component: EIMProjectManagerComponent},
					// { path: 'task-manager', component: EIMTaskManagerComponent},
					// { path: 'file-manager', component: EIMFileManagerComponent},
				]
			},
		],
		providers: [ // portalsルートの共通インスタンス
			EIMPortalAuthenticationGuard,
			EIMPortalAuthenticationService,
			EIMFormAuthenticationService,
			EIMFormsCacheService,
			EIMDocumentAuthenticationService,

			// portals.module.tsから引っ越し
			EIMDocumentsHttpService, // ドキュメント管理ビルトイン用にコンテキストルートを指定する必要がある

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
			
			// tasks.module.tsから引っ越し
			EIMTaskIconClassFunctionService,
			EIMTaskOutputFileInputFormItemComponentService,
			EIMTaskOutputFolderInputFormItemComponentService,
			EIMTaskWorkflowDiagramComponentService,
			EIMTaskUpdatorComponentService,
			EIMTaskTemplateFileInputFormItemComponentService,
			EIMResponsibleObjectRoleSingleSelectorComponentService,
			EIMResponsibleObjectRoleMultipleSelectorComponentService,
			EIMProjectMemberSingleSelectorComponentService,
			EIMResponsibleObjectRoleInputFormItemComponentService,
			EIMTaskObjectRoleEntryInputFormItemComponentService,
			EIMObjectTypeInputFormItemComponentService,
			EIMTaskEntryListSingleSelectorComponentService,
			EIMTaskService,
			EIMTaskFileObjectCreatorService,
			EIMTemplateFileIconClassFunctionService,
			EIMTaskAttachementFileInputFormItemComponentService,

			//Form.module.tsから引っ越し
			EIMFormEventService,
			EIMStatusChangeWorkflowDiagramComponentService,
			EIMFormService,
			EIMFormWorkspaceEntryUserService,
			EIMAssignmentEntryUserService,
			EIMFormEventTypeService,
		]
	}
];