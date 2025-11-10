import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsFormWorkspaceService } from 'app/admins/shared/services/apis/admins-form-workspace.service';
import { EIMFormFolderDTO } from 'app/admins/shared/dtos/form-folder.dto'


/**
 * 帳票フォルダ更新コンポーネント
 * @example
 *
 *      <eim-workspace-folder-updator
 *          [formWorkspaceId]="formWorkspaceId"
 *          [formTypeId]="formTypeId"
 *          [formFolderId]="formFolderId"
 *      >
 *      </eim-workspace-folder-updator>
 */
@Component({
    selector: 'eim-workspace-folder-updator',
    templateUrl: './workspace-folder-updator.component.html',
    styleUrls: ['./workspace-folder-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMWorkspaceFolderUpdatorComponent) }
    ],
    standalone: false
})

export class EIMWorkspaceFolderUpdatorComponent implements OnInit, EIMUpdatable {
	/** 帳票フォルダ更新フォーム */
	@ViewChild('formFolderUpdatorForm', { static: true }) public formFolderUpdatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 帳票フォルダ */
	public formFolderName: string;

	/** 親帳票タイプID */
	public parentFormFolderId: number;

	/** 親帳票フォルダ */
	public parentFormFolderName: string;

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 帳票ワークスペースID */
	@Input() public formWorkspaceId: number;

	/** 帳票タイプID */
	@Input() public formTypeId: number;

	/** 帳票タイプID */
	@Input() public formFolderId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() public updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** 処理中かどうか */
	private processing = false;


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminsFormWorkspaceService: EIMAdminsFormWorkspaceService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,

	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 帳票フォルダを更新します.
	 */
	public update(): void {
		this.processing = true;
		// 帳票フォルダを更新します．
		this.adminsFormWorkspaceService.updateFormFolder(this.formFolderId, this.nameList).subscribe(
			(result: string) => {
				this.updated.emit([result]);

			},
			(err: any) => {
				// エラーの場合
				this.processing = false;
			}
		);
	}


	/**
	 * 帳票フォルダ更新可否を返却します.
	 * @return 帳票フォルダ更新可否
	 */
	public updatable(): boolean {
		return this.formFolderUpdatorForm.valid && this.formFolderUpdatorForm.dirty && !this.processing;
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

		let languageList: any[];

		this.adminsFormWorkspaceService.getFormTypeFolderById(this.formFolderId).subscribe(
			(formFolder: EIMFormFolderDTO) => {
				languageList = formFolder.languageList;
				let languageCnt = languageList.length;
				for (let idx = 0; idx < loopCnt; idx++) {
					lang = this.languages[idx];
					if (idx < languageCnt) {
						this.nameList[lang.lang] = languageList[idx];
					}
				}

				this.parentFormFolderId = formFolder.parentFolder.id;
				this.parentFormFolderName = formFolder.parentFolder.name;

			}, (err: any) => {
				// エラーの場合
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);

	}
}
