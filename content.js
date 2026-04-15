// I used the following tutorials, along with Eric's recorded lecture, to develop the JSON file that identifies amazon product pages and displays insert below:
// https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world
// https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
// https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
// https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab

// Variables
let popup = "gutcheck"
// let closeButton = "close-button"

// Get product title from Amazon
function getProductTitle () {
	let productName = document.querySelector("#productTitle")

	if (!productName) {
		return "this product"
	}
	// Wanted to make sure any whitespace on either side of the product name doesn't show up
	// had to look up how to clip the ends of a String, referenced this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	 return productName.textContent.trim();
}

// Create popup with Amazon product title
function createPopup(productTitle) {

	// Did a google search for how to best insert a string into a URL and found the encodeURIComponent, which I used to embed the product name into a google search
	// I used MDN to determine wether or not to use encodeURI vs encodeURIComponent: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
	// I used encodeURIComponent because it will correctly interpret the spacing and special characters like &
	// Added 'in stock' to improve local specificity
	let googleSearch = encodeURIComponent(productTitle + " near me in stock")
	let googleURL = `https://www.google.com/search?q=${googleSearch}&tbm=shop`
	// ^^ Had to go down a rabbit hole on Moz to find out that all shopping traffic on google containes the parameter 'tbm=shop': https://moz.com/blog/tracking-google-shopping-traffic-with-google-analytics-14244
	// Using this parameter I can automatically funnel users into shopping search results
	


	// I asked ChatGPT to help me identify the best way to toggle on the 'nearby' filter within google shopping by default: https://chatgpt.com/share/69d6976f-031c-8332-9b58-d36e81d287dc
	// Unfortunately the short answer was that I can't reliably force the nearby toggle on Google shopping via the URL

	// This did make me think of another possibility to bypass google shopping altogether, and to just do a google map search for the product name. In that case, the js variables would be:

	// let googleSearch = encodeURIComponent(productTitle)
	// let googleURL = `https://www.google.com/maps/search/${googleSearch}`



	// Button structure borrowed from Amazon hence the weird spans
	return `
		<div id ="${popup}" class="a-box">

			<h1>Gut Check!</h1>

			<p class="emphasis">Do you <span>really</span> need this today?</p>

			<p>
				Check if this product is available for pickup nearby:
			</p>

			<div class="split-button-container">
					<a href="${googleURL}" target="_blank" class="btn1">
						Shop Elsewhere
					</a>

				<div class ="dropdown">
					<button class="btn2" type="button">
						<i class="a-icon a-icon-extender-expand"></i>
					</button>

					<div class="dropdown-content">
						<a href="">Search Local</a>
						<a href="">Search Bookstores</a>
					</div>
				</div>

			</div>

		</div>
	` 
}


// Updated function for inserting popup into Amazon DOM
function insertPopup() {
	if (document.getElementById(popup)) {
		return
	}

	// Found amazon ID for add to cart button and targeted it with a query selector:
	let buyNowButton = document.querySelector("#add-to-cart-button").closest(".a-button")
	// ^ Used closest element here because Amazon sometimes (but not always) wraps the button, so I needed to target the more general .a-button tag in those 
	// I had to google how to do this, which led me to the closest() element on MDN: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest

	if (!buyNowButton) {
		return
	}

	let insertProductTitle = getProductTitle()
	let popupHTML = createPopup(insertProductTitle)

	buyNowButton.insertAdjacentHTML("beforebegin", popupHTML)
}

insertPopup()


// Old function for inserting popup overlay
// function insertPopup() {
// 	if (document.getElementById(popup)) {
// 		return
// 	}

// 	let insertProductTitle = getProductTitle()
// 	let popupHTML = createPopup(insertProductTitle)

// 	document.body.insertAdjacentHTML("beforeend", popupHTML)
// }

// insertPopup()


// Event listener for mouseEnter/mouseLeave on Amazon buy now buttons, adapted from course site
let highlightClass = 'gutcheck-highlight'
let popupElement = document.getElementById(popup)
let buyButtonOne = document.querySelector("#add-to-cart-button")
let buyButtonTwo = document.querySelector("#submit\\.buy-now")


// Had to google the alternative to toggle for adding and removing classes, reminded myself of add/remove here: https://stackoverflow.com/questions/26736587/how-to-add-and-remove-classes-in-javascript-without-jquery#:~:text=Using%20classList:%20The%20%60classList%60%20property%20provides%20a,methods%20like%20%60add()%60%2C%20%60remove()%60%2C%20%60toggle()%60%2C%20and%20%60contains()%60.
function addHighlight() {
	if (popupElement) {
		popupElement.classList.add(highlightClass)
	}
}

function removeHighlight() {
	if (popupElement) {
		popupElement.classList.remove(highlightClass)
	}
}

// Also had to remind myself that hover does not work as a JS Element, and to use mouseenter/mouseleave instead: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event
if (buyButtonOne) {
	buyButtonOne.addEventListener("mouseenter", addHighlight)
	buyButtonOne.addEventListener("mouseleave", removeHighlight)
}

if (buyButtonTwo) {
	buyButtonTwo.addEventListener("mouseenter", addHighlight)
	buyButtonTwo.addEventListener("mouseleave", removeHighlight)
}
