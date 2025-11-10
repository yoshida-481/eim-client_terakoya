import { EIMDateTimeRendererComponent } from '../../../shared/components/renderer/date-time-renderer.component';
import { EIMDateTimeRendererComponentService } from '../../../shared/components/renderer/date-time-renderer.component.service';
import { EIMOperationHistoryDTO } from '../../../shared/dtos/operation-history.dto';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMFormService } from 'app/forms/shared/services/apis/form.service';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * 帳票管理アクセス履歴コンポーネント
 * @example
 *
 *      <eim-form-access-history
 *          [formId]="formId"
 *      </eim-form-access-history>
 */
@Component({
    selector: 'eim-form-access-history',
    templateUrl: './form-access-history.component.html',
    styleUrls: ['./form-access-history.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormAccessHistoryComponent) }
    ],
    standalone: false
})
export class EIMFormAccessHistoryComponent implements OnInit, OnChanges {

	/** アクセス履歴データグリッド */
	@ViewChild('accessHistoryGrid', { static: true })
	accessHistoryGrid: EIMDataGridComponent;

	/** 帳票ID */
	@Input() formId: number;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected formService: EIMFormService,
			protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
			protected dateService: EIMDateService,
	) {

	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		let columns: EIMDataGridColumn[] = [];
		// アクセス日時
		columns.push({
			field: 'accessDate', headerName: this.translateService.instant('EIM.LABEL_02024'), width: EIMConstantService.COLUMN_WIDTH_DATETIME,
			cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
		});
		// ユーザ
		columns.push({field: 'userName', headerName: this.translateService.instant('EIM.LABEL_02017'), width: 150});
		// アクセス内容
		columns.push({field: 'operationTypeName', headerName: this.translateService.instant('EIM.LABEL_02025'), width: 345});

		this.accessHistoryGrid.setColumns(columns);

	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {
		this.show();
	}

	/**
	 * 画面を表示します
	 */
	public show(): void {
		// アクセス履歴を取得する
		this.formService.getAccessHistoryList(this.formId).subscribe( (historyList: EIMOperationHistoryDTO[]) => {
			this.accessHistoryGrid.setData(historyList);
		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
				this.errored.emit();
			});
		});
		
		
	}

}
