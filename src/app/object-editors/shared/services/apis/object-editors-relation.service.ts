import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMConvertService } from 'app/object-editors/shared/services/convert.service';

import { EIMObjectTypeDTO } from 'app/object-editors/shared/dtos/object-type.dto';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMRelationDomain } from 'app/shared/domains/entity/relation.domain';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMRelationTypeDomain } from 'app/shared/domains/entity/relation-type.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/internal/operators/map';

/**
 * リレーションタイプAPIサービス
 */
@Injectable()
export class EIMObjectEditorsRelationService {

	/** キャッシュしているオブジェクトツリー */
	public cachedTree: EIMObjectTypeDTO[];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService,
		protected attributeService: EIMAttributeService,
		protected convertService: EIMConvertService,
		protected hierarchicalDomainService: EIMHierarchicalDomainService) {}

	/**
	 * リレーションタイプ一覧を取得します.
	 * 取得データはキャッシュします.
	 * @return リレーションタイプ一覧
	 */
	public getTree(): Observable<EIMObjectTypeDTO[]> {
		if (this.cachedTree) {
			return of(this.cachedTree);
		}
		return this.httpService.get('/rest/relation/relTypeList.mvc')
			.pipe(mergeMap((res: any) => {
				this.cachedTree =
						this.jsonService.convertHierarchicalDomain(
								res.value.nodes.node, 'node', (json): EIMObjectTypeDTO => { return new EIMObjectTypeDTO(json); });
				return of(this.cachedTree);
			}));
	}

	/**
	 * リレーションを登録します.
	 * @param createData 登録データ
	 * @return 空のObservable
	 */
	public createRelation(createData: EIMRelationDomain): Observable<null> {
		let param: any = {};
		param.childObjId = createData.child.id;
		param.parentObjId = createData.parent.id;
		param.relTypeId = createData.type.id;
		return this.httpService.postForForm('/rest/relation/createRelation.mvc', param).pipe(mergeMap((res: any) => {
			return of(null);
		}));
	}

	/**
	 * リレーション情報を取得します.
	 * @param id リレーションID
	 * @return リレーション情報ドメイン
	 */
	public getRelation(id: number): Observable<EIMRelationDomain> {
		return this.httpService.postForForm('/rest/relAttr/dspProperty.mvc', {id: id}).pipe(map((res: any) => {
			return this.convertRelationDomain(res.value);

		}));
	}

	/**
	 * 属性を取得します.
	 * @param id リレーションID
	 * @return 属性ドメイン
	 */
	public getAttribute(id: number): Observable<EIMAttributeDomain[]> {
		return this.httpService.postForForm('/rest/relAttr/dspAttribute.mvc', {id: id}).pipe(map((res: any) => {
			return this.convertService.convertAttributeDomainList(res.value.attrList);
		}));
	}

	/**
	 * リレーションを更新します.
	 * @param relation リレーションドメイン
	 * @return 空のObservable
	 */
	public update(relation: EIMRelationDomain): Observable<null> {
		let param: any = {};
		param.id = relation.id;
		param.objName = '';
		this.convertService.setAttributeRequestParameter(param, this.attributeService.excludeNullAttributeList(relation.attributeList));
		return this.httpService.postForForm('/rest/relAttr/updateAttribute.mvc', param).pipe(mergeMap((res: any) => {
			return of(null);
		}));
	}


	/**
	 * リレーションを削除します.
	 * @param selectedData 選択データ
	 */
	public delete(selectedData: any[]): Observable<any> {

		let params = {relId: []};
		for (let i = 0; i < selectedData.length; i++) {
			params.relId.push(selectedData[i].relId);
		}

		return this.httpService.postForForm('/rest/relation/deleteRelation.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * リレーションタイプ階層をクリアします.
	 */
	public clearTree(): void {
		this.cachedTree = null;
	}

	/**
	 * リレーションJSONをドメインに変換して返却します.
	 * @param json JSON
	 * @return リレーションドメイン
	 */
	protected convertRelationDomain(json: any): EIMRelationDomain {
		let relation: EIMRelationDomain = new EIMRelationDomain();

		relation.child = new EIMObjectDomain();
		relation.child.name = json.attr.childObjName;
		relation.id = Number(json.attr.id);
		relation.parent = new EIMObjectDomain();
		relation.parent.name = json.attr.parentObjName;
		relation.type = new EIMRelationTypeDomain();
		relation.type.id = Number(json.attr.relTypeId);
		relation.type.name = json.attr.typeName;
		return relation;
	}

}
