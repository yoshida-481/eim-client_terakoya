import { EIMSplitStateService } from 'app/shared/services/split-state.service';
import { EIMDefaultListRendererComponent } from 'app/admins/shared/components/renderer/default-list-renderer.component';
import { EIMAttributeTypeNameRendererComponent } from 'app/admins/shared/components/renderer/attribute-type-name-renderer.component';

import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMListValueDTO } from 'app/admins/shared/dtos/list-value.dto';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeValueListRendererComponent } from 'app/admins/shared/components/renderer/attribute-list-value-renderer.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminAttributeTypeDomain } from 'app/admins/shared/domains/attribute-type.domain';
import { EIMDataTypeDomain } from 'app/admins/shared/domains/dataType.domain';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';

/**
 * 属性管理コンポーネント
 * @example
 *
 *      <eim-document-attribute>
 *      </eim-document-attribute>
 */
@Component({
	selector: 'eim-document-attribute',
	templateUrl: './document-attribute.component.html',
	styleUrls: ['./document-attribute.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		ButtonDirective,

		AngularSplitModule,
		PanelModule,
		InputTextModule
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentAttributeComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMDocumentAttributeComponent implements EIMAdminMainComponent, OnInit {

	/** 属性データグリッド */
	@ViewChild('attributeDataGrid', { static: true }) attributeDataGrid: EIMDataGridComponent;

	/** 値リスト定義データグリッド */
	@ViewChild('valueListDataGrid', { static: true }) valueListDataGrid: EIMDataGridComponent;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 画面識別ID */
	public viewId = 'Attribute'

	/** データ型一覧 */
	public dataTypeList: EIMDataTypeDomain[];

	/** 検索条件 */
	public attributeName = '';

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** スプリットエリア左部サイズ */
	public splitSetting = {
		splitLeft: {size: 75}
	}

	/** 属性メニュー：登録 */
	createAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), disabled: true, icon: 'eim-icon-plus', command: ($event) => {this.onClickAttributeCreator();
	}};
	/** 属性メニュー：更新 */
	updateAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickAttributeUpdator();
	}};

	/** 属性メニュー：削除 */
	deleteAttributeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, icon: 'eim-icon-trash', command: ($event) => {this.onClickDocumentAttributeDeletor();
	}};
	/** 属性のボタンメニュー */
	public attributeMenuItems: EIMMenuItem[] = [
		this.createAttributeMenuItem,
		this.updateAttributeMenuItem,
		this.deleteAttributeMenuItem,
	];
	/** 属性のコンテキストメニュー */
	public attributeContext: EIMMenuItem[] = [
		this.updateAttributeMenuItem,
		this.deleteAttributeMenuItem,
	];

	/** 値リストメニュー：登録 */
	createValueListMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), disabled: true, icon: 'eim-icon-plus', command: ($event) => {this.onClickCustomValueListCreator();
	}};
	/** 値リストメニュー：更新 */
	updateValueListMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickCustomValueListUpdator();
	}};
	/** 値リストメニュー：並べ替え */
	sortValueListMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM_ADMINS.LABEL_03027'), disabled: true, icon: 'eim-icon-pencil', command: ($event) => {this.onClickValueListSort();
	}};

	/** コードメニュー：更新&並べ替え */
	updateAndSortCodeMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil', items: [
		this.updateValueListMenuItem, this.sortValueListMenuItem,
	]};

	/** 値リストメニュー：削除 */
	deleteValueListMenuItem: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, icon: 'eim-icon-trash', command: ($event) => {this.onClickCustomValueListDeletor();
	}};
	/** 値リストのボタンメニュー */
	public valueListMenuItems: EIMMenuItem[] = [
		this.createValueListMenuItem,
		this.updateAndSortCodeMenuItem,
		this.deleteValueListMenuItem,
	];
	/** 値リストのコンテキストメニュー */
	public valueListContext: EIMMenuItem[] = [
		this.updateValueListMenuItem,
		this.deleteValueListMenuItem,
	];

	/** 選択属性タイプID */
	private selectedAttributeTypeId = 0;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected adminAttributeService: EIMAdminAttributeService,
		protected translateService: TranslateService,
		protected splitStateService: EIMSplitStateService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {

	}

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
		this.attributeName = state.attributeName;
		this.attributeDataGrid.setState(state.attributeDataGrid);
		this.valueListDataGrid.setState(state.valueListDataGrid);
		this.splitStateService.setState(state.split, this.splitSetting);
		if (state.dataTypeList) {
			this.dataTypeList = state.dataTypeList;
			this.createAttributeMenuItem.disabled = false;
		} else {
			this.show();
		}
		window.setTimeout(() => {
			this.enableButtonAttribute();
			this.enableButtonListValue();
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
			valueListDataGrid: this.valueListDataGrid.getState(),
			dataTypeList: this.dataTypeList,
			split: this.splitStateService.getState(this.splitSetting)
		};
	}

	/**
	 * 画面を表示します
	 */
	public show(): void {
		// 各データ型に紐づくUIコントロール一覧を取得
		if (!this.dataTypeList) {
			this.adminAttributeService.getUIControlList()
			.subscribe((object: EIMDataTypeDomain[]) => {
				this.createAttributeMenuItem.disabled = false;
				this.dataTypeList = object;
			});
		}
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
	 * リスト値データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsListValue(obj1: any, obj2: any): boolean {
		return (obj1.value === obj2.value);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		let columns: EIMDataGridColumn[] = [];
		// 名称
		columns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 330,
			cellRendererFramework: EIMAttributeTypeNameRendererComponent } );
		// データ型
		columns.push({field: 'valTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02005'), width: 125});
		// 入力規則
		columns.push({field: 'inputRuleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02256'), width: 100});
		// 複数値
		columns.push({field: 'isMultipleValue', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02006'), width: 100});
		// UIコントロール
		columns.push({field: 'uiControlName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02243'), width: 130});
		// 初期値
		columns.push({field: 'initValueList', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02008'), width: 200,
			cellRendererFramework: EIMDefaultListRendererComponent});
		this.attributeDataGrid.setColumns(columns);
		let listValueColumns: EIMDataGridColumn[] = [];
		// 定義値
		listValueColumns.push({field: 'value', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02257'), cellStyle: 'color',
			cellRendererFramework: EIMAttributeValueListRendererComponent, width: 400, suppressSorting: true, suppressFilter: true});
		this.valueListDataGrid.setColumns(listValueColumns);
	}


	/**
	 * 属性登録メニュー押下時のイベントハンドラ
	 * 属性登録ダイアログを表示します.
	 */
	onClickAttributeCreator(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showDocumentAttributeCreator(this.dataTypeList, {
			created: (attributeList: EIMAttributeTypeDTO[]) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.attributeDataGrid.addRowData(attributeList);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
			}
		});
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
				this.enableButtonAttribute();
			});
	}

	/**
	 * 属性更新メニュー押下時のイベントハンドラ
	 * 属性更新ダイアログを表示します.
	 */
	onClickAttributeUpdator(): void {
		this.adminAttributeService.getAttributeType(this.attributeDataGrid.getSelectedData()[0].attTypeId).subscribe(
			(data: EIMAdminAttributeTypeDomain) => {
				let dialogId: string = this.adminDialogManagerComponentService.showDocumentAttributeUpdator(this.dataTypeList, data, {
					updated: (attributeList: EIMAttributeTypeDTO[]) => {
						this.adminDialogManagerComponentService.close(dialogId);
						this.attributeDataGrid.updateRowData(attributeList);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
						this.onSelectedDocumentAttribute();
					},
					errored: () => {
						this.adminDialogManagerComponentService.close(dialogId);
					}
				});
			});
	}

	/**
	 * 属性削除メニュー押下時のイベントハンドラ
	 */
	onClickDocumentAttributeDeletor(): void {
		// 選択した属性取得
		let selectedDataList = this.attributeDataGrid.getSelectedData();
		if (selectedDataList.length === 0) {
			return;
		}
		let selectedData = selectedDataList[0];
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00013' , {value: selectedData.attTypeName}) ,
			() => {
				this.adminAttributeService.delete(selectedData.attTypeId).subscribe(
					(data: any) => {
						this.attributeDataGrid.removeRowData(selectedDataList);
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02070')}));
					}
				);
		});
	}

	/**
	 * 属性選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectedDocumentAttribute(event?: any): void {
		this.enableButtonAttribute();
		let attributeList: EIMAttributeTypeDTO[] = this.attributeDataGrid.getSelectedData();

		// 入力規則がリスト定義の属性が選択されたとき、リスト値を取得
		if (attributeList.length === 0) {
			// 未選択時
			this.selectedAttributeTypeId = 0;
			this.valueListDataGrid.setData([]);
			this.enableButtonListValue();
		} else if (attributeList[0].inputRuleFlag) {
			// リスト定義ありの属性選択時
			this.selectAttrList(attributeList[0].attTypeId);
		} else {
			// リスト定義なしの属性選択時
			this.selectedAttributeTypeId = attributeList[0].attTypeId;
			this.valueListDataGrid.setData([]);
			this.enableButtonListValue();
		}
	}

	/**
	 * 値リスト選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectedValueList(event: any): void {
		this.enableButtonListValue();
	}

	/**
	 * 値リスト登録メニュー押下時のイベントハンドラ
	 * 値リスト登録ダイアログを表示します.
	 */
	onClickCustomValueListCreator(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showDocumentAttributeListCreator(this.attributeDataGrid.getSelectedData()[0], {
			created: (result: EIMListValueDTO[]) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.valueListDataGrid.setData(result);
				this.enableButtonListValue();
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02097')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * 値リスト更新メニュー押下時のイベントハンドラ
	 * 値リスト更新ダイアログを表示します.
	 */
	onClickCustomValueListUpdator(): void {
		this.adminAttributeService.getupdateMaster(this.attributeDataGrid.getSelectedData()[0], this.valueListDataGrid.getSelectedData()[0]).subscribe(
			(defaultValue: EIMListValueDTO) => {
				let dialogId: string = this.adminDialogManagerComponentService.showDocumentAttributeListUpdator(this.attributeDataGrid.getSelectedData()[0], defaultValue, {
					updated: (result: EIMListValueDTO[]) => {
						this.adminDialogManagerComponentService.close(dialogId);
						this.valueListDataGrid.setData(result);
						this.enableButtonListValue();
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02097')}));
					}
				});
			}
		);
	}

	/**
	 * 値リスト並べ替えメニュー押下時のイベントハンドラ
	 * 値リスト並べ替えダイアログを表示します.
	 */
	onClickValueListSort(): void {
		// 値リスト取得問い合わせの結果より先にメニュー押下時の制御
		if (this.valueListDataGrid.getData().length < 2) {
			return;
		}
		let dialogId: string = this.adminDialogManagerComponentService.showListValueSort(this.attributeDataGrid.getSelectedData()[0], this.valueListDataGrid.getData(), {
			updated: (result: EIMListValueDTO[]) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.valueListDataGrid.setData(result);
				this.enableButtonListValue();
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02097')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * 属性リスト値削除メニュー押下時のイベントハンドラ
	 */
	onClickCustomValueListDeletor(): void {
		// 選択したリスト取得
		let selectedData = this.valueListDataGrid.getSelectedData()[0];
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00015', {value: selectedData.value}) ,
			() => {
				let attribute: any = this.attributeDataGrid.getSelectedData()[0];
				this.adminAttributeService.deleteMaster(attribute.attTypeId, this.valueListDataGrid.getSelectedData()[0].value, attribute.valTypeId).subscribe(
					(data: EIMListValueDTO[]) => {
						this.valueListDataGrid.setData(data);
						this.enableButtonListValue();
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02097')}));
					}
				);
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * リスト値一覧を取得します．
	 * @param attTypeId: number 属性タイプID
	 */
	private selectAttrList(attTypeId: number): void {
		this.selectedAttributeTypeId = attTypeId;
		this.adminAttributeService.getListByValue(attTypeId).subscribe(
			(defaultValue: EIMListValueDTO[]) => {
				if (this.selectedAttributeTypeId !== attTypeId) {
					return;
				}
				this.valueListDataGrid.setData(defaultValue);
				this.enableButtonListValue();
			},
			(err: any) => {
				// リスト値一覧をクリア
				this.valueListDataGrid.setData([]);
				this.enableButtonListValue();
		});
	}

	/**
	 * 属性データグリッドのボタン活性を制御します.
	 */
	private enableButtonAttribute(): void {
		let selectedAttribute = this.attributeDataGrid.getSelectedData();
		this.updateValueListMenuItem.disabled = true;
		this.deleteValueListMenuItem.disabled = true;
		if (selectedAttribute.length === 0) {
			this.updateAttributeMenuItem.disabled = true;
			this.deleteAttributeMenuItem.disabled = true;
			this.createValueListMenuItem.disabled = true;
			this.sortValueListMenuItem.disabled = true;
			this.updateAndSortCodeMenuItem.disabled = true;
			this.valueListDataGrid.setData([]);
		} else {
			// UIコントロールが取得出来ていない場合は非活性
			this.updateAttributeMenuItem.disabled = !this.dataTypeList;
			this.deleteAttributeMenuItem.disabled = false;
			this.createValueListMenuItem.disabled = !selectedAttribute[0].inputRuleFlag;
		}
	}

	/**
	 * リスト値データグリッドのボタン活性を制御します.
	 */
	private enableButtonListValue(): void {
		let selectedValueList = this.valueListDataGrid.getSelectedData();
		if (selectedValueList.length === 0) {
			this.updateValueListMenuItem.disabled = true;
			this.deleteValueListMenuItem.disabled = true;
		} else {
			this.updateValueListMenuItem.disabled = false;
			this.deleteValueListMenuItem.disabled = false;
		}
		this.sortValueListMenuItem.disabled = this.valueListDataGrid.getData().length < 2;
		this.updateAndSortCodeMenuItem.disabled = this.updateValueListMenuItem.disabled && this.sortValueListMenuItem.disabled;
	}
}
