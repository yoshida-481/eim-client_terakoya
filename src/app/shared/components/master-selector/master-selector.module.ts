import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';

import { EIMDataGridSingleSelectorModule } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.module';
import { EIMInputFormItemModule } from 'app/shared/components/input-form-item/input-form-item.module';
import { EIMMasterSingleSelectorComponent } from './master-single-selector.component';
import { EIMMasterSingleSelectorComponentService } from './master-single-selector.component.service';
import { EIMMasterMultipleSelectorComponentService } from './master-multiple-selector.component.service';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMDataGridModule } from 'app/shared/components/data-grid/data-grid.module';
import { EIMVerticalContainerModule } from 'app/shared/directives/vertical-container/vertical-container.module';

/**
 * ユーザ選択モジュール
 */
@NgModule({
	declarations: [
		EIMMasterSingleSelectorComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		ButtonModule,
		EIMDataGridSingleSelectorModule,
		EIMInputFormItemModule,
		EIMDataGridModule,
		EIMVerticalContainerModule,
	],
	exports: [
	  EIMMasterSingleSelectorComponent,
	],
	providers: [
		EIMMasterSingleSelectorComponentService,
		EIMMasterMultipleSelectorComponentService,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]

})
export class EIMMasterSelectorModule { }
