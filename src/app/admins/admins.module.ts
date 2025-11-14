import { EIMUserImportFailedComponent } from './components/user-import-executor/user-import-failed.component';
import { EIMUserAttributeListInputFormItemComponent } from './components/user-attribute-list-input-form-item/user-attribute-list-input-form-item.component';

import { EIMDefaultListRendererComponent } from './shared/components/renderer/default-list-renderer.component';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx-translate
import { TranslateModule } from '@ngx-translate/core';

// Primeng
import { AccordionModule } from 'primeng/accordion';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MenubarModule } from 'primeng/menubar';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeModule } from 'primeng/tree';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BlockUIModule} from 'primeng/blockui';
import { TabsModule } from 'primeng/tabs';
import { DropdownModule } from 'primeng/dropdown';

import { EIMAdminSecurityApplicantComponent } from 'app/admins/components/admin-security-applicant/admin-security-applicant.component';
import { EIMAdminSecuritySelectorComponent } from 'app/admins/components/admin-security-selector/admin-security-selector.component';


import { EIMFormatSelectorComponent } from 'app/admins/components/format-selector/format-selector.component';
import { EIMWorkflowMailKindSingleSelectorComponent } from 'app/admins/components/workflow-mail-kind-selector/workflow-mail-kind-single-selector.component';

// ag-gridApprover
import { AgGridModule } from 'ag-grid-angular';

// ng2-file-upload
import { FileUploadModule } from 'ng2-file-upload';

// angular-split
import { AngularSplitModule } from 'angular-split';

// ngx-clipboard
import { ClipboardModule } from 'ngx-clipboard';

// EIM共通モジュール
import { EIMSharedModule } from 'app/shared/shared.module';

// EIMシステム管理用共通コンポーネント
import { EIMGroupAndRoleMultipleSelectorComponent } from './components/group-and-role-selector/group-and-role-multiple-selector.component';

// EIMシステム管理用コンポーネント
import { EIMRelationCreatorComponent } from './components/relation-creator/relation-creator.component';
import { EIMRelationUpdatorComponent } from './components/relation-updator/relation-updator.component';

import { EIMAttributeTreeViewCreatorComponent } from './components/attribute-tree-view-creator/attribute-tree-view-creator.component';
import { EIMAttributeTreeViewUpdatorComponent } from './components/attribute-tree-view-updator/attribute-tree-view-updator.component';
import { EIMAttritemeSelectorComponent } from './components/attritem-selector/attritem-selector.component';
import { EIMAttributeTreeViewAttributeUpdatorComponent } from './components/attribute-tree-view-attribute-updator/attribute-tree-view-attribute-updator.component';
import { EIMAttributeTreeViewAttribuetSortUpdatorComponent } from './components/attribute-tree-view-attribute-sort/attribute-tree-view-attribute-sort-updator.component';

import { EIMWorkflowDiagramComponent } from 'app/admins/components/workflow-diagram/workflow-diagram.component';
import { EIMFormWorkflowCreatorComponent } from 'app/admins/components/workflow-creator/form-workflow-creator.component';
import { EIMWorkflowCreatorComponent } from 'app/admins/components/workflow-creator/workflow-creator.component';
import { EIMWorkflowAttributeCopySettingUpdatorComponent } from 'app/admins/components/workflow-attribute-copy-setting-updator/workflow-attribute-copy-setting-updator.component';
import { EIMDocumentWorkflowCreatorComponent } from 'app/admins/components/workflow-creator/document-workflow-creator.component';
import { EIMFormatCreatorComponent } from './components/format-creator/format-creator.component';
import { EIMFormatUpdatorComponent } from './components/format-updator/format-updator.component';
import { EIMFormatDirectoryCreatorComponent } from './components/format-directory-creator/format-directory-creator.component';
import { EIMFormatDirectoryUpdatorComponent } from './components/format-directory-updator/format-directory-updator.component';
import { EIMSecurityCreatorComponent } from './components/security-creator/security-creator.component';
import { EIMSecurityUpdatorComponent } from './components/security-updator/security-updator.component';
import { EIMStatusSecurityCreatorComponent } from './components/status-security-creator/status-security-creator.component';
import { EIMStatusSecurityUpdatorComponent } from './components/status-security-updator/status-security-updator.component';
import { EIMStatusSecurityCopyComponent } from './components/status-security-copy/status-security-copy.component';
import { EIMFormWorkspaceCreatorComponent } from './components/workspace-creator/form-workspace-creator.component';
import { EIMFormWorkspaceUpdatorComponent } from './components/workspace-updator/form-workspace-updator.component';
import { EIMWorkflowSingleSelectorComponent } from './components/workflow-single-selector/workflow-single-selector.component';
import { EIMClassSingleSelectorComponent } from './components/class-selector/class-single-selector.component';
import { EIMAttributeSingleSelectorComponent } from './components/attribute-selector/attribute-single-selector.component';
import { EIMWorkspaceFolderCreatorComponent } from './components/workspace-folder-creator/workspace-folder-creator.component';
import { EIMWorkspaceFolderUpdatorComponent } from './components/workspace-folder-updator/workspace-folder-updator.component';
import { EIMWorkspaceFolderSingleSelectorComponent } from './components/workspace-folder-selector/workspace-folder-single-selector.component';
import { EIMWorkspaceTypeSingleSelectorComponent } from './components/workspace-type-selector/workspace-type-single-selector.component';
import { EIMGroupSingleSelectorComponent } from 'app/admins/components/group-selector/group-single-selector.component';
import { EIMRoleSingleSelectorComponent } from 'app/admins/components/role-selector/role-single-selector.component';
import { EIMAttributeCreatorComponent } from './components/attribute-creator/attribute-creator.component';
import { EIMAttributeUpdatorComponent } from './components/attribute-updator/attribute-updator.component';
import { EIMDocumentAttributeCreatorComponent } from './components/attribute-creator/document-attribute-creator.component';
import { EIMDocumentAttributeUpdatorComponent } from './components/attribute-updator/document-attribute-updator.component';
import { EIMDocumentAttributeListCreatorComponent } from './components/attribute-list-creator/document-attribute-list-creator.component';
import { EIMDocumentAttributeListUpdatorComponent } from './components/attribute-list-updator/document-attribute-list-updator.component';
import { EIMDocumentAttributeTypeSortUpdatorComponent } from './components/attribute-type-sort-updator/document-attribute-type-sort-updator.component';
import { EIMFormAttributeTypeSortUpdatorComponent } from './components/attribute-type-sort-updator/form-attribute-type-sort-updator.component';
import { EIMWorkflowEventSortUpdatorComponent } from './components/workflow-event-sort-updator/workflow-event-sort-updator.component';

import { EIMClassCreatorComponent } from 'app/admins/components/class-creator/class-creator.component';
import { EIMClassUpdatorComponent } from 'app/admins/components/class-updator/class-updator.component';
import { EIMClassCopyCreatorComponent } from 'app/admins/components/class-copy-creator/class-copy-creator.component';
import { EIMClassAttributeTypeInheritanceAndRelationUpdatorComponent } from 'app/admins/components/class-attribute-type-inheritance-and-relation-updator/class-attribute-type-inheritance-and-relation-updator.component';
import { EIMCodeTypeSelectorComponent } from './components/codetype-selector/codetype-selector.component';
import { EIMCodeTypeCreatorComponent } from './components/codetype-creator/codetype-creator.component';
import { EIMCodeTypeUpdatorComponent } from './components/codetype-updator/codetype-updator.component';
import { EIMCodeTypeCopyComponent } from './components/codetype-copy/codetype-copy.component';

import { EIMCodeCreatorComponent } from './components/code-creator/code-creator.component';
import { EIMCodeUpdatorComponent } from './components/code-updator/code-updator.component';
import { EIMCodeSortUpdatorComponent } from './components/code-sort-updator/code-sort-updator.component';

import { EIMClassDisplayColumnEditorComponent } from 'app/admins/components/class-display-column-editor/class-display-column-editor.component';
import { EIMClassFormListColumnMultipleSelectorComponent } from 'app/admins/components/class-form-list-column-selector/class-form-list-column-multiple-selector.component';
import { EIMClassFormListColumnSingleSelectorComponent } from 'app/admins/components/class-form-list-column-selector/class-form-list-column-single-selector.component';

// コンポーネントサービス
import { EIMDialogManagerComponent } from './shared/components/dialog-manager/dialog-manager.component';

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
import { EIMCheckRendererComponent } from './shared/components/renderer/check-renderer.component';
import { EIMSecurityRendererComponent } from './shared/components/renderer/security-renderer.component';

// EIMドキュメント管理
import { EIMDocumentsModule } from 'app/documents/documents.module';
import { EIMWorkflowUpdatorComponent } from 'app/admins/components/workflow-updator/workflow-updator.component';
import { EIMFormWorkflowUpdatorComponent } from 'app/admins/components/workflow-updator/form-workflow-updator.component';
import { EIMDocumentWorkflowUpdatorComponent } from 'app/admins/components/workflow-updator/document-workflow-updator.component';
import { EIMWorkflowCopyCreatorComponent } from 'app/admins/components/workflow-copy-creator/workflow-copy-creator.component';
import { EIMFormWorkflowCopyCreatorComponent } from 'app/admins/components/workflow-copy-creator/form-workflow-copy-creator.component';
import { EIMDocumentWorkflowCopyCreatorComponent } from 'app/admins/components/workflow-copy-creator/document-workflow-copy-creator.component';
import { EIMWorkflowRevisionUpCreatorComponent } from 'app/admins/components/workflow-revision-up-creator/workflow-revision-up-creator.component';
import { EIMFormWorkflowRevisionUpCreatorComponent } from 'app/admins/components/workflow-revision-up-creator/form-workflow-revision-up-creator.component';
import { EIMDocumentWorkflowRevisionUpCreatorComponent } from 'app/admins/components/workflow-revision-up-creator/document-workflow-revision-up-creator.component';
import { EIWorkflowStatusAndEventComponent } from 'app/admins/components/workflow-status-and-event-updator/workflow-status-and-event-updator.component';
import { EIMGroupCreatorComponent } from 'app/admins/components/group-creator/group-creator.component';
import { EIMGroupUpdatorComponent } from 'app/admins/components/group-updator/group-updator.component';
import { EIMRoleCreatorComponent } from 'app/admins/components/role-creator/role-creator.component';
import { EIMRoleUpdatorComponent } from 'app/admins/components/role-updator/role-updator.component';
import { EIMComplexGroupCreatorComponent } from 'app/admins/components/complex-group-creator/complex-group-creator.component';
import { EIMUserUpdatorComponent } from 'app/admins/components/user-updator/user-updator.component';
import { EIMUserCreatorComponent } from 'app/admins/components/user-creator/user-creator.component';
import { EIMUserImportExecutorComponent } from 'app/admins/components/user-import-executor/user-import-executor.component';
import { EIMUserExportExecutorComponent } from 'app/admins/components/user-export-executor/user-export-executor.component';
import { EIMAttributeDefaultComponent } from 'app/admins/components/attribute-default/attribute-default.component';
import { EIMFormAttributeCreatorComponent } from 'app/admins/components/attribute-creator/form-attribute-creator.component';
import { EIMFormAttributeUpdatorComponent } from 'app/admins/components/attribute-updator/form-attribute-updator.component';
import { EIMAttributeListValueSortUpdatorComponent } from 'app/admins/components/attribute-list-value-sort-updator/attribute-list-value-sort-updator.component';
import { EIMUserAttributeInputFormItemComponent } from 'app/admins/components/user-attribute-list-input-form-item/user-attribute-input-form-item.component';
import { EIMAdminFormComponent } from './components/admin-form/admin-form.component';
import { EIMObjectRoleCreatorComponent } from './components/object-role-creator/object-role-creator.component';
import { EIMObjectRoleUpdatorComponent } from './components/object-role-updator/object-role-updator.component';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';
import { EIMCheckBoxComponent } from 'app/shared/components/checkbox/checkbox.component';

@NgModule({
	declarations: [
		EIMRelationCreatorComponent,
		EIMRelationUpdatorComponent,
		EIMAttributeTreeViewCreatorComponent,
		EIMAttributeTreeViewUpdatorComponent,
		EIMAttritemeSelectorComponent,
		EIMAttributeTreeViewAttributeUpdatorComponent,
		EIMAttributeTreeViewAttribuetSortUpdatorComponent,

		EIMUserAttributeInputFormItemComponent,
		EIMUserAttributeListInputFormItemComponent,

		EIMWorkflowDiagramComponent,
		EIMWorkflowCreatorComponent,
		EIMFormWorkflowCreatorComponent,
		EIMWorkflowAttributeCopySettingUpdatorComponent,
		EIMDocumentWorkflowCreatorComponent,
		EIMWorkflowUpdatorComponent,
		EIMFormWorkflowUpdatorComponent,
		EIMDocumentWorkflowUpdatorComponent,
		EIMWorkflowCopyCreatorComponent,
		EIMFormWorkflowCopyCreatorComponent,
		EIMDocumentWorkflowCopyCreatorComponent,
		EIMWorkflowRevisionUpCreatorComponent,
		EIMFormWorkflowRevisionUpCreatorComponent,
		EIMDocumentWorkflowRevisionUpCreatorComponent,
		EIWorkflowStatusAndEventComponent,
		EIMAttributeCreatorComponent,
		EIMFormAttributeCreatorComponent,
		EIMAttributeUpdatorComponent,
		EIMFormAttributeUpdatorComponent,
		EIMAttributeDefaultComponent,
		EIMDocumentAttributeCreatorComponent,
		EIMDocumentAttributeUpdatorComponent,
		EIMDocumentAttributeListCreatorComponent,
		EIMDocumentAttributeListUpdatorComponent,
		EIMGroupAndRoleMultipleSelectorComponent,
		EIMCodeTypeSelectorComponent,
		EIMCodeTypeCreatorComponent,
		EIMCodeTypeUpdatorComponent,
		EIMCodeTypeCopyComponent,
		EIMCodeCreatorComponent,
		EIMCodeUpdatorComponent,
		EIMCodeSortUpdatorComponent,
		EIMAttributeListValueSortUpdatorComponent,

		EIMFormatCreatorComponent,
		EIMFormatUpdatorComponent,
		EIMFormatDirectoryCreatorComponent,
		EIMFormatDirectoryUpdatorComponent,
		EIMSecurityCreatorComponent,
		EIMSecurityUpdatorComponent,
		EIMStatusSecurityCreatorComponent,
		EIMStatusSecurityUpdatorComponent,
		EIMStatusSecurityCopyComponent,
		EIMFormWorkspaceCreatorComponent,
		EIMFormWorkspaceUpdatorComponent,
		EIMWorkflowSingleSelectorComponent,
		EIMClassSingleSelectorComponent,
		EIMFormAttributeTypeSortUpdatorComponent,
		EIMWorkflowEventSortUpdatorComponent,
		EIMDocumentAttributeTypeSortUpdatorComponent,
		EIMAttributeSingleSelectorComponent,
		EIMFormatSelectorComponent,
		EIMWorkflowMailKindSingleSelectorComponent,
		EIMWorkspaceFolderCreatorComponent,
		EIMWorkspaceFolderUpdatorComponent,
		EIMWorkspaceFolderSingleSelectorComponent,
		EIMWorkspaceTypeSingleSelectorComponent,
		EIMClassCreatorComponent,
		EIMClassUpdatorComponent,
		EIMClassCopyCreatorComponent,
		EIMAdminSecurityApplicantComponent,
		EIMAdminSecuritySelectorComponent,
		EIMClassDisplayColumnEditorComponent,

		EIMDialogManagerComponent,

		EIMUserCreatorComponent,
		EIMUserUpdatorComponent,
		EIMUserImportExecutorComponent,
		EIMUserImportFailedComponent,
		EIMUserExportExecutorComponent,

		EIMGroupCreatorComponent,
		EIMGroupUpdatorComponent,
		EIMRoleCreatorComponent,
		EIMRoleUpdatorComponent,
		EIMComplexGroupCreatorComponent,

		EIMFormatStatusRendererComponent,
		EIMCheckCopyRendererComponent,
		EIMCheckEssentialRendererComponent,
		EIMCheckViewNoValuesRendererComponent,
		EIMDuplicationRendererComponent,
		EIMEntryTypeRendererComponent,
		EIMAdminNameRendererComponent,
		EIMDisabledNameRendererComponent,
		EIMWorkflowCreatorEventSkipRendererComponent,
		EIMAdminsCheckboxRendererComponent,
		EIMDefaultListRendererComponent,
		EIMWorkflowMailMethodListComponent,
		EIMAttributeValueListRendererComponent,
		EIMAttributeTypeNameRendererComponent,
		EIMWorkflowUneditMailMethodListComponent,
		EIMGroupNameRendererComponent,
		EIMRoleNameRendererComponent,
		EIMRoleNameKanaRendererComponent,
		EIMUserNameRendererComponent,
		EIMFormatNameRendererComponent,
		EIMGroupOrRoleNameRendererComponent,
		EIMAdminUserDefaultRendererComponent,
		EIMCheckRendererComponent,
		EIMSecurityRendererComponent,

		EIMGroupSingleSelectorComponent,
		EIMRoleSingleSelectorComponent,
		EIMClassAttributeTypeInheritanceAndRelationUpdatorComponent,
		EIMClassFormListColumnMultipleSelectorComponent,
		EIMClassFormListColumnSingleSelectorComponent,

		EIMObjectRoleCreatorComponent,
		EIMObjectRoleUpdatorComponent,

		EIMAdminFormComponent,
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
		FieldsetModule,
		SelectButtonModule,
		MenubarModule,
		ContextMenuModule,
		DialogModule,
		InputTextModule,
		TextareaModule,
		DatePickerModule,
		ToastModule,
		BreadcrumbModule,
		SelectModule,
		TooltipModule,
		ToggleButtonModule,
		TreeModule,
		ConfirmDialogModule,
		BlockUIModule,
		ColorPickerModule,
		AgGridModule,
		FileUploadModule,
		AngularSplitModule,
		ClipboardModule,
		EIMSharedModule,

		EIMDocumentsModule,

		EIMRadioButtonComponent,
		EIMCheckBoxComponent,
		TabsModule,
		DropdownModule
	],
	exports: [
		EIMAttributeCreatorComponent,
		EIMFormAttributeCreatorComponent,
		EIMDocumentAttributeCreatorComponent,
		EIMAttributeUpdatorComponent,
		EIMClassDisplayColumnEditorComponent,
		EIMFormAttributeUpdatorComponent,
		EIMDocumentAttributeUpdatorComponent,
		EIMDialogManagerComponent,
		EIMWorkflowDiagramComponent,
		EIMObjectRoleCreatorComponent,
		EIMObjectRoleUpdatorComponent
	],

	providers: [
		// bootstrapApplicationで実装したAngularアプリでは、NgModuleのprovidersはDIツリーに登録されないため、実装しないこと
		// adminsRoutesのprovidersに登録することを検討してください。
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],


})
export class EIMAdminsModule { }
