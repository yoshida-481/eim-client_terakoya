import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// ngx-translate
import { TranslateModule } from '@ngx-translate/core';

// Primeng
import { InputTextModule } from 'primeng/inputtext';

import { EIMVersionDisplayComponent } from './version-display.component';

/**
 * バージョン表示モジュール
 */
@NgModule({
	declarations: [
		EIMVersionDisplayComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,

		TranslateModule,

		InputTextModule,
	],
	exports: [
		EIMVersionDisplayComponent,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class EIMVersionDisplayModule { }
