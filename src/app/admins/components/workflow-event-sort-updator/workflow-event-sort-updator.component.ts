import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTreeDataGridColumn, EIMTreeDataGridComponent } from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import { EIMTreeDataGridNode } from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';

/**
 * イベント優先度設定並べ替えコンポーネント
 * @example
 *
 *      <eim-workflow-event-sort-updator
 *          [selectedData]="selectedData">
 *      </eim-workflow-event-sort-updator>
 */
@Component({
    selector: 'eim-workflow-event-sort-updator',
    templateUrl: './workflow-event-sort-updator.component.html',
    styleUrls: ['./workflow-event-sort-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMWorkflowEventSortUpdatorComponent) }
    ],
    standalone: false
})

export class EIMWorkflowEventSortUpdatorComponent implements AfterViewInit, EIMUpdatable {
	/** イベント優先度設定データグリッド */
	@ViewChild('eventDataGrid', { static: true }) eventDataGrid: EIMTreeDataGridComponent;

	/** イベント優先度設定リスト */
	@Input() public selectedData: any[];

	/** 作成完了時のイベントエミッタ */
	@Output() public updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新ボタン活性フラグ */
	public updateFlag: boolean;

	/** 移動可能フラグ */
	public moveable = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * イベント優先度並べ替えを登録します.
	 */
	public update(): void {
		let eventDataList = this.eventDataGrid.getData();
		// イベント優先度設定並べ替えを登録します．
		this.updated.emit(eventDataList);
	}

	/**
	 * イベント優先度並べ替え可否を返却します.
	 * @return イベント優先度設定並べ替え可否
	 */
	public updatable(): boolean {
		return this.updateFlag;
	}

	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.eventId === obj2.eventId);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngAfterViewInit(): void {
		if (!this.selectedData) {
			window.setTimeout(() => {
				this.errored.emit();
			});
		}

		this.updateFlag = false;
		let eventColumns: EIMTreeDataGridColumn[] = [];

		window.setTimeout(() => {
			// 名前
			eventColumns.push({field: 'label', headerName: this.translateService.instant('EIM.LABEL_02002')});
			this.eventDataGrid.setColumns(eventColumns);
			// 親画面からのイベント優先度設定データを表示する
			this.eventDataGrid.setData(this.selectedData);
		});
	}

	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickUp(event: any): void {
		let selectData = this.eventDataGrid.getSelectedData()[0];
		let parent = selectData.parent;
		let children = parent.children;
		let idx = 0;
		for ( let i = 0; i < children.length; i++ ) {
			let child: EIMTreeDataGridNode = children[i];
			if ( child.data.id === selectData.data.id ) {
				break;
			}
			idx++;
		}
		if ( idx === 0 ) {
			return;
		}

		children.splice(idx - 1, 0, selectData);
		children.splice(idx + 1, 1);
		for ( let i = 0; i < children.length; i++ ) {
			let child: EIMTreeDataGridNode = children[i];
			child.data.sequence = i + 1;
		}
		// Change detection
		this.eventDataGrid.info.data = [...this.eventDataGrid.info.data];
		this.updateFlag = true;
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event: any): void {
		let selectData = this.eventDataGrid.getSelectedData()[0];
		let parent = selectData.parent;
		let children = parent.children;
		let idx = 0;
		for ( let i = 0; i < children.length; i++ ) {
			let child: EIMTreeDataGridNode = children[i];
			if ( child.data.id === selectData.data.id ) {
				break;
			}
			idx++;
		}
		if ( idx === children.length - 1 ) {
			return;
		}

		children.splice(idx, 1);
		children.splice(idx + 1, 0, selectData);
		for ( let i = 0; i < children.length; i++ ) {
			let child: EIMTreeDataGridNode = children[i];
			child.data.sequence = i + 1;
		}
		this.eventDataGrid.info.data = [...this.eventDataGrid.info.data];
		this.updateFlag = true;
	}

	/**
	 * ツリーノード選択時のイベントハンドラ
	 * @param selectedData 選択されたノードリスト
	 */
	onSelectTreeNode(selectedData: any): void {
		let selectData = this.eventDataGrid.getSelectedData()[0];
		let parent = selectData.parent;
		if ( parent ) {
			if ( parent.children.length > 1 ) {
				this.moveable = true;
			} else {
				this.moveable = false;
			}
		} else {
			this.moveable = false;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
