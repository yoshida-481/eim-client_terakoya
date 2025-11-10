import { EIMFormCriteria } from '../../../../shared/domains/criteria/form.criteria';
import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMComponentInfo, EIMComponent } from 'app/shared/shared.interface';
import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';

import { EIMEventTypeDomain } from 'app/shared/domains/entity/event-type.domain';

import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';

import { EIMFormTypeDisplayColumn } from 'app/shared/services/apis/local-storage.service';
import { EIMFormDomain } from "app/shared/domains/form.domain";
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';
import { EIMDataGridComponent, EIMDataGridColumn } from "app/shared/components/data-grid/data-grid.component";
import { EIMUserDTO } from "app/shared/dtos/user.dto";
import { TranslateService } from '@ngx-translate/core';

export interface EIMDialogManagerComponentInfo extends EIMComponentInfo {
	name?: string;
	data?: any;
	callbacks?: any;
}

export namespace dialogName {
	export const FORM_CREATOR: string = "FORM_CREATOR";
	export const FORM_DETAIL: string = "FORM_DETAIL";
	export const FORM_NEW_COPY: string = "FORM_NEW_COPY";
	export const STATUS_CHANGE: string = "STATUS_CHANGE";
	export const ENTRY_LIST: string = "ENTRY_LIST";
	export const FORM_CSV_DOWNLOAD: string = 'FORM_CSV_DOWNLOAD';
	export const DISPLAY_COLUMN_EDITOR: string = "DISPLAY_COLUMN_EDITOR";
	export const FORM_DIVERSION_SELECTOR: string = 'FORM_DIVERSION_SELECTOR';
	export const FORM_MOVE_SELECTOR: string = 'FORM_MOVE_SELECTOR';
	export const FORM_ACCESS_HISTORY: string = 'FORM_ACCESS_HISTORY';
	export const FORM_REGAIN: string = 'FORM_REGAIN';
}

@Directive()
@Injectable()
export class EIMDialogManagerComponentService {

	@Output() show:EventEmitter<EIMDialogManagerComponentInfo> = new EventEmitter<EIMDialogManagerComponentInfo>();
	@Output() closed:EventEmitter<string> = new EventEmitter<string>();

	public dialogs:any = {};

	constructor(
		protected translateService: TranslateService,
	) {

	}

	/**
	 * 帳票詳細(新規作成)ダイアログを表示します.
	 */
	public showFormCreator(workspaceId: number, typeId: number, folderId: number, securityId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FORM_CREATOR,
				data: {
					workspaceId: workspaceId,
					typeId: typeId,
					folderId: folderId,
					securityId: securityId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 帳票詳細ダイアログを表示します.
	 */
	public showFormDetail(id: number, workspaceId: number, existsWF: boolean, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
			name: dialogName.FORM_DETAIL,
				data: {
					id: id,
					workspaceId: workspaceId,
					existsWF: existsWF
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 帳票詳細(流用作成)ダイアログを表示します.
	 */
	public showFormNewCopy(workspaceId: number, typeId: number, folderId: number, securityId: number, sourceId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FORM_NEW_COPY,
				data: {
					workspaceId: workspaceId,
					typeId: typeId,
					folderId: folderId,
					securityId: securityId,
					sourceId: sourceId
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * ステータス変更ダイアログを表示します.
	 */
	public showStatusChange(form:EIMFormDomain, workflow: EIMWorkflowDomain, eventTypeList: EIMEventTypeDomain[], callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.STATUS_CHANGE,
				data: {
					form: form,
					workflow: workflow,
					eventTypeList: eventTypeList,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}
	/**
	 * エントリ一覧選択ダイアログを表示します.
	 */
	public showEntryList(allColumns: EIMUserDTO[], selectedData: EIMUserDTO[], mailFlag:boolean, callbacks?: any): string {
		let title: string;
		let leftLabel: string;
		let rightLabel: string;
		if (mailFlag) {
			title = this.translateService.instant('EIM_FORMS.LABEL_01005');
			leftLabel = this.translateService.instant('EIM_FORMS.LABEL_02037');
			rightLabel = this.translateService.instant('EIM_FORMS.LABEL_02038');
		} else {
			title = this.translateService.instant('EIM_FORMS.LABEL_01006');
			leftLabel = this.translateService.instant('EIM_FORMS.LABEL_02035');
			rightLabel = this.translateService.instant('EIM_FORMS.LABEL_02036');
		}
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.ENTRY_LIST,
				data: {
					allColumns: allColumns,
					selectedData: selectedData,
					mailFlag: mailFlag,
					title: title,
					leftLabel: leftLabel,
					rightLabel: rightLabel,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * CSVダウンロードダイアログを表示します.
	 */
	public showDisplayCsvDownload(criteria: EIMFormCriteria, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FORM_CSV_DOWNLOAD,
				data: {
					criteria: criteria,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 表示列編集ダイアログを表示します.
	 */
	public showDisplayColumnEditor(formType:EIMFormTypeDomain, displayColumn: EIMFormTypeDisplayColumn, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.DISPLAY_COLUMN_EDITOR,
				data: {
					formType: formType,
					displayColumn: displayColumn,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 帳票流用作成選択ダイアログを表示します.
	 */
	public showFormDiversionSelector(formWorkspaceId: number, formTypeId: number, formTypeFolderId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FORM_DIVERSION_SELECTOR,
				data: {
					formWorkspaceId: formWorkspaceId,
					formTypeId: formTypeId,
					formTypeFolderId: formTypeFolderId,
				},
				callbacks: callbacks,
		};
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 帳票移動選択ダイアログを表示します.
	 */
	public showFormMoveSelector(formWorkspaceId: number, formTypeId: number, formTypeFolderId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FORM_MOVE_SELECTOR,
				data: {
					formWorkspaceId: formWorkspaceId,
					formTypeId: formTypeId,
					formTypeFolderId: formTypeFolderId,
				},
				callbacks: callbacks,
		};
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 帳票アクセス履歴ダイアログを表示します.
	 */
	public showFormAccessHistory(formId: number, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FORM_ACCESS_HISTORY,
				data: {
					formId: formId,
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	/**
	 * 帳票取戻しダイアログを表示します.
	 */
	public showFormRegain(form: EIMFormDomain, regainEventType: EIMEventTypeDomain, dirty: boolean, callbacks?: any): string {
		let info: EIMDialogManagerComponentInfo = {
				name: dialogName.FORM_REGAIN,
				data: {
					form: form,
					regainEventType: regainEventType,
					dirty: dirty
				},
				callbacks: callbacks,
		}
		this.show.emit(info);

		return info.name;
	}

	public close(dialogId: string): void {
		this.closed.emit(dialogId);
	}

	public getView(dialogId:string):EIMComponent {
		if (this.dialogs[dialogId]) {
			return (this.dialogs[dialogId] as EIMDialogComponent).content;
		}
		return null;
	}
}
