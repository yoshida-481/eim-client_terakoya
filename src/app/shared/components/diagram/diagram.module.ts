import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms'

import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TooltipModule } from 'primeng/tooltip';

import { EIMDiagramComponent } from './diagram.component';
import { EIMDiagramComponentService } from './diagram.component.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

/**
 * ダイアグラムモジュール
 */
@NgModule({
    declarations: [
        EIMDiagramComponent
    ],
    exports: [
        EIMDiagramComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ButtonModule,
        ContextMenuModule,
        TooltipModule],
    providers: [
        EIMDiagramComponentService,
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class EIMDiagramModule { }
