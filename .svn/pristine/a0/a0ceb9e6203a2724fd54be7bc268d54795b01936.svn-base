import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';


import { EIMMultipleSelectorComponentService, EIMMultipleSelectionComponentInfo } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { EIMUserService } from 'app/shared/services/apis/user.service';

import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMMultipleCriteriaDTO } from 'app/shared/dtos/criteria/multiple-criteria.dto';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';
import { EIMUserCriteriaDTO } from 'app/shared/dtos/criteria/user-criteria.dto';

@Injectable()
export class EIMUserMultipleSelectorComponentService extends EIMMultipleSelectorComponentService {

	constructor(
		protected userService: EIMUserService,
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	public setData(info: EIMMultipleSelectionComponentInfo): void {

		let data: EIMUserDTO[] = [];

		if (!info.selectedData || info.selectedData.length == 0) {
			info.selectedList.setData(data);
			(<any>info.searchResultList).filter(data);

			return;
		}

		let criteria: EIMUserCriteriaDTO = new EIMUserCriteriaDTO();
		criteria.ids = new EIMMultipleCriteriaDTO<number>();
		for (let i = 0; i < info.selectedData.length; i++) {
			let user: EIMUserDomain = info.selectedData[i];
			criteria.ids.add(user.id);
		}
		this.userService.searchUser(criteria)
			.subscribe((users: EIMUserDTO[]) => {
				let selectUser: EIMUserDTO[] = [];
				for (let i = 0; i < info.selectedData.length; i++) {
					for (let j = 0; j < users.length; j++) {
						if (info.selectedData[i].id == users[j].id) {
							selectUser.push(users[j]);
							break;
						}
					}
				}
				info.selectedList.setData(selectUser);
				(<any>info.searchResultList).filter(selectUser);
		});
	}
}
