import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';

/**
 * ロール登録コンポーネント
 * @example
 *
 *      <eim-role-creator
 *       [roleId]="roleId"
 *       [roleName]="roleName"
 *      </eim-role-creator>
 */
@Component({
    selector: 'eim-role-creator',
    templateUrl: './role-creator.component.html',
    styleUrls: ['./role-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMRoleCreatorComponent) }
    ],
    standalone: false
})

export class EIMRoleCreatorComponent implements OnInit, EIMCreatable {
	/** ロール登録フォーム */
	@ViewChild('roleCreatorForm', { static: true }) roleCreatorForm: NgForm;

	/** ロールID */
	@Input() roleId: number;

	/** ロール名 */
	@Input() roleName: string;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 親ロール名 */
	public parentRoleName: string;

	/** 親ロールID */
	private parentRoleId: number;

	/** 属性一覧 */
	public attributeList: EIMUserAttributeDTO[] = [];

	/** 登録した属性リスト */
	private attvalueList: { [key: string]: any[]; } = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected securityService: EIMAdminsSecurityService,
			protected adminsEntryService: EIMAdminsEntryService,
			protected adminsRoleService: EIMAdminsRoleService,
			protected objectService: EIMObjectService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
			protected messageService: EIMMessageService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ロールを登録します.
	 */
	public create(): void {
		this.adminsRoleService.createRole(this.nameList, this.attributeList, this.parentRoleId)
			.subscribe(
			(data: any) => {
				this.created.emit(data);
			},
			(err: any) => {
			}
		);
	}

	/**
	 * ロール登録可否を返却します.
	 * @return ロール登録可否
	 */
	public creatable(): boolean {
		let createFlag = true;
		let lang: any;

		for (let i = 0; i < this.languages.length; i++) {
			lang = this.languages[i];
			if (!this.nameList[lang.lang]) {
				createFlag = false;
				break;
			}
		}
		return this.roleCreatorForm.valid && createFlag;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		let lang: any;
		for (let i = 0; i < this.languages.length; i++) {
			lang = this.languages[i];
			this.nameList[lang.lang] = '';
		}
		this.parentRoleId = this.roleId;
		this.parentRoleName = this.roleName;

		// 属性情報取得
		this.objectService.getAttributeField('role').subscribe(
			(data: EIMUserAttributeDTO[]) => {
				this.attributeList = data;
				let attValue: any;
				for (let i = 0; i < data.length; i++) {
					this.attvalueList[data[i].attTypeId] = [];
				}
			}, (err: any) => {
			}
		);
	}

	/**
	 * ロール選択画面表示ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	onClickShowRoleSelector(event: any): void {
		// ロールツリー選択を表示する
		let dialogId: string = this.adminDialogManagerComponentService.showSingleRoleSelector(
			{
				selected: (role: any) => {
					this.adminDialogManagerComponentService.close(dialogId);
					this.parentRoleName = role.entryName;
					this.parentRoleId = role.entryId;
				}
			});
	}

	/**
	 * 親ロール削除ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDeleteParentRole(event: any): void {
		this.parentRoleId = null;
		this.parentRoleName = null;
	}
}
