import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsFormatService } from 'app/admins/shared/services/apis/admins-format.service';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMLanguageDTO } from 'app/shared/dtos/language.dto';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';


/**
 * フォーマット更新コンポーネント
 * @example
 *
 *      <eim-format-updator
 *          [formatId]="formatId"
 *      >
 *      </eim-format-updator>
 */
@Component({
    selector: 'eim-format-updator',
    templateUrl: './format-updator.component.html',
    styleUrls: ['./format-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormatUpdatorComponent) }
    ],
    standalone: false
})

export class EIMFormatUpdatorComponent implements OnInit, EIMUpdatable {
	/** フォーマット更新フォーム */
	@ViewChild('formatUpdatorForm', { static: true }) formatUpdatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 登録した言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** BoxフォルダID */
	public boxFolderId: string;

	/** BoxフォルダID表示可否 */
	public boxFolderIdVisible = false;

	/** フォーマットID */
	@Input() public formatId: number;

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
	 * フォーマットを更新します.
	 */
	public update(): void {
		this.processing = true;
		// フォーマットを更新します．
		this.adminsFormatService.update(this.nameList, this.formatId, this.boxFolderId).subscribe(
			(format: EIMFormatDTO) => {
				this.updated.emit([format]);

			},
			(err: any) => {
				// エラーの場合
				this.processing = false;

			});
	}


	/**
	 * フォーマット更新可否を返却します.
	 * @return フォーマット更新可否
	 */
	public updatable(): boolean {
		return this.formatUpdatorForm.valid && this.formatUpdatorForm.dirty && !this.processing;
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

		let loopCnt = this.languages.length;
		let lang: any;
		for (let idx = 0; idx < loopCnt; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		let langDtos: EIMLanguageDTO[];
		let langDto: EIMLanguageDTO;
		this.adminsFormatService.get(this.formatId).subscribe(
			(format: EIMFormatDTO) => {
				langDtos = format.langugeList;
				loopCnt = langDtos.length;
				for (let idx = 0; idx < loopCnt; idx++) {
					langDto = langDtos[idx];

					this.nameList[langDto.langId] = langDto.name;
				}
				this.boxFolderId = format.boxFolderId;

			}, (err: any) => {
				// エラーの場合、画面を閉じる
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);
		// BOX連携オプションの入力欄表示可否
		if (this.serverConfigService.boxIntegrationFlg) {
			this.boxFolderIdVisible = true;
		}
	}
}
