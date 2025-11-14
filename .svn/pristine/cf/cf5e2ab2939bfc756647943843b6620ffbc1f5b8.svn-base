import { Component, ViewChild, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { EIMComponent } from 'app/shared/shared.interface';
import { EIMUpdatable } from 'app/shared/shared.interface';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { NgForm } from '@angular/forms';
import { EIMMessageService } from 'app/shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectEditorsRelationService } from 'app/object-editors/shared/services/apis/object-editors-relation.service';
import { EIMRelationDomain } from 'app/shared/domains/entity/relation.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';

/**
 * リレーション属性更新コンポーネント
 * @example
 *
 *      <eim-relation-updator
 *        [relId]="relId">
 *      </eim-relation-updator>
 */
@Component({
    selector: 'eim-relation-updator',
    templateUrl: './relation-updator.component.html',
    styleUrls: ['./relation-updator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMRelationUpdatorComponent) }],
    standalone: false
})
export class EIMRelationUpdatorComponent implements OnInit, EIMUpdatable {

	/** フォーム */
	@ViewChild('relationUpdatorForm', { static: true }) relationUpdatorForm: NgForm;

	/** リレーションID */
	@Input() relId: number;

	/** 親オブジェクトID */
	@Input() parentObjId: number;

	/** 子オブジェクトID */
	@Input() childObjId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<null> = new EventEmitter<null>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 上部スプリットの初期比率 */
	public splitAreaFirstSize = 44;

	/** リレーション情報ドメイン*/
	public relation: EIMRelationDomain;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected objectEditorsRelationService: EIMObjectEditorsRelationService,
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 更新を実行します.
	 */
	public update(): void {
		this.objectEditorsRelationService.update(this.relation).subscribe(
			(res: any) => {
				// 完了メッセージ表示
				this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00005', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_01007')}));
				this.updated.emit();
			},
		);
	}

	/**
	 * 更新可否を返却します.
	 * @return 更新可否
	 */
	public updatable(): boolean {
		return this.relationUpdatorForm.dirty && this.relationUpdatorForm.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.objectEditorsRelationService.getRelation(this.relId).subscribe(
			(relation: EIMRelationDomain) => {
				this.objectEditorsRelationService.getAttribute(this.relId).subscribe(
					(attributeList: EIMAttributeDomain[]) => {
						this.relation = relation;
						this.relation['attributeList'] = attributeList;
					},
					(err: any) => {
						this.errored.emit();
					}
				)
			},
			(err: any) => {
				this.errored.emit();
			}
		);
	}
	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
