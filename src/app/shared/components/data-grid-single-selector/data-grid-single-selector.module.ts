import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { EIMInputFormItemModule } from 'app/shared/components/input-form-item/input-form-item.module';
import { EIMTemplateDataGridSingleSelectorComponent } from './template-data-grid-single-selector/template-data-grid-single-selector.component';
import { EIMDataGridSingleSelectorComponent } from './data-grid-single-selector.component';
import { EIMDataGridSingleSelectorComponentService } from './data-grid-single-selector.component.service';

import { EIMDataGridModule } from 'app/shared/components/data-grid/data-grid.module';
import { EIMVerticalContainerModule } from 'app/shared/directives/vertical-container/vertical-container.module';

/**
 * データグリッド単一選択モジュール
 */
@NgModule({
	declarations: [
	  EIMTemplateDataGridSingleSelectorComponent,
		EIMDataGridSingleSelectorComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		ButtonModule,
		TooltipModule,
		EIMInputFormItemModule,
		EIMDataGridModule,
		EIMVerticalContainerModule,
	],
	exports: [
    EIMTemplateDataGridSingleSelectorComponent,
		EIMDataGridSingleSelectorComponent
	],
	providers: [
		EIMDataGridSingleSelectorComponentService,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]

})
export class EIMDataGridSingleSelectorModule { }
