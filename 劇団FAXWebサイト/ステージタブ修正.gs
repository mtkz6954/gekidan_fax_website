/**
 * ステージタブ・収入集計 修正スクリプト
 *
 * 【使い方】
 * 1. 「劇団チケット予約管理」スプレッドシートを開く
 * 2. 「拡張機能」→「Apps Script」でスクリプトエディタを開く
 * 3. このコードを貼り付けて保存
 * 4. 「fixAllSheets」を選択して実行
 *
 * 【各ステージタブの構成】
 * 行1: 集計サマリー（来場者合計・ワークショップ参加人数）
 * 行2: 空白
 * 行3: ヘッダー（氏名・ふりがな・一般・学生・高校生以下・備考）
 * 行4〜: 予約データ（QUERY自動抽出）
 */

function fixAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ===== 回答シートを特定 =====
  var responseSheet = null;
  var responseSheetName = '';
  var allSheets = ss.getSheets();

  for (var i = 0; i < allSheets.length; i++) {
    var n = allSheets[i].getName();
    var isCandidate = (n === 'Form_Responses' || n === 'フォーム回答' ||
                       n.indexOf('Response') !== -1 || n.indexOf('回答') !== -1);
    if (isCandidate && allSheets[i].getLastRow() > 1) {
      responseSheet = allSheets[i]; responseSheetName = n; break;
    }
  }
  if (!responseSheet) {
    for (var i = 0; i < allSheets.length; i++) {
      var n = allSheets[i].getName();
      if (n === 'Form_Responses' || n === 'フォーム回答' ||
          n.indexOf('Response') !== -1 || n.indexOf('回答') !== -1) {
        responseSheet = allSheets[i]; responseSheetName = n; break;
      }
    }
  }
  if (!responseSheet) {
    SpreadsheetApp.getUi().alert('回答シートが見つかりません。\n全シート: ' +
      allSheets.map(function(s){ return s.getName(); }).join(', '));
    return;
  }
  Logger.log('回答シート: ' + responseSheetName);

  // ===== ヘッダーから列位置を特定 =====
  var lastCol = Math.max(responseSheet.getLastColumn(), 10);
  var headers = responseSheet.getRange(1, 1, 1, lastCol).getValues()[0];
  Logger.log('ヘッダー: ' + JSON.stringify(headers));

  function colToLetter(col) {
    var letter = '';
    while (col > 0) {
      var rem = (col - 1) % 26;
      letter = String.fromCharCode(65 + rem) + letter;
      col = Math.floor((col - 1) / 26);
    }
    return letter;
  }

  function findCol(keywords) {
    for (var h = 0; h < headers.length; h++) {
      var header = String(headers[h]).trim();
      for (var k = 0; k < keywords.length; k++) {
        if (header.indexOf(keywords[k]) !== -1) return colToLetter(h + 1);
      }
    }
    return null;
  }

  var colName       = findCol(['氏名'])                          || 'B';
  var colFuri       = findCol(['ふりがな', 'フリガナ'])             || 'C';
  var colGeneral    = findCol(['一般'])                          || 'D';
  var colStudent    = findCol(['学生'])                          || 'E';
  var colHighschool = findCol(['高校生'])                        || 'F';
  var colNote       = findCol(['備考'])                          || 'G';
  var colStage      = findCol(['予約ステージ', 'ステージ'])         || 'H';
  var colFelt       = findCol(['フェルト'])                      || 'I';
  var colConcert    = findCol(['コンサート', '民族'])              || 'J';
  var lastColLetter = colToLetter(Math.max(lastCol, 10));

  Logger.log('一般:' + colGeneral + ' 学生:' + colStudent + ' 高校生:' + colHighschool +
             ' ステージ:' + colStage + ' フェルト:' + colFelt + ' コンサート:' + colConcert);

  var sheetRef = "'" + responseSheetName.replace(/'/g, "''") + "'";

  // ===== 実際のステージ値をデータから取得 =====
  var stageColIndex = -1;
  for (var h = 0; h < headers.length; h++) {
    if (String(headers[h]).indexOf('ステージ') !== -1) { stageColIndex = h; break; }
  }
  var stageValuesFound = {};
  if (stageColIndex >= 0 && responseSheet.getLastRow() >= 2) {
    var stageData = responseSheet.getRange(2, stageColIndex + 1, responseSheet.getLastRow() - 1, 1).getValues();
    for (var r = 0; r < stageData.length; r++) {
      var v = String(stageData[r][0]).trim();
      if (v) stageValuesFound[v] = true;
    }
  }

  // ===== ステージ別タブを再構築 =====
  // timeKey: ワイルドカード検索に使う時刻文字列（各ステージで一意）
  var stages = [
    { tabName: '7/18(土)12:30〜', keywords: ['18', '12:30'], timeKey: '12:30', wsCol: colFelt,    color: '#fce5cd' },
    { tabName: '7/18(土)17:30〜', keywords: ['18', '17:30'], timeKey: '17:30', wsCol: colFelt,    color: '#fff2cc' },
    { tabName: '7/19(日)10:30〜', keywords: ['19', '10:30'], timeKey: '19.*10:30', wsCol: colConcert, color: '#d9ead3' },
    { tabName: '7/19(日)14:30〜', keywords: ['19', '14:30'], timeKey: '14:30', wsCol: colConcert, color: '#cfe2f3' }
  ];

  var updatedStageTabs = 0;

  for (var j = 0; j < stages.length; j++) {
    var tab = stages[j];
    var stageSheet = ss.getSheetByName(tab.tabName);
    if (!stageSheet) { Logger.log('タブなし: ' + tab.tabName); continue; }

    // 実際のステージ値をマッチング（QUERYのWHERE句用）
    var matchedValue = null;
    var actualValues = Object.keys(stageValuesFound);
    for (var v = 0; v < actualValues.length; v++) {
      var val = actualValues[v];
      var allMatch = true;
      for (var kw = 0; kw < tab.keywords.length; kw++) {
        if (val.indexOf(tab.keywords[kw]) === -1) { allMatch = false; break; }
      }
      if (allMatch) { matchedValue = val; break; }
    }

    var whereClause = matchedValue
      ? colStage + '=\'' + matchedValue + '\''
      : colStage + ' LIKE \'%' + tab.keywords[1] + '%\'';

    // SUMPRODUCT/COUNTIFSはワイルドカードで確実にマッチ（文字コードのズレに強い）
    var wildcardStage = '*' + tab.keywords[1] + '*';  // 例: "*17:30*"

    // シートをクリア
    stageSheet.clearContents();
    stageSheet.clearFormats();
    stageSheet.setTabColor(tab.color);

    // ----- 行1: 集計サマリー -----
    // 来場者合計 = 一般+学生+高校生以下の合計枚数（ワイルドカードで部分一致）
    var totalPeopleFormula =
      '=SUMPRODUCT((ISNUMBER(SEARCH("' + tab.keywords[1] + '",' + sheetRef + '!' + colStage + '$2:' + colStage + '$1000)))' +
      '*(VALUE(IFERROR(' + sheetRef + '!' + colGeneral + '$2:' + colGeneral + '$1000,0))' +
      '+VALUE(IFERROR(' + sheetRef + '!' + colStudent + '$2:' + colStudent + '$1000,0))' +
      '+VALUE(IFERROR(' + sheetRef + '!' + colHighschool + '$2:' + colHighschool + '$1000,0))))';

    // ワークショップ参加人数 = 「参加する」にチェックした予約の合計チケット枚数
    var wsFormula =
      '=SUMPRODUCT((ISNUMBER(SEARCH("' + tab.keywords[1] + '",' + sheetRef + '!' + colStage + '$2:' + colStage + '$1000)))' +
      '*(' + sheetRef + '!' + tab.wsCol + '$2:' + tab.wsCol + '$1000="参加する")' +
      '*(VALUE(IFERROR(' + sheetRef + '!' + colGeneral + '$2:' + colGeneral + '$1000,0))' +
      '+VALUE(IFERROR(' + sheetRef + '!' + colStudent + '$2:' + colStudent + '$1000,0))' +
      '+VALUE(IFERROR(' + sheetRef + '!' + colHighschool + '$2:' + colHighschool + '$1000,0))))';

    stageSheet.getRange('A1').setValue('来場者合計');
    stageSheet.getRange('B1').setFormula(totalPeopleFormula + '&"人"');
    stageSheet.getRange('C1').setValue('ワークショップ参加');
    stageSheet.getRange('D1').setFormula(wsFormula + '&"人"');

    // 集計行のスタイル（G列まで拡張）
    var summaryRange = stageSheet.getRange('A1:G1');
    summaryRange.setBackground('#666666');
    summaryRange.setFontColor('#ffffff');
    summaryRange.setFontWeight('bold');
    summaryRange.setFontSize(11);

    // ----- 行2: 空白区切り -----
    // (空白のまま)

    // ----- 行3: ヘッダー -----
    stageSheet.getRange('A3:G3').setValues([['氏名', 'ふりがな', '一般', '学生', '高校生以下', 'ワークショップ', '備考']]);
    stageSheet.getRange('A3:G3').setBackground('#4a86e8');
    stageSheet.getRange('A3:G3').setFontColor('#ffffff');
    stageSheet.getRange('A3:G3').setFontWeight('bold');

    // ----- 行4〜: QUERYデータ（ワークショップ列を追加）-----
    var formula =
      '=IFERROR(' +
        'QUERY(' +
          sheetRef + '!A:' + lastColLetter + ',' +
          '"SELECT ' + colName + ',' + colFuri + ',' + colGeneral + ',' + colStudent + ',' + colHighschool + ',' + tab.wsCol + ',' + colNote + ' ' +
          'WHERE ' + whereClause + ' ' +
          'AND ' + colName + ' IS NOT NULL ' +
          'LABEL ' + colName + ' \'\', ' + colFuri + ' \'\', ' + colGeneral + ' \'\', ' + colStudent + ' \'\', ' + colHighschool + ' \'\', ' + tab.wsCol + ' \'\', ' + colNote + ' \'\'",' +
          '0' +
        '),' +
      ')';
    stageSheet.getRange('A4').setFormula(formula);

    // 列幅
    stageSheet.setColumnWidth(1, 150);
    stageSheet.setColumnWidth(2, 150);
    stageSheet.setColumnWidth(3, 55);
    stageSheet.setColumnWidth(4, 55);
    stageSheet.setColumnWidth(5, 80);
    stageSheet.setColumnWidth(6, 90);
    stageSheet.setColumnWidth(7, 280);

    Logger.log(tab.tabName + ': 更新完了');
    updatedStageTabs++;
  }

  // ===== 収入集計シートも修正 =====
  var revenueSheet = ss.getSheetByName('収入集計');
  if (revenueSheet) {
    var stageLabels = [
      '7月18日(土) 12:30〜　フェルト手芸の日！',
      '7月18日(土) 17:30〜　フェルト手芸の日！',
      '7月19日(日) 10:30〜　民族楽器コンサートの日！',
      '7月19日(日) 14:30〜　民族楽器コンサートの日！'
    ];
    // 実際の値で上書き
    var actualKeys = Object.keys(stageValuesFound);
    var labelKeywords = [['18','12:30'],['18','17:30'],['19','10:30'],['19','14:30']];
    for (var fl = 0; fl < labelKeywords.length; fl++) {
      for (var ak = 0; ak < actualKeys.length; ak++) {
        var allKwMatch = true;
        for (var kw = 0; kw < labelKeywords[fl].length; kw++) {
          if (actualKeys[ak].indexOf(labelKeywords[fl][kw]) === -1) { allKwMatch = false; break; }
        }
        if (allKwMatch) { stageLabels[fl] = actualKeys[ak]; break; }
      }
    }

    for (var k = 0; k < stageLabels.length; k++) {
      var row = k + 2;
      var sv = stageLabels[k];
      revenueSheet.getRange(row, 1).setValue(sv);
      var timeKeys = ['12:30', '17:30', '10:30', '14:30'];
      var tk = timeKeys[k];
      revenueSheet.getRange(row, 2).setFormula(
        '=SUMPRODUCT((ISNUMBER(SEARCH("' + tk + '",' + sheetRef + '!' + colStage + '$2:' + colStage + '$1000)))*(VALUE(IFERROR(' + sheetRef + '!' + colGeneral + '$2:' + colGeneral + '$1000,0))))');
      revenueSheet.getRange(row, 3).setFormula(
        '=SUMPRODUCT((ISNUMBER(SEARCH("' + tk + '",' + sheetRef + '!' + colStage + '$2:' + colStage + '$1000)))*(VALUE(IFERROR(' + sheetRef + '!' + colStudent + '$2:' + colStudent + '$1000,0))))');
      revenueSheet.getRange(row, 4).setFormula(
        '=SUMPRODUCT((ISNUMBER(SEARCH("' + tk + '",' + sheetRef + '!' + colStage + '$2:' + colStage + '$1000)))*(VALUE(IFERROR(' + sheetRef + '!' + colHighschool + '$2:' + colHighschool + '$1000,0))))');
      revenueSheet.getRange(row, 5).setFormula('=B' + row + '+C' + row + '+D' + row);
      revenueSheet.getRange(row, 6).setFormula('=B' + row + '*3000+C' + row + '*1000');
    }
    Logger.log('収入集計: 更新完了');
  }

  SpreadsheetApp.getUi().alert(
    '✅ 修正完了！\n\n' +
    '回答シート: ' + responseSheetName + '\n' +
    'ステージタブ更新: ' + updatedStageTabs + ' / ' + stages.length + '\n' +
    '収入集計: ' + (revenueSheet ? '更新済み' : 'シートなし') + '\n\n' +
    '各タブを確認してください。'
  );
}
