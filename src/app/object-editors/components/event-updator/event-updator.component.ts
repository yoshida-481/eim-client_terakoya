import { Component, ViewChild, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMMenuItem, EIMListComponent, EIMComponent } from 'app/shared/shared.interface';
import { EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMObjectListComponentService } from 'app/object-editors/components/object-list/object-list.component.service';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMEventDomain } from 'app/shared/domains/entity/event.domain';
import { EIMObjectEditorsEventService } from 'app/object-editors/shared/services/apis/object-editors-event.service';
import { NgForm } from '@angular/forms';
import { EIMMessageService } from 'app/shared/services/message.service';

/**
 * イベント更新コンポーネント
 * @example
 *
 *      <eim-event-updator
 *        [eventId]="eventId"
 *        [objectId]="objectId">
 *      </eim-event-updator>
 */
@Component({
    selector: 'eim-event-updator',
    templateUrl: './event-updator.component.html',
    styleUrls: ['./event-updator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMEventUpdatorComponent) }],
    standalone: false
})
export class EIMEventUpdatorComponent implements OnInit, EIMUpdatable {

	/** フォーム */
	@ViewChild('eventUpdator', { static: true }) eventUpdator: NgForm;

	/** イベントID */
	@Input() eventId: number;

	/** オブジェクトID */
	@Input() objectId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<null> = new EventEmitter<null>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** イベント */
	public event: EIMEventDomain;

	/** 上部スプリットの初期比率 */
	public splitAreaFirstSize = 35;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectEditorsEventService: EIMObjectEditorsEventService,
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
		this.objectEditorsEventService.update(this.event, this.objectId).subscribe(
			() => {
				this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00005', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_01009')}));
				this.updated.emit();
			},
		);
	}

	/**
	 * 更新可否を返却します.
	 * @return 更新可否
	 */
	public updatable(): boolean {
		return this.eventUpdator.dirty && this.eventUpdator.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.objectEditorsEventService.getEvent(this.eventId).subscribe(
			(event: EIMEventDomain) => {
				this.objectEditorsEventService.getAttribute(this.eventId).subscribe(
					(attributeList: EIMAttributeDomain[]) => {
						this.event = event;
						this.event.attributeList = attributeList;
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
