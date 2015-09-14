var hsv2rgb = function(h, s, v) {
  // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return '#' + rgb.map(function(x){
    return ("0" + Math.round(x*255).toString(16)).slice(-2);
  }).join('');
};

var colorQualityMaps = function() {
$(".qualitymap").each(function(index, element) {
  
  // If we already know the max, we can set it manually.
  
  // First, get all of the values, so we can find a max.
 var max = 0;
 $(element).find("td").each(function(index, element) {
   cur = parseFloat($(element).text());
   if (cur > max) {
     max = cur;
   }
 });
  
  // Next, set the background color proportionally 
  $(element).find("td").each(function(index, element) {
    cur = parseFloat($(element).text());
    var hue = 120 - Math.floor((max - cur) * 120 / max);
    //console.log("Hue is " + hue);
    $(element).css({
      backgroundColor: hsv2rgb(hue, 1, 1)
    });
  });
  
  
});
};

var createChart = function(selector, data) {
  var max = 0;
  data.forEach(function(entry) {
    if (max < entry['average']) {
      max = entry['average'];
    }
  });
  
  var chart = c3.generate({
  bindto: '.chart',
  data: {
    json: data,
    keys: {
      x: 'name',
      value: ['average']
    },
    type: 'bar',
    color: function(color, d) {
      //console.log(d);
      //console.log(max);
      var hue = 120 - Math.floor((max - d.value) * 120 / max);
    //console.log("Hue is " + hue);
      
      return hsv2rgb(hue, 1, 1);
    }
  },
  legend: {
    show: false
  },
  axis: {
    x: {
      type: 'category',
      label: {
        text: "Site",
        position: "outer-center"
      }
    },
    y: {
      label: {
        text: "Mbit/s",
        position: "outer-middle"
      }
    }
  }
});
}

// Create quality map 
var createQualityMap = function(data) {
  data.forEach(function(entry) {
    row = $("<tr></tr>");
    row.append($("<td></td>").text(entry.name));
    row.append($("<td></td>").text(entry.average.toFixed(0)));
    $("#averagequality").append(row);

  })

  colorQualityMaps();
}

var createLineChart = function(columns) {
  var line_chart = c3.generate({
    bindto: '#linechart',
    data: {
      x: 'x',
      xFormat: '%Y%m%d',
      columns: columns
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      }
    }
    
    
  });
  return line_chart;
  
}

// Recursive function to process all of the files in the index
var processFile = function(chartObj, listOfFiles, columns) {
  if (typeof columns !== "undefined" && columns !== null) {
      columns = new Array();
      columns[0].push('x');
  }
  
  curFile = listOfFiles.pop();
  
  $.ajax({
    url: '/data/' + curFile,
    type: 'GET',
    dataType: 'json',
    success: function(json) {
      // Format to the correct columns
      // Get the date from the file name
      date = curFile.split('-')[0];
      
      
      
      if (typeof chartObj !== "undefined" && chartObj !== null) {
        chartObj = createLineChart();
      } else {
        chartObj.load({
          
        });
      }
      
      processFile(chartObj, listOfFiles);
    }
    
  });
}

// On document ready
$(document).ready(function(){
  
  // Get the json index file
  $.ajax({
    url: '/data/index.json',
    type: 'GET',
    dataType: 'json',
    success: function(json) {
      // Now, we have the json.  Now, get the last file
      last_file = json.files[json.files.length-1];
      unformatted = last_file.replace(/\.[^/.]+$/, "");
      dateparts = unformatted.match(/(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/);
      toparse = dateparts[2] + "-" + dateparts[3] + "-" + dateparts[1] + " " + dateparts[4] + ":" + dateparts[5] + ":" + dateparts[6];
      date = new Date(Date.parse(toparse));
      
      
      $("#updatedat").text(date.toLocaleString());
      
      $.ajax({
        url: '/data/' + last_file,
        type: 'GET',
        dataType: 'json',
        success: function(json) {
          createQualityMap(json);
          createChart(".chart", json);
        }
      })

    }
  })
  
  
});
