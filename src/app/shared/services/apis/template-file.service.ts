import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMTemplateFileDTO } from 'app/shared/dtos/template-file.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';

/**
 * テンプレートファイルAPIサービス
 */
@Injectable()
export class EIMTemplateFileService {

	constructor(
			private domainService: EIMDomainService,
			private httpService: EIMHttpService,
			private jsonService: EIMJSONService) {}

	/**
	 * 一時ファイルを登録します.
	 */
	public getList(): Observable<EIMTemplateFileDTO[]> {
    return this.httpService.post('/rest/templateFile/getList.mvc')
		.pipe(mergeMap((res: any) => {
			return of(this.domainService.createObjectList(res.value,
					(_json: any) => {
						return new EIMTemplateFileDTO(_json);
					}));
		}));
	}
}
