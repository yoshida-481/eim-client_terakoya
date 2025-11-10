import { Injectable } from "@angular/core";
import { getProperty, setProperty } from "dot-prop";

/**
 * cellRendererParamsに指定するレンダラーのパラメータ
 */
export class EIMRendererComponentRowData {
  field: string;
  dto: any;
}

/**
 * レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMRendererComponentService {
  /**
   * コンストラクタです.
   */
  constructor() {}

  // ----------------------------------------
  // 公開メソッド
  // ----------------------------------------
  public setChangedValue(
    rowData: EIMRendererComponentRowData,
    dto: any,
    changedValue: any
  ): void {
    // 非カスタム属性の場合
    if (!rowData.field.startsWith("dto.attributeMap")) {
      setProperty(dto, rowData.field, changedValue);
      return;
    }

    // カスタム属性の場合
    let values = null;
    if (changedValue instanceof Array) {
      values = changedValue;
    } else {
      values = [changedValue];
    }
    let attributePath = this.getAttributePath(rowData.field);
    let srcAttribute: any = getProperty(rowData.dto, attributePath, null);
    setProperty(dto, attributePath, {
      valueType: srcAttribute?.valueType,
      values: values,
      name: srcAttribute?.name,
    });
  }

  // ----------------------------------------
  // 非公開メソッド
  // ----------------------------------------
  /**
   * カスタム属性の取得パスを返却します.
   *
   * @param valuesField カスタム属性の値の取得パス
   * @returns カスタム属性の取得パス
   */
  protected getAttributePath(valuesPath: string): string {
    return valuesPath.slice(0, -".values".length);
  }
}
