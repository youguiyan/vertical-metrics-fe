function renderFlowPathChart(NdluData, veritical) {

    var containerWidth = 800;
    var containerHeight = 500;
    var circlePadding = 10;
    var centerCiccleR = 60;
    var maxCircleR = 80;
    var minCircleR = 30;

    var totalNum = _.reduce(_.values(NdluData.verticaldata), function(memo, num) {
        return memo + num;
    }, 0);
    var maxMetricNum = _.max(_.values(NdluData.verticaldata));
    var minMetricNum = _.min(_.values(NdluData.verticaldata));
    var maxCircleR = getRatioR(maxMetricNum);


    function getRatioR(part) {
        return (part / totalNum) * ((containerHeight - 10 * 5) / 2);
    }
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'flow-path-chart',
            events: {
                load: function() {

                    // Draw the flow chart
                    var ren = this.renderer,
                        colors = Highcharts.getOptions().colors,
                        rightArrow = ['M', 0, 0, 'L', 100, 0, 'L', 95, 5, 'M', 100, 0, 'L', 95, -5],
                        leftArrow = ['M', 100, 0, 'L', 0, 0, 'L', 5, 5, 'M', 0, 0, 'L', 5, -5];

                    // circle @ center
                    ren.circle(containerWidth / 2, containerHeight / 2, centerCiccleR).attr({
                        fill: 'green',
                        stroke: 'black',
                        'stroke-width': 1
                    }).add();

                    ren.label(veritical + '<br>New User<br>' + totalNum, containerWidth / 2, containerHeight / 2).css({
                        fontWeight: 'bold'
                    }).add();

                    var lastCircleY = 0;
                    var i = 0;
                    _.each(NdluData.verticaldata, function(val, key) {
                        var r = getRatioR(val);
                        ren.circle(maxCircleR, lastCircleY + r, r).attr({
                            fill: colors[i],
                            stroke: '#fff',
                            'stroke-width': 1
                        }).add();
                        ren.label(key + '<br>' + val, maxCircleR, lastCircleY + r).css({
                            fontWeight: 'bold'
                        }).add();

                        ren.path(['M', maxCircleR + r, lastCircleY + r, 'L', containerWidth / 2, containerHeight / 2]).attr({
                            'stroke-width': 2,
                            stroke: 'silver',
                            dashstyle: 'dash'
                        })
                            .add();

                        ren.label(NdluData.verticalbringdata[key], (maxCircleR + r + containerWidth / 2) / 2, (lastCircleY + r + containerHeight / 2) / 2).css({
                            fontWeight: 'bold'
                        }).add();

                        /*ren.path(rightArrow)
                             .attr({
                                 'stroke-width': 2,
                                 stroke: colors[1]
                             })
                            .translate((maxCircleR+r+containerWidth/2)/1.5, (lastCircleY+r+containerHeight/2)/1.5)
                             .add();*/

                        lastCircleY += r * 2 + circlePadding;
                        i += 1;
                    });
                }
            }
        },
        exporting: {
            enabled: true
        },
        title: {
            text: ''
        }
    });
}
window.renderFlowPathChart = renderFlowPathChart;