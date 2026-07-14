import { expect } from "chai";
import { Builder, Browser, By, until, Key } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

let service = new chrome.ServiceBuilder(
    "C:\\webdriver\\chromedriver-win64\\chromedriver.exe"
);

let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeService(service)
    .build();


const searchText = "Thermos";

async function testRun(){

    console.log("START");

    await driver.get("https://demo.evershop.io/");

    //console.log("SITE OPEN");

    await driver.sleep(3000);

    await driver.manage().window().maximize();
        await driver.sleep(2000); 
        await driver.findElement(By.className("search__icon")).click();  
        await driver.sleep(2000); 
        await driver.findElement(By.xpath("//input[@placeholder='Search']")).sendKeys(searchText, Key.ENTER);
         await driver.sleep(5000); 


     const lowerSearch = searchText.toLowerCase();
    //  console.log(`//a[contains(@href, ${lowerSearch})]/div/h3`)
        const searchResult = await driver.findElements(By.xpath(`//a[contains(@href, ${lowerSearch})]/div/h3`));
        console.log(searchResult.length)
        for(let i=0; i< searchResult.length;i++){
            let elementText = await searchResult[i].getText();
            expect(elementText).to.contain(searchText);
            await driver.actions({bridge:true}).move({origin:searchResult[i]}).perform();
            await driver.sleep(2000);
            await driver.findElement(By.xpath(`(//button[text()='Add to Cart'])[${i+1}]`)).click();
            await driver.sleep(2000);
            await driver.findElement(By.xpath("//button[contains(.,'Close')]")).click();
        }

        await driver.findElement(By.xpath("//button[contains(@class,'mini-cart-icon')]")).click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath("//button[text()='Checkout']")).click();
        await driver.sleep(2000); 

        //verify product
        
        const products = await driver.findElements(
            By.xpath("//ul[contains(@class,'item__summary__list')]/li")
        );
        
        let expectedSubtotal = 0;
      
        for (const product of products) {
        
            const name = await product.findElement(
                By.xpath(".//div[contains(@class,'font-semibold')][1]")
            ).getText();
        
         
            const qty = parseInt(
                await product.findElement(
                  By.xpath(".//span[contains(@class,'rounded-full')]")  
                ).getText()
            );
        
        
            let linePrice = await product.findElement(
                By.xpath(".//div[contains(@class,'ml-auto')]//div")
            ).getText();
        
            linePrice = parseFloat(linePrice.replace("$", ""));
        
        
            console.log("------------------------");
            console.log("Product :", name);
            console.log("Quantity :", qty);
            console.log("Line Price :", linePrice);
              
           expectedSubtotal += linePrice;
        }
        
        console.log("------------------------");
        console.log("Expected Subtotal :", expectedSubtotal);  
        
        let subtotalText = await driver.findElement(
            By.xpath("//div[text()='Sub total']/parent::div")
        ).getText();
        
        subtotalText = subtotalText
            .replace("Sub total", "")
            .replace("$", "")
            .trim();
        
        const actualSubtotal = parseFloat(subtotalText);
        
        console.log("Actual Subtotal :", actualSubtotal);
        expect(actualSubtotal).to.equal(expectedSubtotal);

        
        let totalText = await driver.findElement(
            By.xpath("//div[contains(@class,'grand-total')]/div[last()]")
        ).getText();
        
        console.log(totalText);
        
        totalText = totalText
            .replace("Total", "")
            .replace("$", "")
            .trim();
        
        const actualTotal = parseFloat(totalText);
        console.log("Actual Total :", actualTotal);
        
        expect(actualTotal).to.equal(expectedSubtotal);
        
        console.log("Price Verification Passed");
        await driver.sleep(3000);


        await driver.findElement(By.css("input[placeholder='Enter your email']")).sendKeys("test@gmail.com");
        await driver.sleep(2000);
        await driver.findElement(By.css("input[placeholder='Full name']")).sendKeys("Test");
        await driver.sleep(2000);
        await driver.findElement(By.css("input[placeholder='Telephone']")).sendKeys("0123456789");
        await driver.sleep(2000);
        await driver.findElement(By.css("input[placeholder='Address']")).sendKeys("XYZ");
        await driver.sleep(2000);
        await driver.findElement(By.css("input[placeholder='Address 2']")).sendKeys("989");
        await driver.sleep(2000);
        await driver.findElement(By.css("input[placeholder='City']")).sendKeys("Dhaka");
        await driver.sleep(2000);
        
        // Open the dropdown
await driver.findElement(By.id("field-shippingAddress.country")).click();

await driver.sleep(2000);

// Click the option (example: Bangladesh)
await driver.findElement(By.xpath("//div[@role='option' and normalize-space()='Vietnam']")).click();

await driver.sleep(2000);

await driver.findElement(By.id("field-shippingAddress.province")).click();

await driver.sleep(2000);

// Click the option (example: Bangladesh)
await driver.findElement(By.xpath("//div[@role='option' and normalize-space()='Ben Tre']")).click();
await driver.sleep(2000);

await driver.findElement(By.css("input[placeholder='Postcode']")).sendKeys("100");
await driver.sleep(2000);

await driver.findElement(
    By.xpath("//label[normalize-space()='Same as shipping address']")
).click();
await driver.sleep(2000);

await driver.findElement(
    By.xpath("//span[normalize-space()='Cash On Delivery']")
).click();
await driver.sleep(2000);

await driver.findElement(
    By.xpath("//button[contains(.,'Place Order')]")
).click();
await driver.sleep(2000);
    await driver.quit();

    console.log("DONE");
}


testRun();