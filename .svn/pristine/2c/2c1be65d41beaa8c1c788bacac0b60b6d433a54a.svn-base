import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-community';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMBoxObjectDomain } from 'app/shared/domains/box-object.domain';
import { EIMBoxNameRendererComponentService } from './box-name-renderer.component.service';
import { EIMDataGridComponent } from "app/shared/components/data-grid/data-grid.component";

import { BoxEIMFileDragComponentService } from "app/documents/components/eim-file-drag/eim-file-drag.component.service";
import { EIMBoxContentsListComponentService } from "app/documents/components/box-contents-list/box-contents-list.component.service";

/**
 * Box名前レンダラーコンポーネント
 * @example
 * 	    cellRendererFramework: EIMBoxNameRendererComponent
 */
@Component({
	selector: 'eim-box-name-renderer',
	template: `
    <div style="height: 100%; width: 100%; display: flex; align-items: center;" [draggable]="fileDraggable" (dragstart)="fileDraggable && onDragStart($event)" (dragend)="fileDraggable && onDragEnd($event)" [class.fileDraggable]="fileDraggable">
      <div *ngIf="fileDraggable">
        <i class="pi pi-ellipsis-v"></i>
        <i class="pi pi-ellipsis-v"></i>
        <i class="pi pi-ellipsis-v"></i>
        <i class="pi pi-ellipsis-v"></i>
      </div>
		<i class="fa fa-lg {{ getIcon() }} eim-document-main-single-clickable" style="padding-left:3px; padding-right:3px;"></i>
		<a (click)="onClick($event)" href="#" class="eim-document-main-single-clickable">
			<pre class="eim-document-main-single-clickable">{{ getLabel() }}</pre>
		</a>
	`,
	styles: [`
		:host {
			height: 100%;
			display: flex;
			align-items: center;
		}
		i, pre {
			padding: 0 3px;
		}
		a {
			color: #04c;
		}
    	.fileDraggable {
			cursor: grab;
		}
		.fileDraggable div {
    		padding-left: 3px;
    	    padding-right: calc(3px + 0.25em);
			margin-left: -0.25em;
      }
		.pi-ellipsis-v {
    		width: 0.25em;
     	}
	`,
	],
    standalone: false
})
export class EIMBoxNameRendererComponent implements AgRendererComponent {
	public params: ICellRendererParams;

	public fileDraggable = false;

	constructor(
		protected componentService: EIMBoxNameRendererComponentService,
		protected eimFileDragComponentService: BoxEIMFileDragComponentService,
		protected boxContentsListComponentService: EIMBoxContentsListComponentService
	) { }

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: ICellRendererParams) {
		this.params = params;

		// EIM連携用
		if (
			this.params.colDef.cellRendererParams &&
			this.params.colDef.cellRendererParams.hasOwnProperty(
				"draggableToEIMArea"
			) &&
			this.params.data.type === "file"
		) {
			// ドラッグアイコンを表示するかしないか
			this.fileDraggable =
				this.params.colDef.cellRendererParams.draggableToEIMArea;
		} else {
			this.fileDraggable = false;
		}
	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * 名前クリック時のイベントハンドラです.
	 */
	onClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		const data: EIMBoxObjectDomain = this.params.data;
		this.componentService.onClick(data);
	}

	/**
	 * ラベルを取得します.
	 */
	getLabel(): string {
		return this.componentService.getLabel(this.params.data);
	}

	/**
	 * アイコンクラス名を取得します.
	 */
	getIcon(): string {
		this.params.data.icon = this.componentService.getIcon(this.params.data);
		return this.componentService.getIcon(this.params.data);
	}

	/**
	 * ドラッグ開始イベントハンドラ
	 * @param event イベント
	 */
	onDragStart(event: DragEvent) {
		const context: EIMDataGridComponent = this.params.context;
		const selectedData = context.getSelectedData();
		const find = selectedData.find((sel) => sel === this.params.data);

		// ドラッグ対象のデータがファイルタイプのものだけを取得
		const draggableData = (find ? selectedData : [this.params.data]).filter(
			(data) => data.type === "file"
		);

		// ドラッグ対象のデータが選択済みでない、または選択データとドラッグ対象のデータ数が異なる場合
		if (!find || selectedData.length !== draggableData.length) {
			//ドラッグしているファイル情報を選択しているファイルとしてセットする
			context.select(draggableData);
		}

		this.eimFileDragComponentService.dragStart(event, draggableData);
	}

	/**
	 * ドラッグ終了イベントハンドラ
	 * @param event イベント
	 */
	onDragEnd(event: DragEvent) {
		this.eimFileDragComponentService.dragEnd(event);
	}
}
