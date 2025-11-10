import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMRelationService } from 'app/admins/shared/services/apis/relation.service';
import { EIMRelationTypeDTO } from 'app/admins/shared/dtos/relation-type.dto';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';


/**
 * リレーションコンポーネント
 * @example
 *
 *      <eim-relation>
 *      </eim-relation>
 */
@Component({
    selector: 'eim-relation',
    templateUrl: './relation.component.html',
    styleUrls: ['./relation.component.css'],
	imports: [
		CommonModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe, 
		
		AngularSplitModule,
		PanelModule, 
	],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMRelationComponent) }
    ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})

export class EIMRelationComponent implements EIMAdminMainComponent, OnInit {

	/** リレーションデータグリッド */
	@ViewChild('relationDataGrid', { static: true })
	relationDataGrid: EIMDataGridComponent;

	/** 属性データグリッド */
	@ViewChild('attributeTypeDataGrid', { static: true })
	attributeTypeDataGrid: EIMDataGridComponent;

	/** スプリットエリア左部サイズ */
	public splitAreaLeftSize = 25;

	/** 画面識別ID */
	public viewId = 'Relation';


	/** リレーション登録 */
	relationCreateMenu: EIMMenuItem  = {label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', disabled: false, command: ($event) => {this.onClickCreateRelation()}};
	/** リレーション更新 */
	relationUpdateMenu: EIMMenuItem  = {label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: ($event) => {this.onClickUpdateRelation()}};
	/** リレーション削除 */
	relationDeleteMenu: EIMMenuItem  = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.onClickDeleteRelation()}};

	/** リレーションメニュー */
	public relationMenu: EIMMenuItem[] = [
		this.relationCreateMenu,
		this.relationUpdateMenu,
		this.relationDeleteMenu,
	];

	/** リレーションコンテキストメニュー */
	public relationContextMenu: EIMMenuItem[] = [
		this.relationUpdateMenu,
		this.relationDeleteMenu,
	];

	/** 属性選択 */
	attributeTypeSelectMenu: EIMMenuItem  = {label: this.translateService.instant('EIM.LABEL_03006'), icon: 'eim-icon-plus', disabled: true, command: ($event) => {this.onClickSelectAttributeType()}};
	/** 属性削除 */
	attributeTypeDeleteMenu: EIMMenuItem  = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.onClickDeleteAttributeType()}};

	/** 属性メニュー */
	public attributeTypeMenu: EIMMenuItem[] = [
		this.attributeTypeSelectMenu,
		this.attributeTypeDeleteMenu,
	];

	/** 属性コンテキストメニュー */
	public attributeTypeContextMenu: EIMMenuItem[] = [
		this.attributeTypeDeleteMenu,
	];

	/** 選択リレーションID */
	private selectedRelationId = 0;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected relationService: EIMRelationService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected attributeService: EIMAdminAttributeService,
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
		this.relationDataGrid.setState(state.relationDataGrid);
		this.relationCreateMenu.disabled = state.relationCreateMenuDisabled;
		this.relationUpdateMenu.disabled = state.relationUpdateMenuDisabled;
		this.relationDeleteMenu.disabled = state.relationDeleteMenuDisabled;

		this.attributeTypeDataGrid.setState(state.attributeTypeDataGrid);
		this.attributeTypeSelectMenu.disabled = state.attributeTypeSelectMenuDisabled;
		this.attributeTypeDeleteMenu.disabled = state.attributeTypeDeleteMenuDisabled;

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
			relationDataGrid: this.relationDataGrid.getState(),
			relationCreateMenuDisabled: this.relationCreateMenu.disabled,
			relationUpdateMenuDisabled: this.relationUpdateMenu.disabled,
			relationDeleteMenuDisabled: this.relationDeleteMenu.disabled,

			attributeTypeDataGrid: this.attributeTypeDataGrid.getState(),
			attributeTypeSelectMenuDisabled: this.attributeTypeSelectMenu.disabled,
			attributeTypeDeleteMenuDisabled: this.attributeTypeDeleteMenu.disabled,

			splitAreaLeftSize: this.splitAreaLeftSize,
		};
	}


	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 一致不一致
	 */
	public relationDataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// リレーション一覧項目
		let relationColumns: EIMDataGridColumn[] = [];
		// リレーション
		relationColumns.push({field: 'label', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02298'), width: 309, cellRendererFramework: EIMAdminNameRendererComponent});
		this.relationDataGrid.setColumns(relationColumns);
		this.relationDataGrid.showAllSelectButton = false;
		this.relationDataGrid.multiple = false;

		// 属性一覧項目
		let attributeTypeColumns: EIMDataGridColumn[] = [];
		// 名称＋アイコン
		attributeTypeColumns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02075'), width: 250, cellRendererFramework: EIMAdminNameRendererComponent});
		// データ型
		attributeTypeColumns.push({field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 85, cellRendererFramework: EIMDataGridColumnType.text});
		// 複数値
		attributeTypeColumns.push({field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 95, type: EIMDataGridColumnType.text});
		// デフォルト値
		attributeTypeColumns.push({field: 'defValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 130, cellRendererFramework: EIMDefaultListRendererComponent});
		this.attributeTypeDataGrid.setColumns(attributeTypeColumns);
	}

	/**
	 * リレーション選択時のイベントハンドラ
	 */
	onSelectedRelation(): void {
		// 選択したリレーション取得
		let selectedrelationData = this.relationDataGrid.getSelectedData();
		if (selectedrelationData.length === 0) {
			// 属性リストをクリアします．
			this.selectedRelationId = 0;
			this.attributeTypeDataGrid.setData([]);
		} else {
			// // 属性の設定
			this.selectAttributeTypeList(selectedrelationData[0].id);
		}
	// ボタンの活性制御処理
		this.setButtonEnable();
	}

	/**
	 * 属性選択時のイベントハンドラ
	 */
	onSelectedAttributeType(): void {
		// ボタンの活性制御処理
		this.setButtonEnable();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
		/**
	 * リレーション一覧を表示します.
	 * @param relationTypeId リレーションID
	 */
	private show(relationTypeId?: number): void {
		// リレーション一覧を取得します．
		this.relationService.getList().subscribe((relations: EIMRelationTypeDTO[]) => {
			this.relationDataGrid.setData(relations);
			if (relationTypeId) {
				this.relationDataGrid.select([{id: relationTypeId}], false);
				this.relationDataGrid.ensureIndexVisible(this.relationDataGrid.getRowIndex());
			}
			// ボタンの活性制御処理
			this.setButtonEnable();
		});
	}


	/**
	 * ボタンの活性制御処理
	 */
	private setButtonEnable(): void {
		// 選択したリレーション取得
		let selectedRelationList = this.relationDataGrid.getSelectedData();
		// データを取得出来て、選択がされていない場合
		if (selectedRelationList.length === 0) {
			this.relationUpdateMenu.disabled = true;
			this.relationDeleteMenu.disabled = true;
			this.attributeTypeSelectMenu.disabled = true;
		} else {
			this.relationUpdateMenu.disabled = false;
			this.relationDeleteMenu.disabled = false;
			this.attributeTypeSelectMenu.disabled = false;
		}

		// 選択した属性取得
		let selectedAttList = this.attributeTypeDataGrid.getSelectedData();
		// データを取得出来て、選択がされていない場合
		if (selectedAttList.length === 0) {
			this.attributeTypeDeleteMenu.disabled = true;
		} else {
			this.attributeTypeDeleteMenu.disabled = false;
		}
	}

	/**
	 * リレーション登録メニュー押下時のイベントハンドラ
	 */
	private onClickCreateRelation(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showRelationCreator({
			created: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.relationComplete(Number(data.attr.relationTypeId));
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02298')}));
			},
		});
	}

	/**
	 * リレーション更新メニュー押下時のイベントハンドラ
	 */
	private onClickUpdateRelation(): void {
		// 選択したリレーション取得
		let selectedDataList = this.relationDataGrid.getSelectedData();
		let dialogId: string = this.adminDialogManagerComponentService.showRelationUpdator(selectedDataList[0].id, {
			updated: (data) => {
				this.relationComplete(Number(data.attr.relationTypeId));
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02298')}));
			},
		});
	}

	/**
	 * リレーション削除メニュー押下時のイベントハンドラ
	 */
	private onClickDeleteRelation(): void {
		// 選択したリレーション取得
		let selectedDataList = this.relationDataGrid.getSelectedData();
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00006', {value: selectedDataList[0].label}), () => {
			this.relationService.delete(selectedDataList[0].id).subscribe((data: any) => {
				this.relationComplete();
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02298')}));
			});
		});
	}

	/**
	 * リレーション登録・更新・削除の完了後処理
	 * @param relationTypeId リレーションID
	 */
	private relationComplete(relationTypeId?: number): void {
		// リレーションリストを表示します．
		this.show(relationTypeId);
		// 属性リストをクリアします．
		this.attributeTypeDataGrid.setData([]);
	}

	/**
	 * 属性選択メニュー押下時のイベントハンドラです.
	 */
	private onClickSelectAttributeType(): void {
		// 選択したリレーション取得
		let selectedDataList = this.relationDataGrid.getSelectedData();
		let attributeTypeList: any[] = this.attributeTypeDataGrid.getData();
		let relationFlag = true;
		let dialogId: string = this.adminDialogManagerComponentService.showAttributeSelector(
			attributeTypeList, EIMAdminsConstantService.ADMIN_APP_ID_GENERAL, relationFlag, null, null, {
			selected: (data) => {
				let addData = [];
				let removeData = [];
				// 選択前のデータをmapに格納
				let beforeMap = new Map();
				for (let i = 0; i < attributeTypeList.length; i++) {
					beforeMap.set(attributeTypeList[i].attTypeId, attributeTypeList[i]);
				}
				// 選択後のデータをmapに格納
				let affterMap = new Map();
				for (let i = 0; i < data.length; i++) {
					affterMap.set(data[i].attTypeId, data[i]);
					// 選択前のデータに存在しない場合、追加データと判断
					let mapData = beforeMap.get(data[i].attTypeId);
					if (!mapData) {
						addData.push(data[i]);
					}
				}
				// 選択後データに存在しない場合、削除データと判断
				for (let i = 0; i < attributeTypeList.length; i++) {
					let mapData = affterMap.get(attributeTypeList[i].attTypeId);
					if (!mapData) {
						removeData.push(attributeTypeList[i]);
					}
				}
				if (0 < removeData.length) {
					this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00031'),
						() => {
							// 削除処理実行
							let deleteCount = 0;
							for (let i = 0; i < removeData.length; i++) {
								this.relationService.deleteAttributeType(selectedDataList[0].id, removeData[i].id).subscribe(() => {
									deleteCount++;
									// 処理完了後登録処理
									if (removeData.length !== deleteCount) {
										return;
									}
									if (0 < addData.length) {
										// 登録処理
										this.createAttributeTypeInSelect(dialogId, selectedDataList, addData);
									// 削除処理完了後登録する属性がない場合
									} else if (removeData.length === deleteCount) {
										// 属性の設定
										this.selectAttributeTypeList(selectedDataList[0].id);
										this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
										// 属性選択画面をクローズ
										this.adminDialogManagerComponentService.close(dialogId);
									}
								});
							}
						}
					);
					// 削除する属性がない場合
				} else if (0 < addData.length) {
						this.createAttributeTypeInSelect(dialogId, selectedDataList, addData);
				}
			}
		});
	}

	/**
	 * 属性削除メニュー押下時のイベントハンドラです.
	 */
	private onClickDeleteAttributeType(): void {
		// 選択したリレーション取得
		let selectedRelationList = this.relationDataGrid.getSelectedData();
		let selectedRelation = selectedRelationList[0];

		// 選択した属性取得
		let selectedAttList = this.attributeTypeDataGrid.getSelectedData();
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00030'), () => {
			for (let i = 0; i < selectedAttList.length; i++) {
				this.relationService.deleteAttributeType(selectedRelation.id, selectedAttList[i].id).subscribe((data: any) => {
					if (selectedAttList.length === i + 1) {
						// 属性の設定
						this.selectAttributeTypeList(selectedRelation.id);
					}
				});
			}
			this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
		});
	}

	/**
	 * 属性を取得します．
	 * @param relationTypeId リレーションID
	 */
	private selectAttributeTypeList(relationTypeId: number): void {
		this.selectedRelationId = relationTypeId;
		this.relationService.getAttributeTypeList(relationTypeId).subscribe(
			(attributeTypes: EIMAttributeTypeDTO[]) => {
				if (this.selectedRelationId === relationTypeId) {
					this.attributeTypeDataGrid.setData(attributeTypes);
					// ボタンの活性制御処理
					this.setButtonEnable();
				}
			}, (err: any) => {
				// エラーの場合
				// 属性リストをクリアします．
				this.selectedRelationId = 0;
				this.attributeTypeDataGrid.setData([]);
		});
	}

	/**
	 * 属性選択処理において登録処理を行います.
	 * @param dialogId ダイアログID
	 * @param selectedDatalist 選択データ一覧
	 * @param addData 追加データ
	 */
	private createAttributeTypeInSelect(dialogId, selectedDataList: any[], addData: any[]): void {
		for (let i = 0; i < addData.length; i++) {
			this.relationService.createAttributeType(selectedDataList[0].id, addData[i].attTypeId).subscribe(
				(createdData: any) => {
					// 登録処理完了後属性の設定
					if (addData.length === i + 1) {
						this.selectAttributeTypeList(selectedDataList[0].id);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
						// 属性選択画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
					}
				}
			);
		}
	}

}
