

function parse_prices(response) {
    /*
    // Sample data:

    EXCHANGE%3DINDEXDJX
    MARKET_OPEN_MINUTE=570
    MARKET_CLOSE_MINUTE=960
    INTERVAL=60
    COLUMNS=DATE,CLOSE,HIGH,LOW,OPEN,VOLUME
    DATA=
    TIMEZONE_OFFSET=-300
    a1418049060,17923.09,17954.94,17923.09,17954.94,0
    1,17897.79,17922.64,17896.02,17922.64,0
    2,17901,17905.05,17899.84,17901.38,0
    3,17908.7,17909.55,17898.88,17901.45,0
    4,17915.64,17917.98,17904.63,17908.74,0
    */
    function get_as_num(key) {
        var regexp = new RegExp(key+'=(-?\\d+)');
        var str = regexp.exec(response)[1];
        return parseInt(str, 10);
    }

    var market_open_minute = get_as_num('MARKET_OPEN_MINUTE');
    var market_close_minute = get_as_num('MARKET_CLOSE_MINUTE');
    var interval = get_as_num('INTERVAL');
    var timezone_offset = get_as_num('TIMEZONE_OFFSET');

    var timezone_regexp = new RegExp('TIMEZONE_OFFSET=(-?\\d+)\\s', 'g');
    resp = timezone_regexp.exec(response);
    var data_start = timezone_regexp.lastIndex;
    response = response.slice(data_start);
    var data = [];
    var data_by_time = {};

    function extract_values(match) {
        var result = {
            'close': parseInt(match[2], 10),
            'high': parseInt(match[3], 10),
            'low': parseInt(match[4], 10),
            'open': parseInt(match[5], 10),
            'volume': parseInt(match[6], 10),
        }
        return result;
    }

    var day_regex = new RegExp('^([a-zA-Z]\\d+),([.\\d]+),([.\\d]+),([.\\d]+),([.\\d]+),([.\\d]+)$', 'mg');
    var entry_regex = new RegExp('^(\\d+),([.\\d]+),([.\\d]+),([.\\d]+),([.\\d]+),([.\\d]+)$');
    var day_match = day_regex.exec(response);
    var drop_data = 10; // set this to 1 to drop no data.  A value of 10 will drop 90% of data, 100, will drop 99%.
    while(day_match){
        var entry = extract_values(day_match);
        entry['day_boundary'] = true;
        var total_seconds = parseInt(day_match[1].slice(1));
        entry['date'] = total_seconds;
        // data.push(entry);  // Currently we also drop the day data

        var entries_regex = new RegExp('[^a-zA-Z]*', 'mg');
        entries_regex.lastIndex = day_regex.lastIndex;
        var entries_str = entries_regex.exec(response)[0];
        var entries = entries_str.split('\n');
        for (var i = 0, len = entries.length; i < len; i++) {
            var entry_str = entries[i];
            if (!entry_str) {
                continue;
            }
            var entry_match = entry_str.match(entry_regex);
            var entry = extract_values(entry_match);
            entry['date'] = total_seconds + (parseInt(entry_match[1], 10) + market_open_minute + timezone_offset)*60;
            if(i%drop_data==0){
                data.push(entry);
            }
            // data_by_time[entry['date']] = entry;
        };


        var day_match = day_regex.exec(response);
    }
    parsed = {
        market_open_minute: market_open_minute,
        market_close_minute: market_close_minute,
        interval: interval,
        timezone_offset: timezone_offset,
        data: data,
        data_by_time: data_by_time,
    }
    return parsed;
}

function get_prices(ticker, exchange, interval, period) {
    interval = '60';
    period = '10d';
    var deferred = $.Deferred();
    var url = 'http://www.google.com/finance/getprices?q='+ticker+'&x='+exchange+'&i='+interval+'&p='+period+'&f=d,c,h,l,o,v';
    var request = $.get(url);
    console.log('Requesting: ', url);
    request.done(function(response) {
        deferred.resolve(parse_prices(response));
    });
    return deferred;
}

