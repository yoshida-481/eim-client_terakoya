import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsFormWorkspaceService } from 'app/admins/shared/services/apis/admins-form-workspace.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMFormWorkspaceDTO } from 'app/admins/shared/dtos/form-workspace.dto';


/**
 * 帳票ワークスベース更新コンポーネント
 * @example
 *
 *      <eim-form-workspace-updator
 *          [formWorkspaceId]="formWorkspaceId"
 *      >
 *      </eim-form-workspace-updator>
 */
@Component({
    selector: 'eim-form-workspace-updator',
    templateUrl: './form-workspace-updator.component.html',
    styleUrls: ['./form-workspace-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkspaceUpdatorComponent) }
    ],
    standalone: false
})

export class EIMFormWorkspaceUpdatorComponent implements OnInit, EIMUpdatable {
	/** 帳票ワークスベースフォーム */
	@ViewChild('workspaceFormUpdatorForm', { static: true }) workspaceFormUpdatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** ワークスペースID */
	@Input() public formWorkspaceId: number;

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

	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 帳票ワークスベースを更新します.
	 */
	public update(): void {
		this.processing = true;
		// 帳票ワークスベースを更新します．
		this.adminsFormWorkspaceService.update(this.formWorkspaceId, this.nameList).subscribe(
			(data: any) => {
				this.updated.emit(data);

			},
			(err: any) => {
				// エラーの場合
				this.processing = false;
			}
		);
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 帳票ワークスベース更新可否を返却します.
	 * @return 帳票ワークスベース更新可否
	 */
	public updatable(): boolean {
		return this.workspaceFormUpdatorForm.valid && this.workspaceFormUpdatorForm.dirty && !this.processing;
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
		let loopCnt;
		loopCnt = this.languages.length;
		for (let idx = 0; idx < loopCnt; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		let languageList: any[];
		// 帳票ワークスペースを取得
		this.adminsFormWorkspaceService.getById(this.formWorkspaceId).subscribe(
			(formWorkspaceDto: EIMFormWorkspaceDTO) => {
				languageList = formWorkspaceDto.languageList;
				let languageCnt = languageList.length;
				for (let idx = 0; idx < loopCnt; idx++) {
					lang = this.languages[idx];
					if (idx < languageCnt) {
						this.nameList[lang.lang] = languageList[idx];
					}
				}

			}, (err: any) => {
				// エラーの場合
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);

	}
}
