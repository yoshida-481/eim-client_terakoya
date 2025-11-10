import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';

import { EIMBoxFolderDomain } from 'app/shared/domains/box-folder.domain';
import { EIMBoxFileDomain } from 'app/shared/domains/box-file.domain';

/**
 * BoxフォルダAPIサービス
 */
@Injectable()
export class EIMBoxFolderService {
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected domainService: EIMDomainService,
		protected httpService: EIMHttpService,
	) {
	}

	/**
	 * Boxフォルダ情報を取得します.
	 * @param id BoxフォルダID
	 * @return Boxフォルダ情報
	 */
	getById(id: String): Observable<EIMBoxFolderDomain> {
		return this.httpService.get('/rest/box/folders/' + id + '.mvc', null)
			.pipe(map(res => this.domainService.createObject(res.value,
				json => new EIMBoxFolderDomain(json))));
	}

	/**
	 * Boxフォルダの子情報リストを取得します.
	 * @param parentId 親BoxフォルダID
	 * @return Boxフォルダの子情報リスト
	 */
	getChildrenByParentId(parentId: String): Observable<EIMBoxFolderDomain[] | EIMBoxFileDomain[]> {
		return this.httpService.get('/rest/box/folders/' + parentId + '/children.mvc', null)
			.pipe(map(res => this.domainService.createObjectList(res.value,
				json => {
						if (json.type === 'file') {
							return new EIMBoxFileDomain(json);
						} else if (json.type === 'folder') {
							return new EIMBoxFolderDomain(json);
						}
						return null;
				}).filter(x => x !== null)));
	}
}
