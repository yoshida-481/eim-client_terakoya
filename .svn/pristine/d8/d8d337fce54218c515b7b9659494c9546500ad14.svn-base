import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectService } from 'app/admins/shared/services/apis/object.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsEntryService } from 'app/admins/shared/services/apis/admins-entry.service';
import { EIMUserAttributeDTO } from 'app/admins/shared/dtos/user-attribute.dto';
import { EIMAdminsGroupService } from 'app/admins/shared/services/apis/admins-group.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';

/**
 * グループ更新コンポーネント
 * @example
 *
 *      <eim-group-updator
 *          [groupId]="groupId"
 *          [displayAccordionNum]="displayAccordionNum">
 *      </eim-group-updator>
 */
@Component({
    selector: 'eim-group-updator',
    templateUrl: '../group-creator/group-creator.component.html',
    styleUrls: ['../group-creator/group-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMGroupUpdatorComponent) }
    ],
    standalone: false
})

export class EIMGroupUpdatorComponent implements OnInit, EIMUpdatable {
	/** グループ更新フォーム(登録フォームの流用) */
	@ViewChild('groupCreatorForm', { static: true }) groupUpdatorForm: NgForm;

	/** 定義名称 */
	@Input() definitionName: string;

	/** グループID */
	@Input() groupId: number;

	/** グループ一覧の表示方法（０ ＝ パス表示、１ ＝ ツリー表示） */
	@Input() displayAccordionNum: number;

	/** 紙電子化オプション専用ラベルを表示するかどうか（true：表示） */
	@Input() isConvertPaperToPDFFlg = false;

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

	/** 親グループID */
	private parentGroupId: number;

	/** 親グループ名 */
	public parentGroupName: string;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminEntryService: EIMAdminsEntryService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected objectService: EIMObjectService,
		protected adminsGroupService: EIMAdminsGroupService,
		protected serverConfigService: EIMServerConfigService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * グループを更新します.
	 */
	public update(): void {
		this.adminsGroupService.updateGroup(this.groupId, this.nameList, this.attributeList, this.definitionName, this.parentGroupId).subscribe(
			(data: any) => {
				this.updated.emit(data);
			},
			(err: any) => {
		});
	}

	/**
	 * グループ更新可否を返却します.
	 * @return グループ更新可否
	 */
	public updatable(): boolean {
		let updateFlag = true;

		let lang: any;
		for (let i = 0; i < this.languages.length; i++) {
			lang = this.languages[i];
			if (!this.nameList[lang.lang]
				|| !this.definitionName) {
				updateFlag = false;
				break;
			}
		}
		return this.groupUpdatorForm.dirty && this.groupUpdatorForm.valid && updateFlag;
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

		// グループ情報取得
		this.adminsGroupService.getGroup(this.groupId).subscribe(
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

				this.definitionName = data.attr.definitionName;
				this.parentGroupId = data.attr.parentGroupId;
				this.parentGroupName = data.attr.parentGroupName;
			}, (err: any) => {
			}
		);
		// 属性情報取得
		this.objectService.getAttributeField('group', this.groupId).subscribe(
			(data: EIMUserAttributeDTO[]) => {
				this.attributeList = data;
				let attValue: any;
				for (let i = 0; i < data.length; i++) {
					this.attvalueList[data[i].attTypeId] = data[i].attMultipleList;
				}
			}, (err: any) => {
				// エラー時
			}
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
				selected: (documentType: any) => {
					this.adminDialogManagerComponentService.close(dialogId);
					if (this.displayAccordionNum === 1) {
						this.parentGroupName = documentType.entryName;
						this.parentGroupId = documentType.entryId;
					} else if (this.displayAccordionNum === 0) {
						this.parentGroupName = documentType.groupName;
						this.parentGroupId = documentType.groupId;
					}
					this.groupUpdatorForm.form.markAsDirty();
				}
			}
		);
	}

	/**
	 * 親グループ削除ボタンクリックイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDeletePrentGroup(event: any): void {
		this.parentGroupId = null;
		this.parentGroupName = null;
		this.groupUpdatorForm.form.markAsDirty();
	}
}
