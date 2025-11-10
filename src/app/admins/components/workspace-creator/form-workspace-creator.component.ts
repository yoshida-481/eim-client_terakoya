import { Component, forwardRef, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsSecurityService } from 'app/admins/shared/services/apis/admins-security.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsFormWorkspaceService } from 'app/admins/shared/services/apis/admins-form-workspace.service';
import { EIMFormWorkspaceDTO } from 'app/admins/shared/dtos/form-workspace.dto';

/**
 * 帳票ワークスベース登録コンポーネント
 * @example
 *
 *      <eim-form-workspace-creator>
 *      </eim-form-workspace-creator>
 */
@Component({
    selector: 'eim-form-workspace-creator',
    templateUrl: './form-workspace-creator.component.html',
    styleUrls: ['./form-workspace-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkspaceCreatorComponent) }
    ],
    standalone: false
})

export class EIMFormWorkspaceCreatorComponent implements OnInit, EIMCreatable {
	/** 帳票ワークスベースフォーム */
	@ViewChild('workspaceFormCreatorForm', { static: true }) workspaceFormCreatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 登録完了時のイベントエミッタ */
	@Output() public created: EventEmitter<any[]> = new EventEmitter<any[]>();

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

	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 帳票ワークスベースを登録します.
	 */
	public create(): void {
		this.processing = true;
		// 帳票ワークスベースを登録します．
		this.adminsFormWorkspaceService.create(this.nameList).subscribe(
			(formWorksapceDto: EIMFormWorkspaceDTO) => {
				this.created.emit([formWorksapceDto]);

			},
			(err: any) => {
				this.processing = false;
				// エラーの場合
			}
		);
	}


	/**
	 * 帳票ワークスベース登録可否を返却します.
	 * @return 帳票ワークスベース登録可否
	 */
	public creatable(): boolean {
		return this.workspaceFormCreatorForm.valid && !this.processing;
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
	}

}
