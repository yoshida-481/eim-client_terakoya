import { Component, ViewChild, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { EIMComponent } from 'app/shared/shared.interface';
import { EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMObjectEditorsStatusService } from 'app/object-editors/shared/services/apis/object-editors-status.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { NgForm } from '@angular/forms';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';

/**
 * ステータス更新コンポーネント
 * @example
 *
 *      <eim-status-updator
 *        [statusId]="statusId"
 *        [objectId]="objectId"
 *        [title]="title">
 *      </eim-status-updator>
 */
@Component({
    selector: 'eim-status-updator',
    templateUrl: './status-updator.component.html',
    styleUrls: ['./status-updator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMStatusUpdatorComponent) }],
    standalone: false
})
export class EIMStatusUpdatorComponent implements OnInit, EIMUpdatable {

	/** フォーム */
	@ViewChild('statusUpdatorForm', { static: true }) statusUpdatorForm: NgForm;

	/** ステータスID */
	@Input() statusId: number;

	/** オブジェクトID */
	@Input() objectId: number;

	/** 画面タイトル */
	@Input() title: string;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<null> = new EventEmitter<null>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** ステータス */
	public status: EIMStatusDomain;

	/** 上部スプリットの初期比率 */
	public splitAreaFirstSize = 35;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectEditorsStatusService: EIMObjectEditorsStatusService,
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected messageService: EIMMessageService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 更新を実行します.
	 */
	public update(): void {
		this.objectEditorsStatusService.update(this.status, this.objectId).subscribe(
			() => {
				this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00005', {value: this.title}));
				this.updated.emit();
			}
		);
	}

	/**
	 * 更新可否を返却します.
	 * @return 更新可否
	 */
	public updatable(): boolean {
		return this.statusUpdatorForm.dirty && this.statusUpdatorForm.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.objectEditorsStatusService.getStatus(this.statusId).subscribe(
			(status: EIMStatusDomain) => {
				this.objectEditorsStatusService.getAttribute(this.statusId).subscribe(
					(attributeList: EIMAttributeDomain[]) => {
						this.status = status;
						this.status['attributeList'] = attributeList;
					},
					(err: any) => {
						this.errored.emit();
					}
				)
			},
			(err: any) => {
				this.errored.emit();
			}
		);
	}
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
