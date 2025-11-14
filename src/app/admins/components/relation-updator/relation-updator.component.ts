import {Component, forwardRef, ViewChild, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NgForm} from '@angular/forms';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMRelationService } from 'app/admins/shared/services/apis/relation.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService, dialogName } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';


/**
 * リレーション更新コンポーネント
 * @example
 *
 *      <eim-relation-updator
 *          [relationId]="relationId">
 *      </eim-relation-updator>
 */
@Component({
    selector: 'eim-relation-updator',
    templateUrl: './relation-updator.component.html',
    styleUrls: ['./relation-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMRelationUpdatorComponent) }
    ],
    standalone: false
})

export class EIMRelationUpdatorComponent implements OnInit, EIMUpdatable {

	/** 属性フォーム */
	@ViewChild('relationUpdatorForm', { static: true }) relationUpdatorForm: NgForm;

	/** リレーションID */
	@Input() relationTypeId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 相互 */
	public mutual: number;

	/** リビジョンアップ */
	public revup: number;

	/** 登録した言語リスト */
	public nameList: {[key: string]: string; } = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected relationService: EIMRelationService,
			protected localStorageService: EIMLocalStorageService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーションを更新します.
	 */
	public update(): void {
		// リレーションを更新します．
		this.relationService.update(this.nameList, this.relationTypeId, this.revup).subscribe(
			(data: any) => {
				this.adminDialogManagerComponentService.close(dialogName.RELATION_UPDATOR);
				this.updated.emit(data);
			},
			(err: any) => {
				return;
			}
		);
	}

	/**
	 * フォーマット更新可否を返却します.
	 * @return フォーマット更新可否
	 */
	public updatable(): boolean {
		return this.relationUpdatorForm.dirty && this.relationUpdatorForm.valid
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		for (let idx = 0; idx < this.languages.length; idx++) {
			this.nameList[this.languages[idx].lang] = '';
		}

		this.relationService.get(this.relationTypeId).subscribe(
			(data: any) => {
				for (let idx = 0; idx < data.lang.length; idx++) {
					this.nameList[data.lang[idx].attr.otherLId] = data.lang[idx].attr.otherName;
				}
				this.revup = data.attr.revisionUp;
				this.mutual = data.attr.mutual;
			},
			(err: any) => {
				this.adminDialogManagerComponentService.close(dialogName.RELATION_UPDATOR);
			}
		);
	}
}
