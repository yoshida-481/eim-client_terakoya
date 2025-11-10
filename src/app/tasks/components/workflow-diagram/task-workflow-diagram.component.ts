import { Component, ViewChild, ElementRef, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';

import { EIMMultipleLinesRendererComponent } from 'app/shared/components/renderer/multiple-lines-renderer.component';

import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramOptions, EIMDiagramComponentInfo } from 'app/shared/components/diagram/diagram.component.service';
import { EIMFormEventService } from 'app/forms/shared/services/apis/form-event.service';

import { EIMFormDomain } from 'app/shared/domains/form.domain';

import { EIMFormEventDTO } from 'app/shared/dtos/form-event.dto';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMMenuChangeDetectionService } from 'app/shared/services/menu-change-detection.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';

/**
 * ワークフローダイアグラムコンポーネント
 * @example
 *
 *      <eim-task-workflow-diagram
 *          [formFormatResult]="formFormatResult"
 *          >
 *      </eim-task-workflow-diagram>
 */
@Component({
	selector: 'eim-task-workflow-diagram',
	templateUrl: './task-workflow-diagram.component.html',
	styleUrls: ['./task-workflow-diagram.component.scss'],
	providers: [  ],
	standalone: false
})
export class EIMTaskWorkflowDiagramComponent extends EIMDiagramComponent {

	@ViewChild('eventHistoryGrid')
	 set content(eventHistoryGrid: EIMDataGridComponent) {
		if (!eventHistoryGrid) {
			return;
		}
	}

	/** 処理履歴情報リスト表示を有効化するかどうか */
	@Input()
		public formFormatResult: EIMFormFormatResultDTO;

	/** 帳票情報 */
	public form: EIMFormDomain;

	/** ステータスタイプの高さ */
	public height: number = 150;

	/** 処理履歴一覧を表示するかどうか */
	public displayEventHistory: boolean = false;

	/** 処理履歴情報リスト */
	private eventHistoryList: EIMFormEventDTO[];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected el: ElementRef,
			protected dataGridComponentService: EIMDiagramComponentService,

			protected translateService: TranslateService,
			protected attributeService: EIMAttributeService,
			protected formEventService: EIMFormEventService,
			protected dateService: EIMDateService,
			protected menuChangeDetectionService: EIMMenuChangeDetectionService,
	) {
		super(el, dataGridComponentService, menuChangeDetectionService);

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を描画します.
	 * @param param 帳票情報
	 */
	public show(result: EIMFormFormatResultDTO): void {
		if (result === undefined) {
			return;
		}
		this.form = result.dto;
		window.setTimeout(() => {
			this.componentService.show(this.info, result);
		});
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 */
	public ngAfterViewInit(): void {
		super.ngAfterViewInit();
		this.show(this.formFormatResult);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * グリッドカラムを生成して返却します.
	 * @return グリッドカラムリスト
	 */
	protected makeColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];
		// イベント実行日
		columns.push({field: 'creationDate', headerName: this.translateService.instant('EIM_FORMS.LABEL_02002'),
				type: EIMDataGridColumnType.dateTime, width: EIMConstantService.COLUMN_WIDTH_DATETIME, comparator: this.dateService.dateComparator});
		// イベントタイプ名
		columns.push({field: 'typeName', headerName: this.translateService.instant('EIM_FORMS.LABEL_02001'), width: 150});
		// 遷移元ステータスタイプ名
		columns.push({field: 'fromStatusTypeName', headerName: this.translateService.instant('EIM_FORMS.LABEL_02003'), width: 150});
		// 遷移先ステータスタイプ名
		columns.push({field: 'toStatusTypeName', headerName: this.translateService.instant('EIM_FORMS.LABEL_02006'), width: 120});
		// イベント実行ユーザー名
		columns.push({field: 'creationUserName', headerName: this.translateService.instant('EIM_FORMS.LABEL_02004'), width: 120});
		// イベントコメント
		columns.push({field: 'comment', headerName: this.translateService.instant('EIM.LABEL_02026'), width: 250, cellRendererFramework: EIMMultipleLinesRendererComponent});

		return columns;
	}

}
