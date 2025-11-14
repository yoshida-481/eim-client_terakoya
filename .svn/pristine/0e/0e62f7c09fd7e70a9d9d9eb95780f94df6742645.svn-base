import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx-translate
import { TranslateModule } from '@ngx-translate/core';

// Primeng
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { MenubarModule } from 'primeng/menubar';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// ng2-file-upload
import { FileUploadModule } from 'ng2-file-upload';

// ag-grid
import { AgGridModule } from 'ag-grid-angular';

// angular-split
import { AngularSplitModule } from 'angular-split';

// EIM共通モジュール
import { EIMSharedModule } from 'app/shared/shared.module';

// コンポーネント
import { EIMObjectUpdatorComponent } from 'app/object-editors/components/object-updator/object-updator.component';
import { EIMEventUpdatorComponent } from 'app/object-editors/components/event-updator/event-updator.component';
import { EIMStatusUpdatorComponent } from 'app/object-editors/components/status-updator/status-updator.component';
import { EIMObjectSearchComponent } from 'app/object-editors/components/object-search/object-search.component';
import { EIMRelationObjectTreeComponent } from 'app/object-editors/components/relation-object-tree/relation-object-tree.component';
import { EIMRevisionListComponent } from 'app/object-editors/components/revision-list/revision-list.component';
import { EIMObjectListComponent } from 'app/object-editors/components/object-list/object-list.component';
import { EIMAttributeListComponent } from 'app/object-editors/components/attribute-list/attribute-list.component';
import { EIMObjectCreatorComponent } from 'app/object-editors/components/object-creator/object-creator.component';
import { EIMObjectEditorsSecuritySelectorComponent } from 'app/object-editors/components/object-editors-security-selector/object-editors-security-selector.component';
import { EIMRelationCreatorComponent } from 'app/object-editors/components/relation-creator/relation-creator.component';
import { EIMNewObjectListComponent } from 'app/object-editors/components/new-object-list/new-object-list.component';
import { EIMAssignUpdatorComponent } from 'app/object-editors/components/assign-updator/assign-updator.component';
import { EIMEventHistoryListComponent } from 'app/object-editors/components/event-history-list/event-history-list.component';
import { EIMObjectNameRendererComponent } from 'app/object-editors/shared/components/renderer/object-name-renderer.component';
import { EIMLockComponent } from 'app/object-editors/components/lock/lock.component';
import { EIMFileUploaderComponent } from 'app/object-editors/components/file-uploader/file-uploader.component';
import { EIMRelationUpdatorComponent } from 'app/object-editors/components/relation-updator/relation-updator.component';
import { EIMFileNameLinkRendererComponent } from 'app/object-editors/shared/components/renderer/file-name-link-renderer.component';
import { EIMObjectInputFormItemComponent } from 'app/object-editors/components/object-input-form-item/object-input-form-item.component';
import { EIMObjectEditorsSearchCalendarInputFormItemComponent } from 'app/object-editors/shared/components/object-editors-calendar-search-input-form-item/object-editors-calendar-search-input-form-item.component';

// サービス
import { EIMObjectSelectorComponent } from 'app/object-editors/components/object-selector/object-selector.component';
import { EIMObjectTypeSelectorComponent } from 'app/object-editors/components/object-type-selector/object-type-selector.component';
import { EIMFormatIconRendererComponent } from 'app/object-editors/shared/components/renderer/format-icon-renderer.component';
import { EIMUserIconRendererComponent } from 'app/object-editors/shared/components/renderer/user-icon-renderer.component';
import { EIMEventHistoryIconRendererComponent } from 'app/object-editors/shared/components/renderer/event-history-icon-renderer.component';
import { EIMCheckBoxComponent } from 'app/shared/components/checkbox/checkbox.component';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';

/**
 * オブジェクトエディタモジュール
 */
@NgModule({
	declarations: [
		EIMObjectListComponent,
		EIMObjectSearchComponent,
		EIMRelationObjectTreeComponent,
		EIMRevisionListComponent,
		EIMNewObjectListComponent,
		EIMObjectUpdatorComponent,
		EIMEventUpdatorComponent,
		EIMStatusUpdatorComponent,
		EIMAttributeListComponent,
		EIMObjectCreatorComponent,
		EIMObjectEditorsSecuritySelectorComponent,
		EIMRelationCreatorComponent,
		EIMAssignUpdatorComponent,
		EIMEventHistoryListComponent,
		EIMLockComponent,
		EIMObjectNameRendererComponent,
		EIMFileUploaderComponent,
		EIMObjectSelectorComponent,
		EIMObjectTypeSelectorComponent,
		EIMRelationUpdatorComponent,
		EIMFileNameLinkRendererComponent,
		EIMFormatIconRendererComponent,
		EIMEventHistoryIconRendererComponent,
		EIMObjectInputFormItemComponent,
		EIMUserIconRendererComponent,
		EIMObjectEditorsSearchCalendarInputFormItemComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CheckboxModule,
        DatePickerModule,
		TranslateModule,
		ConfirmDialogModule,

		ButtonModule,
		DialogModule,
		SelectModule,
		ToastModule,
		InputTextModule,
		PanelModule,
		MenubarModule,
		ContextMenuModule,
		TooltipModule,

		AgGridModule,

		FileUploadModule,
		AngularSplitModule,

		EIMCheckBoxComponent,
		EIMRadioButtonComponent,
		EIMSharedModule,
	],
	exports: [
		EIMObjectListComponent,
		EIMObjectSearchComponent,
		EIMRelationObjectTreeComponent,
		EIMRevisionListComponent,
		EIMNewObjectListComponent,
		EIMObjectUpdatorComponent,
		EIMEventUpdatorComponent,
		EIMStatusUpdatorComponent,
		EIMAttributeListComponent,
		EIMObjectCreatorComponent,
		EIMObjectEditorsSecuritySelectorComponent,
		EIMRelationCreatorComponent,
		EIMAssignUpdatorComponent,
		EIMEventHistoryListComponent,
		EIMLockComponent,
		EIMFileUploaderComponent,
		EIMObjectSelectorComponent,
		EIMObjectTypeSelectorComponent,
		EIMRelationUpdatorComponent,
		EIMObjectInputFormItemComponent,
		EIMObjectEditorsSearchCalendarInputFormItemComponent,
	],

	providers: [
		// bootstrapApplicationで実装したAngularアプリでは、NgModuleのprovidersはDIツリーに登録されないため、実装しないこと
		// bootstrapApplication()のprovidersに登録することを検討してください。
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class EIMObjectEditorsModule { }
