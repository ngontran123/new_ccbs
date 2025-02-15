// Modules to control application life and create native browser window
const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('node:path')
const fs=require('fs');
const checkTokenIsAvailable=()=>
{ try{
  var is_valid_token='';
  const current_dir = path.join(process.cwd(), "token.txt");
  if(!fs.existsSync(current_dir))
  {
    is_valid_token='Không tìm thấy file token.txt trong thư mục';
    return is_valid_token;
  }
  const read_file = fs.readFileSync(current_dir);
  var content = read_file.toString().split("\n");
  var check_valid_token='';
  for(let i=0;i<content.length;i++)
  {
  if(content[i].trim()!='')
  {
    check_valid_token=content[i];
    break;
  }
  }
  if (check_valid_token=='') {
   is_valid_token='Xin hãy nhập token của bạn vào file token.txt';
  }
  else
  {
    is_valid_token='Token nhập vào của bạn là:'+check_valid_token;
  }
  console.log("valid token:"+is_valid_token);
  return is_valid_token;
}
catch(error)
{
  console.log(error);
}
}
require('./server/server.js')
 ipcMain.on("msg",(event,data)=>{
  var is_valid_token=checkTokenIsAvailable();
  event.reply("reply",is_valid_token);
 })
function createWindow () 
{
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: 
    {
      nodeIntegration:true,    
      contextIsolation: false,
    }
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
}

//Open the DevTools.

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () 
{
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
