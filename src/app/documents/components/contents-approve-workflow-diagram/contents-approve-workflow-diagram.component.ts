import { Component, ViewChild, ElementRef, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMContentsApproveWorkflowDiagramComponentService, EIMContentsApproveWorkflowDiagramComponentInfo } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component.service';
import { EIMWorkflowService, EIMWorkflow, EIMWorkflowStatusType, EIMWorkflowEventType } from 'app/documents/shared/services/apis/workflow.service';

import { EIMApproveStatusDTO } from 'app/documents/shared/dtos/approve-status.dto';
import { EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo } from './contents-approve-for-approver-selectable-workflow-diagram.component.service';
import { EIMApproveInfoManagementService } from 'app/documents/shared/services/approve-info-manegement.service';
import { EIMMenuChangeDetectionService } from 'app/shared/services/menu-change-detection.service';

/** ステータスタイプ変更時のエミット情報 */
export interface EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged {
	objId: number;
	routeEventTypes: EIMWorkflowEventType[];
	statusType: EIMWorkflowStatusType;
	isSkipChanged: boolean;
	isUserListChanged: boolean;
}

/**
 * 承認画面用ワークフローダイアグラムコンポーネント
 * @example
 *
 *      <eim-contents-approve-workflow-diagram
 *          [componentService]="componentService"
 *          [contextMenuItems]="contextMenuItems"
 *          [multiple]="false"
 *          [zoomFromViewCenter]="true"
 *          [(selectedNode)]="selectedNode"
 *          (initialized)="onInitialized($event)"
 *          (changed)="onChanged($event)"
 *          (contextmenu)="onContextmenu($event)"
 *          >
 *      </eim-contents-approve-workflow-diagram>
 */
@Component({
    selector: 'eim-contents-approve-workflow-diagram',
    templateUrl: '../../../../app/shared/components/diagram/diagram.component.html',
    styleUrls: ['../../../../app/shared/components/diagram/diagram.component.css'],
    providers: [],
    standalone: false
})
export class EIMContentsApproveWorkflowDiagramComponent extends EIMDiagramComponent implements OnDestroy {

	/** コンポーネントサービス */
	@Input()
	public componentService: EIMContentsApproveWorkflowDiagramComponentService;

	/** ステータス変更（ステータスの承認者、スキップ情報）イベントエミッタ */
	@Output()
	public statusTypeChanged: EventEmitter<EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged> = new EventEmitter<EIMContentsApproveWorkflowDiagramComponentStatusTypeChanged>();

	/** ダイアグラム情報 */
	public info: EIMContentsApproveForApproverSelectableWorkflowDiagramComponentInfo;

	/** ワークフロー情報 */
	protected workflow: EIMWorkflow;
	/** イベント履歴情報 */
	private events: any;
	/** 表示対象のオブジェクトID（ドキュメント） */
	protected targetObjId: number;
	/** 表示対象の遷移先ステータスタイプ */
	private targetStatusTypeId: number;
	/** サーバ問い合わせ中フラグ */
	private inRequest = false;
	/** 承認情報マネージャ */
	private approveInfoManager: EIMApproveInfoManagementService.EIMApproveInfoManager;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected el: ElementRef,
		protected diagramComponentService: EIMContentsApproveWorkflowDiagramComponentService,
		protected workflowService: EIMWorkflowService,
		protected approveInfoManagementService: EIMApproveInfoManagementService,
		protected menuChangeDetectionService: EIMMenuChangeDetectionService,
	) {
		super(el, diagramComponentService, menuChangeDetectionService);
		if (!this.componentService) {
			this.componentService = diagramComponentService;
		}

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 初期化します.
	 * @param serviceParam パラメータ
	 * @param isEmitEvent イベントを発火するかどうか
	 */
	public initialize(serviceParam: any = {}, isEmitEvent = true): void {
		this.componentService.initialize(this.info, serviceParam, this.initialized, this.changed, this.selected, this.statusTypeChanged);
	}

	/**
	 * 画面を描画します.
	 * @param param パラメータ
	 */
	public show(param: any, callbacks?: any): void {
		this.clear();

		if (param.objId) {
			this.targetObjId = param.objId;
		} else {
			this.targetObjId = -1;
		}
		this.targetStatusTypeId = param.nextStatusTypeId;
		if (!param.objId && !param.data) {
			return;
		}

		// ダイアグラムで承認者選択をする場合
		this.info.documentObjId = this.targetObjId;

		if (param.data) {
			// ワークフロー情報が提供される場合(回付状況/履歴表示時)
			this.info.workflow = param.data;
			let elements: any[] = this.componentService.createDiagramElement(this.info, param.data, param.events);
			this.componentService.setData(this.info, elements, null);

			param['currentStatusTypeId'] = this.getCurrentStatusTypeId(param.data);
			this.componentService.show(this.info, param);
		} else {
			// ワークフロー情報が提供されない場合
			this.inRequest = true;
			this.workflowService.getWorkflowAndEvent(param.objId)
				.subscribe((data: any) => {
					this.clear();
					this.info.workflow = data.workflow;
					if (this.targetObjId === -1 || this.targetObjId !== param.objId) {
						return;
					}
					if (!data.workflow) {
						return;
					}
					if (typeof this.targetStatusTypeId === 'undefined') {
						this.targetStatusTypeId = param.nextStatusTypeId;
					}
					let nextStatusTypeId: number = this.targetStatusTypeId;

					// 画面での更新情報を反映
					this.updateStatusTypes(data.workflow, param['updatedStatusTypes']);

					// ダイアグラム表示要素作成
					let elements: any[] = this.componentService.createDiagramElement(this.info, data.workflow, data.events, nextStatusTypeId);
					this.componentService.setData(this.info, elements, null);

					this.workflow = data.workflow;
					this.events = data.events;

					param['currentStatusTypeId'] = this.getCurrentStatusTypeId(data.workflow);
					// ダイアグラム表示
					this.componentService.show(this.info, param);
					this.inRequest = false;

					if (param['approveInfoManager']) {
						param['approveInfoManager'].setOriginalStatusTypes(param.objId, data.workflow.statusTypes);
					}

					if (callbacks) {
						callbacks(data.workflow, param);
					}
				},
					(err: any) => {
					});
		}
	}

	/**
	 * ワークフロー情報を返却します.
	 * @return ワークフロー情報
	 */
	public getWorkflow(): EIMWorkflow {
		return this.info.workflow;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * コンポーネント破棄前イベントハンドラ.
	 * ツールチップ表示が残っていれば削除します.
	 */
	ngOnDestroy(): void {
		let tooltipElement: any = document.getElementById('workflowToolTip');
		if (tooltipElement) {
			tooltipElement.parentNode.removeChild(tooltipElement);
		}
	}

	/**
	 * マウスアウトのイベントハンドラです.
	 */
	public onMouseOut(event: any): void {
		this.componentService.clearToolTip();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * カレントステータスタイプIDを返却します.
	 * @param workflow ワークフロー情報
	 * @return カレントステータスタイプID
	 */
	private getCurrentStatusTypeId(workflow: EIMWorkflow): number {
		let statusTypeId = -1;

		for (let i = 0; i < workflow.statusTypes.length; i++) {
			let statusType: EIMWorkflowStatusType = workflow.statusTypes[i];
			if (statusType.currentStatus) {
				statusTypeId = statusType.objId;
				break;
			}
		}

		return statusTypeId;
	}

	private updateStatusTypes(workflow: EIMWorkflow, updatedStatusTypes: EIMWorkflowStatusType[]): void {
		if (!updatedStatusTypes) {
			return;
		}

		let updatedStatusTypeIdAndStatusTypeMap = new Map<number, EIMWorkflowStatusType>();
		for (let i = 0; i < updatedStatusTypes.length; i++) {
			updatedStatusTypeIdAndStatusTypeMap.set(Number(updatedStatusTypes[i].objId), updatedStatusTypes[i]);
		}

		for (let i = 0; i < workflow.statusTypes.length; i++) {
			let updatedStatusType = updatedStatusTypeIdAndStatusTypeMap.get(Number(workflow.statusTypes[i].objId));
			if (updatedStatusType) {
				workflow.statusTypes[i] = updatedStatusType;
			}
		}
	}
}
