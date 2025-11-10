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
import { EIMObjectDtoToObjectDomainConverter } from 'app/shared/converters/object-dto-to-object-domain.converter';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';


/**
 * 帳票取戻しコンポーネント
 * @example
 *
 *      <eim-task-status-regain-executor
 *        [form]="form"
 *        [regainEventType]="regainEventType"
 *      >
 *      </eim-task-status-regain-executor>
 */
@Component({
	selector: 'eim-task-status-regain-executor',
	templateUrl: './task-status-regain-executor.component.html',
	styleUrls: ['./task-status-regain-executor.component.scss'],

	providers: [
		{ provide: EIMComponent, useExisting: forwardRef(() => EIMTaskStatusRegainExecutorComponent) }
	],
	standalone: false
})
export class EIMTaskStatusRegainExecutorComponent implements EIMExecutable {

	/** オブジェクトDTO */
	@Input() objectDTO: EIMSimpleObjectDTO;

	/** 取戻しイベントタイプ */
	@Input() regainEventType: EIMEventTypeDomain;

	/** 実行完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<any> = new EventEmitter<any>();

	/** 実行中かどうか */
	public executing: boolean = false;

	/** コメント */
	public comment: string = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected taskService: EIMTaskService,
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
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

		// 確認ダイアログ
		let contents: string[] = [];
		contents.push(this.regainEventType.fromStatusType.name + this.translateService.instant('EIM_FORMS.LABEL_02032') + this.regainEventType.toStatusType.name);

		this.messageService.showCheckBoxAndContents(EIMMessageType.confirm, this.translateService.instant('EIM_FORMS.CONFIRM_00003'), contents,
			this.translateService.instant('EIM_TASKS.LABEL_02063'),
			(V: boolean) => {
				// 帳票イベントを実行
				let formEventExec: EIMFormEventExecDomain = new EIMFormEventExecDomain();

				// コメント
				formEventExec.comment = this.comment;
				// イベントタイプ
				formEventExec.eventType = this.regainEventType;
				// ベースイベントタイプ
				formEventExec.baseEventType = this.regainEventType.base;
				// 実行対象オブジェクト
				formEventExec.object = EIMObjectDtoToObjectDomainConverter.convert(this.objectDTO);

				this.taskService.doRegainEvent(formEventExec, V)
					.subscribe(
						(object: EIMObjectDomain) => {
							// ステータス設定
							this.objectDTO.status = object.status;
							
							this.executed.emit(this.objectDTO);
						},
						(err: any) => {
							// エラー発生時
							this.errored.emit();
							this.executing = false;
						});
			}
		);
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
