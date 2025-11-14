import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TreeTableModule } from 'primeng/treetable';
import { ContextMenuModule } from 'primeng/contextmenu';

import { EIMTreeDataGridComponent } from './tree-data-grid.component';
import { EIMTreeDataGridComponentService } from './tree-data-grid.component.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

/**
 * ツリーモジュール
 */
@NgModule({
    declarations: [
        EIMTreeDataGridComponent
    ],
    exports: [
        EIMTreeDataGridComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        CommonModule,
        FormsModule,
        TooltipModule,
        TreeTableModule,
        ContextMenuModule,
        ButtonModule],
    providers: [
        EIMTreeDataGridComponentService,
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class EIMTreeDataGridModule { }
