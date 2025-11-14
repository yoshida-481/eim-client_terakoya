import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// PrimeNg
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';

// ag-grid
import { AgGridModule } from 'ag-grid-angular';

// EIM共通モジュール
import { EIMAttributeInputFormItemModule } from './components/attribute-input-form-item/attribute-input-form-item.module';
import { EIMAttributeListInputFormItemModule } from './components/attribute-list-input-form-item/attribute-list-input-form-item.module';
import { EIMDataGridModule } from './components/data-grid/data-grid.module';
import { EIMDataGridSingleSelectorModule } from './components/data-grid-single-selector/data-grid-single-selector.module';
import { EIMDiagramModule } from './components/diagram/diagram.module';
//import { EIMDialogManagerModule } from './components/dialog-manager/dialog-manager.module';
import { EIMEntrySelectorModule } from 'app/shared/components/entry-selector/entry-selector.module';
import { EIMHeaderModule } from './components/header/header.module';
import { EIMInputFormItemModule } from './components/input-form-item/input-form-item.module';
import { EIMSearchInputFormItemModule } from './components/search-input-form-item/search-input-form-item.module';
//import { EIMLoginModule } from './components/login/login.module';
import { EIMMasterSelectorModule } from './components/master-selector/master-selector.module';
//import { EIMMessageModule } from './components/message/message.module';
import { EIMMultipleSelectorModule } from './components/multiple-selector/multiple-selector.module';
import { EIMSingleSelectorModule } from './components/single-selector/single-selector.module';
import { EIMTreeModule } from './components/tree/tree.module';
import { EIMTreeDataGridModule } from './components/tree-data-grid/tree-data-grid.module';
import { EIMUserSelectorModule } from './components/user-selector/user-selector.module';
import { EIMDialogModule } from './components/dialog/dialog.module';
import { EIMPasswordChangeModule } from './components/password-change/password-change.module';

import { EIMVerticalContainerModule } from 'app/shared/directives/vertical-container/vertical-container.module';
import { EIMVersionDisplayModule } from './components/version-display/version-display.module';

// EIM共通レンダラ
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { EIMMultipleLinesRendererComponent } from 'app/shared/components/renderer/multiple-lines-renderer.component';
import { EIMDateRendererComponent } from 'app/shared/components/renderer/date-renderer.component';
import { EIMDateRendererComponentService } from 'app/shared/components/renderer/date-renderer.component.service';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMDefaultRendererComponent } from 'app/shared/components/renderer/default-renderer.component';
import { EIMLargeTextRendererComponent } from 'app/shared/components/renderer/large-text-renderer.component';
import { EIMValueTypeRendererComponent } from 'app/shared/components/renderer/value-type-renderer.component';
import { EIMValueTypeRendererComponentService } from 'app/shared/components/renderer/value-type-renderer.component.service';
import { EIMCheckboxRendererComponent } from 'app/shared/components/renderer/checkbox-renderer.component';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';
import { EIMUserDefaultRendererComponent } from 'app/shared/components/renderer/user-default-renderer.component';
import { EIMRoleNameKanaRendererComponent } from 'app/shared/components/renderer/role-name-kana-renderer.component';
import { EIMNameRendererComponent } from 'app/shared/components/renderer/name-renderer.component';
import { EIMGroupNameRendererComponent } from 'app/shared/components/renderer/group-name-renderer.component';
import { EIMRoleNameRendererComponent } from 'app/shared/components/renderer/role-name-renderer.component';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';


import { EIMEntrySelectorComponentService } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMMenubarModule } from 'app/shared/components/menubar/menubar.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EIMMenuChangeDetectionService } from './services/menu-change-detection.service';
import { EIMFormModule } from './components/form/form.module';
import { EIMInputFormItemListModule } from './components/input-form-item-list/input-form-item-list.module';
import { EIMHostingTemplateModule } from './directives/hosting-template/hosting-template.module';
import { EIMInputFormItemResolverModule } from './components/input-form-item-resolver/input-form-item-resolver.module';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMGanttChartModule } from './components/gantt-chart/gantt-chart.module';
import { EIMRendererComponentService } from './components/renderer/renderer.component.service';
import { EIMCalendarInputRendererComponent } from './components/renderer/calendar-input-renderer.component';
import { EIMDropdownInputRendererComponent } from './components/renderer/dropdown-input-renderer.component';
import { EIMDataGridTreeToggleButtonDirective } from './directives/data-grid-tree-toggle-button/data-grid-tree-toggle-button.directive';
import { EIMJsonToTreeFormatResultDTOConverterService } from './services/converters/json-to-tree-format-result-dto-converter.service';
import { EIMJsonToListFormatResultDTOConverterService } from './services/converters/json-to-list-format-result-dto-converter.service';
import { EIMTreeFormatResultDTOToTreeNodesConverterService } from './services/converters/tree-format-result-dto-to-tree-nodes-converter.service';
import { EIMListFormatResultDTOToTreeNodesConverterService } from './services/converters/list-format-result-dto-to-tree-nodes-converter.service';
import { EIMProgressBarRendererComponent } from './components/renderer/progress-bar-renderer.component';
import { EIMObjectTypeInputRendererComponentService } from 'app/tasks/components/object-type-input-renderer/object-type-renderer.component.service';
import { EIMDropdownInputRendererComponentService } from './components/renderer/dropdown-input-renderer.component.service';
import { EIMRadioButtonComponent } from './components/radio-button/radio-button.component';
import { EIMCheckBoxComponent } from './components/checkbox/checkbox.component';
import { SelectModule } from 'primeng/select';

/**
 *
 * 共通モジュールです。<br/>
 * 以下をインポートしてください。<br/>
 * <br/>
 * import { EIMSharedModule } from 'app/shared/shared.module';
 * @class EIMSharedModule
 * @module EIMSharedModule
 */
@NgModule({
	declarations: [
		EIMTooltipRendererComponent,
		EIMMultipleLinesRendererComponent,
		EIMDateRendererComponent,
		EIMDateTimeRendererComponent,
		EIMDefaultRendererComponent,
		EIMLargeTextRendererComponent,
		EIMValueTypeRendererComponent,
		EIMCheckboxRendererComponent,
		EIMUserDefaultRendererComponent,
		EIMRoleNameKanaRendererComponent,
		EIMNameRendererComponent,
		EIMGroupNameRendererComponent,
		EIMRoleNameRendererComponent,
		EIMNumberRendererComponent,
		EIMValueRendererComponent,
		EIMDropdownInputRendererComponent,
		EIMCalendarInputRendererComponent,

		EIMDataGridTreeToggleButtonDirective,
		EIMProgressBarRendererComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		//HttpClientModule,
		ReactiveFormsModule,

		TableModule,
		TreeModule,
		ButtonModule,
		TooltipModule,

		TranslateModule,
		CheckboxModule,
		DropdownModule,
		SelectModule,
		DatePickerModule,

		EIMAttributeInputFormItemModule,
		EIMAttributeListInputFormItemModule,
		EIMDataGridModule,
		EIMDataGridSingleSelectorModule,
		EIMDiagramModule,
		//EIMDialogManagerModule,
		EIMEntrySelectorModule,
		EIMHeaderModule,
		EIMInputFormItemModule,
		EIMSearchInputFormItemModule,
		//EIMLoginModule,
		EIMMasterSelectorModule,
		//EIMMessageModule,
		EIMTreeModule,
		EIMTreeDataGridModule,
		EIMUserSelectorModule,
		EIMDialogModule,
		EIMMultipleSelectorModule,
		EIMSingleSelectorModule,
		EIMPasswordChangeModule,
		EIMMenubarModule,
		EIMFormModule,
		EIMInputFormItemListModule,
		EIMInputFormItemResolverModule,
		EIMVerticalContainerModule,
		EIMVersionDisplayModule,
		EIMGanttChartModule,
		AgGridModule,

		//Standalone Component
        EIMRadioButtonComponent,
        EIMCheckBoxComponent,
	],
	exports: [
		EIMAttributeInputFormItemModule,
		EIMAttributeListInputFormItemModule,
		EIMDataGridModule,
		EIMDataGridSingleSelectorModule,
		EIMDiagramModule,
		//EIMDialogManagerModule,
		EIMEntrySelectorModule,
		EIMHeaderModule,
		EIMInputFormItemModule,
		EIMSearchInputFormItemModule,
		//EIMLoginModule,
		EIMMasterSelectorModule,
		//EIMMessageModule,
		EIMTreeModule,
		EIMTreeDataGridModule,
		EIMUserSelectorModule,
		EIMDialogModule,
		EIMMultipleSelectorModule,
		EIMSingleSelectorModule,
		EIMVerticalContainerModule,
		EIMVersionDisplayModule,
		EIMPasswordChangeModule,
		EIMMenubarModule,
		EIMFormModule,
		EIMInputFormItemResolverModule,
		EIMHostingTemplateModule,
		EIMGanttChartModule,

		EIMDataGridTreeToggleButtonDirective,
		EIMCalendarInputRendererComponent
	],
	providers: [
		// bootstrapApplicationで実装したAngularアプリでは、NgModule の providersはDIツリーに登録されないため、実装しないこと
		// bootstrapApplicationのprovidersに登録することを検討してください。
	],

})
export class EIMSharedModule { }
