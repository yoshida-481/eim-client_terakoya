import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem, EIMCreatable } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMStatusTypeDTO } from 'app/admins/shared/dtos/status-type.dto';

import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService, EIMMessageType  } from 'app/shared/services/message.service';

/**
 * ステータス別セキュリティ複写コンポーネント
 * @example
 *
 *      <eim-status-security-copy
 *          [secId]="secId"
 *          [secLabel]="secLabel"
 *          [workflowId]="workflowId"
 *          [workflowLabel]="workflowLabel">
 *      </eim-status-security-copy>
 */
@Component({
    selector: 'eim-status-security-copy',
    templateUrl: './status-security-copy.component.html',
    styleUrls: ['./status-security-copy.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMStatusSecurityCopyComponent) }
    ],
    standalone: false
})

export class EIMStatusSecurityCopyComponent implements OnInit, EIMCreatable {

	/** コピー元グリッド */
	@ViewChild('statusTypeDataGridFrom', { static: true })
		statusTypeDataGridFrom: EIMDataGridComponent;

	/** コピー先グリッド */
	@ViewChild('statusTypeDataGridTo', { static: true })
		statusTypeDataGridTo: EIMDataGridComponent;

	/** セキュリティID */
	@Input() secId: number;

	/** セキュリティ名 */
	@Input() secLabel: string;

	/** ワークフローID from */
	@Input() workflowId: number;

	/** ワークフロー名 from*/
	@Input() workflowLabel: string;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** ワークフローIDTo */
	private workflowIdTo: number;

	/** ワークフロー名To */
	public workflowLabelTo: string;

	/** コピー元ステータスタイプ複写メニュー */
	private fromCopyMenu = {label: this.translateService.instant('EIM_ADMINS.LABEL_03035'), icon: 'eim-icon-copy', disabled: true, command: ($event) => {this.statusTypeFromCopy(); }};

	/** コピー元ステータスタイプ削除メニュー */
	private fromDeleteMenu = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.statusTypeFromDelete(); }};

	/** コピー元ステータスタイプのメニュー */
	public statusTypeMenuItemsFrom: EIMMenuItem[] = [
		this.fromCopyMenu,
		this.fromDeleteMenu,
	];

	/** コピー先ステータスタイプ削除メニュー */
	private toDeleteMenu = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.statusTypeToDelete(); }};

	/** コピー先ステータスタイプのメニュー */
	public statusTypeMenuItemsTo: EIMMenuItem[] = [
		this.toDeleteMenu,
	];

	/**
	 * コンストラクタ
	 */
	constructor(
		protected securityService: EIMAdminsSecurityService,
		protected translateService: TranslateService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected messageService: EIMMessageService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ステータス別セキュリティを複写
	 */
	public create(): void {
		let fromData = this.statusTypeDataGridFrom.getData();
		let toData = this.statusTypeDataGridTo.getData();

		if (fromData.length !== toData.length) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00010'));
			return;
		}

		// ステータス別セキュリティを複写
		let ids = []
		// コピー元IDリスト
		for ( let i = 0; i < fromData.length; i++ ) {
			ids.push(fromData[i].statusTypeId);
		}
		let fromStatusTypeIds = ids.join(',');

		// コピー先IDリスト
		ids = []
		for ( let i = 0; i < toData.length; i++ ) {
			ids.push(toData[i].statusTypeId);
		}
		let toStatusTypeIds = ids.join(',');

		// 複製実行
		this.securityService.copyStatus(this.secId, fromStatusTypeIds, toStatusTypeIds).subscribe(
			(data: any) => {
				this.created.emit(data);
				this.adminDialogManagerComponentService.close(dialogName.STATUS_SECURITY_COPY);
			}
		);
	}

	/**
	 * ステータス別セキュリティ複写可否を返却
	 * @return ステータス別セキュリティ複写可否
	 */
	public creatable(): boolean {
		if (!this.workflowIdTo) {
			return false;
		}
		return true;
	}

	/**
	 * グリッドで使用するequalsメソッドです.
	 * 行の追加や削除時に対象行特定のため、グリッド内で使用
	 * @param data1 比較データ1
	 * @param data2 比較データ2
	 * @return 一致不一致
	 */
	public equals (data1: any, data2: any) {
		return (data1.step === data2.step);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * コピー元ステータスタイプ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectStatusTypeFrom(event: any): void {
		// 選択したコピー元セキュリティ取得
		let selectedData = this.statusTypeDataGridFrom.getSelectedData();
		let allData = this.statusTypeDataGridFrom.getData();
		let copyDisable = true;
		let deleteDisable = true;
		// 1行選択の場合
		if (selectedData.length === 1) {
			// 複製を活性化
			copyDisable = false;
			// 行が2行以上の場合、削除を活性化
			if (1 < allData.length) {
				deleteDisable = false;
			}
		}
		this.fromCopyMenu.disabled = copyDisable;
		this.fromDeleteMenu.disabled = deleteDisable;
	}

	/**
	 * コピー先ステータスタイプ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectStatusTypeTo(event: any): void {
		// 選択したコピー先セキュリティ取得
		let selectedData = this.statusTypeDataGridTo.getSelectedData();
		let allData = this.statusTypeDataGridTo.getData();
		let disable = true;
		// 1行選択　かつ　2行以上ある場合
		if (selectedData.length === 1 && 1 < allData.length) {
			disable = false;
		}
		this.toDeleteMenu.disabled = disable;
	}

	/**
	 * ワークフロー選択画面表示ボタン押下のイベントハンドラ
	 * @param event イベント
	 */
	onClickShowWorkflowSelector(event: any): void {
		// ワークフロー選択画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showWorkflowSelector({
			selected: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);

				this.workflowLabelTo = data.name;
				this.workflowIdTo = data.id;
				// ステータスタイプ一覧を取得
				this.getStatusTypeList(this.workflowIdTo, this.statusTypeDataGridTo);
			},
		}, true);
	}

	/**
	 * コピー元の上へ移動ボタン押下イベントハンドラ
	 * @param event イベント
	 */
	onClickUpFrom(event: any): void {
		// 並び替え実行
		this.statusTypeDataGridFrom.moveUpSelectedData();
		// 表示順を設定
		this.statusTypeRefeshStep(this.statusTypeDataGridFrom);
	}

	/**
	 * コピー元の下へ移動ボタン押下イベントハンドラ
	 * @param event イベント
	 */
	onClickDownFrom(event: any): void {
		// 並び替え実行
		this.statusTypeDataGridFrom.moveDownSelectedData();
		// 表示順を設定
		this.statusTypeRefeshStep(this.statusTypeDataGridFrom);
	}

	/**
	 * コピー先の上へ移動ボタン押下イベントハンドラ
	 * @param event イベント
	 */
	onClickUpTo(event: any): void {
		// 並び替え実行
		this.statusTypeDataGridTo.moveUpSelectedData();
		// 表示順を設定
		this.statusTypeRefeshStep(this.statusTypeDataGridTo);
	}

	/**
	 * コピー先の下へ移動ボタン押下イベントハンドラ
	 * @param event イベント
	 */
	onClickDownTo(event: any): void {
		// 並び替え実行
		this.statusTypeDataGridTo.moveDownSelectedData();
		// 表示順を設定
		this.statusTypeRefeshStep(this.statusTypeDataGridTo);
	}

	/**
	 * 入力値初期化後のイベントハンドラ
	 */
	ngOnInit(): void {

		let statusTypeColumns = [];
		// ステップ
		statusTypeColumns.push({field: 'step', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02061'), width: 65, suppressFilter: true, suppressSorting: true});
		// タイプ名
		statusTypeColumns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02062'), width: 456, suppressFilter: true, suppressSorting: true});

		this.statusTypeDataGridFrom.setColumns(statusTypeColumns);
		this.statusTypeDataGridFrom.showAllSelectButton = false;

		statusTypeColumns = [];
		// ステップ
		statusTypeColumns.push({field: 'step', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02061'), width: 65, suppressFilter: true, suppressSorting: true});
		// タイプ名
		statusTypeColumns.push({field: 'statusTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02063'), width: 456, suppressFilter: true, suppressSorting: true});

		this.statusTypeDataGridTo.setColumns(statusTypeColumns);
		this.statusTypeDataGridTo.showAllSelectButton = false;

		this.getStatusTypeList(this.workflowId, this.statusTypeDataGridFrom, true);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ステータスタイプ一覧を取得
	 * @param workflowId ワークフローID
	 * @param dataGrid データグリッドコンポーネント
	 * @param errDialogClose ダイアログクローズフラグ
	 */
	private getStatusTypeList(workflowId: number, dataGrid: EIMDataGridComponent, errDialogClose = false) {
		// ステータスタイプ一覧を取得します．
		this.securityService.getStatusTypeList(workflowId).subscribe(
			(statusTypeList: EIMStatusTypeDTO[]) => {
				dataGrid.setData(statusTypeList);
			}, (err: any) => {
				dataGrid.setData([]);
				// ダイアログクローズフラグがtrueの場合
				if (errDialogClose) {
					this.adminDialogManagerComponentService.close(dialogName.STATUS_SECURITY_COPY);
				}
		});
	}

	/**
	 * No.の降り直しを行います．
	 * @param dataGrid データグリッドコンポーネント
	 */
	private statusTypeRefeshStep(dataGrid: EIMDataGridComponent) {
		let data = dataGrid.getData();
		for (let i = 0; i < data.length; i++) {
			data[i].step = i + 1;
		}
		dataGrid.refreshView();
	}

	/**
	 * コピー元ステータスタイプ流用ボタン押下時のイベントハンドラ
	 */
	private statusTypeFromCopy(): void {
		// 選択したステータスタイプー取得
		let rowIndex = this.statusTypeDataGridFrom.getRowIndex();
		let selectedDataList = this.statusTypeDataGridFrom.getSelectedData();

		// 追加
		let target = [Object.assign({}, selectedDataList[0])];
		this.statusTypeDataGridFrom.addRowDataToIndex(target, rowIndex + 1);
		// Noの再割り振り
		this.statusTypeRefeshStep(this.statusTypeDataGridFrom);
		this.statusTypeDataGridFrom.refreshView();

		// 複製後は削除メニューを押下可能とする
		this.fromDeleteMenu.disabled = false;
	}

	/**
	 * コピー元ステータスタイプ削除ボタン押下時のイベントハンドラ
	 */
	private statusTypeFromDelete(): void {
		// 選択したステータスタイプー取得
		let rowIndex = this.statusTypeDataGridFrom.getRowIndex();

		// 削除
		this.statusTypeDataGridFrom.removeRowData(this.statusTypeDataGridFrom.getSelectedData());
		// Noの再割り振り
		this.statusTypeRefeshStep(this.statusTypeDataGridFrom);
		this.statusTypeDataGridFrom.refreshView();
		// 削除した一つ下の行を選択する
		this.statusTypeDataGridFrom.setSelectRow(rowIndex);
	}

	/**
	 * コピー先ステータスタイプ削除ボタン押下時のイベントハンドラ
	 */
	private statusTypeToDelete(): void {
		// 選択したステータスタイプー取得
		let rowIndex = this.statusTypeDataGridTo.getRowIndex();

		// 削除
		this.statusTypeDataGridTo.removeRowData(this.statusTypeDataGridTo.getSelectedData());
		// Noの再割り振り
		this.statusTypeRefeshStep(this.statusTypeDataGridTo);
		this.statusTypeDataGridTo.setSelectRow(rowIndex);
		// 削除した一つ下の行を選択する
		this.statusTypeDataGridTo.setSelectRow(rowIndex);
	}

}
