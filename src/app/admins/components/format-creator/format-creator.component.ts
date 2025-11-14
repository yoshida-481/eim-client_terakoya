import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsFormatService } from 'app/admins/shared/services/apis/admins-format.service';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';


/**
 * フォーマット登録コンポーネント
 * @example
 *
 *      <eim-format-creator>
 *      </eim-format-creator>
 */
@Component({
    selector: 'eim-format-creator',
    templateUrl: './format-creator.component.html',
    styleUrls: ['./format-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormatCreatorComponent) }
    ],
    standalone: false
})

export class EIMFormatCreatorComponent implements OnInit, EIMCreatable {
	/** フォーマットフォーム */
	@ViewChild('formatCreatorForm', { static: true }) formatCreatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** ディレクトリ */
	public path: string;

	/** BoxフォルダID */
	public boxFolderId: string;

	/** BoxフォルダID表示可否 */
	public boxFolderIdVisible = false;

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
		protected adminsFormatService: EIMAdminsFormatService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected serverConfigService: EIMServerConfigService,

	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * フォーマットを登録します.
	 */
	public create(): void {
		this.processing = true;
		// フォーマットを登録します．
		this.adminsFormatService.create(this.nameList, this.path, this.boxFolderId).subscribe(
			(format: EIMFormatDTO) => {
				this.created.emit([format]);

			},
			(err: any) => {
				// エラーの場合
				this.processing = false;
			}
		);
	}


	/**
	 * フォーマット登録可否を返却します.
	 * @return フォーマット登録可否
	 */
	public creatable(): boolean {
		return this.formatCreatorForm.valid && !this.processing;
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

		// BOX連携オプションの入力欄表示可否
		if (this.serverConfigService.boxIntegrationFlg) {
			this.boxFolderIdVisible = true;
		}
	}
}
