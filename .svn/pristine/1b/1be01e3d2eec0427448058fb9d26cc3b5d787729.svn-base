import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMIconClassFunctionService } from 'app/shared/services/icon-class-function.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';

/**
 * タスクアイコンクラス返却関数提供サービスクラス
 */
@Injectable()
export class EIMAdminsTaskIconClassFunctionService implements EIMIconClassFunctionService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
	) {}

	/**
	 * 簡易オブジェクトDTOからタスクアイコンクラスを返却します.
	 * @param dto DTO
	 * @returns タスクアイコンクラス
	 */
	public iconClassFunction(dto: EIMSimpleObjectDTO): string {

		let baseObjTypeDefName = dto.type.definitionName;

		// プロジェクト
		if (baseObjTypeDefName === 'ワークスペース') {
			return 'eim-icon-project';
		}

		// プロセス
		if (baseObjTypeDefName === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS) {
			return 'eim-icon-folder eim-icon-folder-color';
		}

		// タスク
		if (baseObjTypeDefName === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK) {
			return 'eim-icon-folder eim-icon-folder-color';
		}

		return null;
	}
}
