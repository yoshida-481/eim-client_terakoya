import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ButtonModule } from 'primeng/button';

import { EIMSingleSelectorComponent } from './single-selector.component';

import { EIMDataGridModule } from 'app/shared/components/data-grid/data-grid.module';

/**
 * 単一選択モジュール
 */
@NgModule({
	declarations: [
		EIMSingleSelectorComponent
	],
	imports: [
		CommonModule,
		ButtonModule,
		EIMDataGridModule,
	],
	exports: [
		EIMSingleSelectorComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]

})
export class EIMSingleSelectorModule { }
