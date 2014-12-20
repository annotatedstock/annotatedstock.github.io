function start(){
    makeControls();
    getData();
    document.getElementById('link1').click();
}

function makeControls() {
    [
        {'label': '1d', 'url': 'b?s='},
        {'label': '5d', 'url': 'w?s='},
        {'label': '3m', 'url': 'c/3m/y/'},
        {'label': '6m', 'url': 'c/6m/y/'},
        {'label': '1y', 'url': 'c/1y/y/'},
        {'label': '2y', 'url': 'c/2y/y/'},
        {'label': '5y', 'url': 'c/5y/y/'},
        {'label': 'max', 'url': 'c/my/y/'},
    ]
}

function getData() {
var url = "http://query.yahooapis.com/v1/public/yql";
var symbol = $("#symbol").val();
var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

$.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
    .done(function (data) {

         $("#name").text("Bid Price: " + data.query.results.quote.Symbol);
         $("#date").text("Bid Price: " + data.query.results.quote.Date);
         $("#time").text("Bid Price: " + data.query.results.quote.LastTradeTime);
         $("#result").text("Bid Price: " + data.query.results.quote.LastTradePriceOnly);
         $("#chg").text("Bid Price: " + data.query.results.quote.PercentChange);
         $("#bid").text("Bid Price: " + data.query.results.quote.LastTradePriceOnly);
         $("#ask").text("Bid Price: " + data.query.results.quote.Ask);
         $("#volume").text("Bid Price: " + data.query.results.quote.Volume);
         $("#high").text("Bid Price: " + data.query.results.quote.HighLimit);
         $("#low").text("Bid Price: " + data.query.results.quote.LowLimit);

         if(data.query.results.quote.PercentChange.indexOf("+") != -1){

            document.getElementById("chg").className = "greenText";
        }
         else{
            //alert(data.query.results.quote.PercentChange);

            document.getElementById("chg").className = "redText";
        }

}).fail(function (jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
        $("#result").text('Request failed: ' + err);
});
}
function SendRequest()
{

    getData();
    document.getElementById('link1').click();
}

function CheckEnter(e)
{
    if ((e.keyCode && e.keyCode==13) || (e.which && e.which==13)) {
        return SendRequest();
    }
    return true;
}

function changeChart(select)
{
    var symbol = $("#symbol").val() || 'yhoo';
    var stockChart = document.getElementById("stockChart");

    var rand_no = Math.random();
    rand_no = rand_no * 100000000;
    switch(select)
    {
    case 0:
        stockChart.src = "http://ichart.finance.yahoo.com/b?s="+symbol+"&"+rand_no;
        //http://chart.finance.yahoo.com/t?s=YHOO&width=450&height=270
        break;
    case 1:
        stockChart.src = "http://ichart.finance.yahoo.com/w?s="+symbol+"&"+rand_no;
        break;
    case 2:
        stockChart.src = "http://chart.finance.yahoo.com/c/3m/y/"+symbol+"?"+rand_no;
        break;
    case 3:
        stockChart.src = "http://chart.finance.yahoo.com/c/6m/y/"+symbol+"?"+rand_no;
        break;
    case 5:
        stockChart.src = "http://chart.finance.yahoo.com/c/2y/y/"+symbol+"?"+rand_no;
        break;
    case 6:
        stockChart.src = "http://chart.finance.yahoo.com/c/5y/y/"+symbol+"?"+rand_no;
        break;
    case 7:
        stockChart.src = "http://chart.finance.yahoo.com/c/my/y/"+symbol+"?"+rand_no;
        break;
    case 4:
    default:
        //div1y.innerHTML="<b>1y</b>";
        stockChart.src = "http://chart.finance.yahoo.com/c/1y/y/"+symbol+"?"+rand_no;
        break;
    }
}