console.log('Convering stock_data into js form');
var rows = [];
for (var i = 0, len = window.stock_data.length; i < len; i+=1) {
    var entry = window.stock_data[i];
    var date_value = new Date(0);
    date_value.setUTCSeconds(entry['date']);
    y_value = entry['open'];
    rows.push([date_value, y_value]);
};

console.log('Convering annotation_data into js form');
var annotations = [];
for (var i = 0, len = window.annotation_data.length; i < len; i+=1) {
    var entry = window.annotation_data[i];
    var date_value = new Date(0);
    date_value.setUTCSeconds(entry['date']);
    entry['date'] = date_value;
    annotations.push(entry);
};


// Using Google's Annotation Chart  https://developers.google.com/chart/interactive/docs/gallery/annotationchart
google.load('visualization', '1', {'packages':['annotationchart', 'corechart']});
google.setOnLoadCallback(draw_charts);



function draw_charts() {
    draw_stock_prices_chart();
}
function draw_stock_prices_chart() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Stock price');
    data.addRows(rows);

    var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'));

    var options = {
        displayAnnotations: false
    };

    chart.draw(data, options);

    google.visualization.events.addListener(chart, 'rangechange', rangechange_handler);

    function rangechange_handler(e) {
        console.log('You changed the range to ', e['start'], ' and ', e['end']);

        var accepted_annotations = _.filter(annotations, function(annotation, i) {
            return annotation['date'] >= e['start'] && annotation['date'] <= e['end']}
        );
        console.log('accepted_annotations = ', accepted_annotations);
        update_annotation_info(accepted_annotations, e);
    }

    // draw all annotations
    update_annotations(annotations);
}

function update_annotation_info(accepted_annotations, time_range) {
    update_annotations(accepted_annotations);
    draw_stock_annotation_markers(accepted_annotations, time_range);
}

function update_annotations(accepted_annotations) {
    $('#number_of_annotations').html(accepted_annotations.length);
    var $annotations_el = $('#annotations');
    var annotations_html = '';
    for (var i=0, len=accepted_annotations.length; i < len; i+=1) {
        var annotation = accepted_annotations[i];
        annotations_html += (
            '<tr><td>'+annotation['text']+
            '</td><td>'+annotation['z_value']+
            '</td><td>'+annotation['z_attenuation']+
            // '</td><td><a href="'+annotation['annotation_url']+'" rel="lightbox" title="'+annotation['text']+'"></a>'+
            '</td><td><a href="'+annotation['annotation_url']+'"><img src="'+annotation['annotation_url']+'shared_image.png"></img></a>'+
            '</td></tr>'
        );
    }
    $annotations_el.html(annotations_html);
}

function draw_stock_annotation_markers(accepted_annotations, time_range) {
    // Divide annotation_chart_div into buckets
    var $el = $('#annotation_chart_div');
    var width_of_bucket = 20;
    var number_of_buckets = $el.width()/width_of_bucket;
    var time_start = time_range['start'].getTime();
    var width_of_time = time_range['end'].getTime() - time_start;

    var buckets = new Array(parseInt(number_of_buckets, 10));
    for (var i = 0, len = accepted_annotations.length; i < len; i+=1) {
        var annotation = accepted_annotations[i];
        var diff = annotation['date'].getTime() - time_start;
        var bucket_number = Math.floor((diff/width_of_time)*number_of_buckets, 10);
        if (buckets[bucket_number]) {
            buckets[bucket_number] += 1;
        } else {
            buckets[bucket_number] = 1;
        }
    };
    var annotation_marker_html = '';
    for (var i = 0, len = buckets.length; i < len; i+=1) {
        if(buckets[i]) {
            annotation_marker_html += '<div class="annotation_marker present" style="left: '+(i*width_of_bucket)+'px;">'+buckets[i]+'</div>';
        }
    };
    $el.html(annotation_marker_html);
}
