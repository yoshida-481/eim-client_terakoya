import { Routes } from '@angular/router';

import { EIMFormsComponent } from './forms.component';
import { EIMFormLoginComponent } from './components/login/login.component';
import { EIMFormAuthenticationGuard } from './shared/guards/authentication.guard';

//コンポーネントサービス
import { EIMDialogManagerComponentService } from './shared/components/dialog-manager/dialog-manager.component.service';
import { EIMHierarchicalAttributeListInputFormItemComponentService } from './shared/components/hierarchical-attribute-list-input-form-item/hierarchical-attribute-list-input-form-item.component.service';
import { EIMFormListColumnMultipleSelectorComponentService } from './components/form-list-column-selector/form-list-column-multiple-selector.component.service';
import { EIMFormListColumnSingleSelectorComponentService } from './components/form-list-column-selector/form-list-column-single-selector.component.service';
import { EIMStatusChangeWorkflowDiagramComponentService } from './components/status-change-workflow-diagram/status-change-workflow-diagram.component.service';
import { EIMWorkflowDiagramComponentService } from 'app/forms/components/workflow-diagram/workflow-diagram.component.service';

import { EIMFormDiversionTreeComponentService } from 'app/forms/components/form-diversion-tree/form-diversion-tree.component.service';
import { EIMFormMoveTreeComponentService } from 'app/forms/components/form-move-tree/form-move-tree.component.service';
import { EIMEntryListSingleSelectorComponentService } from './components/entry-list-selector/entry-list-single-selector.component.service';

// レンダラー
import { EIMIdRendererComponentService } from 'app/forms/shared/components/renderer/id-renderer.component.service';
import { EIMFormAttributeRendererComponentService } from 'app/forms/shared/components/renderer/attribute-renderer.component.service';

// サービス
import { EIMFormAuthenticationService } from 'app/forms/shared/services/apis/authentication.service';
import { EIMFormUserService } from 'app/forms/shared/services/apis/user.service';
import { EIMFormEventService } from 'app/forms/shared/services/apis/form-event.service';
import { EIMFormWorkspaceService } from 'app/forms/shared/services/apis/form-workspace.service';
import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMFormListColumnService } from 'app/forms/shared/services/apis/form-list-column.service';
import { EIMFormTypeService } from 'app/forms/shared/services/apis/form-type.service';
import { EIMFormCsvDownloadService } from 'app/forms/shared/services/apis/form-csv-download.service';

import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';
import { EIMFormDisplayColumnService } from 'app/forms/shared/services/form-display-column.service';
import { EIMFormDomainService } from 'app/forms/shared/services/form-domain.service';

import { EIMFormWorkspaceEntryUserService } from "app/forms/shared/services/apis/form-workspace-entry-user.service";
import { EIMAssignmentEntryUserService } from "app/forms/shared/services/apis/assignment-entry-user.service";
import { EIMFormEventTypeService } from "app/forms/shared/services/apis/form-event-type.service";
import { EIMMultipleSelectorComponentService } from "app/shared/components/multiple-selector/multiple-selector.component.service";
import { EIMFormSearchService } from './shared/services/apis/form-search.service';
import { EIMFlatTypeHierarchicalAttributeListInputFormItemComponentService } from './shared/components/flat-type-hierarchical-attribute-list-input-form-item/flat-type-hierarchical-attribute-list-input-form-item.component.service';
import { EIMFormAttributeTypeLayoutOptionBuilderService } from './shared/services/form-attribute-type-layout-option-builder.service';
import { EIMFormAttributeTypeLayoutOptionBuilderFactoryService } from './shared/services/form-attribute-type-layout-option-builder-factory.service';

export const formsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' as 'full' },
      { path: 'login', component: EIMFormLoginComponent, canActivate: [EIMFormAuthenticationGuard], title: 'Login' },
      { path: 'login/:id', component: EIMFormLoginComponent, canActivate: [EIMFormAuthenticationGuard], title: 'LoginID' },
      { path: 'main', component: EIMFormsComponent, canActivate: [EIMFormAuthenticationGuard], title: 'Main' },
      { path: 'main/:id', component: EIMFormsComponent, canActivate: [EIMFormAuthenticationGuard], title: 'MainID' },
    ],
    providers: [ // formsルートの共通インスタンス
      EIMFormAuthenticationGuard,

      // forms.module.tsから引っ越し
      EIMFormAuthenticationService,
      EIMFormUserService,
      EIMFormEventService,
      EIMFormWorkspaceService,
      EIMFormService,
      EIMFormSearchService,
      EIMFormListColumnService,
      EIMFormTypeService,
      EIMFormCsvDownloadService,
      EIMDialogManagerComponentService,
      EIMHierarchicalAttributeListInputFormItemComponentService,
      EIMFormAttributeRendererComponentService,

      EIMFormsCacheService,
      EIMFormDisplayColumnService,
      EIMFormDomainService,
      EIMFormListColumnSingleSelectorComponentService,
      EIMFormListColumnMultipleSelectorComponentService,
      EIMStatusChangeWorkflowDiagramComponentService,
      EIMWorkflowDiagramComponentService,
      EIMEntryListSingleSelectorComponentService,
      EIMFormDiversionTreeComponentService,
      EIMFormMoveTreeComponentService,
      EIMMultipleSelectorComponentService,
      EIMFormWorkspaceEntryUserService,
      EIMAssignmentEntryUserService,
      EIMIdRendererComponentService,
      EIMFormEventTypeService,
      EIMFlatTypeHierarchicalAttributeListInputFormItemComponentService,
      EIMFormAttributeTypeLayoutOptionBuilderService,
      EIMFormAttributeTypeLayoutOptionBuilderFactoryService,
    ]
  }
];