import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, forwardRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EIMComponent, EIMHierarchicalDomain, EIMMenuItem } from 'app/shared/shared.interface';
import { MenuItem } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMAdminsTaskIconClassFunctionService } from 'app/admins/shared/services/admins-task-icon-class-function.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMObjectRoleService } from 'app/shared/services/apis/object-role.service';
import { EIMObjectRoleDomain } from 'app/shared/domains/entity/object-role.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMTreeDataGridComponentService, EIMTreeDataGridNode } from 'app/shared/components/tree-data-grid/tree-data-grid.component.service';
import { EIMTreeDataGridColumn, EIMTreeDataGridComponent } from 'app/shared/components/tree-data-grid/tree-data-grid.component';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { PanelModule } from 'primeng/panel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

/**
 * 役割管理コンポーネント
 * @example
 *
 *      <eim-object-role
 *      >
 *      </eim-object-role>
 */
@Component({
	selector: 'eim-object-role',
	templateUrl: './object-role.component.html',
	styleUrls: ['./object-role.component.scss'],
	imports: [
		CommonModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe, 

		PanelModule,
		FormsModule,
		ReactiveFormsModule,
		TooltipModule 
	],
	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMObjectRoleComponent)}, ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMObjectRoleComponent {

	/** データグリッド */
	@ViewChild('objectRoleDataGrid', { static: true }) objectRoleDataGrid: EIMTreeDataGridComponent;

	/** 画面識別ID */
	public viewId = 'ObjectRole';

	/** 表示中のダイアログ名 */
	public viewDialogName = null;

	/** 選択された業務役割情報 */
	public selectedDto = null;

	/* ==========================================================================
     メニューの定義
     ========================================================================== */

	/** 役割登録 */
	public menuCreateRoleGroupRole: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03005'), name: 'createTask', icon: 'eim-icon-plus',
		command: (event) => {this.viewDialogName = 'objectRoleCreator';}
	};
	/** 役割更新 */
	public menuUpdateRoleGroupRole: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03004'), disabled: true, icon: 'eim-icon-pencil',
		command: (event) => {this.viewDialogName = 'objectRoleUpdator';}
	};
	/** 役割削除 */
	public menuDeleteRoleGroupRole: EIMMenuItem = {
		label: this.translateService.instant('EIM.LABEL_03003'), disabled: true, icon: 'eim-icon-trash',
		command: (event) => {this.onClickDeleteObjectRole(this.objectRoleDataGrid.getSelectedData());}
	};

	// セパレータ
	public menuSeparator: MenuItem = {separator: true};

	/** データグリッドメニュー */
	public dataGridMenuItems: EIMMenuItem[] = [
		// 登録
		this.menuCreateRoleGroupRole,
		this.menuUpdateRoleGroupRole,
		this.menuDeleteRoleGroupRole,
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		public treeComponentService: EIMTreeComponentService,
		protected translateService: TranslateService,
		protected taskIconClassFunctionService: EIMAdminsTaskIconClassFunctionService,
		protected messageService: EIMMessageService,
		protected objectRoleService: EIMObjectRoleService,
		protected localStorageService: EIMLocalStorageService,
		protected treeDataGridComponentService: EIMTreeDataGridComponentService
	) {
		// TranslateServiceでリソースが利用可能かどうかを判定する
		let checkKey: string = 'EIM_TASKS.LABEL_01000';
		let checkValue: string = this.translateService.instant(checkKey);
		if (checkKey !== checkValue) {
			// キーと値が一致していない場合はキーから値を取得できているので利用可能とみなす
			// メニューアイテムラベルを更新する
			this.refreshMenuItemLabel();
		}

		this.setObjectRoleTreeData();
	}
	/**
	 * メニューアイテムラベルをリフレッシュします.
	 */
	public refreshMenuItemLabel(): void {
		let changeLabel: (menuItems: EIMMenuItem[]) => void = (menuItems: EIMMenuItem[]) => {
			for (let i = 0; i < menuItems.length; i++) {
				let menuItem: EIMMenuItem = menuItems[i];
				if (menuItem.hasOwnProperty('rKey')) {
					menuItem.label = this.translateService.instant(menuItem.rKey);
				}
				if (menuItem.items && menuItem.items.length > 0) {
					changeLabel(menuItem.items);
				}
			}
		};
		changeLabel(this.dataGridMenuItems);
		let newMenuItems: EIMMenuItem[] = Object.assign([], this.dataGridMenuItems);
		this.dataGridMenuItems = newMenuItems;
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
		public setState(state: any): void {
			// if (!state) {
			// 	this.show();
			// 	return;
			// }

			// // 復元します
			// this.workspaceDataGrid.setState(state.workspaceDataGrid);
			// window.setTimeout(() => {
			// 	this.splitAreaLeftSize = state.splitAreaLeftSize;
			// 	this.onSelectedWorkspace();
			// });
		}

		/**
		 * 画面の状態を返却します.
		 * @return 状態
		 */
		public getState(): any {
			return {
				// workspaceDataGrid: this.workspaceDataGrid.getState(),
				// splitAreaLeftSize: this.splitAreaLeftSize,
			};
		}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		this.setObjectRoleDataGridColumns();
	}

	public onCloseDialog() {
		this.viewDialogName = null;
	}

	/**
	 * 業務役割一覧の行選択時のイベントハンドラです.
	 *
	 * @param event イベント
	 */
	public onSelectedRow(event: any): void {

		this.changeDisabledMenuButton();

		if (event.selectedData !== null && event.selectedData.length === 1) {
			this.selectedDto = event.selectedData[0].data;
		} else {
			this.selectedDto = null;
		}

	}

	/**
	 * 業務役割登録イベントハンドラ
	 *
	 * @param result 業務役割登録結果情報
	 */
	public onCreatedObjectRole(result: EIMObjectRoleDomain): void {
		this.viewDialogName = null;

		let node: EIMTreeDataGridNode = this.convertToEIMTreeDataGridNode(result);
		this.objectRoleDataGrid.addNode(null, [node]);

		// 完了メッセージ表示
		this.messageService.showGrowl(
			this.translateService.instant('EIM_ADMINS.INFO_00001', {value: this.translateService.instant('EIM_ADMINS.LABEL_02370')}));
	}

	/**
	 * 業務役割更新イベントハンドラ
	 *
	 * @param result 業務役割更新結果情報
	 */
	public onUpdatedObjectRole(result: EIMObjectRoleDomain): void {
		this.viewDialogName = null;

		this.setObjectRoleTreeData();
		// 完了メッセージ表示
		this.messageService.showGrowl(
			this.translateService.instant('EIM_ADMINS.INFO_00002', {value: this.translateService.instant('EIM_ADMINS.LABEL_02370')}));
	}

	/**
	 * 業務役割削除クリックイベントハンドラです.
	 *
	 * @param treeDataGridNodes
	 */
	public onClickDeleteObjectRole(treeDataGridNodes: EIMTreeDataGridNode[]) {

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00048' , {value: this.translateService.instant('EIM_ADMINS.LABEL_02370')}) ,
			() => {

				for (let treeDataGridNode of treeDataGridNodes) {
					this.objectRoleService.delete(treeDataGridNode.data).subscribe(() => {

						let deletedObjectRole = treeDataGridNode.data;
						let objectRoleNode: EIMTreeDataGridNode = this.convertToEIMTreeDataGridNode(deletedObjectRole);
						this.objectRoleDataGrid.deleteNode([objectRoleNode]);

						// 完了メッセージ表示
						this.messageService.showGrowl(
							this.translateService.instant('EIM_ADMINS.INFO_00003', {value: this.translateService.instant('EIM_ADMINS.LABEL_02370')}));

					});
				}
			}
		);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 役割グループ一覧のデータを設定します.
	 */
	private setObjectRoleTreeData(): void {

	// 	業務役割一覧取得条件設定
		this.objectRoleService.getList(null).subscribe((res: any) => {

			let objectRoles: EIMObjectRoleDomain[] = res;

			let objectRoleNodes: EIMTreeDataGridNode[] = [];
			for (let objectRole of objectRoles) {
				objectRoleNodes.push(this.convertToEIMTreeDataGridNode(objectRole));
			}
			this.objectRoleDataGrid.setData(objectRoleNodes);
		});
	}

	/**
	 * 業務役割一覧のカラムを設定します.
	 */
	private setObjectRoleDataGridColumns(): void {
		let columns: EIMTreeDataGridColumn[] = [];

		// 定義名称
		columns.push({ field: 'definitionName', headerName: this.translateService.instant('EIM.LABEL_02021'), width: 300 });

		// 表示名称
		columns.push({ field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02361') });

		this.objectRoleDataGrid.setColumns(columns);

	}

	/**
	 * 業務役割情報をツリーデータグリッドのノード情報に変換して返却します.
	 * @param objectRole 業務役割情報
	 * @returns ツリーデータグリッドのノード情報
	 */
	private convertToEIMTreeDataGridNode(objectRole: EIMObjectRoleDomain): EIMTreeDataGridNode {
		return {
				data: objectRole,
				leaf: true
		}
	}

	/**
	 * 業務役割のメニューボタンの有効/無効を切り替えます.
	 */
	private changeDisabledMenuButton(): void {
		if (this.objectRoleDataGrid.getSelectedData().length === 0) {
			this.menuUpdateRoleGroupRole.disabled = true;
			this.menuDeleteRoleGroupRole.disabled = true;
		} else {
			this.menuUpdateRoleGroupRole.disabled = false;
			this.menuDeleteRoleGroupRole.disabled = false;
		}
	}
}
