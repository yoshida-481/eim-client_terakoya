import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EIMMenubarComponent } from 'app/shared/components/menubar/menubar.component';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
/**
 * メニューバーモジュール
 */
@NgModule({
	declarations: [
		EIMMenubarComponent
	],
	imports: [
		CommonModule,
		MenubarModule,
	],
	exports: [
		EIMMenubarComponent,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class EIMMenubarModule { }
