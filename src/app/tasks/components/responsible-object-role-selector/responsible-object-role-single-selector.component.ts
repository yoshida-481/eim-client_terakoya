import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';


import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMResponsibleObjectRoleSingleSelectorComponentService } from './responsible-object-role-single-selector.component.service';
import { EIMObjectRoleDomain } from 'app/shared/domains/entity/object-role.domain';
import { EIMObjectRoleService } from 'app/shared/services/apis/object-role.service';

/**
 * 担当単数選択コンポーネント
 */
@Component({
	selector: 'eim-responsible-object-role-single-selector',
	templateUrl: './responsible-object-role-single-selector.component.html',
	styleUrls: ['./responsible-object-role-single-selector.component.css'],
	providers: [{provide: EIMComponent, useExisting: forwardRef(() => EIMResponsibleObjectRoleSingleSelectorComponent)},
	            {provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMResponsibleObjectRoleSingleSelectorComponent)}],
	standalone: false
})
export class EIMResponsibleObjectRoleSingleSelectorComponent extends EIMDataGridSingleSelectorComponent implements EIMSelectable, OnInit {

	/** 複数行選択可フラグ */
	@Input()
		public multiple = false;

	/** マスタ選択画面用 */
	public condition: any = {
			// objectTypeId: 0,
			limit: 0,
			invalidateAttribute: null,
			// displayDialogAttributeTypeList: [],
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

		public taskTemplateDocumentSingleSelectorComponentService: EIMResponsibleObjectRoleSingleSelectorComponentService,
		protected objectRoleService: EIMObjectRoleService
	) {
		super(taskTemplateDocumentSingleSelectorComponentService, messageService);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択します.
	 */
	public override select(): void {
		this.selected.emit(this.template.searchResultList.getSelectedData());
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラです.
	 */
	ngOnInit(): void {

		super.ngOnInit();

		// 検索対象ラベル、一覧表示カラム設定
		let columns: any[] = [];
		columns.push({
			field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 350, suppressFilter: true
		});
		this.columns = columns;

		// 検索対象ラベル
		this.searchTargetLabel = this.translateService.instant('EIM.LABEL_02002');

		this.setColumns();

		// マスタ情報取得
		this.objectRoleService.getList(null).subscribe((res: any) => {
			const objectRoles: EIMObjectRoleDomain[] = res;
			this.info.dataGrid.setData(objectRoles);

			this.info.data = objectRoles;
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * DTOをDomainに変換して変換します.
	 * @params dto DTO
	 * @return Domain
	 */
	protected convertDtoToDomain(dto: EIMObjectRoleDomain): EIMObjectRoleDomain {

		return dto;
	}

}
