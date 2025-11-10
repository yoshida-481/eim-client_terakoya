import { Component, ViewChildren, OnInit, SimpleChanges, Input, EventEmitter, Output, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { EIMDialogManagerComponentService, EIMDialogManagerComponentInfo, dialogName } from './dialog-manager.component.service';

import { EIMFormDiversionTreeComponentService } from 'app/forms/components/form-diversion-tree/form-diversion-tree.component.service';
import { EIMFormMoveTreeComponentService } from 'app/forms/components/form-move-tree/form-move-tree.component.service';
import { EIMMultipleSelectorComponentService } from "app/shared/components/multiple-selector/multiple-selector.component.service";

@Component({
    selector: 'eim-form-dialog-manager',
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

	/** 属性タイプ検索条件 */
	public attributeTypeSearchCondition: any = {attributeTypeName: [""]};
	
	private showSubscribe: Subscription;
	private closedSubscribe: Subscription;

	constructor(
		protected translate: TranslateService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected formDiversionTreeComponentService: EIMFormDiversionTreeComponentService,
		protected formMoveTreeComponentService: EIMFormMoveTreeComponentService,
		protected entryListMultipleSelectorComponentService: EIMMultipleSelectorComponentService,
	) {
		this.showSubscribe = dialogManagerComponentService.show.subscribe((info: EIMDialogManagerComponentInfo) => {this.onShow(info, this.display, this.data);});
		this.closedSubscribe = dialogManagerComponentService.closed.subscribe((dialogId: string) => {this.onClose(dialogId);});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	ngOnChanges() {
		
	}

	ngOnDestroy() {
		if(!this.showSubscribe.closed) this.showSubscribe.unsubscribe();
		if(!this.closedSubscribe.closed) this.closedSubscribe.unsubscribe();
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

				for (let key in info.callbacks) {
					(<any>targetDialog.content)[key].subscribe((data)=>info.callbacks[key](data));
				}

			}
			if (targetDialog) {
				this.dialogManagerComponentService.dialogs[targetDialog.name] = targetDialog;
			}
		});
	}

	private onClose(dialogId: string): void {
		this.display[dialogId] = false;
		
		let targetDialog: EIMDialogComponent;
		for (let i = 0; i < this.dialogs.length; i++) {
			if (this.dialogs['_results'][i].name == dialogId) {
				targetDialog = this.dialogs['_results'][i];
				break;
			}
		}
		
		if (targetDialog.content && targetDialog.content['closed']) {
			targetDialog.content['closed'].emit();
		}
		
	}
}
