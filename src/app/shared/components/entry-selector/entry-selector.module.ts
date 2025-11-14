import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';

import { EIMDataGridModule } from 'app/shared/components/data-grid/data-grid.module';
import { EIMMultipleSelectorModule } from 'app/shared/components/multiple-selector/multiple-selector.module';
import { EIMTreeModule } from 'app/shared/components/tree/tree.module';
import { EIMVerticalContainerModule } from 'app/shared/directives/vertical-container/vertical-container.module';

import { EIMMultipleEntrySelectorComponent } from 'app/shared/components/entry-selector/multiple-entry-selector.component';
import { EIMEntrySelectorComponentService } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMPublicNotificationTemplateService } from 'app/shared/services/apis/public-notification-template.service';


/**
 * エントリ選択モジュール
 */
@NgModule({
	declarations: [
		EIMMultipleEntrySelectorComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		ButtonModule,
		TabsModule,
		TooltipModule,

		EIMDataGridModule,
		EIMMultipleSelectorModule,
		EIMTreeModule,
		EIMVerticalContainerModule,

	],
	exports: [
		EIMMultipleEntrySelectorComponent,
	],
	providers: [
		EIMEntrySelectorComponentService,
		EIMPublicNotificationTemplateService,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]

})
export class EIMEntrySelectorModule { }
