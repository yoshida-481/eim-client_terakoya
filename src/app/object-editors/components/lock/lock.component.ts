import { Component, OnInit, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { EIMComponent, EIMExecutable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectEditorsCacheService } from 'app/object-editors/shared/services/object-editors-cache.service';
import { EIMObjectEditorsRevisionService } from 'app/object-editors/shared/services/apis/object-editors-revision.service';
import { EIMDialogSharedManagerComponentService } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * イベント履歴コンポーネント
 * @example
 * 		<eim-lock [objData]="objData">
 * 		</eim-lock>
 */
@Component({
    selector: 'eim-lock',
    templateUrl: './lock.component.html',
    styleUrls: ['./lock.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMLockComponent) }],
    standalone: false
})
export class EIMLockComponent implements OnInit , EIMExecutable {

	/** 選択オブジェクト情報 */
	@Input() objData: EIMObjectDTO;

	/** 登録完了時のイベントエミッタ */
	@Output() executed: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** ロックユーザ */
	public user: EIMUserDomain = this.objectEditorsCacheService.getLoginUser();

	/** 表示メッセージ*/
	public confirmMessage = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,
		protected objectEditorsCacheService: EIMObjectEditorsCacheService,
		protected objectEditorsRevisionService: EIMObjectEditorsRevisionService,
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * ロック処理を実行します.
	 */
	public execute(): void {
		this.objectEditorsRevisionService.lock(this.user.id, this.objData.id).subscribe((data: any) => {
			this.executed.emit();
		}, (err: any) => {
			this.errored.emit(err);
		});
	}

	/**
	 * 実行可否を返却します.
	 * @return 実行可否
	 */
	public executable(): boolean {
		let result = false;
		if (this.user.name) {
			// ユーザ名がある場合
			result = true;
		} else {
			// ユーザ名がない場合
			result = false;
		}
		return result;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// オブジェクト名のサイズを調整
		let objName = this.adjustObjectName(this.objData.name);
		this.confirmMessage = this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02021', {value: objName});
	}

	/**
	 * 選択ボタン押下時イベントハンドラです.
	 */
	onClickUserSelector(): void {
		// ユーザ選択画面を表示する
		let dialogId: string = this.dialogManagerComponentService.showUserSelector({
			selected: (data) => {
				this.dialogManagerComponentService.close(dialogId);
				this.user = data[0];
			},
			errored: () => {
				this.dialogManagerComponentService.close(dialogId);
			}
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * オブジェクト名の長さを調整します.
	 * 40バイト以上の場合は途中で切り出し3点リーダーをつける
	 * @param objectName 対象オブジェクト名
	 * @return 調整後オブジェクト名
	 */
	private adjustObjectName(objectName: string): string {
		let byte = 0;
		for (let i = 0; i < objectName.length; i++) {
			if (objectName.charCodeAt(i) < 256) {
				byte += 1;
			} else {
				byte += 2;
			}
			if (byte >= 40) {
				objectName = objectName.slice(0, i + 1);
				objectName = objectName + EIMConstantService.THREE_DOT_LEADER;
				break;
			}
		}
		return objectName;
	}
}
