
const fs = require('fs');
const puppeteer = require('puppeteer');
const data = {
    list : []
}

async function main (skill) {
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()
    await page.goto(`https://in.indeed.com/m/jobs?q=${skill}&l=`, {
        timeout:0,
        waitUntil:'networkidle0',
    })
    //  Get a screenshot of the page
    // await page.screenshot({ path: 'example.png', fullPage: true });

     //  Get a PDF of the page
    // await page.pdf({ path: 'example.pdf', format: 'A4' });

    const jobData = await page.evaluate(async (data) => {
        const items = document.querySelectorAll('td.resultContent')
        items.forEach((item, index) => {
            console.log(`scraping data of product: ${index}`)
            const title= item.querySelector('h2.jobTitle>a') && item.querySelector('h2.jobTitle>a').innerText
            const link =item.querySelector('h2.jobTitle>a') && item.querySelector('h2.jobTitle>a').href
            let salary= item.querySelector('div.metadata.salary-snippet-container > div') && item.querySelector('div.metadata.salary-snippet-container > div').innerText
            const companyName = item.querySelector('span.companyName') && item.querySelector('span.companyName').innerText
            if(salary===null){
                salary="not defined"
            }
            data.list.push({
                title:title,
                salary:salary,
                companyName:companyName,
                link:link
            })
        })
        return data;
        }, data)

        console.log(`successfully collected ${jobData.list.length} products`)
       
        let response = await jobData;
        //convert from an object to string and making json file and writing data to it
        let json = await JSON.stringify(jobData,null,2)
        fs.writeFile('jobs.json', json, 'utf8', () => {
            console.log('succesfully written data')
        });

        browser.close();
        
        return response;
}

module.exports = main;