import { createClient } from "oicq"
import dotenv from "dotenv"
import path from "path"
import Tuling_chat from "./utils/Tuling_chat"
dotenv.config({path:path.join(__dirname,"..",".env")})

const main = () => {
  const client = createClient(process.env.ACCOUNT)

  client.on("system.online", () => console.log("Logged in!"))

  //监听我所有的消息
  client.on("message.private", e => {
    const { raw_message,message, from_id,to_id } = e
    Tuling_chat(message[0].type==="text"?raw_message:message[0].type==='image'?String(("[图片]&&"+message[0].url as string)):raw_message, from_id.toString(),to_id.toString(), e)
  })
  console.log("请输入登陆方式：")
  console.log("1-->密码登录")
  console.log("2-->扫码登录")
  console.log("3-->退出程序")
  process.stdin.once("data", (input) => {
    if (parseInt(input.toString()) === 1) {
      client.login(process.env.ACCOUNT_PASSWORD)
      return
    }
    if (parseInt(input.toString()) === 2) {
      client.on("system.login.qrcode", function (e) {
        //扫码后按回车登录
        process.stdin.once("data", () => {
          this.login()
        })
      }).login()
      return
    }
    if (parseInt(input.toString()) === 3) {
      console.log("退出！")
      process.exit()
    }
  })
}

main()