var qless = require('../qless');
var assert = require('assert');

//init
before(function(){
    client = new qless.client();
//    client.redis.send_command('script',['flush']);
    client.redis.send_command('flushdb',[]);
    client.worker='worker';
})
after(function(){
    client.redis.send_command('flushdb',[]);
})

describe('#basic event -', function(){
    it('set up - should not error', function(done){
        client.queue('foo').put('Foo', {}, {'jid':'jid'}, function(r){
            client.job('jid',function(j){
                j.track(null, function(r){done()})})
        })
    })
    it('get popped event - should not fail', function(done){
        client.events.listen(function(){
            client.events.registerCallback('popped', function(msg){done()},
                function(){client.queue('foo').pop(function(r){})}
            )
        })
    })
})
