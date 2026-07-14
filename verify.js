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
        

//Step 1: সব Product বের করা

const products = await driver.findElements(
    By.xpath("//ul[contains(@class,'item__summary__list')]/li")
);

//Step 2  expectedSubtotal = 0; আমরা সব product-এর price যোগ করব। প্রথমে কিছুই যোগ হয়নি।

let expectedSubtotal = 0;

// step 3 .....  products = পুরো array ,product = array-এর একটি item (প্রতি iteration-এ একটি করে)

for (const product of products) {

    //Step 4  Product Name      .//মানেCurrent Product এর ভিতরে খুঁজো
    //<li>  <div class="font-semibold"> Stainless Steel Thermos - Black </div></li>
    // .//div li theke div a jbe jkhne black,white pabe pick korbe.

    const name = await product.findElement(
        By.xpath(".//div[contains(@class,'font-semibold')][1]")
    ).getText();

    //Step 5  Quantity

    const qty = parseInt(
        await product.findElement(
           // By.xpath(".//span[contains(@class,'rounded-full')]")  // quantitty er class .
 // .//span[contains('rounded-full h-4 w-4 flex')]  .// means current position.
 // parseInt ata string ke int a nibe. ex: "2", = 2
            By.xpath(".//span[contains(@class,'rounded-full')]")  
        ).getText()
    );

    //  step 6 price...Line Price (Example: $70.00) Line Price বলতে নির্দিষ্ট product line-এর মোট দাম বোঝায়।
    // এখানে . = current product (li) , ml-auto = price-এর parent div ,//div = যার ভিতরে $70.00 আছে

// for <div class="price"> <span>$70.00</span> </div> locator will be..
// By.xpath(".//div[contains(@class, 'price')]//span")
// for <p class="line-price">$70.00</p> = By.xpath(".//p[contains(@class,'line-price')]")

    let linePrice = await product.findElement(
        By.xpath(".//div[contains(@class,'ml-auto')]//div")
    ).getText();

// step 7 Dollar Remove  float to number

    linePrice = parseFloat(linePrice.replace("$", ""));

// step 8 console product name, quantity, line price.

    console.log("------------------------");
    console.log("Product :", name);
    console.log("Quantity :", qty);
    console.log("Line Price :", linePrice);

// step 9 Subtotal Calculate  expectedSubtotal = expectedSubtotal + linePrice
// 1st iteration                               = 0+70
                                //             =  70
// 2nd iteration                               = 70+35
                                //             =  105                           

    expectedSubtotal += linePrice;
}

console.log("------------------------");
console.log("Expected Subtotal :", expectedSubtotal);   // expectedSubtotal = 105 

// step 10 subtotal locator ----- Read Actual Subtotal

//parent:: মানে হলো বর্তমান element-এর এক ধাপ উপরের (parent) element-এ যাওয়া।
// jokhn //div[text()='Sub total']/parent::div 
// tkhn <div class="summary-row">  <div>Sub total</div>  <div>$70.00</div> </div>
// তাহলে XPath এক ধাপ উপরে যাবে summary-row te
// shudhu price ber korte chaile //div[text()='Sub total']/parent::div/div[2] -> div[2] jekhne 70 ache
//কিন্তু getText() parent div-এর সব visible text একসাথে নিয়ে আসে।
// .getText(); likhle (Sub total $70.00) parent-এর ভেতরের সব child-এর text একসাথে দেয়। 
// akhete alada //div lge na , .getText() info ber kore ane.
// summary ->    //div[text()='Sub total'] → "Sub total"
//         ->     /parent::div → তার parent
//         ->     /div[2] → parent-এর দ্বিতীয় div (যেখানে price আছে)

let subtotalText = await driver.findElement(
    By.xpath("//div[text()='Sub total']/parent::div")
).getText();

// step 11 cleaning==== Sub total $70.00 er theke oproyojonio jinish soriye dbe.
//.replace("Sub total", "") = "Sub total"-কে খালি string ("") দিয়ে replace করছে।
//.replace("$", "") = $ চিহ্নটি সরিয়ে দিচ্ছে। 70.00
//.trim() = শুরুর ও শেষের space, newline (\n), tab ইত্যাদি সরিয়ে দেয়।

subtotalText = subtotalText
    .replace("Sub total", "")
    .replace("$", "")
    .trim();

 // subtotalText string a ache tai (parseFloat) diye eke number a nea hoyeche

const actualSubtotal = parseFloat(subtotalText);

console.log("Actual Subtotal :", actualSubtotal);


//step 12 Verify  = expectedSubtotal and actualSubtotal

expect(actualSubtotal).to.equal(expectedSubtotal);

//step 13 total find total a tax, charge , vat include thake tai total ber krte hbe.
//  ✅ সব Line Price-এর যোগফল = Subtotal, ✅ Subtotal + Tax = Total

// Read Actual Total
// for //span[text()='Total' output = total (jehetu total thke price ber korte hbe
// tai upore ancestor a class grand total a gle price ashbe
// jodi price er individual locator thkto ex <span class="price">$75.00</span>
//tahole locator hto //span[@class='price']

// let totalText = await driver.findElement(
//     By.xpath("//span[text()='Total']/ancestor::div[contains(@class,'grand-total')]")
// ).getText();

//Total bix er Text = Total Inclusive tax $105 regex 105 ber korbe. tai /\$([\d.]+)\s*$/
//        /\$([\d.]+)\s*$/
//   \$ কারণ Regex-এ $-এর আলাদা অর্থ আছে (end of string), তাই আসল $ বোঝাতে \ ব্যবহার করা হয়েছে।
// ([\d.]+) \d = যেকোনো digit (0-9), . = decimal point, + = এক বা একাধিক.
// \s* = 0 বা তার বেশি whitespace শেষে space থাকলেও match করবে)
// $ =  String-এর একেবারে শেষে। অর্থাৎ $75.00 যদি string-এর শেষে থাকে, তাহলেই match করবে।

//const match = totalText.match(/\$([\d.]+)\s*$/);

// after regex match hbe [
  //"$75.00",   // match[0]
  //"75.00"     // match[1]
//]
//match[1] = "75.00" (এটি string)
//parseFloat(match[1]) = 75 (এটি number) 

// to ignore regex use it -> By.xpath("//div[contains(@class,'grand-total')]/div[last()]")
// /div[last()] = div er last part nibe

//   //div[1] প্রথম child div, (//div)[1]	পুরো document-এর প্রথম div,  //div[2]	দ্বিতীয় div
//   //div[last()]	শেষ div,  //div[last()-1]	শেষ থেকে আগের div,  //div[position()=3]	তৃতীয় div

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

// const actualTotal = parseFloat(match[1]);
// console.log("Actual Total :", actualTotal);

//step 14 final verify
expect(actualTotal).to.equal(expectedSubtotal);

console.log("Price Verification Passed");

// ===============================================
// ===== PROFESSIONAL PRICE VERIFICATION END =====
// ===============================================

    await driver.sleep(3000);


    await driver.quit();

    console.log("DONE");
}


testRun();