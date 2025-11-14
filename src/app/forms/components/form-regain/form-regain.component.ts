import { Component, forwardRef, ViewChild, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';

import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';

import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMFormDomainService } from 'app/forms/shared/services/form-domain.service';

import { EIMEventTypeDomain } from 'app/shared/domains/entity/event-type.domain';

import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMFormEventExecDomain } from "app/shared/domains/form-event-exec.domain";


/**
 * 帳票取戻しコンポーネント
 * @example
 *
 *      <eim-form-regain
 *        [form]="form"
 *        [regainEventType]="regainEventType"
 *      >
 *      </eim-form-regain>
 */
@Component({
    selector: 'eim-form-regain',
    templateUrl: './form-regain.component.html',
    styleUrls: ['./form-regain.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormRegainComponent) }
    ],
    standalone: false
})
export class EIMFormRegainComponent implements EIMExecutable {

	/** 帳票情報 */
	@Input() form: EIMFormDomain;

	/** 取戻しイベントタイプ */
	@Input() regainEventType: EIMEventTypeDomain;

	/** 帳票詳細のdirtyフラグ */
	@Input() dirty: boolean;

	/** 実行完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<any> = new EventEmitter<any>();

	/** 実行中かどうか */
	public executing: boolean = false;

	/** コメント */
	public comment: string = "";

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected formService: EIMFormService,
		protected formDomainService: EIMFormDomainService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 帳票取戻しを実行します.
	 */
	public execute(): void {
		this.executing = true;

		let form: EIMFormDomain = this.form;

		// 帳票更新
		if (this.dirty) {
			this.formService.update(form)
				.subscribe(
					(resForm: EIMFormDomain) => {
					},
					(err: any) => {
						this.errored.emit();
					});
		}

		// 帳票イベントを実行
		let formEventExec: EIMFormEventExecDomain = new EIMFormEventExecDomain();

		// コメント
		formEventExec.comment = this.comment;
		// イベントタイプ
		formEventExec.eventType = this.regainEventType;
		// ベースイベントタイプ
		formEventExec.baseEventType = this.regainEventType.base;
		// 実行対象オブジェクト
		formEventExec.object = form;
		form.status.modificationDate = null; //ステータス変更時と同様の処理

		this.formService.doRegainEvent(formEventExec)
			.subscribe(
				(resForm: EIMFormDomain) => {
					this.executed.emit(resForm);
				},
				(err: any) => {
					// エラー発生時
					this.errored.emit();
				});


	}

	/**
	 * 帳票取戻し実行可否を返却します.
	 * @return 帳票取戻し実行可否
	 */
	public executable(): boolean {
		return !this.executing;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

}
