import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EIMAttributeInputFormItemModule } from 'app/shared/components/attribute-input-form-item/attribute-input-form-item.module';
import { EIMAttributeListInputFormItemComponent } from './attribute-list-input-form-item.component';
import { EIMAttributeListInputFormItemComponentService } from './attribute-list-input-form-item.component.service';

/**
 * 属性リスト入力モジュール.
 */
@NgModule({
  declarations: [
    EIMAttributeListInputFormItemComponent,
  ],
  providers: [
    EIMAttributeListInputFormItemComponentService,
  ],
  imports: [
    CommonModule,
    EIMAttributeInputFormItemModule,

  ],
  exports: [
EIMAttributeListInputFormItemComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})
export class EIMAttributeListInputFormItemModule { }
