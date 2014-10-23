
function getBlackOrWhite(bgcolor) {
    return (Color(bgcolor).light() ? "#111" : "#eee");
}

function generateTranslateByCentroid(arc) {
    return function(d) {
       return "translate(" + arc.centroid(d) + ")";
    }
}
    
function renderCircle(toneName, toneTitle, toneData, gCircle) {
    var isVivid = toneName == 'v';
    var vividOrNonVivid = isVivid ? "vivid" : "non-vivid";
    
    var defaultOuterRadius = isVivid ? 160 : 90;
    var defaultInnerRadius = isVivid ? 100 : 50;
    
    var text = gCircle.append("text")
                .attr('y', "0.25em")
                .attr('class', 'tone-name ' + vividOrNonVivid)
                .text(toneName);
    
    var text = gCircle.append("text")
                .attr('y', "1.8em")
                .attr('class', 'tone-title ' + vividOrNonVivid)
                .text(toneTitle);
    
    var arc = d3.svg.arc()
                .outerRadius(defaultOuterRadius)
                .innerRadius(defaultInnerRadius);

    var arcSelected = d3.svg.arc()
                .outerRadius(defaultOuterRadius * 1.1)
                .innerRadius(defaultInnerRadius);
    
    var arcSelectForText = d3.svg.arc()
                .outerRadius(defaultOuterRadius * 1.1)
                .innerRadius(defaultInnerRadius * 1.05);
    
    // original: top = 0deg
    // intention: left = 270deg = (3/4 of circle)
    var chipCount, chipAngle, chipSkipCount;
    if (isVivid) {
        chipCount = 24;
        chipAngle = Math.PI * 2 / chipCount;
        chipSkipCount = chipCount / 4 * 3 - 1 - 0.5; // -1: 'v1' chip, -0.5: centering
    } else {
        chipCount = 12;
        chipAngle = Math.PI * 2 / chipCount;
        chipSkipCount = chipCount / 4 * 3 - 0.5;
    }
    
    var pie = d3.layout.pie()
                .startAngle(chipAngle * chipSkipCount)
                .endAngle(chipAngle * (chipSkipCount + chipCount))
                .sort(null)
                .value(function(d) { return 1; });

    var g = gCircle.selectAll('g')
       .data(pie(toneData))
       .enter()
       .append("g")
       .attr("class", "chip")
       .on('mouseover', function () {
         var parent = d3.select(this);
       
         parent.select("path")
               .transition()
               .duration(100)
               .attr("d", arcSelected);
    
         parent.selectAll("text")
               .transition()
               .duration(100)
               .attr("transform", generateTranslateByCentroid(arcSelectForText));
         
         parent.select(".color-value")
               .style("visibility", "visible");
       }).on('mouseout', function () {
          var parent = d3.select(this);
       
          parent.select("path")
                .transition()
                .duration(100)
                .attr("d", arc);
    
          parent.selectAll("text")
                .transition()
                .duration(100)
                .attr("transform", generateTranslateByCentroid(arc));
       
         parent.select(".color-value")
               .style("visibility", "hidden");
      });
    
    g.append("path")
     .attr("d", arc)
     .style("fill", function(d) { return d.data.color; } );

    g.append("text")
     .attr("transform", generateTranslateByCentroid(arc))
     .attr("dy", ".35em")
     .attr("class", "color-name " + vividOrNonVivid)
     .style("text-anchor", "middle")
     .style("fill", function(d) {
        return getBlackOrWhite(d.data.color);
      }).text(function(d) { return d.data.name; });
    
   g.append("text")
    .attr("transform", generateTranslateByCentroid(arc))
    .attr("dy", "1.35em")
    .attr("class", "color-value " + vividOrNonVivid)
    .style("text-anchor", "middle")
    .style("visibility", "hidden")
    .style("fill", function(d) {
       return getBlackOrWhite(d.data.color);
     }).text(function(d) { return d.data.color; });
}

function renderTone(toneName, toneTitle, svg, x, y, rows) {
    var prefix = toneName.replace(/\+/, '');
    var regex = new RegExp('^' + prefix + '\\d');
    
    var filteredRows = rows.filter(function(d) { return regex.exec(d.name); });
    
    var gCircle = svg.append("g")
        .attr("class", toneName == 'v' ? ".vivid" : ".non-vivid")
        .attr("transform", "translate(" + x + "," + y + ")");
    
    renderCircle(toneName, toneTitle, filteredRows, gCircle);
}

function renderNeutral(svg, x, y, rows) {
    var regex = /^(W|Bk|Gy-[\.0-9]*)$/;
    var filteredRows = rows.filter(function(d) { return regex.exec(d.name); });
    
    var gEntireRect = svg.append("g")
        .attr("class", "neutral")
        .attr("transform", "translate(" + x + "," + y + ")");
    
    var gRect = gEntireRect.selectAll("g")
                           .data(filteredRows)
                           .enter()
                           .append("g");
    
    gRect.on('mouseover', function () {
         d3.select(this)
           .select(".color-value")
           .style("visibility", "visible");
       }).on('mouseout', function () {
          d3.select(this)
            .select(".color-value")
            .style("visibility", "hidden");
      });
    
    gRect.append("rect")
         .attr('width', 60)
         .attr('height', 25)
         .attr('y', function (d, i) { return i * 47; } )
         .style('stroke', function (d) { return Color(d.color).luminosity() > 0.7 ? "#111" : "none" })
         .style('stroke-width', '1')
         .style("fill", function (d) { return d.color; });
    
    gRect.append("text")
        .attr('class', 'color-name neutral')
        .attr('width', 100)
        .attr('height', 30)
        .attr('x', 5)
        .attr('y', function (d, i) { return i * 47 + 12; } )
        .style("fill", function (d) { return getBlackOrWhite(d.color); })
        .text(function(d) { return d.name; } );
    
    gRect.append("text")
        .attr('class', 'color-value neutral')
        .attr('width', 100)
        .attr('height', 30)
        .attr('x', 5)
        .attr('y', function (d, i) { return i * 47 + 24; } )
        .style("visibility", "hidden")
        .style("fill", function (d) { return getBlackOrWhite(d.color); })
        .text(function(d) { return d.color; } );
}

var svg = d3.select("svg");

d3.csv("colors.csv")
  .get(function(error, rows) {
    renderTone("v", "vivid", svg, 970, 400, rows);
    
    renderTone("b", "bright", svg, 680, 190, rows);
    renderTone("s", "strong", svg, 680, 400, rows);
    renderTone("dp", "deep",  svg, 680, 610, rows);
    
    renderTone("lt+", "light", svg, 480, 100, rows);
    renderTone("sf", "soft",   svg, 480, 300, rows);
    renderTone("d", "dull",    svg, 480, 500, rows);
    renderTone("dk", "dark",   svg, 480, 700, rows);
    
    renderTone("p+", "pale",          svg, 270, 100, rows);
    renderTone("ltg", "lightgrayish", svg, 270, 300, rows);
    renderTone("g", "grayish",        svg, 270, 500, rows);
    renderTone("dkg", "darkgrayish",  svg, 270, 700, rows);
    
    renderNeutral(svg, 70, 12, rows);
});
    
