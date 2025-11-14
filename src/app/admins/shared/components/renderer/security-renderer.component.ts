import { Component, OnDestroy } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { AgRendererComponent } from "ag-grid-angular";
import { EIMDataGridComponent } from "app/shared/components/data-grid/data-grid.component";
import { EIMUserService } from "app/admins/shared/services/apis/user.service";
import { EIMAdminsUserDTO } from "../../dtos/admins-user.dto";

/**
 * セキュリティレンダラーコンポーネント
 * @example
 *
 *      cellRendererFramework: EIMSecurityRendererComponent
 *
 */
@Component({
  selector: "security-renderer",
  template: `
    <div
      class="security-renderer"
      style="height: 100%; display: flex; align-items: center;"
    >
      <div
        *ngIf="this.typeName === 'ユーザ' && this.userDisable == 1"
        style="color: silver; position: static; top: 0; bottom: 0; margin: auto; height: auto; width: 100%;"
      >
        {{ label }}
      </div>
      <div
        *ngIf="
          (this.typeName === 'ユーザ' && this.userDisable == 0) ||
          this.typeName !== 'ユーザ'
        "
        style="color: black; position: static; top: 0; bottom: 0; margin: auto; height: auto; width: 100%;"
      >
        {{ label }}
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep .security-renderer {
        height: 100%;
        width: 100%;
        position: static;
      }
    `,
  ],
	standalone: false,
})
export class EIMSecurityRendererComponent implements AgRendererComponent {
  private params: any;
  public label: string;

  public typeName: string;

  public userDisable: number;

  /**
   * コンストラクタ
   */
  constructor(protected userService: EIMUserService) {}

  /**
   * 入力値初期化後イベントハンドラ.
   * @param params パラメータ
   */
  agInit(params: any): void {
    this.params = params;
    this.label = this.getLabel(params.data, params.colDef.field);
    this.userDisable = params.data.userDisable;
    this.typeName = params.data.entryTypeName;
  }

  /**
   * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
   * @param params 行データ
   * @return リフレッシュする場合true、しない場合false
   */
  refresh(params: any): boolean {
    return true;
  }

  /**
   * ラベルを取得します.配列指定は未対応です.
   * @param data データ
   * @param field フィールド名
   * @return ラベル
   */
  getLabel(data, field: string): string {
    let targetData = data;

    let fields: string[] = field.split(".");
    for (let i = 0; i < fields.length; i++) {
      targetData = targetData[fields[i]];
      if (targetData === undefined) {
        return "";
      }
    }

    return targetData;
  }
}
