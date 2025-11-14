import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMContentsDomain } from 'app/documents/shared/domains/contents.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMDocumentsAttributeDomainService } from 'app/documents/shared/services/documents-attribute-domain.service';
import { EIMContentsService } from 'app/documents/shared/services/apis/contents.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * コンテンツAPIサービス
 */
@Injectable()
export class EIMAdminsContentsService extends EIMContentsService {

	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected attributeService: EIMDocumentsAttributeDomainService,
	) {
		super(httpService, jsonService, attributeService);
	}

	/**
	 * 更新します.
	 */
	public update(contents: EIMContentsDomain): Observable<null> {
		// パラメータを設定
		let params: any = {
				objId: contents.id,
				objName: contents.name,
		};
		let attributeTypeLayoutList = contents.formLayout.objectTypeLayout.attributeTypeLayoutList;

		contents.attributeList = this.attributeService.getVisibleAttributeList(contents.attributeList, attributeTypeLayoutList)
		for (let i = 0; i < contents.attributeList.length; i++) {
			let attribute: EIMAttributeDomain = contents.attributeList[i];

			let attrKeyPrefix: string = 'attType_' + attribute.attributeType.id + '_';

			// 属性値
			this.attributeService.setAttributeParams(params, attrKeyPrefix, attribute);

			// 読み込み専用
			let isReadOnly = false;
			for (let j = 0; j < attributeTypeLayoutList.length; j++) {
				let attributeTypeLayout = attributeTypeLayoutList[j];
				if (Number(attribute.attributeType.id) === Number(attributeTypeLayout.id) && attributeTypeLayout.successionFlag) {
					isReadOnly = true;
				}
			}
			params[attrKeyPrefix + 'readOnly'] = isReadOnly;

			// 下位引継ぎ
			if (attribute['_lowSuccession']) {
				params[attrKeyPrefix + 'lowerSuccession'] = 1;
			}
		}

		// 名称割当
		params['attType_nameAllocate'] = contents['_nameAllocationAttributeTypeId'];

		return this.httpService.postForForm('/admin/workspace/actUpdateAttribute.jsp', params)
		.pipe(mergeMap((res: any) => {
					return of(null);
		}));
	}
}
