import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

/**
 * 一般ドキュメント・一般フォルダ・一般タグパイプ
 */
@Pipe({
    name: 'eimContentsNameRenameGeneralPipe',
    standalone: false
})
export class EIMContentsNameRenameGeneralPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

	transform(name: string): any {
		if (!name) {
			return name;
		}

		let label: string;
		// 「ドキュメント」を「一般ドキュメント」、「フォルダ」を「一般フォルダ」、「タグ」を「一般タグ」で表示する
		if (name === this.translateService.instant('EIM_DOCUMENTS.DOCUMENT')) {
			label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_DOCUMENT')
		} else if (name === this.translateService.instant('EIM_DOCUMENTS.FOLDER')) {
			label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_FOLDER')
		} else if (name === this.translateService.instant('EIM_DOCUMENTS.TAG')) {
			label = this.translateService.instant('EIM_DOCUMENTS.GENERAL_TAG')
		} else {
			label = name;
		}

		return label;
	}
}
