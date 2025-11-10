import { Component, ViewChild, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMSecurity } from 'app/object-editors/shared/services/apis/object-editors-security.service';
import { EIMSecurityDomain } from 'app/shared/domains/entity/security.domain';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { NgForm } from '@angular/forms';
import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';

/**
 * オブジェクト更新コンポーネント
 * @example
 *
 *      <eim-object-updator
 *        [objectId]="objectId">
 *      </eim-object-updator>
 */
@Component({
    selector: 'eim-object-updator',
    templateUrl: './object-updator.component.html',
    styleUrls: ['./object-updator.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMObjectUpdatorComponent) }],
    standalone: false
})
export class EIMObjectUpdatorComponent implements OnInit, EIMComponent, EIMUpdatable {

	/** フォーム */
	@ViewChild('objectUpdator', { static: true }) objectUpdator: NgForm;

	/** オブジェクトID */
	@Input() objectId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<EIMObjectDomain> = new EventEmitter<EIMObjectDomain>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** EIMComponent共通プロパティ */
	public disabled = false;

	/** オブジェクト */
	public object: EIMObjectDomain;

	/** 上部スプリットの初期比率 */
	public splitAreaFirstSize = 50;

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected objectEditorsObjectService: EIMObjectEditorsObjectService,
		protected messageService: EIMMessageService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 更新を実行します.
	 */
	public update(): void {
		this.objectEditorsObjectService.update(this.object).subscribe(
			(object: EIMObjectDomain) => {
				this.messageService.showGrowl(this.translateService.instant('EIM_OBJECT_EDITORS.INFO_00005', {value: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_01002')}));
				this.updated.emit(object);
			},
		);
	}

	/**
	 * 更新可否を返却します.
	 * @return 更新可否
	 */
	public updatable(): boolean {
		return this.objectUpdator.dirty && this.objectUpdator.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.objectEditorsObjectService.getObject(this.objectId).subscribe(
			(object: EIMObjectDomain) => {
				this.objectEditorsObjectService.getAttribute(this.objectId).subscribe(
					(attributeList: EIMAttributeDomain[]) => {
						this.object = object;
						this.object['attributeList'] = attributeList;
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

	/**
	 * セキュリティ削除ボタンクリックイベントハンドラです.
	 */
	onClickSecurityDelete(): void {
		this.object.security.id = 0;
		this.object.security.name = '';
		this.objectUpdator.control.markAsDirty();
	}

	/**
	 * セキュリティ選択ボタンクリックイベントハンドラです.
	 */
	onClickSecuritySelect(): void {
		let dialogId = this.dialogManagerComponentService.showObjectEditorsSecuritySelector(this.object.security.id, {
			selected: (security: EIMSecurity[]) => {
				this.dialogManagerComponentService.close(dialogId);
				this.object.security = new EIMSecurityDomain();
				this.object.security.id = security[0].secId;
				this.object.security.name = security[0].secName;
				this.objectUpdator.control.markAsDirty();
			}
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
