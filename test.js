// Test Model module
var model = require('./model');
var User = model.User;
var Message = model.Message;
var Group = model.Group;

var group1;
var user1 = new User({
    openId: 'testtest'
});
user1.save(function(err, user) {
    if (err) console.log(err);
    group1 = new Group({
        creator: user,
        name: 'test',
        isPublic: true,
        location: {
            lat: '22.22',
            lng: '52.23'
        },
        members: [user],
        messages: []
    });
    group1.save(function(err, group) {
        if (err) console.log(err);
        var msg1 = new Message({
            content: 'test in content llalal',
            author: user
        });
        msg1.save(function(err, msg) {
            group.messages.push(msg);
            group.save(function(err, i) {
                if (err) console.log(err);
            });
        });
    });
});

// arr.push, why another $set, $push?!