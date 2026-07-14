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
    By.xpath("//label[normalize-space()='Use a different billing address']")
).click();
await driver.sleep(2000);

await driver.findElement(By.id("field-billingAddress.full_name")).sendKeys("ABC Limited");
await driver.sleep(2000);
        
await driver.findElement(By.id("field-billingAddress.telephone")).sendKeys("223311");
await driver.sleep(2000);
 
await driver.findElement(By.id("field-billingAddress.address_1")).sendKeys("hkj");
await driver.sleep(2000);

await driver.findElement(By.id("field-billingAddress.address_2")).sendKeys("jkl");
await driver.sleep(2000);

await driver.findElement(By.id("field-billingAddress.city")).sendKeys("dhaka");
await driver.sleep(2000);

       // Open the dropdown
await driver.findElement(By.id("field-billingAddress.country")).click();
await driver.sleep(2000);

// Click the option (example: Bangladesh)
// await driver.findElement(By.xpath("//div[@role='option' and normalize-space()='United States']")).click();
// await driver.sleep(2000);

await driver.findElement(By.xpath("//*[normalize-space()='United States']")).click();
await driver.sleep(2000);

  // Open the dropdown
await driver.findElement(By.id("field-billingAddress.province")).click();
await driver.sleep(2000);

// Click the option (example: Bangladesh)
// await driver.findElement(By.xpath("//div[@role='option' and normalize-space()='Alaska']")).click();
// await driver.sleep(2000);

await driver.findElement(By.xpath("//*[normalize-space()='Alaska']")).click();
await driver.sleep(2000);

await driver.findElement(By.id("field-billingAddress.postcode")).sendKeys("100");
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