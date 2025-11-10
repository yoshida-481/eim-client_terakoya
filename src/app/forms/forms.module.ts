import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx-translate
import { TranslateModule } from '@ngx-translate/core';

//Primeng
import { AccordionModule } from 'primeng/accordion';
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
import { TreeModule } from 'primeng/tree';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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

// EIM帳票用コンポーネント
import { EIMFormMainComponent } from './components/form-main/form-main.component';
import { EIMFormRegainComponent } from './components/form-regain/form-regain.component';
import { EIMFormSearchConditionComponent } from './components/form-search-condition/form-search-condition.component';
import { EIMFormCreatorComponent } from './components/form-creator/form-creator.component';
import { EIMFormUpdatorComponent } from './components/form-updator/form-updator.component';
import { EIMFormNewCopyCreatorComponent } from './components/form-new-copy-creator/form-new-copy-creator.component';
import { EIMDialogManagerComponent } from './shared/components/dialog-manager/dialog-manager.component';
import { EIMHierarchicalAttributeListInputFormItemComponent } from './shared/components/hierarchical-attribute-list-input-form-item/hierarchical-attribute-list-input-form-item.component';
import { EIMFormCsvDownloadComponent } from './components/form-csv-download/form-csv-download.component';
import { EIMDisplayColumnEditorComponent } from './components/display-column-editor/display-column-editor.component';
import { EIMFormListColumnMultipleSelectorComponent } from './components/form-list-column-selector/form-list-column-multiple-selector.component';
import { EIMFormListColumnSingleSelectorComponent } from './components/form-list-column-selector/form-list-column-single-selector.component';
import { EIMWorkflowDiagramComponent } from './components/workflow-diagram/workflow-diagram.component';
import { EIMStatusChangeComponent } from './components/status-change/status-change.component';
import { EIMFormWorkspaceTreeSelectorComponent } from './components/form-workspace-tree-selector/form-workspace-tree-selector.component';
import { EIMFormAccessHistoryComponent } from './components/access-history/form-access-history.component';
import { EIMEntryListSingleSelectorComponent } from './components/entry-list-selector/entry-list-single-selector.component';

// レンダラー
import { EIMIdRendererComponent } from 'app/forms/shared/components/renderer/id-renderer.component';
import { EIMFormAttributeRendererComponent } from 'app/forms/shared/components/renderer/attribute-renderer.component';

// サービス
import { EIMFlatTypeAttributeInputFormItemComponent } from './shared/components/flat-type-attribute-input-form-item/flat-type-attribute-input-form-item.component';
import { EIMFlatTypeHierarchicalAttributeListInputFormItemComponent } from './shared/components/flat-type-hierarchical-attribute-list-input-form-item/flat-type-hierarchical-attribute-list-input-form-item.component';
import { EIMCheckBoxComponent } from 'app/shared/components/checkbox/checkbox.component';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';

@NgModule({
	declarations: [
		EIMFormMainComponent,
		EIMFormRegainComponent,
		EIMFormSearchConditionComponent,
		EIMFormCreatorComponent,
		EIMFormUpdatorComponent,
		EIMFormNewCopyCreatorComponent,
		EIMIdRendererComponent,
		EIMFormAttributeRendererComponent,
		EIMDialogManagerComponent,
		EIMHierarchicalAttributeListInputFormItemComponent,
		EIMFormCsvDownloadComponent,
		EIMDisplayColumnEditorComponent,
		EIMFormListColumnMultipleSelectorComponent,
		EIMFormListColumnSingleSelectorComponent,
		EIMWorkflowDiagramComponent,
		EIMStatusChangeComponent,
		EIMFormWorkspaceTreeSelectorComponent,
		EIMEntryListSingleSelectorComponent,
		EIMFormAccessHistoryComponent,
		EIMFlatTypeAttributeInputFormItemComponent,
		EIMFlatTypeHierarchicalAttributeListInputFormItemComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		PanelModule,
		TranslateModule,
		AccordionModule,
		ButtonModule,
		FieldsetModule,
		SelectButtonModule,
		MenubarModule,
		ContextMenuModule,
		DialogModule,
		InputTextModule,
		TextareaModule ,
		DatePickerModule,
		ToastModule,
		BreadcrumbModule,
		SelectModule,
		TooltipModule,
		TreeModule,
		TabViewModule,
		ConfirmDialogModule,
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
	  EIMFormMainComponent,
	  EIMFormRegainComponent,
	  EIMFormSearchConditionComponent,
	  EIMFormCreatorComponent,
	  EIMFormUpdatorComponent,
	  EIMFormNewCopyCreatorComponent,
	  EIMDialogManagerComponent,
	  EIMHierarchicalAttributeListInputFormItemComponent,
	  EIMFormCsvDownloadComponent,
	  EIMDisplayColumnEditorComponent,
	  EIMFormListColumnMultipleSelectorComponent,
	  EIMFormListColumnSingleSelectorComponent,
	  EIMWorkflowDiagramComponent,
	  EIMStatusChangeComponent,
      EIMFormWorkspaceTreeSelectorComponent,
	  EIMEntryListSingleSelectorComponent,
	  EIMFormAccessHistoryComponent,
	  EIMFlatTypeAttributeInputFormItemComponent,
	  EIMFlatTypeHierarchicalAttributeListInputFormItemComponent,
	],
	providers: [
		// bootstrapApplicationで実装したAngularアプリでは、NgModuleのprovidersはDIツリーに登録されないため、実装しないこと
		// formsRoutesのprovidersに登録することを検討してください。
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class EIMFormsModule { }
