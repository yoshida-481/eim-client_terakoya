import { Type } from '@angular/core';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';

import { FileUploader, FileItem } from 'ng2-file-upload';

import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMTempFileObjectService } from 'app/shared/services/apis/temp-file-object.service';
import { EIMTemplateFileService } from 'app/shared/services/apis/template-file.service';

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMFileObjectCreatorDomain } from 'app/shared/domains/file-object-creator.domain';
import { EIMTemplateFileDTO } from 'app/shared/dtos/template-file.dto';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMInputFormItemComponentDomain, EIMInputFormItemComponentService } from 'app/shared/components/input-form-item/input-form-item.component.service';
import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMTaskOutputFileInputFormItemComponent } from './task-output-file-input-form-item.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMTaskFileObjectCreatorService } from 'app/tasks/services/apis/task-file-object-creator.service';

export interface EIMTaskOutputFileInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
	templateFileAttributeValues: EIMSimpleObjectDTO[];
	parentObjectId: number;
};


/**
 * タスク成果物ファイル入力フォームコンポーネントサービス
 * @see {@link EIMInputFormItemComponentService}
 */
@Injectable()
export class EIMTaskOutputFileInputFormItemComponentService extends EIMInputFormItemComponentService {

	public tempObjectIdSet: any = {};

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected fileService: EIMFileService,
		protected fileObjectCreatorService: EIMTaskFileObjectCreatorService,
		protected tempFileObjectService: EIMTempFileObjectService,
		protected templateFileService: EIMTemplateFileService,
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * オブジェクトを作成します.
	 * @param tempFilePath 割り当てるファイルのパス
	 * @param fileName 割り当てるファイル名
	 */
	public create(tempFilePath: string, fileName: string): Observable<any> {
		// 作成対象の実ファイルに紐づくオブジェクト作成
		let object: EIMObjectDomain = new EIMObjectDomain({
			type: { definitionName: EIMConstantService.OBJECT_TYPE_NAME_TEMP_FILE },
			name: fileName
		});

		//添付ファイル名を抽出
		var tempFileName: string = tempFilePath.substring(tempFilePath.lastIndexOf("temp"));

		return this.tempFileObjectService.create({ tempFilePath: tempFileName, object: object, duplicateCheckMode: { value: 0 } })
		.pipe(mergeMap((res: any) => {
			this.tempObjectIdSet[res.id] = true;
			return of(res);
		}));
	}

	/**
	 * オブジェクト、ファイルを削除します.
	 * @param removeFileNames 削除するファイル名の配列
	 */
	public delete(id: number): void {
		// 一時ファイルの場合は削除する。
		let foc: EIMFileObjectCreatorDomain = new EIMFileObjectCreatorDomain();
		foc.id = id;
		this.fileObjectCreatorService.delete(foc)
			.subscribe(
				() => {
					// 一時ファイル削除完了
					delete this.tempObjectIdSet[id];
				}
			);
	}

	/**
	 * オブジェクトをコピーします.
	 * @param foc オブジェクト
	 */
	public copy(foc: EIMFileObjectCreatorDomain): Observable<EIMFileObjectCreatorDomain[]> {
		return this.fileObjectCreatorService.copy(foc)
		.pipe(mergeMap((objects: EIMFileObjectCreatorDomain[]) => {
				this.tempObjectIdSet[objects[1].id] = true;
				return of(objects);
		}));
	}

	/**
	 * ファイルをアップロードします.
	 * @param uploader アップローダ
	 * @param fileItem ファイル
	 */
	public uploadFile(uploader: FileUploader, fileItem: FileItem): Observable<any> {
		return this.fileService.upload(uploader, fileItem)
		.pipe(mergeMap((data: any) => {
			return of(data);
		}));
	}

	/**
	 * テンプレートファイルの一覧を取得します.
	 */
	public getTemplateFileList(): Observable<EIMTemplateFileDTO[]> {
		return this.templateFileService.getList()
		.pipe(mergeMap((dtos: EIMTemplateFileDTO[]) => {
			return of(dtos);
		}));
	}

	/**
	 * 一時保存状態保持変数をクリアします.
	 */
	public clear(): void {
		this.tempObjectIdSet = {};
	}

	/**
	 * 一時保存のオブジェクト、ファイルを削除します.
	 */
	public deleteTemplate(): void {
		let keys = Object.keys(this.tempObjectIdSet);
		for (let i = 0; i < keys.length; i++) {
			if (this.tempObjectIdSet[keys[i]]) {
				this.delete(Number(keys[i]));
			}
		}
		this.clear();
	}

	/**
	 * 対応するコンポーネントを返却します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @returns 対応するコンポーネント
	 */
	public override getComponent(): Type<EIMInputFormItemComponent> {
		return EIMTaskOutputFileInputFormItemComponent;
	};

	/**
	 * 対応するコンポーネントが表示対象かどうか返却します.<br>
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItem 入力フォーム情報
	 * @returns 対応するコンポーネントが表示対象の場合trueを返却
	 */
	public override visibleFunction(inputFormItem: EIMInputFormItemDomain): boolean {

		// 成果物
		if (inputFormItem.definitionName === EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT) {
			return true;
		}
		return false;
	};

	/**
	 * 対応するコンポーネントを初期化します.<br>
	 * 動的にコンポーネントを追加する際に使用します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItemComponent 対応するコンポーネント
	 * @param inputFormItem 入力フォーム情報
	 */
	public override initializeComponent(inputFormItemComponent: EIMTaskOutputFileInputFormItemComponent, inputFormItem: EIMInputFormItemDomain): void {
		super.initializeComponent(inputFormItemComponent, inputFormItem);

		inputFormItemComponent.templateFileAttributeValues = inputFormItem['templateFileAttributeValues'];
		inputFormItemComponent.parentObjectId = inputFormItem['parentObjectId'];

	}

	/**
	 * フォームに設定する入力フォームアイテム情報を生成します.<br>
	 * フォームに個別に入力フォームを追加する場合に使用します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @param inputFormItemComponent コンポーネント初期化パラメータ
	 * @returns 入力フォームアイテム情報
	 */
	public override createInputFormDomain(inputFormItemComponent: EIMTaskOutputFileInputFormItemComponentDomain): EIMInputFormItemDomain {
		let inputFormItem = super.createInputFormDomain(inputFormItemComponent);

		inputFormItem.uiControlId = 'uIControlFile';

		inputFormItem['templateFileAttributeValues'] = inputFormItemComponent.templateFileAttributeValues;
		inputFormItem['parentObjectId'] = inputFormItemComponent.parentObjectId;
		
		return inputFormItem;
	};
}
