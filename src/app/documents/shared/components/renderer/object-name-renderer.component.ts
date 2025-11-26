import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

import { EIMServerConfigService } from 'app/shared/services/server-config.service';

import { EIMObjectNameRendererComponentService } from 'app/documents/shared/components/renderer/object-name-renderer.component.service';

import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';

import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMBoxFileDragComponentService } from 'app/documents/components/box-file-drag/box-file-drag.component.service';
import { EIMDocumentSessionStorageService } from '../../services/apis/document-session-storage.service';
import { EIMDialogManagerComponentService } from '../dialog-manager/dialog-manager.component.service';

/**
 * オブジェクト名称レンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMObjectNameRendererComponent
 *
 */
@Component({
    selector: 'eim-object-name-renderer',
    template: `
		<div style="height: 100%; display: flex; align-items: center;" [draggable]="fileDraggable"
				(dragstart)="onDragStart($event)"
				(dragend)="onDragEnd($event)"
				[class.fileDraggable]="fileDraggable">
			<div *ngIf="fileDraggable">
				<i class="pi pi-ellipsis-v"></i>
				<i class="pi pi-ellipsis-v"></i>
				<i class="pi pi-ellipsis-v"></i>
				<i class="pi pi-ellipsis-v"></i>
			</div>
			<i class="fa {{getIcon(params.data)}} fa-lg eim-document-main-single-clickable" style="padding-left:3px; padding-right:3px;"></i>
			<a *ngIf="showLink && !expiration" class="eim-document-main-single-clickable" href="#" style="padding-left:3px; padding-right:3px; color: #0044CC;" (click)="onClick($event, params)"><pre class="eim-document-main-single-clickable">{{label}}</pre></a>
			<a *ngIf="showLink && expiration" class="eim-document-main-single-clickable" href="#" style="padding-left:3px; padding-right:3px; color: #000000;" (click)="onClick($event, params)"><pre class="eim-document-main-single-clickable">{{label}}</pre></a>
			<span *ngIf="!showLink" href="#" style="padding-left:3px; padding-right:3px;">{{params.value}}</span>
		</div>
	`,
    styles: [`
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
	`],
    standalone: false
})
export class EIMObjectNameRendererComponent implements AgRendererComponent, OnInit, OnDestroy {
	public params: any;
	public showLink = true;
	public expiration = false;
	public label: string;

	public fileDraggable = false;
	public pdf:Blob;

	/**
	 * コンストラクタです.
	 */
	constructor(
		private dialogManagerComponentService: EIMDialogManagerComponentService,
			private objectNameRendererComponentService: EIMObjectNameRendererComponentService,
			private serverConfigService: EIMServerConfigService,
			private fileService: EIMFileService,
			private userService: EIMDocumentsUserService,
		private boxFileDragComponentService: EIMBoxFileDragComponentService,
		private documentSessionStorageService: EIMDocumentSessionStorageService
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		return true;
	}

	/**
	 * アイコンを取得する.
	 * @param value オブジェクト名称
	 * @return アイコンクラス
	 */
	public getIcon(value: any): string {
		return this.objectNameRendererComponentService.getIcon(value);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit() {
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy() {
	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;
		this.label = this.objectNameRendererComponentService.getLabel(this.params.value);
		if (params.data.hasOwnProperty('isNoLink') && params.data.isNoLink) {
			this.showLink = false;
		}
		if (params.data.hasOwnProperty('readOnly') && (params.data.readOnly === 'true' || params.data.readOnly === true)) {
			this.showLink = false;
		}

		for (let i = 0; i < this.params.context.columns.length; i++) {
			let column: any = this.params.context.columns[i];
			if (params.column.colDef.field !== column.field
					|| params.column.colDef.headerName !== column.headerName) {
				continue;
			}

			if (column.param && !column.param.isLink) {
				this.showLink = false;
			}
		}

		// ワークスペース内移動用のドラッグ機能を有効化
		// ワークスペースアコーディオンが表示されている場合、ファイル、フォルダ、タグをドラッグ可能にする
		if (this.params.colDef.cellRendererParams && 
			this.params.colDef.cellRendererParams.hasOwnProperty('getParentData')) {
			// getParentDataを呼び出して、ワークスペースアコーディオンがアクティブかどうかを確認
			// nullが返される場合は検索アコーディオンなど、ワークスペース以外のアコーディオン
			try {
				const parentData = this.params.colDef.cellRendererParams.getParentData();
				// parentDataがnullでない場合、またはgetParentDataが存在する場合はワークスペース内移動が可能
				// （agInitの時点では親が選択されていない可能性があるため、getParentDataの存在のみでも有効化）
				const isDraggableItem = 
					this.params.data.isDocument === true || 
					this.params.data.isDocument === 'true' ||
					this.params.data.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER ||
					this.params.data.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG;
				
				if (isDraggableItem) {
					this.fileDraggable = true;
				}
			} catch (error) {
				// getParentDataの呼び出しでエラーが発生した場合は無視
				console.error('Error calling getParentData:', error);
			}
		}
		
		// Box連携用（ワークスペース内移動と併用可能）
		if (this.serverConfigService.boxIntegrationFlg && this.serverConfigService.boxUserIntegFlg) {
			const boxAreaState = this.documentSessionStorageService.getBoxAreaState();

			if (this.params.colDef.cellRendererParams &&
					this.params.colDef.cellRendererParams.hasOwnProperty('draggableToBoxArea') &&
					boxAreaState.isDisplayingBox &&
					(this.params.data.isDocument === true || this.params.data.isDocument === 'true')) {
				// Box連携用のドラッグも有効化（既にtrueの場合はそのまま）
				if (!this.fileDraggable) {
					this.fileDraggable = this.params.colDef.cellRendererParams.draggableToBoxArea;
				}
			}
		}

		// 有効期限切れの場合は黒表示とする
		if (params.data.hasOwnProperty('expiration') && (params.data.expiration === 'true' || params.data.expiration === true)) {
			this.expiration = true;
		}
	}

	/**
	 * リンククリックイベントハンドラ
	 * @param event イベント
	 * @param params パラメータ
	 */
	onClick(event, params) {
		// リンククリックイベントのバブリングを止める（選択行クリックでセルが編集状態になるため）
		event.preventDefault();
		event.stopPropagation();

		// メインの一覧のデータが文字のため
		let isDocument: boolean = params.data.isDocument;
		if (params.data.isDocument === 'true') {
			isDocument = true;
		} else if (params.data.isDocument === 'false') {
			isDocument = false;
		}
		if (isDocument) {
			if(this.serverConfigService.checkPreviewFileExt(params.data.objName)){
				this.objectNameRendererComponentService.openPreviewWindow(params.data);
			}else{
				this.fileService.downloadPrivateDocument(params.data.objId);
			}
			this.userService.sendReplyMail(params.data.objId);
		} else {
			//
			let nodeData: any = {};
			nodeData.objId = params.data.objId;
			if (params.data.isWorkflowFolder === 'true' || params.data.isWorkflowFolder === true) {
				nodeData.objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
			} else {
				nodeData.objTypeName = params.data.objTypeName;
			}

			if (params.data.hasOwnProperty('attrTreeId')) {
				nodeData.attrTreeId = params.data.attrTreeId
				nodeData.attrTreeValues = params.data.attrTreeValues
				nodeData.value = params.data.value
			}
			this.params.context.onNodeSelect.emit(nodeData);
		}
	}

	/**
	 * ドラッグ開始イベントハンドラ
	 * @param event イベント
	 */
	onDragStart(event: DragEvent) {
		// fileDraggableがfalseの場合は処理を中断
		if (!this.fileDraggable) {
			event.preventDefault();
			return;
		}

		try {
			if (!event.dataTransfer) {
				console.error('onDragStart: event.dataTransfer is null');
				event.preventDefault();
				return;
			}

			const context: EIMDataGridComponent = this.params.context;
			const selectedData = context.getSelectedData();
			const find = selectedData.find((sel) => sel === this.params.data);
			
			// ドラッグ可能なデータを取得（ファイル、フォルダ、タグ）
			const draggableData = (find ? selectedData : [this.params.data])
				.filter((data) => 
					data.isDocument === true || 
					data.isDocument === 'true' ||
					data.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER ||
					data.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_TAG
				);
			
			if (draggableData.length === 0) {
				event.preventDefault();
				return;
			}
			
			// Box連携用のドラッグデータ（ファイルのみ）
			const boxDraggableData = draggableData
				.filter((data) => data.isDocument === true || data.isDocument === 'true')
				.map((data) => ({
					objId: Number(data.objId),
					objName: String(data.objName),
					...(data.publicFileName !== undefined && {
						publicFileName: String(data.publicFileName),
					}),
					statusTypeKind: String(data.statusTypeKind),
					readOnly: String(data.readOnly),
					icon: this.getIcon(data),
				}));
			
			// ワークスペース内移動用のドラッグデータを準備
			// 現在選択されている親フォルダを取得
			let currentParent: any = null;
			try {
				if (this.params.colDef.cellRendererParams && 
					this.params.colDef.cellRendererParams.getParentData) {
					currentParent = this.params.colDef.cellRendererParams.getParentData();
					// 循環参照を避けるため、必要なプロパティのみを抽出
					if (currentParent) {
						currentParent = {
							objId: currentParent.objId,
							objName: currentParent.objName,
							objTypeName: currentParent.objTypeName
						};
					}
				}
			} catch (error) {
				console.error('onDragStart: Error getting parent data:', error);
				// 親データの取得に失敗してもドラッグは続行
			}
			
			// ワークスペース内移動用のドラッグデータを準備（循環参照を避けるため、必要なプロパティのみを抽出）
			const dragData = draggableData.length === 1 
				? {
					objId: draggableData[0].objId,
					objName: draggableData[0].objName,
					objTypeName: draggableData[0].objTypeName,
					isDocument: draggableData[0].isDocument,
					isDocumentLink: draggableData[0].isDocumentLink
				}
				: draggableData.map((data) => ({
					objId: data.objId,
					objName: data.objName,
					objTypeName: data.objTypeName,
					isDocument: data.isDocument,
					isDocumentLink: data.isDocumentLink
				}));
			
			const dragInfo = {
				data: dragData,
				parentData: currentParent,
				dragType: 'workspace-internal' // ワークスペース内移動を示す
			};
			
			event.dataTransfer.effectAllowed = 'move';
			
			// ワークスペース内移動用のデータを設定（カスタムMIMEタイプを使用）
			try {
				const jsonData = JSON.stringify(dragInfo);
				event.dataTransfer.setData('application/x-eim-workspace-drag', jsonData);
			} catch (error) {
				console.error('onDragStart: Error stringifying dragInfo:', error);
				event.preventDefault();
				return;
			}
			
			// Box連携用のデータも設定（既存機能との互換性のため）
			if (boxDraggableData.length > 0) {
				try {
					this.boxFileDragComponentService.dragStart(event, boxDraggableData);
				} catch (error) {
					console.error('onDragStart: Error in boxFileDragComponentService.dragStart:', error);
					// Box連携のエラーは無視して続行
				}
			}
			
			if (!find || selectedData.length !== draggableData.length) {
				context.select(draggableData);
			}
		} catch (error) {
			console.error('onDragStart: Unexpected error:', error);
			event.preventDefault();
		}
	}

	/**
	 * ドラッグ終了イベントハンドラ
	 * @param event イベント
	 */
	onDragEnd(event: DragEvent) {
		// fileDraggableがfalseの場合は処理を中断
		if (!this.fileDraggable) {
			return;
		}

		try {
			this.boxFileDragComponentService.dragEnd(event);
		} catch (error) {
			console.error('onDragEnd: Error in boxFileDragComponentService.dragEnd:', error);
		}
	}
}
