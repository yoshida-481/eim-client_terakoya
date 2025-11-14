import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMCodeTypeService } from 'app/admins/shared/services/apis/codeType.service';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * コードタイプ複写コンポーネント
 * @example
 *
 *      <eim-codetype-copy>
 *      </eim-codetype-copy>
 */
@Component({
    selector: 'eim-codetype-copy',
    templateUrl: './codetype-copy.component.html',
    styleUrls: ['./codetype-copy.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMCodeTypeCopyComponent) }
    ],
    standalone: false
})

export class EIMCodeTypeCopyComponent implements OnInit, EIMCreatable {

	/** コードタイプID */
	@Input() codeTypeId: number;

	/** コードタイプ複写フォーム */
	@ViewChild('codeTypeCopyForm', { static: true }) codeTypeCopyForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 名称 */
	public name = '';

	/** 編集対象コードタイプ */
	public targetCodeType: EIMCodeTypeDomain;

	/** 流用作成時付与文字列 */
	private readonly COPY_WORD = '- Copy';

	/** 更新完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected codeTypeService: EIMCodeTypeService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コードタイプの複写を実行します.
	 */
	public create(): void {
		let createCodeType = new EIMCodeTypeDomain(this.targetCodeType);
		createCodeType.definitionName = this.name;
		this.codeTypeService.copy(this.targetCodeType, createCodeType).subscribe(
			(result: EIMCodeTypeDomain) => {
				this.created.emit([result.id]);
			}
		);
	}

	/**
	 * コードタイプ登録可否を返却します.
	 * @return コードタイプ登録可否
	 */
	public creatable(): boolean {
		 return this.codeTypeCopyForm.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.codeTypeService.getById(this.codeTypeId).subscribe(
			(data: EIMCodeTypeDomain) => {
				this.name = data.definitionName + this.COPY_WORD;
				this.targetCodeType = new EIMCodeTypeDomain(data);
			},
			(err: any) => {
				this.errored.emit();
			}
		);
	}
}
