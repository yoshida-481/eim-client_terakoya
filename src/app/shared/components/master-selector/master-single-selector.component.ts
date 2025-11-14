import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { of, Observable } from 'rxjs';


import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMMasterSingleSelectorComponentService } from 'app/shared/components/master-selector/master-single-selector.component.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';


import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMSearchMasterDisplayConfigDomain } from 'app/shared/domains/search-master-display-config.domain';

import { EIMObjectMasterDTO } from 'app/shared/dtos/object-master.dto';

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMDataGridSingleSelectorComponentService, EIMDataGridSingleSelectorComponentInfo } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component.service';

import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';

/**
 * マスタ単数選択コンポーネント
 */
@Component({
    selector: 'eim-master-single-selector',
    templateUrl: './master-single-selector.component.html',
    styleUrls: ['./master-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMMasterSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMMasterSingleSelectorComponent) }],
    standalone: false
})
export class EIMMasterSingleSelectorComponent extends EIMDataGridSingleSelectorComponent implements EIMSelectable, OnInit {

	/** 複数行選択可フラグ */
	@Input()
		public multiple = false;

	/** オブジェクトマスタ検索の画面定義情報 */
	@Input()
		public searchMasterDisplayConfig: EIMSearchMasterDisplayConfigDomain;


	/** マスタ選択画面用 */
	public condition: any = {
			objectTypeId: 0,
			limit: 0,
			invalidateAttribute: null,
			displayDialogAttributeTypeList: [],
			keyword: '',
	};

	/** 検索対象ラベル */
	public searchTargetLabel: string;

	/** 表示カラムリスト */
	public columns: any[] = [];

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,

		public masterSingleSelectorComponentService: EIMMasterSingleSelectorComponentService
	) {
		super(masterSingleSelectorComponentService, messageService);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラです.
	 */
	ngOnInit(): void {
		super.ngOnInit();
		// 検索条件生成
		this.condition.objectTypeId = this.searchMasterDisplayConfig.objectType.id;
		this.condition.limit = this.searchMasterDisplayConfig.limit;
		this.condition.invalidateAttribute = this.searchMasterDisplayConfig.invalidateAttribute;
		this.condition.displayDialogAttributeTypeList = this.searchMasterDisplayConfig.displayDialogAttributeTypeList;

		// 検索対象ラベル、一覧表示カラム設定
		let columns: any[] = [];
		for (let i = 0; i < this.searchMasterDisplayConfig.displayDialogAttributeTypeList.length; i++) {
			let displayDialogAttributeType: EIMAttributeTypeDomain = this.searchMasterDisplayConfig.displayDialogAttributeTypeList[i];

			if (displayDialogAttributeType.valueType !== 'STRING'
				&& displayDialogAttributeType.valueType !== 'DATE'
				&& displayDialogAttributeType.valueType !== 'LONG'
				&& displayDialogAttributeType.valueType !== 'DOUBLE'
				&& displayDialogAttributeType.valueType !== 'TEXT') {
				// 上記以外の型は対象外
				return;
			}

			// カラムヘッダ名
			let headerName: string;
			if (displayDialogAttributeType.definitionName === 'name') {
				// 擬似属性：オブジェクト名称のヘッダー名称未指定の場合
				headerName = this.translateService.instant('EIM.LABEL_02002');
				columns.push({
					field: 'name', headerName: headerName, width: 145, suppressFilter: true
				});

			} else {
				// 通常属性のヘッダー名称未指定の場合
				headerName = displayDialogAttributeType.name;
				columns.push({
					field: 'attributeMap.' + displayDialogAttributeType.id + '.valueList', headerName: headerName, width: 145, suppressFilter: true
				});				
			}

			// 検索対象ラベル
			if (displayDialogAttributeType.valueType === 'STRING') {
				if (this.searchTargetLabel) {
					this.searchTargetLabel += ', ' + headerName;
				} else {
					this.searchTargetLabel = headerName;
				}
			}

		}
		Array.prototype.push.apply(this.columns, columns);
		this.setColumns();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * DTOをDomainに変換して変換します.
	 * @params dto DTO
	 * @return Domain
	 */
	protected convertDtoToDomain(dto: EIMObjectMasterDTO): EIMObjectDomain {

		let object = new EIMObjectDomain();
		object.id = dto.id;
		object.name = dto.name;
		object.type = new EIMObjectTypeDomain(); // これがないとサーバサイドでエラーとなる

		object.attributeList = [];
		for (let key in dto.attributeMap) {
			if (dto.attributeMap.hasOwnProperty(key)) {
				object.attributeList.push(dto.attributeMap[key]);
			}
		}
		return object;
	}

}
