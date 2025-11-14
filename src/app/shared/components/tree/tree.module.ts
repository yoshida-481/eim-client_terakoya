import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';

import { EIMTreeComponent } from './tree.component';
import { EIMTreeComponentService } from './tree.component.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

/**
 * ツリーモジュール
 */
@NgModule({
    declarations: [
        EIMTreeComponent
    ],
    exports: [
        EIMTreeComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        CommonModule,
        FormsModule,
        TreeModule,
        ContextMenuModule,
        ButtonModule],
    providers: [
        EIMTreeComponentService,
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class EIMTreeModule { }
