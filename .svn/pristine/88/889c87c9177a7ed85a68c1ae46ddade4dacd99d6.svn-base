import { Component, ViewChild, ElementRef, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';

import { EIMMultipleLinesRendererComponent } from 'app/shared/components/renderer/multiple-lines-renderer.component';

import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramOptions, EIMDiagramComponentInfo } from 'app/shared/components/diagram/diagram.component.service';
import { EIMFormEventService } from 'app/forms/shared/services/apis/form-event.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';

import { EIMFormEventDTO } from 'app/shared/dtos/form-event.dto';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMMenuChangeDetectionService } from 'app/shared/services/menu-change-detection.service';

/**
 * ダイアグラムコンポーネント
 * @example
 *
 *      <eim-workflow-diagram
 *          [componentService]="componentService"
 *          [contextMenuItems]="contextMenuItems"
 *          [(selectedNode)]="selectedNode"
 *          (initialized)="onInitialized($event)"
 *          (changed)="onChanged($event)"
 *          (contextmenu)="onContextmenu($event)"
 *          >
 *      </eim-workflow-diagram>
 */
@Component({
    selector: 'eim-workflow-diagram',
    templateUrl: './workflow-diagram.component.html',
    styleUrls: ['./workflow-diagram.component.css'],
    providers: [],
    standalone: false
})
export class EIMWorkflowDiagramComponent extends EIMDiagramComponent {

	@ViewChild('eventHistoryGrid')
	 set content(eventHistoryGrid: EIMDataGridComponent) {
		if (!eventHistoryGrid) {
			return;
		}
		this.initEventHistory(eventHistoryGrid);
	}
	
	/** 処理履歴情報リスト表示を有効化するかどうか */
	@Input()
		public enableEventHistory: boolean = false;

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
	public show(param: any): void {
		this.form = param.form;
		param.enableEventHistory = this.enableEventHistory;
		if (param.enableEventHistory) {
			this.height += 20;
		}
		this.componentService.show(this.info, param);
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 処理履歴表示ボタン押下イベントハンドラ.
	 * @param event イベント
	 */
	public onClickShowEventHistory(event): void {
		if (this.form) {
			this.displayEventHistory = !this.displayEventHistory;
		}	
	}
	
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	private initEventHistory(eventHistoryGrid: EIMDataGridComponent): void {

		let columns: EIMDataGridColumn[] = this.makeColumns();
		
		eventHistoryGrid.setColumns(columns);
		eventHistoryGrid.setRowHeight(65);
		
		if (this.eventHistoryList) {
			// データ取得済みの場合
			window.setTimeout(() => {
				eventHistoryGrid.setData(this.eventHistoryList);
			});
			return;
		}

		// 処理履歴取得
		if (this.form.id !== 0) {
			let workspaceAttr: EIMAttributeDomain = this.attributeService.getAttributeByDefinitionName(this.form.attributeList, EIMConstantService.ATTRIBUTE_TYPE_NAME_FORM_WORKSPACE_ID);
			this.formEventService.getList({formId: this.form.id, formWorkspaceId: workspaceAttr.getValueList()[0]})
			.subscribe(
					(formEventList: EIMFormEventDTO[]) => {
						this.eventHistoryList = [];
						for (let i = 0; i < formEventList.length; i++) {
							this.eventHistoryList.push(formEventList[i]);
						}
						eventHistoryGrid.setData(this.eventHistoryList);
					});
		}
	}

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
