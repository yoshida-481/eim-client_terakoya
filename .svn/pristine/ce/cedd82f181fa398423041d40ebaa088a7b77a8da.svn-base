import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMRoleDTO } from 'app/admins/shared/dtos/role.dto';
import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMSecurityComponent } from './security.component';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';

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
 *      <eim-security>
 *      </eim-security>
 */
@Component({
	selector: 'eim-security',
	templateUrl: './security.component.html',
	styleUrls: ['./security.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe,
		ButtonDirective,
		Tooltip,

		AngularSplitModule,
		PanelModule,
		InputTextModule,
		EIMRadioButtonComponent
	],
	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentSecurityComponent) }
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMDocumentSecurityComponent extends EIMSecurityComponent implements OnInit {

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

	/** セキュリティ登録メニュー（ドキュメント管理） */
	protected securityCreateMenu = { label: this.translateService.instant('EIM_ADMINS.LABEL_03016'), icon: 'eim-icon-plus', disabled: true, command: ($event) => { this.showSecurityCreator(); } };

	/** セキュリティのボタンメニュー（ドキュメント管理） */
	public securityMenuItems: EIMMenuItem[] = [
		this.securityCreateMenu,
		this.securityUpdeteMenu,
		this.deleteMenu,
	];

	/** セキュリティのコンテキストメニュー */
	public secContextMenuItems: EIMMenuItem[] = [
		this.securityUpdeteMenu,
		this.deleteMenu,
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected securityService: EIMAdminsSecurityService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected adminsCacheService: EIMAdminsCacheService,
	) {
		super(
			messageService,
			translateService,
			securityService,
			adminDialogManagerComponentService
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

	/**
	 * セキュリティエントリ管理権限の有無を確認します.
	 */
	public checkAuth(): void {
		this.disableEditEntryFlag = !this.checkSecurityAuth();
		// メニュー：セキュリティ登録
		this.securityCreateMenu.disabled = this.disableEditEntryFlag;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * アクセスエントリー選択時イベントハンドラです.
	 * オーバーライドして権限リストを初期化します.
	 */
	 onSelectAccessEntry(): void {
		this.tempStatusAuthList = [];
		this.tempWriteAuthList = [];
		super.onSelectAccessEntry();
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
			// アクセスエントリーの情報を再取得
			this.onSelectAccessEntry();
		});
	}

	/**
	 * エントリ選択ボタン押下時のイベントハンドラ
	 */
	showEntrySelector(): void {
		let selectedData = this.securityTypeTree.getSelectedData();
		if (selectedData && selectedData.length === 1) {

			let secId = this.getSecurityTreeNode(selectedData[0]).secId;
			let gridData = this.accessEntryDataGrid.getData();
			let dialogId: string = this.adminDialogManagerComponentService.showEntrySelector(secId, gridData, {userDefGroup: false, objectRole: false}, null, {
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
											this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02018') }));
										}, (err: any) => {
											return;
										}
									);
								} else {
									// 削除処理実行
									super.deleteEntry(removeData, secId);
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
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		/** システム管理アプリケーション種別ID：ドキュメント管理 */
		this.adminAppId = EIMAdminsConstantService.ADMIN_APP_ID_DOCUMENT;
		this.securityCreateMenu.label = this.translateService.instant('EIM_ADMINS.LABEL_03033');
		this.securityUpdeteMenu.label = this.translateService.instant('EIM.LABEL_03004');
		super.ngOnInit();
		this.checkAuth();
	}

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
		// 選択したセキュリティ取得
		let secTreeNodeList = this.securityTypeTree.getSelectedData();
		if (secTreeNodeList && secTreeNodeList.length === 1) {
			let secTreeNode = this.getSecurityTreeNode(secTreeNodeList[0]);

			let secId = secTreeNode.secId;
			let workflowId = secTreeNode.workflowId;
			let stSecId = secTreeNode.stSecId;

			if (stSecId || workflowId) {
				// メニュー：セキュリティ更新
				this.securityUpdeteMenu.disabled = true;
				// メニュー：選択（アクセスエントリー）
				this.entrySelectMenu.disabled = true;
			} else {
				// メニュー：セキュリティ更新
				this.securityUpdeteMenu.disabled = this.disableEditEntryFlag;
				// メニュー：選択（アクセスエントリー）
				this.entrySelectMenu.disabled = false;
			}

			if (secId && this.accessEntryDataGrid.getSelectedData().length > 0 && !stSecId) {
				// メニュー：削除（アクセスエントリー）
				this.entryDeleteMenu.disabled = false;
			} else {
				// メニュー：削除（アクセスエントリー）
				this.entryDeleteMenu.disabled = true;
			}
			// メニュー：削除
			this.deleteMenu.disabled = this.disableEditEntryFlag;

		} else {
			// メニュー：セキュリティ更新
			this.securityUpdeteMenu.disabled = true;
			// メニュー：削除
			this.deleteMenu.disabled = true;
			// メニュー：選択（アクセスエントリー）
			this.entrySelectMenu.disabled = true;
		}
	}

}
