import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { EIMCodeTypeService } from 'app/admins/shared/services/apis/codeType.service';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * コードタイプ更新コンポーネント
 * @example
 *
 *      <eim-codetype-updator
 *          [codeTypeId]="codeTypeId">
 *      </eim-codetype-updator>
 */
@Component({
    selector: 'eim-codetype-updator',
    templateUrl: './codetype-updator.component.html',
    styleUrls: ['./codetype-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMCodeTypeUpdatorComponent) }
    ],
    standalone: false
})

export class EIMCodeTypeUpdatorComponent implements OnInit, EIMUpdatable {

	/** コードタイプID */
	@Input() codeTypeId: number;

	/** コードタイプ更新フォーム */
	@ViewChild('codeTypeUpdatorForm', { static: true }) codeTypeUpdatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 名称 */
	public name = '';

	/** 編集対象コードタイプ */
	public targetCodeType: EIMCodeTypeDomain;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

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
	public update(): void {
		this.targetCodeType.definitionName = this.name;
		this.codeTypeService.update(this.targetCodeType).subscribe(
			(data: number) => {
				this.updated.emit([data]);
			}
		);
	}

	/**
	 * コードタイプ登録可否を返却します.
	 * @return コードタイプ登録可否
	 */
	public updatable(): boolean {
		 return this.codeTypeUpdatorForm.valid &&  this.codeTypeUpdatorForm.dirty;
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
				this.name = data.definitionName;
				this.targetCodeType = new EIMCodeTypeDomain(data);
			},
			(err: any) => {
				this.errored.emit();
			}
		);
	}
}
