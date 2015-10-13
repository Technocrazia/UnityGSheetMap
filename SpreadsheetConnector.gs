function doGet(e)
{
  if (!Pass(e))
    return "Incorrect Password.";
    
  var result = ParseRequest(e);
 
  return result;
}

function Pass(e)
{
  var ss = SpreadsheetApp.openById(e.parameters.ssid);
  var sheet = ss.getSheetByName("passcode");
  var sheetPass = sheet.getDataRange().getValue();
  
  if (e.parameters.pass[0] == sheetPass)
    return true;
  else
    return false;
}

function ParseRequest(e)
{
  var result;

  if (e.parameters.action == "GetData")
    result = GetData(e);
  
  if (e.parameters.action == "SetData")
    result = SetData(e);
  
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function GetData(e)
{ 
  var o = QueryDataFromSS(e.parameters.ssid, e.parameters.sheet);
  
  return o;
}

function QueryDataFromSS(id, sheetName)
{
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName(sheetName);

  var dataRange = sheet.getDataRange().offset(1, 0, sheet.getDataRange().getNumRows()-1);
  var objects = getRowsData(sheet, dataRange);

  return objects;
}

function getRowsData(sheet, range, columnHeadersRowIndex)
{
  if (!columnHeadersRowIndex)
  {
    if (range.getRowIndex() - 1 != 0)
      columnHeadersRowIndex = range.getRowIndex() - 1;
    else
      columnHeadersRowIndex = 1;
  }
   
  var numColumns = range.getLastColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), headers);
}

function getObjects(data, keys)
{
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

function isCellEmpty(cellData)
{
  return typeof(cellData) == "string" && cellData == "";
}
