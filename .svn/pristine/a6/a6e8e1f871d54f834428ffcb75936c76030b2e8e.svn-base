import { EIMWorkspaceService } from 'app/documents/shared/services/apis/workspace.service';
import { Component, ViewChild, ElementRef, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMContentsApproveWorkflowDiagramComponentService } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component.service';
import { EIMWorkflowService, EIMWorkflow, EIMWorkflowStatusType } from 'app/documents/shared/services/apis/workflow.service';

import { EIMApproveStatusDTO } from 'app/documents/shared/dtos/approve-status.dto';
import { EIMContentsApproveWorkflowDiagramComponent } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component';
import { EIMApproveInfoManagementService } from 'app/documents/shared/services/approve-info-manegement.service';
import { EIMMenuChangeDetectionService } from 'app/shared/services/menu-change-detection.service';

/**
 * 承認用のマスタワークフローダイアグラムコンポーネント
 * @example
 *
 *      <eim-master-contents-approve-workflow-diagram
 *          [componentService]="componentService"
 *          [contextMenuItems]="contextMenuItems"
 *          [multiple]="false"
 *          [zoomFromViewCenter]="true"
 *          [zoom]="0.9"
 *          [(selectedNode)]="selectedNode"
 *          (initialized)="onInitialized($event)"
 *          (changed)="onChanged($event)"
 *          (contextmenu)="onContextmenu($event)"
 *          >
 *      </eim-master-contents-approve-workflow-diagram>
 */
@Component({
    selector: 'eim-master-contents-approve-workflow-diagram',
    templateUrl: '../../../../app/shared/components/diagram/diagram.component.html',
    styleUrls: ['../../../../app/shared/components/diagram/diagram.component.css'],
    providers: [],
    standalone: false
})
export class EIMMasterContentsApproveWorkflowDiagramComponent extends EIMContentsApproveWorkflowDiagramComponent {

	/** ズーム値 */
	@Input()
	public zoom = 0.9;

	/** 表示情報取得イベントエミッタ */
	@Output()
	public fetched: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラーイベントエミッタ */
	@Output()
	public errored: EventEmitter<any[]> = new EventEmitter<any[]>();

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected el: ElementRef,
			protected diagramComponentService: EIMContentsApproveWorkflowDiagramComponentService,
			protected workflowService: EIMWorkflowService,
			protected workspaceService: EIMWorkspaceService,
			protected approveInfoManagementService: EIMApproveInfoManagementService,
			protected menuChangeDetectionService: EIMMenuChangeDetectionService,
	) {
		super(el, diagramComponentService, workflowService, approveInfoManagementService, menuChangeDetectionService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を描画します.
	 * @param param パラメータ
	 */
	public show(param: any): void {
		if (!param.objTypeId && !param.workspaceId) {
			this.targetObjId = 0;
			this.clear();
			return;
		} else if (!param.workspaceId) {
			this.targetObjId = param.objTypeId;
			this.workspaceService.getWorkFlow(param.objTypeId)
			.subscribe(
				(workflow: EIMWorkflow) => {
					this.clear();
					if (!workflow || this.targetObjId !== param.objTypeId) {
						this.fetched.emit();
						return;
					}
					let nextStatusTypeId: number = param.nextStatusTypeId;

					let elements: any[] = this.diagramComponentService.createDiagramElement(this.info, workflow, null, nextStatusTypeId);
					this.diagramComponentService.setData(this.info, elements, null);
					// 設定完了エミッタ
					this.fetched.emit();
					this.workflow = workflow;

					param.zoom = this.zoom;
					this.componentService.show(this.info, param);
				},
				(err: any) => {
					this.errored.emit();
				});
		} else {
			this.workflowService.getByObjTypeId(param.createType, param.objTypeId, param.workspaceId)
			.subscribe(
					(workflow: EIMWorkflow) => {
						this.clear();
						if (!workflow) {
							return;
						}

						let nextStatusTypeId: number = param.nextStatusTypeId;

						let elements: any[] = this.diagramComponentService.createDiagramElement(this.info, workflow, null, nextStatusTypeId);
						this.diagramComponentService.setData(this.info, elements, null);

						this.workflow = workflow;

						param.zoom = this.zoom;

						this.componentService.show(this.info, param);
					},
					(err: any) => {
						this.errored.emit();
					});
		}
	}
}
