import {
  Component,
  forwardRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnDestroy,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { SelectItem } from "primeng/api";
import {
  EIMComponent,
  EIMCreatable,
  EIMListComponent,
  EIMMenuItem,
} from "app/shared/shared.interface";
import {
  EIMDataGridColumn,
  EIMDataGridComponent,
  EIMDataGridColumnType,
} from "app/shared/components/data-grid/data-grid.component";
import { EIMDocumentsConstantService } from "app/documents/shared/services/documents-constant.service";
import {
  EIMMessageType,
  EIMMessageService,
} from "app/shared/services/message.service";
import { EIMHierarchicalObjectTypeDomain } from "app/documents/shared/domains/hierarchical-object-type.domain";
import { EIMObjectTypeDomain } from "app/shared/domains/entity/object-type.domain";
import { EIMDiagramComponent } from "app/shared/components/diagram/diagram.component";
import {
  EIMDialogManagerComponentService,
  dialogName,
} from "app/documents/shared/components/dialog-manager/dialog-manager.component.service";
import { EIMObjectNameRendererComponent } from "app/documents/shared/components/renderer/object-name-renderer.component";
import { EIMObjectNameRendererComponentService } from "app/documents/shared/components/renderer/object-name-renderer.component.service";
import { EIMProcessingResultRendererComponent } from "app/documents/shared/components/renderer/processing-result-renderer.component";
import {
  FileSelectDirective,
  FileDropDirective,
  FileUploader,
  FileUploaderOptions,
  FileItem,
} from "ng2-file-upload";
import { EIMLumpDocumentsCheckinRendererComponent } from "app/documents/shared/components/renderer/lump-documents-checkin-renderer.component";
import { EIMDocumentFormService } from "app/documents/shared/services/apis/document-form.service";
import { EIMPlaceRendererComponent } from "app/documents/shared/components/renderer/place-renderer.component";
import { EIMLumpDocumentsCheckinRendererComponentService } from "app/documents/shared/components/renderer/lump-documents-checkin-renderer.component.service";
import { EIMUserDomain } from "app/shared/domains/entity/user.domain";
import { EIMObjectTypeService } from "app/documents/shared/services/apis/object-type.service";
import { EIMDocumentsCacheService } from "app/documents/shared/services/documents-cache.service";
import { EIMDocumentsCheckinRendererComponent } from "app/documents/shared/components/renderer/documents-checkin-renderer.component";
import { EIMDateService } from "app/shared/services/date.service";
import { EIMBoxFileService } from "app/shared/services/apis/box-file.service";
import { EIMBoxContentsListComponentService } from "../box-contents-list/box-contents-list.component.service";
import * as fs from "fs";
import * as path from "path";
import {
  EIMDocumentMainComponentInfo,
  EIMDocumentMainComponentService,
} from "../document-main/document-main.component.service";
import { EIMDocumentsCheckinRendererComponentService } from "app/documents/shared/components/renderer/documents-checkin-renderer.component.service";
import { EIMDocumentCreatorComponent } from "./document-creator.component";

/** 画面状態定数 */
export namespace stateConst {
  export const EDITING = "editing";
  export const CREATING = "creating";
  export const COMPLETE = "complete";
}

namespace uploadStatusNumber {
  export const CAN_UPLOAD = 0;
  export const CANNOT_UPLOAD = 1;
  export const NOT_CHECKED = 2;
  export const DISABLED_CHECKED = 3;
  export const CHECKED = 5;
}

/**
 * ドキュメント登録確認コンポーネント
 * @example
 *      <eim-document-creator-confirmation
 *          [objId]="objId"
 *          [content]="content"
 *          [createUserId]="createUserId">
 *          [workspaceObjId]="workspaceObjId"
 *          [parentObjId]=parentObjId"
 *          [documentTypeId]="documentTypeId"
 *          [path]="path"
 *          [addFileList]="addFileList"
 *      </eim-document-creator-confirmation>
 */
@Component({
  selector: "eim-document-creator-confirmation",
  templateUrl: "./document-creator-confirmation.component.html",
  styleUrls: ["./document-creator.component.css"],
  providers: [
    {
      provide: EIMComponent,
      useExisting: forwardRef(() => EIMDocumentCreatorConfirmationComponent),
    },
  ],
  standalone: false
})
export class EIMDocumentCreatorConfirmationComponent
  implements OnInit, OnDestroy, EIMCreatable
{
  /** フォーム */
  @ViewChild("documentForm", { static: true }) documentForm: NgForm;
  /** ドキュメントリスト */
  @ViewChild("documentList", { static: true })
  documentList: EIMDataGridComponent;

  /** objId（登録時の電文用） */
  @Input() objId: number;

  /** 確認電文 */
  @Input() content: any[];

  /** 作成者 */
  @Input() createUserId = "";

  /** ドキュメントタイプID */
  @Input() documentTypeId: number;

  /** 登録完了時のイベントエミッタ */
  @Output() created: EventEmitter<any> = new EventEmitter<any>();

  /** エラー発生時のイベントエミッタ */
  @Output() errored: EventEmitter<null> = new EventEmitter<null>();

  /** 画面を閉じるのイベントエミッタ */
  @Output() closed: EventEmitter<null> = new EventEmitter<null>();

  /** タイプ一覧表示データ */
  public typeSelectItems: SelectItem[] = [];

  /** 実行中かどうか */
  public creating = false;

  /** すべて選択フラグ */
  public allCheckFlg = false;

  /** チェックボックスレンダラのエミッタ */
  private changed: any;

  /** アップローダ */
  public uploader: FileUploader = new FileUploader({url:""});

  /** ワークフローダイアグラム */
  @ViewChild("workflowDiagram", { static: true })
  workflowDiagram: EIMDiagramComponent;

  /** ワークスペースオブジェクトID */
  @Input()
  workspaceObjId: number;

  /** 親オブジェクトID */
  @Input()
  parentObjId: number;

  /** パス */
  @Input() path: string;

  /** 追加ファイル（一覧画面にてドラッグした場合に指定） */
  @Input() addFileList: any[];

  /** フォームグループ */
  public form: FormGroup;

  /** 選択したタイプID */
  public selectedDocumentTypeId: number;

  /** 前回選択したタイプID */
  public preSelectedTypeId: number;

  /** 名前 */
  public name: string = null;

  /** 作成者 */
  public createUser: EIMUserDomain;

  /** 状態 */
  public STATE = stateConst;
  public state = stateConst.EDITING;

  /** ドキュメントタイプ選択フラグ */
  public documetTypeFlg = false;

  /** ドキュメント登録可能フラグ */
  public documentCheckFlg = false;

  /**
   * コンストラクタです.
   */
  constructor(
    protected translateService: TranslateService,
    protected dialogManagerComponentService: EIMDialogManagerComponentService,
    protected documentsCheckinRendererComponentService: EIMDocumentsCheckinRendererComponentService,
    protected objectTypeService: EIMObjectTypeService,
    protected documentsCacheService: EIMDocumentsCacheService,
    protected boxFileService: EIMBoxFileService,
    protected boxContentsListComponentService: EIMBoxContentsListComponentService
  ) {
    //ログインユーザ取得
    this.createUser = this.documentsCacheService.getLoginUser();

    //チェックインフラグ変更イベントハンドラ
    this.changed = documentsCheckinRendererComponentService.changed.subscribe(
      (data: any) => {
        this.changedCheck(data);
      }
    );
  }

  // ----------------------------------------
  // 公開メソッド
  // ----------------------------------------
  /**
   * Boxからのドキュメントを登録します.
   */
  public create(): void {
    let confirmedDocumentList: any[] = this.documentList.getData();

    // 登録不可 or チェックインしないファイル抽出
    const unregistrableData = confirmedDocumentList
      .filter(
        (item) =>
          item.uploadStatus === uploadStatusNumber.CANNOT_UPLOAD ||
          item.uploadStatus === uploadStatusNumber.NOT_CHECKED
      )
      .map((item) => item.objName);

    // 登録可能ドキュメントのみドキュメント登録画面に渡す
    const confirmedAddFileList = this.addFileList
      .filter((file) => !unregistrableData.includes(file.name)) //unregistrableData(登録しないデータ)に含まれるものを除外
      .map((file) => {
        const matchingDocument = confirmedDocumentList.find(
          (doc) => doc.objName === file.name
        );
        if (matchingDocument) {
          //ドキュメント登録画面に渡すデータに、アップロードステータスと同名オブジェクトIDを追加
          return {
            ...file,
            uploadStatus: matchingDocument.uploadStatus,
            sameNameObj: matchingDocument.sameNameObj,
          };
        }
        return file; // 見つからなければそのまま返す
      });

    //ドキュメント登録画面を表示
    let dialogId: any = this.dialogManagerComponentService.showDcoumentCreator(
      this.workspaceObjId,
      this.parentObjId,
      confirmedAddFileList,
      this.path,
      this.selectedDocumentTypeId,
      {
        created: (data: any[]) => {
          this.created.emit(data);
        },
        errored: () => {
          this.dialogManagerComponentService.close(dialogId);
        },
      }
    );

    // キューに格納されているファイルアイテム数分処理を繰り返す
    for (let i = 1; i < this.uploader.queue.length; ) {
      // ファイルアイテム数が2件以上の場合
      if (i < this.uploader.queue.length) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    }
  }

  /**
   * 登録可否を返却します.
   * @return フォルダ登録可否
   */
  public creatable(): boolean {
    return this.documetTypeFlg && this.documentCheckFlg;
  }

  /**
   * 閉じるボタン押下時の処理を実施します.
   */
  public close(): void {
    // 閉じる
    this.closed.emit();
    this.dialogManagerComponentService.close(
      dialogName.DOCUMENT_CREATOR_CONFIRMATION
    );
    this.boxContentsListComponentService.copyToEIMFlag = false;
  }

  // ----------------------------------------
  // イベントハンドラ
  // ----------------------------------------

  /**
   * 入力値初期化後のイベントハンドラです.
   */
  ngOnInit(): void {
    // ドキュメントタイプ一覧取得
    this.objectTypeService
      .getHierarchical(
        this.workspaceObjId,
        EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT
      )
      .subscribe(
        (hierarchicalContentsType: EIMHierarchicalObjectTypeDomain[]) => {
          this.setTypeSelectItems(hierarchicalContentsType);
        },
        (err: any) => {
          window.setTimeout(() => {
            this.errored.emit();
          });
          this.dialogManagerComponentService.close(
            dialogName.DOCUMENT_CREATOR_CONFIRMATION
          );
        }
      );

    window.setTimeout(() => {
      let columns: EIMDataGridColumn[] = [];
      columns.push({
        field: "uploadStatus",
        headerName: this.translateService.instant("EIM_DOCUMENTS.LABEL_02190"),
        width: 115,
        cellRendererFramework: EIMDocumentsCheckinRendererComponent,
        headerClass: "eim-editable-column-header",
      });
      columns.push({
        field: "objName",
        headerName: this.translateService.instant("EIM.LABEL_02002"),
        width: 250,
        cellRendererFramework: EIMObjectNameRendererComponent,
        param: { showLink: false },
      });
      columns.push({
        field: "path",
        headerName: this.translateService.instant("EIM_DOCUMENTS.LABEL_02038"),
        width: 347,
        cellRendererFramework: EIMPlaceRendererComponent,
        param: { showLink: false, isLink: false },
      });

      this.documentList.setColumns(columns);
      this.uploader.addToQueue(this.addFileList);

      //データグリット表示コンテンツを整形して格納
      if (this.addFileList.length && this.addFileList.length > 0) {
        for (let n = 0; n < this.addFileList.length; n++) {
          this.content.push(this.conv(this.addFileList[n], this.path));
        }
      }
      this.documentList.setData(this.content);
    });
  }

  /**
   * 全選択入力内容変更イベントハンドラ.
   * @param event イベント
   */
  onChange(event: any): void {
    let dataList = this.documentList.getData();
    if (event.checked) {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].uploadStatus === uploadStatusNumber.NOT_CHECKED) {
          dataList[i].uploadStatus = uploadStatusNumber.CHECKED;
        }
      }
    } else {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].uploadStatus === uploadStatusNumber.CHECKED) {
          dataList[i].uploadStatus = uploadStatusNumber.NOT_CHECKED;
        }
      }
    }
    this.documentsCheckinRendererComponentService.checkChanged(dataList);
  }

  /**
   * コンポーネント破棄前イベントハンドラです.
   */
  ngOnDestroy(): void {
    if (!this.changed.closed) {
      this.changed.unsubscribe();
    }
  }

  /**
   * チェックインフラグ更新時イベントハンドラです.
   */
  changedCheck(changedData: any): void {
    let dataList = this.documentList.getData();
    let checkedCount = 0;

    const uploadStatusArray: number[] = new Array(dataList.length);
    for (let i = 0; i < dataList.length; i++) {
      let data: any = dataList[i];
      if (data.uploadStatus === uploadStatusNumber.CHECKED) {
        checkedCount++;
      }
      // uploadStatus配列格納
      uploadStatusArray[i] = data.uploadStatus;
    }
    // uploadStatusチェック
    const uploadStatusCheck = uploadStatusArray.every(
      (uploadStatus) =>
        uploadStatus === uploadStatusNumber.CANNOT_UPLOAD ||
        uploadStatus === uploadStatusNumber.NOT_CHECKED
    );
    if (uploadStatusCheck) {
      this.documentCheckFlg = false;
    } else {
      this.documentCheckFlg = true;
    }

    // すべてチェック済の場合
    if (checkedCount === dataList.length) {
      this.allCheckFlg = true;
    } else {
      this.allCheckFlg = false;
    }
  }

  /**
   * タイプ変更イベントハンドラ
   * @param event イベント
   */
  onChangeType(event: any): void {
    // タイプ選択フラグを初期化
    this.documetTypeFlg = false;

    this.changeType();
    //ドキュメント登録可否確認
    this.confirmDocument();

    //タイプ選択フラグをtrueに変更
    this.documetTypeFlg = true;
  }

  /**
   * タイプ選択画面表示ボタンクリックイベントハンドラ
   * @param event イベント
   */
  onClickShowObjectTypeSelector(event: any): void {
    // タイプ選択フラグを初期化
    this.documetTypeFlg = false;

    // ドキュメントタイプツリーを表示する
    let dialogId: string =
      this.dialogManagerComponentService.showObjectTypeTreeSelector(
        null,
        this.workspaceObjId,
        EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT,
        {
          selected: (documentType: any) => {
            this.dialogManagerComponentService.close(dialogId);
            this.selectedDocumentTypeId = documentType.id;
            this.changeType();
            //ドキュメント登録可否確認
            this.confirmDocument();
          },
        }
      );

    //タイプ選択フラグをtrueに変更
    this.documetTypeFlg = true;
  }

  /**
   * ワークフローダイアグラムエラー時イベントハンドラ
   */
  workflowDiagramErroed(): void {
    this.selectedDocumentTypeId = null;
  }

  // ----------------------------------------
  // 非公開メソッド
  // ----------------------------------------

  /**
   * ドキュメント登録可否確認処理です.
   * 登録可否を更新します.
   */
  private confirmDocument() {
    // 登録可否確認に必要なリクエストパラメータを設定
    let additionalParameter: any = {
      objId: this.parentObjId,
      documentTypeId: this.selectedDocumentTypeId,
      createUserId: this.createUser.id,
    };

    //登録可否確認
    this.boxFileService
      .confirmBoxFile(additionalParameter)
      .subscribe((data: any) => {
        this.setConfirmedData(data);
      });
  }

  /**
   * ドキュメント登録可否反映処理です.
   * チェックイン欄を更新します.
   */
  private setConfirmedData(data: any) {
    //確認前データ
    let documentList: any[] = this.documentList.getData();
    //確認後サーバからの返却データ
    let confirmedDocumentList = data.value;

    // データグリッドに表示するデータの作成（確認前データのdocumentList の順序を維持）
    const confirmedData = documentList.map((doc) => {
      const matchedDoc = confirmedDocumentList.find(
        (confirmedDoc) => confirmedDoc.objName === doc.objName
      );
      return this.conv(matchedDoc);
    });

    this.documentList.setData(confirmedData);

    //登録不可またはチェックイン対象ドキュメントが含まれていない場合
    //登録ボタン活性化条件のdocumentCheckFlgをtrueにする
    for (let m = 0; m < confirmedData.length; m++) {
      if (
        !(
          confirmedData[m].uploadStatus === uploadStatusNumber.CANNOT_UPLOAD ||
          confirmedData[m].uploadStatus === uploadStatusNumber.NOT_CHECKED
        )
      ) {
        this.documentCheckFlg = true;
      } else {
        this.documentCheckFlg = false;
      }
    }
  }

  /**
   * ドキュメントタイプ変更処理です.
   * ワークフローを更新します.
   */
  private changeType(): void {
    // ワークフロー表示初期化
    let objTypeId: number = this.selectedDocumentTypeId;
    this.workflowDiagram.clear();
    this.workflowDiagram.show({
      createType: "document",
      objTypeId: objTypeId,
      workspaceId: this.parentObjId,
    });
    this.preSelectedTypeId = this.selectedDocumentTypeId;
  }

  /**
   * タイプコンボボックス用のデータを生成します.
   * @param objectTypes オブジェクトタイプ情報
   */
  private setTypeSelectItems(
    objectTypes: EIMHierarchicalObjectTypeDomain[]
  ): void {
    const tmpTypeSelectItems:SelectItem[] = [];
    for (let i = 0; i < objectTypes.length; i++) {
      let objectType: EIMHierarchicalObjectTypeDomain = objectTypes[i];
      if (objectType.children && objectType.children.length === 0) {
        // 末端
        tmpTypeSelectItems.push({
          label: objectType.name,
          value: objectType.id,
        });
      } else {
        this.setTypeSelectItems(objectType.children);
      }
    }
    this.typeSelectItems = tmpTypeSelectItems;
  }

  /** 型変換を行います。
   *@param obj 登録対象オブジェクト
   *@param path 登録対象パス
   *@return 型変換結果
   */
  private conv(obj: any, path?: String): any {
    let objTypeName = "";
    if (obj.objType === "folder") {
      objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_FOLDER;
    } else if (obj.objType === "document" || obj.type === "file") {
      objTypeName = EIMDocumentsConstantService.OBJECT_TYPE_DOCUMENT;
    }

    return {
      checkinFlag: obj.checkinFlag ?? false,
      objName: obj.objName || obj.name,
      objType: obj.objType || obj.type,
      path: obj.path || path,
      reason: obj.reason ?? "",
      uploadStatus: Number(obj.uploadStatus) ?? null,
      objTypeName: objTypeName,
      sameNameObj: obj.sameNameObj ?? null,
    };
  }
}
