import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeTypeSortUpdatorComponent } from './attribute-type-sort-updator.component';

/**
 * 属性タイプ並べ替えコンポーネント
 * @example
 *
 *      <eim-attribute-type-sort-form-updator
 *          [selectedData]="selectedData"
 *          [objTypeId]="objTypeId"
 *      </eim-attribute-type-sort-form-updator>
 */
@Component({
    selector: 'eim-attribute-type-sort-form-updator',
    templateUrl: './attribute-type-sort-updator.component.html',
    styleUrls: ['./attribute-type-sort-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormAttributeTypeSortUpdatorComponent) }
    ],
    standalone: false
})

export class EIMFormAttributeTypeSortUpdatorComponent extends EIMAttributeTypeSortUpdatorComponent implements OnInit, EIMUpdatable {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeTypeService: EIMAttributeTypeService,
			protected translateService: TranslateService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
		super( attributeTypeService, translateService, adminDialogManagerComponentService );
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.updateFlag = false;
		if (!this.selectedData) {
			this.updateFlag = true;
		}
		let attributeTypeColumns: EIMDataGridColumn[] = [];

		// 定義名称
		attributeTypeColumns.push({field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02004'), width: 245, suppressSorting: true, suppressFilter: true});
		// 名前
		attributeTypeColumns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 232, suppressSorting: true, suppressFilter: true, cellRendererFramework: EIMAdminNameRendererComponent});
		this.attTypeDataGrid.setColumns(attributeTypeColumns);

		if (this.objTypeId) {
			// 属性タイプ一覧を取得する
			this.getAttTypeList(this.objTypeId);
		} else {
			// 親画面からの属性タイプデータを表示する
			this.attTypeDataGrid.setData(this.selectedData)
		}
	}
}
