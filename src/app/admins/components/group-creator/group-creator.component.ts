import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * グループ登録コンポーネント
 * @example
 *
 *      <eim-group-creator
 *      [groupId]="groupId"
 *      [groupName]="groupName"
 *      [displayAccordionNum]="displayAccordionNum"
 *      </eim-group-creator>
 */
@Component({
    selector: 'eim-group-creator',
    templateUrl: './group-creator.component.html',
    styleUrls: ['./group-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMGroupCreatorComponent) }
    ],
    standalone: false
})

export class EIMGroupCreatorComponent implements OnInit, EIMCreatable {
	/** グループ登録フォーム */
	@ViewChild('groupCreatorForm', { static: true }) groupCreatorForm: NgForm;

	/** 定義名称 */
	@Input() definitionName: string;

	/** グループID */
	@Input() groupId: number;

	/** グループ名 */
	@Input() groupName: string;

	/** グループ一覧の表示方法（０ ＝ パス表示、１ ＝ ツリー表示） */
	@Input() displayAccordionNum: number;

	/** 紙電子化オプション専用ラベルを表示するかどうか（true：表示） */
	@Input() isConvertPaperToPDFFlg = false;

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

	/** 親グループID */
	private parentGroupId: number;

	/** 親グループ */
	public parentGroupName: string;

	/** 属性値 */
	private attributeField: string;

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
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
			protected messageService: EIMMessageService,
			protected objectService: EIMObjectService,
			protected adminsGroupService: EIMAdminsGroupService,
			protected serverConfigService: EIMServerConfigService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * グループを登録します.
	 */
	public create(): void {
		// グループを登録します．
		this.adminsGroupService.createGroup(this.nameList, this.attributeList,  this.definitionName, this.parentGroupId)
			.subscribe(
			(data: any) => {
				this.created.emit(data);
			},
			(err: any) => {
			}
		);
	}

	/**
	 * グループ登録可否を返却します.
	 * @return グループ登録可否
	 */
	public creatable(): boolean {
		let createFlag = true;
		let lang: any;
		for (let i = 0; i < this.languages.length; i++) {
			lang = this.languages[i];
			if (!this.nameList[lang.lang]
				|| !this.definitionName) {
				createFlag = false;
				break;
			}
		}
		return this.groupCreatorForm.valid && createFlag;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit() {
		this.languages = this.localStorageService.getLanguages();
		let lang: any;
		for (let i = 0; i < this.languages.length; i++) {
			lang = this.languages[i];
			this.nameList[lang.lang] = '';
		}
		this.parentGroupId = this.groupId;
		this.parentGroupName = this.groupName;

		// 属性情報取得
		this.objectService.getAttributeField('group').subscribe(
			(data: EIMUserAttributeDTO[]) => {
				this.attributeList = data;
				let attValue: any;
				for (let i = 0; i < data.length; i++) {
					this.attvalueList[data[i].attTypeId] = [];
				}
			},
		);

		// 紙文書電子化オプションの設定制御
		this.isConvertPaperToPDFFlg = this.serverConfigService.convertPaperToPDFFlg;
	}

	/**
	 * 親グループ選択画面表示ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	onClickShowGroupSelector(event: any): void {
		// ドキュメントタイプツリーを表示する
		let dialogId: string = this.adminDialogManagerComponentService.showSingleGroupSelector(
			this.displayAccordionNum,
			{
				selected: (group: any) => {
					this.adminDialogManagerComponentService.close(dialogId);
					if (this.displayAccordionNum === 1) {
						this.parentGroupName = group.entryName;
						this.parentGroupId = group.entryId;
					} else if (this.displayAccordionNum === 0) {
						this.parentGroupName = group.groupName;
						this.parentGroupId = group.groupId;
					}
				}
			});
	}

	/**
	 * 親グループ削除ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	onClickDeletePrentGroup(event: any): void {
		this.parentGroupId = null;
		this.parentGroupName = null;
	}
}
