import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsFormatService } from 'app/admins/shared/services/apis/admins-format.service';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';

/**
 * フォーマット更新コンポーネント
 * @example
 *
 *      <eim-format-updator
 *          [formatId]="formatId">
 *      </eim-format-updator>
 */
@Component({
    selector: 'eim-attritem-selector',
    templateUrl: './attritem-selector.component.html',
    styleUrls: ['./attritem-selector.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMAttritemeSelectorComponent) }
    ],
    standalone: false
})

export class EIMAttritemeSelectorComponent implements OnInit, EIMUpdatable {
	/** フォーマット更新フォーム */
	@ViewChild('attrUpdatorForm') attrUpdatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** フォーマットID */
	@Input() formatId: number;

	/** 登録した言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();


	/**
	 * コンストラクタです.
	 */
	constructor(
			protected adminsFormatService: EIMAdminsFormatService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,

	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性ツリービューを更新します.
	 */
	public update(): void {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * フォーマット更新可否を返却します.
	 * @return フォーマット更新可否
	 */
	public updatable(): boolean {
		let updateFlag = true;

		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			if (!this.nameList[lang.lang]) {
				updateFlag = false;
				break;
			}
		}

		return updateFlag;
	}

	public revup(): void {

	}

	public mutual(): void {

	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		let loopCnt = this.languages.length;
		let lang: any;
		for (let idx = 0; idx < loopCnt; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		let langs: any[];

		this.adminsFormatService.get(this.formatId).subscribe(
			(data: any) => {
				langs = data.lang;
				loopCnt = langs.length;
				for (let idx = 0; idx < loopCnt; idx++) {
					lang = langs[idx];

					this.nameList[lang.attr.otherLId] = lang.attr.otherName;
				}
			}
		);
	}
}
