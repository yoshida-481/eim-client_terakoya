import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAttributeTypeNameRendererComponent } from 'app/admins/shared/components/renderer/attribute-type-name-renderer.component';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAttributeTypeSortUpdatorComponent } from './attribute-type-sort-updator.component';

/**
 * 属性タイプ並べ替えコンポーネント
 * @example
 *
 *      <eim-attribute-type-sort-doc-updator
 *          [selectedData]="selectedData"
 *          [objTypeId]="objTypeId"
 *      </eim-attribute-type-sort-doc-updator>
 */
@Component({
    selector: 'eim-attribute-type-sort-doc-updator',
    templateUrl: './attribute-type-sort-updator.component.html',
    styleUrls: ['./attribute-type-sort-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentAttributeTypeSortUpdatorComponent) }
    ],
    standalone: false
})

export class EIMDocumentAttributeTypeSortUpdatorComponent extends EIMAttributeTypeSortUpdatorComponent implements OnInit, EIMUpdatable {

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
		// 名前
		attributeTypeColumns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 478, suppressSorting: true, suppressFilter: true, cellRendererFramework: EIMAttributeTypeNameRendererComponent});

		this.attTypeDataGrid.setColumns(attributeTypeColumns);
		this.getAttTypeList(this.objTypeId);
	}
}
