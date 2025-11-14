import { Component, forwardRef, ViewChild, OnInit, Input, Directive } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';

import { EIMAdminsSecurityService, EIMSecurityTreeNode } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMEntryDTO } from 'app/shared/dtos/entry.dto';
import { EIMRoleDTO } from 'app/admins/shared/dtos/role.dto';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMSecurityRendererComponent } from 'app/admins/shared/components/renderer/security-renderer.component';

/**
 * セキュリティ管理コンポーネント
 */
@Directive()
export abstract class EIMSecurityComponent implements EIMAdminMainComponent, OnInit {

	/** セキュリティツリー */
	@ViewChild('securityTypeTree', { static: true })
	securityTypeTree: EIMTreeComponent;

	/** アクセスエントリーデータグリッド */
	@ViewChild('accessEntryDataGrid', { static: true })
	accessEntryDataGrid: EIMDataGridComponent;

	/** スプリットエリア左部サイズ */
	public splitAreaLeftSize = 25;

	/** システム管理アプリケーション種別ID */
	public adminAppId = '';

	/** アクセス権限を表示するかどうか */
	public accessRoleDispFlag = false;

	/** アクセス権限更新ボタン押下可否 */
	public accessRoleUpdatableFlag = false;

	/** 上書チェックボックスを表示するかどうか */
	public overwriteFlag = false;

	/** 検索条件 */
	public securityName = '';

	// アクセス権限リスト
	public accessRoleList: EIMRoleDTO[];

	/** 入力最大数 */
	public inputMaxLength = EIMConstantService.INPUT_MAX_LENGTH;

	/** ビューID */
	public viewId = 'Security';

	/** 初期検索フラグ */
	public initFlag = true;

	/** アクセス権限：許可 */
	public accessAdmit = '1';

	/** アクセス権限：拒否 */
	public accessRefuse = '0';

	/** アクセス権限：無視 */
	public accessPass = '2';

	/** セキュリティ一覧メニュー */
	protected securityCreateMenu = { label: this.translateService.instant('EIM_ADMINS.LABEL_03016'), icon: 'eim-icon-plus', command: ($event) => { this.showSecurityCreator(); } };
	protected statusCreateMenu = { label: this.translateService.instant('EIM_ADMINS.LABEL_03017'), icon: 'eim-icon-plus', disabled: true, command: ($event) => { this.showStatusSecurityCreator(); } };
	protected securityUpdeteMenu = { label: this.translateService.instant('EIM_ADMINS.LABEL_03018'), icon: 'eim-icon-pencil', disabled: true, command: ($event) => { this.showSecurityUpdator(); } };
	protected statusUpdeteMenu = { label: this.translateService.instant('EIM_ADMINS.LABEL_03019'), icon: 'eim-icon-pencil', disabled: true, command: ($event) => { this.showStatusSecurityUpdator(); } };
	protected statusCopyMenu = { label: this.translateService.instant('EIM_ADMINS.LABEL_03020'), icon: 'eim-icon-plus', disabled: true, command: ($event) => { this.showStatusSecurityCopy(); } };
	protected deleteMenu = { label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => { this.onClickSecurityDelete(); } };

	/** アクセスエントリーメニュー */
	protected entrySelectMenu = { label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: true, command: ($event) => { this.showEntrySelector(); } };
	protected entryDeleteMenu = { label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: ($event) => { this.onClickEntryDelete(); } };

	/** セキュリティ一覧のコンテキストメニュー */
	public entryMenuItems: EIMMenuItem[] = [
		this.entrySelectMenu,
		this.entryDeleteMenu,
	];

	/** アクセスエントリーのコンテキストメニュー */
	public entryContextMenuItems: EIMMenuItem[] = [
		this.entryDeleteMenu,
	];

	/** 選択セキュリティID */
	private selectedSecurityId = 0;

	/** 選択セキュリティツリーノードID */
	private selectedSecId = 0;

	/** 選択アクセスエントリーID */
	private selectedEntryId = null;

	/** 削除後選択親ノード */
	private tempTreeNode: EIMTreeNode;

	/** 登録・更新後親ノード */
	private tempCreatedTreeNode: EIMTreeNode;

	/** アクセス権限リスト */
	protected allAccessRoleList: EIMRoleDTO[];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected securityService: EIMAdminsSecurityService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
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
			this.onSearchSecurity();
			return;
		}
		this.initFlag = false;
		// 復元します
		this.securityTypeTree.setState(state.securityTypeTree);
		this.accessEntryDataGrid.setState(state.accessEntryDataGrid);
		this.accessRoleList = state.accessRoleList;
		this.accessRoleDispFlag = state.accessRoleDispFlag;
		this.accessRoleUpdatableFlag = state.accessRoleUpdatableFlag;
		this.securityName = state.securityName;
		this.overwriteFlag = state.overwriteFlag;
		this.selectedSecId = state.selectedSecId
		window.setTimeout(() => {
			this.splitAreaLeftSize = state.splitAreaLeftSize;
			// ボタンの活性制御処理
			this.setButtonEnable();
		});
	}


	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			securityTypeTree: this.securityTypeTree.getState(),
			accessEntryDataGrid: this.accessEntryDataGrid.getState(),
			accessRoleList: this.accessRoleList,
			accessRoleDispFlag: this.accessRoleDispFlag,
			accessRoleUpdatableFlag: this.accessRoleUpdatableFlag,
			splitAreaLeftSize: this.splitAreaLeftSize,
			securityName: this.securityName,
			overwriteFlag: this.overwriteFlag,
			selectedSecId: this.selectedSecId,
		};
	}

	/**
	 * セキュリティツリー同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsSecurity(obj1: any, obj2: any): boolean {
		return (obj1.data.id === obj2.data.id && ((obj1.parent && obj2.parent && obj1.parent.data.id === obj2.parent.data.id) || obj1.parent === obj2.parent));
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 検索ボタンクリック時のイベントハンドラ
	 * 検索条件に合致するセキュリティ一覧を表示します.
	 * @param secId セキュリティID
	 */
	onSearchSecurity(secId?: number): void {

		this.securityService.getList(this.securityName, this.initFlag).subscribe((treeNodes: any) => {
			this.securityTypeTree.select([]);
			this.securityTypeTree.setData(treeNodes);
			// アクセスエントリー一覧クリア
			this.accessEntryDataGrid.setData([]);

			// 選択対象が指定されている場合は、選択処理を行う
			window.setTimeout(() => {
				if (secId) {
					let target = { id: Number(secId) };
					let targetNode: EIMTreeNode;

					if (this.tempTreeNode && this.tempTreeNode.parent) {
						targetNode = { data: { id: this.tempTreeNode.parent['data'].id } };
					} else if (this.tempCreatedTreeNode) {
						targetNode = { data: { id: this.tempCreatedTreeNode.objId } };
					}
					window.setTimeout(() => {
						this.securityTypeTree.select([{ data: target, parent: targetNode }], true);
						if (this.securityTypeTree.getSelectedData().length === 0) {
							if (this.tempTreeNode) {
								this.securityTypeTree.select([this.tempTreeNode.parent], true);
							} else if (this.tempCreatedTreeNode) {
								this.securityTypeTree.select([this.tempCreatedTreeNode], true);
							}
						}
						this.tempTreeNode = null;
						this.tempCreatedTreeNode = null;
					});
				}
				// ボタンの活性制御処理
				this.setButtonEnable();
			});
		});
		this.initFlag = false;
	}


	/**
	 * 上書きチェックボックス変更時のイベントハンドラです.
	 * @param index 入力インデックス
	 */
	onChangeOverWrite(index: number) {
		// offに変更時
		if (!this.accessRoleList[index].roleChk) {
			// 権限オプションボタンをデフォルト値に戻す
			this.accessRoleList[index].permit = this.accessRoleList[index].defaultPermit;
		}
		this.accessRoleUpdatableFlag = true;
	}


	/**
	 * アクセスエントリー選択時イベントハンドラです.
	 */
	onSelectAccessEntry(): void {
		// 更新ボタンを非活性化
		this.accessRoleUpdatableFlag = false;
		// 選択したアクセスエントリー取得
		let selectedDataList = this.accessEntryDataGrid.getSelectedData();
		if (selectedDataList.length === 0) {
			// アクセス権限リセット
			this.accessRoleList = [];
			this.accessRoleDispFlag = false;
			// ボタンの活性制御処理
			this.setButtonEnable();
			this.selectedEntryId = null;
			return;
		}
		this.selectedEntryId = selectedDataList[0].entryId;
		// 選択したセキュリティー取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();
		let stSecId = this.getSecurityTreeNode(secTreeNodeList[0]).stSecId;
		let secId = this.getSecurityTreeNode(secTreeNodeList[0]).secId;

		// 権限一覧を取得します
		this.securityService.getRoleList(selectedDataList[0].entryId, stSecId).subscribe(
			(roleList: EIMRoleDTO[]) => {
				if (this.selectedEntryId !== selectedDataList[0].entryId) {
					return;
				}
				this.allAccessRoleList = roleList;
				this.accessRoleUpdatableFlag = false;
				let roleListDisp: EIMRoleDTO[] = [];
				for (let i = 0; i < roleList.length; i++) {
					let role = roleList[i];

					if (stSecId) {
						this.overwriteFlag = true;
						// 上書きチェックボックス値判定
						if (role.hasOwnProperty('stsecList') && 1 < role.stsecList.length) {
							role.roleChk = true;
						}
					} else {
						this.overwriteFlag = false;
					}

					this.convertAccessRoleList(roleListDisp, role);
				}

				this.accessRoleList = roleListDisp;

				// アクセス権限を表示するかどうか
				if (0 < this.accessRoleList.length && this.selectedSecId === stSecId) {
					this.accessRoleDispFlag = true;
				} else if (0 < this.accessRoleList.length && this.selectedSecId === secId) {
					this.accessRoleDispFlag = true;
				} else {
					this.accessRoleDispFlag = false;
					this.accessRoleUpdatableFlag = false;
				}

				// ボタンの活性制御処理
				this.setButtonEnable();
			}, (err: any) => {
				// エラーの場合
				this.accessRoleList = [];
				this.accessRoleDispFlag = false;
				this.accessRoleUpdatableFlag = false;
			}
		);
	}

	/**
	 * エントリ選択ボタン押下時のイベントハンドラ
	 */
	showEntrySelector(): void {
		let selectedData = this.securityTypeTree.getSelectedData();
		if (selectedData && selectedData.length === 1) {

			let secId = this.getSecurityTreeNode(selectedData[0]).secId;
			let gridData = this.accessEntryDataGrid.getData();

			let dialogId: string = this.adminDialogManagerComponentService.showEntrySelector(secId, gridData, {}, "0", {
				selected: (data) => {
					let addData = [];
					let removeData = [];

					// 選択前のデータをmapに格納
					let beforeMap = new Map();
					for (let i = 0; i < gridData.length; i++) {
						beforeMap.set(gridData[i].entryId, gridData[i]);
					}
					// 選択後のデータをmapに格納
					let afterMap = new Map();
					for (let i = 0; i < data.length; i++) {
						afterMap.set(data[i].entryId, data[i]);

						// 選択前のデータに存在しない場合、追加データと判断
						let mapData = beforeMap.get(data[i].entryId);
						if (!mapData) {
							addData.push(data[i]);
						}
					}

					// 選択後データに存在しない場合、削除データと判断
					for (let i = 0; i < gridData.length; i++) {
						let mapData = afterMap.get(gridData[i].entryId);
						if (!mapData) {
							removeData.push(gridData[i]);
						}
					}
					if (0 < removeData.length) {
						this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_ADMINS.CONFIRM_00025'),
							() => {
								// 登録処理実行
								if (0 < addData.length) {
									this.securityService.createEntry(secId, addData).subscribe(
										() => {
											// 削除処理実行
											this.deleteEntry(removeData, secId);
											this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
										}, (err: any) => {
											return;
										}
									);
								} else {
									// 削除処理実行
									this.deleteEntry(removeData, secId);
									this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
								}
								// エントリ選択画面をクローズ
								this.adminDialogManagerComponentService.close(dialogId);
							}, () => {
								return;
							}
						);
					} else {
						if (0 < addData.length) {
							this.securityService.createEntry(secId, addData).subscribe(
								() => {
									this.entryComplete(secId);
									this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
								}, (err: any) => {
									return;
								}
							);
						}
						// エントリ選択画面をクローズ
						this.adminDialogManagerComponentService.close(dialogId);
					}
				}
			});
		}
	}

	/**
	 * アクセスエントリー削除ボタン押下時のイベントハンドラ
	 */
	onClickEntryDelete(): void {
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();

		if (secTreeNodeList.length === 0) {
			return;
		}
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);

		// 選択したアクセスエントリー取得
		let entryDataList = this.accessEntryDataGrid.getSelectedData();
		if (entryDataList.length === 0) {
			return;
		}
		let entrydData = entryDataList[0];

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00004', { value: entrydData.entryName }),
			() => {
				this.securityService.deleteEntry(secTreeNode.secId, entrydData.entryId).subscribe(
					(data: any) => {
						this.entryComplete(secTreeNode.secId);
						this.accessEntryDataGrid.getSelectedData().length = 0;
						this.setButtonEnable();
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
					},
					(err: any) => {
					}
				);
			});
	}

	/**
	 * 更新ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickUpdate(event: any): void {

		let secTreeNodeList = this.securityTypeTree.getSelectedData();
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);
		let entryDataList = this.accessEntryDataGrid.getSelectedData();
		let secId: number;
		let isDefaultSec: boolean;

		if (secTreeNode.stSecId) {
			secId = secTreeNode.stSecId;
			isDefaultSec = false;
		} else {
			secId = secTreeNode.secId;
			isDefaultSec = true;
		}

		if (this.adminAppId === 'task') {
			// 参照（公開読取）の設定を常時読取にも反映する
			const readRole = this.accessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_READ);
			const openReadRole = this.allAccessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_OPEN_READ);
			if (readRole && openReadRole) {
				openReadRole.permit = readRole.permit;
				this.accessRoleList.push(openReadRole);
			}
		}

		this.securityService.updateRole(secId, entryDataList[0].entryId, isDefaultSec, this.accessRoleList).subscribe(() => {
			this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02031') }));
			// アクセスエントリーの情報を再取得
			this.onSelectAccessEntry();
		});
	}


	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		let accessEntryColumns: EIMDataGridColumn[] = [];
		accessEntryColumns = [];
		// 優先順位
		accessEntryColumns.push({ field: 'priority', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02019'), width: 65, suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMSecurityRendererComponent,});
		// タイプ
		accessEntryColumns.push({ field: 'entryTypeName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02020'), width: 140, suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMSecurityRendererComponent, });
		// 名前
		accessEntryColumns.push({ field: 'entryName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 390, suppressFilter: true, suppressSorting: true, cellRendererFramework: EIMSecurityRendererComponent, });

		this.accessEntryDataGrid.setColumns(accessEntryColumns);
		this.accessEntryDataGrid.showAllSelectButton = false;
		this.accessEntryDataGrid.multiple = false;
	}


	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickUp(event: any): void {

		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();
		if (secTreeNodeList.length === 0) {
			return;
		}
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);
		// 選択したアクセスエントリー取得
		let entryDataList = this.accessEntryDataGrid.getSelectedData();
		// 未選択時は処理なし
		if (entryDataList.length === 0) {
			return;
		}
		let entrydData = entryDataList[0];
		// 優先度が最高の場合は処理なし
		if (this.accessEntryDataGrid.getTargetRowIndex(entrydData) === 0) {
			return;
		}
		this.accessEntryDataGrid.setData([]);
		this.securityService.updateEntryPriority(secTreeNode.secId, entrydData.entryId, Number(entrydData.priority) - 1).subscribe((data: any) => {
			// アクセスエントリー一覧を取得します．
			this.entryComplete(secTreeNode.secId, entrydData.entryId);
		});
	}


	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event: any): void {
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();
		if (secTreeNodeList.length === 0) {
			return;
		}
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);

		// 選択したアクセスエントリー取得
		let entryDataList = this.accessEntryDataGrid.getSelectedData();
		// 未選択時は処理なし
		if (entryDataList.length === 0) {
			return;
		}
		let entrydData = entryDataList[0];
		// 優先度が最低の場合は処理なし
		if (Number(entrydData.priority) === this.accessEntryDataGrid.getData().length) {
			return;
		}
		this.accessEntryDataGrid.setData([]);
		this.securityService.updateEntryPriority(secTreeNode.secId, entrydData.entryId, Number(entrydData.priority) + 1).subscribe((data: any) => {
			// アクセスエントリー一覧を取得します．
			this.entryComplete(secTreeNode.secId, entrydData.entryId);
		});
	}

	/**
	 * セキュリティツリーノード選択ハンドラ.
	 * アクセスエントリー一覧を更新します.
	 * @param event イベント
	 */
	onSelectSecurityTreeNode(event: any): void {
		this.selectedSecId = 0;
		this.selectedEntryId = null;
		// ボタンを非活性化
		this.entrySelectMenu.disabled = true;
		this.entryDeleteMenu.disabled = true;

		// 選択データがない場合は活性制御をして抜ける
		if (event.selectedData.length === 0) {
			// クリア
			this.selectedSecurityId = 0;
			this.accessEntryDataGrid.setData([]);
			this.selectedSecId = 0;
			this.selectedEntryId = null;
			// アクセス権限をクリア
			this.accessRoleList = [];
			this.accessRoleDispFlag = false;
			// ボタンの活性制御処理
			this.setButtonEnable();
			return;
		}
		if (event.selectedData[0].hasOwnProperty('expanded')) {
			event.selectedData[0].expanded = true;
		}

		if (event.selectedData[0].parent) {
			let parentNode = event.selectedData[0].parent;
			parentNode.expanded = true;
			if (parentNode.parent) {
				parentNode = parentNode.parent;
				parentNode.expanded = true;
			}
		}

		let secTreeNode = this.getSecurityTreeNode(event.selectedData[0]);

		if (secTreeNode.hasOwnProperty('stSecId')) {
			// ステータスセキュリティID保持
			this.selectedSecId = secTreeNode.stSecId;
		} else {
			// セキュリティID保持
			this.selectedSecId = secTreeNode.secId;
		}

		// ワークフロー選択した場合
		if (secTreeNode.workflowId && !secTreeNode.stSecId) {
			// クリア
			this.accessEntryDataGrid.setData([]);
			// アクセス権限をクリア
			this.accessRoleList = [];
			this.accessRoleDispFlag = false;
			// ボタンの活性制御処理
			this.setButtonEnable();

		} else {
			// アクセスエントリー一覧を取得します．
			this.getAccessEntryList(secTreeNode.secId);
			// アクセス権限をクリア
			this.accessRoleList = [];
			this.accessRoleDispFlag = false;
			this.accessRoleUpdatableFlag = false;

		}
	}

	/**
	 * アクセス権限選択ハンドラ.
	 * @param event イベント
	 * @param value 権限の状態
	 */
	onClickAccessRole(index: number, value: string): void {
		// 変更があった場合更新ボタンを活性化
		if (value !== this.accessRoleList[index].defaultPermit) {
			this.accessRoleUpdatableFlag = true;
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * アクセスエントリー一覧を取得します．
	 * @param secId   セキュリティID
	 * @param entryId エントリーID
	 */
	protected getAccessEntryList(secId: number, entryId?: number): void {
		// アクセスエントリー一覧を取得します．
		this.selectedSecurityId = secId;
		this.securityService.getEntryList(secId).subscribe((accessEntryList: EIMEntryDTO[]) => {
			if (this.selectedSecurityId === secId) {
				// ボタンの活性制御処理
				this.accessEntryDataGrid.setData(accessEntryList);
				this.setButtonEnable();
				if (entryId) {
					let target = { objId: entryId };
					this.accessEntryDataGrid.select([target], false);
					let rowIndex: number = this.accessEntryDataGrid.getRowIndex();
					this.accessEntryDataGrid.ensureIndexVisible(rowIndex);
				}
			}
		}, (err: any) => {
			// クリア
			this.selectedSecurityId = 0;
			this.accessEntryDataGrid.setData([]);
		});
	}


	/**
	 * セキュリティツリーデータ取得
	 * @param treeNode ツリーノード
	 * @return セキュリティツリーデータ
	 */
	protected getSecurityTreeNode(treeNode: any): any {
		// 選択したセキュリティを取得します．
		let secTreeNode: EIMSecurityTreeNode = {};

		// ワークフロー
		if (treeNode.data.workflowId) {
			secTreeNode.workflowId = treeNode.data.workflowId;
			secTreeNode.workflowLabel = treeNode.label;

			secTreeNode.secId = treeNode.parent.data.secId;
			secTreeNode.secLabel = treeNode.parent.label;
		}

		// ステータス別セキュリティ
		if (treeNode.parent) {
			if (treeNode.parent.parent) {
				secTreeNode.secId = treeNode.parent.parent.objId;
				secTreeNode.secLabel = treeNode.parent.parent.label;

				secTreeNode.workflowId = treeNode.parent.data.workflowId;
				secTreeNode.workflowLabel = treeNode.parent.label;

				secTreeNode.stSecId = treeNode.data.stSecId;
				secTreeNode.stTypeId = treeNode.data.stTypeId;
				secTreeNode.stSecLabel = treeNode.label;
			}
		} else {
			// セキュリティ
			secTreeNode.secId = treeNode.objId;
			secTreeNode.secLabel = treeNode.label;
		}

		return secTreeNode;
	}

	/**
	 * セキュリティ登録・更新・削除の完了後処理
	 * @param secId セキュリティID
	 */
	protected securityComplete(secId?: number): void {
		// セキュリティを表示します．
		this.onSearchSecurity(secId);
	}


	/**
	 * エントリー選択・削除の完了後処理
	 * @param secId セキュリティID
 	 * @param entryId エントリーID
	 */
	protected entryComplete(secId: number, entryId?: number): void {
		// エントリー一覧を取得します
		this.getAccessEntryList(secId, entryId);
		// アクセス権限をクリア
		this.accessRoleDispFlag = false;
		this.accessRoleUpdatableFlag = false;
		this.accessRoleList = [];
		// グリッドをリフレッシュ
		this.accessEntryDataGrid.redrawRows();
	}


	/**
	 * エントリーの削除処理を実行します
	 * @param removeData 削除対象リスト
	 * @param secId 対象セキュリティID
	 */
	protected deleteEntry(removeData: any[], secId: number): void {
		// 削除処理実行
		for (let i = 0; i < removeData.length; i++) {
			this.securityService.deleteEntry(secId, removeData[i].objId).subscribe(
				(deletedData: any) => {
					if (i === removeData.length - 1) {
						this.entryComplete(secId);
					}
				}, (err: any) => {
					return;
				}
			);
		}
	}

	/**
	 * ボタンの活性制御処理
	 */
	protected setButtonEnable(): void {
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();
		if (secTreeNodeList && secTreeNodeList.length === 1) {
			let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);

			let secId = secTreeNode.secId;
			let workflowId = secTreeNode.workflowId;
			let stSecId = secTreeNode.stSecId;

			// メニュー：ステータス別登録
			this.statusCreateMenu.disabled = false;

			if (stSecId || workflowId) {
				// メニュー：セキュリティ更新
				this.securityUpdeteMenu.disabled = true;
				// メニュー：ステータス別流用作成
				this.statusCopyMenu.disabled = false;
				// メニュー：選択（アクセスエントリー）
				this.entrySelectMenu.disabled = true;

			} else {
				// メニュー：セキュリティ更新
				this.securityUpdeteMenu.disabled = false;
				// メニュー：ステータス別流用登録
				this.statusCopyMenu.disabled = true;
				// メニュー：選択（アクセスエントリー）
				this.entrySelectMenu.disabled = false;
			}

			if (stSecId) {
				// メニュー：ステータス別更新
				this.statusUpdeteMenu.disabled = false;
			} else {
				// メニュー：ステータス別更新
				this.statusUpdeteMenu.disabled = true;
			}

			if (secId && this.accessEntryDataGrid.getSelectedData().length > 0 && !stSecId) {
				// メニュー：削除（アクセスエントリー）
				this.entryDeleteMenu.disabled = false;
			} else {
				// メニュー：削除（アクセスエントリー）
				this.entryDeleteMenu.disabled = true;
			}
			// メニュー：削除
			this.deleteMenu.disabled = false;

		} else {
			// メニュー：ステータス別登録
			this.statusCreateMenu.disabled = true;
			// メニュー：セキュリティ更新
			this.securityUpdeteMenu.disabled = true;
			// メニュー：ステータス別更新
			this.statusUpdeteMenu.disabled = true;
			// メニュー：ステータス別流用作成
			this.statusCopyMenu.disabled = true;
			// メニュー：削除
			this.deleteMenu.disabled = true;
			// メニュー：選択（アクセスエントリー）
			this.entrySelectMenu.disabled = true;
		}
	}

	/**
	 * セキュリティ登録ボタン押下時のイベントハンドラ
	 * セキュリティ登録ダイアログを表示します.
	 */
	protected showSecurityCreator(): void {
		this.adminDialogManagerComponentService.showSecurityCreator(this.adminAppId, {
			created: (data) => {
				this.securityComplete(data.secId);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02015') }));
			},
		});
	}

	/**
	 * ステータス別セキュリティ登録ボタン押下時のイベントハンドラ
	 * ステータス別セキュリティ登録ダイアログを表示します.
	 */
	protected showStatusSecurityCreator(): void {
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();

		if (secTreeNodeList.length === 0) {
			return;
		}
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);
		// 登録対象ID
		if (secTreeNodeList[0]) {
			this.tempCreatedTreeNode = Object.assign(secTreeNodeList[0], {});
		}

		let secId = secTreeNode.secId;
		let secLabel = secTreeNode.secLabel;
		let workflowId = secTreeNode.workflowId;
		let workflowLabel = secTreeNode.workflowLabel;

		this.adminDialogManagerComponentService.showStatusSecurityCreator(
			this.adminAppId,
			workflowId,
			workflowLabel,
			secId,
			secLabel,
			{
				created: (data) => {
					this.securityComplete(data.secId);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02026') }));
				},
			}
		);
	}

	/**
	 * セキュリティ更新ボタン押下時のイベントハンドラ
	 */
	protected showSecurityUpdator(): void {
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();

		if (secTreeNodeList.length === 0) {
			return;
		}
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);
		// セキュリティ更新対象ID
		if (secTreeNodeList[0]) {
			this.tempCreatedTreeNode = Object.assign((secTreeNodeList[0]), {});
		}

		this.adminDialogManagerComponentService.showSecurityUpdator(this.adminAppId, secTreeNode.secId, {
			updated: (data) => {
				this.securityComplete(secTreeNode.secId);
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02015') }));
			},
		});
	}

	/**
	 * ステータス別セキュリティ流用登録ボタン押下時のイベントハンドラ
	 * ステータス別セキュリティ流用登録ダイアログを表示します.
	 */
	protected showStatusSecurityCopy(): void {
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();
		if (secTreeNodeList.length === 0) {
			return;
		}
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);
		// 流用登録対象ID
		if (secTreeNodeList[0]) {
			this.tempCreatedTreeNode = Object.assign((secTreeNodeList[0]), {});
		}

		let secId = secTreeNode.secId;
		let secLabel = secTreeNode.secLabel;
		let workflowId = secTreeNode.workflowId;
		let workflowLabel = secTreeNode.workflowLabel;

		if (!workflowId) {
			return;
		}

		let dialogId: string = this.adminDialogManagerComponentService.showStatusSecurityCopy(
			secId,
			secLabel,
			workflowId,
			workflowLabel,
			{
				created: (data) => {
					this.adminDialogManagerComponentService.close(dialogId);
					this.securityComplete(data.secId);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02026') }));
				},
			}
		);
	}

	/**
	 * セキュリティ削除ボタン押下時のイベントハンドラ
	 */
	protected onClickSecurityDelete(): void {
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();

		if (secTreeNodeList.length === 0) {
			return;
		}
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);
		// 削除後選択用親ID
		let parentId = null;
		if (secTreeNodeList[0].parent) {
			this.tempTreeNode = Object.assign((secTreeNodeList[0].parent), {});
			parentId = secTreeNodeList[0].parent['objId'];
		}
		if (secTreeNode.hasOwnProperty('stSecId')) {
			// ステータス別セキュリティの場合
			this.messageService.show(EIMMessageType.confirm,
				this.translateService.instant('EIM_ADMINS.CONFIRM_00029', { value: secTreeNode.stSecLabel }),
				() => {
					this.securityService.deleteStatus(secTreeNode.stSecId).subscribe(
						(data: any) => {
							this.securityComplete(parentId);
							this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02306') }));
						},
					);
				});
		} else if (secTreeNode.hasOwnProperty('workflowId')) {
			// ワークフローの場合
			this.messageService.show(EIMMessageType.confirm,
				this.translateService.instant('EIM_ADMINS.CONFIRM_00028'),
				() => {
					this.securityService.deleteWorkflow(secTreeNode.secId, secTreeNode.workflowId).subscribe(
						(data: any) => {
							this.securityComplete(parentId);
							this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02057') }));
						},
					);
				});
		} else {
			// セキュリティの場合
			this.messageService.show(EIMMessageType.confirm,
				this.translateService.instant('EIM_ADMINS.CONFIRM_00003', { value: secTreeNode.secLabel }),
				() => {
					this.securityService.delete(secTreeNode.secId).subscribe(
						(data: any) => {
							this.securityComplete(parentId);
							this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02015') }));
						},
					);
				});
		}
	}

	/**
	 * ステータス別セキュリティ更新ボタン押下時のイベントハンドラ
	 * ステータス別セキュリティ更新ダイアログを表示します.
	 */
	protected showStatusSecurityUpdator(): void {
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();

		if (secTreeNodeList.length === 0) {
			return;
		}
		let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);
		// 更新対象ID
		if (secTreeNodeList[0]) {
			this.tempCreatedTreeNode = Object.assign((secTreeNodeList[0].parent), {});
		}

		let secId = secTreeNode.secId;
		let secLabel = secTreeNode.secLabel;
		let workflowId = secTreeNode.workflowId;
		let workflowLabel = secTreeNode.workflowLabel;
		let stTypeId = secTreeNode.stTypeId;
		let stSecId = secTreeNode.stSecId;

		if (!stTypeId) {
			return;
		}

		this.adminDialogManagerComponentService.showStatusSecurityUpdator(
			this.adminAppId,
			secId,
			secLabel,
			workflowId,
			workflowLabel,
			stTypeId,
			stSecId,
			{
				updated: (data) => {
					this.securityComplete(data.secId);
					this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02026') }));
				},
			}
		);
	}

	/** 対象の親ノードを展開し、自身を選択可能な状態にします.
	 * @param treeNode 対象ノード
	 */
	private expandParent(treeNode: EIMTreeNode): void {
		if (treeNode.parent) {
			this.expandParent(treeNode.parent);
		}
		treeNode.expanded = true;
	}


	/**
	 * アクセスロール一覧を定義命名します.
	 * 本メソッドは抽象メソッドです.継承先で実装してください.
	 * @param roleListDisp アクセスロール一覧
	 * @param role 追加対象アクセスロール
	 */
	abstract convertAccessRoleList(roleListDisp: EIMRoleDTO[], role: EIMRoleDTO): void;

}

