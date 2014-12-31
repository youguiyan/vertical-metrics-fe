function renderFlowPathChart(NdluData, veritical) {

    var containerWidth = 800;
    var containerHeight = 500;
    var circlePadding = 10;
    var centerCiccleR = 60;
    var maxCircleR = 80;
    var minCircleR = 30;
    var lineSize = 15;
    var _vertical = veritical[0].toLowerCase() + veritical.slice(1);

    var totalNum = _.reduce(_.values(NdluData.verticaldata), function(memo, num) {
        return memo + num;
    }, 0);
    var maxMetricNum = _.max(_.values(NdluData.verticaldata));
    var minMetricNum = _.min(_.values(NdluData.verticaldata));
    var maxCircleR = getRatioR(maxMetricNum);

    var linePointOffset = centerCiccleR / 2 * Math.sqrt(3);

    var linePointMap = {
        0: [containerWidth / 2, containerHeight / 2 - centerCiccleR],
        1: [containerWidth / 2 - linePointOffset, containerHeight / 2 - centerCiccleR / 2],
        2: [(containerWidth / 2) - centerCiccleR, containerHeight / 2],
        3: [(containerWidth / 2) - linePointOffset, containerHeight / 2 + centerCiccleR / 2],
        4: [containerWidth / 2, containerHeight / 2 + centerCiccleR]
    };

    function getRatioR(part) {
        return (part / totalNum) * ((containerHeight - 10 * 5) / 2);
    }

    function getTextWidthOffsize(txt, ren) {
        return ren.text(txt, -100, -100).add().getBBox().width * 0.5;
    }
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'flow-path-chart',
            events: {
                load: function() {

                    // Draw the flow chart
                    var ren = this.renderer,
                        colors = Highcharts.getOptions().colors,
                        rightArrow = ['M', 0, 0, 'L', 10, 0, 'L', 5, 5, 'M', 10, 0, 'L', 5, -5],
                        leftArrow = ['M', 100, 0, 'L', 0, 0, 'L', 5, 5, 'M', 0, 0, 'L', 5, -5];

                    // circle @ center
                    ren.circle(containerWidth / 2, containerHeight / 2, centerCiccleR).attr({
                        fill: 'green',
                        stroke: 'black',
                        'stroke-width': 1
                    }).add();

                    var _centerLabel = veritical + '<br>' + NdluData.verticaldata[_vertical];
                    ren.label(_centerLabel, containerWidth / 2 - getTextWidthOffsize(_centerLabel, ren), containerHeight / 2 - lineSize).css({
                        fontWeight: 'bold'
                    }).add();

                    var lastCircleY = 0;
                    var i = 0;
                    var _leftLabel;
                    _.each(NdluData.verticaldata, function(val, key) {
                        if (key == _vertical) return;
                        var r = getRatioR(val);
                        // left circle
                        ren.circle(maxCircleR, lastCircleY + r, r).attr({
                            fill: colors[i],
                            stroke: '#fff',
                            'stroke-width': 1
                        }).add();

                        _leftLabel = key + '<br>' + val;
                        ren.label(_leftLabel, maxCircleR - getTextWidthOffsize(_leftLabel, ren), lastCircleY + r - lineSize).css({
                            fontWeight: 'bold'
                        }).add();

                        // line - circleR
                        ren.path(['M', maxCircleR + r, lastCircleY + r, 'L', linePointMap[i][0], lastCircleY + r, 'L', linePointMap[i][0], linePointMap[i][1]]).attr({
                            'stroke-width': 2,
                            stroke: 'silver',
                            dashstyle: 'dash'
                        }).add();

                        // arrow for line
                        ren.path(rightArrow)
                            .attr({
                                'stroke-width': 2,
                                stroke: colors[i]
                            })
                            .translate((maxCircleR + r + containerWidth / 2) / 2.5, lastCircleY + r)
                            .add();

                        // 数字@line
                        ren.label(NdluData.verticalbringdata[key], (maxCircleR + r + containerWidth / 2) / 2, lastCircleY + r - lineSize).css({
                            fontWeight: 'bold'
                        }).add();

                        lastCircleY += r * 2 + circlePadding;
                        i += 1;
                    });
                }
            }
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        }
    });
}
window.renderFlowPathChart = renderFlowPathChart;