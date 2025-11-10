import { EIMCodeService } from 'app/admins/shared/services/apis/code.service';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMOtherNameDomain } from 'app/shared/domains/entity/other-name.domain';
/**
 * コード登録コンポーネント
 * @example
 *
 *      <eim-code-creator
 *          [nameList]="nameList"
 *          [path]="path">
 *      </eim-code-creator>
 */
@Component({
    selector: 'eim-code-creator',
    templateUrl: './code-creator.component.html',
    styleUrls: ['./code-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMCodeCreatorComponent) }
    ],
    standalone: false
})

export class EIMCodeCreatorComponent implements OnInit, EIMCreatable {

	/** 親コードタイプ */
	@Input() codeType: EIMCodeTypeDomain;

	/** フォーマットフォーム */
	@ViewChild('codeCreatorForm', { static: true }) codeCreatorForm: NgForm;

	/** フォーカス対象 */
	@ViewChild('focusTarget', { static: true }) focusTarget: ElementRef;

	/** 定数：無効フラグオン */
	private readonly DISABLE_ON = 'DisabledFlagOn';

	/** 定数：無効フラグオフ */
	private readonly DISABLE_OFF = 'DisabledFlagOff';

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** コード名称 */
	public code = '';

	/** 無効フラグ */
	public mutual = this.DISABLE_OFF;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();
	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected codeService: EIMCodeService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コードを登録します.
	 */
	public create(): void {
		// 登録に必要な情報を取得
		let code: EIMCodeDomain = new EIMCodeDomain();
		code.code = this.code;
		code.nameList = [];
		for (let i = 0; i < this.languages.length; i++) {
			let name: EIMOtherNameDomain = new EIMOtherNameDomain();
			name.langId = this.languages[i].lang;
			name.name = this.nameList[this.languages[i].lang];
			code.nameList.push(name);
		}
		code.disable = this.mutual === this.DISABLE_ON;
		// 最後尾の表示順の次の値を取得
		if (this.codeType.codeList.length > 0) {
			code.sequence = this.codeType.codeList[this.codeType.codeList.length - 1].sequence + 1;
		} else {
			code.sequence = 1;
		}
		// 作成処理実行
		this.codeService.create(this.codeType, code).subscribe(
			(data: EIMCodeDomain) => {
				// 作成結果をコードタイプと紐づける
				this.created.emit([data.id]);
				this.codeType.codeList.push(data);
				// 初期化処理
				this.code = '';
				for (let i = 0; i < this.languages.length; i++) {
					this.nameList[this.languages[i].lang] = '';
				}
				this.codeCreatorForm.reset();
				this.focusTarget.nativeElement.focus();
				window.setTimeout(() => {
					this.mutual = this.DISABLE_OFF;
				});
			}
		);
	}

	/**
	 * コード登録可否を返却します.
	 * @return コード登録可否
	 */
	public creatable(): boolean {
		return this.codeCreatorForm.valid;
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
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}
	}
}
