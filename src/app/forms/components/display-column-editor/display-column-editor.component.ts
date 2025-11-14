import { Component, Output, Input, ViewChild, EventEmitter, forwardRef, OnInit } from '@angular/core';

import { EIMComponent, EIMApplicable } from 'app/shared/shared.interface';
import { EIMFormListColumnMultipleSelectorComponent } from 'app/forms/components/form-list-column-selector/form-list-column-multiple-selector.component';
import { EIMFormListColumnSingleSelectorComponent } from 'app/forms/components/form-list-column-selector/form-list-column-single-selector.component';

import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';

import { EIMFormTypeDisplayColumn, EIMFormTypeDisplayColumnColumn } from 'app/shared/services/apis/local-storage.service';

import { EIMFormDisplayColumnService } from 'app/forms/shared/services/form-display-column.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMMessageType, EIMMessageService } from "app/shared/services/message.service";
import { EIMConstantService } from "app/shared/services/constant.service";
import { EIMFormsConstantService } from "app/forms/shared/services/forms-constant.service";

@Component({
    selector: 'eim-display-column-editor',
    templateUrl: './display-column-editor.component.html',
    styleUrls: ['./display-column-editor.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMDisplayColumnEditorComponent) }],
    standalone: false
})
export class EIMDisplayColumnEditorComponent implements EIMApplicable {

	/** 帳票タイプ */
	@Input() formType: EIMFormTypeDomain;

	/** 表示カラム */
	@Input() displayColumn: EIMFormTypeDisplayColumn | null;
	
	/** 属性タイプ適用処理完了のイベントエミッタ */
	@Output() applied: EventEmitter<any> = new EventEmitter<any>();
	
	/** エラー時のイベントエミッタ */
	@Output() errored: EventEmitter<any> = new EventEmitter<any>();
	
	/** 複合グループユーザ一覧データグリッド */
	@ViewChild('rightPane', { static: true }) rightPane:EIMFormListColumnMultipleSelectorComponent;
	
	/** 複合グループユーザ一覧データグリッド */
	@ViewChild('leftPane', { static: true }) leftPane:EIMFormListColumnSingleSelectorComponent;

	/** 選択済みカラム */
	public selectedData: EIMFormTypeDisplayColumnColumn[];

	/** 全選択可能カラム */
	public allColumns: EIMFormTypeDisplayColumnColumn[];

	/** デフォルトカラム */
	public defaultColumns: EIMFormTypeDisplayColumnColumn[];
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected formDisplayColumnService: EIMFormDisplayColumnService,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 適用ボタン押下時の処理を実施します.
	 */
	public apply(): void {

		this.displayColumn.columns = this.rightPane.getData();
		if (this.formType.formListColumn.formListColumnMaxCount < this.displayColumn.columns.length) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant("EIM_FORMS.ERROR_00007", {value: this.formType.formListColumn.formListColumnMaxCount}));
			return;
		}
		
		// 初期表示時と差異があるかどうかを判定
		let differ: boolean = false;
		if(this.selectedData.length == this.displayColumn.columns.length) {
			for(let i = 0; i < this.selectedData.length; i++) {
				if(this.selectedData[i].columnId != this.displayColumn.columns[i].columnId) {
					differ = true;
				}
			}
			
		} else {
			differ = true;
		}
		
		// 差異がある場合適用処理を行い画面を閉じる
		if (differ) {
			this.formDisplayColumnService.updatedDisplayColumnCompleted.emit(this.displayColumn);
		}
		this.applied.emit();
	}
	
	/**
	 * 適用ボタン押下可否を返却します.
	 */
	public applicable(): boolean {
		return this.rightPane.isDirty;
	}
	
	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit() {
		this.show();
	}
		
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	
	/**
	 * 画面を表示します.
	 */
	protected show():void {
		// システム設定の表示列の名称を取得
		let sysColumns: EIMFormTypeDisplayColumnColumn[] = this.createSystemColumns();
		// 全選択可能カラムを生成
		let allColumns: EIMFormTypeDisplayColumnColumn[] = [];
		// ユーザ設定のデフォルトカラムを保持するカラムを生成
		let additionalColumns: EIMFormTypeDisplayColumnColumn[] = [];
		
		for (let i = 0; i < this.formType.formListColumn.systemSettingFormListColumns.length; i++) {
			let column: string = this.formType.formListColumn.systemSettingFormListColumns[i].formListColumnId;
			let columnName: string = this.formDisplayColumnService.getColumnName(column);
			let columnDefinitionName: string = this.formType.formListColumn.systemSettingFormListColumns[i].definitionName;
			if (columnName == null || columnName.length == 0) {
				columnName = this.formType.formListColumn.systemSettingFormListColumns[i].name;
				additionalColumns.push({columnId: column, name: columnName, definitionName: columnDefinitionName});
			} else {
				let j = 0;
				for (j; j < sysColumns.length; j++) {
					if (sysColumns[j].columnId == column) {
						break;
					}
				}
				sysColumns.splice(j,1);
				allColumns.push({columnId: column, name: columnName, definitionName: columnName});
				additionalColumns.push({columnId: column, name: columnName, definitionName: columnName});
			}
		}
		this.defaultColumns = additionalColumns.concat();
		
		// デフォルト表示列から除外されたシステム表示列を追加
		Array.prototype.push.apply(allColumns, sysColumns);
		
		for (let i = 0; i < this.formType.attributeTypeList.length; i++) {
			let attributeType: EIMAttributeTypeDomain = this.formType.attributeTypeList[i];
			// タイトルはデフォルト表示列に含まれるためここでは対象外
			if (attributeType.definitionName != EIMConstantService.DATA_GRID_FIELD_NAME_TITLE) {
				allColumns.push({
					columnId: String(attributeType.id),
					name: attributeType.name,
					definitionName: attributeType.definitionName
				});
			}
		}

		// 設定済みの表示列から幅情報を受け取る
		for (let i = 0; i < this.displayColumn.columns.length ; i++) {
			for (let j = 0; j < allColumns.length; j++) {
				if (this.displayColumn.columns[i].columnId == allColumns[j].columnId) {
					allColumns[j].width = this.displayColumn.columns[i].width;
				}
			}
		}

		this.allColumns = allColumns;
		

		// 選択データを複製（呼び出し元に影響を出さないため）
		this.selectedData = [];
		Object.assign(this.selectedData, this.displayColumn.columns);
	}
	
	/**
	 * デフォルト設定のデフォルト表示列を取得します.
	 * @return デフォルト表示列一覧
	 */
	protected createSystemColumns():any {
		let columnIdList: string[] = [];
		let sysColumns: EIMFormTypeDisplayColumnColumn[] = [];
	
		columnIdList.push(EIMFormsConstantService.DISPLAY_COLUMN_ID_NAME);
		columnIdList.push(EIMFormsConstantService.DISPLAY_COLUMN_ID_TITLE);
		columnIdList.push(EIMFormsConstantService.DISPLAY_COLUMN_ID_STATUS_TYPE_NAME);
		columnIdList.push(EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_USER_NAME);
		columnIdList.push(EIMFormsConstantService.DISPLAY_COLUMN_ID_CREATION_DATE);
		columnIdList.push(EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_USER_NAME);
		columnIdList.push(EIMFormsConstantService.DISPLAY_COLUMN_ID_MODIFICATION_DATE);
		
		for (let i = 0; i < columnIdList.length; i++) {
			let columnName: string = this.formDisplayColumnService.getColumnName(columnIdList[i]);
			sysColumns.push({columnId: columnIdList[i], name: columnName, definitionName: columnName});
		}
		return sysColumns;
	}
}