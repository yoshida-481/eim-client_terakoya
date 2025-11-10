import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EIMInputFormItemModule } from 'app/shared/components/input-form-item/input-form-item.module';
import { EIMHostingTemplateModule } from 'app/shared/directives/hosting-template/hosting-template.module';
import { EIMInputFormItemListComponent } from './input-form-item-list.component';



/**
 * 属性入力モジュール.
 */
@NgModule({
  declarations: [
    EIMInputFormItemListComponent,
  ],
  providers: [
  ],
  imports: [
		CommonModule,
		FormsModule,
    EIMInputFormItemModule,
		EIMHostingTemplateModule
  ],
  exports: [
	  EIMInputFormItemListComponent
	],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})
export class EIMInputFormItemListModule { }
