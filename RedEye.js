
var xpath = require('xpath'); 
var dom = require('xmldom').DOMParser;
const https = require('https');
const { forEach } = require('async');
const fs = require('fs');

/*
Programmed by Z3NTL3
*/

var Scrape = (link,callb) => {
    const options = {
        hostname: 'useragents.io',
        port: 443,
        path: `${link}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36',
            'Cache-Control': 'no-cache'
        }
      };

    https.get(options,  (res) => {
        if(res.statusCode == 200){
            var full_data = '';
            res.on('data', (d) => {
                full_data += d;
            });
            res.on("end", async() => {
                content = full_data;
                
                var doc = new dom().parseFromString(content);
                var nodes = xpath.select("/html/body/main/div/div/div/table/tbody[1]/tr/td['1']/a/@title", doc);
    
                var uas = '';
                nodes.forEach(value => {
                    console.log(value.value);
                    uas += value.value +"\n";
                })
    
                callb(uas);
            });
        }
        else{
            console.log('Err: '+res.statusCode,res.statusMessage)
        }
    
    }).on('error', (err) => {
        console.log('Err: '+err);
    });
};

var CallBack = (collection) => {
    try {
       
        fs.writeFile(__dirname+"\\uas.txt", collection, err => {
            if (err) {
              console.error(err);
            }
            else{
                console.log(collection);
                console.log('UAs saved in: ' + __dirname+"\\uas.txt");
            }
          });
      } catch(err) {
        console.log(err);
      }
};

var linkArray = process.argv.slice(2,3);
var Check = (link) => {
    try{
        if (link[0].includes('useragents.io') && link[0].includes('https://')){
            var cleaned = link[0].replace('https://useragents.io/','').split('/');
            var link = '/';
            for(var i= 0; i < cleaned.length; i++){
                if(i + 1 === cleaned.length){
                    link += cleaned[parseInt(i)];
                }
                else{
                    link += cleaned[parseInt(i)] + "/";
                }
            }
            return link;
        }
        else{
            console.log('**Invalid Link Format!**\n\n--> node RedEye.js https://useragents.io/explore/browser/chrome/link');
            process.exit(-1);
        }
    }
    catch{
        console.log('**Invalid Usage!**\n\n--> node RedEye.js https://useragents.io/explore/browser/chrome/link');
        process.exit(-1);
    }
   
};

var LinkFormat = Check(linkArray);
Scrape(LinkFormat,CallBack);
