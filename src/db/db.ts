import {MongoClient} from "mongodb"
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({path:path.join(__dirname,"..","..",".env")})

export const toSaveDB = (userId:string,Me_id:string,message:string,reply_message:string)=>{
  MongoClient.connect(process.env.DB, (err:any, db:any)=> {
    if (err) return console.log({err})
    const dbase = db.db(process.env.DBNAME||'QQ_CHAT')
    const  col = dbase.collection(process.env.DBCOLLECTION||'chat')
    const data = {
      time:new Date().getTime().toString(),
      user_id:userId,
      my_id:Me_id,
      message:message,
      reply_message:reply_message
  }
    col.insertOne(data,(err:any,_res:any)=>{
      if(!err){
        db.close()
      }
      return
    })
  })
}
