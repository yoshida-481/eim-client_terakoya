import { Component, ViewChild, forwardRef, OnInit, SimpleChanges, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';


import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMCacheService } from 'app/shared/services/cache.service';
import { EIMProcessingWaitingListDTO } from 'app/tasks/shared/dtos/processing-waiting-list.dto';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMProgressBarRendererComponent } from 'app/shared/components/renderer/progress-bar-renderer.component';
import { EIMUpdatedTaskDTO } from 'app/tasks/tasks.interface';

/**
 * 処理待ち一覧コンポーネント
 * @example
 *
 *      <eim-task-processing-waiting-list>
 *      </eim-task-processing-waiting-list>
 */
@Component({
	selector: 'eim-task-processing-waiting-list',
	templateUrl: './task-processing-waiting-list.component.html',
	styleUrls: ['./task-processing-waiting-list.component.scss'],
	providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMTaskProcessingWaitingListComponent)}],
	standalone: false
})
export class EIMTaskProcessingWaitingListComponent implements OnInit, OnChanges, OnDestroy {

	/** データグリッド */
	@ViewChild('processingWaitingListDataGrid', { static: true })
	processingWaitingListDataGrid: EIMDataGridComponent;

	/** タスク更新時のイベントエミッタ */
	@Output() updatedTask: EventEmitter<EIMUpdatedTaskDTO> = new EventEmitter();
	
	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 選択中のグリッドデータ */
	public viewDialogName = null;

	public taskId: any;
	
	public parent: EIMSimpleObjectDTO;
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected taskService: EIMTaskService,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected cacheService: EIMCacheService,
	) {
		
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
  
	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		let columns: EIMDataGridColumn[] = [];

		// this.translateService.instant('EIM_TASKS.LABEL_02042')
		// ワークスペース
		columns.push({ field: 'workspaceName', headerName: this.translateService.instant('EIM_TASKS.LABEL_02053'), width: 250 });
		// タスク
		columns.push({ field: 'taskName', headerName: this.translateService.instant('EIM_TASKS.LABEL_02012'), width: 300,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				linkableFunction: (dto: any): boolean => { return true; },
				onClickLinkFunction: this.onClickTask.bind(this),
			}
		});

		// ステータス
		columns.push({
			field: 'statusName', headerName: this.translateService.instant('EIM_TASKS.LABEL_02017'), width: 180,
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
		columns.push({ headerName: this.translateService.instant('EIM_TASKS.LABEL_02014'), field: 'startYoteiDate', width: 100 });
		// 終了予定日
		columns.push({ headerName: this.translateService.instant('EIM_TASKS.LABEL_02015'), field: 'endYoteiDate', width: 100 });
		// 進捗率
		columns.push({
			field: 'progressRate', 
			headerName: this.translateService.instant('EIM_TASKS.LABEL_02018'), width: 100,
			cellRendererFramework: EIMProgressBarRendererComponent
		});
		// 依頼日時
		columns.push({ headerName: this.translateService.instant('EIM_TASKS.LABEL_02054'), field: 'orderDate', width: 150 });
		// 依頼者
		columns.push({ headerName: this.translateService.instant('EIM_TASKS.LABEL_02055'), field: 'orderUserName', width: 150 });

		this.processingWaitingListDataGrid.setColumns(columns);
		this.processingWaitingListDataGrid.showAllSelectButton = false;
		
		// 処理待ち一覧取得
		this.taskService.getMyTaskList(this.cacheService.getLoginUser().id).subscribe((waitingListDtos: EIMProcessingWaitingListDTO[]) => {
			if (waitingListDtos.length == 0) {
				this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_TASKS.INFO_00005'));
				this.errored.emit();
			}
			
			this.processingWaitingListDataGrid.setData(waitingListDtos);
		});
	}

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges): void {
	
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
	
	}

	/**
	 * タスク名称リンククリック時のイベントハンドラです.
	 * @param dto タスク情報DTO
	 */
	public onClickTask(dto: any): void {
		this.taskId = dto.taskId;
		this.parent = dto.parent;
		this.viewDialogName = 'taskUpdator';
	}

	/**
	 * タスク更新時のイベントハンドラです.
	 *
	 * @param event 更新タスク情報
	 */
	public onUpdateTask(event: EIMUpdatedTaskDTO): void {
		this.viewDialogName = null;

		// 完了メッセージ表示
		this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00002',
				{value: this.translateService.instant('EIM_TASKS.LABEL_02012')}));

		// タスク更新通知
		this.updatedTask.emit(event);

		// 処理待ち一覧取得
		this.taskService.getMyTaskList(this.cacheService.getLoginUser().id).subscribe((waitingListDtos: EIMProcessingWaitingListDTO[]) => {
			if (waitingListDtos.length == 0) {
				return;
			}
			
			this.processingWaitingListDataGrid.setData(waitingListDtos);
		});

	}
	
	/**
	 * ダイアログクローズ時のイベントハンドラです.
	 */
	public onCloseDialog() {
		this.viewDialogName = null;
	}

}
