import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { EIMDataGridSingleSelectorModule } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.module';
import { EIMInputFormItemModule } from 'app/shared/components/input-form-item/input-form-item.module';
import { EIMUserSelectorComponent } from './user-selector.component';
import { EIMUserSelectorComponentService } from './user-selector.component.service';
import { EIMUserMultipleSelectorComponentService } from './user-multiple-selector.component.service';


import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMDataGridModule } from 'app/shared/components/data-grid/data-grid.module';
import { EIMVerticalContainerModule } from 'app/shared/directives/vertical-container/vertical-container.module';

/**
 * ユーザ選択モジュール
 */
@NgModule({
	declarations: [
    EIMUserSelectorComponent,
	],
	imports: [
		InputTextModule,
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
	  EIMUserSelectorComponent,
	],
	providers: [
		EIMUserSelectorComponentService,
		EIMUserMultipleSelectorComponentService,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]

})
export class EIMUserSelectorModule { }
