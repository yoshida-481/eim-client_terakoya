import { Component, ViewChild, forwardRef, OnInit, SimpleChanges, Input, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDataGridComponentService } from 'app/shared/components/data-grid/data-grid.component.service';


import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMObjectAPIService, EIMObjectAPIServiceDownloadFileParam, EIMObjectAPIServiceGetListParam } from 'app/shared/services/apis/object-api.service';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSimpleSearchObjectResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMValueRendererComponent } from 'app/shared/components/renderer/value-renderer.component';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFileIconClassFunctionService } from 'app/shared/services/file-icon-class-function.service';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { EIMSimpleSearchConditionLeftAttributeType, EIMSimpleSearchObjectConditionLeftAttributeType } from 'app/shared/builders/simple-search/simple-search-condition-left-attribute-type';

/**
 * 改訂履歴コンポーネント
 * @example
 *
 *      <eim-task-revision-history
 *          [content]="content">
 *      </eim-task-revision-history>
 */
@Component({
	selector: 'eim-task-revision-history',
	templateUrl: './task-revision-history.component.html',
	styleUrls: ['./task-revision-history.component.scss'],
	providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMTaskRevisionHistoryComponent)}],
	standalone: false
})
export class EIMTaskRevisionHistoryComponent implements OnInit, OnChanges, OnDestroy {

	/** データグリッド */
	@ViewChild('revisionHistoryDataGrid', { static: true })
		revisionHistoryDataGrid: EIMDataGridComponent;

	/** 表示対象のオブジェクト */
	@Input() targetContent: any;

	/** 表示対象のオブジェクト */
	@Input() isDispReivisonDetail: boolean;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected objectAPIService: EIMObjectAPIService,
		protected translateService: TranslateService,
		protected serverConfigService: EIMServerConfigService,
		protected dataGridComponentService: EIMDataGridComponentService,
		protected fileIconClassFunctionService: EIMFileIconClassFunctionService,
		protected messageService: EIMMessageService,
		protected jsonToListFormatResultDTOConverterService: EIMJsonToListFormatResultDTOConverterService
	) {
		
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
  /**
	 * 画面を表示します.
	 */
	public show(): void {
		// 改訂履歴取得

		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		// apiParam.comparatorIds = ['baseObjectTypeComparator'];

		apiParam.objectCriteria =
				new EIMSimpleSearchObjectCriteriaBuilder()
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().type().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().revision().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().latest().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().modificationDate().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().modificationUser().end())
					.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().attribute("改訂内容").end())
					.setConditionGroup({
						op: EIMSearchLogicalOperatorEnum.AND,
						conditions: [
							new EIMSimpleSearchConditionCriteria(new EIMSimpleSearchObjectConditionLeftAttributeType().baseType().definitionName().end(), EIMSearchOperatorEnum.EQ, 'ドキュメント'),
							new EIMSimpleSearchConditionCriteria(new EIMSimpleSearchObjectConditionLeftAttributeType().revisionGroupId().end(), EIMSearchOperatorEnum.EQ, this.targetContent.revisionGroupId),
						]
					})
					.build();
					
		apiParam.relatedObjectCriterias = [];

		// 取得
		this.objectAPIService.getList(apiParam).subscribe((res: any) => {
			let listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);
			if (listFormatResult.dtos.length == 0) {
				this.messageService.show(EIMMessageType.info, this.translateService.instant('EIM_TASKS.ERROR_00007'));
				this.errored.emit();
			}
			listFormatResult.dtos.sort(function(a: EIMSimpleObjectDTO, b: EIMSimpleObjectDTO) {
				// リビジョンの降順にソートする
				if ( a.revision > b.revision )
					return -1;
				if ( a.revision < b.revision )
					return 1;
				return 0;
			});

			this.revisionHistoryDataGrid.setData(listFormatResult.dtos);
		});
	}


	/**
	 * 同一ドキュメントか判定します.
	 * @param a 判定対象A
	 * @param b 判定対象B
	 */
	public equalsDocument(a: any, b: any): boolean {
		return (a.date === b.date && a.objId === b.objId && a.isDocumentLink === b.isDocumentLink);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 履歴
		columns.push({field: 'revision', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02037'), type: EIMDataGridColumnType.number, width: 60, suppressSorting: true, suppressFilter: true});
		// ファイル名
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02012'), width: 350,
			cellRendererFramework: EIMValueRendererComponent,
			cellRendererParams: {
				iconClassFunctions: [
					this.fileIconClassFunctionService.iconClassFunction.bind(this.fileIconClassFunctionService)
				],
				linkableFunction: (dto: EIMSimpleObjectDTO): boolean => { return true; },
				onClickLinkFunction: this.onClickFileLink.bind(this),
			}
		});

		// 改訂内容
		if (this.isDispReivisonDetail) {
			columns.push({fieldPath: ['attributeMap', '改訂内容', 'values'], headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02015'), width: 300, suppressFilter: true});
		}
		
		// 更新者
		columns.push({fieldPath: ['modificationUser', 'name'], headerName: this.translateService.instant('EIM.LABEL_02032'), width: 120});

		// 更新日時
		columns.push(this.dataGridComponentService.createAttributeColumn(
			this.translateService.instant('EIM.LABEL_02033'), 'DATE', ['modificationDate']));


		this.revisionHistoryDataGrid.setColumns(columns);
		this.revisionHistoryDataGrid.showAllSelectButton = false;

	
	}

	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChanges): void {
		this.show();
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
	

	}

	
	/**
	 * ファイルリンククリック時イベントハンドラです.
	 * @param dto DTO
	 */
	onClickFileLink(dto: EIMSimpleObjectDTO): void {
		// ファイルダウンロード
		const param = new EIMObjectAPIServiceDownloadFileParam();
		const prmDto = new EIMSimpleObjectDTO();
		prmDto.id = dto.id;
		param.dto = prmDto;

		this.objectAPIService.downloadFile(param);	
	}
}
