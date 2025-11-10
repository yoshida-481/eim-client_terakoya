import {Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {EIMComponent, EIMCreatable} from 'app/shared/shared.interface';
import {EIMConstantService} from 'app/shared/services/constant.service';
import {EIMRelationService} from 'app/admins/shared/services/apis/relation.service';
import {EIMLocalStorageService} from 'app/shared/services/apis/local-storage.service';
import {EIMAdminDialogManagerComponentService, dialogName} from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';


/**
 * リレーション登録コンポーネント
 * @example
 *
 *      <eim-relation-creator
 *      </eim-relation-creator>
 */
@Component({
    selector: 'eim-relation-creator',
    templateUrl: './relation-creator.component.html',
    styleUrls: ['./relation-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMRelationCreatorComponent) }
    ],
    standalone: false
})

export class EIMRelationCreatorComponent implements OnInit, EIMCreatable {

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
	public nameList: {[key: string]: string; } = {};

	/** リビジョンアップ */
	public revup= 1;

	/** 相互 */
	public mutual= 0;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<any[]> = new EventEmitter<any[]>();


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
	 * リレーションを登録します.
	 */
	public create(): void {
		// リレーションを登録します．
		this.relationService.create(this.nameList, this.mutual, this.revup).subscribe(
			(data: any) => {
				this.created.emit(data);
			});
	}

	/**
	 * リレーション登録可否を返却します.
	 * @return リレーション登録可否
	 */
	public creatable(): boolean {
		for (let idx = 0; idx < this.languages.length; idx++) {
			if (!this.nameList[this.languages[idx].lang]) {
				return false;
			}
		}
		return true;
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
	}
}
