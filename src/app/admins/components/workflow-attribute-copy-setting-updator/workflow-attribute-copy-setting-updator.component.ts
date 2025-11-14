import { Component, forwardRef, EventEmitter, Input, Output, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminDialogManagerComponentService, dialogName} from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsCheckboxRendererComponent } from 'app/admins/shared/components/renderer/admin-checkbox-renderer.component';
import { EIMCheckboxRendererComponentService } from 'app/shared/components/renderer/checkbox-renderer.component.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';


/** 画面状態定数 */
export namespace stateConst {
	export const EDITING = 'editing';
	export const CREATING = 'creating';
	export const COMPLETE = 'complete';
}

/**
 * 属性複製設定コンポーネント
 * @example
 *      <eim-workflow-attribute-copy-setting-updator
 *          [selectedData]="selectedData">
 *      </eim-workflow-attribute-copy-setting-updator>
 */
@Component({
    selector: 'eim-workflow-attribute-copy-setting-updator',
    templateUrl: './workflow-attribute-copy-setting-updator.component.html',
    styleUrls: ['./workflow-attribute-copy-setting-updator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMWorkflowAttributeCopySettingUpdatorComponent) }],
    standalone: false
})

export class EIMWorkflowAttributeCopySettingUpdatorComponent implements OnInit, OnDestroy, EIMUpdatable {
	/** ワークフローの属性複製設定フォーム */
	@ViewChild('workflowAttrCopySettingForm', { static: true }) workflowAttrCopySettingForm: NgForm;

	/** 属性一覧 */
	@ViewChild('attributeTypeList', { static: true }) attributeTypeList: EIMDataGridComponent;

	/** 親画面の属性リスト */
	@Input() public selectedData: any[];

	/** 更新完了時のイベントエミッタ */
	@Output() public updated: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** 画面を閉じるのイベントエミッタ */
	@Output() public closed: EventEmitter<null> = new EventEmitter<null>();

	/** すべて選択フラグ */
	public allCheckFlg = false;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** チェックボックスレンダラのエミッタ */
	private changed: Subscription;

	/** 画面状態定数 */
	public STATE = stateConst;

	/** 画面状態 */
	public state = stateConst.EDITING;

	/** フィルタキーワード */
	public keyword = '';

	/** 属性複製設定更新可否フラグ */
	private updateFlg = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected checkboxRendererComponentService: EIMCheckboxRendererComponentService,
	) {
		this.changed = checkboxRendererComponentService.changed.subscribe(() => { this.onChangedCheck(); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性複製設定を更新します.
	 */
	public update(): void {
		this.updated.emit(this.attributeTypeList.getData());
	}

	/**
	 * 属性複製設定更新可否を返却します.
	 * @return 属性複製設定更新可否
	 */
	public updatable(): boolean {
		return this.updateFlg;
	}

	/**
	 * 閉じるボタン押下時の処理を実施します.
	 */
	public close(): void {
		// 閉じる
		this.closed.emit();
		this.dialogManagerComponentService.close(dialogName.WORKFLOW_ATTRIBUTE_COPY_SETTING);
	}

	/**
	 * データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.attTypeId === obj2.attTypeId);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		window.setTimeout(() => {
			let columns: EIMDataGridColumn[] = [];
			columns.push({field: 'newCopyFlag', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02009'), width: 70, cellRendererFramework: EIMAdminsCheckboxRendererComponent, headerClass: 'eim-editable-column-header', suppressFilter: true});
			columns.push({field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 250, suppressFilter: true});
			columns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 250, cellRendererFramework: EIMAdminNameRendererComponent, suppressFilter: true});
			this.attributeTypeList.setColumns(columns);
			this.attributeTypeList.setData(this.selectedData);
			// すべてチェック済のチェック
			this.onChangedCheck();
		});
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 */
	onChange(event) {
		this.updateFlg = true;
		let dataList = this.attributeTypeList.getData();
		let rowIndex = -1;
		for (let i = 0; i < dataList.length; i++) {
			rowIndex = this.attributeTypeList.getTargetRowIndex(dataList[i]);
			if (rowIndex === -1) {
				continue;
			}
			dataList[i].newCopyFlag = event;
		}
	}

	/**
	 * フィルターボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickFilter(event: any): void {
		let aaa = event;
		let word = this.keyword;
		let unvisibleData: any[] = [];
		unvisibleData.push({
			definitionName: this.keyword,
			attTypeName: this.keyword
			});
		this.filter(unvisibleData);
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		if (!this.changed.closed) {
			this.changed.unsubscribe();
		}
	}

	/**
	 * 複製有無フラグ更新時イベントハンドラです.
	 */
	onChangedCheck(): void {
		this.updateFlg = true;
		let dataList = this.attributeTypeList.getData();
		let checkedCount = 0;
		let rowIndex = -1;

		for (let i = 0; i < dataList.length; i++) {
			let data: any = dataList[i];
			rowIndex = this.attributeTypeList.getTargetRowIndex(dataList[i]);

			if (data.newCopyFlag === true && rowIndex !== -1) {
				checkedCount++;
			}
		}

		// すべてチェック済の場合
		let rowCount = this.attributeTypeList.getRowCount(true);
		if (rowCount !== 0 && checkedCount === rowCount) {
			this.allCheckFlg = true;
		} else {
			this.allCheckFlg = false;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 右ペインの一覧表示をフィルタします.
	 * ”選択履歴まで表示”を指定した際の、不要な行をフィルタします.
	 * @param unvisibleData 非表示にする履歴情報
	 */
	private filter(unvisibleData: any[]): void {
		this.attributeTypeList.info.gridApi.setGridOption('isExternalFilterPresent', () => {return true});
		this.attributeTypeList.info.gridApi.setGridOption('doesExternalFilterPass', (node): boolean => {
			return this.doesExternalFilterPass(node, unvisibleData);
		});

		this.attributeTypeList.info.gridApi.onFilterChanged();

		// すべてチェック済のチェック
		this.onChangedCheck();

	}

	/**
	 * 該当行が非表示とする履歴情報かどうかを返却します.
	 * @param node 右ペインの一覧表示の行情報
	 * @param unvisibleData 非表示とする履歴情報
	 * @return 該当行が非表示とする履歴情報かどうか
	 */
	private doesExternalFilterPass(node, unvisibleData?: any[]): boolean {
		let flg = false;
		for ( let i = 0; i < unvisibleData.length; i++ ) {
			let keyword = unvisibleData[i];
			for (let key in keyword ) {
				if ( node.data[key].indexOf(keyword[key]) > -1 ) {
					flg = true;
				}
			}
		}
		return flg;
	}

}
