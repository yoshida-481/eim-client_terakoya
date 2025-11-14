import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsFormWorkspaceService } from 'app/admins/shared/services/apis/admins-form-workspace.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMFormFolderDTO } from 'app/admins/shared/dtos/form-folder.dto';


/**
 * 帳票フォルダ登録コンポーネント
 * @example
 *
 *      <eim-workspace-folder-creator
 *          [formWorkspaceId]="formWorkspaceId"
 *          [parentFormFolderId]="parentFormFolderId"
 *          [parentFormFolderName]="parentFormFolderName"
 *          [parentFormFolderHierarchy]="parentFormFolderHierarchy"
 *          [formTypeId]="formTypeId"
 *      >
 *      </eim-workspace-folder-creator>
 */
@Component({
    selector: 'eim-workspace-folder-creator',
    templateUrl: './workspace-folder-creator.component.html',
    styleUrls: ['./workspace-folder-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceFolderCreatorComponent) }
    ],
    standalone: false
})

export class EIMWorkspaceFolderCreatorComponent implements OnInit, EIMCreatable {
	/** 帳票フォルダフォーム */
	@ViewChild('formFolderCreatorForm', { static: true }) formFolderCreatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 帳票フォルダ名称 */
	public formFolderName: string;

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 処理中かどうか */
	private processing = false;

	/** 親帳票フォルダID */
	@Input() public parentFormFolderId: number;

	/** 親帳票フォルダ名称 */
	@Input() public parentFormFolderName: string;

	/** 親帳票フォルダ階層 */
	@Input() public parentFormFolderHierarchy: number;

	/** 帳票ワークスペースID */
	@Input() public formWorkspaceId: number;

	/** 帳票タイプID */
	@Input() public formTypeId: number;

	/** 登録完了時のイベントエミッタ */
	@Output() public created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminsFormWorkspaceService: EIMAdminsFormWorkspaceService,
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
	 * 帳票フォルダを登録します.
	 */
	public create(): void {
		this.processing = true;
		// 帳票フォルダを登録します．
		let formFolderInfo: any = {};
		formFolderInfo.formWorkspaceId = this.formWorkspaceId;
		formFolderInfo.formTypeId = this.formTypeId;
		formFolderInfo.parentFormFolderId = this.parentFormFolderId;
		formFolderInfo.nameList = this.nameList;

		this.adminsFormWorkspaceService.createFormFolder(formFolderInfo).subscribe(
			(formFolderDto: EIMFormFolderDTO) => {
				this.created.emit([formFolderDto]);

			},
			(err: any) => {
				this.processing = false;
				// エラーの場合
			}
		);
	}


	/**
	 * 帳票フォルダ登録可否を返却します.
	 * @return 帳票フォルダ登録可否
	 */
	public creatable(): boolean {
		return this.formFolderCreatorForm.valid && !this.processing;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		if (!this.languages) {
			window.setTimeout(() => {
				this.errored.emit();
			});
			return;
		}

		let lang: any;
		let loopCnt = this.languages.length;
		for (let idx = 0; idx < loopCnt; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		// 階層が最大を越えている場合、エラーメッセージを表示
		if (this.parentFormFolderHierarchy >= EIMAdminsConstantService.FORM_FOLDER_MAX_HIERARCHY ) {
			// 帳票フォルダIDと名称をクリア
			this.clearParentFormForder();
			// 階層エラーメッセージを表示
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_ADMINS.ERROR_00022',
				{value: EIMAdminsConstantService.FORM_FOLDER_MAX_HIERARCHY}));

		}
	}


	/**
	 * 帳票フォルダ選択画面表示ボタン押下のイベントハンドラです．
	 * @param event イベント
	 */
	onClickSelectFormFolder(event: any): void {
		// 帳票フォルダ選択画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormFolderSelector(this.formWorkspaceId, this.formTypeId, {
			selected: (formFolderDto: EIMFormFolderDTO) => {
				// 帳票フォルダ選択画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
				// 選択した帳票フォルダ表示
				this.parentFormFolderName = formFolderDto.name;
				this.parentFormFolderId = formFolderDto.id;
			},
			errored: () => {
				// 帳票フォルダ選択画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});

	}

	/**
	 * 親帳票フォルダ削除ボタンクリックイベントハンドラです．
	 * @param event イベント
	 */
	onClickDeleteParentFormFolder(event: any): void {
		// 帳票フォルダIDと名称をクリア
		this.clearParentFormForder();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 帳票フォルダIDと名称をクリアする
	 */
	private clearParentFormForder(): void {
		this.parentFormFolderId = null;
		this.parentFormFolderName = null;
	}
}
