# UDJ 要件定義書 (推敲案)
## 1. 概要
### 1.1. プロジェクトの目的
UDJは、YouTubeの豊富な楽曲資産を活用し、誰でも手軽に本格的なDJプレイを体験できるモバイルアプリケーションである。複数のプレイリストを管理し、2つの独立したプレーヤー（デッキ）とクロスフェーダーを駆使して、シームレスな楽曲のミックスを実現する。さらに、QRコードを利用したリクエスト機能を介して、イベントやパーティーで聴衆と一体となった双方向的な音楽体験を提供する。
### 1.2. ターゲットユーザー
手軽にDJを始めてみたい音楽好きな方
友人とのパーティーや小規模なイベントでBGMを担当する方
既存のDJアプリの複雑さやコストにハードルを感じている方
## 2. 機能要件
### 2.1. ユーザーアカウント機能
#### 2.1.1. 認証
Googleアカウントを使用したOAuth認証により、ログイン・新規登録機能を提供する。
#### 2.1.2. プロフィール管理
- アバター: デバイスから画像をアップロードし、アバターとして設定できる。
- ユーザー名: Googleアカウントの表示名を初期値とし、アプリ内で自由に変更可能とする。
- メールアドレス: Googleアカウントに紐づくアドレスを表示する（編集は不可）。
- ログアウト: アプリからログアウトできる。
- アカウント削除: 退会機能。実行すると、作成したプレイリストなど全ての関連データが削除されることを警告し、同意の上で実行する。
### 2.2. プレイリスト機能
#### 2.2.1. プレイリスト管理
- 複数のプレイリストを作成、編集、削除できる。
- プレイリスト一覧画面では、ドラッグ＆ドロップによる並べ替えが可能。
#### 2.2.2. 楽曲管理
- YouTube検索: キーワードで楽曲を検索し、プレイリストに追加できる。
- URL直接追加: YouTube動画のURLを直接入力して楽曲を追加できる。
- 楽曲情報自動取得: 追加された楽曲は、YouTubeから自動的にサムネイルとタイトルを取得して表示する。
- 曲順変更: プレイリスト内で楽曲をドラッグ＆ドロップして曲順を入れ替えられる。
- 楽曲削除: プレイリストから特定の楽曲を削除できる。
### 2.3. DJ（再生）機能 🎧
#### 2.3.1. デュアルプレーヤー（デッキ）
- デッキA・デッキBの2つの独立したプレーヤーで構成される。
- 各デッキに、作成したプレイリストを割り当てることができる。
- 各デッキには、独立した再生/一時停止ボタンと音量調整スライダーを配置する。
#### 2.3.2. クロスフェーダー
- 画面中央に配置されたクロスフェーダーにより、デッキAとデッキBの音量を滑らかに切り替え、楽曲をミックスすることができる。
#### 2.3.3. キュー(CUE)機能
- 曲の再生を開始したいポイント（例: サビの頭）を事前に設定し、ボタン一つでそのポイントから再生を開始する機能。
#### 2.3.4. 波形(Waveform)表示
-曲全体の構成や音量の変化を視覚的な波形として表示する。これにより、曲の展開（静かな部分、盛り上がる部分）が一目でわかるようにする。
#### 2.3.5. BPM表示と同期(SYNC)機能
- BPM表示: 再生する曲のテンポ（BPM）を自動解析して表示する。
- SYNC機能: 片方のデッキのBPMにもう片方のデッキのBPMを自動で合わせ、初心者でもスムーズなミックスを可能にする。
#### 2.3.6. ループ(LOOP)機能
- 曲の特定区間（例: 4小節、8小節）を繰り返し再生（ループ）する機能。
### 2.4. リクエスト機能 📲
#### 2.4.1. リクエスト用QRコード共有
- 任意のプレイリストを「リクエスト受付用」として設定できる。
- リクエスト受付用に設定したプレイリストに対して、専用のQRコードを生成・表示する。
#### 2.4.2. Webリクエストページ
- QRコードを読み込むと、専用のWebページに遷移する。
- Webページでは、DJ（アプリ利用者）が現在再生している楽曲リストがリアルタイムで表示される。
- Webページ内のYouTube検索フォームから楽曲を検索し、DJにリクエストを送信できる。
#### 2.4.3. リクエストの受付
- 送信されたリクエストは、アプリ内の**「リクエスト受付用」プレイリストに自動で追加**される。
- DJは、追加されたリクエスト曲を自身の判断で再生キューに組み込むことができる。
#### 2.4.4. リクエストへの投票機能
- Webリクエストページ上で、他のリスナーが送信したリクエスト曲に対して「いいね！」のような投票ができる機能。DJは人気の高いリクエスト曲を把握できる。
#### 2.4.5. リクエスト数の制限
- 一人のリスナーが短時間に大量のリクエストを送信することを防ぐため、一定時間あたりのリクエスト数を制限する。
## 3. 画面仕様
### 3.1. 共通レイアウト
- 画面下部にタブバー形式のナビゲーションメニューを配置する。
- DJ画面 (中央): アプリのメイン機能。レコードを模した大きな円形ボタンで表現。
- プレイリスト: プレイリスト一覧画面へ遷移。
- アカウント: アカウント情報・設定画面へ遷移。
### 3.2. DJ画面
- ターンテーブルを模したデザインで、上部にデッキA、下部にデッキBを配置。
- 各デッキには、楽曲のサムネイル、タイトル、再生/一時停止ボタン、音量スライダーを表示。
- 画面中央には、左右にスライドするクロスフェーダーを配置。
### 3.3. プレイリスト一覧画面
- ユーザーが作成したプレイリストを一覧表示。
- ドラッグ＆ドロップによる並べ替え、スワイプによる削除などの直感的な操作を提供する。
- 右下に**新規プレイリスト作成用のフローティングアクションボタン（FAB）**を配置。
### 3.4. プレイリスト編集画面
- 選択したプレイリストに含まれる楽曲をサムネイル付きで一覧表示。
- 上部にYouTube検索窓を常時表示。
- 右下にURLから楽曲を追加するための**フローティングアクションボタン（FAB）**を配置。
- 楽曲リストはドラッグ＆ドロップで並べ替え可能。
### 3.5. アカウント画面
- アバター画像、ユーザー名、メールアドレスを表示。
- アバター画像をタップすると、画像アップローダーが起動。
- 「設定」画面への導線と、「ログアウト」ボタンを配置。
### 3.6. 設定画面
- アプリのテーマ（ライトモード/ダークモード）を切り替えるスイッチを配置。
- **「アカウントを削除する」**ボタンを配置（実行前に確認ダイアログを表示）。
### 3.7. Webリクエストページ仕様
#### 3.7.1. 目的
QRコードからアクセスするリスナー（聴衆）に対して、DJへの楽曲リクエスト機能を提供するための独立したウェブページ。スマートフォンでの閲覧に最適化されたレスポンシブデザインとする。

#### 3.7.2. 技術スタック・ホスティング
- フロントエンド: React
- メインのモバイルアプリ（React Native）と技術スタックを合わせることで、コンポーネントのロジックや開発知識の再利用を促し、開発効率を向上させる。
- ホスティング: AWS S3 + AWS CloudFront
- AWS S3に静的ウェブサイトとしてファイルを配置し、AWS CloudFront経由で配信する。
- これにより、安価かつスケーラブルなホスティングを実現し、CloudFrontによって高速なコンテンツ配信と無料のSSL証明書によるHTTPS化を行う。
#### 3.7.3. 機能詳細
- プレイリスト表示: 現在リクエストを受け付けているプレイリストの楽曲一覧を、バックエンドAPI（AWS Lambda）から取得して表示する。
- 楽曲リクエスト:
- ページ内の検索窓からYouTubeの楽曲を検索する（バックエンドAPI経由）。
- 検索結果から曲を選択し、リクエストを送信する。リクエスト情報はバックエンドAPIを通じてDynamoDBに保存される。
- リクエストへの投票: 他のリスナーがリクエストした楽曲一覧を表示し、「いいね」ボタンで投票できるようにする。投票数もバックエンドAPIを通じて更新される。
## 4. 非機能要件
### 4.1. パフォーマンス
- 画面遷移やリストのスクロールは、カクつきなく滑らかに動作すること。
- 楽曲の再生・ミックスにおいて、遅延や音飛びが発生しないこと。
- 楽曲情報の取得や波形の生成は非同期で行い、UIの応答性を維持すること。
### 4.2. セキュリティ
- サーバーサイド（AWS Lambda）との通信は、すべてHTTPSで暗号化する。
- 外部APIのキーなどはクライアントサイドに含めず、サーバーサイドで管理する。
### 4.3. 外部サービス連携
- YouTube Data API v3 を利用する。APIの利用規約および割り当て制限を遵守した設計とする。
### 4.4. 法的要件・コンプライアンス
- YouTube利用規約の遵守:
- 広告の表示: YouTubeプレーヤーに表示される広告を隠したり、無効にしたりしないこと。
- バックグラウンド再生の禁止: アプリが画面に表示されていない状態での音声再生はサポートしない。
- キャッシュ/ダウンロードの禁止: オフライン再生を目的とした動画データの保存は行わない。アプリの利用はオンライン環境が必須である。
- 利用規約とプライバシーポリシー:
- アプリの初回起動時やアカウント作成時に、本アプリの利用規約とプライバシーポリシーを表示し、ユーザーから同意を得るフローを設ける。
## 5. 技術スタック & デザイン
### 5.1. 技術スタック
- フロントエンド: React Native (Expo)
- バックエンド: AWS Lambda
- データベース: AWS DynamoDB
### 5.1.1
- リクエスト用のウェブサイトは
### 5.2. デザインコンセプト
- テーマ: "Modern DJ Booth"
- カラースキーム: ダークテーマを基調とし、レコードや物理的なDJ機材を彷彿とさせるデザイン要素を取り入れる。アクセント- カラーにはネオン系の色を使用し、モダンで洗練された印象を与える。
- UI/UX: ターンテーブルのプラッターやフェーダーなど、物理的なDJ機材のメタファーをUIデザインに落とし込み、直感的な操作性を最優先する。
- アイコンは、モダンで視認性の高いライブラリ（例: Material Icons, Feather Iconsなど）から選定する。
### 5.3. アニメーションとフィードバック
- トランジション: 画面が切り替わる際のアニメーション（フェードイン/アウト等）をアプリ全体で統一する。
- マイクロインタラクション: ボタンタップ時の視覚的フィードバックなど、ユーザーのアクションに対する細かい演出で、操作の楽しさを向上させる。
- ローディング表示: データ読み込み中には、回転するレコードなど、アプリのコンセプトに合ったローディングアニメーションを表示する。
### 5.4. アクセシビリティ
- コントラスト比: テキストやアイコンが背景色に埋もれないよう、十分なコントラスト比を確保する。
- 文字サイズ: OSの文字サイズ設定にある程度追従できる設計を考慮する。
### 5.5. プロジェクト構成と開発環境
#### 5.5.1. モノレポ構成の採用
開発効率とメンテナンス性を向上させるため、本プロジェクトは単一のリポジトリで複数のパッケージ（frontend, backend, web）を管理するモノレポ構成を採用する。

目的:
- コードの共有: 複数のパッケージ間で型定義や共通の関数などを容易に共有する。
- 依存関係の一元管理: プロジェクト全体の依存関係をルートで管理し、バージョン間のコンフリクトを防ぐ。
- 開発環境の統一: コマンド一つで全プロジェクトのセットアップやビルドを実行できるようにし、開発体験を向上させる。
#### 5.5.2. 管理ツール
pnpm workspaces を利用してモノレポを管理する。
#### 5.5.3. ディレクトリ構造
プロジェクトルートに各パッケージを配置するpackagesディレクトリを設け、以下のような構成とする。

```
Bash
udj-app/
├── package.json         # (1) ルートのpackage.json
├── pnpm-workspace.yaml  # (2) pnpmワークスペースの定義ファイル
├── packages/
│   ├── frontend/        # React Native (Expo) プロジェクト
│   │   └── package.json
│   ├── backend/         # AWS Lambda プロジェクト
│   │   └── package.json
│   └── web/             # React (Webリクエストページ) プロジェクト
│       └── package.json
└── tsconfig.json        # (3) 共有用のTypeScript設定
```
#### 5.5.4. package.jsonの要件
(1) ルートの package.json

プロジェクト全体の依存関係管理と、各パッケージのスクリプトを横断的に実行するためのコマンドを定義する。

- private: true を設定し、リポジトリ全体がnpmに公開されないようにする。
- devDependencies に、typescript や eslint など、全パッケージで共通して利用する開発ツールを定義する。
- scripts に、各ワークスペースのコマンドを実行するためのスクリプトを定義する。
```json
コード スニペット
{
  "name": "udj-app-monorepo",
  "private": true,
  "scripts": {
    "dev:frontend": "pnpm --filter frontend start",
    "dev:web": "pnpm --filter web dev",
    "build:frontend": "pnpm --filter frontend build",
    "build:web": "pnpm --filter web build",
    "build:backend": "pnpm --filter backend build",
    "lint": "pnpm -r lint",
    "type-check": "pnpm -r type-check"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "typescript": "^5.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```
(2) pnpm-workspace.yaml

pnpmにワークスペースの場所を教えるための定義ファイル。
```
コード スニペット

packages:
  - 'packages/*'
```
(3) 共有TypeScript設定 (tsconfig.json)

複数のパッケージで型定義などを共有するため、ルートに共通のtsconfig.jsonを配置し、各パッケージはこれを拡張（extends）して利用する。これにより、型の一貫性を保つ。
## 6. 将来の展望
### 6.1 追加予定機能
- 音楽ストリーミングサービスの楽曲の追加
- ユーザーのフォロー機能
- 公開プレイリストの一覧表示