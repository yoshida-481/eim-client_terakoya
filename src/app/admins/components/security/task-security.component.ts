import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, OnInit } from '@angular/core';


import { EIMComponent } from 'app/shared/shared.interface';

import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMFormSecurityComponent } from './form-security.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';

/**
 * セキュリティ管理(タスク管理)コンポーネント
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
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMTaskSecurityComponent) },
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMTaskSecurityComponent extends EIMFormSecurityComponent implements OnInit  {

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		super.ngOnInit();

		/** システム管理アプリケーション種別ID：タスク管理 */
		this.adminAppId = EIMAdminsConstantService.ADMIN_APP_ID_TASK;

	}

	/**
	 * アクセス権限選択ハンドラ.
	 * @param event イベント
	 * @param value 権限の状態
	 */
	override onClickAccessRole(index: number, value: string): void {
		switch (value) {
			// 権限が許可の場合
			case this.accessAdmit:
				
				// 作成を許可した場合
				if (this.accessRoleList[index].name === EIMAdminsConstantService.PROC_DEFNAME_CREATE) {
					
					// ステータス変更も許可する
					const approveRole = this.accessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_APPROVE);
					approveRole.permit = this.accessAdmit;
				}
				break;

			// 権限が拒否の場合
			case this.accessRefuse:

				// ステータス変更を拒否した場合
				if (this.accessRoleList[index].name === EIMAdminsConstantService.PROC_DEFNAME_APPROVE) {
					
					// 作成も拒否する
					const createRole = this.accessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_CREATE);
					createRole.permit = this.accessRefuse;
				}
				break;

			// 権限が無視の場合
			case this.accessPass:

				// ステータス変更を無視した場合
				if (this.accessRoleList[index].name === EIMAdminsConstantService.PROC_DEFNAME_APPROVE) {
					
					// 作成が許可なら無視にする
					const createRole = this.accessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_CREATE);
					if (createRole.permit === this.accessAdmit) {
						createRole.permit = this.accessPass;
					}
				}
				break;
		}
		super.onClickAccessRole(index, value);
	}

	/**
	 * 更新ボタン押下時のイベントハンドラ
	 * @param event イベント
	 */
	override onClickUpdate(event: any): void {

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

		// アクセスロールを分解
		const createRole = this.accessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_CREATE);
		const updateRole = this.accessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_UPDATE);
		const approveRole = this.accessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_APPROVE);
		const readRole = this.accessRoleList.find(role => role.name === EIMAdminsConstantService.PROC_DEFNAME_READ);

		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_DELETE, createRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_RENAME, updateRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_LOCK, updateRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_UNLOCK, updateRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_CHECKIN, updateRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_CHECKOUT, updateRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_STATUS_UP, approveRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_STATUS_DOWN, approveRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_REVISION_UP, updateRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_CREATE_RELATION, createRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_UPDATE_RELATION, createRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_DELETE_RELATION, createRole.permit);
		this.setPermit(EIMAdminsConstantService.PROC_DEFNAME_OPEN_READ, readRole.permit);
		
		this.securityService.updateRole(secId, entryDataList[0].entryId, isDefaultSec, this.allAccessRoleList).subscribe(() => {
			this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02031') }));
			// アクセスエントリーの情報を再取得
			this.onSelectAccessEntry();
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * アクセスロール（this.allAccessRoleListの該当アクセスロール）に権限を設定します.
	 * 
	 * @param accessRoleName アクセスロール名
	 * @param permit 権限
	 */
	private setPermit(accessRoleName: string, permit: string): void {
	
		const role = this.allAccessRoleList.find(role => role.name === accessRoleName);
		if (role === null) {
			return;
		}

		role.permit = permit;
	}
}

