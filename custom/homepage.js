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

var max_age = 3;
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
    var age = $(element).data('age');
    // At 3 days old test, make the color translucent
    var sat = (max_age - Math.min(max_age, age)) / max_age;
    $(element).css({
      backgroundColor: hsv2rgb(hue, sat, 1)
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
  bindto: selector,
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
return chart;
}

// Create quality map 
var createQualityMap = function(data) {
  data.forEach(function(entry) {
    row = $("<tr></tr>");
    row.append($("<td></td>").text(entry.name));
    row.append($("<td class='values' data-age='"+ entry.age + "'></td>").text(entry.average.toFixed(0)));
    
    
    if (entry.age == 1) {
      row.data('toggle', "tooltip");
      row.attr('title', "Successful test last conducted " + entry.age + " day ago.");
      row.tooltip();
    } else if (entry.age > 1) {
      row.data('toggle', "tooltip");
      row.attr('title', "Successful test last conducted " + entry.age + " days ago.");
      row.tooltip();
    }
    
    
    row.click(function() {
      $(document).trigger('focusSite', [entry.name]);
      // Remove all the other info classes.
      $(this).siblings().removeClass("info");
      $(this).addClass("info");
    })
    $("#averagequality").append(row);

  })

  colorQualityMaps();
}

var createLineChart = function(jsondata) {
  
  // Get and sort the keys
keys = Object.keys(jsondata);
keys.sort();
columns = new Array();
columns[0] = ['x'];
index = {'x': 0}
index_counter = 0;

for (idx in keys) {
  key = keys[idx];
  columns[0].push(key);
    for (obj in jsondata[key]) {
      obj = jsondata[key][obj];
      // If it hasn't seen the site before, add it.
      if (!index.hasOwnProperty(obj.name)) {
        index_counter+=1;
        columns[index_counter] = new Array();
        columns[index_counter][0] = obj.name;
        index[obj.name] = index_counter;
        
      }
      
      // Extend the column to mactch the number of columns in the x attribute
      while(columns[index[obj.name]].length < (columns[0].length-1)) {
          columns[index[obj.name]].push(null);
      }
      
      // Add the data to the column
      obj.average = obj.average.toFixed(0);
      if (obj.average == 0)
        obj.average = null;
      columns[index[obj.name]].push(obj.average);
    }
    
    
  }
  
  // Loop through the columns, make sure they are all the same length
  for (idx in columns) {
    while(columns[idx].length < columns[0].length) {
        columns[idx].push(null);
    }
  }
  
  
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
        },
        label: {
          text: "Date",
          position: "outer-center"
        }
      },
      y: {
        label: {
          text: "Mbit/s",
          position: "outer-middle"
        }
      }
    },
    padding: {
      right: 20
    }
    
    
  });
  return line_chart;
  
}

var insertOldData = function(json) {
  // First, clone the json 
  new_json = JSON.parse(JSON.stringify(json))
  
  keys = Object.keys(new_json);
  keys.sort();
  last_key = keys[keys.length-1];
  
  new_json[last_key].forEach(function(entry, index, array) {
    
    // If the test is 0, then go back in time to find the last test
    if (entry.average == 0) {
      var backCounter = keys.length - 1;
      // Backwards through time!
      while (backCounter >= 0) {
        // Get the element we are looking for in the array
        var new_entry = new_json[keys[backCounter]].filter(function(obj) {
          return obj.name == entry.name;
        });
        if (new_entry[0].average != 0) {
          entry = new_entry[0];
          break;
        } else {
          backCounter -= 1;
          continue;
        }
      }
      
      // If we never found a positive test, then say that.
      if (backCounter < 0) {
        entry['age'] = Infinity;
        array[index] = entry;
      } else {
        entry['age'] = (keys.length-1) - backCounter;
        array[index] = entry;
      }
    } else {
      entry['age'] = 0;
      array[index] = entry;
    }
  });
  
  
  
  return new_json;
}


// On document ready
$(document).ready(function(){
  
  // Get the json index file
  $.ajax({
    url: '/data/data.json',
    type: 'GET',
    dataType: 'json',
    success: function(json) {
      // Now, we have the json.  Now, get the last date
      
      // Get the keys and sort them
      keys = Object.keys(json);
      keys.sort();
      last_key = keys[keys.length-1];
      
      new_json = insertOldData(json);
      createQualityMap(new_json[last_key]);
      var bar_chart = createChart(".chart", new_json[last_key]);
      
      var line_chart = createLineChart(json);
      
      $(document).on('focusSite', function(event, focusId) {
        // Bar chart cannot be focused
        //bar_chart.focus(focusId);
        line_chart.focus(focusId);
        
      });
      
      /*
      last_file = json.files[json.files.length-1];
      unformatted = last_file.replace(/\.[^/.]+$/, "");
      dateparts = unformatted.match(/(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/);
      toparse = dateparts[2] + "-" + dateparts[3] + "-" + dateparts[1] + " " + dateparts[4] + ":" + dateparts[5] + ":" + dateparts[6];
      date = new Date(Date.parse(toparse));
      
      
      $("#updatedat").text(date.toLocaleString());
      */
    }
  })
  
  
});
