# EIMドキュメント

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.26.

_ Node.jsバージョン11以上が必要です。後述の"複数バージョンNode.js切り替え"を参照してください。 _

## 開発サーバ起動

`npm run start` を実行して開発サーバ（フロントエンド）を起動します. `http://localhost:4200/eim/client`にてアプリケーションにアクセスできます. 当アプリはソース変更時、自動で再読み込みします.開発サーバのポート番号は、protractor.conf.jsのbaseUrlを変更してください.アプリサーバ（バックエンド）のポート番号の変更は、proxy.conf.jsonのtargetを変更してください.
IPアドレス変更の場合は上記の他にpackage.jsonのnpm startに"--host [IPアドレス]"を付加して下さい。

## ソースコード静的解析

`npm run lint`にて、lintを実行します.

## ビルド

`npm run build` を実行してプロジェクトをビルドします.ビルド成果物は`/release/webapp/client` ディレクトリにclient.zipが保存されます. eimプロジェクト直下のclientディレクトリにコピーしeimのビルドを実行します.
node_modules側でエラーが発生する場合は、package.jsonを以下のように修正してください。
    "@angular/compiler-cli": "~5.1.0-beta.0",
    ↓
    "@angular/compiler-cli": "5.0.5",
    "@angular-devkit/core": "0.4.0",
@angular/compiler-cliのバージョンを@angularに合わせる必要があります。

## コードドキュメント生成

`npm run compodoc`を実行してコードドキュメントを生成します.ドキュメントは`docs/` ディレクトリに保存されます.
（typedocを生成する場合は、`npm run docs`を実行してコードドキュメントを生成します.ドキュメントは`docs/` ディレクトリに保存されます.）
（yuiDocを生成する場合は、`ng build`後に、`npm run yuidocs`を実行して下さい.ドキュメントは`doc/` ディレクトリに保存されます.）

## 使用ライブラリの著作権表示

`npm run copyrights`を実行して使用ライブラリの著作権一覧ファイルを生成します.ファイルは`copyrights.csv` に保存されます.

## 複数バージョンNode.js切り替え

以下からnvm_setup.zipをインストールします。
https://ctcbox.ent.box.com/file/844560357170

~~`nvm proxy http://＜z付き番号＞:＜パスワード＞@ctcpro.ctc-g.co.jp:8080`にてプロキシを設定します。
`nvm proxy none`にてプロキシの設定を除外してください。

`nvm list available`にて利用可能なNode.jsのバージョンが一覧表示されます。
`nvm list`にてインストールされているNode.jsのバージョンが一覧表示されます。
`nvm install 22.17.0`にて指定のバージョンのNode.jsがインストールされます。
`nvm use 22.17.0`にてNode.jsを指定のバージョンに変更します。
  - AngularV 6： 8.17.0
  - AngularV12：12.22.3
  - AngularV19：22.17.0

## npm パッケージのセキュリティチェック

以下のコマンドでnpm パッケージのセキュリティをチェックします。パッケージを追加した際に実行してください。

`npm audit`にてnpm パッケージのセキュリティチェック結果が一覧表示されます。
`npm audit fix`にてnpm パッケージのセキュリティ違反が修正されます。
修正できない場合もあります。手動で修正する場合は、package.json修正後、node_modules、package-lock.jsonを削除後、yarn installし、npm auditを再実行してください。

