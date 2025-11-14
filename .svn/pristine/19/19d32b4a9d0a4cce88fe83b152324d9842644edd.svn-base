import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';

import { EIMObjectTypeDTO } from 'app/object-editors/shared/dtos/object-type.dto';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAttributeTypeDTO } from 'app/object-editors/shared/dtos/attribute-type.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * オブジェクトタイプAPIサービス
 */
@Injectable()
export class EIMObjectEditorsObjectTypeService {

	/** キャッシュしているオブジェクトツリー */
	public cachedTree;

	/**
	 * コンストラクタです.
	 */
	constructor(
		private httpService: EIMHttpService,
		private jsonService: EIMJSONService,
		private domainService: EIMDomainService,
		private hierarchicalDomainService: EIMHierarchicalDomainService) {}

	/**
	 * オブジェクトタイプ階層を取得します.
	 * 取得データはキャッシュします.
	 * @return オブジェクトタイプ階層
	 */
	public getTree(): Observable<EIMObjectTypeDTO[]> {
		if (this.cachedTree) {
			return of(this.cachedTree);
		}
		return this.httpService.postForForm('/rest/object/getObjTypeList.mvc')
			.pipe(mergeMap((res: any) => {
				this.cachedTree =
						this.jsonService.convertHierarchicalDomain(
								res.value.nodes.node, 'node', (json): EIMObjectTypeDTO => { return new EIMObjectTypeDTO(json); });
								return of(this.cachedTree);

			}));
	}

	/**
	 * オブジェクトタイプに紐づく属性タイプリストを取得します.
	 * @param id オブジェクトタイプID
	 * @return 属性タイプリスト
	 */
	public getAttributeTypeList(id: number): Observable<EIMAttributeTypeDTO[]> {
		return this.httpService.postForForm('/rest/object/getObjTypeAttrList.mvc', {typeId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.attrList.attribute,
					(_json: any) => {
						return new EIMAttributeTypeDTO(_json);
					}));
			}));
	}

	/**
	 * ステータスタイプリストを取得します.
	 * @param id オブジェクトタイプID
	 * @return ステータスタイプリスト
	 */
	public getStatusTypeList(id: number): Observable<any> {
		let param = {
			typeId: id
		}
		let test;
		return this.httpService.postForForm('/rest/search/getStatusType.mvc', param)
			.pipe(mergeMap((res: any) => {
				return of(res.value)
		}));
	}

	/**
	 * オブジェクトタイプ階層をクリアします.
	 */
	public clearTree(): void {
		this.cachedTree = null;
	}

}
