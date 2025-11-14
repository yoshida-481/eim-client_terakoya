import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, Output, forwardRef, SimpleChange, Injectable } from '@angular/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService, EIMObjectAPIServiceCreateParam, EIMObjectAPIServiceGetListParam, EIMObjectAPIServiceGetParam, EIMObjectAPIServiceUpdateParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { EIMTaskWorkflowDiagramComponentService } from '../workflow-diagram/task-workflow-diagram.component.service';
import { EIMTaskWorkflowDiagramComponent } from '../workflow-diagram/task-workflow-diagram.component';
import { NgForm } from '@angular/forms';
import { EIMTextAreaInputFormItemComponentService } from 'app/shared/components/input-form-item/text-area-input-form-item/text-area-input-form-item.component.service';
import { EIMResponsibleObjectRoleInputFormItemComponentService } from '../responsible-object-role-input-form-item/responsible-object-role-input-form-item.component.service';
import { EIMCalendarInputFormItemComponentService } from 'app/shared/components/input-form-item/calendar-input-form-item/calendar-input-form-item.component.service';
import { EIMNumberInputFormItemComponentService } from 'app/shared/components/input-form-item/number-input-form-item/number-input-form-item.component.service';
import { EIMTaskTemplateFileInputFormItemComponentService } from '../task-template-file-input-form-item/task-template-file-input-form-item.component.service';
import { EIMTaskOutputFileInputFormItemComponentService } from '../task-output-file-input-form-item/task-output-file-input-form-item.component.service';
import { EIMAttributeDTO } from 'app/shared/dtos/attribute.dto';
import { EIMEventTypeDomain } from 'app/shared/domains/entity/event-type.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMTaskOutputFolderInputFormItemComponentService } from '../task-output-folder-input-form-item/task-output-folder-input-form-item.component.service';
import { EIMValueTypeEnumeration } from 'app/shared/enumerations/value-type-enumeration';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMSimpleRelationDTO } from 'app/shared/dtos/simple-relation.dto ';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMTaskInputFormItemDomain } from '../task-form/task-form.component';
import { from } from 'rxjs';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';

/**
 * タスク詳細のコンポーネントサービス
 */
@Injectable()
export class EIMTaskUpdatorComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		public workflowDiagramComponentService: EIMTaskWorkflowDiagramComponentService,
		protected translateService: TranslateService,
		protected objectAPIService: EIMObjectAPIService,
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected textAreaInputFormItemComponentService: EIMTextAreaInputFormItemComponentService,
		protected numberInputFormItemComponentService: EIMNumberInputFormItemComponentService,
		protected calendarInputFormItemComponentService: EIMCalendarInputFormItemComponentService,
		protected templateFileInputFormItemComponentService: EIMTaskTemplateFileInputFormItemComponentService,
		protected taskOutputFileInputFormItemComponentService: EIMTaskOutputFileInputFormItemComponentService,
		protected taskOutputFolderInputFormItemComponentService: EIMTaskOutputFolderInputFormItemComponentService,
		protected responsibleObjectRoleInputFormItemComponentService: EIMResponsibleObjectRoleInputFormItemComponentService,
		protected messageService: EIMMessageService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 添付ファイル登録画面の登録クリック時イベントハンドラです.
	 * @param event イベント
	 */
	public addOutputFileFromTemplateFile(createFileName: string, selectedTemplateFileObject: EIMSimpleObjectDTO, outputDocumentDtos: EIMSimpleObjectDTO[], parentObjectId: number):  Promise<any> {

		let outputFileObj: EIMSimpleObjectDTO = new EIMSimpleObjectDTO();
		outputFileObj.attributeMap = {};

		// ID
		outputFileObj.id = 0;
		// NAME
		outputFileObj.name = createFileName;
		// TYPE
		outputFileObj.type = {definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPORARY_ATTACHMENT_FILE};

		let templateFileObj: EIMSimpleObjectDTO = JSON.parse(JSON.stringify(selectedTemplateFileObject));
		templateFileObj.attributeMap = {};
		outputFileObj.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE] = {
			valueType: 'OBJECT',
			values: [templateFileObj]
		}

		// 成果物文書タイプ
		let outputTypeAttr = selectedTemplateFileObject.attributeMap[
			EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE];
		outputFileObj.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE] = {
			valueType: 'LONG',
			values: outputTypeAttr?.values
		}

		// ファイル名チェック
		for (let i = 0; i < EIMConstantService.INVALID_NAME_CHAR.length; i++) {
			let checkChar: string = EIMConstantService.INVALID_NAME_CHAR[i];
			if (outputFileObj.name.includes(checkChar)) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00009'));
				return;
			}
		}

		//  重複チェック
		for (let i = 0; i < outputDocumentDtos.length; i++) {
			if (outputFileObj.name == outputDocumentDtos[i].name) {
				this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM.ERROR_00004'));

				return;
			}
		}

		let param: EIMObjectAPIServiceCreateParam = {
			dto: outputFileObj,
			parentObjectId: parentObjectId,
			exParameter: {
				registTemporaryFileFromTemplate: true,
			}
		};

		return from(this.objectAPIService.create(param)).toPromise().then((res: any) => {
			
			let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			// 雛型ファイル
			formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE] = {
				valueType: 'OBJECT',
				values: [templateFileObj]
			};
			return formFormatResult.dto;
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	

}
