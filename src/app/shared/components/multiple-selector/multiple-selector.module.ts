import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { EIMMultipleSelectorComponent } from './multiple-selector.component';
import { EIMMultipleSelectorComponentService } from './multiple-selector.component.service';
import { EIMDataGridModule } from 'app/shared/components/data-grid/data-grid.module';
import { PanelModule } from 'primeng/panel';

/**
 * 複数選択モジュール
 */
@NgModule({
	declarations: [
		EIMMultipleSelectorComponent
	],
	imports: [
		CommonModule,
		TranslateModule,
		ButtonModule,
		TooltipModule,
		PanelModule,
		EIMDataGridModule,
	],
	exports: [
		EIMMultipleSelectorComponent
	],
	providers: [
		EIMMultipleSelectorComponentService,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]

})
export class EIMMultipleSelectorModule { }
