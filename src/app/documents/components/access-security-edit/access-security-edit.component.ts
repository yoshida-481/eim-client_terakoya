import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMRoleDTO } from 'app/admins/shared/dtos/role.dto';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';

import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';

import { EIMSecurityService } from 'app/documents/shared/services/apis/security.service';
import { EIMSecurityComponent } from '../security/security.component';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';

/** 権限一覧インデックス */
export namespace roleIndex {
	export const WRITE = 0;
	export const STATUS = 1;
	export const READ = 2;
	export const PUBLISH = 3;
}

/**
 * セキュリティ管理（ドキュメント管理）コンポーネント
 * @example
 *
 *      <eim-access-security-edit>
 *          [content]="content"
 *          [accessSecurity]="accessSecurity"
 *      </eim-access-security-edit>
 */
@Component({
    selector: 'eim-access-security-edit',
    templateUrl: './access-security-edit.component.html',
    styleUrls: ['./access-security-edit.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMAccessSecurityEditComponent) }
    ],
    standalone: false
})
export class EIMAccessSecurityEditComponent extends EIMSecurityComponent implements OnInit {

	/** アクセスエントリーデータグリッド */
	@ViewChild('accessEntryDataGrid', {static: true})
	accessEntryDataGrid: EIMDataGridComponent;

	@Input() content: any = {};
	
	@Input() accessSecurity: any = {};

	@Input() editable = false;

	/** フラグ用数値：1 */
	private readonly FLAG_ON = 1;

	/** セキュリティ管理権限 */
	private readonly SECURITY_DIGIT = 7;

	/** セキュリティエントリー操作非活性化フラグ */
	private disableEditEntryFlag = false;

	/** ステータス変更権限名称一覧 */
	private statusChangeAuthNameList: string[] = [
		EIMAdminsConstantService.PROC_DEFNAME_STATUS_DOWN, EIMAdminsConstantService.PROC_DEFNAME_APPROVE
	];

	/** 選択アクセスエントリーID */
	private selectedEntryId2 = null;
	
	/** 書込権限名称一覧 */
	private writeAuthNameList: string[] = [
		EIMAdminsConstantService.PROC_DEFNAME_UPDATE,
		EIMAdminsConstantService.PROC_DEFNAME_DELETE,
		EIMAdminsConstantService.PROC_DEFNAME_RENAME,
		EIMAdminsConstantService.PROC_DEFNAME_LOCK,
		EIMAdminsConstantService.PROC_DEFNAME_UNLOCK,
		EIMAdminsConstantService.PROC_DEFNAME_CHECKIN,
		EIMAdminsConstantService.PROC_DEFNAME_CHECKOUT,
		EIMAdminsConstantService.PROC_DEFNAME_REVISION_UP,
		EIMAdminsConstantService.PROC_DEFNAME_CREATE_RELATION,
		EIMAdminsConstantService.PROC_DEFNAME_UPDATE_RELATION,
		EIMAdminsConstantService.PROC_DEFNAME_DELETE_RELATION,
	];

	/** 非表示ステータス変更権限名称一覧 */
	private tempStatusAuthList: EIMRoleDTO[] = [];

	/** 非表示書込権限名称一覧 */
	private tempWriteAuthList: EIMRoleDTO[] = [];

	/** アクセスエントリーメニュー */
	protected entrySelectMenu = { label: this.translateService.instant('EIM.LABEL_03006'), icon: 'fa fa-check', disabled: false, command: ($event) => { this.showEntrySelector(); } };
	protected entryDeleteMenu = { label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: false, command: ($event) => { this.onClickEntryDelete(); } };

	/** セキュリティ一覧のコンテキストメニュー */
	public entryMenuItems: EIMMenuItem[] = [
		this.entrySelectMenu,
		this.entryDeleteMenu,
	];
	
	/** アクセスエントリーのコンテキストメニュー */
	public entryContextMenuItems: EIMMenuItem[] = [
		this.entryDeleteMenu,
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected securityService: EIMSecurityService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected adminsCacheService: EIMAdminsCacheService,
	) {
		super(
			messageService,
			translateService,
			securityService,
			dialogManagerComponentService
		);
		
	}

	/**
	 * アクセスロール一覧を定義命名します.
	 * @param roleListDisp アクセスロール一覧
	 * @param role 追加対象アクセスロール
	 */
	public convertAccessRoleList(roleListDisp: EIMRoleDTO[], role: EIMRoleDTO): void {

		while (roleListDisp.length < 4) {
			let initRole = new EIMRoleDTO();
			initRole.name = '';
			initRole.roleChk = false;
			roleListDisp.push(initRole);
		}

		if (EIMAdminsConstantService.PROC_DEFNAME_CREATE === role.name) {
			role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02036');
			roleListDisp[roleIndex.WRITE] = role;
		}
		if (EIMAdminsConstantService.PROC_DEFNAME_STATUS_UP === role.name) {
			role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02045');
			roleListDisp[roleIndex.STATUS] = role;
		}
		if (EIMAdminsConstantService.PROC_DEFNAME_OPEN_READ === role.name) {
			role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02038');
			roleListDisp[roleIndex.READ] = role;
		}
		if (EIMAdminsConstantService.PROC_DEFNAME_READ === role.name) {
			role.dispName = this.translateService.instant('EIM_ADMINS.LABEL_02039');
			roleListDisp[roleIndex.PUBLISH] = role;
		}
		// ステータス変更系権限のうち非表示の物を取得
		if (this.statusChangeAuthNameList.indexOf(role.name) > -1) {
			this.tempStatusAuthList.push(role);
		}
		// 書込系権限のうち非表示の物を取得
		if (this.writeAuthNameList.indexOf(role.name) > -1) {
			this.tempWriteAuthList.push(role);
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 更新ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	onClickUpdate(event: any): void {
		let entryDataList = this.accessEntryDataGrid.getSelectedData();
		let secId: number;
		let isDefaultSec: boolean;


		secId = this.accessSecurity.secId;
		isDefaultSec = true;

		// 非表示ステータス変更権限を設定
		for (let i = 0; i < this.tempStatusAuthList.length; i++) {
			this.tempStatusAuthList[i].permit = this.accessRoleList[roleIndex.STATUS].permit;
		}
		// 非表示書込権限を設定
		for (let i = 0; i < this.tempWriteAuthList.length; i++) {
			this.tempWriteAuthList[i].permit = this.accessRoleList[roleIndex.WRITE].permit;
		}
		let roleList: EIMRoleDTO[] = this.tempStatusAuthList.concat(this.tempWriteAuthList.concat(this.accessRoleList));
		this.securityService.updateRole(secId, entryDataList[0].entryId, isDefaultSec, roleList).subscribe(() => {
			this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02031') }));
		}, (err: any) => {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00005'));
		});
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
			this.selectedEntryId2 = null;
			return;
		}
		this.selectedEntryId2 = selectedDataList[0].entryId;
		// 選択したセキュリティー取得
		let stSecId = null;		//ステータスセキュリティID不要
		let secId = this.accessSecurity.secId;

		// 権限一覧を取得します
		this.securityService.getRoleList(selectedDataList[0].entryId).subscribe(
			(roleList: EIMRoleDTO[]) => {
				if (this.selectedEntryId2 !== selectedDataList[0].entryId) {
					return;
				}
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
				if  (0 < this.accessRoleList.length) {
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

		let secId = this.accessSecurity.secId;
		let gridData = this.accessEntryDataGrid.getData();

		let dialogId: string = this.dialogManagerComponentService.showEntrySelector(secId, gridData, {userDefGroup: false}, null, {
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
										super.deleteEntry(removeData, secId);
										this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', 
																		{ value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
									}, (err: any) => {
										this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00005'));
										return;
									}
								);
							} else {
								// 削除処理実行
								super.deleteEntry(removeData, secId);
								this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', 
																	{ value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
							}
							// エントリ選択画面をクローズ
							this.dialogManagerComponentService.close(dialogId);
						}, () => {
							this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00005'));
							return;
						}
					);
				} else {
					if (0 < addData.length) {
						this.securityService.createEntry(secId, addData).subscribe(
							() => {
								this.entryComplete(secId);
								this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', 
																{ value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
							}, (err: any) => {
								this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00005'));
								return;
							}
						);
					}
					// エントリ選択画面をクローズ
					this.dialogManagerComponentService.close(dialogId);
				}
				this.setButtonEnable();
			}
		});
	}

	/**
	 * アクセスエントリー削除ボタン押下時のイベントハンドラ
	 */
	 onClickEntryDelete(): void {

		// 選択したアクセスエントリー取得
		let entryDataList = this.accessEntryDataGrid.getSelectedData();
		if (entryDataList.length === 0) {
			return;
		}
		let entrydData = entryDataList[0];
		let secId = this.accessSecurity.secId;

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00004', { value: entrydData.entryName }),
			() => {
				this.securityService.deleteEntry(secId, entrydData.entryId).subscribe(
					(data: any) => {
						this.entryComplete(secId);
						this.accessEntryDataGrid.getSelectedData().length = 0;
						this.setButtonEnable();
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', 
														{ value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
					},
					(err: any) => {
						this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00005'));
					}
				);
			});
	}

	
	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	 onClickUp(event: any): void {

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
		let secId = this.accessSecurity.secId;
		this.accessEntryDataGrid.setData([]);
		this.securityService.updateEntryPriority(secId, entrydData.entryId, Number(entrydData.priority) - 1).subscribe((data: any) => {
			// アクセスエントリー一覧を取得します．
			this.entryComplete(secId, entrydData.entryId);
		});
	}


	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event: any): void {
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
		let secId = this.accessSecurity.secId;
		this.securityService.updateEntryPriority(secId, entrydData.entryId, Number(entrydData.priority) + 1).subscribe((data: any) => {
			// アクセスエントリー一覧を取得します．
			this.entryComplete(secId, entrydData.entryId);
		});
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		/** システム管理アプリケーション種別ID：ドキュメント管理 */
		this.adminAppId = EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT;
		super.ngOnInit();
		this.disableEditEntryFlag = !this.checkSecurityAuth();
		this.setButtonEnable();

		// アクセスエントリー一覧を取得します．
		this.getAccessEntryList(this.accessSecurity.secId);
		// アクセス権限をクリア
		this.accessRoleList = [];
		this.accessRoleDispFlag = false;
		this.accessRoleUpdatableFlag = false;


	}
	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * アクセス権限選択ハンドラ.
	 * @param event イベント
	 * @param value 権限の状態
	 */
	onClickAccessRole(index: number, value: string): void {
		switch (value) {
			case this.accessAdmit:
				// 権限が許可の場合、下位の権限を許可にする
				for (let i = index + 1; i < this.accessRoleList.length; i++) {
					this.accessRoleList[i].permit = value;
				}
				break;
			case this.accessRefuse:
				// 権限が拒否の場合、上位の権限を拒否にする
				for (let i = index - 1; 0 <= i; i--) {
					this.accessRoleList[i].permit = value;
				}
				break;
			case this.accessPass:
				// 権限が無視の場合、下位が拒否の時無視にする
				for (let i = index + 1; i < this.accessRoleList.length; i++) {
					if (this.accessRoleList[i].permit === this.accessRefuse) {
						this.accessRoleList[i].permit = value;
					}
				}
				// 上位が許可の時無視にする
				for (let i = index - 1; 0 <= i; i--) {
					if (this.accessRoleList[i].permit === this.accessAdmit) {
						this.accessRoleList[i].permit = value;
					}
				}
				break;
		}
		super.onClickAccessRole(index, value);
	}

	/**
	 * セキュリティ管理権限の有無を確認します.
	 * @return セキュリティ管理権限有無(登録等操作可能ならtrueを返却)
	 */
	private checkSecurityAuth(): boolean {
		if (this.adminAppId !== EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT) {
			return true;
		}
		let user = this.adminsCacheService.getLoginUser();
		// 取得失敗時(URL直接指定等)
		if (!user) {
			return false;
		}
		let binaryAdmin = user.admin.toString(2);
		let checkDigit = this.SECURITY_DIGIT;
		if (checkDigit <= binaryAdmin.length) {
			let userSystemAuth = binaryAdmin.substr(-checkDigit, 1);
			if (Number(userSystemAuth) === this.FLAG_ON) {
				return true;
			}
		}
		return false;
	}

	/**
	 * ボタンの活性制御処理
	 */
	protected setButtonEnable(): void {
		let secId = this.accessSecurity.secId;

		// メニュー：選択（アクセスエントリー）
		this.entrySelectMenu.disabled = false;

		if (secId && this.accessEntryDataGrid.getSelectedData().length > 0) {
			// メニュー：削除（アクセスエントリー）
			this.entryDeleteMenu.disabled = false;
		} else {
			// メニュー：削除（アクセスエントリー）
			this.entryDeleteMenu.disabled = true;
		}

		if (!this.editable) {

			this.entrySelectMenu.disabled = true;
			this.entryDeleteMenu.disabled = true;
		}
	}
}
