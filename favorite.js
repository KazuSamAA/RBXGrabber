//module.exports = rbxbot;
var os = require('os');
const colors = require('colors');
const fs = require('fs');
const conif = require('node-console-input');
const success = 'Success >> '.green.bold;
const failure = 'Failure >> '.red;
const normal = 'Normal >> '.cyan;
var start_prompt = 'RbxGrabber >> '.red.bold;


var log = (msg, type='') => {
  switch(type){
    case "success":
      console.log('RbxGrabber >> '.red.bold + success + msg);
      break;
    case "failure":
      console.log('RbxGrabber >> '.red.bold + failure + msg);
      break;
    case "normal":
      console.log('RbxGrabber >> '.red.bold + normal + msg);
      break;
    default:
      console.log('RbxGrabber >> '.red.bold + normal + msg);
      break;
  }
}

process.setMaxListeners(10000000);

process.on('message', async (json) => {
  const source = require('./utils/rbxbot.js');
  const rbxbot = new source();
  let cookies = json.cookies;
  let assetid = json.assetid;
  var i = 0;
  var cock = conif.getConsoleInput(start_prompt + "AssetId >> ", false);
  async function loop(){
    if(cookies.length > i) {
      try{
        let cookie = cookies[i];
        //console.log(cookie);
		let assetid = cock;
        if(cookie === ''){ throw new Error('Cookie is dead.')}
        let login = await rbxbot.cookie_login(cookie);
        if(login.success === false) {
          throw new Error(login.error);
        }
        let favorite = await rbxbot.favorite(assetid);
        if(favorite.success === true) {
          log('Successfully favorited asset!', 'success');
          process.send({success:true,message:'favorite'});
          i++;
          return loop();
        } else {
          throw new Error(favorite.error)
          i++;
          return loop();
        }
      }catch(err){
        process.send({success:false})
        if(err.message === 'Error: You must be logged in to add this to your favorites. Please Login or Register to continue') {
          log('Cookie is dead.', 'failure');
          i++;
          return loop();
        }
        log(err.message, 'failure');
        i++;
        return loop();
      }
    } else {
      return process.exit(1);
    }
  }
  loop();
})