import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';


import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMObjectCriteriaDTO } from 'app/object-editors/shared/dtos/criteria/object-criteria.dto';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMConvertService } from 'app/object-editors/shared/services/convert.service';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMSecurityDomain } from 'app/shared/domains/entity/security.domain';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMAttributeTypeDTO } from 'app/object-editors/shared/dtos/attribute-type.dto';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { map } from 'rxjs/internal/operators/map';

/**
 * ファイル情報インターフェース
 */
export interface EIMFile {
	formatId: number;
	formatName: string;
	objId: number;
	fileSize?: number;
	objName?: string;
}

/**
 * オブジェクトAPIサービス
 */
@Injectable()
export class EIMObjectEditorsObjectService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected httpService: EIMHttpService,
		protected jsonService: EIMJSONService,
		protected domainService: EIMDomainService,
		protected attributeService: EIMAttributeService,
		protected serverConfigService: EIMServerConfigService,
		protected convertService: EIMConvertService) {}

	/**
	 * オブジェクトを登録します.
	 * @param object オブジェクトドメイン
	 * @return 登録したオブジェクトドメイン
	 */
	public create(object: EIMObjectDomain): Observable<EIMObjectDomain> {
		let param: any = {};
		param.objType = object.type.id;
		param.objName = object.name;
		param.security = object.security.id;
		this.convertService.setAttributeRequestParameter(param, this.attributeService.excludeNullAttributeList(object.attributeList));

		return this.httpService.postForForm('/rest/object/createObject.mvc', param)
			.pipe(mergeMap((res: any) => {
				return of(this.convertObjectDomain(res.value));
		}));
	}

	/**
	 * オブジェクトを取得します.
	 * @param id オブジェクトID
	 * @return オブジェクトドメイン
	 */
	public getObject(id: number): Observable<EIMObjectDomain> {
		return this.httpService.postForForm('/rest/objAttr/dspProperty.mvc', {id: id})
			.pipe(map((res: any) => {
			return this.convertObjectDomain(res.value);
		}));
	}

	/**
	 * 属性を取得します.
	 * @param id オブジェクトID
	 * @return 属性ドメイン
	 */
	public getAttribute(id: number): Observable<EIMAttributeDomain[]> {
		return this.httpService.postForForm('/rest/objAttr/dspAttribute.mvc', {id: id})
			.pipe(map((res: any) => {
				return this.convertService.convertAttributeDomainList(res.value.attrList.attribute);
		}));
	}

	/**
	 * 親オブジェクトのリストを取得します.
	 * @param id オブジェクトID
	 * @return 親オブジェクトのリスト
	 */
	public getParentList(id: number): Observable<EIMObjectDTO[]> {
		return this.httpService.postForForm('/rest/relation/disorderRelation.mvc', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.convertHierarchicalDomain(res.value, 'object',
					(_json: any) => {
						return new EIMObjectDTO(_json);
					}));
			}));
	}

	/**
	 * 子オブジェクトのリストを取得します.
	 * @param id オブジェクトID
	 * @return 子オブジェクトのリスト
	 */
	public getChildList(id: number): Observable<EIMObjectDTO[]> {
		return this.httpService.postForForm('/rest/relation/orderRelation.mvc', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.convertHierarchicalDomain(res.value, 'object',
					(_json: any) => {
						return new EIMObjectDTO(_json);
				}));
		}));
	}

	/**
	 * オブジェクトを更新します.
	 * @param object オブジェクトドメイン
	 * @return オブジェクトドメイン
	 */
	public update(object: EIMObjectDomain): Observable<EIMObjectDomain> {
		let param: any = {};
		param.id = object.id;
		param.objName = object.name;
		param.securityId = object.security.id;
		this.convertService.setAttributeRequestParameter(param, this.attributeService.excludeNullAttributeList(object.attributeList));
		return this.httpService.postForForm('/rest/objAttr/updateAttribute.mvc', param)
		.pipe(mergeMap((res: any) => {
			return of(this.convertObjectDomain(res.value));
		}));
	}

	/**
	 * オブジェクトのリビジョンリストを取得します.
	 * @param id オブジェクトID
	 * @return オブジェクトのリビジョンリスト
	 */
	public getRevisionList(id: number): Observable<EIMObjectDTO[]> {
		 return this.httpService.postForForm('/object/getObjTypeList.do', {objId: id})
			.pipe(mergeMap((res: any) => {
				return of(this.domainService.createObjectList(res.value.objList.object,
					(_json: any) => {
						return new EIMObjectDTO(_json);
				}));
		}));
	}

	/**
	 * オブジェクトを削除します.
	 * @param selectedData 選択データ
	 */
	public delete(selectedData: any[]): Observable<any> {

		let params = {objId: []};
		for (let i = 0; i < selectedData.length; i++) {
			params.objId.push(selectedData[i].id);
		}
		return this.httpService.postForForm('/rest/object/deleteObject.mvc', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
		}));
	}

	/**
	 * オブジェクトを検索します.
	 * @param criteria 検索条件
	 * @return 検索結果のオブジェクトのリスト
	 */
	public search(criteria: EIMObjectCriteriaDTO, attrList?: EIMAttributeTypeDTO[]): Observable<EIMObjectDTO[]> {
		return this.httpService.postForForm('/rest/search/searchObject.mvc', criteria)
			.pipe(mergeMap((res: any) => {

				// 【Struts撤廃対応】Struts時のレスポンスと同じとなるように体裁を整える
				for (let i=0; i<res.value.object.length; i++){
					for (let key in res.value.object[i].multiValueProps) {
						res.value.object[i][key] = res.value.object[i].multiValueProps[key];
					}
					delete res.value.object[i].multiValueProps;

					for (let key in res.value.object[i].attr.props) {
						res.value.object[i].attr[key] = res.value.object[i].attr.props[key];
					}
					delete res.value.object[i].attr.props;
				}

				return of(this.domainService.createObjectList(res.value.object,
					(_json: any) => {
						return new EIMObjectDTO(_json, attrList);
					}));
			}));
	}

	/**
	 * ファイル情報を取得します.
	 * @param objId オブジェクトID
	 * @return ファイル情報
	 */
	public getFile(objId: Number): Observable<EIMFile[]> {
		return this.httpService.postForForm('/rest/object/dspFile.mvc', {objId: objId})
		.pipe(mergeMap((res: any) => {
			return of(this.convertFile(res.value));
		}));
	}

	/**
	 * オブジェクトタイプを検索します.
	 * @param objId オブジェクトID
	 * @param objName オブジェクト名
	 * @param typeId オブジェクトタイプID
	 * @return オブジェクトタイプのリスト
	 */
	public searchObjectTypeList(objId: number, objName: string, typeId: number): Observable<EIMObjectDTO[]> {
		return this.httpService.postForForm('/rest/search/dspAttribute/searchObjectForAttribute.mvc', {
			objId: objId,
			objName: '*' + objName + '*',
			typeId: typeId,
		}).pipe(mergeMap((res: any) => {
			return of(this.jsonService.convertHierarchicalDomain(res.value.objList.object, 'object',
				(json: any) => {
					return new EIMObjectDTO(json);
				}));
		}));
	}
	/**
	 * ファイルをアップロードします.
	 * @param uploader ファイルアップローダ
	 * @param fileItem ファイル情報
	 * @param param 付加情報
	 * @return
	 */
	public fileUpload(uploader: FileUploader, fileItem: FileItem, param?: any): Observable <any> {
		return this.httpService.upload('/rest/fileio/updateFile.mvc', uploader, fileItem, param);
	}

	/**
	 * 原本ファイルダウンロードします.
	 * @param formatId フォーマットID
	 * @param objectId オブジェクトID
	 * @return
	 */
	public filedownload(formatId: number, objectId: number, ): void {
		let _window = window.open(this.serverConfigService.getContextPath() + '/rest/fileio/downloadFile.mvc?objectId=' + objectId + '&formatId=' + formatId , 'checkoutFrame');
	}

	/**
	 * オブジェクトの全リビジョンを取得します.
	 * @param id ID
	 * @param versionId バージョンID
	 * @return 取得結果
	 */
	public getAllVersion(id: number, versionId: string): Observable<any> {
		return this.httpService.postForForm('/rest/revision/allVersion.mvc', {objId: id, versionId: versionId})
			.pipe(mergeMap((res: any) => {
				let versionList = this.jsonService.convertHierarchicalDomain(res.value.objList.object, 'object',
				(_json: any) => {
					return new EIMObjectDTO(_json);
				})

			return of({
				versionId: res.value.objList.attr.versionId,
				versionList: versionList
			});
		}));
	}

	/**
	 * オブジェクトJSONをオブジェクトドメインに変換して返却します.
	 * @param json JSON
	 * @return オブジェクトドメイン
	 */
	protected convertObjectDomain(json: any): EIMObjectDomain {
		let object: EIMObjectDomain = new EIMObjectDomain();

		if (json.attr.id) {
			object.id = Number(json.attr.id);
		} else {
			object.id = Number(json.attr.objId);
		}
		object.name = json.attr.objName;
		object.type = new EIMObjectTypeDomain();
		object.type.name = json.attr.typeName;
		object.revision = Number(json.attr.rev);
		object.creationUser = new EIMUserDomain();
		object.creationUser.name = json.attr.createUserName;
		object.creationDate = json.attr.createDate;
		object.modificationUser = new EIMUserDomain();
		object.modificationUser.name = json.attr.modifyUserName;
		object.modificationDate = json.attr.modifyDate;
		object.lockUser = new EIMUserDomain();
		object.lockUser.name = json.attr.lockUserName;
		object.lockDate = json.attr.lockDate;
		object.statusTypeName = json.attr.statusTypeName;

		object.security = new EIMSecurityDomain();
		object.security.id = Number(json.attr.securityId);
		object.security.name = json.attr.securityName;

		return object;
	}
	private convertFile(data: any): EIMFile[] {
		let fileList: EIMFile[] = [];
		if (data.fileList && data.fileList.file) {
			if (data.fileList.file instanceof Array) {
				for ( let i = 0 ; data.fileList.file.length > i; i++) {
					fileList.push({
						fileSize: data.fileList.file[i].attr.fileSize,
						formatId: data.fileList.file[i].attr.formatId,
						formatName: data.fileList.file[i].attr.formatName,
						objId: data.fileList.file[i].attr.objId,
						objName: data.fileList.file[i].attr.objName,
					});
				}
			} else {
				fileList.push(data.fileList.file.attr);
			}
			return fileList;
		}
	}
}
