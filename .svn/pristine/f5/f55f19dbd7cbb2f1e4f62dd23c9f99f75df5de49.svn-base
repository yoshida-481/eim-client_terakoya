import { Component, ViewChildren, OnInit, SimpleChanges, Input, EventEmitter, Output, QueryList, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { EIMDialogSharedManagerComponentService, EIMDialogManagerComponentInfo, dialogName } from './dialog-shared-manager.component.service.js';
import { EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';

import { EIMMasterMultipleSelectorComponentService } from 'app/shared/components/master-selector/master-multiple-selector.component.service';
import { EIMUserMultipleSelectorComponentService } from 'app/shared/components/user-selector/user-multiple-selector.component.service';
import { EIMUserSelectorComponentService } from 'app/shared/components/user-selector/user-selector.component.service';

import { FormsModule } from '@angular/forms'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { EIMInputFormItemModule } from 'app/shared/components/input-form-item/input-form-item.module';
import { EIMDataGridSingleSelectorModule } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.module';
import { EIMDialogModule } from 'app/shared/components/dialog/dialog.module';
import { EIMDataGridModule } from 'app/shared/components/data-grid/data-grid.module';
import { EIMMasterSelectorModule } from 'app/shared/components/master-selector/master-selector.module';
import { EIMMultipleSelectorModule } from 'app/shared/components/multiple-selector/multiple-selector.module';
import { EIMUserSelectorModule } from 'app/shared/components/user-selector/user-selector.module';
import { EIMVerticalContainerModule } from 'app/shared/directives/vertical-container/vertical-container.module';
import { EIMPasswordChangeModule } from 'app/shared/components/password-change/password-change.module';
import { EIMVersionDisplayModule } from 'app/shared/components/version-display/version-display.module';
import { EIMPublicNotificationTemplateModule } from '../public-notification-template/public-notification-template.module.js';

@Component({
    selector: 'eim-shared-dialog-manager',
    templateUrl: './dialog-shared-manager.component.html',
    styleUrls: ['./dialog-shared-manager.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		ButtonModule,
		DialogModule,

		EIMInputFormItemModule,
		EIMDataGridSingleSelectorModule,
		EIMDialogModule,
		EIMDataGridModule,
		EIMMasterSelectorModule,
		EIMMultipleSelectorModule,
		EIMUserSelectorModule,
		EIMVerticalContainerModule,
		EIMPasswordChangeModule,
		EIMVersionDisplayModule,
		EIMPublicNotificationTemplateModule,
	],
	providers: [
		//EIMDialogSharedManagerComponentService,
	],
    standalone: true
})
export class EIMDialogSharedManagerComponent implements OnChanges {
	@ViewChildren(EIMDialogComponent)
		dialogs: QueryList<EIMDialogComponent>;

	public display: any[] = [];
	public data: any[] = [];
	public DialogName = dialogName;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,

		protected masterMultipleSelectorComponentService: EIMMasterMultipleSelectorComponentService,
		protected userMultipleSelectorComponentService: EIMUserMultipleSelectorComponentService,
		protected userSelectorComponentService: EIMUserSelectorComponentService,
	) {
		dialogManagerComponentService.show.subscribe((info: EIMDialogManagerComponentInfo) => {this.onShow(info, this.display, this.data); });
		dialogManagerComponentService.closed.subscribe((dialogId: string) => {this.onClose(dialogId); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	ngOnChanges() {

	}

	private onShow(this, info: EIMDialogManagerComponentInfo, display: any[], data: any[]): void {
		this.data[info.name] = info.data;
		this.display[info.name] = true;
		window.setTimeout(() => {
			let targetDialog: EIMDialogComponent;
			for (let i = 0; i < this.dialogs.length; i++) {
				if (this.dialogs._results[i].name == info.name) {
					targetDialog = this.dialogs._results[i];
				}
			}
			if (targetDialog && info.callbacks) {
				if ((<any>targetDialog.content).created && info.callbacks.created) {
					(<any>targetDialog.content).created.subscribe((result) => info.callbacks.created(result));
				} else 	if ((<any>targetDialog.content).updated && info.callbacks.updated) {
					(<any>targetDialog.content).updated.subscribe((result) => info.callbacks.updated(result));
				} else 	if ((<any>targetDialog.content).deleted && info.callbacks.deleted) {
					(<any>targetDialog.content).deleted.subscribe((result) => info.callbacks.deleted(result));
				} else 	if ((<any>targetDialog.content).executed && info.callbacks.executed) {
					(<any>targetDialog.content).executed.subscribe((result) => info.callbacks.executed(result));
				} else 	if ((<any>targetDialog.content).applied && info.callbacks.applied) {
					(<any>targetDialog.content).applied.subscribe((result) => info.callbacks.applied(result));
				} else 	if ((<any>targetDialog.content).selected && info.callbacks.selected) {
					(<any>targetDialog.content).selected.subscribe((result) => info.callbacks.selected(result));
				}
			}
		});
	}

	private onClose(dialogId: string): void {
		this.display[dialogId] = false;
	}
}
