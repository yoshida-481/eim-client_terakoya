import { Component, Output, ViewChild, EventEmitter, forwardRef, OnInit, Input } from '@angular/core';

import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMMultipleSelectorComponent } from 'app/shared/components/multiple-selector/multiple-selector.component';
import { EIMTaskService } from 'app/tasks/services/apis/task.service';
import { EIMMemberEntryDomain } from 'app/shared/domains/entity/member-entry.domain';
import { EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';

/**
 * メール通知コンポーネント
 * @example
 *	<project-member-mail-send-executor
 *		[workspaceId]="workspaceId">
 *	</project-member-mail-send-executor>
 */
@Component({
	selector: 'eim-project-member-mail-send-executor',
	templateUrl: './project-member-mail-send-executor.component.html',
	styleUrls: ['./project-member-mail-send-executor.component.scss'],

  providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMProjectMemberMailSendExecutorComponent)}],
  standalone: false
	        })
export class EIMProjectMemberMailSendExecutorComponent implements OnInit, EIMExecutable {

	/** ワークスペースID */
	@Input() public workspaceId: number = null;

	/** タスクID */
	@Input() public taskId: number = null;

	/** メール送信処理完了のイベントエミッタ */
	@Output() executed: EventEmitter<null> = new EventEmitter<null>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** フォーム */
	@ViewChild('propertyForm', { static: true })
	propertyForm: NgForm;

	/** 複数選択コンポーネント */
	@ViewChild('multipleSelector', { static: true }) 
	multipleSelector: EIMMultipleSelectorComponent;

	/** データグリッド変更フラグ */
	public isDirty: boolean = false;

	/** コメント */
	public comment: string = '';

	/** 選択項目左ラベル */
	public leftLabel = this.translateService.instant('EIM_TASKS.LABEL_02050');

	/** 選択項目右ラベル */
	public rightLabel = this.translateService.instant('EIM_TASKS.LABEL_02051');

	/**
	 * コンストラクタです.
	 */
	constructor(
			public multipleSelectorComponentService: EIMMultipleSelectorComponentService,
			protected translateService: TranslateService,
			protected messageService: EIMMessageService,
			protected taskService: EIMTaskService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 実行ボタン押下時の処理を実施します.
	 */
	public execute(): void {
		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM_TASKS.CONFIRM_00009'),
			() => {

				const users: any[] = this.multipleSelector.getData();
				const userIds: number[] = [];
				users.forEach((user) => userIds.push(user.id));

				this.taskService.sendMessage(this.taskId, userIds, this.comment)
					.subscribe(
						(object: any) => {
							// 完了メッセージ表示
							this.messageService.showGrowl(this.translateService.instant('EIM_TASKS.INFO_00007'));

							// 完了イベントを通知(画面が閉じる)
							this.executed.emit();

						},
						(err) => {
							this.errored.emit();
						}
					);
			}
		);
	}


	/**
	 * 実行ボタン押下可否を返却します.
	 * @return 実行ボタン押下可否
	 */
	public executable(): boolean {
		return this.comment !== null && this.comment !== '' && this.multipleSelector.getData().length> 0;
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		event.preventDefault();
		if (this.propertyForm.dirty || this.isDirty) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						close.emit();
					}
			);
		} else {
			close.emit();
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit() {

		// dirty初期化
		this.propertyForm.control.markAsPristine();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
