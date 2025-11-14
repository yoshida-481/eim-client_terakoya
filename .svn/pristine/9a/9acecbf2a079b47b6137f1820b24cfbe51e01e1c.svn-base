import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMGanttChartTreeNode } from 'app/shared/components/gantt-chart/gantt-chart.component';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMIconClassFunctionService } from 'app/shared/services/icon-class-function.service';
import { EIMTaskConstantService } from './task-constant.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';

/**
 * タスク管理で使用するアイコンクラスファンクション提供クラスです.
 */
@Injectable()
export class EIMTaskIconClassFunctionService implements EIMIconClassFunctionService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
	) {}

	/**
	 * アイコンクラスファンクションです.
	 * @param dto オブジェクトDTO
	 * @returns アイコンクラス名
	 */
	public iconClassFunction(data: EIMGanttChartTreeNode | EIMSimpleObjectDTO): string {

		let dto: EIMSimpleObjectDTO = null;
		if (data['treeNodeId']) {
			dto = (data as EIMGanttChartTreeNode).dto;
		} else {
			dto = data as EIMSimpleObjectDTO;
		}

		let baseObjTypeDefName = dto.exAttributeMap?.baseObjTypeDefName;

		// ワークスペース/プロジェクトマスタ
		if (baseObjTypeDefName === EIMDocumentsConstantService.OBJECT_TYPE_WORKSPACE
				|| baseObjTypeDefName === EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER) {
			return 'eim-icon-project fa fw fa-lg';
		}

		// プロセス/マスタ
		if (baseObjTypeDefName === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS
				|| baseObjTypeDefName === EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS_MASTER) {
			return 'eim-icon-process fa fw fa-lg';
		}

		// タスク/マスタ
		if (baseObjTypeDefName === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK
				|| baseObjTypeDefName === EIMTaskConstantService.OBJECT_TYPE_NAME_TASK_MASTER) {
			return 'eim-icon-task fa fw fa-lg';
		}

		return null;
	}
}
