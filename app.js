var express = require('express');
var app = express();
var server = require('http').createServer(app);

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());


/*
    - new api from secret 老薛
*/
var secret = express();
// api/v2/
// /topic/index
secret.post('/create', function(req, res) {
    res.send({});
});

secret.get('/list', function(req, res) {
    // 支持分页
    res.send({
        code: 0,
        myList: [{
            code: 1,
            name: '高端人才扯犊子群',
            participants: 122,
            unreadCount: 31
        }, {
            code: 2,
            name: '高端人才不知道',
            participants: 12,
            unreadCount: 31
        }, {
            code: 3,
            name: '高端人才扯犊子群(2)',
            participants: 122,
            unreadCount: 31
        }]
    });
});

secret.get('/nearby', function(req, res, next) {
    res.send({
        code: 0,
        nearbyList: [{
            code: 1,
            name: '很热门的群（1）',
            distance: '122 米',
            participants: 32
        }, {
            code: 1,
            name: '很热门的群（1）',
            distance: '122 米',
            participants: 32
        }, {
            code: 1,
            name: '很热门的群（1）',
            distance: '122 米',
            participants: 32
        }],
        popularList: [{
            code: 1,
            name: '很热门的群（1）',
            participants: 32
        }, {
            code: 2,
            name: '很热门的群（2）',
            participants: 22
        }, {
            code: 1,
            name: '很热门的群（3）',
            participants: 52
        }]
    });
});
secret.get('/query', function(req, res) {
    // topicCode, sessionId
    // more latestToken, continuationToken
    res.send({
        code: 0,
        currenTime: new Date().getTime(),
        topicInfo: {
            isFull: true,
            joined: true, // 0: 未加入， 1：已加入
            avatarId: 2,
            avatarList: [2, 3, 4, 6],
            messageList: [{
                content: '妹子很漂亮哎，角落里的...' + new Date().getTime(),
                avatarId: 3,
                createdTime: new Date().getTime()
            }, {
                content: '叫啥？' + new Date().getTime(),
                avatarId: 2,
                createdTime: new Date().getTime()
            }, {
                content: '叫啥？' + new Date().getTime(),
                avatarId: 6,
                createdTime: new Date().getTime()
            }, {
                content: '测试下内容 ' + new Date(),
                avatarId: 3,
                createdTime: new Date().getTime()
            }, {
                content: '叫啥？' + new Date().getTime(),
                avatarId: 6,
                createdTime: new Date().getTime()
            }, {
                content: '测试下内容 ' + new Date(),
                avatarId: 3,
                createdTime: new Date().getTime()
            }, {
                content: '叫啥？' + new Date().getTime(),
                avatarId: 64,
                createdTime: new Date().getTime()
            }, {
                content: '测试下内容 ' + new Date(),
                avatarId: 123,
                createdTime: new Date().getTime()
            }, {
                content: '叫啥？' + new Date().getTime(),
                avatarId: 6,
                createdTime: new Date().getTime()
            }, {
                content: '测试下内容 ' + new Date(),
                avatarId: 3,
                createdTime: new Date().getTime()
            }]
        },
        continuationToken: '?z2fd',
        latestToken: '122',
        tickleInterval: 0
    });
});
secret.get('/tickle', function(req, res) {
    res.send({
        code: 0,
        newCount: 2
    });
});
secret.post('/join', function(req, res) {
    res.send({
        code: 0,
        avatarId: 8
    });
});
secret.post('/message', function(req, res) {
    res.send({
        code: 0
    }); // 不需要 avatarId
});

app.use('/api/v2/topic/index', secret);


/*
    - 静态页资源和其他 static express
*/
// app.use(express.static(__dirname + '/dist'));
app.get('/scripts/templates.js', function(req, res) {
    res.end({

    });
});
app.use(express.static(__dirname + '/app'));
server.listen(3001, '0.0.0.0');