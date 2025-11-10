import { Injectable } from '@angular/core';
import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMFormAttributeTypeLayoutOptionBuilderService } from 'app/forms/shared/services/form-attribute-type-layout-option-builder.service';

/**
 * 属性タイプレイアウト表示情報ビルダファクトリのサービス
 */
@Injectable()
export class EIMFormAttributeTypeLayoutOptionBuilderFactoryService {
		/**
		 * コンストラクタです.
		 */
		constructor(
			protected attributeTypeLayoutOptionBuilderService: EIMFormAttributeTypeLayoutOptionBuilderService,
		) {}

		/**
		 * 属性タイプレイアウト表示情報ビルダを生成します.
		 * @param form 帳票情報
		 */
		public create(form: EIMFormDomain): EIMFormAttributeTypeLayoutOptionBuilderService {
				return this.attributeTypeLayoutOptionBuilderService;
		}
}
