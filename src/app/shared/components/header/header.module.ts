import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';

import { EIMHeaderComponent } from '../header/header.component';
import { EIMMenubarModule } from 'app/shared/components/menubar/menubar.module';

/**
 * ヘッダーモジュール
 */
@NgModule({
	declarations: [
		EIMHeaderComponent
	],
  imports: [
    CommonModule,
    DialogModule,
		ButtonModule,
		EIMMenubarModule,
		SelectButtonModule,
		TooltipModule,
  ],
  exports: [
    EIMHeaderComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})
export class EIMHeaderModule { }
