import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EIMInputFormItemListModule } from '../input-form-item-list/input-form-item-list.module';
import { EIMInputFormItemResolverModule } from '../input-form-item-resolver/input-form-item-resolver.module';
import { EIMFormComponent } from './form.component';

/**
 * ヘッダーモジュール
 */
@NgModule({
	declarations: [
		EIMFormComponent
	],
  imports: [
		CommonModule,
		FormsModule,
		EIMInputFormItemListModule,
		EIMInputFormItemResolverModule,
  ],
  exports: [
    EIMFormComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})
export class EIMFormModule { }
