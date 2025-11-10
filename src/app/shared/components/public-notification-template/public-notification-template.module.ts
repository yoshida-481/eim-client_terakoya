import { EIMVerticalContainerModule } from 'app/shared/directives/vertical-container/vertical-container.module';
import { EIMPublicNotificationTemplateService } from 'app/shared/services/apis/public-notification-template.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { EIMDataGridModule } from '../data-grid/data-grid.module';
import { EIMEntrySelectorComponentService } from '../entry-selector/entry-selector.component.service';
import { EIMMultipleSelectorModule } from '../multiple-selector/multiple-selector.module';
import { EIMTreeModule } from '../tree/tree.module';
import { EIMPublicNotificationTemplateCreatorComponent } from './public-notification-template-creator.component';
import { EIMPublicNotificationTemplateUpdaterComponent } from './public-notification-template-updater.component';

@NgModule({
	declarations: [
		EIMPublicNotificationTemplateCreatorComponent,
		EIMPublicNotificationTemplateUpdaterComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		ButtonModule,
		InputTextModule,
		PanelModule,
		TabsModule,
		TooltipModule,
		EIMDataGridModule,
		EIMMultipleSelectorModule,
		EIMTreeModule,
		EIMVerticalContainerModule,
	],
	exports: [
		EIMPublicNotificationTemplateCreatorComponent,
		EIMPublicNotificationTemplateUpdaterComponent,
	],
	providers: [
		EIMEntrySelectorComponentService,
		EIMPublicNotificationTemplateService,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
	]
})
export class EIMPublicNotificationTemplateModule { }
