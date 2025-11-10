import { Component, ViewChildren, OnInit, SimpleChanges, Input, EventEmitter, Output, QueryList, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { EIMAdminDialogManagerComponentService, EIMDialogManagerComponentInfo, dialogName } from './dialog-manager.component.service';

import { EIMAttributeSingleSelectorComponentService } from 'app/admins/components/attribute-selector/attribute-single-selector.component.service';
import { EIMAttributeMultipleSelectorComponentService } from 'app/admins/components/attribute-selector/attribute-multiple-selector.component.service';
import { EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMWorkspaceTypeMultipleSelectorComponentSerivce } from 'app/admins/components/workspace-type-selector/workspace-type-multiple-selector.component.service';
import { EIMWorkflowMailKindMultipleSelectorComponentSerivce } from 'app/admins/components/workflow-mail-kind-selector/workflow-mail-kind-multiple-selector.component.service';


@Component({
    selector: 'eim-admin-dialog-manager',
    templateUrl: './dialog-manager.component.html',
    styleUrls: ['./dialog-manager.component.css'],
    providers: [],
    standalone: false
})
export class EIMDialogManagerComponent {
	@ViewChildren(EIMDialogComponent)
		dialogs: QueryList<EIMDialogComponent>;

	public display: any[] = [];
	public data: any[] = [];
	public DialogName = dialogName;
	showHeader = true;

	constructor(
		protected translate: TranslateService,
		protected dialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected attributeSelectorComponentService: EIMAttributeSingleSelectorComponentService,
		protected attributeMultipleSelectorComponentService: EIMAttributeMultipleSelectorComponentService,
		protected approverMultipleSelectorComponentService: EIMMultipleSelectorComponentService,
		protected workspaceTypeMultipleSelectorComponentService: EIMWorkspaceTypeMultipleSelectorComponentSerivce,
		protected mailKindMultipleSelectorComponentService: EIMWorkflowMailKindMultipleSelectorComponentSerivce,
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

	private onShow(this, info: EIMDialogManagerComponentInfo, display: any[], data: any[]): void {
		this.data[info.name] = info.data;
		this.display[info.name] = true;

		window.setTimeout(() => {
			let targetDialog: EIMDialogComponent;
			for (let i = 0; i < this.dialogs.length; i++) {
				if (this.dialogs._results[i].name === info.name) {
					targetDialog = this.dialogs._results[i];
				}
			}
			if (targetDialog && info.callbacks) {

				for (let key in info.callbacks) {
					if (info.callbacks.hasOwnProperty(key)) {
						(<any>targetDialog.content)[key].subscribe((result) => info.callbacks[key](result));
					}
				}

			}
			if (targetDialog) {
				this.dialogManagerComponentService.dialogs[targetDialog.name] = targetDialog;
			}
		});
	}

	private onClose(dialogId: string): void {
		this.display[dialogId] = false;

		if (this.dialogs && this.dialogs.length > 0) {
			let targetDialog: EIMDialogComponent;
			for (let i = 0; i < this.dialogs.length; i++) {
				if (this.dialogs['_results'][i].name === dialogId) {
					targetDialog = this.dialogs['_results'][i];
					break;
				}
			}

			if (targetDialog && targetDialog.content['closed']) {
				targetDialog.content['closed'].emit();
			}
		}
	}
}
