import { Injectable }    from '@angular/core';

import { of, Observable } from 'rxjs';

import { EIMUserDTO } from 'app/shared/dtos/user.dto';

import { EIMHttpService } from 'app/shared/services/http.service';
import { EIMJSONService } from 'app/shared/services/json.service';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { mergeMap } from 'rxjs';

/**
 * ユーザAPIサービス
 */
@Injectable()
export class EIMFormUserService {

  constructor(
			protected httpService: EIMHttpService,
			protected jsonService: EIMJSONService,
			protected domainService: EIMDomainService) {}

  public getSessionUser(displayProgressDialog: boolean = true, displayErrorDialog: boolean = true): Observable<EIMUserDTO> {
    return this.httpService.get('/rest/authenticate/getSessionUser.mvc', null, displayProgressDialog, displayErrorDialog)
			.pipe(mergeMap((res: any) => {
				return of(new EIMUserDTO(res.value));
			}));
	}

	public getNotesMessage(displayProgressDialog: boolean = true, displayErrorDialog: boolean = true): Observable<string> {
		return this.httpService.get('/rest/authenticate/getNotesPasswordMessage.mvc', null, displayProgressDialog, displayErrorDialog)
				.pipe(mergeMap((res: any) => {
					return of(res.value.notesMessage);
				}));
		}
	
	/*
	private convertToConfigKeyValue(json:any):any {
		var keyValue:any = {};
		var target:any = ['isGeneralDocVisible', 'isGeneralFolVisible', 'searchDetailLikeCondition', 'jSessionId', 'eimanagerDocumentVersion'];
		for (var i = 0; i < target.length; i++) {
			var key:string = target[i];
			if (json.attr.hasOwnProperty(key)) {
				keyValue[key] = json.attr[key];
			}
		}
		return keyValue;
	}
	*/
}