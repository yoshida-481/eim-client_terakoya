import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMAdminsRoleService } from 'app/admins/shared/services/apis/admins-role.service';
import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';

/**
 * ロール更新コンポーネント
 * @example
 *      <eim-role-updator
 *       [objTypeId]="objTypeId">
 *      </eim-role-updator>
 */
@Component({
    selector: 'eim-role-updator',
    templateUrl: '../role-creator/role-creator.component.html',
    styleUrls: ['../role-creator/role-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMRoleUpdatorComponent) }
    ],
    standalone: false
})

export class EIMRoleUpdatorComponent implements OnInit, EIMUpdatable {
	/** ロール更新フォーム */
	@ViewChild('roleCreatorForm', { static: true }) roleCreatorForm: NgForm;

	/** ロールID */
	@Input() roleId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 登録した言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 属性一覧 */
	public attributeList: EIMUserAttributeDTO[] = [];

	/** 登録した属性リスト */
	private attvalueList: { [key: string]: any[]; } = {};

	/** 親ロールID */
	private parentRoleId: number;

	/** 親ロール名 */
	public parentRoleName: string;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminEntryService: EIMAdminsEntryService,
		protected adminsRoleService: EIMAdminsRoleService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected objectService: EIMObjectService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ロールを更新します.
	 */
	public update(): void {
		this.adminsRoleService.updateRole(this.roleId, this.nameList, this.attributeList, this.parentRoleId).subscribe(
			(data: any) => {
				this.updated.emit(data);
			},
			(err: any) => {
			});
	}

	/**
	 * ロール更新可否を返却します.
	 * @return ロール更新可否
	 */
	public updatable(): boolean {
		let updateFlag = true;

		let lang: any;
		for (let i = 0; i < this.languages.length; i++) {
			lang = this.languages[i];
			if (!this.nameList[lang.lang]) {
				updateFlag = false;
				break;
			}
		}
		return this.roleCreatorForm.dirty && this.roleCreatorForm.valid && updateFlag;
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

		// ロール情報取得
		this.adminsRoleService.getRole(this.roleId).subscribe(
			(data: any) => {
				if (data.lang !== undefined) {
					let langs = data.lang;
					let loopCnt = langs.length === undefined ? 1 : langs.length;
	
					if (loopCnt === 1) {
						this.nameList[data.lang.attr.otherLId] = data.lang.attr.otherName;
					} else {
						for (let i in langs) {
							lang = langs[i];
							this.nameList[lang.attr.otherLId] = lang.attr.otherName;
						}
					}
				}
				this.parentRoleId = data.attr.parentRoleId;
				this.parentRoleName = data.attr.parentRoleName;
			}, (err: any) => {
			}
		);
		// 属性情報取得
		this.objectService.getAttributeField('role', this.roleId).subscribe(
			(data: EIMUserAttributeDTO[]) => {
				this.attributeList = data;
				let attValue: any;
				for (let i = 0; i < data.length; i++) {
					this.attvalueList[data[i].attTypeId] = data[i].attMultipleList;
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
		// ドキュメントタイプツリーを表示する
		let dialogId: string = this.adminDialogManagerComponentService.showSingleRoleSelector(
			{
				selected: (role: any) => {
					this.adminDialogManagerComponentService.close(dialogId);
					this.parentRoleName = role.entryName;
					this.parentRoleId = role.entryId
					this.roleCreatorForm.form.markAsDirty();
				}
			}
		);
	}

	/**
	 * 親ロール削除ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDeleteParentRole(event: any): void {
		this.parentRoleId = null;
		this.parentRoleName = null;
		this.roleCreatorForm.form.markAsDirty();
	}
}
