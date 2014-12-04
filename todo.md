define('kERR_CODE_MISSING_PARAM', 1);
define('kERR_CODE_SIGN_NOT_MATCH', 2);
define('kERR_CODE_VERIFY_NOT_MATCH', 3);
define('kERR_CODE_MISSING_COORDINATE', 4);
define('kERR_CODE_WRONG_NAME', 5);
define('kERR_CODE_WRONG_MESSAGE', 6);
define('kERR_CODE_OVER_LIMIT_PEOPLE', 7);
define('kERR_CODE_NOT_JOINED_TOPIC', 8);

define('kERR_CODE_USER_NOT_FOUND', 401);
define('kERR_CODE_TOPIC_NOT_FOUND', 402);

Todo:
把连续小间隔内消息聚合在一起（如30秒内消息）
把一段时间的聚合在一起（如1分钟内的消息）
动态更改时间 interval - done~
接口 API loading & 按钮 busy 效果~~

新加入：
统一的全局的错误提示
取消 my groups 的 page 分页
利用 isOwn 来简化 processMsg 的工作
修改分享（添加描述和改变 url）
调整聊天接口（message/tickle）等

接口调整：
2. 取消了tickle接口中的NewCount，直接返回所有新消息
3. 取消了message接口中的AvatarId，直接返回所有新消息

编译时候：
取消 index 中对 templates.js 的注释
测试，打开 express 中 server dist 的调用


开始开发：
1 切换为ionic，设计 router，切 template done
4 加载性能优化（减少无谓的 CSS 和图片数量）&& gulp build & watch!!! done


2 mock 数据 API 和 逻辑开发（数据绑定 as 后端 API）
根据 enterType 切页面？！ done
- 分页 list group
ng-clikc ng-touch 适配

3 动画特效加入（图片缓慢加入前，group list 动画，msg item added 动画，小状态切换[join,chat等]）

动画 verbose：
自己新加 msg - slideTop 而不是 left/right 会闪一下滚动条
pull previous msgs 动画 - 加载的 loading indictor
group share 一步步动画
chat-input state 切换的状态


archive:
group list - item slideup 动画
头像 icon 动画 done
chat message list 初始化
被新加 msg
成功后 feeback indicator
初始化 loading 动画
