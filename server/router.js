const express = require("express");
const fs=require("fs");
const p=require("path");
const axios=require('axios');
var multer = require('multer');
var router = express.Router();
var upload = multer({ dest: 'upload/' });
var type = upload.single('file');
var cheerio=require('cheerio');
const FormData=require('form-data');
const { URLSearchParams } = require("url");
/* GET home page. */

/* GET home page. */

const url_ccbs= "http://10.159.22.104/ccbs/";

var cookie_storage = [];

var cookie_value='';

const cookie_parse = (cookie) => {
  var t_cookie = cookie.split(',');
  var cookie_path = '';
  for (let i = 0; i < t_cookie.length; i++) {
    t_cookie[i] = t_cookie[i].replace(/'/g, '');
    var comma_split = t_cookie[i].split(';');
    for (let j = 0; j < comma_split.length; j++) {
      if (!comma_split[j].includes('path')) {
        cookie_path += `${comma_split[j]};`
      }
    }
  }
  cookie_path = cookie_path.substring(0, cookie_path.length - 1);
  return cookie_path;
}

router.post('/api/login', async function (req, res, next) {
  var username = req.body.user_name;
  var password = req.body.password;
  console.log("Username here is:" + username);
  console.log("Password here is:" + password);
  const strPathFullName = p.join(__dirname, 'files', 'ccbs');
  if (!fs.existsSync(strPathFullName)) {
    fs.mkdirSync(strPathFullName, { recursive: true });
  }

  const strFileFullName = p.join(strPathFullName, `cookies_${username}.txt`);

  if (fs.existsSync(strFileFullName)) 
  {
    fs.unlinkSync(strFileFullName);
  }
  const url = url_ccbs + 'main';

  const otp = password.slice(-6);

  const data =
  {
    '1iutlomLork': 'gjsot5pl{tizout',
    '1pl{tizout': 'tku4ysgxz{o4rgu{z4ykz[ykxVgxgskzkx./',
    'username': username,
    'password': password.replace(otp, ''),
    'options': otp,
  }

   
  const headers =
  {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Referer': 'http://10.159.22.104/ccbs/login.htm',
    'Origin': 'http://10.159.22.104',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': '*/*',
    'X-Requested-With': 'XMLHttpRequest'
  }


  const config = { headers: headers };
  try 
  {
    // {headers,withCredentials:true}
    var response = await axios.post(url, new URLSearchParams(data), config);
    var cookie = response.headers['set-cookie'];
    var cookie_parser = cookie_parse(cookie.toString());
    cookie_value=`cookie-${username}`;
    cookie_storage[cookie_value] = cookie_parser;
    console.log("The cookie from server is:" + cookie_value);
    if (response.data === 0){
      var ab_path=process.cwd()+'\\log.txt';
      fs.appendFileSync(ab_path,"Login thành công"+"\n");      
      res.status(200).send(
        {
          status: true,
          message: "Đăng nhập thành công."
        });
    }
    else {
      var ab_path=process.cwd()+'\\log.txt';
      fs.appendFileSync(ab_path,"Login thất bại"+"\n");        
      res.status(401).send({
        status: false,
        message: "Đăng nhập thất bại.",
        data:
        {
          response: response.data,
          data: data
        }
      });
    }
  }
  catch (err) {
    console.log("Đăng nhập ccbs thất bại:" + err.message);
    res.status(401).send(
      {
        status: false,
        message: "Đăng nhập thất bại",
        data: {
          error: err.message,
          data: data
        }
      });
      let today = new Date().toLocaleDateString();
      var ab_path=process.cwd()+'\\log.txt';
      fs.appendFileSync(ab_path,today+":Login error:"+err.message+"\n");
  }
});

router.post('/api/logout-ccbs',async function(req,res,next)
{
  var username = req.body.user_name;
  console.log("Username here is:" + username);
  
  const strPathFullName = p.join(__dirname, 'files', 'ccbs');
  if (!fs.existsSync(strPathFullName)) 
  {
    fs.mkdirSync(strPathFullName, { recursive: true });
  }

  const strFileFullName = p.join(strPathFullName, `cookies_${username}.txt`);

  if (fs.existsSync(strFileFullName)) {
    fs.unlinkSync(strFileFullName);
  }
  const url = url_ccbs + 'main';

  const data =
  {
    "1iutlomLork":"gjsotbrumu{z"
  };


  const headers =
  {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Referer': 'http://10.159.22.104/ccbs/main?1y%7Fyezksvrgzkelork=rg%7Fu{z5iihy5zvreiihy&1iutlomLork=gjsot5otjk~',
    'Accept': '*/*',
    'Cookie':  cookie_value 
  };
  const config = { headers: headers };
  try {
    var response = await axios.post(url, new URLSearchParams(data), config);
    if (response!="") {
      res.status(200).send(
        {
          status: true,
          message: "Logout thành công."
        });
    }
    else {
      res.status(401).send({
        status: false,
        message: "Logout thất bại.",
        data:
        {
          response: response.data,
          data: data
        }
      });
    }
  }
  catch (err) {
    res.status(401).send(
      {
        status: false,
        message: "Logout thất bại",
        data: {
          error: err.message,
          data: data
        }
      });
      let today = new Date().toLocaleDateString();
      var ab_path=process.cwd()+'\\log.txt';
      fs.appendFileSync(ab_path,today+":Logout error:"+err.message+"\n");
  }
});

router.post('/api/send-otp-ccbs', async function (req, res, next) {
  var username = req.body.user_name;
  console.log('username_send:'+username);
  const strPathFullName = p.join(__dirname, 'files', 'ccbs');
  if (!fs.existsSync(strPathFullName)) {
    fs.mkdirSync(strPathFullName, { recursive: true });
  }
  const strFileFullName = p.join(strPathFullName, `cookie_${username}.txt`);
  const url = `${url_ccbs}sendpin?username=${username}`;
  const headers =
  {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Referer': 'http://10.159.22.104/ccbs/login.htm',
    'Accept': '*/*',
    'Cookie':cookie_value
  };

  try {
  const config = { headers: headers };

    const response = await axios.get(url, config);
    if (!response.data) {
      res.status(400).send({ status: false, message: 'Không nhận được phản hồi.' });
    }
    else 
    {
      res.status(200).send({ status: true, message: response.data });
    }
  }
  catch (error) {
    console.log('Có lỗi xảy ra khi yêu cầu Otp:' + error.message);
    res.status(400).send({ status: false, message: 'Không nhận được phản hồi.', data: { error: error.message } });
    let today = new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":Send otp error:"+error.message+"\n");
  }
});


router.post('/api/check-cookie-ccbs', async function (req, res, next) {
  var username = req.body.user_name;
  const strPathFullName = p.join(__dirname, 'files', 'ccbs');
  if (!fs.existsSync(strPathFullName)) {
    fs.mkdirSync(strPathFullName, { recursive: true });
  }
  const strFileFullName = p.join(strPathFullName, `cookie_${username}.txt`);
  const url = `${url_ccbs}main?1y%7Fyezksvrgzkelork=rg%7Fu{z5iihy5zvreiihy&1iutlomLork=gjsot5otjk~`;
  const headers = 
  {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Cookie':cookie_value
  };
  try {
    const config = { headers: headers };
    const response = await axios.get(url, config);
    if (!response.data) {
      res.status(400).send({ status: false, message: 'Không nhận được phản hồi.' });
    }
    else if (response.data.includes('ccbs/login.htm')) {
      res.status(400).send({ status: false, message: 'Phiên đăng nhập hết hạn,vui lòng đăng nhập lại.' });
    }
    else {
      res.status(200).send({ status: true, message: 'Thành công' });
    }
  }
  catch (error) {
    console.log("There is error during check cookies:" + error.message);
    res.status(400).send({ status: false, message: "Không nhận được phản hồi", data: { error: error.message } });
    let today = new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":check cookies error:"+error.message+"\n");
  }
});

const renameFunc=(filename)=>
{
  var res=0;
  var ab_path=process.cwd()+'\\upload\\';
  var full_file_path=ab_path+filename;
  fs.renameSync(full_file_path,p.join(ab_path,`${filename}.jpg`),function(err){
    res=-1;
    let today = new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":Image rename:"+err.message+"\n");
    return res;
  });
  res=1;
  return res;
}


const formatPhoneNumber84=(phone)=>
{
 var formatted_phone='';
try
{
 if(phone!='' && phone!=null)
 {
   formatted_phone=phone.indexOf('0')!=0 ? "84"+phone.substring(1) : phone;
 }
}
catch
{
  let today = new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":"+err.message+"\n");
}
return formatted_phone;
}

const getTime=()=>
{
return Math.round(performance.now());
}

const getFullDate=()=>
{
const today=new Date();
let yyyy=today.getFullYear();
let mm=today.getMonth()+1;
let dd=today.getDate();
if(dd<10)
{
  dd='0'+dd;
}
if(mm<10)
{
  mm='0'+mm;
}
var res=dd+'/'+mm+'/'+yyyy;
return res;
}

router.post('/api/otp-ccbs',async function(req,res,next)
{
try
{ 
  var username=req.body.user_name;
  
  var phone=req.body.strPhone;

  //var test_data=req.body.test_data;
  // console.log("Username here is:"+username);
  // console.log("Phone number here is:"+phone);
  // console.log("Test data here is:"+test_data);
  if(phone=='')
  {
    res.status(400).send({status:false,message:'Số điện thoại không được rỗng.'});
  }
  // var regex_otp=/khach la:(.*)/;
  // var strOtp = test_data.match(regex_otp);
  // if(strOtp != null)
  // {
  //   var extracted_otp_str = strOtp[1].trim();
  //   console.log("First stage of extracting:"+extracted_otp_str);
  //   var regex_number_only=/\d+/g;
  //   var num_Otp=extracted_otp_str.match(regex_number_only);
  //   if(num_Otp != null)
  //   {
  //      var num_Otp_extracted=num_Otp[0];
  //      console.log("Otp extracted here is:"+num_Otp_extracted);
  //   }
  // }

  const strPathFullName = p.join(__dirname, 'files', 'ccbs');
  
  if (!fs.existsSync(strPathFullName)) 
  {
    fs.mkdirSync(strPathFullName, { recursive: true });    
  }
  var strDate=getFullDate();

  var current_time=getTime();
  
  // console.log("String date time is:"+strDate);
  // console.log("Datetime here is:"+current_time);
  const url= `http://10.159.22.104/ccbs/main?_=${current_time}&1iutlomLork=vzzh5zxgi{{5zxgi{{eysy5roiny{egpg~&sgezh=${phone}&rugoezt=2&jgzkelxus=${strDate}&jgzkezu=${strDate}&vgmkT{s=1&vgmkXki=25&jg{yu=1414`;
  
  const headers=
  {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Cookie':cookie_value
  };

  const config={headers:headers};
  
  const response = await axios.get(url,config);
  
  var exit_pos=response.data.indexOf('ccbs/login.htm');
  
  if(exit_pos!=-1)
  {
    res.status(400).send({status:false,message:'Tài khoản hết phiên đăng nhập.'});
  }
 else if(!response.data)
  {
    res.status(400).send({status:false,message:'Không có phản hồi.'});
  }
 else if(response.data == '')
 {
  res.status(400).send({status:false,message:'Không tìm thấy dữ liệu.'});
 }
  else
  {
  var regex_otp=/khach la:(.*)/;
  var strOtp = response.data.match(regex_otp);
  var strOtp = response.data.match(regex_otp);
  if(strOtp != null)
  {
    var extracted_otp_str = strOtp[1].trim();
    var regex_number_only=/\d+/g;
    var num_Otp=extracted_otp_str.match(regex_number_only);
    if(num_Otp != null)
    {
      var num_Otp_extracted=num_Otp[0];

      res.status(200).send({status:true,message:'Ok',otp:num_Otp_extracted});

    }
  }
}
}
catch(err)
{
  res.status(400).send(
    {
      status: false,
      message: "Có lỗi xảy ra khi lấy otp.",
      data: { error: err.message },
    });
  let today = new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":"+err.message+"\n");
}
});

const getImageUpload = async (user_name, phone, otp) => {
  var username = user_name;
  var strPhone = phone;
  var strOtp = "";
  if (otp != "" && otp != null) 
  {
    strOtp = otp;
  }

  const strPathFullName = p.join(__dirname, "files", "ccbs");
  if (!fs.existsSync(strPathFullName)) {
    fs.mkdirSync(strPathFullName, { recursive: true });
  }
  const strFileFullName = p.join(strPathFullName, `cookie_${username}.txt`);
  console.log(strFileFullName);
  const url = `${url_ccbs}main?iutlomLork=pttb/prepaid/frmUploadPPS_Personal&yuzh=${strPhone}&s~z=${strOtp}`;
  const headers = {
    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)",
    'Cookie': cookie_value,
    "Accept": "*/*",
  };
  const config = { headers: headers };
  try {
    const response = await axios.get(url, config);
    if (!response.data) {
      return -1;
    }
    const matches = response.data.match(/var sotb_='(.*?)';/g);
    const strPhone = matches ? matches[1] : "";
    var regexPattern = /'([^']*)'/
    const matchesSecond = strPhone.match(regexPattern);
    const strPhoneEnc = matchesSecond ? matchesSecond[1] : "";
    return strPhoneEnc;
  } catch (error) 
  {
    console.log("Có lỗi khi lấy form upload image:" + error.message)
    let today = new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":get_encrypted_pass:"+error.message+"\n");
    return -2;
  }
}

router.post("/api/post-upload-image-video", type, async function (req, res, next) {
try{
  const username = req.body.user_name;
  const phone = req.body.phone;
  const type = req.body.type;
  const otp = req.body.otp;
  const file = req.file;
  const strPhone = phone ?? "";

  
  
  const strPathFullName = p.join(__dirname, "files", "ccbs");
  var retry_times=0;
  console.log(`phone is:${phone},type:${type},file:${file}`);
  if (!fs.existsSync(strPathFullName)) {
    fs.mkdirSync(strPathFullName, { recursive: true });
  }

  const strFileFullName = p.join(strPathFullName, `cookie_${username}.txt`);
  const url = `${url_ccbs}main`;
  const strPhoneEnc = await getImageUpload(username, phone, otp);
 console.log("phone-encrypted is:" + strPhoneEnc);
 console.log("File name is:"+file.filename);
 

  var res_rename=renameFunc(file.filename);

  console.log("rename value is:"+res_rename);
  console.log("value is:"+res_rename);
  while(res_rename==-1 && retry_times < 4)
  {
    res_rename=renameFunc(file.filename);
    retry_times+=1;
  }
  const formData = new FormData();
  formData.append("1iutlomLork", "vzzh5vxkvgoj5LorkY{hsozeVkxyutgr");
  formData.append("1rugoe{vrugjeoj", "7");
  formData.append("1vgxgetgsk", "");
  formData.append("1vgxge|gr{k", strPhoneEnc ?? "");
  formData.append("1vgxge|gr{k8", type ?? "3|1");
  formData.append("3rugogtnoj3mx3uv", "");
  formData.append("3rugogtnoj3tu3inkiqkj", "(1=1)");
  formData.append("3rugogtnoj37", type ?? "3|1");
  formData.append("lorkInuuyk[vrugj", fs.createReadStream(p.join(process.cwd(),`\\${file.path}.jpg`)), { contentType: 'image/pjpeg' });
  const headers =
  {
    "User-Agent":"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)",
    'Referer': `${url_ccbs}main?iutlomLork=pttb/prepaid/frmUploadPPS_Personal&yuzh=${strPhone}&s~z=${otp}`,
    'Accept': "image/gif, image/jpeg, image/pjpeg, application/x-ms-application, application/xaml+xml, application/x-ms-xbap, */*",
    "Content-Type": "multipart/form-data",
    'Cookie': cookie_value
  };
  
  const config = { headers: headers };



  try 
  {
    const response = await axios.post(url, formData, config);
    res.status(200).send({ status: true, message: response.data});
    var file_name=p.join(process.cwd(),`\\${file.path}.jpg`);
  if (fs.existsSync(file_name)) 
  {
    fs.unlinkSync(file_name);
  }
  } 
  catch (error) 
  {
    var file_name=p.join(process.cwd(),`\\${file.path}.jpg`)
    if (fs.existsSync(file_name))
    {
      fs.unlinkSync(file_name);
    }
    console.log
    (
      "There is error in posting image or upload file:" + error.message
    );
    res.status(400).send(
    {
      status: false,
      message: "Có lỗi xảy ra khi upload file và image.",
      data: { error: error.message },
    });
    let today = new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":post image:"+error.message+"\n");
  }
}
catch(err)
{  let today = new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":"+err.message+"\n");
}
});


router.post("/api/post-upload-image", type, async function (req, res, next) {
try{
  const username = req.body.user_name;
  const phone = req.body.phone;
  const otp = req.body.otp;
  const file = req.file;
  const strPhone = phone ?? "";

  var data_ob=req.body;

  console.log("first value is:"+data_ob["1iutlomLork"]);

  console.log("Post Image object is:"+JSON.stringify(data_ob));
  
  const strPathFullName = p.join(__dirname, "files", "ccbs");
  var retry_times=0;
  if (!fs.existsSync(strPathFullName)) {
    fs.mkdirSync(strPathFullName, { recursive: true });
  }

  const strFileFullName = p.join(strPathFullName, `cookie_${username}.txt`);
  const url = `${url_ccbs}main`;
  const strPhoneEnc = await getImageUpload(username, phone, otp);
 console.log("phone-encrypted is:" + strPhoneEnc);
 console.log("File name is:"+file.filename);
 

  var res_rename=renameFunc(file.filename);

  console.log("rename value is:"+res_rename);
  console.log("value is:"+res_rename);
  while(res_rename==-1 && retry_times < 4)
  {
    res_rename=renameFunc(file.filename);
    retry_times+=1;
  }
  const formData = new FormData();
  formData.append("1iutlomLork", data_ob["1iutlomLork"]);
  formData.append("1rugoe[vrugjeoj", data_ob["1rugoe[vrugjeoj"]);
  formData.append("1vgxgetgsk", data_ob["1vgxgetgsk"]);
  formData.append("1vgxge|gr[k",data_ob["1vgxge|gr[k"]);
  formData.append("1vgxge|gr[k8",data_ob["1vgxge|gr[k8"]);
  formData.append("3rugogtnoj3mx3uv", data_ob["3rugogtnoj3mx3uv"]);
  formData.append("3rugogtnoj3tu3inkiqkj", data_ob["3rugogtnoj3tu3inkiqkj"]);
  formData.append("3rugogtnoj37",data_ob["3rugogtnoj37"]);
  formData.append("lorkInuuyk[vrugj", fs.createReadStream(p.join(process.cwd(),`\\${file.path}.jpg`)), { contentType: 'image/pjpeg' });
  const headers =
  {
    "User-Agent":"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)",
    'Referer': `${url_ccbs}main?iutlomLork=pttb/prepaid/frmUploadPPS_Personal&yuzh=${strPhone}&s~z=`,
    'Accept': "image/gif, image/jpeg, image/pjpeg, application/x-ms-application, application/xaml+xml, application/x-ms-xbap, */*",
    "Content-Type": "multipart/form-data",
    'Cookie': cookie_value
  };
  
  const config = { headers: headers };



  try 
  {
    const response = await axios.post(url, formData, config);
    res.status(200).send({ status: true, message: response.data});
    var file_name=p.join(process.cwd(),`\\${file.path}.jpg`);
  if (fs.existsSync(file_name)) 
  {
    fs.unlinkSync(file_name);
  }
  } 
  catch (error) 
  {
    var file_name=p.join(process.cwd(),`\\${file.path}.jpg`)
    if (fs.existsSync(file_name))
    {
      fs.unlinkSync(file_name);
    }
    console.log
    (
      "There is error in posting image or upload file:" + error.message
    );
    res.status(400).send(
    {
      status: false,
      message: "Có lỗi xảy ra khi upload file và image.",
      data: { error: error.message },
    });
    let today = new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":post image:"+error.message+"\n");
  }
}
catch(err)
{  let today = new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":"+err.message+"\n");
}
});

router.post('/api/add_new_contract',async function(req,res,next)
{   
  try
  {  
    var create_contract_str=req.body.create_contract_str;
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,"Add new Contract here");
    var strPathFullName = p.join(__dirname,'files','ccbs');
   if(!fs.existsSync(strPathFullName))
   {
     fs.mkdirSync(strPathFullName,{recursive:true});
   }
    
  const url = `${url_ccbs}dwr/exec/DataRemoting.getValue.dwr`;
  
  const formData =new FormData();

  formData.append('callCount','1');
  formData.append('c0-scriptName','DataRemoting'),
  formData.append('c0-methodName','getValue'),
  formData.append('c0-id','4622_1708066141159'),
  formData.append("c0-param0",`string:neo.pttb_laphd_vsms_2020.themmoiHDLD_ky(${create_contract_str})`);
  formData.append('c0-param1','boolean:false'),
  formData.append('xml','true');
  const data =
  {
    "callCount":"1",
    "c0-scriptName":"DataRemoting",
    "c0-methodName":"getValue",
    "c0-id":"4622_1708066141159",
    "c0-param0":`string:neo.pttb_laphd_vsms_2020.themmoiHDLD_ky(${create_contract_str})`,
    "c0-param1":"boolean:false",
    "xml":"true"
  };
   


  var headers=
  {
   'Accept':'*/*',
   'Referer':'http://ccbs.vnpt.vn/ccbs/main?1iutlomLork=vzzh5rgvnj5njrje|ysy5njrj',
   'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
   'Cookie':cookie_value
  };

  const config ={headers:headers};
  
  try
  {
  const response = await axios.post(url,new URLSearchParams(data),config);
  if(response.data!==null)
  {
    res.status(200).send(
      {
       status:true,
       message:'Add contract thành công',
       data:response.data,
       error:''
      });
  }
  else
  {
    res.status(401).send(
      {
      status:false,
      message:'Add contract thất bại',
      data:response.data,
      error:''
      });
  }
  }
catch(error)
{
    res.status(401).send(
      {
      status:false,
      message:'Add contract thất bại.',
      data:'',
      error:error.message
    });
}
  }
  catch(err)
  {
    res.status(401).send(
      {
        status: false,
        message: "Có lỗi xảy ra khi thêm hợp đồng.",
        error: err.response.data,
      });
    let today = new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":"+err.message+"\n");
  }
});

router.post('/api/get_contract_info',async function(req,res,next)
{
 try
 {

  var get_contract_str=req.body.get_contract_str;
  var strPathFullName = p.join(__dirname,'files','ccbs');
  if(!fs.existsSync(strPathFullName))
  {
   fs.mkdirSync(strPathFullName,{recursive:true});
  }
  
  const url =`${url_ccbs}dwr/exec/DataRemoting.getRec.dwr`;


  const formData=new FormData();
  
    
  formData.append("callCount","1");
  formData.append("c0-scriptName","DataRemoting");
  formData.append("c0-methodName","getRec");
  formData.append("c0-id","3297_1708066141787");
  formData.append("c0-param0",`string:neo.pttb_laphd_vsms_2020.laytt_hopdong_ld_ky(${get_contract_str})`);
  formData.append("c0-param1","boolean:false");
  formData.append("xml","true");
  const data =
  {
    "callCount":"1",
    "c0-scriptName":"DataRemoting",
    "c0-methodName":"getRec",
    "c0-id":"3297_1708066141787",
    "c0-param0":`string:neo.pttb_laphd_vsms_2020.laytt_hopdong_ld_ky(${get_contract_str})`,
    "c0-param1":"boolean:false",
    "xml":"true"
  };

  const fake_data =
  {
  "callCount":"1",
  "c0-scriptName":"DataRemoting",
  "c0-methodName":"getRec",
  "c0-id":"3297_1708066141787",
  "c0-param0":"string",
  "xml":"true"
  };

  var headers =
  {
    'Accept':'*/*',
    'Referer':'http://ccbs.vnpt.vn/ccbs/main?1iutlomLork=vzzh5rgvnj5njrje|ysy5njrj0',
    'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
    'Cookie':cookie_value
  };
  
  const config ={headers:headers};
  
  const response = await axios.post(url,new URLSearchParams(data),config);
   
  if(response.data!=null)
  {
    res.status(200).send({status:true,message:"Lay thong tin hop dong thanh cong.",data:response.data,error:''});
  }
  else
  {
  res.status(401).send({status:false,message:"Lay thong tin hop dong that bai.",data:response.data,error:''});
  }
 }
 catch(err)
 {
  res.status(401).send(
    {
      status: false,
      message: "Có lỗi xảy ra khi lấy hợp đồng.",
      error: err.response.data 
    });
  let today= new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":"+err.message+"\n");
 }
});


var getProvinceList=(province_file)=>
{

var province_list=[];

try
{
  const $=cheerio.load(province_file);
  $("select#cboTinh").find('OPTION').each((idx,ele)=>
  {
   var value = `${$(ele).attr('value')}-${$(ele).text().trim()}`;
   if(value)
   {
    if(!province_list.includes(value))
     {
      province_list.push(value);
     }
   }
  });
}
catch(error)
{  
  let today = new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":"+error.message+"\n");
}
return province_list;
}

router.post('/api/upload_image',type,async function(req,res,next)
{
 try
 {
  const strPathFullName = p.join(__dirname, 'files', 'ccbs');
  const file =req.file;
  console.log('file name here is:'+file.path);
  
  var ab_path=process.cwd()+'\\log.txt';
  
  fs.appendFileSync(ab_path,"file_path here is:"+file.path+"\n");  
  
  if (!fs.existsSync(strPathFullName)) 
  {
    fs.mkdirSync(strPathFullName, { recursive: true });
  } 

  var res_rename=renameFunc(file.filename);
  console.log("value is:"+res_rename);
  while(res_rename==-1 && retry_times < 4)
  {
    res_rename=renameFunc(file.filename);
    retry_times+=1;
  }

  const url =`${url_ccbs}main`;
  const formData = new FormData();
  formData.append("1iutlomLork","vzzh5rgvnj5njrje|ysy5zn{khgu5LorkY{hsozey{hyixohkx");
  formData.append("1rugoe{vrugjeoj","7");
  formData.append("1vgxgesgzh",">:>:<696>7:");
  formData.append("1vgxgesgqn","HTNJJ6678<97=");
  formData.append("1vgxgesgnj","");
  formData.append("1vgxgerugoqn","7");
  formData.append("1vgxgerugogtn","7");
  formData.append("1vgxgeojgtn","1|0");
  formData.append("3ojrugogtn3mx3uv","");
  formData.append("3ojrugogtn3tu3inkiqkj","(1=1)");
  formData.append("3ojrugogtn37","1|0");
  formData.append("lorkInuuyk[vrugj",fs.createReadStream(p.join(process.cwd(),`\\${file.path}.jpg`)),{contentType:"image/pjpeg"});
  var headers=
  {
    'Accept':'image/gif, image/jpeg, image/pjpeg, application/x-ms-application, application/xaml+xml, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*',
    'Referer':'http://ccbs.vnpt.vn/ccbs/main?iutlomLork=pttb/laphd/hdld_vsms/thuebao/frmUploadPPS_subscriber&sgezh=84846030814&sgeqn=BNHDD00126317&rugoqnginngtm=1',
    'Content-Type':'multipart/form-data; boundary=---------------------------7e8185840a4e',
    'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
    'Cookie':cookie_value
  };
  const config={headers:headers};
  var response = await axios.post(url,formData,config);
  if(response.data!=null)
  {
    res.status(200).send({status:true,message:'Đã upload ảnh thành  công',data:response.data});
  
    var file_name=p.join(process.cwd(),`\\${file.path}.jpg`);
    if (fs.existsSync(file_name)) 
    {
      fs.unlinkSync(file_name);
    }
  }
 }
 catch(error)
 {
  var file_name=p.join(process.cwd(),`\\${file.path}.jpg`);
  if (fs.existsSync(file_name)) 
  {
    fs.unlinkSync(file_name);
  }
  res.status(401).send(
  {
   status:false,
   message:'Có lỗi xảy ra khi upload ảnh.',
   error:error.message
  });
  let today= new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":Upload image:"+err.response.data+"\n");  
 }
});



router.post('/api/common-client',async function(req,res,next)
{
try
{
  var request=req.body.request;
  const url=`${url_ccbs}${request.url}`;
  var method = request.method;
  var data = req.body.data;
  var data_ob={};
  for(const [key,value] of Object.entries(data))
  {
    data_ob[key] = value;
  }
  var headers=
  {
      'Accept':'image/gif, image/jpeg, image/pjpeg, application/x-ms-application, application/xaml+xml, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*',
      'Referer':'http://ccbs.vnpt.vn/ccbs/main?iutlomLork=pttb/laphd/hdld_vsms/thuebao/frmUploadPPS_subscriber&sgezh=84846030814&sgeqn=BNHDD00126317&rugoqnginngtm=1',
      'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
      'Cookie':cookie_value
  };

  const config={headers:headers};
  var response ='';
  if(method=='POST')
  {
    response = await axios.post(url,new URLSearchParams(data_ob),config);
  }
  else
  {
    response = await axios.get(url,config);
  }
    if(response.data!=null)
    {
      res.status(200).send({status:true,message:'Lấy dữ liệu thành công.',data:response.data,error:''});
    }
    else
    {
      res.status(401).send({status:false,message:'Không tìm thấy dữ liệu.',data:response.data,error:''});
    }
}
catch(err)
{
  res.status(401).send({
    status:false,
    message:'Có lỗi xảy ra khi thực hiện tác vụ.',
    data:'',
    error:err.message
  });
  let today= new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';
  fs.appendFileSync(ab_path,today+":Common-Client:"+err.response.data+"\n");  
}
});


function getRandomId()
{
  return Math.floor(Math.random()*(9999-1111+1))+1111;
}


router.post('/api/get-phone-hash',async function(req,res,next){
  try
  { 
    var ab_path=process.cwd()+'\\log.txt';
    const strPathFullName = p.join(__dirname, 'files', 'ccbs');
  
    if (!fs.existsSync(strPathFullName)) 
    {
      fs.mkdirSync(strPathFullName, { recursive: true });
    }
    
   const url=`${url_ccbs}main`;

   var obj_data=req.body;
   
   const formData = new FormData();

   formData.append('iutlomLork',obj_data.iutlomLork);

   formData.append('yuzh',obj_data.yuzh);

   formData.append('s~z','');

   var headers=
 {
     'Accept':'image/gif, image/jpeg, image/pjpeg, application/x-ms-application, application/xaml+xml, application/x-ms-xbap, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*',
     'Referer':'http://ccbs.vnpt.vn/ccbs/main?iutlomLork=pttb/laphd/hdld_vsms/thuebao/frmUploadPPS_subscriber&sgezh=84846030814&sgeqn=BNHDD00126317&rugoqnginngtm=1',
     'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
     'Cookie':cookie_value
 };

  const config ={headers:headers};

  var response = await axios.post(url,formData,config);

  if(response.data!=null)
  {
    res.status(200).send({status:true,message:'Lấy dữ liệu phone hash thành công',data:response.data});
  }

   

  }
  catch(err)
  {
    res.status(401).send({
      status:false,
      message:'Có lỗi xảy ra khi thực hiện tác vụ get phone hash.',
      data:'',
      error:err.message
    });
    let today= new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":"+err.message+"\n");
  }
})

router.post('/api/update',async function(req,res,next)
{
 try
 {
  var ab_path=process.cwd()+'\\log.txt';
  
  const strPathFullName = p.join(__dirname, 'files', 'ccbs');

  if (!fs.existsSync(strPathFullName)) 
  {
    fs.mkdirSync(strPathFullName, { recursive: true });
  }
  
 const url=`${url_ccbs}dwr/exec/NEORemoting.getValue.dwr`;
 
 const formData = new FormData();

 const obj_data=req.body;

 fs.appendFileSync(ab_path,"your data here is:"+JSON.stringify(req.body)+"\n");   

 console.log("Data  2 here is:"+JSON.stringify(req.body));

 console.log("Scrip name:"+obj_data['c0-scriptName']);


 fs.appendFileSync(ab_path,"your cookies here is:"+cookie_value+"\n");   
 
 //const id_datetime=getRandomId()+'_'+Date.now()+'263';
 formData.append('callCount',obj_data['callCount']);
 
 formData.append('c0-scriptName',obj_data['c0-scriptName']);
 

 formData.append("c0-methodName",obj_data['c0-methodName']);
 
 formData.append('c0-id',obj_data['c0-id']);
 
 formData.append('c0-param0',obj_data['c0-param0']);
 
 formData.append('c0-param1',obj_data['c0-param1']);
 
 formData.append('xml','true');
 

 var headers=
 {
     'Content-Type':'text/plain',
     'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; InfoPath.2; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; Zoom 3.6.0)',
     'Referer':'http://10.159.22.104/ccbs/main',
     'Cookie':cookie_value
 };

  const config ={headers:headers};

  var response = await axios.post(url,formData,config);

  if(response.data!=null)
  { 
    res.status(200).send({status:true,message:'Lấy dữ liệu thành công',data:response.data});
  }

 }
 catch(err)
 {
  res.status(401).send({
    status:false,
    message:'Có lỗi xảy ra khi thực hiện tác vụ.',
    data:'',
    error:err.message
  });
  let today= new Date().toLocaleDateString();
  var ab_path=process.cwd()+'\\log.txt';  
  fs.appendFileSync(ab_path,today+":"+err.message+"\n");
 }
});

router.post('/api/get_province_list',async function(req,res,next)
{
  try
  {
   var ab_path=process.cwd()+'\\log.txt';
   var user=req.body.user_name;
   const strPathFullName = p.join(__dirname, 'files', 'ccbs');

   if (!fs.existsSync(strPathFullName)) 
   {
     fs.mkdirSync(strPathFullName, { recursive: true });
   }
   
  const url=`${url_ccbs}main`;
  
  const formData = new FormData();  
  
  fs.appendFileSync(ab_path,"your cookies here is:"+cookie_value+"\n");   

  formData.append('1iutlomLork','iussut5lxsjoginoey');
  formData.append('w{gteoj','');
  formData.append('vn{utmeoj','');
  formData.append('vnueoj','');
  formData.append('yuetng','');
  formData.append('jogino','');
  formData.append('1w{gteojetgsk','w{gtizeoj'); 
  formData.append('1vn{utmeojetgsk','vn{utmizeoj');
  formData.append('1vnueojetgsk','vnuizeoj');
  formData.append('1yuetngetgsk','yutngizeoj');
  formData.append('1joginoetgsk','joginoeiz');
   var headers=
   {
     'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)',
     'Accept':'image/gif, image/jpeg, image/pjpeg, application/x-ms-application, application/xaml+xml, application/x-ms-xbap, */*',
     'Cookie':cookie_value
   };
   
   const config ={headers:headers};   
   
   var response = await axios.post(url,formData,config);
  
   if(response.data!=null)
   { 
    fs.appendFileSync(ab_path,"response data:"+response.data+"\n");
    
    var province_data=response.data;

    var province_list = getProvinceList(province_data);
    
    if(province_list!=null && province_list.length>0)
    {
    res.status(200).send({status:true,message:'Lay danh sach thanh cong',data:province_list});
    } 
    else
    {
      res.status(401).send({status:false,message:'Lay danh sach that bai',data:province_list});      
    }
   }
   else
   {
    
    fs.appendFileSync(ab_path,"response data fail:"+response+"\n");

    res.status(401).send({status:false,message:'Lay danh sach that bai',data:response.data});     
   
  }
    // var file_path=process.cwd()+"\\province_file.txt";
    // const html_file=fs.readFileSync(file_path);
    // var province_list=getProvinceList(html_file);
    // if(province_list!=null)
    // {
    // res.status(200).send({status:true,message:'Lấy danh sách thành công',data:province_list});
    // }
  }
  catch(err)
  {  
    
    res.status(400).send(
      {
        status: false,
        message: "Có lỗi xảy ra khi lấy danh sách tỉnh/thành.",
        error: err.message
      });
    console.log("province list error:"+err.message);
    let today= new Date().toLocaleDateString();
    var ab_path=process.cwd()+'\\log.txt';
    fs.appendFileSync(ab_path,today+":"+err.message+"\n");  
  }
});

module.exports = router;


