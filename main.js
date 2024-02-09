const {createClient} = require('icqq')
const client=createClient({platform: 3})

const account=10001
const password='10001'
client.on('system.login.slider', (e) => {
    console.log('输入滑块地址获取的ticket后继续。\n滑块地址:    ' + e.url)
    process.stdin.once('data', (data) => {
        client.submitSlider(data.toString().trim())
    })
})
client.on('system.login.qrcode', (e) => {
    console.log('扫码完成后回车继续:    ')
    process.stdin.once('data', () => {
        client.login()
    })
})
client.on('system.login.device', (e) => {
    console.log('请选择验证方式:(1：短信验证   其他：扫码验证)')
    process.stdin.once('data', (data) => {
        if (data.toString().trim() === '1') {
            client.sendSmsCode()
            console.log('请输入手机收到的短信验证码:')
            process.stdin.once('data', (res) => {
                client.submitSmsCode(res.toString().trim())
            })
        } else {
            console.log('扫码完成后回车继续：' + e.url)
            process.stdin.once('data', () => {
                client.login()
            })
        }
    })
})
client.login(account,password)

//进群新人时发微笑
client.on('notice.group.increase',(e)=>{
    if(e.group_id == 123456789)
        client.sendGroupMsg(e.group_id, {type:"face", id:14}).catch(()=>{
            console.log("Error send!");
        });
});

//监听群组中特定人或者全部人消息
client.on('message.group',(e)=>{
    //延迟执行，模拟真人操作
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    sleep(3000).then(()=>{
        if(e.sender.user_id == 10001){
            let sendTime = e.time; //发送时间
            let message = e.raw_message; 
            let messageLength = e.raw_message.length; //信息长度
            let messageType = e.message[0].type; //信息类型

            client.sendGroupMsg(e.group_id, `发送内容`).catch(()=>{
                console.log("Error send!");
            });
            e.group.pokeMember(e.sender.user_id);//拍一拍
            e.group.setCard(account, e.raw_message);//设置群名片
        }
    })
})