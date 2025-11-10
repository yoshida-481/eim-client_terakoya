/**
 * 複数値の等価検索条件DTOです.
 */
export class EIMMultipleCriteriaDTO<T> {
	/** 条件リスト */
	private arrayList: Array<T> = [];


	/**
	 * コンストラクタ。<br>
	 * プロパティ値は全てデフォルト値となります。
	 * @since Ver5.0
	 */
	constructor() {}

	/**
	 * 条件リストを取得します。
	 * @return 条件リスト
	 * @since Ver5.0
	 */
	public getArrayList(): Array<T> {
	    return this.arrayList;
	}

	/**
	 * 条件リストを設定します。
	 * @param arrayList 条件リスト
	 * @since Ver5.0
	 */
	public setArrayList(arrayList: Array<T>): void {
	    this.arrayList = arrayList;
	}

	/**
	 * 指定された要素を条件リストの最後に追加します
	 * @param element 条件リストに追加される要素
	 * @return リストに追加成否
	 * @since Ver5.0
	 */
	public add(element: T): void {
		this.arrayList.push(element);
	}

	/**
	 * リスト内の要素数を返します。
	 * @return リスト内の要素数
	 * @since Ver5.0
	 */
	public size(): number {
	    return this.arrayList.length;
	}

	/**
	 * リスト内の指定された位置にある要素を返します。
	 * @param index 返される要素のインデックス
	 * @return リスト内の指定された位置にある要素
	 * @since Ver5.0
	 */
	public get(index: number): T {
		return this.arrayList[index];
	}
}
