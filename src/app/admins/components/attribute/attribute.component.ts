import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMCodeTypeService } from 'app/admins/shared/services/apis/codeType.service';
import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { MenuItem } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';

import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMCodeService } from 'app/admins/shared/services/apis/code.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMAttributeTypeNameRendererComponent } from 'app/admins/shared/components/renderer/attribute-type-name-renderer.component';
import { EIMDisabledNameRendererComponent } from 'app/admins/shared/components/renderer/disabled-name-renderer.component';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { AngularSplitModule } from 'angular-split';
import { InputTextModule } from 'primeng/inputtext';

/** タブインデックス */
export namespace tabIndexConst {
	export const TAB_INDEX_ATTRIBUTE = 0;
	export const TAB_INDEX_CODE = 1;
}

/**
 * 操作履歴コンポーネント
 * @example
 *
 *      <eim-attribute>
 *      </eim-attribute>
 */
@Component({
	selector: 'eim-attribute',
	templateUrl: './attribute.component.html',
	styleUrls: ['./attribute.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		ButtonDirective,
		TabsModule,

		AngularSplitModule,
		PanelModule,
		InputTextModule
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMAttributeComponent implements EIMAdminMainComponent, OnInit {

	/** 属性データグリッド */
	@ViewChild('attributeDataGrid', { static: true })
	attributeDataGrid: EIMDataGridComponent;

	/** コードタイプデータグリッド */
	@ViewChild('codeTypeDataGrid', { static: true })
	codeTypeDataGrid: EIMDataGridComponent;

	/** コードデータグリッド */
	@ViewChild('codeDataGrid', { static: true })
	codeDataGrid: EIMDataGridComponent;

	/** 画面識別ID */
	public viewId = 'Attribute'

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 属性メニュー：登録 */
	createAttributeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), disabled: true, icon: 'eim-icon-plus', command: ($event) => {this.onClickAttributeCreator();
	}};
	/** 属性メニュー：更新 */
	updateAttributeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickAttributeUpdator();
	}};
	/** 属性メニュー：削除 */
	deleteAttributeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, icon: 'eim-icon-trash', command: ($event) => {this.onClickAttributeDeletor();
	}};

	/** 属性データグリッドのボタンメニュー */
	public attributeMenuItems: MenuItem[] = [
		this.createAttributeMenuItem, this.updateAttributeMenuItem, this.deleteAttributeMenuItem
	];

	/** 属性データグリッドの右クリックメニュー */
	public attributeContext: MenuItem[] = [
		this.updateAttributeMenuItem, this.deleteAttributeMenuItem
	];

	/** コードタイプメニュー：登録 */
	createCodeTypeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', command: ($event) => {this.onClickCodeTypeCreator();
	}};
	/** コードタイプメニュー：更新 */
	updateCodeTypeMenuItem: MenuItem = {label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickCodeTypeUpdator(); }};
	/** コードタイプメニュー：流用作成 */
	copyCodeTypeMenuItem: MenuItem = {label: this.translateService.instant('EIM_ADMINS.LABEL_03046'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickCodeTypeCopy(); }};
	/** コードタイプメニュー：更新&複写 */
	updateAndCopyCodeTypeMenuItem: MenuItem = {label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', items: [
		this.updateCodeTypeMenuItem, this.copyCodeTypeMenuItem
	]};
	/** コードタイプメニュー：削除 */
	deleteCodeTypeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, icon: 'eim-icon-trash', command: ($event) => {this.onClickCodeTypeDeletor();
	}};

	/** コードタイプデータグリッドのボタンメニュー */
	public codeTypeMenuItems: MenuItem[] = [
		this.createCodeTypeMenuItem,
		this.updateAndCopyCodeTypeMenuItem,
		this.deleteCodeTypeMenuItem
	];

	/** コードタイプデータグリッドの右クリックメニュー */
	public codeTypeContext: MenuItem[] = [
		this.updateCodeTypeMenuItem, this.copyCodeTypeMenuItem, this.deleteCodeTypeMenuItem
	];

	/** コードメニュー：登録 */
	createCodeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), disabled: true, icon: 'eim-icon-plus', command: ($event) => {this.onClickCodeCreator();
	}};
	/** コードメニュー：編集 */
	updateCodeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickCodeUpdator(); }
	};
	/** コードメニュー：並べ替え */
	sortCodeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03027'), icon: 'eim-icon-pencil', disabled: true, command: ($event) => {this.onClickCodeSort(); }
	};
	/** コードメニュー：編集&並べ替え */
	updateAndSortCodeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', items: [
		this.updateCodeMenuItem, this.sortCodeMenuItem,
	]};
	/** コードメニュー：削除 */
	deleteCodeMenuItem: MenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, icon: 'eim-icon-trash', command: ($event) => {this.onClickCodeDeletor(); }
	};
	/** コードデータグリッドのボタンメニュー */
	public codeMenuItems: MenuItem[] = [
		this.createCodeMenuItem, this.updateAndSortCodeMenuItem, this.deleteCodeMenuItem,
	];

	/** コードデータグリッドの右クリックメニュー */
	public codeContext: MenuItem[] = [
		this.updateCodeMenuItem, this.deleteCodeMenuItem
	];

	/** 検索条件 */
	public attributeName = '';

	/** 選択タブ */
	public tabIndex = signal(tabIndexConst.TAB_INDEX_ATTRIBUTE);

	/** 選択コードタイプID */
	private selectedCodeTypeId = 0;

	/** コードタイプ初期検索完了フラグ */
	private codeTypeGotFlag = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected messageService: EIMMessageService,
			protected adminAttributeService: EIMAdminAttributeService,
			protected codeService: EIMCodeService,
			protected codeTypeService: EIMCodeTypeService,
			protected translateService: TranslateService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			return;
		}
		// 復元します
		this.attributeName = state.attributeName;
		this.attributeDataGrid.setState(state.attributeDataGrid);
		this.codeTypeDataGrid.setState(state.codeTypeDataGrid);
		this.codeDataGrid.setState(state.codeDataGrid);
		this.codeTypeGotFlag = state.codeTypeGotFlag;
		this.tabIndex.set(state.attributeTabIndex);
		window.setTimeout(() => {
			this.enableButtonSelectedAttribute();
			this.enableButtonSelectedCodeType();
			this.enableButtonSelectedCode();
			this.enableButtonCodeSort();
		});
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			attributeName: this.attributeName,
			attributeDataGrid: this.attributeDataGrid.getState(),
			codeTypeDataGrid: this.codeTypeDataGrid.getState(),
			codeDataGrid: this.codeDataGrid.getState(),
			codeTypeGotFlag: this.codeTypeGotFlag,
			attributeTabIndex: this.tabIndex(),
		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.createAttributeMenuItem.disabled = false;
		let columns: EIMDataGridColumn[] = [];
		// 定義名称
		columns.push({field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 310});
		// 名前
		columns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 310, cellRendererFramework: EIMAttributeTypeNameRendererComponent});
		// データ型
		columns.push({field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 200});
		// 複数値
		columns.push({field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 95});
		// コードタイプ
		columns.push({field: 'codeTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02007'), width: 200});
		// デフォルト値
		columns.push({field: 'defValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 200, cellRendererFramework: EIMDefaultListRendererComponent});
		this.attributeDataGrid.setColumns(columns);

		let codeTypeColumns: EIMDataGridColumn[] = [];
		// 名前
		codeTypeColumns.push({field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 645});
		this.codeTypeDataGrid.setColumns(codeTypeColumns);

		let codeColumns: EIMDataGridColumn[] = [];
		// コード
		codeColumns.push({field: 'code', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02119'), width: 200,
			cellRendererFramework: EIMDisabledNameRendererComponent, suppressSorting: true, suppressFilter: true});
		// 名前
		codeColumns.push({field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 350,
			cellRendererFramework: EIMDisabledNameRendererComponent, suppressSorting: true, suppressFilter: true});
		this.codeDataGrid.setColumns(codeColumns);
	}

	/**
	 * 検索ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onSearch(event: any): void {
		let keyword: string;
		this.attributeDataGrid.setData([]);
		if (this.attributeName && this.attributeName.length > 0) {
			keyword = '*' + this.attributeName + '*';
		} else {
			keyword = '*';
		}
		this.adminAttributeService.getListByName(keyword)
			.subscribe((secObject: EIMAttributeTypeDTO[]) => {
				this.attributeDataGrid.setData(secObject);
				this.enableButtonSelectedAttribute();
			}
		);
	}

	/**
	 * 属性選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectAttribute(event: any): void {
		this.enableButtonSelectedAttribute();
	}

	/**
	 * コードタイプ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectCodeType(event?: any): void {
		let selectedCodeType = this.codeTypeDataGrid.getSelectedData();
		this.enableButtonSelectedCodeType();
		if (selectedCodeType.length === 0) {
			this.codeDataGrid.setData([]);
			this.enableButtonSelectedCode();
			this.selectedCodeTypeId = 0;
		} else {
			this.showCodeList(selectedCodeType[0].id);
		}
	}

	/**
	 * コード選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectCode(event: any): void {
		this.enableButtonSelectedCode();
	}

	/**
	 * タブ変更のイベントハンドラです.
	 * @param event イベント
	 */
	onChangeTab(event: any): void {
		this.tabIndex.set(event);

		if (event === tabIndexConst.TAB_INDEX_CODE && !this.codeTypeGotFlag) {
			// コードタブ初回選択時に検索を行う
			this.showCodeTypeList();
		}
	}

	/**
	 * 属性登録メニュー押下時のイベントハンドラ
	 * 属性登録ダイアログを表示します.
	 */
	onClickAttributeCreator(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showAttributeCreator({
			created: (attributeList: EIMAttributeTypeDTO[]) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.attributeDataGrid.addRowData(attributeList);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * 属性更新メニュー押下時のイベントハンドラ
	 * 属性更新ダイアログを表示します.
	 */
	onClickAttributeUpdator(): void {
		this.adminAttributeService.getAttributeType(this.attributeDataGrid.getSelectedData()[0].attTypeId).subscribe(
			(data: EIMAdminAttributeTypeDomain) => {
				let dialogId: string = this.adminDialogManagerComponentService.showAttributeUpdator(data, {
					updated: (attributeList: EIMAttributeTypeDTO[]) => {
						this.adminDialogManagerComponentService.close(dialogId);
						this.attributeDataGrid.updateRowData(attributeList);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
					},
					errored: () => {
						this.adminDialogManagerComponentService.close(dialogId);
					}
				});
			}
		);
	}

	/**
	 * 属性削除メニュー押下時のイベントハンドラ
	 * 対象の属性を削除します.
	 */
	onClickAttributeDeletor(): void {
		// 選択した属性取得
		let selectedDataList = this.attributeDataGrid.getSelectedData();
		let selectedData = selectedDataList[0];

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00013' , {value: selectedData.attTypeName}) ,
			() => {
				this.adminAttributeService.delete(selectedData.attTypeId).subscribe(
					(data: number) => {
						this.attributeDataGrid.removeRowData(selectedDataList);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
					}
				);
			}
		);
	}

	/**
	 * コードタイプ登録メニュー押下時のイベントハンドラ
	 * コードタイプ登録ダイアログを表示します.
	 */
	onClickCodeTypeCreator(): void {
		let dialogId = this.adminDialogManagerComponentService.showCodeTypeCreator({
			created: (createdIds: number[]) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.showCodeTypeList(createdIds[0]);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02007')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * コードタイプ更新ボタン（更新）押下時のイベントハンドラ
	 * コードタイプ更新ダイアログを表示します.
	 */
	onClickCodeTypeUpdator(): void {
		let selectedDataList = this.codeTypeDataGrid.getSelectedData();
		let dialogId = this.adminDialogManagerComponentService.showCodeTypeUpdator(selectedDataList[0].id, {
			updated: (createdIds: number[]) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.showCodeTypeList(createdIds[0]);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02007')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * コードタイプ更新ボタン（複写）押下時のイベントハンドラ
	 * コードタイプ流用登録ダイアログを表示します.
	 */
	onClickCodeTypeCopy(): void {
		let selectedDataList = this.codeTypeDataGrid.getSelectedData();
		let dialogId = this.adminDialogManagerComponentService.showCodeTypeCopy(selectedDataList[0].id, {
			created: (createdIds: number[]) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.showCodeTypeList(createdIds[0]);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02007')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * コードタイプ削除メニュー押下時のイベントハンドラ
	 * 対象のコードタイプを削除します.
	 */
	onClickCodeTypeDeletor(): void {
		// 選択したコードタイプ取得
		let selectedData = this.codeTypeDataGrid.getSelectedData()[0];
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00017' , {value: selectedData.definitionName}) ,
			() => {
				this.codeTypeService.delete(new EIMCodeTypeDomain(selectedData)).subscribe(
					(data: number) => {
						this.showCodeTypeList();
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02007')}));
					}
				);
		});
	}


	/**
	 * コード登録メニュー押下時のイベントハンドラ
	 * コード登録ダイアログを表示します.
	 */
	onClickCodeCreator(): void {
		this.adminDialogManagerComponentService.showCodeCreator(new EIMCodeTypeDomain(this.codeTypeDataGrid.getSelectedData()[0]), {
			created: (codeIds: number[]) => {
				this.showCodeList(this.codeTypeDataGrid.getSelectedData()[0].id, codeIds[0]);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02119')}));
			}
		});
	}

	/**
	 * コード更新ボタン（更新）押下時のイベントハンドラ
	 * コード更新ダイアログを表示します.
	 */
	onClickCodeUpdator(): void {
		let selectedDataList = this.codeDataGrid.getSelectedData();
		let dialogId: string = this.adminDialogManagerComponentService.showCodeUpdator(selectedDataList[0].id, {
			updated: (codeIds: number[]) => {
				this.showCodeList(this.codeTypeDataGrid.getSelectedData()[0].id, codeIds[0]);
				this.adminDialogManagerComponentService.close(dialogId);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02119')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * コード更新ボタン（並べ替え）押下時のイベントハンドラ
	 * コード並べ替えダイアログを表示します.
	 */
	onClickCodeSort(): void {
		let selectedDataList = this.codeTypeDataGrid.getSelectedData();
		let dialogId: string = this.adminDialogManagerComponentService.showCodeSort(selectedDataList[0], {
			updated: () => {
				this.showCodeList(this.codeTypeDataGrid.getSelectedData()[0].id);
				this.adminDialogManagerComponentService.close(dialogId);
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * コード削除メニュー押下時のイベントハンドラ
	 * 対象のコードを削除します.
	 */
	onClickCodeDeletor(): void {
		// 選択した属性取得
		let selectedDataList = this.codeDataGrid.getSelectedData();
		let selectedData = selectedDataList[0];

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00018' , {value: selectedData.code}) ,
			() => {
				this.codeService.delete(new EIMCodeDomain(selectedData)).subscribe(
					(data: number) => {
						this.onSelectCodeType();
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02119')}));
					}
				);
		});
	}

	/**
	 * 属性データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsAttribute(obj1: any, obj2: any): boolean {
		return (obj1.attTypeId === obj2.attTypeId);
	}

	/**
	 * コードタブ内データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsCode(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * コードタイプを取得し表示します.
	 * @param targetId 選択対象ID
	 */
	private showCodeTypeList(targetId?: number): void {
		this.codeTypeService.getList({}).subscribe(
			(object: EIMCodeTypeDomain[]) => {
				this.codeTypeGotFlag = true;
				this.codeTypeDataGrid.setData(object);
				if (!targetId) {
					this.onSelectCodeType();
					return;
				}
				this.codeTypeDataGrid.select([{id: targetId}]);
			}
		);
	}

	/**
	 * コードを取得し表示します.
	 * @param codeTypeId 選択対象コードタイプID
	 * @param codeId 選択対象コードID
	 */
	private showCodeList(codeTypeId: number, codeId?: number): void {
		this.selectedCodeTypeId = codeTypeId;
		this.codeService.getList(codeTypeId)
			.subscribe((object: EIMCodeDomain[]) => {
				if (this.codeTypeDataGrid.getSelectedData().length === 0 || this.selectedCodeTypeId !== codeTypeId) {
					// 選択対象の不整合の場合何もしない
					return;
				}
				this.codeTypeDataGrid.getSelectedData()[0].codeList = object;
				this.codeDataGrid.setData(object);
				this.enableButtonCodeSort();
				if (codeId) {
					// コード登録等の処理の場合、対象コードを自動的に選択
					this.codeDataGrid.select([{id: codeId}]);
				} else {
					this.enableButtonSelectedCode();
				}
			}, (err: any) => {
				this.codeDataGrid.setData([]);
				this.enableButtonCodeSort();
				this.enableButtonSelectedCode();
			});
	}

	/**
	 * 属性選択時のボタン活性制御
	 */
	protected enableButtonSelectedAttribute(): void {
		let selectedAttribute = this.attributeDataGrid.getSelectedData();
		if (selectedAttribute.length === 0) {
			this.updateAttributeMenuItem.disabled = true;
			this.deleteAttributeMenuItem.disabled = true;
		} else {
			this.updateAttributeMenuItem.disabled = false;
			this.deleteAttributeMenuItem.disabled = false;
		}
	}

	/**
	 * コードタイプ選択時のボタン活性制御
	 */
	public enableButtonSelectedCodeType(): void {
		let selectedCodeType = this.codeTypeDataGrid.getSelectedData();
		let codeTypeEmpty = selectedCodeType.length === 0;
		this.updateCodeTypeMenuItem.disabled = codeTypeEmpty;
		this.copyCodeTypeMenuItem.disabled = codeTypeEmpty;
		this.updateAndCopyCodeTypeMenuItem.disabled = codeTypeEmpty;
		this.deleteCodeTypeMenuItem.disabled = codeTypeEmpty;
		this.createCodeMenuItem.disabled = codeTypeEmpty;
		if (codeTypeEmpty) {
			this.sortCodeMenuItem.disabled = codeTypeEmpty;
		}
	}

	/**
	 * コード選択時のボタン活性制御
	 */
	private enableButtonSelectedCode(): void {
		let selectedCode = this.codeDataGrid.getSelectedData();
		if (selectedCode.length === 0) {
			this.updateCodeMenuItem.disabled = true;
			this.deleteCodeMenuItem.disabled = true;
		} else {
			this.updateCodeMenuItem.disabled = false;
			this.updateAndSortCodeMenuItem.disabled = false;
			this.deleteCodeMenuItem.disabled = false;
		}
		this.updateAndSortCodeMenuItem.disabled = this.sortCodeMenuItem.disabled && this.updateCodeMenuItem.disabled;
	}

	/**
	 * コード並べ替えに関するボタン活性制御
	 */
	private enableButtonCodeSort(): void {
		let existCode = this.codeDataGrid.getData();
		this.sortCodeMenuItem.disabled = existCode.length < 2;
		this.updateAndSortCodeMenuItem.disabled = this.sortCodeMenuItem.disabled && this.updateCodeMenuItem.disabled;
	}

}
