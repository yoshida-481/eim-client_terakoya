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
import { TabMenuModule } from 'primeng/tabmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule  } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
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

import { EIMPortalHeaderComponent } from './components/portal-header/portal-header.component';
import { EIMTasksModule } from 'app/tasks/tasks.module';
import { EIMDocumentsModule } from 'app/documents/documents.module';
import { EIMWorkspaceHomeWidgetWrapperComponent } from './components/workspace-home-widget-wrapper/workspace-home-widget-wrapper.component';
import { EIMWorkspaceHomeWidgetMyTasksComponent } from './components/workspace-home-widget-my-tasks/workspace-home-widget-my-tasks.component';
import { EIMWorkspaceHomeWidgetDelayedTasksComponent } from './components/workspace-home-widget-delayed-tasks/workspace-home-widget-delayed-tasks.component';
import { EIMWorkspaceHomeWidgetTodayCompletePlanTasksComponent } from './components/workspace-home-widget-today-complete-plan-tasks/workspace-home-widget-today-complete-plan-tasks.component';
import { EIMWorkspaceHomeWidgetScheduledScopeTasksComponent } from './components/workspace-home-widget-scheduled-scope-tasks/workspace-home-widget-scheduled-scope-tasks.component';

//コンポーネントサービス

// レンダラー

// サービス

@NgModule({
	declarations: [
		EIMPortalHeaderComponent,

		EIMWorkspaceHomeWidgetWrapperComponent,
		EIMWorkspaceHomeWidgetMyTasksComponent,
		EIMWorkspaceHomeWidgetDelayedTasksComponent,
		EIMWorkspaceHomeWidgetTodayCompletePlanTasksComponent,
		EIMWorkspaceHomeWidgetScheduledScopeTasksComponent
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
		TabMenuModule,
		ContextMenuModule,
		DialogModule,
		InputTextModule,
		TextareaModule ,
		CalendarModule,
		ToastModule,
		BreadcrumbModule,
		TooltipModule,
		TreeModule,
		TabViewModule,
		SelectModule,
		ConfirmDialogModule,
		DrawerModule,
		AgGridModule,
		FileUploadModule,
		AngularSplitModule,
		ClipboardModule,
		EIMSharedModule,

		EIMDocumentsModule,
		EIMTasksModule
	],
	exports: [
		EIMPortalHeaderComponent,
	],

	providers: [
		// bootstrapApplicationで実装したAngularアプリでは、NgModuleのprovidersはDIツリーに登録されないため、実装しないこと
		// portalsRoutesのprovidersに登録することを検討してください。
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class EIMPortalsModule { }
