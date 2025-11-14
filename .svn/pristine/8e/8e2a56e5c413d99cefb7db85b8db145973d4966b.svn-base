import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMPublicNotificationTemplateService } from 'app/shared/services/apis/public-notification-template.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';

import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMEntrySelectorComponentService } from '../entry-selector/entry-selector.component.service';
import { EIMPublicNotificationTemplateComponent } from './public-notification-template.component';

/**
 * 公開通知テンプレート更新コンポーネント
 * @example
 *
 * 		<eim-public-notification-template-updater>
 * 		</eim-public-notification-template-updater>
 */
@Component({
    selector: 'eim-public-notification-template-updater',
    templateUrl: './public-notification-template.component.html',
    styleUrls: ['./public-notification-template.component.css', '../entry-selector/entry-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMPublicNotificationTemplateUpdaterComponent) }],
    standalone: false
})
export class EIMPublicNotificationTemplateUpdaterComponent extends EIMPublicNotificationTemplateComponent implements EIMUpdatable {
	/** テンプレート更新処理完了のイベントエミッタ */
	@Output() updated = new EventEmitter<any>();

	/** テンプレートID */
	@Input() templateId: number;

	/** テンプレート名 */
	@Input() set templateName(templateName: string) {
		this.templateForm.reset({ templateName });
	}

	/** 設定済み */
	@Input() set destination(destination: any[]) {
		for (let i = 0; i < destination.length; i++) {
			const data = Object.assign({}, destination[i]);
			if (data.hasOwnProperty('entryObjId')) {
				data.backupEntryId = data.entryId;
				data.entryId = data.entryObjId;
			}
			this.initData.push(data);
		}
		this.destinationCount = destination.length;
	}

	/**
	 * コンストラクタです.
	 * @param messageService メッセージサービス
	 * @param publicNotificationTemplateService 公開通知テンプレートサービス
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected entryService: EIMEntryService,
		public treeComponentService: EIMEntrySelectorComponentService,
		protected publicNotificationTemplateService: EIMPublicNotificationTemplateService,
	) {
		super(translateService, messageService, entryService, treeComponentService, publicNotificationTemplateService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 更新ボタン押下時の処理を実施します.
	 */
	update() {
		this.publicNotificationTemplateService.updateTemplate(this.templateId, this.templateForm.value.templateName, this.destinationListGrid.getData())
			.subscribe(template => {
				this.updated.emit(template);
			});
	}

	/**
	 * 更新ボタン押下可否を返却します.
	 */
	updatable(): boolean {
		return this.templateForm.value.templateName !== '';
	}

}
