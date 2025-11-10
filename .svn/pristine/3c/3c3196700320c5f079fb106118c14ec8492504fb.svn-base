import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminsDirectoryService } from 'app/admins/shared/services/apis/admins-directory.service';
import { EIMDirectoryDTO } from 'app/admins/shared/dtos/directory.dto';


/**
 * フォーマットディレクトリ登録コンポーネント
 * @example
 *
 *      <eim-format-directory-creator
 *          [formatId]="formatId"
 *          [formatLabel]="formatLabel"
 *      >
 *      </eim-format-directory-creator>
 */
@Component({
    selector: 'eim-format-directory-creator',
    templateUrl: './format-directory-creator.component.html',
    styleUrls: ['./format-directory-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormatDirectoryCreatorComponent) }
    ],
    standalone: false
})

export class EIMFormatDirectoryCreatorComponent implements EIMCreatable {
	/** ディレクトリフォーム */
	@ViewChild('directoryCreatorForm', { static: true }) directoryCreatorForm: NgForm;

	/** 入力最大数 */
	public inputMaxLength = EIMConstantService.INPUT_MAX_LENGTH;

	/** ONLINEのラベル */
	public onlineLabel = EIMAdminsConstantService.DIR_STATUS_ONLINE_LABEL;

	/** OFFLINEのラベル */
	public offlineLabel = EIMAdminsConstantService.DIR_STATUS_OFFLINE_LABEL;

	/** ONLINEの値 */
	public onlineValue = EIMAdminsConstantService.DIR_STATUS_ONLINE_VALUE;

	/** OFFLINEの値 */
	public offlineValue = EIMAdminsConstantService.DIR_STATUS_OFFLINE_VALUE;

	/** ディレクトリ */
	public path: string;

	/** ステータス */
	public status = EIMAdminsConstantService.DIR_STATUS_ONLINE_VALUE;

	/** フォーマットID */
	@Input() public formatId: number;

	/** フォーマット名 */
	@Input() public formatLabel: string;

	/** 登録完了時のイベントエミッタ */
	@Output() public created: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 処理中かどうか */
	private processing = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminsDirectoryService: EIMAdminsDirectoryService,
		protected translateService: TranslateService,

	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ディレクトリを登録します.
	 */
	public create(): void {
		this.processing = true;

		// ディレクトリを登録します.
		this.adminsDirectoryService.create(this.formatId, this.path, this.status).subscribe(
			(result: string) => {
				this.created.emit([result]);
			},
			(err: any) => {
				// エラーの場合
				this.processing = false;
			}
		);
	}


	/**
	 * ディレクトリ登録可否を返却します.
	 * @return ディレクトリ登録可否
	 */
	public creatable(): boolean {
		return this.directoryCreatorForm.valid && !this.processing;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

}
