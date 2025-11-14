import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx-translate
import { TranslateModule } from '@ngx-translate/core';

//Primeng
import { AccordionModule } from 'primeng/accordion';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MenubarModule } from 'primeng/menubar';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule  } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { TabsModule } from 'primeng/tabs';
import { SelectModule } from 'primeng/select';

//ag-grid
import { AgGridModule } from "ag-grid-angular";

//ng2-file-upload
import { FileUploadModule } from 'ng2-file-upload';

// angular-split
import { AngularSplitModule } from 'angular-split';

//ngx-clipboard
import { ClipboardModule } from 'ngx-clipboard';

// EIM共通モジュール
import { EIMSharedModule } from 'app/shared/shared.module';

// EIMタスク管理用コンポーネント
import { EIMProjectCreatorComponent } from './components/project-creator/project-creator.component';
import { EIMTaskCreatorComponent } from './components/task-creator/task-creator.component';
import { EIMProcessCreatorComponent } from './components/process-creator/process-creator.component';
import { EIMTaskUpdatorComponent } from './components/task-updator/task-updator.component';
import { EIMProjectUpdatorComponent } from './components/project-updator/project-updator.component';
import { NgxGanttModule } from '@worktile/gantt';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { EIMTaskWorkflowDiagramComponent } from './components/workflow-diagram/task-workflow-diagram.component';
import { EIMTaskFormComponent } from './components/task-form/task-form.component';
import { EIMDocumentsModule } from 'app/documents/documents.module';
import { EIMBooleanSwitchButtonInputRendererComponent } from './components/renderer/boolean-switch-button-input-renderer.component';
import { EIMProcessUpdatorComponent } from './components/process-updator/process-updator.component';
import { EIMTaskHeaderComponent } from './components/task-header/task-header.component';
import { EIMProjectMasterCreatorComponent } from './components/project-master-creator/project-master-creator.component';
import { EIMProcessMasterCreatorComponent } from './components/process-master-creator/process-master-creator.component';
import { EIMTaskMasterCreatorComponent } from './components/task-master-creator/task-master-creator.component';
import { EIMTaskMasterUpdatorComponent } from './components/task-master-updator/task-master-updator.component';
import { EIMTaskTemplateFileInputFormItemComponent } from './components/task-template-file-input-form-item/task-template-file-input-form-item.component';
import { EIMResponsibleObjectRoleInputFormItemComponent } from './components/responsible-object-role-input-form-item/responsible-object-role-input-form-item.component';
import { EIMTaskObjectRoleEntryInputFormItemComponent } from './components/task-object-role-entry-input-form-item/task-object-role-entry-input-form-item.component';
import { EIMResponsibleObjectRoleSingleSelectorComponent } from './components/responsible-object-role-selector/responsible-object-role-single-selector.component';
import { EIMResponsibleObjectRoleMultipleSelectorComponent } from './components/responsible-object-role-selector/responsible-object-role-multiple-selector.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EIMTaskOutputFileInputFormItemComponent } from './components/task-output-file-input-form-item/task-output-file-input-form-item.component';
import { EIMObjectTypeInputFormItemComponent } from './components/object-type-input-form-item/object-type-input-form-item.component';
import { EIMObjectTypeInputRendererComponent } from './components/object-type-input-renderer/object-type-renderer.component';
import { EIMTaskStatusChangeExecutorComponent } from './components/task-status-change-executor/task-status-change-executor.component';
import { EIMTaskOutputFolderInputFormItemComponent } from './components/task-output-folder-input-form-item/task-output-folder-input-form-item.component';
import { EIMTaskFolderTreeSelectorComponent } from './components/task-folder-tree-selector/task-folder-tree-selector.component';
import { EIMTaskEntryListSingleSelectorComponent } from './components/entry-list-selector/task-entry-list-single-selector.component';
import { EIMProjectMemberApplierComponent } from './components/project-member-applier/project-member-applier.component';
import { EIMProcessMasterUpdatorComponent } from './components/process-master-updator/process-master-updator.component';
import { EIMProjectMasterUpdatorComponent } from './components/project-master-updator/project-master-updator.component';
import { EIMTaskRevisionHistoryComponent } from './components/task-revision-history/task-revision-history.component';
import { EIMTaskProcessingHistoryComponent } from './components/task-processing-history/task-processing-history.component';
import { EIMTaskProcessingWaitingListComponent } from './components/task-processing-waiting-list/task-processing-waiting-list.component';
import { EIMProjectMemberSingleSelectorComponent } from './components/project-member-selector/project-member-single-selector.component';
import { EIMProjectMemberMailSendExecutorComponent } from './components/project-member-mail-send-executor/project-member-mail-send-executor.component';
import { EIMTaskAttachementFileInputFormItemComponent } from './components/task-attachement-file-input-form-item/task-attachement-file-input-form-item.component';
import { ListboxModule } from 'primeng/listbox';
import { EIMTaskStatusRegainExecutorComponent } from './components/task-status-regain-executor/task-status-regain-executor.component';
import { EIMFormsModule } from 'app/forms/forms.module';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';
import { EIMCheckBoxComponent } from 'app/shared/components/checkbox/checkbox.component';

//コンポーネントサービス

// レンダラー

// サービス

@NgModule({
	declarations: [

		EIMTaskHeaderComponent,

		EIMProjectMasterCreatorComponent,
		EIMProjectMasterUpdatorComponent,

		EIMProcessMasterCreatorComponent,
		EIMProcessMasterUpdatorComponent,

		EIMTaskMasterCreatorComponent,
		EIMTaskMasterUpdatorComponent,


		EIMProjectCreatorComponent,
		EIMProjectUpdatorComponent,
		EIMProjectMemberApplierComponent,

		EIMProcessCreatorComponent,
		EIMProcessUpdatorComponent,

		EIMTaskCreatorComponent,
		EIMTaskUpdatorComponent,

		EIMTaskFormComponent,
		EIMTaskOutputFileInputFormItemComponent,
		EIMTaskOutputFolderInputFormItemComponent,
		EIMTaskTemplateFileInputFormItemComponent,

		EIMTaskStatusChangeExecutorComponent,
		EIMTaskStatusRegainExecutorComponent,

		EIMTaskWorkflowDiagramComponent,

		EIMResponsibleObjectRoleSingleSelectorComponent,
		EIMResponsibleObjectRoleMultipleSelectorComponent,
		EIMProjectMemberSingleSelectorComponent,
		EIMProjectMemberMailSendExecutorComponent,
		EIMTaskFolderTreeSelectorComponent,

		EIMResponsibleObjectRoleInputFormItemComponent,
		EIMTaskObjectRoleEntryInputFormItemComponent,
		EIMObjectTypeInputFormItemComponent,

		EIMBooleanSwitchButtonInputRendererComponent,
		EIMObjectTypeInputRendererComponent,
		EIMTaskRevisionHistoryComponent,
		EIMTaskProcessingHistoryComponent,
		EIMTaskProcessingWaitingListComponent,
		EIMTaskEntryListSingleSelectorComponent,
		
		EIMTaskAttachementFileInputFormItemComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		PanelModule,
		TranslateModule,
		AccordionModule,
		RadioButtonModule,
		CheckboxModule,
		ButtonModule,
		FieldsetModule,
		SelectButtonModule,
		MenubarModule,
		ContextMenuModule,
		DialogModule,
		InputTextModule,
		TextareaModule ,
		CalendarModule,
		ToastModule,
		BreadcrumbModule,
		SelectModule,
		TooltipModule,
		ToggleButtonModule,
		TreeModule,
		TabsModule,
		ListboxModule,
		ConfirmDialogModule,
		NgxGanttModule,
		DrawerModule,
		AutoCompleteModule ,
		AgGridModule,
		FileUploadModule,
		AngularSplitModule,
		ClipboardModule,
		EIMSharedModule,
		EIMDocumentsModule,
		EIMFormsModule,
		EIMRadioButtonComponent,
		EIMCheckBoxComponent,
	],
	exports: [
		EIMTaskHeaderComponent,

		EIMProjectMasterCreatorComponent,
		EIMProjectMasterUpdatorComponent,

		EIMProcessMasterCreatorComponent,
		EIMProcessMasterUpdatorComponent,

		EIMTaskMasterCreatorComponent,
		EIMTaskMasterUpdatorComponent,


		EIMProjectCreatorComponent,
		EIMProjectUpdatorComponent,
		EIMProjectMemberApplierComponent,

		EIMProcessCreatorComponent,
		EIMProcessUpdatorComponent,

		EIMTaskCreatorComponent,
		EIMTaskUpdatorComponent,

		EIMTaskFormComponent,
		EIMTaskOutputFileInputFormItemComponent,
		EIMTaskOutputFolderInputFormItemComponent,
		EIMTaskTemplateFileInputFormItemComponent,

		EIMTaskStatusChangeExecutorComponent,
		EIMTaskStatusRegainExecutorComponent,

		EIMTaskWorkflowDiagramComponent,

		EIMResponsibleObjectRoleSingleSelectorComponent,
		EIMResponsibleObjectRoleMultipleSelectorComponent,
		EIMProjectMemberSingleSelectorComponent,
		EIMProjectMemberMailSendExecutorComponent,
		
		EIMTaskFolderTreeSelectorComponent,
		EIMTaskRevisionHistoryComponent,
		EIMTaskProcessingHistoryComponent,
		EIMTaskProcessingWaitingListComponent,

		EIMResponsibleObjectRoleInputFormItemComponent,
		EIMTaskObjectRoleEntryInputFormItemComponent,
		EIMObjectTypeInputFormItemComponent,

		EIMBooleanSwitchButtonInputRendererComponent,
		EIMObjectTypeInputRendererComponent,
		EIMTaskEntryListSingleSelectorComponent,

		EIMTaskAttachementFileInputFormItemComponent

	],

 	providers: [
		// bootstrapApplicationで実装したAngularアプリでは、NgModuleのprovidersはDIツリーに登録されないため、実装しないこと
		// tasksRoutesのprovidersに登録することを検討してください。
 	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class EIMTasksModule { }
