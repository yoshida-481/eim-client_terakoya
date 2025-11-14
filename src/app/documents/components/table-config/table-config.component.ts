import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output, HostListener, OnDestroy, ElementRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';

import { EIMComponent, EIMApplicable } from 'app/shared/shared.interface';
import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMMenuItem } from 'app/shared/shared.interface';
import { EIMSelectorClearRendererComponent } from 'app/documents/shared/components/renderer/selector-clear-renderer.component';
import { EIMSelectorClearRendererComponentService } from 'app/documents/shared/components/renderer/selector-clear-renderer.component.service';
import { EIMContentsTableService } from 'app/documents/shared/services/contents-table.service';

import { EIMTableService, EIMTable, EIMTableItem } from 'app/documents/shared/services/apis/table.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTextEditorRendererComponent } from 'app/documents/shared/components/renderer/text-editor-renderer.component';

/**
 * テーブル管理コンポーネント
 * @example
 *
 * 		<eim-table-config>
 * 		</eim-table-config>
 */
@Component({
    selector: 'eim-table-config',
    templateUrl: './table-config.component.html',
    styleUrls: ['./table-config.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMTableConfigComponent) }],
    standalone: false
})
export class EIMTableConfigComponent implements OnInit, EIMApplicable, OnDestroy {

	/** テーブルリストデータグリッド */
	@ViewChild('tableListGrid', { static: true }) tableListGrid: EIMDataGridComponent;
	/** 属性タイプリストデータグリッド */
	@ViewChild('attributeTypeListGrid', { static: true }) attributeTypeListGrid: EIMDataGridComponent;

	/** 属性タイプ適用処理完了のイベントエミッタ */
	@Output() applied: EventEmitter<any> = new EventEmitter<any>();
	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();
	/** 画面を閉じるのイベントエミッタ */
	@Output() closed: EventEmitter<null> = new EventEmitter<null>();
	/** テーブル更新イベントエミッタ */
	@Output() public updateTableComplete: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** メニュー定義 */
	private menuCreate: EIMMenuItem = {label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03025'), icon: 'fa fa-plus', command: (event) => {this.onClickCreate(event); }};
	private menuEdit: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03004'), icon: 'fa fa-pencil-square-o', disabled: true, command: (event) => {this.onClickEdit(event); }};
	private menuDelete: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'fa fa-trash-o', disabled: true, command: (event) => {this.onClickDelete(event); }};
	private menuAttributeTypeApply: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: true, command: (event) => {this.onClickAttributeTypeApply(event); }};

	/** テーブル一覧のメニュー */
	public tableMenuItems: MenuItem[] = [this.menuCreate, this.menuEdit, this.menuDelete];
	/** テーブル一覧のコンテキストメニュー */
	public tableContextMenuItems: EIMMenuItem[] = [this.menuEdit, this.menuDelete];
	/** 属性タイプ一覧のメニュー */
	public attrMenuItems: MenuItem[] = [this.menuAttributeTypeApply];
	/** 属性タイプ一覧のコンテキストメニュー */
	public attrContextMenuItems: EIMMenuItem[] = [this.menuAttributeTypeApply];

	/** 選択テーブル */
	private selectedTable: EIMTable = {};
	/** 選択属性タイプリスト */
	private selectedAttrTypes: any[] = [];

	/** 改名前テーブル名 */
	private preTableName: string;

	/** 改名前対象テーブル行番号 */
	private preTableRowIndex = -1;

	/** deletedイベントのサブスクリプション. */
	private subscriptionDeleted: any;

	/** セル編集可能かどうか */
	private isCellEditable = false;

	/** セル編集中かどうか */
	private isCellEditing = false;

	/**s
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 * @param tableService テーブルサービス
	 * @param selectorClearRendererComponentService クリアボタンレンダラー
	 * @param dialogManagerComponentService ダイアログマネージャーコンポーネントサービス
	 * @param messageService メッセージサービス
	 */
	constructor(
		private translateService: TranslateService,
		private tableService: EIMTableService,
		private selectorClearRendererComponentService: EIMSelectorClearRendererComponentService,
		private dialogManagerComponentService: EIMDialogManagerComponentService,
		private messageService: EIMMessageService,
		private contentsTableService: EIMContentsTableService,
		private element: ElementRef
	) {
		this.subscriptionDeleted = selectorClearRendererComponentService.deleted.subscribe((id: number) => {this.deleteAttrType(id); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	public show(): void {
		this.tableService.getList()
			.subscribe(
					(object: any) => {
						this.tableListGrid.setData(object);
					},
					(err) => {
						// 初期表示時にエラーが発生した場合、ポップアップ画面クローズ
						this.errored.emit();
					}
			);
	}

	/**
	 * 適用ボタン押下時の処理を実施します.
	 * ワークスペース、またはフォルダに選択したセキュリティを適用します.
	 */
	public apply(): void {

		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00002'),
			() => {
				let attTypeIds: number[] = [];
				let attTypes: any[] = this.attributeTypeListGrid.getData();
				for (let i = 0; i < attTypes.length; i++) {
					attTypeIds.push(attTypes[i].attTypeId);
				}
				// 属性タイプ割当
				this.tableService.applyAttributeTypeToTable(this.tableListGrid.getSelectedData()[0].tableId, attTypeIds)
					.subscribe(
						(object: any) => {
							// メッセージを表示
							this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00005'));
							this.selectedAttrTypes = [];
							for (let i = 0; i < this.attributeTypeListGrid.getData().length; i++) {
								this.selectedAttrTypes.push( Object.assign({}, this.attributeTypeListGrid.getData()[i]));
							}
							// テーブル更新通知を予約
		  				this.contentsTableService.isReservingUpdate = true;
						},
					);
			}
		);

	}

	/**
	 * 閉じるボタン押下時の処理を実施します.
	 * 属性タイプの編集内容が未適用の場合、確認ダイアログを表示します.
	 * @param event イベント
	 * @param close クローズイベント
	 */
	public close(event: any, close: EventEmitter<null>): void {

		if (this.isDiffAttrTypes(this.selectedAttrTypes, this.attributeTypeListGrid.getData())) {
			// 属性選択後、未適用の場合
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00003'),
				() => {
					close.emit();
				}
			);
		} else {
			close.emit();
		}
	}


	/**
	 * 適用ボタン押下可否を返却します.
	 */
	public applicable(): boolean {
		try {
			if (this.isDiffAttrTypes(this.selectedAttrTypes, this.attributeTypeListGrid.getData())) {
				// 属性選択後、未適用の場合
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}

	/**
	 * データグリッド操作ボタンの押下可否を制御します.
	 */
	public gridButtonControl(): void {
		this.editable();
		this.deletable();
		this.attributeSelectable();
	}


	/**
	 * 編集ボタンの押下可否を制御します.
	 */
	public editable(): void {

		if (this.tableListGrid.getSelectedData().length == 1) {
			this.tableMenuItems[1].disabled = false;
		} else {
			this.tableMenuItems[1].disabled = true;
		}
	}

	/**
	 * 削除ボタンの押下可否を制御します.
	 */
	public deletable(): void {

		if (this.tableListGrid.getSelectedData().length == 1) {
			this.tableMenuItems[2].disabled = false;
		} else {
			this.tableMenuItems[2].disabled = true;
		}
	}

	/**
	 * 属性選択ボタンの押下可否を制御します.
	 */
	public attributeSelectable(): void {

		if (this.tableListGrid.getSelectedData().length == 1) {
			this.attrMenuItems[0].disabled = false;
		} else {
			this.attrMenuItems[0].disabled = true;
		}
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// テーブルリストデータグリッド同一行判定関数
		this.tableListGrid.equals = (obj1: any, obj2: any) => {
			return (obj1.tableId == obj2.tableId);
		}
		this.attributeTypeListGrid.equals = (obj1: any, obj2: any) => {
			return (obj1.attTypeId == obj2.attTypeId);
		}

		let columns: EIMDataGridColumn[] = null;

		columns = [];
		columns.push({field: 'tableName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'),
			width: 325, headerClass: 'eim-editable-column-header',
			cellEditorFramework: EIMTextEditorRendererComponent,
			editable: (params) => {return this.isCellEditable === true}, suppressFilter: true});
		this.tableListGrid.setColumns(columns);

		columns = [];
		columns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 285,
			cellRendererFramework: EIMSelectorClearRendererComponent, suppressSorting: true, suppressFilter: true});
		this.attributeTypeListGrid.setColumns(columns);

		// 画面表示処理
		this.show();
	}

	/**
	 * コンポーネント破棄前のイベントハンドラです.
	 */
	ngOnDestroy(): void {
		this.subscriptionDeleted.unsubscribe();
	}

	/**
	 * テーブル選択イベントハンドラです.
	 * テーブルに割当てられた属性タイプ一覧を表示します.
	 * @param event イベント
	 */
	onSelectTable(event: any[]): void {

		if (this.tableListGrid.getSelectedData().length == 0
				|| this.selectedTable.tableId == this.tableListGrid.getSelectedData()[0].tableId) {
				// 属性タイプ一覧をクリア
				this.attributeTypeListGrid.setData([]);
				// データグリッド操作ボタンの活性制御
				this.gridButtonControl();
				// 前回選択アイテム初期化
				this.selectedTable = {};
				this.selectedAttrTypes = [];
				return;
		}
		// 属性選択後、未適用の場合
		if (this.isDiffAttrTypes(this.selectedAttrTypes, this.attributeTypeListGrid.getData())) {

			// 確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00003'),
				() => {
					// テーブル選択処理
					this.selectTable();
				},
				() => {
					// テーブル選択状態を戻す
					let preSelectedRowIndex: number;
					let preSelectedTableId: number = this.selectedTable.tableId;
					this.tableListGrid.info.gridApi.forEachNode(
							function (node) {
								if (node.data.tableId == preSelectedTableId) {
									preSelectedRowIndex = node.rowIndex;
								}
							}
					);
					const rowNode = this.tableListGrid.info.gridApi.getDisplayedRowAtIndex(preSelectedRowIndex);
					if (rowNode) {
						rowNode.setSelected(true);
					}
				}
			);

		} else {

			// テーブル選択処理
			this.selectTable();
		}
	}

	/**
	 * データグリッドメニューの登録ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickCreate(event: any): void {
		let dialogId: string = this.dialogManagerComponentService.showTableCreator(
	  		{
	  			created: (data) => {
	  				// テーブル登録画面をクローズ
	  				this.dialogManagerComponentService.close(dialogId);
	  				// テーブル一覧に追加
	  				this.tableListGrid.addRowData(data);
	  				// 追加したテーブルにフォーカスオン
	  				this.tableListGrid.select(this.tableListGrid.getData(), false);
	  				// テーブル更新通知を予約
	  				this.contentsTableService.isReservingUpdate = true;
	  			}
	  		}
	  	);
	}

	/**
	 * データグリッドメニューの編集ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickEdit(event: any): void {

		this.isCellEditable = true;
		this.tableListGrid.info.gridApi.setFocusedCell(0, 'tableName');
		this.tableListGrid.info.gridApi.startEditingCell(
				{
					rowIndex: this.tableListGrid.getRowIndex(),
					colKey: 'tableName'
				}
		);
	}

	/**
	 * データグリッドメニューの削除ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDelete(event: any): void {

		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00004'),
			() => {
				// テーブル削除
				this.tableService.delete(this.tableListGrid.getSelectedData()[0].tableId)
					.subscribe(
						(object: any) => {
							// メッセージを表示
							this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00006'));
							// テーブル一覧から除去
							this.tableListGrid.removeRowData(this.tableListGrid.getSelectedData());
							// 属性タイプ一覧をクリア
							this.attributeTypeListGrid.setData([]);
							// データグリッド操作ボタンの活性制御
							this.gridButtonControl();
							// 前回選択アイテム初期化
							this.selectedTable = {};
							this.selectedAttrTypes = [];
		  				// テーブル更新通知を予約
		  				this.contentsTableService.isReservingUpdate = true;
						},
					);
			}
		);
	}

	/**
	 * データグリッドメニューの属性割当ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickAttributeTypeApply(event: any): void {
		let dialogId: string = this.dialogManagerComponentService.showAttributeTypeSelector(this.attributeTypeListGrid.getData(),
	  		{
					selected: (data) => {
	  				// 属性選択画面をクローズ
	  				this.dialogManagerComponentService.close(dialogId);
	  				// 属性一覧に設定
	  				this.attributeTypeListGrid.setData(data);
	  			}
	  		}
	  	);
	}

	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickUp(event: any): void {

		let moveCnt = 0;
		let moveAttrTypes: any[] = [];

		for (let i = 0; i < this.attributeTypeListGrid.getData().length; i++) {

			for (let j = 0; j < this.attributeTypeListGrid.getSelectedData().length; j++) {

				if (this.attributeTypeListGrid.getData()[i].attTypeId == this.attributeTypeListGrid.getSelectedData()[j].attTypeId) {

					// 選択アイテムのインデックス取得
					let rowNum: number = this.getAttrTypeRowNum(this.attributeTypeListGrid.getSelectedData()[j].attTypeId);
					if (rowNum > moveCnt) {
						// 1つ上の行へ移動
						let moveAttrType = this.moveAttrType(this.attributeTypeListGrid.getData()[i].attTypeId, true);
						moveAttrTypes.push(moveAttrType);
					}
					moveCnt++;
				}
			}
		}

		// 移動行を選択
		this.selectedAttrType(moveAttrTypes);
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event: any): void {

		let rowCnt: number = this.attributeTypeListGrid.getData().length - 1;
		let moveCnt = 0;
		let moveAttrTypes: any[] = [];

		for (let i = this.attributeTypeListGrid.getData().length - 1; i > -1; i--) {

			for (let j = 0; j < this.attributeTypeListGrid.getSelectedData().length; j++) {

				if (this.attributeTypeListGrid.getData()[i].attTypeId == this.attributeTypeListGrid.getSelectedData()[j].attTypeId) {

					// 選択アイテムのインデックス取得
					let rowNum: number = this.getAttrTypeRowNum(this.attributeTypeListGrid.getSelectedData()[j].attTypeId);
					if (rowNum < rowCnt - moveCnt) {
						// 1つ下の行へ移動
						let moveAttrType = this.moveAttrType(this.attributeTypeListGrid.getData()[i].attTypeId, false);
						moveAttrTypes.push(moveAttrType);
					}
					moveCnt++;
				}
			}
		}

		// 移動行を選択
		this.selectedAttrType(moveAttrTypes);
	}

	/**
	 * キーダウンイベントハンドラ.
	 * @param event イベント
	 */
	@HostListener('document:keydown', ['$event'])
	public handleKeyboardEvent(event: KeyboardEvent): void {

		// セル編集中はスキップ
		if (this.isCellEditing) {
			return;
		}

		const selectedData = this.tableListGrid.getSelectedData();
		if (event.key == 'F2' && selectedData.length == 1) {
			this.isCellEditable = true;
			let rowIndex: number = this.tableListGrid.getRowIndex();
			this.tableListGrid.info.gridApi.setFocusedCell(0, 'tableName');
			this.tableListGrid.info.gridApi.startEditingCell({rowIndex: rowIndex, colKey: 'tableName'});
		}
	}

	/**
	 * 選択行のセルクリックイベントハンドラ
	 * @param event イベント
	 */
	public onSelectedRowCellClicked(event: any): void {
		if (!this.isCellEditing && event.colDef.field == 'tableName') {
		
			this.isCellEditable = true;

			this.tableListGrid.info.gridApi.setFocusedCell(0, 'tableName');
			this.tableListGrid.info.gridApi.startEditingCell({rowIndex: event.rowIndex, colKey: 'tableName'});

		}
	}

	/**
	 * グリッドセル編集開始イベントハンドラ.
	 * @param event イベント
	 */
	public onCellEditingStarted(event?: any): void {

		// セル編集中フラグをON
		this.isCellEditing = true;

		// 改名前の名前を保持
		this.preTableName = event.data.tableName;
		this.preTableRowIndex = event.rowIndex;
	}

	/**
	 * データグリッドセル直接編集完了イベントハンドラです.
	 * @param event イベント
	 */
	public onCellEditingStopped(event: any): void {

		// セル編集中フラグをOFF
		this.isCellEditing = false;
		this.isCellEditable = false;

		// 元のテーブル名称に戻す
		let revertBeforeRename: () => void = () => {
			let table: EIMTable = this.tableListGrid.getDataByRowIndex(this.preTableRowIndex);

			table.tableName = this.preTableName;
			this.tableListGrid.updateRowData([table]);
			this.preTableName = null;
			this.preTableRowIndex = -1;
		};

		// 名前が空の場合
		if (event.data.tableName == '') {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_DOCUMENTS.ERROR_00012'));
			// 元のテーブル名称に戻す
			revertBeforeRename();
			return;
		}

		if (this.preTableName == event.data.tableName) {
			// 名前が変更されていない場合
			return;
		}

		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00005'),
			() => {
				// テーブル更新
				this.tableService.update(event.data.tableId, event.data.tableName)
					.subscribe(
						(objects: EIMTable[]) => {
							// メッセージを表示
							this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00007'));
							// オブジェクト差替え
							this.tableListGrid.updateRowData(objects);
							// データグリッド操作ボタンの活性制御
							this.gridButtonControl();
		  				// テーブル更新通知を予約
		  				this.contentsTableService.isReservingUpdate = true;
						},
						(err) => {
							// 元のテーブル名称に戻す
							revertBeforeRename();
						}
					);
			},
			() => {
				// 元のテーブル名称に戻す
				revertBeforeRename();
			}
		);
	}

	/**
	 * テーブルを選択します.
	 */
	private selectTable() {

		// 選択データ
		let selectedData: EIMTable[] = this.tableListGrid.getSelectedData();
		if (selectedData.length == 0) {
			return;
		}
		// 属性タイプリスト取得
		this.tableService.getTableItemList(selectedData[0].tableId, null)
			.subscribe(
				(object: any) => {
					// 属性タイプリストに設定
					this.attributeTypeListGrid.setData(object);

					// 前回選択アイテムとして保持 ※テーブル選択変更時のチェック処理でのみ使用
					this.selectedTable = Object.assign({}, this.tableListGrid.getSelectedData()[0]);
					this.selectedAttrTypes = [];
					for (let i = 0; i < this.attributeTypeListGrid.getData().length; i++) {
						this.selectedAttrTypes.push( Object.assign({}, this.attributeTypeListGrid.getData()[i]));
				}
			},
			(err) => {
				// 属性タイプ一覧をクリア
				this.attributeTypeListGrid.setData([]);
				// データグリッド操作ボタンの活性制御
				this.gridButtonControl();
				// 前回選択アイテム初期化
				this.selectedTable = {};
				this.selectedAttrTypes = [];
			}
		);

		// データグリッド操作ボタンの活性制御
		this.gridButtonControl();
		// テーブル一覧データグリッドセル直接編集完了
		this.tableListGrid.info.gridApi.stopEditing();
	}

	/**
	 * 属性タイプを削除します.
	 * @param id 属性タイプId
	 */
	deleteAttrType(id: number): void {
		// 属性タイプ一覧から除去
		for (let i = 0; i < this.attributeTypeListGrid.getData().length; i++) {
			if (this.attributeTypeListGrid.getData()[i].attTypeId == id) {
				let target: any[] = [];
				target.push(this.attributeTypeListGrid.getData()[i]);
				this.attributeTypeListGrid.removeRowData(target);
				return;
			}
		}
	}

	/**
	 * 属性タイプを追加します.
	 * @param attrType 属性タイプ
	 * @param index インデックス
	 */
	insertAttrType(attrType: any, index: number): void {
		let target: any[] = [];
		target.push(attrType);
		this.attributeTypeListGrid.addRowDataToIndex(target, index);
	}


	/**
	 * 属性タイプを移動します.
	 * @param id 属性タイプId
 	 * @param isUp 上へ移動の場合、true
 	 * @return 属性タイプ
	 */
	moveAttrType(id: number, isUp: boolean): any {

		for (let i = 0; i < this.attributeTypeListGrid.getData().length; i++) {
			if (this.attributeTypeListGrid.getData()[i].attTypeId == id) {

				// 移動対象属性タイプ情報を保持
				let rowNum: number = this.getAttrTypeRowNum(id);
				let target: any = Object.assign({}, this.attributeTypeListGrid.getData()[i]);

				// 削除
				this.deleteAttrType(id);
				// 追加
				if (isUp) {
					this.insertAttrType(target, rowNum - 1);
				} else {
					this.insertAttrType(target, rowNum + 1);
				}
				return target;
			}
		}
		return null;
	}

	/**
	 * 属性タイプを選択します.
	 * @param attrTypes 属性タイプリスト
	 */
	selectedAttrType(attrTypes: any[]): void {

		this.attributeTypeListGrid.info.gridApi.forEachNode(
			function(node) {
				for (let i = 0; i < attrTypes.length; i++) {
					if (node.data.attTypeId == attrTypes[i].attTypeId) {
						node.setSelected(true);
					}
				}
			}
		);

		this.attributeTypeListGrid.info.selectedData = attrTypes;
	}


	/**
	 * 属性タイプリストの行番号を取得します.
	 * @param id 属性タイプId
	 */
	getAttrTypeRowNum(id: number): number {
		for (let i = 0; i < this.attributeTypeListGrid.getData().length; i++) {
			if (this.attributeTypeListGrid.getData()[i].attTypeId == id) {
				return i;
			}
		}
	}

	/**
	 * リストが異なるか判定します.
	 * @param 属性タイプリスト
	 * @param 属性タイプリスト
	 */
	private isDiffAttrTypes(attrTypes1: any[], attrTypes2: any[]): boolean {

		// 要素数が異なる場合、true
		if (attrTypes1.length != attrTypes2.length) {
			return true;
		}

		let attrTypeIds1: number[] = [];
		for (let i = 0; i < attrTypes1.length; i++) {
			attrTypeIds1.push(Number(attrTypes1[i].attTypeId));
		}
// attrTypeIds1.sort();

		let attrTypeIds2: number[] = [];
		for (let i = 0; i < attrTypes2.length; i++) {
			attrTypeIds2.push(Number(attrTypes2[i].attTypeId));
		}
// attrTypeIds2.sort();

		for (let i = 0; i < attrTypeIds1.length; i++) {
			// idが異なる場合、true
			if (attrTypeIds1[i] != attrTypeIds2[i]) {
				return true;
			}
		}
		return false;
	}
}
