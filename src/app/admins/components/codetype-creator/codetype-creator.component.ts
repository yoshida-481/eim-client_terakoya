import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMCodeTypeService } from 'app/admins/shared/services/apis/codeType.service';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * コードタイプ登録コンポーネント
 * @example
 *
 *      <eim-codetype-creator>
 *      </eim-codetype-creator>
 */
@Component({
    selector: 'eim-codetype-creator',
    templateUrl: './codetype-creator.component.html',
    styleUrls: ['./codetype-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMCodeTypeCreatorComponent) }
    ],
    standalone: false
})

export class EIMCodeTypeCreatorComponent implements EIMCreatable {

	/** コードタイプ作成フォーム */
	@ViewChild('codeTypeCreatorForm', { static: true }) codeTypeCreatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 名称 */
	public name = '';

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected codeTypeService: EIMCodeTypeService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コードタイプを登録します.
	 */
	public create(): void {
		let codeType: EIMCodeTypeDomain = new EIMCodeTypeDomain;
		codeType.definitionName = this.name;
		this.codeTypeService.create(codeType).subscribe(
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
		 return this.codeTypeCreatorForm.valid;
	}
}
