import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMWorkspaceHomeWidgetComponent } from '../workspace-home/workspace-home.component';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMProgressBarRendererComponent } from 'app/shared/components/renderer/progress-bar-renderer.component';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMProcessingWaitingListDTO } from 'app/tasks/shared/dtos/processing-waiting-list.dto';
import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';

/**
 * 本日完了予定タスク情報一覧ウィジェットコンポーネント
 * @example
 *
 *      <eim-workspace-home-today-complete-plan-tasks>
 *      </eim-workspace-home-today-complete-plan-tasks>
 */
@Component({
	selector: 'eim-workspace-home-widget-today-complete-plan-tasks',
	templateUrl: './workspace-home-widget-today-complete-plan-tasks.component.html',
	styleUrls: ['./workspace-home-widget-today-complete-plan-tasks.component.scss'],
	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceHomeWidgetTodayCompletePlanTasksComponent)}, ],
	standalone: false,
})
export class EIMWorkspaceHomeWidgetTodayCompletePlanTasksComponent implements EIMWorkspaceHomeWidgetComponent {
	
	@Input()
	public workspaceId: number = null;

	/** タスク選択時イベントエミッタ */
	public selectedTask: EventEmitter<{taskId: number, parent: EIMSimpleObjectDTO}> = new EventEmitter();

	/** データグリッド */
	@ViewChild('dataGrid', { static: false }) dataGrid: EIMDataGridComponent;
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected taskService: EIMTaskService,
		protected localStorageService: EIMLocalStorageService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	public update(): void {

		// F5更新直後はdataGridの初期化が間に合わない
		// その場合はdataを空にする必要もない
		if (this.dataGrid) {
			this.dataGrid.setData([]);
		}

		this.taskService.getTodayCompletePlanTaskList(this.workspaceId)
		.subscribe((waitingListDtos: EIMProcessingWaitingListDTO[]) => {
			this.dataGrid.setColumns(this.getDataGridColumns());
			this.dataGrid.setData(waitingListDtos);
		});
			
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.update();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	protected getDataGridColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];

		// タスク名
		columns.push({
			field: 'taskName',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_03009'),
			width: 200,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				linkableFunction: (dto: any): boolean => { return true; },
				onClickLinkFunction: (dto) => {this.selectedTask.emit(dto)},
			}
		});

		// 担当者
		columns.push({
			field: 'tantoUserName',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02041'),
			width: 220 });

		// ステータス
		columns.push({
			field: 'statusName',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02017'),
			width: 180,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				styleFunctions:  [
					(dto: any): string => {
						if (dto.statusName.includes("遅延中")) {
							return 'eim-task-manager-tasks-delay';
						}
						return '';
					}
				]
			}
		});
		
		// 開始予定日
		columns.push({
			field: 'startYoteiDate',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02014'),
			width: 100 });
		// 終了予定日
		columns.push({
			field: 'endYoteiDate',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02015'),
			width: 100 });
		// 進捗率
		columns.push({
			field: 'progressRate', 
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02018'),
			width: 100,
			cellRendererFramework: EIMProgressBarRendererComponent,
		});
		// 依頼日時
		columns.push({
			field: 'orderDate',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02054'),
			width: 150 });
		// 依頼者
		columns.push({
			field: 'orderUserName',
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02055'),
			width: 220 });

		return columns;
	}

}
