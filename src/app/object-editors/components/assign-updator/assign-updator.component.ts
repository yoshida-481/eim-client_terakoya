import { EIMComponent, EIMMenuItem, EIMUpdatable } from 'app/shared/shared.interface';
import { Component, OnInit, forwardRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectEditorsWorkFlowService, ObjectDetailDTO, AssignDTO, WorkflowDTO, StatusDTO } from 'app/object-editors/shared/services/apis/object-editors-workflow.service';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMUserIconRendererComponent } from 'app/object-editors/shared/components/renderer/user-icon-renderer.component';

export namespace ENTRY_TYPE_NAME {
	export const USER = 'user';
	export const SYSFUNC = 'sysFunc';
}
/**
 * アサイン一覧コンポーネント
 * @example
 * 		<eim-assign-updator [objData]="objData">
 * 		</eim-assign-updator>
 */
@Component({
    selector: 'eim-assign-updator',
    templateUrl: './assign-updator.component.html',
    styleUrls: ['./assign-updator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMAssignUpdatorComponent) }],
    standalone: false
})
export class EIMAssignUpdatorComponent implements OnInit, EIMUpdatable {

	/** オブジェクト情報 */
	@Input() objData: EIMObjectDTO;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** アサインデータグリッドコンポーネント */
	@ViewChild('assignDataGrid', { static: true })
		assignDataGrid: EIMDataGridComponent;

	/** 選択ワークフロー */
	public workflow = new WorkflowDTO;

	/** 選択オブジェクトステータス */
	public nowStatus = new StatusDTO;

	/** 選択 */
	protected menuSelect: EIMMenuItem =
		{label: this.translateService.instant('EIM.LABEL_03006'), name: 'Select', icon: 'fa fa-check',  command: (event) => {this.onClickShowAssignMember(); } }

	/** 削除 */
	protected menuDelete: EIMMenuItem =
		{label: this.translateService.instant('EIM.LABEL_03003'), name: 'Delete', icon: 'eim-icon-trash', disabled: true , command: (event) => {this.onCkickDeleteAssignUser(); }}

	/** アサイン一覧のメニュー */
	public assignMenuItems: EIMMenuItem[] = [
		this.menuSelect,
		this.menuDelete
	];

	/** アサイン一覧の右クリックメニュー */
	public assignContextMenuItems: EIMMenuItem[] = [
		this.menuDelete
	];

	/** 更新有無フラグ */
	private dirty = false;

	/** 初期表示データグリッド情報 */
	private beforeMap = new Map();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected objectEditorsWorkFlowService: EIMObjectEditorsWorkFlowService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * アサイン情報を更新します.
	 */
	public update(): void {
		this.dirty = false;
		let assignData = this.assignDataGrid.getData();
		let idList: number[] = [];
		let entryTypeList: string[] = [];
		for (let i = 0; i < assignData.length; i++) {
			idList.push(assignData[i].entryId);
			// エントリータイプを変換
			if (assignData[i].entryTypeName === this.translateService.instant('EIM.LABEL_02017')) {
				assignData[i].entryTypeName = ENTRY_TYPE_NAME.USER;
			} else if (assignData[i].entryTypeName === this.translateService.instant('EIM.LABEL_02055')) {
				assignData[i].entryTypeName = ENTRY_TYPE_NAME.SYSFUNC;
			}
			entryTypeList.push(assignData[i].entryTypeName);
		}

		let paramIdList;
		let paramEntryTypeList;
		if (idList.length === 0) {
			paramIdList = '';
			paramEntryTypeList = ''
		} else {
			paramIdList = idList;
			paramEntryTypeList = entryTypeList;
		}

		let params = {entryIds: paramIdList, entryTypes: paramEntryTypeList, objId: this.objData.id, statusId: this.nowStatus.id, statusTypeId: this.objData.statusTypeId}
		this.objectEditorsWorkFlowService.updateAssign(params).subscribe(
			(data: any) => {
				this.updated.emit(data);
				this.dirty = true;
			}
		);
	}

	/**
	 * 更新可否を返却します.
	 * @return 更新可否
	 */
	public updatable(): boolean {
		return this.dirty;
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (a.entryId == b.entryId);
	}
	
	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 名前
		columns.push({field: 'entryName', cellRendererFramework: EIMUserIconRendererComponent, headerName: this.translateService.instant('EIM.LABEL_02002'),  suppressFilter: true, width: 200});
		// アサイン先エントリー
		columns.push({field: 'belongName', headerName: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02014'),  suppressFilter: true, width: 362});
		this.assignDataGrid.setColumns(columns);
		// オブジェクト情報を取得
		this.getObjectDetail();
	}

	/**
	 * アサインデータグリッド押下時のイベントハンドラです.
	 */
	onSelectAssignDataGrid(): void {
		// 行選択されている場合
		if (this.assignDataGrid.getSelectedData().length === 0) {
			this.menuDelete.disabled = true;
		} else {
			this.menuDelete.disabled = false;
		}
	}

	/**
	 * 削除メニュー押下時のイベントハンドラです.
	 */
	onCkickDeleteAssignUser(): void {
		let rowIndex = this.assignDataGrid.getRowIndex();
		this.assignDataGrid.removeRowData(this.assignDataGrid.getSelectedData());
		this.assignDataGrid.setSelectRow(rowIndex);
		this.dirty = true;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 選択メニュー押下時の処理です.
	 */
	private onClickShowAssignMember(): void {
		let gridData = this.assignDataGrid.getData();
		let dialogId: string = this.objectEditorDialogManagerComponentService.showAssignSelector(gridData, {}, {
			selected: (selectData) => {
				this.objectEditorDialogManagerComponentService.close(dialogId);
				let addData = [];
					// 選択後のデータをmapに格納
					let afterMap = new Map();
					for (let i = 0; i < selectData.length; i++) {
						afterMap.set(selectData[i].entryId, selectData[i]);
						// 選択前のデータに存在しない場合、追加データと判断
						let mapData: AssignDTO = this.beforeMap.get(selectData[i].entryId);
						if (!mapData) {
                            Object.assign(selectData[i], {addedDataFlag: 1});
						} else {
							selectData[i] = mapData;
						}
					}
					// アサイン追加の結果をアサインデータグリッドに表示する
					this.assignDataGrid.setData(selectData);
					// 更新有無フラグを有に変更する
					this.dirty = true;
				}
			});
	}

	/**
	 * オブジェクト情報を取得します.
	 */
	private getObjectDetail(): void {
		this.objectEditorsWorkFlowService.getObjectDetail(this.objData.id).subscribe((data: ObjectDetailDTO) => {
			this.workflow = data.workFlow;
			this.nowStatus = data.status;
			this.getAssignDetail();
		}, (err: any) => {
			window.setTimeout(() => {
				this.errored.emit(err);
			});
		});
	}

	/**
	 * アサイン一覧情報を取得します.
	 */
	private getAssignDetail(): void {
		this.objectEditorsWorkFlowService.getAssignList(this.objData.id).subscribe((data: AssignDTO[]) => {
			this.assignDataGrid.setData(data);
			// 選択前のデータをmapに格納
			for (let i = 0; i < data.length; i++) {
				this.beforeMap.set(data[i].entryId, data[i]);
			}
		}, (err: any) => {
			window.setTimeout(() => {
				this.errored.emit(err);
			});
		});
	}
}
