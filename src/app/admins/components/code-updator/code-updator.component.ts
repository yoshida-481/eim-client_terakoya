import { EIMOtherNameDomain } from 'app/shared/domains/entity/other-name.domain';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAttrTreeService } from 'app/admins/shared/services/apis/attributeTreeView.service';
import { EIMAttrTreeDTO } from 'app/admins/shared/dtos/attrTree.dto';
import { EIMCodeService } from 'app/admins/shared/services/apis/code.service';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';

/**
 * コード更新コンポーネント
 * @example
 *
 *      <eim-code-updator
 *          [id]="id">
 *      </eim-code-updator>
 */
@Component({
    selector: 'eim-code-updator',
    templateUrl: './code-updator.component.html',
    styleUrls: ['./code-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMCodeUpdatorComponent) }
    ],
    standalone: false
})

export class EIMCodeUpdatorComponent implements OnInit, EIMUpdatable {

	/** 操作対象コードID */
	@Input() id: number;

	/** コード更新フォーム */
	@ViewChild('codeUpdatorForm', { static: true }) codeUpdatorForm: NgForm;

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

	/** 編集対象コード */
	private targetCode: EIMCodeDomain;

	/** コード名称 */
	public code = '';

	/** 無効フラグ */
	public mutual = this.DISABLE_OFF;

	/** 作成完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

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

	/**
	 * コードを更新します.
	 */
	public update(): void {
// 登録に必要な情報を取得
		let code: EIMCodeDomain = this.targetCode;
		code.nameList = [];
		for (let i = 0; i < this.languages.length; i++) {
			let name: EIMOtherNameDomain = new EIMOtherNameDomain();
			name.langId = this.languages[i].lang;
			name.name = this.nameList[this.languages[i].lang];
			code.nameList.push(name);
		}
		code.disable = this.mutual === this.DISABLE_ON;
		// 更新処理実行
		this.codeService.update(code).subscribe(
			(data: number) => {
				// 更新成功時、更新対象コードIDを返却
				this.updated.emit([data]);
			}
		);
	}

	/**
	 * コード更新可否を返却します.
	 * @return コード更新可否
	 */
	public updatable(): boolean {
		return this.codeUpdatorForm.dirty && this.codeUpdatorForm.valid;
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
		this.codeService.getById(this.id).subscribe(
			(res: EIMCodeDomain) => {
				this.targetCode = res;
				this.code = this.targetCode.code;
				if (this.targetCode.disable) {
					this.mutual = this.DISABLE_ON;
				}
				let otherNameList = this.targetCode.nameList;
				for (let i = 0; i < otherNameList.length; i++) {
					this.nameList[otherNameList[i].langId] = otherNameList[i].name;
				}
			}, (err: any) => {
				this.errored.emit();
			}
		);
	}
}
