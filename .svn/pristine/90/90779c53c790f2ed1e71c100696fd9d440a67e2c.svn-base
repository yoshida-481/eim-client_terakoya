import { EIMFormAttributeComponent } from './components/attribute/form-attribute.component';
import { Routes } from '@angular/router';
import { EIMGeneralAdminsComponent } from './general-admins.component';
import { EIMFormAdminsComponent } from './form-admins.component';
import { EIMDocumentAdminsComponent } from './document-admins.component';
import { EIMAdminsLoginComponent } from './components/login/login.component';
import { EIMClassComponent } from './components/class/class.component';
import { EIMDocumentClassComponent } from './components/class/document-class.component';
import { EIMFormClassComponent } from './components/class/form-class.component';
import { EIMRelationComponent } from './components/relation/relation.component';
import { EIMWorkspaceComponent } from './components/workspace/workspace.component';
import { EIMFormWorkspaceComponent } from './components/workspace/form-workspace.component';
import { EIMAttributeComponent } from './components/attribute/attribute.component';
import { EIMDocumentAttributeComponent } from './components/attribute/document-attribute.component';
import { EIMAttributeTreeViewComponent } from './components/attribute-tree-view/attribute-tree-view.component';
import { EIMWorkflowComponent } from './components/workflow/workflow.component';
import { EIMFormWorkflowComponent } from './components/workflow/form-workflow.component';
import { EIMFormatComponent } from './components/format/format.component';
import { EIMUserComponent } from './components/user/user.component';
import { EIMGroupAndRoleComponent } from './components/group-and-role/user-group-and-role.component';
import { EIMDocumentSecurityComponent } from './components/security/document-security.component';
import { EIMFormSecurityComponent } from './components/security/form-security.component';
import { EIMGeneralSecurityComponent } from './components/security/general-security.component';
import { EIMOperationHistoryComponent } from 'app/admins/components/operation-history/operation-history.component';
import { EIMDocumentWorkflowComponent } from 'app/admins/components/workflow/document-workflow.component';
import { EIMInitAdminsComponent } from 'app/admins/init-admins.component';
import { EIMCacheMonitorViewComponent } from './components/cache-monitor-view/cache-monitor-view.component';
import { EIMAdminAuthenticationGuard } from 'app/admins/shared/guards/authentication.guard';
import { EIMTaskAdminsComponent } from './task-admins.component';
import { EIMTaskWorkflowComponent } from './components/workflow/task-workflow.component';
import { EIMObjectRoleComponent } from './components/object-role/object-role.component';
import { EIMTaskClassComponent } from './components/class/task-class.component';
import { EIMTaskSecurityComponent } from './components/security/task-security.component';

import { EIMDefaultListRendererComponent } from './shared/components/renderer/default-list-renderer.component';
import { EIMFormatSelectorComponentService } from 'app/admins/components/format-selector/format-selector.component.service';
import { EIMAttrTreeService } from 'app/admins/shared/services/apis/attributeTreeView.service';
import { EIMClassDisplayColumnEditorComponent } from 'app/admins/components/class-display-column-editor/class-display-column-editor.component';

// コンポーネントサービス
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMAdminsComplexGroupService } from 'app/admins/shared/services/apis/admins-complex-group.service';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';
import { EIMAdminsAttributeDomainService } from 'app/admins/shared/services/admins-attribute-domain.service';
import { EIMHierarchicalContentsService, EIMHierarchicalContents } from 'app/admins/shared/services/apis/hierarchical-contents.service';
import { EIMContentsApproveWorkflowDiagramComponentService } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component.service';
import { EIMWorkflowDiagramComponentService } from 'app/admins/components/workflow-diagram/workflow-diagram.component.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeSingleSelectorComponentService } from 'app/admins/components/attribute-selector/attribute-single-selector.component.service';
import { EIMAttributeMultipleSelectorComponentService } from 'app/admins/components/attribute-selector/attribute-multiple-selector.component.service';
import { EIMWorkspaceTypeMultipleSelectorComponentSerivce } from 'app/admins/components/workspace-type-selector/workspace-type-multiple-selector.component.service';
import { EIMWorkspaceTypeSingleSelectorComponentService } from 'app/admins/components/workspace-type-selector/workspace-type-single-selector.component.service';
import { EIMOperationHistoryService } from 'app/admins/shared/services/apis/operation-history.service';
import { EIMWorkflowMailKindMultipleSelectorComponentSerivce } from 'app/admins/components/workflow-mail-kind-selector/workflow-mail-kind-multiple-selector.component.service';

// レンダラー
import { EIMFormatStatusRendererComponent } from 'app/admins/shared/components/renderer/format-status-renderer.component';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMDisabledNameRendererComponent } from 'app/admins/shared/components/renderer/disabled-name-renderer.component';
import { EIMWorkflowCreatorEventSkipRendererComponent } from 'app/admins/shared/components/renderer/workflow-creator-event-skip-renderer.component';
import { EIMAdminsCheckboxRendererComponent } from 'app/admins/shared/components/renderer/admin-checkbox-renderer.component';
import { EIMWorkflowMailMethodListComponent } from 'app/admins/shared/components/renderer/workflow-mail-method-list-renderer.component';
import { EIMCheckEssentialRendererComponent } from 'app/admins/shared/components/renderer/check-essential-renderer.component';
import { EIMCheckViewNoValuesRendererComponent } from 'app/admins/shared/components/renderer/check-viewnovalues-renderer.component';
import { EIMCheckCopyRendererComponent } from 'app/admins/shared/components/renderer/check-copy-renderer.component';
import { EIMDuplicationRendererComponent } from 'app/admins/shared/components/renderer/duplication-renderer.component';
import { EIMEntryTypeRendererComponent } from 'app/admins/shared/components/renderer/entry-type-renderer.component';
import { EIMAttributeValueListRendererComponent } from 'app/admins/shared/components/renderer/attribute-list-value-renderer.component';
import { EIMAttributeTypeNameRendererComponent } from 'app/admins/shared/components/renderer/attribute-type-name-renderer.component';
import { EIMWorkflowUneditMailMethodListComponent } from 'app/admins/shared/components/renderer/workflow-unedit-mail-method-list-renderer.component';
import { EIMGroupNameRendererComponent } from 'app/admins/shared/components/renderer/group-name-renderer.component';
import { EIMRoleNameRendererComponent } from 'app/admins/shared/components/renderer/role-name-renderer.component';
import { EIMRoleNameKanaRendererComponent } from 'app/admins/shared/components/renderer/role-name-kana-renderer.component';
import { EIMUserNameRendererComponent } from 'app/admins/shared/components/renderer/user-name-renderer.component';
import { EIMFormatNameRendererComponent } from 'app/admins/shared/components/renderer/format-name-renderer.component';
import { EIMGroupOrRoleNameRendererComponent } from 'app/admins/shared/components/renderer/group-or-role-name-renderer.component';
import { EIMAdminUserDefaultRendererComponent } from 'app/admins/shared/components/renderer/admin-user-default-renderer.component';
import { EIMWorkflowMailMethodListComponentService } from 'app/admins/shared/components/renderer/workflow-mail-method-list-renderer.component.service';
import { EIMCheckRendererComponent } from './shared/components/renderer/check-renderer.component';
import { EIMCacheMonistorViewCacheEntryAttributeTypeService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-attribute-type.service';
import { EIMCacheMonistorViewCacheEntryDirectoryService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-directory.service';
import { EIMCacheMonistorViewCacheEntryFileService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-file.service';
import { EIMCacheMonistorViewCacheEntryFormatService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-format.service';
import { EIMCacheMonistorViewCacheEntryLogService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-log.service';
import { EIMCacheMonistorViewCacheEntryGroupService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-group.service';
import { EIMCacheMonistorViewCacheEntryObjectService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-object.service';
import { EIMCacheMonistorViewCacheEntryObjectTypeService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-object-type.service';
import { EIMCacheMonistorViewCacheEntryUserService } from './components/cache-monitor-view/cache-monitor-view-cache-entry-user.service';
import { EIMSecurityRendererComponent } from './shared/components/renderer/security-renderer.component';

// サービス
import { EIMUserService } from 'app/admins/shared/services/apis/user.service';
import { EIMAdminsAuthenticationService } from 'app/admins/shared/services/apis/authentication.service';
import { EIMClassService } from 'app/admins/shared/services/apis/class.service';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMAdminsFormatService } from 'app/admins/shared/services/apis/admins-format.service';
import { EIMAdminsDirectoryService } from 'app/admins/shared/services/apis/admins-directory.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMAttributeTypeService as EIMAdminsAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMAdminsFormWorkspaceService } from 'app/admins/shared/services/apis/admins-form-workspace.service';
import { EIMRelationService } from 'app/admins/shared/services/apis/relation.service';
import { EIMAdminsWorkspaceService } from 'app/admins/shared/services/apis/admins-workspace.service';
import { EIMWorkspaceService } from 'app/documents/shared/services/apis/workspace.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMSecurityService } from 'app/documents/shared/services/apis/security.service';
import { EIMAdminsApplicationService } from 'app/admins/shared/services/apis/admins-application.service';
import { EIMAdminsObjectTypeService } from 'app/admins/shared/services/apis/admins-object-type.service';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMCacheMonitorViewService } from './shared/services/apis/cache-monitor-view.service';

// EIMドキュメント管理
import { EIMCodeService } from 'app/admins/shared/services/apis/code.service';
import { EIMCodeTypeService } from 'app/admins/shared/services/apis/codeType.service';
import { EIMObjectTypeTreeMultipleSelectorComponentSerivce } from 'app/documents/components/object-type-tree-selector/object-type-tree-multiple-selector.component.service';
import { EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMClassFormListColumnMultipleSelectorComponentService } from 'app/admins/components/class-form-list-column-selector/class-form-list-column-multiple-selector.component.service';
import { EIMAdminsDocumentFormService } from 'app/admins/shared/services/apis/admins-document-form.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { EIMAdminsContentsService } from 'app/admins/shared/services/apis/admins-contents.service';
import { EIMAdminsTaskIconClassFunctionService } from './shared/services/admins-task-icon-class-function.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';
import { EIMDocumentsHttpService } from 'app/documents/shared/services/documents-http.service';
import { EIMDocumentsCacheService } from 'app/documents/shared/services/documents-cache.service';
import { EIMContentsNameRenameGeneralPipe } from 'app/documents/shared/pipes/contents-name-rename-general.pipe';
import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMWorkspaceCreatorComponentService } from 'app/documents/components/workspace-creator/workspace-creator.component.service';
import { EIMWorkflowService } from 'app/documents/shared/services/apis/workflow.service';
import { EIMApproveService } from 'app/documents/shared/services/apis/approve.service';
import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMApproveInfoManagementService } from 'app/documents/shared/services/approve-info-manegement.service';
import { EIMTagService } from 'app/documents/shared/services/apis/tag.service';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMTagNameRendererComponentService } from 'app/documents/shared/components/renderer/tag-name-renderer.component.service';
import { EIMContentsPropertyService } from 'app/documents/shared/services/contents-property.service';
import { EIMDocumentSessionStorageService } from 'app/documents/shared/services/apis/document-session-storage.service';
import { EIMContentsPropertyComponentService } from 'app/documents/components/contents-property/contents-property.component.service';
import { EIMAttributeTypeSelectorComponentService } from 'app/documents/components/attribute-type-selector/attribute-type-selector.component.service';
import { EIMAttributeTypeMultipleSelectorComponentService } from 'app/documents/components/attribute-type-selector/attribute-type-multiple-selector.component.service';
import { EIMContentsMultipleSelectorComponentService } from 'app/documents/components/contents-selector/contents-multiple-selector.component.service';
import { EIMAttributeTypeService as EIMDocumentAttributeTypeService } from '../documents/shared/services/apis/attribute-type.service';

export const adminsRoutes: Routes = [
	{
		path: '',
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
			{ path: 'login', component: EIMAdminsLoginComponent },
			{
				path: 'general', component: EIMGeneralAdminsComponent, canActivate: [EIMAdminAuthenticationGuard],
				children: [
					{ path: 'init', component: EIMInitAdminsComponent },
					{ path: 'class', component: EIMClassComponent },
					{ path: 'relation', component: EIMRelationComponent },
					{ path: 'attribute', component: EIMAttributeComponent },
					{ path: 'workflow', component: EIMWorkflowComponent },
					{ path: 'format', component: EIMFormatComponent },
					{ path: 'user', component: EIMUserComponent },
					{ path: 'user-group', component: EIMGroupAndRoleComponent },
					{ path: 'security', component: EIMGeneralSecurityComponent },
					{ path: 'history', component: EIMOperationHistoryComponent },
					{ path: 'cache', component: EIMCacheMonitorViewComponent },
				]
			},
			{
				path: 'form', component: EIMFormAdminsComponent, canActivate: [EIMAdminAuthenticationGuard],
				children: [
					{ path: 'init', component: EIMInitAdminsComponent },
					{ path: 'class', component: EIMFormClassComponent },
					{ path: 'attribute', component: EIMFormAttributeComponent },
					{ path: 'workflow', component: EIMFormWorkflowComponent },
					{ path: 'format', component: EIMFormatComponent },
					{ path: 'user', component: EIMUserComponent },
					{ path: 'user-group', component: EIMGroupAndRoleComponent },
					{ path: 'security', component: EIMFormSecurityComponent },
					{ path: 'history', component: EIMOperationHistoryComponent },
					{ path: 'workspace', component: EIMFormWorkspaceComponent },
				]
			},
			{
				path: 'document', component: EIMDocumentAdminsComponent, canActivate: [EIMAdminAuthenticationGuard],
				children: [
					{ path: 'init', component: EIMInitAdminsComponent },
					{ path: 'type', component: EIMDocumentClassComponent },
					{ path: 'attribute', component: EIMDocumentAttributeComponent },
					{ path: 'attribute-tree', component: EIMAttributeTreeViewComponent },
					{ path: 'workflow', component: EIMDocumentWorkflowComponent },
					{ path: 'format', component: EIMFormatComponent },
					{ path: 'user', component: EIMUserComponent },
					{ path: 'user-group', component: EIMGroupAndRoleComponent },
					{ path: 'workspace', component: EIMWorkspaceComponent },
					{ path: 'security', component: EIMDocumentSecurityComponent },
					{ path: 'history', component: EIMOperationHistoryComponent },
				]
			},
			{
				path: 'task', component: EIMTaskAdminsComponent, canActivate: [EIMAdminAuthenticationGuard],
				children: [
					{ path: 'init', component: EIMInitAdminsComponent },
					{ path: 'class', component: EIMTaskClassComponent },
					{ path: 'attribute', component: EIMFormAttributeComponent },
					{ path: 'workflow', component: EIMTaskWorkflowComponent },
					{ path: 'format', component: EIMFormatComponent },
					{ path: 'user', component: EIMUserComponent },
					{ path: 'user-group', component: EIMGroupAndRoleComponent },
					{ path: 'security', component: EIMTaskSecurityComponent },
					{ path: 'objectRole', component: EIMObjectRoleComponent },
					{ path: 'history', component: EIMOperationHistoryComponent },
				]
			},
		],
		providers: [ // adminsルートの共通インスタンス
			EIMAdminAuthenticationGuard,

			// admins.module.tsから引っ越し
			EIMContentsApproveWorkflowDiagramComponentService,
			EIMAdminsCacheService,
			EIMAdminsEntryService,
			EIMAdminsComplexGroupService,
			EIMAdminsGroupService,
			EIMAdminsRoleService,
			EIMAdminsAttributeDomainService,
			EIMHierarchicalContentsService,
			EIMUserService,
			EIMAdminsAuthenticationService,
			EIMClassService,
			EIMAdminsWorkflowService,
			EIMAdminsFormatService,
			EIMAdminsDirectoryService,
			{ provide: EIMWorkspaceService, useClass: EIMAdminsWorkspaceService },
			EIMAdminsWorkspaceService,
			{ provide: EIMDocumentFormService, useClass: EIMAdminsDocumentFormService },
			EIMAdminsDocumentFormService,
			{ provide: EIMContentsService, useClass: EIMAdminsContentsService },
			EIMAdminsContentsService,
			EIMAdminDialogManagerComponentService,
			EIMAdminsSecurityService,
			EIMAdminsAttributeTypeService,// adminsのEIMAttributeTypeService
			EIMAttributeSingleSelectorComponentService,
			EIMAttributeMultipleSelectorComponentService,
			EIMAdminAttributeService,
			EIMCodeService,
			EIMCodeTypeService,
			EIMFormatSelectorComponentService,
			EIMAdminsFormWorkspaceService,
			EIMRelationService,
			EIMObjectService,
			EIMAttrTreeService,
			EIMWorkspaceTypeMultipleSelectorComponentSerivce,
			EIMWorkspaceTypeSingleSelectorComponentService,
			EIMOperationHistoryService,
			EIMWorkflowMailKindMultipleSelectorComponentSerivce,
			EIMClassFormListColumnMultipleSelectorComponentService,
			EIMWorkflowMailMethodListComponentService,
			EIMCacheMonistorViewCacheEntryAttributeTypeService,
			EIMCacheMonistorViewCacheEntryDirectoryService,
			EIMCacheMonistorViewCacheEntryFileService,
			EIMCacheMonistorViewCacheEntryFormatService,
			EIMCacheMonistorViewCacheEntryGroupService,
			EIMCacheMonistorViewCacheEntryLogService,
			EIMCacheMonistorViewCacheEntryObjectTypeService,
			EIMCacheMonistorViewCacheEntryObjectService,
			EIMCacheMonistorViewCacheEntryUserService,

			EIMAttributeValueListRendererComponent,
			EIMAttributeTypeNameRendererComponent,
			EIMWorkflowUneditMailMethodListComponent,
			EIMFormatNameRendererComponent,
			EIMFormatStatusRendererComponent,
			EIMDefaultListRendererComponent,
			EIMCheckCopyRendererComponent,
			EIMCheckEssentialRendererComponent,
			EIMCheckViewNoValuesRendererComponent,
			EIMDuplicationRendererComponent,
			EIMEntryTypeRendererComponent,
			EIMWorkflowMailMethodListComponent,
			EIMAdminNameRendererComponent,
			EIMDisabledNameRendererComponent,
			EIMWorkflowCreatorEventSkipRendererComponent,
			EIMAdminsCheckboxRendererComponent,
			EIMGroupNameRendererComponent,
			EIMRoleNameRendererComponent,
			EIMRoleNameKanaRendererComponent,
			EIMUserNameRendererComponent,
			EIMGroupOrRoleNameRendererComponent,
			EIMAdminUserDefaultRendererComponent,
			EIMCheckRendererComponent,
			EIMSecurityRendererComponent,

			{ provide: EIMEntryService, useClass: EIMAdminsEntryService },
			EIMAdminsComplexGroupService,
			EIMAdminsGroupService,
			EIMAdminsRoleService,
			{ provide: EIMSecurityService, useClass: EIMAdminsSecurityService },
			EIMAdminsApplicationService,

			EIMWorkflowDiagramComponentService,

			{ provide: EIMObjectTypeService, useClass: EIMAdminsObjectTypeService },

			EIMClassDisplayColumnEditorComponent,
			EIMObjectTypeTreeMultipleSelectorComponentSerivce,
			EIMMultipleSelectorComponentService,

			EIMCacheMonitorViewService,

			EIMAdminsTaskIconClassFunctionService,

			EIMDocumentFileService,
			EIMDocumentsHttpService,

			//document.module関連
			EIMDocumentsCacheService,
			EIMContentsNameRenameGeneralPipe,
			EIMDocumentsAttributeDomainService,
			EIMTagService,
			EIMDialogManagerComponentService,
			EIMWorkspaceCreatorComponentService,
			EIMWorkflowService,
			EIMApproveService,
			EIMDocumentsEntryService,
			EIMApproveInfoManagementService,
			EIMPlaceRendererComponentService,
			EIMTagNameRendererComponentService,
			EIMContentsPropertyService,
			EIMDocumentSessionStorageService,
			EIMContentsPropertyComponentService,
			EIMAttributeTypeSelectorComponentService,
			EIMAttributeTypeMultipleSelectorComponentService,
			EIMContentsMultipleSelectorComponentService,
			EIMDocumentAttributeTypeService,// documentsのEIMAttributeTypeService
		]
	}]