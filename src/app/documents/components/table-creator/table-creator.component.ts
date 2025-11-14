import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMTextInputFormItemComponent } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component';

import { EIMTableService, EIMTable, EIMTableItem } from 'app/documents/shared/services/apis/table.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * テーブル登録コンポーネント
 * @example
 *
 * 		<eim-table-creator>
 * 		</eim-table-creator>
 */
@Component({
    selector: 'eim-table-creator',
    templateUrl: './table-creator.component.html',
    styleUrls: ['./table-creator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMTableCreatorComponent) }],
    standalone: false
})
export class EIMTableCreatorComponent implements OnInit, EIMComponent, EIMCreatable {

	/** テーブル登録処理完了のイベントエミッタ */
	@Output() created: EventEmitter<any> = new EventEmitter<any>();

	/** フォームグループ */
	public tableCreatorForm: UntypedFormGroup;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	public disabled = false;

	/**
	 * コンストラクタです.
	 * @param translateService 翻訳サービス
	 * @param tableService テーブルサービス
	 * @param messageService メッセージサービス
	 * @param formBuilder フォームビルダー
	 */
	constructor(
			private translateService: TranslateService,
			private tableService: EIMTableService,
			private messageService: EIMMessageService,
			formBuilder: UntypedFormBuilder
	) {

		// フォーム
		this.tableCreatorForm = formBuilder.group({
			'tableName': new UntypedFormControl(),
		});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 登録ボタン押下時の処理を実施します.
	 */
	public create(): void {

		// テーブル登録
		this.tableService.create(this.tableCreatorForm.controls['tableName'].value)
			.subscribe(
				(object: any) => {
					// メッセージを表示
					this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00008'));
					// 登録ボタン押下完了イベントを通知(画面が閉じる)
					let data: any[] = [];
					data[0] = object.table.attr;
					this.created.emit(data);
				}
			);
	}

	/**
	 * 登録ボタン押下可否を返却します.
	 */
	public creatable(): boolean {
		return (this.tableCreatorForm.dirty && this.tableCreatorForm.valid);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
	}
}
