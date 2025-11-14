import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMClassService } from 'app/admins/shared/services/apis/class.service';
import { EIMDataGridSingleSelectorComponentInfo, EIMDataGridSingleSelectorComponentService } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

/**
 * フォーマット選択コンポーネントサービス
 */
@Injectable()
export class EIMFormatSelectorComponentService extends EIMDataGridSingleSelectorComponentService {

	/**
	 * コンストラクタです.
	 * @param messageService メッセージサービス
	 * @param translateService 翻訳サービス
	 * @param classService クラスサービス
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected classService: EIMClassService,
	) {
		super(translateService);
	}

	/**
	 * 検索します.
	 * @param info データグリッドコンポーネント情報
	 * @param condition 検索条件
	 */
	public search(info: EIMDataGridSingleSelectorComponentInfo, condition: any): void {

		// フォーマット名の曖昧検索条件
		let searchCond = '*';
		if (condition.formatName) {
			searchCond = '*' + condition.formatName + '*';
		}
		this.classService.getFormatList(searchCond).subscribe((formatInfo: any[]) => {
			if (formatInfo.length === 0) {
				this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
			}
			info.dataGrid.setData(formatInfo);
		});
	}

	/**
	 * 比較します.
	 * @param a 比較対象
	 * @param b 比較対象
	 */
	public equals(a: any, b: any): boolean {
		return (a.formatId === b.formatId);
	}
}
