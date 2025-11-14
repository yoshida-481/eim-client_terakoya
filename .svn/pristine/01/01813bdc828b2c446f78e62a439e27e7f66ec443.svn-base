import { EIMRoleDTO } from 'app/admins/shared/dtos/role.dto';
import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EIMSecurityComponent } from './security.component';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';
import { EIMCheckBoxComponent } from 'app/shared/components/checkbox/checkbox.component';

/**
 * セキュリティ管理(汎用管理)コンポーネント
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
		EIMRadioButtonComponent,
		EIMCheckBoxComponent
	],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMGeneralSecurityComponent) }
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMGeneralSecurityComponent  extends EIMSecurityComponent implements OnInit {

	/** セキュリティのメニュー（汎用・帳票管理の場合） */
	public securityMenuItems: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', items: [
			this.securityCreateMenu,
			this.statusCreateMenu,
		]},
		{label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', items: [
			this.securityUpdeteMenu,
			this.statusUpdeteMenu,
			this.statusCopyMenu,
		]},
		this.deleteMenu,
	];

	/** セキュリティのコンテキストメニュー */
	public secContextMenuItems: EIMMenuItem[] = [
		this.statusCreateMenu,
		this.securityUpdeteMenu,
		this.statusUpdeteMenu,
		this.statusCopyMenu,
		this.deleteMenu,
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected messageService: EIMMessageService,
			protected translateService: TranslateService,
			protected securityService: EIMAdminsSecurityService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService
	) {
		super (
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
		roleListDisp.push(role);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		/** システム管理アプリケーション種別ID：汎用管理 */
		this.adminAppId = EIMAdminsConstantService.ADMIN_APP_ID_GENERAL;
		super.ngOnInit();
	}

}

