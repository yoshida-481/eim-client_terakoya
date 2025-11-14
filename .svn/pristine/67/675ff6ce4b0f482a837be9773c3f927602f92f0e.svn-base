import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMEntryService, EIMEntry } from 'app/shared/services/apis/entry.service';
import { EIMEntryUserDTO } from 'app/shared/dtos/entry-user.dto';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';

/**
 * アプリケーションAPIサービス
 */
@Injectable()
export class EIMAdminsApplicationService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		private httpService: EIMHttpService,
		private jsonService: EIMJSONService,
		private entryService: EIMEntryService,
	) {}

	/**
	 * アプリケーションリストを取得します.
	 */
	public getApplicationList(): Observable<any[]> {
		return this.httpService.postForForm('/admin/conf/dspAdminApplicationXML.jsp').pipe(mergeMap(
			(res: any) => {
				let children: any[] = this.jsonService.getJsonChildren(res.value.applicationList.application );
				let objects: any[] = [];
				for (let i = 0; i < children.length; i++) {
					let object: any = children[i].attr;
					objects.push({id: object.id, name: object.name});
				}
				return of(objects);
			}
		));
	}

	/**
	 * グループのアコーディオン表示形式の設定値を取得します.
	 */
	public getSelectAccordion(): Observable<string> {
		return this.httpService.get('/admin/conf/dspSelectAccordionXML.jsp').pipe(mergeMap(
			(res: any) => {
				return of(res.value.accordion.attr.selectAccordion);
			}
		));
	}
}
