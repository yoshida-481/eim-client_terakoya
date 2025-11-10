import './polyfills';

import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from 'app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from 'app/app-routing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { combineLatest, map, Observable } from 'rxjs';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMSessionTimeoutService } from 'app/shared/services/session-timeout.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MessageService } from 'primeng/api';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDateService } from 'app/shared/services/date.service';
import { EIMNumberService } from 'app/shared/services/number.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMReloadService } from 'app/shared/services/reload.service';
import { EIMDropFileService } from 'app/shared/services/drop-file.service';
import { EIMSplitStateService } from 'app/shared/services/split-state.service';
import { EIMAuthenticationService } from 'app/shared/services/apis/authentication.service';
import { EIMWebDAVService } from 'app/shared/services/webdav.service';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMFileObjectCreatorService } from 'app/shared/services/apis/file-object-creator.service';
import { EIMUserService } from 'app/shared/services/apis/user.service';
import { EIMTempFileObjectService } from 'app/shared/services/apis/temp-file-object.service';
import { EIMTemplateFileService } from 'app/shared/services/apis/template-file.service';
import { EIMObjectMasterService } from 'app/shared/services/apis/object-master.service';
import { EIMPublicNotificationTemplateService } from 'app/shared/services/apis/public-notification-template.service';
import { EIMDialogSharedManagerComponentService } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';
import { EIMUserSessionService } from 'app/shared/services/user-session.service';
import { EIMObjectAPIService } from 'app/shared/services/apis/object-api.service';
import { EIMHttpForRestAPIService } from 'app/shared/services/http-for-rest-api.service';
import { EIMObjectRoleService } from 'app/shared/services/apis/object-role.service';
import { EIMTreeNodeService } from 'app/shared/services/tree-node.service';
import { EIMMembersService } from 'app/shared/services/apis/members.service';
import { EIMTreeFormatResultDTOToTreeNodesConverterService } from 'app/shared/services/converters/tree-format-result-dto-to-tree-nodes-converter.service';
import { EIMListFormatResultDTOToTreeNodesConverterService } from 'app/shared/services/converters/list-format-result-dto-to-tree-nodes-converter.service';
import { EIMJsonToTreeFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-tree-format-result-dto-converter.service';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { EIMRendererComponentService } from 'app/shared/components/renderer/renderer.component.service';
import { EIMMenuChangeDetectionService } from 'app/shared/services/menu-change-detection.service';
import { EIMEntrySelectorComponentService } from 'app/shared/components/entry-selector/entry-selector.component.service';
import { EIMDropdownInputRendererComponentService } from 'app/shared/components/renderer/dropdown-input-renderer.component.service';
import { EIMObjectTypeInputRendererComponentService } from 'app/tasks/components/object-type-input-renderer/object-type-renderer.component.service';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';
import { EIMValueTypeRendererComponentService } from 'app/shared/components/renderer/value-type-renderer.component.service';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMDateRendererComponentService } from 'app/shared/components/renderer/date-renderer.component.service';
import { EIMConfigService } from 'app/shared/services/config.service';
import { EIMFileIconClassFunctionService } from 'app/shared/services/file-icon-class-function.service';
import { EIMComparatorService } from 'app/shared/services/comparator.service';
import { EIMInputFormItemModule } from 'app/shared/components/input-form-item/input-form-item.module';
import { GANTT_PROVIDERS } from 'app/shared/config/gantt-global-config';
import Aura from '@primeng/themes/aura';

if (environment.production) {
  enableProdMode();
}

export class CustomLoader implements TranslateLoader {

  constructor(
    private http: HttpClient) {
  }

  getTranslation(lang: string): Observable<any> {
    const now = new Date();
    let eim: Observable<any> =
      this.http.get(environment.baseURL + 'src/assets/i18n/eim.' + lang.toUpperCase() + '.json?time=' + now.getTime())
        .pipe(map((res: any) => {
          return res
        }));
    let documents: Observable<any> =
      this.http.get(environment.baseURL + 'src/assets/i18n/documents.' + lang.toUpperCase() + '.json?time=' + now.getTime())
        .pipe(map((res: any) => {
          return res
        }));
    let forms: Observable<any> =
      this.http.get(environment.baseURL + 'src/assets/i18n/forms.' + lang.toUpperCase() + '.json?time=' + now.getTime())
        .pipe(map((res: any) => {
          return res
        }));
    let admins: Observable<any> =
      this.http.get(environment.baseURL + 'src/assets/i18n/admins.' + lang.toUpperCase() + '.json?time=' + now.getTime())
        .pipe(map((res: any) => {
          return res
        }));
    let objectEditors: Observable<any> =
      this.http.get(environment.baseURL + 'src/assets/i18n/object-editors.' + lang.toUpperCase() + '.json?time=' + now.getTime())
        .pipe(map((res: any) => {
          return res
        }));
		let tasks: Observable<any> =
		this.http.get(environment.baseURL + 'src/assets/i18n/tasks.' + lang.toUpperCase() + '.json?time=' + now.getTime())
			.pipe(map((res: any) => {
					return res
			}));
			return combineLatest(
				eim, documents, forms, admins, objectEditors, tasks,
				(o1, o2, o3, o4, o5, o6) => {
					return Object.assign({}, o1, o2, o3, o4, o5, o6 );
				})
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './src/assets/i18n/', '.json');
}


bootstrapApplication(AppComponent, {
  // アプリ全体で共通インスタンスとしたい場合
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideHttpClient(),
    provideRouter(appRoutes),

    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClient],
      },
    }),
    // GANTT providers for @worktile/gantt v19
    ...GANTT_PROVIDERS,
    // from App services
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
    MessageService,
    EIMConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [EIMConfigService],
      multi: true
    },
    EIMAttributeService,
    EIMCacheService,
    EIMComparatorService,
    EIMConstantService,
    EIMDateService,
    EIMNumberService,
    EIMDomainService,
    EIMJSONService,
    EIMHierarchicalDomainService,
    EIMHttpService,
    EIMTreeNodeService,
    EIMHttpForRestAPIService,
    EIMMessageService,
    EIMReloadService,
    EIMDropFileService,
    EIMSessionTimeoutService,
    EIMSplitStateService,
    EIMAuthenticationService,
    EIMWebDAVService,
    EIMSessionStorageService,
    EIMFileService,
    EIMFileObjectCreatorService,
    EIMUserService,
    EIMTempFileObjectService,
    EIMTemplateFileService,
    EIMLocalStorageService,
    EIMObjectMasterService,
    EIMObjectAPIService,
    EIMServerConfigService,
    EIMPublicNotificationTemplateService,
    EIMUserSessionService,
    EIMFileIconClassFunctionService,
    EIMObjectRoleService,
    EIMMembersService,

    // from shared services
    EIMDialogSharedManagerComponentService,
    EIMDateRendererComponentService,
    EIMDateTimeRendererComponentService,
    EIMValueTypeRendererComponentService,
    EIMCheckboxRendererComponentService,
    EIMObjectTypeInputRendererComponentService,
    EIMDropdownInputRendererComponentService,
    EIMEntrySelectorComponentService,
    EIMMenuChangeDetectionService,
    EIMRendererComponentService,

    EIMJsonToListFormatResultDTOConverterService,
    EIMJsonToTreeFormatResultDTOConverterService,
    EIMListFormatResultDTOToTreeNodesConverterService,
    EIMTreeFormatResultDTOToTreeNodesConverterService,

    importProvidersFrom(EIMInputFormItemModule),
  ],
});

export function configFactory(cs: EIMConfigService) {
  return () => cs.load();
}
