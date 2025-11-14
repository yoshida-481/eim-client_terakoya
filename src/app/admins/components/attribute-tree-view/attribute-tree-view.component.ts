import { Component, forwardRef, ViewChild, OnInit, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMCheckViewNoValuesRendererComponent } from 'app/admins/shared/components/renderer/check-viewnovalues-renderer.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttrTreeService } from 'app/admins/shared/services/apis/attributeTreeView.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAttrTreeDTO } from 'app/admins/shared/dtos/attrTree.dto';
import { EIMAttrTreeItemDTO } from 'app/admins/shared/dtos/attrTreeItem.dto';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { CommonModule } from '@angular/common';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
/**
 * 属性ツリービューコンポーネント
 * @example
 *      <eim-attribute-tree>
 *      </eim-attribute-tree>
 */

@Component({
	selector: 'eim-attribute-tree-view',
	templateUrl: './attribute-tree-view.component.html',
	styleUrls: ['./attribute-tree-view.component.css'],
	imports: [
		CommonModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		AngularSplitModule,
		PanelModule
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeTreeViewComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMAttributeTreeViewComponent implements EIMAdminMainComponent, OnInit {

	/** 属性ツリービューデータグリッド */
	@ViewChild('attributeTreeDataGrid', { static: true })
		attributeTreeDataGrid: EIMDataGridComponent;

	/** 属性階層データグリッド */
	@ViewChild('attributeDataGrid', { static: true })
		attributeDataGrid: EIMDataGridComponent;

	/** スプリットエリア左部サイズ */
	public splitAreaLeftSize = 25;

	/** 画面識別ID */
	public viewId = 'AttributeTree'

	/** 属性階層選択追加 */
	public attrSelectAdd = 'add';

	/** 属性階層選択移動 */
	public attrSelectMove = 'move';

	/** 属性階層選択削除 */
	public attrSelectDelete = 'delete';

	/** 属性階層選択更新 */
	public attrSelectUpdate = 'update';

	/** 属性ツリービュー登録 */
	attrTreeCreateMenu: EIMMenuItem  = {label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), disabled: false, icon: 'eim-icon-plus', command: ($event) => {this.onClickCreateAttribute()}};
	/** 属性ツリービュー更新 */
	attrTreeUpdateMenu: EIMMenuItem  = {label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickUpdateAttrTree()}};
	/** 属性ツリービュー削除 */
	attrTreeDeleteMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, icon: 'eim-icon-trash', command: ($event) => {this.onClickDeleteAttrTree()}};
	/** 属性ツリービューメニュー */
	public attrTreeMenu: EIMMenuItem[] = [
		this.attrTreeCreateMenu,
		this.attrTreeUpdateMenu,
		this.attrTreeDeleteMenu,
	];
	/** 属性ツリービューコンテキストメニュー */
	public attrTreeContextMenu: EIMMenuItem[] = [
		this.attrTreeUpdateMenu,
		this.attrTreeDeleteMenu,
	];

	/** 属性階層選択 */
	attrSelectMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03006'), disabled: true, icon: 'fa fa-check', command: ($event) => {this.onClickSelectAttr()}};
	/** 属性階層削除 */
	attrDeleteMenu: EIMMenuItem = {label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, icon: 'eim-icon-trash', command: ($event) => {this.onClickDeleteAttr()}};
	/** 属性階層詳細設定 */
	attrOptionMenu: EIMMenuItem = {label: this.translateService.instant('EIM_ADMINS.LABEL_03040'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickUpdateAttr()}};
	/** 属性階層並べ替え */
	attrSortMenu: EIMMenuItem = {label: this.translateService.instant('EIM_ADMINS.LABEL_03027'), disabled: true, icon: 'fa fa-sort', command: ($event) => {this.onClickSortAttr()}};
	/** 属性階層順序メニュー */
	public attrMenu: EIMMenuItem[] = [
		this.attrSelectMenu,
		this.attrDeleteMenu,
		this.attrOptionMenu,
		this.attrSortMenu,
	];
	/** 属性階層順序コンテキストメニュー */
	public attrContextMenu: EIMMenuItem[] = [
		this.attrDeleteMenu,
		this.attrOptionMenu,
	];

	/** 選択属性ツリーID */
	private selectedAttributeTreeId = 0;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected attrTreeService: EIMAttrTreeService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			this.show();
			return;
		}
		// 復元します
		this.attributeTreeDataGrid.setState(state.attributeTreeDataGrid);
		this.attrTreeCreateMenu.disabled = state.attrTreeCreateMenuDisabled;
		this.attrTreeUpdateMenu.disabled = state.attrTreeUpdateMenuDisabled;
		this.attrTreeDeleteMenu.disabled = state.attrTreeDeleteMenuDisabled;

		this.attributeDataGrid.setState(state.attributeDataGrid)
		this.attrSelectMenu.disabled = state.attrSelectMenuDisabled;
		this.attrDeleteMenu.disabled = state.attrDeleteMenuDisabled;
		this.attrOptionMenu.disabled = state.attrOptionMenuDisabled;
		this.attrSortMenu.disabled = state.attrSortMenu;

		window.setTimeout(() => {
			this.splitAreaLeftSize = state.splitAreaLeftSize;
		});
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			attributeTreeDataGrid: this.attributeTreeDataGrid.getState(),
			attributeDataGrid: this.attributeDataGrid.getState(),

			attrTreeCreateMenuDisabled: this.attrTreeCreateMenu.disabled,
			attrTreeUpdateMenuDisabled: this.attrTreeUpdateMenu.disabled,
			attrTreeDeleteMenuDisabled: this.attrTreeDeleteMenu.disabled,
			attrSelectMenuDisabled: this.attrSelectMenu.disabled,
			attrDeleteMenuDisabled: this.attrDeleteMenu.disabled,
			attrOptionMenuDisabled: this.attrOptionMenu.disabled,
			attrSortMenuDisabled: this.attrSortMenu.disabled,

			splitAreaLeftSize: this.splitAreaLeftSize,
		};
	}

	/**
	 * 属性ツリービュー用デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 一致不一致
	 */
	public attrTreeEquals(obj1: any, obj2: any): boolean {
		return (obj1.attrTreeId === obj2.attrTreeId);
	}

	/**
	 * 属性階層順序一覧用デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 一致不一致
	 */
	public attrEquals(obj1: any, obj2: any): boolean {
		return (obj1.attTypeId === obj2.attTypeId);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 属性ツリービュー選択時のイベントハンドラ
	 */
	onSelectedAttributeTree(): void {
		let selectedrAttributeTreeData = this.attributeTreeDataGrid.getSelectedData();
		this.attrSelectMenu.disabled = true;
		this.attrSortMenu.disabled = true;
		if (selectedrAttributeTreeData.length === 0) {
				// 属性階層順序一覧のクリア
				this.attrTreeMenuDisableCheck();
				this.attrMenuDisableCheck();
				this.selectedAttributeTreeId = 0;
				this.attributeDataGrid.setData([]);
		// 属性階層一覧取得
		} else if (selectedrAttributeTreeData.length === 1) {
			this.selectAttrList(selectedrAttributeTreeData[0].attrTreeId);
		}
	}

	/**
	 * 属性階層選択時のイベントハンドラ
	 */
	onSelectedAttribute() {
		this.attrMenuDisableCheck();
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columnsAttrTreet: EIMDataGridColumn[] = [];
		// 属性ツリービュー一覧項目
		columnsAttrTreet.push({field: 'attrTreeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02068'), width: 309});
		this.attributeTreeDataGrid.setColumns(columnsAttrTreet);
		this.attributeTreeDataGrid.showAllSelectButton = false;
		this.attributeTreeDataGrid.multiple = false;

		// 属性階層一覧項目
		let columnsAttr: EIMDataGridColumn[] = [];
		// 属性名
		columnsAttr.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02071'), width: 400, suppressFilter: true, suppressSorting: true});
		// ｢属性値なし｣も表示
		columnsAttr.push({field: 'viewNoValuesFlag', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02072'), width: 150, cellRendererFramework: EIMCheckViewNoValuesRendererComponent, suppressFilter: true, suppressSorting: true});

		this.attributeDataGrid.setColumns(columnsAttr);
		this.attributeDataGrid.showAllSelectButton = false;
		this.attributeDataGrid.multiple = false;

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します
	 * @param attrTreeId 属性ツリービューID
	 */
	private show(attrTreeId?: number): void {
		// 属性ツリービュー一覧を取得します.
		this.attrTreeService.getList().subscribe((attrTrees: EIMAttrTreeDTO[]) => {
			this.attributeTreeDataGrid.setData(attrTrees);
			// 属性ツリーに紐づく属性を取得します.
			if (attrTreeId) {
				this.attributeTreeDataGrid.select([{attrTreeId: attrTreeId}], false);
				this.attributeTreeDataGrid.ensureIndexVisible(this.attributeTreeDataGrid.getRowIndex());
			}
		});
	}

	/**
	 * 属性ツリービュー登録メニュー押下時のイベントハンドラ
	 */
	private onClickCreateAttribute(): void {
		this.adminDialogManagerComponentService.showAttributeTreeCreator({
			created: (data) => {
				this.attrComplete(data);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02068')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogName.ATTRIBUTE_TREE_VIEW_CREATOR);
			}
});
	}

	/**
	 * 属性ツリービュー更新メニュー押下時のイベントハンドラ
	 */
	private onClickUpdateAttrTree(): void {
		let selectedData = this.attributeTreeDataGrid.getSelectedData();
		this.adminDialogManagerComponentService.showAttributeTreeUpdator(selectedData[0].attrTreeId, {
			updated: (data) => {
				this.adminDialogManagerComponentService.close(dialogName.ATTRIBUTE_TREE_VIEW_UPDATOR);
				this.attrComplete(data);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02068')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogName.ATTRIBUTE_TREE_VIEW_CREATOR);
			}

		});
	}

	/**
	 * 属性ツリービュー削除メニュー押下時のイベントハンドラ
	 */
	private onClickDeleteAttrTree(): void {
		// 選択した属性取得
		let selectedData = this.attributeTreeDataGrid.getSelectedData();
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00007' , {value: selectedData[0].attrTreeName}) ,
			() => {
				this.attrTreeService.delete(selectedData[0].attrTreeId).subscribe((data: any) => {
					this.attrComplete();
					// 属性階層のクリアを行う
					this.attributeDataGrid.setData([]);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02068')}));
				});
			}
		);
	}


	/**
	 * 属性階層選択メニュー押下時のイベントハンドラ
	 */
	private onClickSelectAttr(): void {
		let attrTreeFlag = true;
		let dialogId: string = this.adminDialogManagerComponentService.showAttributeSelector(
			this.attributeDataGrid.getData(), EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT, null, attrTreeFlag, null, {
			selected: (attributeList) => {

				let operationData = [];
				let attrTypeIdData = [];
				let viewNoValuesFlagData = [];
				let attrTreeId = this.attributeTreeDataGrid.getSelectedData()[0].attrTreeId;
				let gridData = this.attributeDataGrid.getData();
				let gridDataMap = new Map();
				let selectedDataMap = new Map();

				// 更新前の一覧情報をmapに格納
				for (let i = 0; i < gridData.length; i++) {
					// 更新前のインデックスを保持しておく
					gridData[i].index = i;
					gridDataMap.set(gridData[i].attTypeId, gridData[i]);
				}

				// 追加・移動データ検出のため、選択された属性分ループ
				for (let i = 0; i < attributeList.length; i++) {
					// 選択された属性をmapに格納
					selectedDataMap.set(attributeList[i].attTypeId, attributeList[i]);

					attrTypeIdData.push(attributeList[i].attTypeId);
					let mapData = gridDataMap.get(attributeList[i].attTypeId);
					// 更新前の一覧から取得できない場合
					if (!mapData) {
						// 新規データとみなす
						operationData.push(this.attrSelectAdd);
						viewNoValuesFlagData.push(true);
					} else {
						// 更新前の一覧から変更がない場合(データのインデックスで判断)
						if (mapData.index === i) {
							operationData.push('');
						} else {
							operationData.push(this.attrSelectMove);
						}
						viewNoValuesFlagData.push(mapData.viewNoValuesFlag);
					}
				}

				let deleteExist = false;
				// 削除データ検出のため、更新前の一覧分ループ
				for (let i = 0; i < gridData.length; i++) {
					let mapData = selectedDataMap.get(gridData[i].attTypeId);
					// 選択された属性に存在しない場合
					if (!mapData) {
						deleteExist = true;
						attrTypeIdData.push(gridData[i].attTypeId);
						operationData.push(this.attrSelectDelete);
						viewNoValuesFlagData.push(gridData[i].viewNoValuesFlag);
					}
				}

				// パラメータをカンマ区切りに変換
				let attrTypeIdList = attrTypeIdData.join(EIMConstantService.DELIMITER_COMMA);
				let operationList = operationData.join(EIMConstantService.DELIMITER_COMMA);
				let viewNoValuesFlagList = viewNoValuesFlagData.join(EIMConstantService.DELIMITER_COMMA);

				// 削除データがある場合、確認ダイアログを表示
				if (deleteExist) {
					this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00031'), () => {
						// 更新処理実行
						this.attrTreeService.updateItemList(attrTreeId, attrTypeIdList, operationList, viewNoValuesFlagList).subscribe(
							(data: any) => {
								// 属性選択画面をクローズ
								this.adminDialogManagerComponentService.close(dialogId);
								this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02069')}));
								this.selectAttrList(attrTreeId);
							},
						);
					});
				} else {
					// 更新処理実行
					this.attrTreeService.updateItemList(attrTreeId, attrTypeIdList, operationList, viewNoValuesFlagList).subscribe(
						(data: any) => {
							// 属性選択画面をクローズ
							this.adminDialogManagerComponentService.close(dialogId);
							this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02069')}));
							this.selectAttrList(attrTreeId);
						},
					);
				}
			},
		});
	}

	/**
	 * 属性階層削除メニュー押下時のイベントハンドラ
	 */
	private onClickDeleteAttr(): void {
		// 選択した属性取得
		let selectedDataList = this.attributeDataGrid.getSelectedData();

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00013' , {value: selectedDataList[0].attTypeName}) ,
			() => {
				let operationData = [];
				let attrTypeIdData = [];
				let viewNoValuesFlagData = [];
				let attrTreeId = this.attributeTreeDataGrid.getSelectedData()[0].attrTreeId;

				// 更新前の一覧分ループ
				let gridData = this.attributeDataGrid.getData();
				for (let i = 0; i < gridData.length ; i++) {
					attrTypeIdData.push(gridData[i].attTypeId);
					// 削除対象かチェック
					if (gridData[i].attTypeId === selectedDataList[0].attTypeId) {
						operationData.push(this.attrSelectDelete);
					} else {
						operationData.push('');
					}
					viewNoValuesFlagData.push(gridData[i].viewNoValuesFlag);
				}

				// パラメータをカンマ区切りに変換
				let attrTypeIdList = attrTypeIdData.join(EIMConstantService.DELIMITER_COMMA);
				let operationList = operationData.join(EIMConstantService.DELIMITER_COMMA);
				let viewNoValuesFlagList = viewNoValuesFlagData.join(EIMConstantService.DELIMITER_COMMA);

				this.attrTreeService.updateItemList(attrTreeId, attrTypeIdList, operationList, viewNoValuesFlagList).subscribe(
					(data: any) => {
						this.selectAttrList(attrTreeId);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02069')}));
					},
				);
		});
	}

	/**
	 * 属性階層詳細設定メニュー押下時のイベントハンドラ
	 */
	private onClickUpdateAttr(): void {
		let selectedDataList = this.attributeDataGrid.getSelectedData();

		this.adminDialogManagerComponentService.showAttrbuteTreeViewAttributeUpdator(selectedDataList[0].attTypeId, selectedDataList[0].viewNoValuesFlag, {
			updated: () => {
				let operationData = [];
				let attrTypeIdData = [];
				let viewNoValuesFlagData = [];
				let attrTreeId = this.attributeTreeDataGrid.getSelectedData()[0].attrTreeId;

				// 更新前の一覧分ループ
				let gridData = this.attributeDataGrid.getData();
				for (let i = 0; i < gridData.length ; i++) {
					attrTypeIdData.push(gridData[i].attTypeId);
					// 更新対象かチェック
					if (gridData[i].attTypeId === selectedDataList[0].attTypeId) {
						operationData.push(this.attrSelectUpdate);
						viewNoValuesFlagData.push(!gridData[i].viewNoValuesFlag);
					} else {
						operationData.push('');
						viewNoValuesFlagData.push(gridData[i].viewNoValuesFlag);
					}
				}
				// パラメータをカンマ区切りに変換
				let attrTypeIdList = attrTypeIdData.join(EIMConstantService.DELIMITER_COMMA);
				let operationList = operationData.join(EIMConstantService.DELIMITER_COMMA);
				let viewNoValuesFlagList = viewNoValuesFlagData.join(EIMConstantService.DELIMITER_COMMA);

				this.attrTreeService.updateItemList(attrTreeId, attrTypeIdList, operationList, viewNoValuesFlagList).subscribe(
					(data: any) => {
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02069')}));
						this.selectAttrList(attrTreeId, selectedDataList[0].attTypeId);
						this.adminDialogManagerComponentService.close(dialogName.ATTRIBUTE_TREE_VIEW_ATTRIBUTE_UPDATOR);
					}
				);
			}
		});
	}

	/**
	 * 属性階層並べ替えメニュー押下時のイベントハンドラ
	 */
	private onClickSortAttr(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showAttrbuteTreeViewAttributeSortUpdator(this.attributeDataGrid.getData(), {
			updated: (sortData) => {
				let operationData = [];
				let attrTypeIdData = [];
				let viewNoValuesFlagData = [];
				let attrTreeId = this.attributeTreeDataGrid.getSelectedData()[0].attrTreeId;

				let gridData = this.attributeDataGrid.getData();
				// 並び替え後のリスト分ループ
				for (let i = 0; i < sortData.length; i++) {
					attrTypeIdData.push(sortData[i].attTypeId);
					viewNoValuesFlagData.push(sortData[i].viewNoValuesFlag);
					if (sortData[i].attTypeId === gridData[i].attTypeId) {
						operationData.push('');
					} else {
						operationData.push(this.attrSelectMove);
					}
				}
				// パラメータをカンマ区切りに変換
				let attrTypeIdList = attrTypeIdData.join(EIMConstantService.DELIMITER_COMMA);
				let operationList = operationData.join(EIMConstantService.DELIMITER_COMMA);
				let viewNoValuesFlagList = viewNoValuesFlagData.join(EIMConstantService.DELIMITER_COMMA);

				this.attrTreeService.updateItemList(attrTreeId, attrTypeIdList, operationList, viewNoValuesFlagList).subscribe(
					(data: any) => {
						this.adminDialogManagerComponentService.close(dialogName.ATTRIBUTE_TREE_VIEW_ATTRIBUTE_UPDATOR);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02069')}));
						this.selectAttrList(attrTreeId);
					}
				);
				// 登録完了後処理
				this.onSelectedAttributeTree();
			}
		});
	}

	/**
	 * 属性ツリービュー登録・更新・削除の完了後処理
	 * @param attrTreeId 属性ツリービューID
	 */
	private attrComplete(attrTreeId?: number): void {
		// 属性ツリービュー一覧取得
		this.show(attrTreeId);
		// 属性階層順序一覧をクリア
		this.attributeTreeDataGrid.setData([]);
		if (attrTreeId) {
			this.selectAttrList(attrTreeId);
		}
	}

	/**
	 * 属性階層順序一覧を取得します.
	 * @param attrTreeId 属性ツリービューID
	 * @param attTypeId 属性ID
	 */
	private selectAttrList(attrTreeId: number, attTypeId?: number): void {
		this.selectedAttributeTreeId = attrTreeId;
		this.attrTreeService.getAttrTreeItemList(attrTreeId).subscribe((attrTreeItems: EIMAttrTreeItemDTO[]) => {
			if (this.selectedAttributeTreeId === attrTreeId) {
				this.attributeDataGrid.setData(attrTreeItems);
				if (attTypeId) {
					this.attributeDataGrid.select([{attTypeId: attTypeId}], false);
					this.attributeDataGrid.ensureIndexVisible(this.attributeDataGrid.getRowIndex());
				}
				this.attrMenuDisableCheck();
				this.attrTreeMenuDisableCheck();
			}
		}, (err: any) => {
			// 属性階層順序一覧をクリア
			this.selectedAttributeTreeId = 0;
			this.attributeDataGrid.setData([]);
			this.attrMenuDisableCheck();
		});
	}

	/** 属性ツリービュー一覧のメニュー活性チェックをします. */
	private attrTreeMenuDisableCheck () {
		let selectedData = this.attributeTreeDataGrid.getSelectedData();

		if (selectedData.length === 0) {
			this.attrTreeUpdateMenu.disabled = true;
			this.attrTreeDeleteMenu.disabled = true;
			this.attrSelectMenu.disabled = true;
		} else {
			this.attrTreeUpdateMenu.disabled = false;
			this.attrTreeDeleteMenu.disabled = false;
			this.attrSelectMenu.disabled = false;
		}
	}

	/** 属性階層一覧のメニュー活性チェックをします. */
	private attrMenuDisableCheck () {
		let gridData = this.attributeDataGrid.getData();
		let selectedData = this.attributeDataGrid.getSelectedData();
		if (selectedData.length === 0) {
			this.attrDeleteMenu.disabled = true;
			this.attrOptionMenu.disabled = true;
		} else {
			this.attrDeleteMenu.disabled = false;
			this.attrOptionMenu.disabled = false;
		}
		// 並び替え
		if (1 < gridData.length) {
			this.attrSortMenu.disabled = false;
		} else {
			this.attrSortMenu.disabled = true;
		}
	}
}
