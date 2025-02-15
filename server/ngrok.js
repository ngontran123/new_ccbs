const axios = require("axios")
const path = require("path")
const fs = require("fs")
const ngrok = require("@ngrok/ngrok")
var token_info='';
const ConnectNgrok = async (token) => {
 try
 {
  console.log("The ngrok connection used to be here");

    
  let today = new Date().toLocaleDateString();
  
  var ab_path=process.cwd()+'\\log.txt';
  
  await ngrok.authtoken(token);

  var link=['us','eu','ap','au','sa','jp','in','hk','sg','br','ru','za','nl','de','gb','fr','es','it','se','ch','at','be','dk','fi','no','pl','cz','hu','ro','gr','pt','tr','ua','ie','lt','lv','ee','rs','bg','hr','si','sk','lu','is','mk','cy','li','mt','al','ba','md','me','xip','localtunnel','serveo'];

  var random_link=link[Math.floor(Math.random()*link.length)];

  fs.appendFileSync(ab_path,today+":"+"random link is:"+random_link+"\n");

  console.log("random link is:"+random_link);

  const ngrok_listener = await ngrok.forward({ proto: 'http', addr: 9000,region:random_link});  

  console.log("ngrok link:"+ngrok_listener.url());

  
  fs.appendFileSync(ab_path,today+":"+"ngrok link is:"+ngrok_listener+"\n");
  
  return ngrok_listener.url();
 }
 catch(err)
 {
  console.log('There is error during conenct ngrok:'+err.message);
  let today = new Date().toLocaleDateString()
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":"+err.message+"\n");
  process.exit(1);
 }
};

const getAuthToken = async (url) => {
  try {
    console.log("The getAuthToken used to be here.");

    const data = 
    {
      secret: "JNI*'jZbl}pn4LU",
    };
    await axios.post(url, data).then(async (res) => {
      console.log("Get token response is:"+JSON.stringify(res.data));
      if (res.data.error_code == 1) 
      {
        var token = res.data.data.token;
        console.log("token here is:" + token);
        var link = await ConnectNgrok(token);
        const current_dir = path.join(process.cwd(), "token.txt");
        if(!fs.existsSync(current_dir))
        {
          return;
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
        if (check_valid_token=='') 
        {
          console.log("Không được để trống token.");
          return;          
        } 
        else 
        {
          var token_push = check_valid_token;
          console.log("token push is:"+token_push);
          var second_url = "https://portal-ccbs.mobimart.xyz/api/url/add";
          await postPublicLink(second_url, link, token_push);           
        }
      }
    });
  } catch (error) 
  {    
    console.log("There is error during get token:" + error.message);
    process.exit(1);    
  }
};

var postPublicLink = async (url, link, token) => {
  try {
    const data = 
    {
      secret: "JNI*'jZbl}pn4LU",
      email: token,
      url: link,
    };

    await axios.post(url, data).then((res) => 
  { 
      console.log("Post data response is:"+res.data);
      if (res.data.error_code == 1) 
      { 
        console.log("Post public link success:"+res.data.message);
      } 
      else 
      {
        console.log("Post public link error:"+res.data.message);
      }
    });
  } 
  catch (error) 
  {
    console.log("There is error during post public link:" + error.message);
    let today = new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":"+err.message+"\n");
  process.exit(1);
  }
};

module.exports  = { ConnectNgrok, getAuthToken};
