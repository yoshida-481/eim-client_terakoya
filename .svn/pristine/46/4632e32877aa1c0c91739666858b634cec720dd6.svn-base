import { EIMClassFormListColumnSingleSelectorComponent } from 'app/admins/components/class-form-list-column-selector/class-form-list-column-single-selector.component';
import { Component, Output, Input, ViewChild, EventEmitter, forwardRef } from '@angular/core';

import { EIMComponent, EIMApplicable } from 'app/shared/shared.interface';
import { EIMDisplayColumnEditorComponent } from 'app/forms/components/display-column-editor/display-column-editor.component';
import { EIMFormTypeDisplayColumnColumn } from 'app/shared/services/apis/local-storage.service';

import { EIMFormDisplayColumnService } from 'app/forms/shared/services/form-display-column.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMObjectDTO } from 'app/admins/shared/dtos/object.dto';
import { EIMClassFormListColumnMultipleSelectorComponent } from 'app/admins/components/class-form-list-column-selector/class-form-list-column-multiple-selector.component';

@Component({
    selector: 'eim-class-display-column-editor',
    templateUrl: './class-display-column-editor.component.html',
    styleUrls: ['./class-display-column-editor.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMClassDisplayColumnEditorComponent) }],
    standalone: false
})

/**
 * 表示列更新コンポーネント
 * @example
 *
 *      <eim-class-display-column-editor
 *        [objTypeId]="objTypeId"
 *        [adminFormType]="adminFormType">
 *      </eim-class-display-column-editor>
 */
export class EIMClassDisplayColumnEditorComponent extends EIMDisplayColumnEditorComponent implements EIMApplicable {

	/** オブジェクトタイプID */
	@Input() objTypeId: number;

	/** 表示列情報 */
	@Input() adminFormType: EIMObjectDTO[];

	/** 属性タイプ適用処理完了のイベントエミッタ */
	@Output() applied: EventEmitter<any> = new EventEmitter<any>();

	/** エラー時のイ	ベントエミッタ */
	@Output() errored: EventEmitter<any> = new EventEmitter<any>();

	/** 複合グループユーザ一覧データグリッド */
	@ViewChild('rightPane', { static: true }) rightPane: EIMClassFormListColumnMultipleSelectorComponent;

	/** 複合グループユーザ一覧データグリッド */
	@ViewChild('leftPane', { static: true }) leftPane: EIMClassFormListColumnSingleSelectorComponent;

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
		protected adminMessageService: EIMMessageService,
		protected objectService: EIMObjectService,
	) {
		super(
			formDisplayColumnService,
			translateService,
			adminMessageService,
		);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 適用ボタン押下時の処理を実施します.
	 */
	public apply(): void {
		// 適用処理を行い画面を閉じる
		let updateFlag = true;
		let defaultFlag = true;
		let formListColumnId: string[] = [];
		let rightPaneData = this.rightPane.getData();
		// 初期表示と配列数が同数でない場合、更新あり
		if (rightPaneData.length !== this.selectedData.length) {
			updateFlag = false;
		}
		// デフォルト設定と配列数が同数でない場合、デフォルト設定ではない
		if (rightPaneData.length !== this.defaultColumns.length) {
			defaultFlag = false;
		}
		// 選択済みリストと初期表示およびデフォルト設定と比較
		for (let i = 0; i < this.rightPane.getData().length; i++) {
			// 初期表示と比較し一致した場合、更新あり
			if (updateFlag === true && rightPaneData[i].columnId !== this.selectedData[i].columnId) {
				updateFlag = false;
			}
			// デフォルト設定と比較し一致した場合、デフォルト設定ではない
			if (defaultFlag === true && rightPaneData[i].columnId !== this.defaultColumns[i].columnId) {
				defaultFlag = false;
			}
			formListColumnId.push(rightPaneData[i].columnId);
		}
		// 更新なしの場合処理しない
		if (updateFlag === true) {
			this.applied.emit();
		// デフォルト設定の場合空配列
		} else if (defaultFlag === true) {
			formListColumnId = [];
			this.objectService.updateFormListColumn(this.objTypeId, formListColumnId)
				.subscribe(
					(data: any) => {
						this.applied.emit(this.rightPane.getData());
					},
					(err: any) => {
						this.applied.emit(err);
					}
				);
		// 更新あり、かつ、デフォルト設定ではない場合、選択済みリストで適用
		} else {
			this.objectService.updateFormListColumn(this.objTypeId, formListColumnId)
			.subscribe(
				(data: any) => {
					this.applied.emit(this.rightPane.getData());
				},
				(err: any) => {
					this.errored.emit(err);
				}
			);
		}
	}

	/**
	 * 適用ボタン押下可否を返却します.
	 */
	public applicable(): boolean {
		return this.rightPane.isDirty;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * 画面を表示します.
	 */
	protected show(): void {
		// システム設定の表示列の名称を取得
		let sysColumns: EIMFormTypeDisplayColumnColumn[] = [];
		// 全選択可能カラムを生成
		let allColumns: EIMFormTypeDisplayColumnColumn[] = [];
		// ユーザ設定のデフォルトカラムを保持するカラムを生成
		let additionalColumns: EIMFormTypeDisplayColumnColumn[] = [];
		// システム設定の表示列をシステム設定カラム、選択可能カラムに追加
		for (let i = 0; i < this.adminFormType[0].defaultFormListColumns.length; i++) {
			let column: string = this.adminFormType[0].defaultFormListColumns[i].id;
			let columnName: string = this.adminFormType[0].defaultFormListColumns[i].name;
			let columnDefinitionName: string = this.adminFormType[0].defaultFormListColumns[i].definitionName;

			allColumns.push({columnId: column, name: columnName, definitionName: columnDefinitionName, width: 300});
			sysColumns.push({columnId: column, name: columnName, definitionName: columnDefinitionName, width: 300});
		}
		// 表示列追加
		for (let i = 0; i < this.adminFormType[0].systemSettingFormListColumns.length; i++) {
			let column: string = this.adminFormType[0].systemSettingFormListColumns[i].id;
			let columnName: string = this.adminFormType[0].systemSettingFormListColumns[i].name;
			let columnDefinitionName: string = this.adminFormType[0].systemSettingFormListColumns[i].definitionName;

			additionalColumns.push({columnId: column, name: columnName, definitionName: columnDefinitionName, width: 300});
		}
		// 対象のオブジェクトに設定されている属性を選択可能カラムに追加
		for (let i = 0; i < this.adminFormType[0].attributeFormListColumns.length; i++) {
			let column: string = this.adminFormType[0].attributeFormListColumns[i].id;
			let columnName: string = this.adminFormType[0].attributeFormListColumns[i].name;
			let columnDefinitionName: string = this.adminFormType[0].attributeFormListColumns[i].definitionName;
			if (this.adminFormType[0].attributeFormListColumns[0] !== '') {
				allColumns.push({columnId: column, name: columnName, definitionName: columnDefinitionName, width: 300});
			}
		}
		// デフォルト設定時に利用するデータ
		this.defaultColumns = sysColumns;
		// 右側の表示列データグリッドに設定する
		this.selectedData = additionalColumns;
		// 左側の表示対象一覧データグリッドに設定する
		this.allColumns = allColumns;
	}
}
