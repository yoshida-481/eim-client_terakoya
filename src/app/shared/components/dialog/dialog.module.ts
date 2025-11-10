import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// ngx-translate
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { EIMDialogComponent } from './dialog.component';

/**
 * ダイアログモジュール
 */
@NgModule({
	declarations: [
		EIMDialogComponent
	],
  imports: [
    CommonModule,
    DialogModule,
		ButtonModule,
		TranslateModule,
  ],
  exports: [
EIMDialogComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})
export class EIMDialogModule { }
