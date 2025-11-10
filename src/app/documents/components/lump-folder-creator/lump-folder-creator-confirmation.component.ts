import {
	Component,
	EventEmitter,
	Input,
	Output,
	SimpleChanges,
	ViewChild,
	forwardRef,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EIMDialogManagerComponentService } from "app/documents/shared/components/dialog-manager/dialog-manager.component.service";
import { EIMLumpDocumentsCheckinRendererComponent } from "app/documents/shared/components/renderer/lump-documents-checkin-renderer.component";
import { EIMLumpDocumentsCheckinRendererComponentService } from "app/documents/shared/components/renderer/lump-documents-checkin-renderer.component.service";
import { EIMObjectNameRendererComponent } from "app/documents/shared/components/renderer/object-name-renderer.component";
import { EIMPlaceRendererComponent } from "app/documents/shared/components/renderer/place-renderer.component";
import { EIMDocumentFormService } from "app/documents/shared/services/apis/document-form.service";
import { EIMDocumentsConstantService } from "app/documents/shared/services/documents-constant.service";
import {
	EIMDataGridColumn,
	EIMDataGridComponent,
} from "app/shared/components/data-grid/data-grid.component";
import { EIMMessageService } from "app/shared/services/message.service";
import { EIMComponent } from "app/shared/shared.interface";
import { SelectItem } from "primeng/api";

namespace uploadStatusNumber {
  export const CAN_UPLOAD = 0;
  export const CANNOT_UPLOAD = 1;
  export const NOT_CHECKED = 2;
  export const DISABLED_CHECKED = 3;
  export const CHECKED = 5;
}

/**
 * ドキュメント一括登録確認コンポーネント
 * @example
 *      <eim-lump-folder-creator-confirmation
 *          [objId]="objId"
 *          [content]="content"
 *          [property]="property"
 *          [expirationDate]="expirationDate"
 *          [createUserId]="createUserId">
 *      </eim-lump-folder-creator-confirmation>
 */
@Component({
    selector: "eim-lump-folder-creator-confirmation",
    templateUrl: "./lump-folder-creator-confirmation.component.html",
    styleUrls: ["./lump-folder-creator.component.css"],
    providers: [
        {
            provide: EIMComponent,
            useExisting: forwardRef(() => EIMLumpFolderCreatorConfirmationComponent),
        },
    ],
    standalone: false
})
export class EIMLumpFolderCreatorConfirmationComponent {
  /** ドキュメントリスト */
  @ViewChild("documentList", { static: true })
  documentList: EIMDataGridComponent;

  /** 確認電文 */
  @Input() content: any[];

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

  /**
   * コンストラクタです.
   */
  constructor(
    protected translateService: TranslateService,
    protected messageService: EIMMessageService,
    protected dialogManagerComponentService: EIMDialogManagerComponentService,
    protected documentFormService: EIMDocumentFormService,
    protected lumpDocumentsCheckinRendererComponentService: EIMLumpDocumentsCheckinRendererComponentService
  ) {
    this.changed =
      lumpDocumentsCheckinRendererComponentService.changed.subscribe(
        (data: any) => {
          this.changedCheck(data);
        }
      );
  }

  // ----------------------------------------
  // 公開メソッド
  // ----------------------------------------

  // ----------------------------------------
  // イベントハンドラ
  // ----------------------------------------

  /**
   * 入力値初期化後のイベントハンドラです.
   */
  ngOnInit(): void {
    window.setTimeout(() => {
      let columns: EIMDataGridColumn[] = [];
      columns.push({
        field: "uploadStatus",
        headerName: this.translateService.instant("EIM_DOCUMENTS.LABEL_02190"),
        width: 115,
        cellRendererFramework: EIMLumpDocumentsCheckinRendererComponent,
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
      this.documentList.setData(this.content);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["content"]) {
      this.documentList.setData(this.content);
    }
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
    // 親階層の判定に影響
    this.checkParent(changedData);

    // フォルダの場合、子階層にも影響
    if (
      changedData.objTypeName === EIMDocumentsConstantService.OBJECT_TYPE_FOLDER
    ) {
      let fullPath = changedData.path + changedData.objName + "/";
      this.checkDataListByPath(fullPath, changedData.uploadStatus);
    }
    let dataList = this.documentList.getData();
    let checkedCount = 0;

    for (let i = 0; i < dataList.length; i++) {
      let data: any = dataList[i];
      if (data.uploadStatus === uploadStatusNumber.CHECKED) {
        checkedCount++;
      }
    }

    // すべてチェック済の場合
    if (checkedCount === dataList.length) {
      this.allCheckFlg = true;
    } else {
      this.allCheckFlg = false;
    }
  }

  /**
   * 親階層にチェックします
   */
  checkParent(changedData: any): void {
    // 解除時は影響しない
    if (changedData.uploadStatus !== uploadStatusNumber.CHECKED) {
      return;
    }
    let pathParts: string[] = changedData.path.split("/");
    let targetPath = "/";
    for (let i = 1; i < pathParts.length; i++) {
      targetPath = targetPath + pathParts[i] + "/";
      this.checkDataByPath(targetPath);
    }
  }

  /**
   * パスから対象列を取得し、チェックします.
   * @param path パス
   */
  checkDataByPath(path: string): void {
    let dataList = this.documentList.getData();
    for (let i = 0; i < dataList.length; i++) {
      if (
        dataList[i].path + dataList[i].objName + "/" === path &&
        (dataList[i].uploadStatus === uploadStatusNumber.NOT_CHECKED ||
          dataList[i].uploadStatus === uploadStatusNumber.CHECKED)
      ) {
        dataList[i].uploadStatus = uploadStatusNumber.CHECKED;
      }
    }
  }

  /**
   * 対象パスと前方が一致する対象列を取得し、チェックします.
   * @param path パス
   * @param uploadStatus アップロードステータス
   */
  checkDataListByPath(path: string, uploadStatus: number): void {
    let dataList = this.documentList.getData();

    for (let i = 0; i < dataList.length; i++) {
      if (
        dataList[i].path.startsWith(path) &&
        (dataList[i].uploadStatus === uploadStatusNumber.NOT_CHECKED ||
          dataList[i].uploadStatus === uploadStatusNumber.CHECKED)
      ) {
        dataList[i].uploadStatus = uploadStatus;
      }
    }
  }
}
