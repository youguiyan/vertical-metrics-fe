(function() { angular.module('app.templates', []).run(['$templateCache',function($templateCache) {  'use strict';

  $templateCache.put('templates/_base/header.html',
    "<header class=\"navbar navbar-static-top\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "          <a href=\"../\" class=\"navbar-brand\">找数据 - Wandoulabs</a>\n" +
    "        </div>\n" +
    "\n" +
    "        <ul class=\"nav navbar-nav mainnav-menu\">\n" +
    "          <li ui-sref-active=\"active\">\n" +
    "            <a ui-sref=\"corp\">Corp Metrics</a>\n" +
    "          </li>\n" +
    "          <li ui-sref-active=\"active\">\n" +
    "            <a ui-sref=\"vertical\">Vertical Metrics</a>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</header>"
  );


  $templateCache.put('templates/_base/top-opbar.html',
    "<div class=\"top-opbar\">\n" +
    "    <label>\n" +
    "        是否作弊\n" +
    "        <select name=\"isCheat\" id=\"isCheat\" ng-model=\"dimension.isCheat\"\n" +
    "            ng-options=\"i[0] as i[1] for i in isCheatOptions\"></select>\n" +
    "    </label>\n" +
    "\n" +
    "    <label>\n" +
    "        新老用户\n" +
    "        <select name=\"isNewUser\" id=\"isNewUser\" ng-model=\"dimension.isNewUser\"\n" +
    "            ng-options=\"i[0] as i[1] for i in isNewUserOptions\"></select>\n" +
    "    </label>\n" +
    "\n" +
    "    <div data-toggle=\"buttons-radio\" class=\"btn-group\">\n" +
    "        <button class=\"btn\" type=\"button\"\n" +
    "            ng-class=\"{'active': $parent.timespan==i[0]}\"\n" +
    "            ng-click=\"$parent.timespan=i[0];\"\n" +
    "            ng-repeat=\"i in timespanOptions\">\n" +
    "            {{i[1]}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"input-append datepicker\">\n" +
    "        <input class=\"date-picker\" type=\"text\" />\n" +
    "        <span class=\"add-on\">\n" +
    "            <i class=\"icon-calendar\"></i>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/corp/index.html',
    "<!-- start: Content -->\n" +
    "<div class=\"main\" style=\"padding: 80px;\">\n" +
    "    <!-- <div muce-include=\"templates/_base/top-opbar.html\"></div> -->\n" +
    "    <div class=\"top-opbar\">\n" +
    "        <label>\n" +
    "            是否作弊\n" +
    "            <select name=\"isCheat\" id=\"isCheat\" ng-model=\"dimension.isCheat\"\n" +
    "                ng-options=\"i[0] as i[1] for i in isCheatOptions\"></select>\n" +
    "        </label>\n" +
    "\n" +
    "        <label>\n" +
    "            新老用户\n" +
    "            <select name=\"isNewUser\" id=\"isNewUser\" ng-model=\"dimension.isNewUser\"\n" +
    "                ng-options=\"i[0] as i[1] for i in isNewUserOptions\"></select>\n" +
    "        </label>\n" +
    "        <div class=\"input-append datepicker\">\n" +
    "            <input class=\"date-picker\" type=\"text\" />\n" +
    "            <span class=\"add-on\">\n" +
    "                <i class=\"icon-calendar\"></i>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "        <div data-toggle=\"buttons-radio\" class=\"btn-group\">\n" +
    "            <button class=\"btn\" type=\"button\"\n" +
    "                ng-class=\"{'active': $root.timespan==i[0]}\"\n" +
    "                ng-click=\"$root.timespan=i[0];\"\n" +
    "                ng-repeat=\"i in timespanOptions\">\n" +
    "                {{i[1]}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- metric card -->\n" +
    "    <div ng-include=\"'templates/corp/top-metrics-row.html'\"\n" +
    "        ng-controller=\"bunchMetricsOneCtrl\"></div>\n" +
    "\n" +
    "    <!-- chart + metric card -->\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-9\">\n" +
    "            <div ng-include=\"'templates/corp/main-chart-panel.html'\"\n" +
    "                ng-controller=\"mainChartCtrl\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-lg-3 col-sm-6\">\n" +
    "            <div ng-include=\"'templates/corp/side-metrics-column.html'\"\n" +
    "                ng-controller=\"bunchMetricsTwoCtrl\"></div>\n" +
    "        </div>\n" +
    "    </div><!--/row-->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-8\" style=\"width: 64%;\">\n" +
    "            <div ng-include=\"'templates/corp/new-user-retention-table.html'\"\n" +
    "                ng-controller=\"newUserRetentionTblCtrl\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-4\" style=\"width: 36%;\">\n" +
    "            <div ng-include=\"'templates/corp/new-user-1th-week.html'\"\n" +
    "                ng-controller=\"newUser1thWeeklCtrl\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/corp/main-chart-panel.html',
    "<div class=\"panel panel-default\">\n" +
    "\n" +
    "    <div class=\"panel-heading\" style=\"background: none;\">\n" +
    "        <i class=\"icon-bar-chart\"></i>\n" +
    "        <!-- <h2>Traffic &amp; Revenue</h2> -->\n" +
    "        <h2>{{chartLabels|joinArr}} / {{getDimensionDesp()}}</h2>\n" +
    "        <div id=\"daterange\" class=\"selectbox pull-right hidden-xs\">\n" +
    "            <i class=\"icon-calendar\"></i>\n" +
    "            <span>July 4, 2014 - August 2, 2014</span> <b class=\"caret\"></b>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div id=\"main-chart\" style=\"height:390px\"></div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/corp/new-user-1th-week.html',
    "<div class=\"portlet\">\n" +
    "    <h4 class=\"portlet-title\">\n" +
    "        <u>{{name}}</u>\n" +
    "    </h4>\n" +
    "    <div class=\"portlet-body\">\n" +
    "        <table class=\"table table-bordered table-striped\">\n" +
    "            <thead>\n" +
    "                <tr>\n" +
    "                    <th ng-repeat=\"i in header\">\n" +
    "                        {{i}}\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-repeat=\"row in data\">\n" +
    "                    <td ng-repeat=\"cell in row track by $index\">\n" +
    "                        <span ng-show=\"cell\">\n" +
    "                            {{($index == 0) ? (cell|dateFormat) : (cell|percentize)}}\n" +
    "                        </span>\n" +
    "                        <span ng-show=\"!cell\"></span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/corp/new-user-retention-table.html',
    "<div class=\"portlet\">\n" +
    "    <h4 class=\"portlet-title\"><u>{{name}}</u></h4>\n" +
    "    <div class=\"portlet-body\">\n" +
    "        <table class=\"table table-bordered table-striped\">\n" +
    "            <thead>\n" +
    "                <tr>\n" +
    "                    <th ng-repeat=\"i in header\">\n" +
    "                        {{i}}\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-repeat=\"row in data\">\n" +
    "                    <td ng-repeat=\"cell in row track by $index\">\n" +
    "                        <span ng-show=\"cell\">\n" +
    "                            {{($index == 0) ? (cell|dateFormat) : (cell|percentize)}}\n" +
    "                        </span>\n" +
    "                        <span ng-show=\"!cell\"></span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/corp/side-metrics-column.html',
    "<div class=\"metric-card-list\">\n" +
    "    <div class=\"panel panel-default inline-metric-card metric-card\"\n" +
    "        ng-repeat=\"i in metricList|filter:{type: 'two'}\" ng-switch on=\"i.metrictype\"\n" +
    "        ng-click=\"toggleSelect(i)\" ng-class=\"{'selected': i.selected}\">\n" +
    "\n" +
    "        <div class=\"inline-chart-body\" ng-switch-when=\"origin\">\n" +
    "            <div sparkline width=\"160\" height=\"64\" data=\"sdLineChartMap[i.metricid]\"></div>\n" +
    "            <div class=\"inline-chart-metric\">\n" +
    "                <span>{{i.data[0]|number}}</span>\n" +
    "                <span>{{i.metricname}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"ctr-footer\" ng-switch-when=\"ratio\">\n" +
    "            <span>{{i.metricname}}%</span>\n" +
    "            <span class=\"pull-right\">{{i.data[0]|percentize}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/corp/top-metrics-row.html',
    "<ul class=\"metric-card-list\">\n" +
    "    <li class=\"metric-card\" ng-repeat=\"i in metricList | filter:{type: 'one'} \"\n" +
    "        ng-click=\"toggleSelect(i)\" ng-class=\"{'selected': i.selected}\">\n" +
    "        <i class=\"icon-users\"></i>\n" +
    "        <div class=\"number\">\n" +
    "            {{i.data[0]|number}}\n" +
    "            <i class=\"fa trend\" ng-class=\"{'fa-level-up': (+i.data[1]), 'fa-level-down':(-(+i.data[1]))}\"></i>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <div class=\"title\">{{i.metricname}}</div>\n" +
    "            <div class=\"contrast\">\n" +
    "                <p> 环比：<span>{{i.data[1]|percentize}}</span></p>\n" +
    "                <p ng-if=\"i.data[2]\"> 同比：<span>{{i.data[2]|percentize}}</span></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>"
  );


  $templateCache.put('templates/vertical/index.html',
    "<!-- start: Content -->\n" +
    "<div class=\"main\" style=\"padding: 80px;background: #fff;\">\n" +
    "    <div class=\"top-opbar\">\n" +
    "        <label>\n" +
    "            是否作弊\n" +
    "            <select name=\"isCheat\" id=\"isCheat\" ng-model=\"dimension.isCheat\"\n" +
    "                ng-options=\"i[0] as i[1] for i in isCheatOptions\"></select>\n" +
    "        </label>\n" +
    "\n" +
    "        <label>\n" +
    "            新老用户\n" +
    "            <select name=\"isNewUser\" id=\"isNewUser\" ng-model=\"dimension.isNewUser\"\n" +
    "                ng-options=\"i[0] as i[1] for i in isNewUserOptions\"></select>\n" +
    "        </label>\n" +
    "\n" +
    "        <div data-toggle=\"buttons-radio\" class=\"btn-group\">\n" +
    "            <button class=\"btn\" type=\"button\"\n" +
    "                ng-class=\"{'active': $parent.timespan==i[0]}\"\n" +
    "                ng-click=\"$parent.timespan=i[0];\"\n" +
    "                ng-repeat=\"i in timespanOptions\">\n" +
    "                {{i[1]}}\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"input-append datepicker\">\n" +
    "            <input class=\"date-picker\" type=\"text\" />\n" +
    "            <span class=\"add-on\">\n" +
    "                <i class=\"icon-calendar\"></i>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- chart + metric card -->\n" +
    "    <div class=\"row\" ng-controller=\"verticalTableCtrl\">\n" +
    "        <table class=\"table table-bordered vertical-metrics-table\"\n" +
    "            style=\"min-height: 434px;\">\n" +
    "            <thead>\n" +
    "                <tr>\n" +
    "                    <th ng-repeat=\"i in names track by $index\">\n" +
    "                        {{i}}\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-repeat=\"row in data track by $index\"\n" +
    "                    ng-click=\"openPopup(row)\">\n" +
    "                    <td ng-repeat=\"cell in row track by $index\" ng-switch on=\"types[$index]\">\n" +
    "                        <span ng-switch-when=\"line\" sparkline data=\"getLineData(row)\"></span>\n" +
    "                        <span ng-switch-when=\"ratio\">{{cell}}</span>\n" +
    "                        <span ng-switch-when=\"origin\">{{cell|number}}</span>\n" +
    "                        <span ng-switch-default>{{cell}}</span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div><!--/row-->\n" +
    "\n" +
    "    <div class=\"row\" style=\"text-align:center\">\n" +
    "        <!-- replace with datav and d3 chord diy -->\n" +
    "        <img src=\"images/fake-NDLU.png\" width=\"750\">\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/vertical/popup.html',
    "<div class=\"portlet popup-metrics-table\">\n" +
    "    <h4 class=\"portlet-title\"><u>{{vertical}} Metrics - {{parent.dateTime|dateFormat}} - {{parent.getDimensionDesp()}}</u></h4>\n" +
    "    <div class=\"portlet-body\">\n" +
    "        <div>\n" +
    "            <p ng-repeat=\"row in popupData track by $index\">\n" +
    "                <span class=\"metric-line\" sparkline data=\"row[0]\"></span>\n" +
    "                <span class=\"metric-name\">{{row[1]}}</span>\n" +
    "                <span class=\"metric-num\" ng-switch on=\"types[$index]\">\n" +
    "                    <i ng-switch-when=\"ratio\">{{row[2]}}</i>\n" +
    "                    <i ng-switch-when=\"origin\">{{row[2]|number}}</i>\n" +
    "                    <i ng-switch-default>{{row[2]}}</i>\n" +
    "                </span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );
}]);})();