import { EIMEntryService } from 'app/shared/services/apis/entry.service';
import { EIMPublicNotificationTemplateService } from 'app/shared/services/apis/public-notification-template.service';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';

import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMEntrySelectorComponentService } from '../entry-selector/entry-selector.component.service';
import { EIMPublicNotificationTemplateComponent } from './public-notification-template.component';

/**
 * 公開通知テンプレート登録コンポーネント
 * @example
 *
 * 		<eim-public-notification-template-creator>
 * 		</eim-public-notification-template-creator>
 */
@Component({
    selector: 'eim-public-notification-template-creator',
    templateUrl: './public-notification-template.component.html',
    styleUrls: ['./public-notification-template.component.css', '../entry-selector/entry-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMPublicNotificationTemplateCreatorComponent) }],
    standalone: false
})
export class EIMPublicNotificationTemplateCreatorComponent extends EIMPublicNotificationTemplateComponent implements EIMCreatable {
	/** テンプレート登録処理完了のイベントエミッタ */
	@Output() created = new EventEmitter<any>();

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
	 * 登録ボタン押下時の処理を実施します.
	 */
	create() {
		this.publicNotificationTemplateService.createTemplate(this.templateForm.value.templateName, this.destinationListGrid.getData())
			.subscribe(template => {
				this.created.emit(template);
			});
	}

	/**
	 * 登録ボタン押下可否を返却します.
	 */
	creatable(): boolean {
		return this.templateForm.value.templateName !== '';
	}

}
