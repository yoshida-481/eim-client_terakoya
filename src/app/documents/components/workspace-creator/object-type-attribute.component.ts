import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectTypeService } from 'app/documents/shared/services/apis/object-type.service';
import { EIMValueTypeRendererComponent } from 'app/shared/components/renderer/value-type-renderer.component';
import { EIMAttributeTypeNameRendererComponent } from 'app/documents/shared/components/renderer/attribute-type-name-renderer.component';

/**
 * オブジェクトタイプ属性コンポーネント
 * @example
 *
 *      <eim-object-type-attribute>
 *      </eim-object-type-attribute>
 */
@Component({
    selector: 'eim-object-type-attribute',
    templateUrl: './object-type-attribute.component.html',
    styleUrls: ['./object-type-attribute.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMObjectTypeAttributeComponent) }
    ],
    standalone: false
})
export class EIMObjectTypeAttributeComponent implements OnInit {

	/** オブジェクトタイプ属性データグリッド */
	@ViewChild('objectTypeAttributeList', { static: true })
	objectTypeAttributeList: EIMDataGridComponent;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 対象オブジェクトタイプID */
	private targetObjTypeId = 0;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected objectTypeService: EIMObjectTypeService,
			protected translateService: TranslateService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 * @param objTypeId オブジェクトタイプID
	 */
	public show(objTypeId: number): void {
		this.targetObjTypeId = objTypeId;
		this.objectTypeService.getListByObjectTypeId(objTypeId)
		.subscribe((object: any) => {
			if (objTypeId === this.targetObjTypeId) {
				this.objectTypeAttributeList.setData(object);
			}
		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
				this.objectTypeAttributeList.setData([]);
				this.errored.emit();
			});
		});
	}

	/**
	 * オブジェクトタイプ属性データグリッドを初期化します.
	 */
	public clear(): void {
		this.targetObjTypeId = 0;
		this.objectTypeAttributeList.setData([]);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 属性名称、必須属性
		columns.push({field: 'attTypeName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 335,
			cellRendererFramework: EIMAttributeTypeNameRendererComponent});
		// 属性データ型
		columns.push({field: 'valTypeName', headerName: this.translateService.instant('EIM.LABEL_02023'), width: 120});
		// 入力規則
		columns.push({field: 'inputRuleValue', headerName: this.translateService.instant('EIM.LABEL_02040'), width: 120});
		// 複数値
		columns.push({field: 'isMultipleValue', headerName: this.translateService.instant('EIM.LABEL_02039'), width: 120});

		this.objectTypeAttributeList.setColumns(columns);
		this.objectTypeAttributeList.showAllSelectButton = false;

	}


}
