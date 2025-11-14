import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminsDirectoryService } from 'app/admins/shared/services/apis/admins-directory.service';
import { EIMDirectoryDTO } from 'app/admins/shared/dtos/directory.dto';


/**
 * フォーマットディレクトリ更新コンポーネント
 * @example
 *
 *      <eim-format-directory-updator
 *          [formatId]="formatId">
 *          [dirId]="dirId">
 *      >
 *      </eim-format-directory-updator>
 */
@Component({
    selector: 'eim-format-directory-updator',
    templateUrl: './format-directory-updator.component.html',
    styleUrls: ['./format-directory-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormatDirectoryUpdatorComponent) }
    ],
    standalone: false
})

export class EIMFormatDirectoryUpdatorComponent implements OnInit, EIMUpdatable {
	/** ディレクトリフォーム */
	@ViewChild('directoryUpdatorForm', { static: true }) directoryUpdatorForm: NgForm;

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

	/** ディレクトリ名 */
	public path: string;

	/** ステータス */
	public status: number;

	/** フォーマットID */
	@Input() public formatId: number;

	/** ディレクトリID */
	@Input() public dirId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() public updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

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
	 * ディレクトリを更新します.
	 */
	public update(): void {
		this.processing = true;

		// ディレクトリを更新します.
		this.adminsDirectoryService.update(this.formatId, this.dirId, this.path, this.status).subscribe(
			(data: any) => {
				this.updated.emit(data);
			},
			(err: any) => {
				// エラーの場合
				this.processing = false;
			}
		);
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ディレクトリ更新可否を返却します.
	 * @return ディレクトリ更新可否
	 */
	public updatable(): boolean {
		return this.directoryUpdatorForm.valid && this.directoryUpdatorForm.dirty && !this.processing;
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// ディレクトリ情報を取得します.
		this.adminsDirectoryService.get(this.dirId).subscribe(
			directory => {
				// ディレクトリ名
				this.path = directory.path;
				// ステータス
				this.status = directory.status;

			}, (err: any) => {
				// エラーの場合、画面を閉じる
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);
	}
}
