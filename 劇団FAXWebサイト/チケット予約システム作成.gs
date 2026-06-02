/**
 * 劇団チケット予約システム 自動作成スクリプト（料金対応版）
 *
 * 【使い方】
 * 1. Google Apps Script (https://script.google.com) を開く
 * 2. 新しいプロジェクトを作成し、このコードを貼り付けて保存
 * 3. 「createTheaterTicketSystem」を選択して実行
 * 4. 権限の承認を求められたら「許可」をクリック
 * 5. 完了後、ログ（表示→ログ）にURLが表示されます
 *
 * 【チケット料金】
 * 一般：3,000円 / 学生：1,000円 / 高校生以下：無料
 *
 * 【ワークショップ分岐】
 * 7月18日 → フェルト手芸のみ表示
 * 7月19日 → 民族楽器コンサートのみ表示
 *
 * 【スプレッドシート構成】
 * - フォーム回答タブ：全回答一覧
 * - 各ステージタブ：来場者リスト（氏名・ふりがな・各チケット枚数・備考）
 * - 収入集計タブ：ステージ別・全体のチケット収入
 */

function createTheaterTicketSystem() {

  // ========== 1. スプレッドシートを作成 ==========
  var ss = SpreadsheetApp.create('劇団チケット予約管理');
  var ssId = ss.getId();
  Logger.log('スプレッドシート作成: ' + ss.getUrl());

  // ========== 2. フォームを作成 ==========
  var form = FormApp.create('チケット予約フォーム');
  form.setTitle('チケット予約フォーム');
  form.setDescription(
    '公演チケットのご予約をお受けしております。\n' +
    '以下の項目をご記入の上、送信してください。\n\n' +
    '【公演日程】\n' +
    '7月18日(土) フェルト手芸の日！\n' +
    '　12:30〜 ／ 17:30〜\n\n' +
    '7月19日(日) 民族楽器コンサートの日！\n' +
    '　10:30〜 ／ 14:30〜\n\n' +
    '【料金】\n' +
    'OPENからCLOSEまでの3時間分の料金です。\n' +
    'ワークショップや上演などは別途料金は発生しません。\n' +
    '物販は別途料金がかかります。\n' +
    '（一般）3,000円\n' +
    '（学生）1,000円\n' +
    '（高校生以下）無料'
  );
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setShowLinkToRespondAgain(true);
  form.setConfirmationMessage('ご予約ありがとうございます。当日お待ちしております！');

  // ===== セクション1：基本情報 =====

  // 氏名
  form.addTextItem()
    .setTitle('氏名')
    .setHelpText('例：山田 太郎')
    .setRequired(true);

  // ふりがな
  form.addTextItem()
    .setTitle('ふりがな')
    .setHelpText('例：やまだ たろう')
    .setRequired(true);

  // 一般チケット枚数
  var generalItem = form.addListItem();
  generalItem
    .setTitle('一般チケット枚数（3,000円）')
    .setChoices([
      generalItem.createChoice('0'),
      generalItem.createChoice('1'),
      generalItem.createChoice('2'),
      generalItem.createChoice('3'),
      generalItem.createChoice('4'),
      generalItem.createChoice('5'),
    ])
    .setRequired(true);

  // 学生チケット枚数
  var studentItem = form.addListItem();
  studentItem
    .setTitle('学生チケット枚数（1,000円）')
    .setChoices([
      studentItem.createChoice('0'),
      studentItem.createChoice('1'),
      studentItem.createChoice('2'),
      studentItem.createChoice('3'),
      studentItem.createChoice('4'),
      studentItem.createChoice('5'),
    ])
    .setRequired(true);

  // 高校生以下チケット枚数
  var highschoolItem = form.addListItem();
  highschoolItem
    .setTitle('高校生以下チケット枚数（無料）')
    .setChoices([
      highschoolItem.createChoice('0'),
      highschoolItem.createChoice('1'),
      highschoolItem.createChoice('2'),
      highschoolItem.createChoice('3'),
      highschoolItem.createChoice('4'),
      highschoolItem.createChoice('5'),
    ])
    .setRequired(true);

  // 備考
  form.addParagraphTextItem()
    .setTitle('備考')
    .setHelpText('アレルギー・車椅子でのご来場・その他ご要望などがあればご記入ください');

  // 予約ステージ（分岐ポイント）※setChoicesはセクション作成後にセット
  var stageItem = form.addMultipleChoiceItem()
    .setTitle('予約ステージ')
    .setHelpText('ご希望の回をお選びください')
    .setRequired(true);

  // ===== セクション2：18日（フェルト手芸）=====
  var section18 = form.addPageBreakItem()
    .setTitle('ワークショップについて');

  var feltItem = form.addCheckboxItem()
    .setTitle('フェルト手芸ワークショップに参加しますか？')
    .setHelpText('7月18日(土) 公演後に開催予定です');
  feltItem.setChoices([feltItem.createChoice('参加する')]);

  // ===== セクション3：19日（コンサート）=====
  // ※このページに通常遷移（18日ユーザーの「次へ」）で到達したら送信する
  var section19 = form.addPageBreakItem()
    .setTitle('ワークショップについて');
  section19.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  var concertItem = form.addCheckboxItem()
    .setTitle('民族楽器コンサートワークショップに参加しますか？')
    .setHelpText('7月19日(日) 公演後に開催予定です');
  concertItem.setChoices([concertItem.createChoice('参加する')]);

  // ===== 分岐設定 =====
  stageItem.setChoices([
    stageItem.createChoice('7月18日(土) 12:30〜　フェルト手芸の日！', section18),
    stageItem.createChoice('7月18日(土) 17:30〜　フェルト手芸の日！', section18),
    stageItem.createChoice('7月19日(日) 10:30〜　民族楽器コンサートの日！', section19),
    stageItem.createChoice('7月19日(日) 14:30〜　民族楽器コンサートの日！', section19),
  ]);

  // ========== 3. フォームをスプレッドシートに連携 ==========
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ssId);
  Logger.log('フォームとスプレッドシートを連携しました');

  Utilities.sleep(3000);
  ss = SpreadsheetApp.openById(ssId);

  // ========== 4. 回答シートの整備 ==========
  // 回答シートの列構成（質問の追加順）:
  //   A: タイムスタンプ
  //   B: 氏名
  //   C: ふりがな
  //   D: 一般チケット枚数（3,000円）
  //   E: 学生チケット枚数（1,000円）
  //   F: 高校生以下チケット枚数（無料）
  //   G: 備考
  //   H: 予約ステージ
  //   I: フェルト手芸ワークショップ（18日のみ）
  //   J: コンサートワークショップ（19日のみ）

  var allSheets = ss.getSheets();
  var responseSheet = null;
  for (var i = 0; i < allSheets.length; i++) {
    var sn = allSheets[i].getName();
    if (sn !== 'シート1' && sn !== 'Sheet1') {
      responseSheet = allSheets[i];
      break;
    }
  }
  if (!responseSheet) responseSheet = allSheets[allSheets.length - 1];

  responseSheet.setName('フォーム回答');

  var headerRange = responseSheet.getRange(1, 1, 1, 10);
  headerRange.setBackground('#4a86e8');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');

  var defaultSheet = ss.getSheetByName('シート1') || ss.getSheetByName('Sheet1');
  if (defaultSheet && defaultSheet.getName() !== 'フォーム回答') {
    ss.deleteSheet(defaultSheet);
  }

  // ========== 5. ステージ別タブを作成 ==========
  // 各ステージタブに：氏名・ふりがな・一般・学生・高校生以下・備考 を表示

  var stages = [
    { tabName: '7/18(土)12:30〜', stageValue: '7月18日(土) 12:30〜　フェルト手芸の日！',       color: '#fce5cd' },
    { tabName: '7/18(土)17:30〜', stageValue: '7月18日(土) 17:30〜　フェルト手芸の日！',       color: '#fff2cc' },
    { tabName: '7/19(日)10:30〜', stageValue: '7月19日(日) 10:30〜　民族楽器コンサートの日！', color: '#d9ead3' },
    { tabName: '7/19(日)14:30〜', stageValue: '7月19日(日) 14:30〜　民族楽器コンサートの日！', color: '#cfe2f3' }
  ];

  for (var j = 0; j < stages.length; j++) {
    var s = stages[j];
    var stageSheet = ss.insertSheet(s.tabName);
    stageSheet.setTabColor(s.color);

    // ヘッダー
    stageSheet.getRange('A1:F1').setValues([['氏名', 'ふりがな', '一般', '学生', '高校生以下', '備考']]);
    stageSheet.getRange('A1:F1').setBackground('#4a86e8');
    stageSheet.getRange('A1:F1').setFontColor('#ffffff');
    stageSheet.getRange('A1:F1').setFontWeight('bold');

    stageSheet.setColumnWidth(1, 150);
    stageSheet.setColumnWidth(2, 150);
    stageSheet.setColumnWidth(3, 60);
    stageSheet.setColumnWidth(4, 60);
    stageSheet.setColumnWidth(5, 90);
    stageSheet.setColumnWidth(6, 280);

    // QUERY: H列=ステージ でフィルタ、B〜G列を表示
    var formula =
      '=IFERROR(' +
        'QUERY(' +
          'フォーム回答!A:J,' +
          '"SELECT B,C,D,E,F,G ' +
          'WHERE H=\'' + s.stageValue + '\' ' +
          'AND B IS NOT NULL ' +
          'LABEL B \'\', C \'\', D \'\', E \'\', F \'\', G \'\'",' +
          '0' +
        '),' +
      ')';
    stageSheet.getRange('A2').setFormula(formula);
  }

  // ========== 6. 収入集計シートを作成 ==========
  var revenueSheet = ss.insertSheet('収入集計');
  revenueSheet.setTabColor('#cc0000');

  // ヘッダー
  revenueSheet.getRange('A1:F1').setValues([[
    'ステージ', '一般（枚）', '学生（枚）', '高校生以下（枚）', '合計枚数', 'チケット収入（円）'
  ]]);
  revenueSheet.getRange('A1:F1').setBackground('#cc0000');
  revenueSheet.getRange('A1:F1').setFontColor('#ffffff');
  revenueSheet.getRange('A1:F1').setFontWeight('bold');

  // 各ステージ行
  // 一般:D列(3000円) 学生:E列(1000円) 高校生以下:F列(無料) ステージ:H列
  var stageLabels = [
    '7月18日(土) 12:30〜　フェルト手芸の日！',
    '7月18日(土) 17:30〜　フェルト手芸の日！',
    '7月19日(日) 10:30〜　民族楽器コンサートの日！',
    '7月19日(日) 14:30〜　民族楽器コンサートの日！'
  ];

  for (var k = 0; k < stageLabels.length; k++) {
    var row = k + 2;
    var sv = stageLabels[k];
    revenueSheet.getRange(row, 1).setValue(sv);

    // 一般枚数合計
    revenueSheet.getRange(row, 2).setFormula(
      '=SUMPRODUCT((フォーム回答!H$2:H$1000="' + sv + '")*(VALUE(IFERROR(フォーム回答!D$2:D$1000,0))))'
    );
    // 学生枚数合計
    revenueSheet.getRange(row, 3).setFormula(
      '=SUMPRODUCT((フォーム回答!H$2:H$1000="' + sv + '")*(VALUE(IFERROR(フォーム回答!E$2:E$1000,0))))'
    );
    // 高校生以下枚数合計
    revenueSheet.getRange(row, 4).setFormula(
      '=SUMPRODUCT((フォーム回答!H$2:H$1000="' + sv + '")*(VALUE(IFERROR(フォーム回答!F$2:F$1000,0))))'
    );
    // 合計枚数
    revenueSheet.getRange(row, 5).setFormula('=B' + row + '+C' + row + '+D' + row);
    // 収入
    revenueSheet.getRange(row, 6).setFormula('=B' + row + '*3000+C' + row + '*1000');
  }

  // 合計行
  var totalRow = stageLabels.length + 2;
  revenueSheet.getRange(totalRow, 1).setValue('【全ステージ合計】');
  revenueSheet.getRange(totalRow, 1).setFontWeight('bold');
  revenueSheet.getRange(totalRow, 2).setFormula('=SUM(B2:B' + (totalRow-1) + ')');
  revenueSheet.getRange(totalRow, 3).setFormula('=SUM(C2:C' + (totalRow-1) + ')');
  revenueSheet.getRange(totalRow, 4).setFormula('=SUM(D2:D' + (totalRow-1) + ')');
  revenueSheet.getRange(totalRow, 5).setFormula('=SUM(E2:E' + (totalRow-1) + ')');
  revenueSheet.getRange(totalRow, 6).setFormula('=SUM(F2:F' + (totalRow-1) + ')');
  revenueSheet.getRange(totalRow, 1, 1, 6).setBackground('#f4cccc');
  revenueSheet.getRange(totalRow, 1, 1, 6).setFontWeight('bold');

  // 列幅調整
  revenueSheet.setColumnWidth(1, 280);
  revenueSheet.setColumnWidth(2, 90);
  revenueSheet.setColumnWidth(3, 90);
  revenueSheet.setColumnWidth(4, 110);
  revenueSheet.setColumnWidth(5, 90);
  revenueSheet.setColumnWidth(6, 150);

  // 収入列に通貨書式
  revenueSheet.getRange('F2:F' + totalRow).setNumberFormat('¥#,##0');

  // ========== 7. 完了 ==========
  ss.setActiveSheet(responseSheet);

  var formUrl = form.getPublishedUrl();
  var ssUrl   = ss.getUrl();

  Logger.log('===== 作成完了 =====');
  Logger.log('フォームURL（回答者用）: ' + formUrl);
  Logger.log('フォーム編集URL:       ' + form.getEditUrl());
  Logger.log('スプレッドシートURL:   ' + ssUrl);

  try {
    SpreadsheetApp.getUi().alert(
      '✅ 作成完了！\n\n' +
      '【フォームURL（回答者用）】\n' + formUrl +
      '\n\n【スプレッドシートURL】\n' + ssUrl +
      '\n\n※ 詳細はログ（表示→ログ）でも確認できます。'
    );
  } catch(e) {}
}
