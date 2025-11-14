import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { AgGridModule } from 'ag-grid-angular';

import { EIMDataGridComponent } from './data-grid.component';
import { EIMDataGridComponentService } from './data-grid.component.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EIMTreeFormatResultDTOToTreeNodesConverterService } from 'app/shared/services/converters/tree-format-result-dto-to-tree-nodes-converter.service';
import { AllCommunityModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([ AllCommunityModule ]); 

/**
 * データグリッドモジュール
 */
@NgModule({
    declarations: [
        EIMDataGridComponent,
    ],
    exports: [
        EIMDataGridComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        TableModule,
        ContextMenuModule,
        ButtonModule,
        AgGridModule],
    providers: [
        EIMDataGridComponentService,
        EIMTreeFormatResultDTOToTreeNodesConverterService,
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class EIMDataGridModule { }
