import { Component, ViewChild, forwardRef, OnInit, SimpleChanges, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';


import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMFileIconClassFunctionService } from 'app/shared/services/file-icon-class-function.service';
import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMProcessingHistoryDTO } from 'app/tasks/shared/dtos/processing-history.dto';

/**
 * 処理履歴一覧コンポーネント
 * @example
 *
 *      <eim-task-processing-history
 *          [taskId]="taskId">
 *      </eim-task-processing-history>
 */
@Component({
	selector: 'eim-task-processing-history',
	templateUrl: './task-processing-history.component.html',
	styleUrls: ['./task-processing-history.component.scss'],
	providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMTaskProcessingHistoryComponent)}],
	standalone: false
})
export class EIMTaskProcessingHistoryComponent implements OnInit, OnChanges, OnDestroy {

	/** データグリッド */
	@ViewChild('processingHistoryDataGrid', { static: true })
		processingHistoryDataGrid: EIMDataGridComponent;

	/** 表示対象のタスクID */
	@Input() taskId: any;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected taskService: EIMTaskService,
		protected translateService: TranslateService,
		protected serverConfigService: EIMServerConfigService,
		protected dataGridComponentService: EIMDataGridComponentService,
		protected fileIconClassFunctionService: EIMFileIconClassFunctionService,
		protected messageService: EIMMessageService,
	) {
		
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
  /**
	 * 画面を表示します.
	 */
	public show(): void {
		// 処理履歴取得
		this.taskService.getProcessingHistoryList(this.taskId).subscribe((processingHistoryDtos: EIMProcessingHistoryDTO[]) => {
			if (processingHistoryDtos.length == 0) {
				this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_TASKS.ERROR_00006'));
				this.errored.emit();
			}
			
			this.processingHistoryDataGrid.setData(processingHistoryDtos);
		});
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		let columns: EIMDataGridColumn[] = [];
		columns.push({ headerName: this.translateService.instant('EIM_TASKS.LABEL_02042'), field: 'userName', width: 220, suppressSorting: true, suppressMovable: true, suppressFilter: true });
		columns.push({ headerName: this.translateService.instant('EIM_TASKS.LABEL_02043'), field: 'eventTypeName', width: 180, suppressSorting: true, suppressMovable: true, suppressFilter: true });
		columns.push({ headerName: this.translateService.instant('EIM_FORMS.LABEL_02002'), field: 'createDate', width: 150, suppressSorting: true, suppressMovable: true, suppressFilter: true });
		columns.push({ headerName: this.translateService.instant('EIM.LABEL_02026'), field: 'comment', width: 430, suppressSorting: true, suppressMovable: true, suppressFilter: true });

		this.processingHistoryDataGrid.setColumns(columns);
		this.processingHistoryDataGrid.showAllSelectButton = false;

	}

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges): void {
		this.show();
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
	
	}
}
