function myFunction1() {
//完成2
//スプレッドシートを取得、シートを取得
//①コンテンツ管理シートのURL（https://docs.google.com/spreadsheets/d/1UCbxv57IAa4SN97fXL4R0vZyMTrGN6L-pj9VU_uZwG4/edit）とタブ名を記載する

var url = "https://docs.google.com/spreadsheets/d/1UCbxv57IAa4SN97fXL4R0vZyMTrGN6L-pj9VU_uZwG4/edit";
var spreadsheet = SpreadsheetApp.openByUrl(url);
var sheet = spreadsheet.getSheetByName("メインシート");

//シートの最終行番号、最終列番号を取得（スプレッドシートに書き込まれている部分だけ取得）
  var startrow = 1;
  var startcol = 1;
  var lastrow = sheet.getLastRow();
  var lastcol = sheet.getLastColumn();
  var lastrow1 = lastrow + 1;

    Logger.log(lastrow); 
    Logger.log(lastrow1); 

//シート内データ取得
  var sheetdata = sheet.getSheetValues(startrow, startcol, lastrow1, lastcol);

//j の箇所をfor文で指定する　j=2から始まり、空白セルの場合はbreak。次に入力されているセルの行番号のみ続ける　<= lastrow j++
for(var j=2; j <= lastrow ; j++){

 var Fj = sheetdata[j][5];
 Logger.log(j); 
 Logger.log(Fj); 
  if(Fj !== ""){
  　　 continue;
  }

  fileName = sheetdata[j][2];

  if(fileName === ""){
  　　 continue;
  }
  Logger.log(fileName); 

  //コピー元となるファイルのURL：https://docs.google.com/document/d/1gZ-n1-bQMFy4DahufFaaAONwhockbMDIVTWoWdkX3mw/edit

  var fileId = '1gZ-n1-bQMFy4DahufFaaAONwhockbMDIVTWoWdkX3mw';

  //ファイル名が全角で打てないので全角変換
  fileName = fileName.replace(/[A-Za-z0-9]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
      });

  //コピー元のファイルを開く
  var newfile = DriveApp.getFileById(fileId);

  //コピーを作成。作成したコピーを参照。
  newfile = newfile.makeCopy(fileName);

  //コピー後のファイルの中身を書き換える
  //メインキーワードの自動入力
  var body = DocumentApp.openById(newfile.getId()).getBody();
  body.replaceText('■メインキーワード', '■メインキーワード\n' + fileName)

  //サブキーワードの自動入力 D列＝3列目
  var allsubkw ="";

    for(var i=j+1; i <= lastrow1; i++){
    Logger.log(i); 
    var di = sheetdata[i][3];

      if(di === ""){
       break;
      }
    allsubkw += di + "、";

    }
  var allsubkw2 = allsubkw.slice(0, -1);

  Logger.log(allsubkw2);
  body.replaceText('■サブキーワード', '■サブキーワード\n' + allsubkw2)

  //F3にドキュメントURLを記載する 
  var newfile_id = newfile.getId();
  Logger.log(newfile_id); 

  newfile_url = "https://docs.google.com/document/d/"+ newfile_id + "/edit"
  Logger.log(newfile_url); 

  //F3に新しく作ったURLを入力する
  sheet.getRange(j+1, 5+1).setValue(newfile_url);
  }
}