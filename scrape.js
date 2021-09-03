const puppeteer = require('puppeteer');


(async() =>{

    let  testUrl = 'https://u.gg/lol/champions/morgana/counter';
    let target_vs = 'Xerath';


    //#region browser setup
    let browser = await puppeteer.launch();

    let page = await browser.newPage();
    page.on('console', consoleObj => console.log(consoleObj.text()));//lets me see log
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() === 'image'){
            req.abort();
        }else {
            req.continue();
        }
    });
    //networkidle2 used if all champs needed
    await page.goto(testUrl, { waitUntil: 'domcontentloaded'});
    //#endregion


    //#region on hold
    //works with networkidle2
    //const NUM_PRESSES = 2;
    // for(let i =0; i<NUM_PRESSES; i++){
    //     const but = await page.$x('//*[@id="content"]/div/div[1]/div/div/div[5]/div/div[3]/div');
    //     await but[0].click();
    // }
    //#endregion

    let data = await page.evaluate(() =>{

        var bad_matchups = document.getElementsByClassName('counter-list-card best-win-rate');
        var good_matchups = document.getElementsByClassName('counter-list-card worst-win-rate');
        var gold_diff = document.getElementsByClassName('counter-list-card gold-diff');

        let win_rate;
        let lane_gold_dif;
        let gold_found = false;
        let winrate_found = false

        for (var i = 0; i < good_matchups.length; i++) {
            if(good_matchups[i].innerText.includes("Xerath")){
                console.log("found " + "yuumi");
                win_rate = good_matchups[i].innerText;
                winrate_found = true;
            }
            else if(bad_matchups[i].innerText.includes("Xerath")){
                console.log("found " + "yuumi");
                win_rate = bad_matchups[i].innerText;
                winrate_found = true;
            }

            if(gold_diff[i].innerText.includes("Xerath")){
                console.log("found " + "yuumi");
                lane_gold_dif = gold_diff[i].innerText
                gold_found = true;
            }

            if(gold_found && winrate_found)
            {
                break;
            }

        }

        return {
            win_rate,
            lane_gold_dif
        }
    
    })
    // if(data.includes("Sett"))
    // {
    //     console.log("found sett");
    // }
    console.log(data);
    debugger;

    await browser.close()
})();
