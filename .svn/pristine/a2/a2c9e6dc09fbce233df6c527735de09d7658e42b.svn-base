import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { MenuItem } from 'primeng/api';
import { EIMWorkspaceDTO } from 'app/admins/shared/dtos/workspace.dto';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMAdminsWorkspaceService } from 'app/admins/shared/services/apis/admins-workspace.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMWorkspaceCreatorComponent } from 'app/documents/components/workspace-creator/workspace-creator.component';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { EIMDocumentsModule } from 'app/documents/documents.module';

/**
 * ワークスペースコンポーネント
 * @example
 *
 *      <eim-workspace>
 *      </eim-workspace>
 */
@Component({
	selector: 'eim-workspace',
	templateUrl: './workspace.component.html',
	styleUrls: ['./workspace.component.css'],
	imports: [
		CommonModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,

		AngularSplitModule,
		PanelModule, 

		EIMDocumentsModule
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMWorkspaceComponent implements EIMAdminMainComponent, OnInit, OnChanges {

	/** ワークスペースデータグリッド */
	@ViewChild('workspaceDataGrid', { static: true })
		workspaceDataGrid: EIMDataGridComponent;

	/** ワークスペース情報 */
	@ViewChild('workspaceInfoList', { static: true })
		workspaceInfoList: EIMWorkspaceCreatorComponent;

	/** スプリットエリア左部サイズ */
	@Input() splitAreaLeftSize = 32;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 画面識別ID */
	public viewId = 'Workspace';

	public wsId = null;


	/** ワークスペース一覧のメニュー（ボタン） */
	public workspaceMenuItems: MenuItem[] = [
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', command: ($event) => {this.showWorkspaceCreator(); }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: ($event) => {this.showWorkspaceUpdator(); }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => {this.showWorkspaceDeletor(); }
		},
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03036'), icon: 'eim-icon-list', disabled: true, command: ($event) => {this.showWorkspaceProperty(); }
		},
	];

	/** ワークスペースのコンテキストメニュー（右メニュー） */
	public workspaceContentsMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', command: ($event) => {this.showWorkspaceUpdator(); }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', command: ($event) => {this.showWorkspaceDeletor(); }
		},
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03036'), icon: 'eim-icon-list', command: ($event) => {this.showWorkspaceProperty(); }
		},
	];

	/** 選択ワークスペースID */
	private selectedWorkspaceId = 0;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected messageService: EIMMessageService,
			protected translateService: TranslateService,
			protected adminsWorkspaceService: EIMAdminsWorkspaceService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * ワークスペース登録ダイアログを表示します.
	 */
	public showWorkspaceCreator(): void {
		let dialogId: string = this.adminDialogManagerComponentService.showWorkspaceCreator(null, {
			created: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				// 追加ワークスペースを選択している状態の設定
				let objId = data[0].objId;
				this.workspaceComplete(Number(objId));
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02272')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ワークスペース更新ダイアログを表示します.
	 */
	public showWorkspaceUpdator(): void {
		// 選択したワークスペース取得
		let selectedDataList = this.workspaceDataGrid.getSelectedData();
		if (!selectedDataList || selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];

		let dialogId: string = this.adminDialogManagerComponentService.showWorkspaceCreator(selectedData.wsId, {
			updated: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				// 更新ワークスペースを選択している状態の設定
				let objId = this.wsId;
				this.workspaceComplete(Number(objId));
				// 変更ワークスペース最新情報を表示する。
				this.workspaceInfoList.objId = this.wsId;
				this.workspaceInfoList.refresh();
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02272')}));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});

	}

	/**
	 * ワークスペースを削除します.
	 */
	public showWorkspaceDeletor(): void {
		// 選択したワークスペース取得
		let selectedDataList = this.workspaceDataGrid.getSelectedData();
		if (!selectedDataList || selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00005' , {value: selectedData.typeLabel}) ,
			() => {
				this.adminsWorkspaceService.delete(selectedData.wsId).subscribe(
					(data: any) => {
						this.workspaceComplete();
						this.workspaceInfoList.objId = null;
						this.workspaceInfoList.refresh();
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02272')}));
					}
				);
		});
	}

	/**
	 * ワークスペースのプロパティを表示します.
	 */
	public showWorkspaceProperty(): void {
		// 選択したワークスペース取得
		let selectedDataList = this.workspaceDataGrid.getSelectedData();
		if (!selectedDataList || selectedDataList.length !== 1) {
			return;
		}
		let selectedData = selectedDataList[0];
		let dialogId: string = this.adminDialogManagerComponentService.showProperty(selectedData, false, {
			updated: (data) => {
				this.adminDialogManagerComponentService.close(dialogId);
				this.workspaceComplete(Number(data.workspaceId));
			},
			errored: () => {
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
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
		this.workspaceDataGrid.setState(state.workspaceDataGrid);
		window.setTimeout(() => {
			this.splitAreaLeftSize = state.splitAreaLeftSize;
			this.onSelectedWorkspace();
		});
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			workspaceDataGrid: this.workspaceDataGrid.getState(),
			splitAreaLeftSize: this.splitAreaLeftSize,
		};
	}

	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public workspaceDataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.wsId === obj2.wsId);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columnsWorkspace: EIMDataGridColumn[] = [];
		// ワークスペース一覧項目
		columnsWorkspace.push({field: 'typeLabel', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02272'), width: 403, cellRendererFramework: EIMAdminNameRendererComponent});
		this.workspaceDataGrid.setColumns(columnsWorkspace);
		this.workspaceDataGrid.showAllSelectButton = false;
		this.workspaceDataGrid.multiple = false;
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes SimpleChanges
	 */
	ngOnChanges(changes: SimpleChanges): void {
		this.show();
	}

	/**
	 * ワークスペース選択時のイベントハンドラ
	 */
	public onSelectedWorkspace(): void {
		// ワークスペース表示
		// 選択したワークスペース取得
		let selectedDataList = this.workspaceDataGrid.getSelectedData();
		if (!selectedDataList || selectedDataList.length !== 1) {
			// 未選択時初期化
			this.selectedWorkspaceId = 0;
			this.workspaceInfoList.objId = null;
			this.workspaceInfoList.refresh();
			// ボタンの活性制御処理
			this.setButtonEnable();
			return;
		}
		let selectedData = selectedDataList[0];
		this.wsId = selectedData.wsId;

		// ワークスペース情報表示のリフレッシュ
		this.workspaceInfoList.objId = this.workspaceDataGrid.getSelectedData()[0].wsId;
		this.workspaceInfoList.refresh();

		// ボタンの活性制御処理
		this.setButtonEnable();

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

	/**
	 * ワークスペース登録・更新・削除の完了後処理
	 * @param workspaceId ワークスペースID
	 */
	private workspaceComplete(workspaceId?: number): void {
		// ワークスペースリストを表示します．
		this.show(workspaceId);
	}

	/**
	 * ワークスペース一覧を表示します.
	 * @param workspaceId ワークスペースID
	 */
	private show(workspaceId?: number): void {
		// ワークスペース一覧を取得します．
		this.adminsWorkspaceService.getList().subscribe(
			(workspaces: EIMWorkspaceDTO[]) => {
				if (workspaces && workspaces.length > 0) {
					for (let i = 0; i < workspaces.length; i++ ) {
						workspaces[i].objId = workspaces[i].wsId;
					}
				}

				this.workspaceDataGrid.setData(workspaces);
				if (workspaceId) {
					let loopCnt = workspaces.length;
					let workspace: EIMWorkspaceDTO;
					for (let idx = 0; idx < loopCnt; idx++) {
						workspace = workspaces[idx];
						if (workspaceId === Number(workspace.wsId)) {
							this.workspaceDataGrid.select([workspace], false);
							// 選択行へのスクロール
							let rowIndex: number = this.workspaceDataGrid.getRowIndex();
							this.workspaceDataGrid.ensureIndexVisible(rowIndex);
							break;
						}
					}
				}
				// ボタンの活性制御処理
				this.setButtonEnable();
			}
		);
	}

	/**
	 * ボタンの活性制御処理
	 */
	private setButtonEnable(): void {
		// 選択したワークスペース取得
		let selectedWorkspaceList = this.workspaceDataGrid.getSelectedData();
		if (selectedWorkspaceList && selectedWorkspaceList.length === 1) {
			// ワークスペース更新・削除ボタン活性にします。
			this.workspaceMenuItems[1].disabled = false;
			this.workspaceMenuItems[2].disabled = false;
			this.workspaceMenuItems[3].disabled = false;
			this.workspaceContentsMenuItems[0].disabled = false;
			this.workspaceContentsMenuItems[1].disabled = false;
			this.workspaceContentsMenuItems[2].disabled = false;

		} else {
			// ワークスペース更新・削除ボタン非活性にします。
			this.workspaceMenuItems[1].disabled = true;
			this.workspaceMenuItems[2].disabled = true;
			this.workspaceMenuItems[3].disabled = true;
			this.workspaceContentsMenuItems[0].disabled = true;
			this.workspaceContentsMenuItems[1].disabled = true;
			this.workspaceContentsMenuItems[2].disabled = true;
		}
	}
}
