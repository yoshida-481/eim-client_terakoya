import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { NgxGanttModule } from '@worktile/gantt';

import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TooltipModule } from 'primeng/tooltip';
import { EIMMenubarModule } from '../menubar/menubar.module';

import { EIMGanttChartComponent } from './gantt-chart.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { EIMDataGridModule } from '../data-grid/data-grid.module';
import { EIMTreeFormatResultDTOToTreeNodesConverterService } from 'app/shared/services/converters/tree-format-result-dto-to-tree-nodes-converter.service';

/**
 * ガントチャートモジュール
 */
@NgModule({
	declarations: [
		EIMGanttChartComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		NgxGanttModule,
		ButtonModule,
		ContextMenuModule,
		TooltipModule,
		SelectButtonModule,
		EIMMenubarModule,
		EIMDataGridModule
	],
	exports: [
		EIMGanttChartComponent
	],
	providers: [
		EIMTreeFormatResultDTOToTreeNodesConverterService
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]

})
export class EIMGanttChartModule { }
