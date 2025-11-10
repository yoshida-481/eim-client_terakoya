import { Component, forwardRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectEditorsWorkFlowService, ObjectDetailDTO, EventDTO } from 'app/object-editors/shared/services/apis/object-editors-workflow.service';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMEventHistoryIconRendererComponent } from 'app/object-editors/shared/components/renderer/event-history-icon-renderer.component';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * イベント履歴コンポーネント
 * @example
 * 		<eim-event-history-list [objData]="objData">
 * 		</eim-event-history-list>
 */
@Component({
    selector: 'eim-event-history-list',
    templateUrl: './event-history-list.component.html',
    styleUrls: ['./event-history-list.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMEventHistoryListComponent) }],
    standalone: false
})
export class EIMEventHistoryListComponent implements OnInit {

	/** イベント履歴データグリッドコンポーネント */
	@ViewChild('eventHistoryDataGrid', { static: true })
	eventHistoryDataGrid: EIMDataGridComponent;

	/** オブジェクト情報 */
	@Input() objData: EIMObjectDTO;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 選択オブジェクト名 */
	public objectName: string;

	// グリッドメニュー
	/** イベント属性情報 */
	protected menuEventAttributeDetail: EIMMenuItem =
		{label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03021'), rKey: 'EIM_OBJECT_EDITORS.LABEL_03021', name: 'EventAttributeDetail', icon: 'eim-icon-list', disabled: true , command: (event) => {this.onClickEventAttribute()}}
	/** 遷移元ステータス属性情報 */
	protected menuFromAttributeDetail: EIMMenuItem =
		{label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03022'), rKey: 'EIM_OBJECT_EDITORS.LABEL_03022', name: 'FromAttributeDetail', icon: 'eim-icon-list', disabled: true , command: (event) => {this.onClickFromStatusAttribute()}}
	/** 遷移先ステータス属性情報 */
	protected menuToAttributeDetail: EIMMenuItem =
		{label: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_03023'), rKey: 'EIM_OBJECT_EDITORS.LABEL_03023', name: 'ToAttributeDetail', icon: 'eim-icon-list', disabled: true , command: (event) => {this.onClickToStatusAttribute()}}

	/** イベント履歴のメニュー */
	public eventHistoryMenuItems: EIMMenuItem[] = [
		this.menuEventAttributeDetail,
		this.menuFromAttributeDetail,
		this.menuToAttributeDetail
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected domainService: EIMDomainService,
		protected objectEditorsWorkFlowService: EIMObjectEditorsWorkFlowService,
		protected dateService: EIMDateService,
	) {
	}
	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// アクセス内容
		columns.push({field: 'type', cellRendererFramework: EIMEventHistoryIconRendererComponent, headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02024'), width: 150});
		columns.push({field: 'name', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02025'), width: 140});
		columns.push({field: 'actionDate', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02026'), width: 163, comparator: this.dateService.dateComparator});
		columns.push({field: 'fromName', cellRendererFramework: EIMEventHistoryIconRendererComponent, headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02027'), width: 195});
		columns.push({field: 'toName', cellRendererFramework: EIMEventHistoryIconRendererComponent, headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02028'), width: 195});
		this.eventHistoryDataGrid.setColumns(columns);
		this.getObjectDetail();
	}

	/**
	 * イベント情報データグリッド押下時のイベントハンドラ
	 */
	onSelectEventHistory(): void {
		// 行選択されている場合
		if (this.eventHistoryDataGrid.getSelectedData().length === 0) {
			this.menuEventAttributeDetail.disabled = true;
			this.menuFromAttributeDetail.disabled = true;
			this.menuToAttributeDetail.disabled = true;
		} else {
			this.menuEventAttributeDetail.disabled = false;
			this.menuFromAttributeDetail.disabled = false;
			this.menuToAttributeDetail.disabled = false;
		}
	}

	/**
	 * イベント属性情報押下時のイベントハンドラ
	 */
	onClickEventAttribute(): void {
	let selectedData = this.eventHistoryDataGrid.getSelectedData()[0];
		if (selectedData) {
			let dialogId: string = this.objectEditorDialogManagerComponentService.showEventUpdator(
				selectedData.id, this.objData.id,
				{
					updated: () => {
						this.objectEditorDialogManagerComponentService.close(dialogId);
					},
					errored: () => {
						this.objectEditorDialogManagerComponentService.close(dialogId);
					},
				}
			);
		}
	}

	/**
	 * 遷移元ステータス属性情報押下時のイベントハンドラ
	 */
	onClickFromStatusAttribute(): void {
	let selectedData = this.eventHistoryDataGrid.getSelectedData()[0];
		if (selectedData) {
			let dialogId: string = this.objectEditorDialogManagerComponentService.showStatusUpdator(
				selectedData.fromStatusId, this.objData.id, this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_01010'),
				{
					updated: () => {
						this.objectEditorDialogManagerComponentService.close(dialogId);
					},
					errored: () => {
						this.objectEditorDialogManagerComponentService.close(dialogId);
					},
				}
			);
		}
	}

	/**
	 * 遷移先ステータス属性情報押下時のイベントハンドラ
	 */
	onClickToStatusAttribute(): void {
	let selectedData = this.eventHistoryDataGrid.getSelectedData()[0];
		if (selectedData) {
			let dialogId: string = this.objectEditorDialogManagerComponentService.showStatusUpdator(
				selectedData.toStatusId, this.objData.id, this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_01018'),
				{
					updated: () => {
						this.objectEditorDialogManagerComponentService.close(dialogId);
					},
					errored: () => {
						this.objectEditorDialogManagerComponentService.close(dialogId);
					},
				}
			);
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 オブジェクト情報を取得します.
	*/
	private getObjectDetail(): void {
		// オブジェクト情報を取得
		this.objectEditorsWorkFlowService.getObjectDetail(this.objData.id).subscribe((data: ObjectDetailDTO) => {
			this.objectName = data.workFlow.name;
			this.getEventHistoryList();
		}, (err: any) => {
			window.setTimeout(() => {
				this.errored.emit(err);
			});
		});
	}

	/**
	 イベント履歴一覧を取得します.
	*/
	private getEventHistoryList(): void {
		// イベント履歴を取得
		this.objectEditorsWorkFlowService.getEventDetail(this.objData.id).subscribe((data: EventDTO[]) => {
			if (data.length === 0) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_OBJECT_EDITORS.ERROR_00002'), () => {
					window.setTimeout(() => {
						this.errored.emit();
					});
				});
			}
			let eventHistoryList: any[] = [];
			for (let i = 0 ; i < data.length; i++) {
				eventHistoryList.push(Object.assign(data[i].baseEvent, data[i].fromEvent, data[i].toEvent));
			}
			this.eventHistoryDataGrid.setData(eventHistoryList);
		}, (err: any) => {
			this.messageService.show(EIMMessageType.error, err.message, () => {
				window.setTimeout(() => {
					this.errored.emit(err);
				});
			});
		});
	}
}
