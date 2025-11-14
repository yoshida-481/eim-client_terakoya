import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMMultipleLinesRendererComponent } from 'app/shared/components/renderer/multiple-lines-renderer.component';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMContentsApproveWorkflowDiagramComponentService } from 'app/documents/components/contents-approve-workflow-diagram/contents-approve-workflow-diagram.component.service';
import { EIMWorkflowService } from 'app/documents/shared/services/apis/workflow.service';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramNode, EIMDiagramStyle, EIMDiagramComponentInfo } from 'app/shared/components/diagram/diagram.component.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * ステータス属性コンポーネント
 * @example
 *
 *      <eim-contents-status-property
 *          [content]="content">
 *      </eim-contents-status-property>
 */
@Component({
    selector: 'eim-contents-status-property',
    templateUrl: './contents-status-property.component.html',
    styleUrls: ['./contents-status-property.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMContentsStatusPropertyComponent) }
    ],
    standalone: false
})
export class EIMContentsStatusPropertyComponent implements OnInit, OnChanges {


	/** ワークフロー図形 */
	@ViewChild('workflowDiagram', { static: true }) workflowDiagram: EIMDiagramComponent;

	/** ステータス属性データグリッド */
	@ViewChild('contensStatusPropertyGrid', { static: true })
		contensStatusPropertyGrid: EIMDataGridComponent;

	/** 対象のオブジェクト */
	@Input() content: any;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
		public contentsApproveWorkflowDiagramComponentService: EIMContentsApproveWorkflowDiagramComponentService,
		protected workflowService: EIMWorkflowService,
		protected translateService: TranslateService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected dateService: EIMDateService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 同一行か判定します.
	 * @param a 判定対象A
	 * @param b 判定対象B
	 * @return 判定結果
	 */
	public equalsEventType(a: any, b: any): boolean {
		return (a.date === b.date && a.fromStatusId === b.fromStatusId && a.toStatusId === b.toStatusId);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 承認実行日
		columns.push({field: 'date', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02110'), width: 155, suppressFilter: true, comparator: this.dateService.dateComparator});
		// ユーザ（所属元）
		columns.push({field: 'userName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02111'), width: 120, suppressFilter: true, suppressSorting: true});
		// 処理内容
		columns.push({field: 'baseEvtType', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02112'), width: 120, suppressFilter: true, suppressSorting: true});
		// 遷移元ステータス
		columns.push({field: 'fromStatus', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02113'), width: 120, suppressFilter: true, suppressSorting: true});
		// 遷移先ステータス
		columns.push({field: 'toStatus', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02114'), width: 120, suppressFilter: true, suppressSorting: true});
		// 回付コメント
		columns.push({ type: EIMDataGridColumnType.largeText, field: 'comment', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02205'), width: 210, suppressFilter: true, suppressSorting: true});
		// 公開通知コメント
		columns.push({ type: EIMDataGridColumnType.largeText, field: 'publicCommentLog', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02208'), width: 210, suppressFilter: true, suppressSorting: true});

		this.contensStatusPropertyGrid.setColumns(columns);
		this.contensStatusPropertyGrid.setRowHeight(EIMConstantService.APPROVE_ROW_HEIGHT);
		this.contensStatusPropertyGrid.showAllSelectButton = false;
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {
		this.show();
	}

	/**
	 * 公開通知先参照画面を開きます.
	 */
	onClickNotfiedUser(): void {
		let dialogId = this.dialogManagerComponentService.showNotfiedUserSelector(this.content.objId, {
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ワークフローダイアグラム選択時イベントハンドラ.
	 * @param event イベント
	 */
	onChangeDiagram(event: any): void {
		let selectedElement: EIMDiagramNode[] = this.workflowDiagram.getSelectedData();
		if (selectedElement.length === 0) {
			return;
		}
		// ステータスタイプの履歴を選択する
		let selectedStatusTypeId: number = (<any>selectedElement[0]).data.id;
		let histories: any = this.contensStatusPropertyGrid.getData();
		let selectedTopData: any;
		let selectData: any[] = [];
		for (let i = 0; i < histories.length; i++) {
			let history: any = histories[histories.length - 1 - i];
			if (history.fromStatusId !== selectedStatusTypeId &&
				history.toStatusId !== selectedStatusTypeId) {
					continue;
			}
			if (!selectedElement[0].domain.events) {
				continue;
			}
			for (let j = 0; j < selectedElement[0].domain.events.length; j++) {
				let targetEvent: any = selectedElement[0].domain.events[j];
				if (targetEvent.baseEvtType !== history.baseEvtType ||
					!this.isContain(targetEvent.user, history)) {
						continue;
				}
				selectData.push(history);
				selectedTopData = history;
				break;
			}
		}

		// 実行日が一番古いデータまでスクロール
		if (selectedTopData) {
			let rowIndex: number = this.contensStatusPropertyGrid.getTargetRowIndex(selectedTopData);
			this.contensStatusPropertyGrid.ensureIndexVisible(rowIndex);
		}
		this.contensStatusPropertyGrid.select(selectData, false);

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します
	 */
	private show(): void {
		let displayProgressDialog = true;
		this.workflowService.getWorkflowAndEvent(this.content.objId, displayProgressDialog)
		.subscribe((data: any) => {
			for (let i = 0; i < data.events.length; i++) {
				if (data.events[i].belong) {
					data.events[i].userName = data.events[i].userName + '(' + data.events[i].belong + ')'
				}
			}
			this.contensStatusPropertyGrid.setData(data.events);
			this.showWorkflow(data.workflow, data.events);
		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
				this.errored.emit();
			});
		});
	}

	/**
	 * ワークフロー情報を表示します.
	 * @param workflow ワークフロー情報
	 * @param events イベント
	 */
	private showWorkflow(workflow: any, events: any): void {
		let params: any = {};
		params['data'] = workflow;
		params['events'] = events;
		this.workflowDiagram.show(params);
	}


	/**
	 * 対象のステータスタイプに含まれるイベントかどうか、時間により判定します
	 * @param user イベント実行ユーザ
	 * @param history 履歴
	 * @return 判定結果
	 */
	private isContain(user: any, history: any): boolean {
		for (let i = 0; i < user.length; i++) {
			if (user[i].date === history.date) {
				return true;
			}
		}
		return false;
	}
}
