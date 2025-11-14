import { Routes } from '@angular/router';

import { EIMObjectEditorLoginComponent } from 'app/object-editors/components/login/login.component';
import { EIMObjectEditorsComponent } from 'app/object-editors/object-editors.component';

// EIM共通モジュール
import { EIMUserService } from 'app/shared/services/apis/user.service';

// コンポーネント
import { EIMObjectEditorsUserService } from 'app/object-editors/shared/services/apis/object-editors-user.service';

// サービス
import { EIMObjectEditorsCacheService } from 'app/object-editors/shared/services/object-editors-cache.service';
import { EIMObjectEditorsIconService } from 'app/object-editors/shared/services/object-editors-icon.service';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { EIMObjectListComponentService } from 'app/object-editors/components/object-list/object-list.component.service';
import { EIMObjectEditorsAuthenticationService } from 'app/object-editors/shared/services/apis/object-editors-authentication.service';
import { EIMObjectEditorsEventService } from 'app/object-editors/shared/services/apis/object-editors-event.service';
import { EIMObjectEditorDialogManagerComponentService } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectTypeTreeComponentService } from 'app/object-editors/components/object-type-tree/object-type-tree.component.service';
import { EIMObjectEditorsObjectTypeService } from 'app/object-editors/shared/services/apis/object-editors-object-type.service';
import { EIMConvertService } from 'app/object-editors/shared/services/convert.service';
import { EIMSecurityService } from 'app/documents/shared/services/apis/security.service';
import { EIMObjectEditorsSecurityService } from 'app/object-editors/shared/services/apis/object-editors-security.service';
import { EIMObjectEditorsStatusService } from 'app/object-editors/shared/services/apis/object-editors-status.service';
import { EIMObjectEditorsRevisionService } from 'app/object-editors/shared/services/apis/object-editors-revision.service';
import { EIMObjectEditorsRelationService } from 'app/object-editors/shared/services/apis/object-editors-relation.service';
import { EIMRelationTypeTreeComponentService } from 'app/object-editors/components/relation-type-tree/relation-type-tree.component.service';
import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMObjectEditorsEntryService } from 'app/object-editors/shared/services/apis/object-editors-entry.service';
import { EIMObjectEditorsWorkFlowService } from 'app/object-editors/shared/services/apis/object-editors-workflow.service';
import { EIMFileNameLinkRendererComponentService } from 'app/object-editors/shared/components/renderer/file-name-link-renderer.component.service';

export const objectEditorsRoutes: Routes = [
	{
		path: '',
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' as 'full' },
			{ path: 'login', component: EIMObjectEditorLoginComponent, pathMatch: 'full' as 'full', title: 'Login' },
			{ path: 'main', component: EIMObjectEditorsComponent, pathMatch: 'full' as 'full', title: 'Main' },
		],
		providers: [ // object-editorsルートの共通インスタンス
			// object-editors.module.tsから引っ越し
			{ provide: EIMUserService, useClass: EIMObjectEditorsUserService },
			{ provide: EIMEntryService, useClass: EIMObjectEditorsEntryService },

			EIMObjectEditorDialogManagerComponentService,
			EIMConvertService,
			EIMObjectEditorsAuthenticationService,
			EIMObjectEditorsEventService,
			EIMObjectEditorsUserService,
			EIMObjectEditorsObjectService,
			EIMObjectEditorsObjectTypeService,
			EIMObjectEditorsSecurityService,
			EIMObjectEditorsStatusService,
			EIMObjectEditorsRevisionService,
			EIMObjectEditorsRelationService,
			EIMRelationTypeTreeComponentService,
			EIMObjectEditorsEntryService,

			EIMObjectListComponentService,
			EIMObjectTypeTreeComponentService,
			EIMObjectEditorsCacheService,
			EIMObjectEditorsIconService,
			EIMObjectEditorsWorkFlowService,
			{ provide: EIMSecurityService, useClass: EIMObjectEditorsSecurityService },
			EIMFileNameLinkRendererComponentService,
		]
	}];