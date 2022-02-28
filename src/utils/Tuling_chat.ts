import { DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent } from "oicq"
import dotenv from 'dotenv'
import path from 'path'
import axios from "axios"
import { toSaveDB } from "../db/db"
dotenv.config({path:path.join(__dirname,"./",".env")})
let total:number = 0
const tomorrow = new Date(new Date().toLocaleDateString()).getTime()+86400000
const current = new Date().getTime()
// 0点清零
setInterval(()=>{
    total=0
},tomorrow-current)
const tuling_chat = (message:string,userid:string,own_id:string,e:PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent)=>{
    const request_config={
        "reqType":0,
        "perception": {
            "inputText": {
                "text": message
            },
        },
        "userInfo": {
            "apiKey": process.env.TULING_KEY_FIRST,
            "userId":userid
        }
    }
    axios({
        method:"POST",
        data:request_config,
        url:process.env.TULING_API_URL
    }).then((res:any)=>{
        const {results} = res.data
        if(results){
            if(results[0].values['text']==="请求次数超限制!"){
                switch(total){
                    case 0:
                        total++
                        toSaveDB(userid,own_id,message,"亲爱的，我今天没有能量了，明天再陪你聊哦！")
                        e.reply("亲爱的，我今天没有能量了，明天再陪你聊哦！",false)
                        break
                    case 1:
                        total++
                        toSaveDB(userid,own_id,message,"亲爱的，我真的没有能量了。求放过！")
                        e.reply("亲爱的，我真的没有能量了。求放过！",false)
                        break
                    case 2:
                        total++
                        toSaveDB(userid,own_id,message,"亲爱的，对不起，我马上要强制关机了！")
                        e.reply("亲爱的，对不起，我马上要强制关机了！",false)
                        break
                    case 3:
                        total++
                        toSaveDB(userid,own_id,message,"关机中....3...2...1！")
                        e.reply("关机中....3...2...1！",false)
                        break
                    default:
                        total++
                        toSaveDB(userid,own_id,message,"QQ企鹅能量已经耗尽，抱歉,您的消息无法解析了！")
                        e.reply("QQ企鹅能量已经耗尽，抱歉,您的消息无法解析了！",false)
                        break
                }
                
                return
            }
            toSaveDB(userid,own_id,message,results[0].values['text'])
            e.reply(results[0].values['text'],false)
        }else{
            e.reply("抱歉，这方面不解析不了。",true)
        }
        
    })
}
export default tuling_chat