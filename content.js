// I used the following tutorials, along with Eric's recorded lecture, to develop the JSON file that identifies amazon product pages and displays insert below:
// https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world
// https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
// https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
// https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab

// Variables
let popup = "gutcheck"
let highlightClass = "gutcheck-highlight"

let iconCheckSVG = `<svg id="gutcheck-header-icon" width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.1558 31.1158C24.3156 31.1158 25.2558 30.1756 25.2558 29.0158C25.2558 27.856 24.3156 26.9158 23.1558 26.9158C21.996 26.9158 21.0558 27.856 21.0558 29.0158C21.0558 30.1756 21.996 31.1158 23.1558 31.1158Z" stroke="#0F1111" stroke-width="2.23158" stroke-miterlimit="10"/>
<path d="M13.7959 31.1158C14.9557 31.1158 15.8959 30.1756 15.8959 29.0158C15.8959 27.856 14.9557 26.9158 13.7959 26.9158C12.6361 26.9158 11.6959 27.856 11.6959 29.0158C11.6959 30.1756 12.6361 31.1158 13.7959 31.1158Z" stroke="#0F1111" stroke-width="2.23158" stroke-miterlimit="10"/>
<path d="M27.1958 24.1958H9.80584L9.20584 18.3358L7.43584 3.11578L1.11584 2.75578" stroke="#0F1111" stroke-width="2.23158" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M29.4958 6.79577H32.3158L27.9158 20.7958H9.48584L7.86584 6.79577H10.0758" stroke="#0F1111" stroke-width="2.23158" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.7958 16.3758C24.0098 16.3758 27.4258 12.9597 27.4258 8.74578C27.4258 4.53185 24.0098 1.11579 19.7958 1.11579C15.5819 1.11579 12.1658 4.53185 12.1658 8.74578C12.1658 12.9597 15.5819 16.3758 19.7958 16.3758Z" stroke="#2ECC71" stroke-width="2.23158" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.9659 5.67579L18.4059 12.0058L15.8959 9.60578" stroke="#2ECC71" stroke-width="2.23158" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

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

// Had to write a new function to get the brand name of a product, which is generally the first word for fashion listings
// This will allow me to search Good On You for the brand name
function getBrand(productTitle) {
	// I am using split() to get the first word of the product title
	let firstWord = productTitle.split(" ")[0]

	// I am using replace() to remove any punctuation from the first word
	// I found this technique on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
	return firstWord.replace(/[^a-zA-Z0-9]/g, "")
}

// Swap icon when user clicks a search option
// Adapted from event listener and if else demos on course site/

// Had to google how to use the ! operator to check for false: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT
function gutcheckIconSwap(gutcheckElement) {
	gutcheckElement.addEventListener("click", function (event) {
		if (gutcheckElement.dataset.headerIcon === "check") {
			return
		}

		let link = event.target.closest("a")

		if (!link) {
			return
		}

		if (!gutcheckElement.contains(link)) {
			return
		}

		let clickedSearchGoogle = link.classList.contains("btn1")
		let clickedDropdownOption = link.closest(".dropdown-content")

		if (link.classList.contains("btn1")) {
			clickedSearchGoogle = true
		} else if (link.closest(".dropdown-content")) {
			clickedDropdownOption = true
		}

		if (!clickedSearchGoogle && !clickedDropdownOption) {
			return
		}

		gutcheckElement.dataset.headerIcon = "check"
		let icon = gutcheckElement.querySelector("#gutcheck-header-icon")

		if (icon) {
			icon.outerHTML = iconCheckSVG
		}
	})
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

	let googleMapsSearch = encodeURIComponent(productTitle)
	let googleMapsURL = `https://www.google.com/maps/search/${googleMapsSearch}`

	let indieBoundSearch = encodeURIComponent(productTitle)
	let indieBoundURL = `https://www.indiebound.org/search/book?keys=${indieBoundSearch}`

	let facebookMarketplaceSearch = encodeURIComponent(productTitle)
	let facebookMarketplaceURL = `https://www.facebook.com/marketplace/category/search/?query=${facebookMarketplaceSearch}`

	// I used ChatGPT to help me come up with some alternate search engines and ways of filtering results to add as alternative buttons in the dropdown: https://chatgpt.com/share/69dfda87-75ac-83ea-b4bb-62da792c3614
	
	// I followed up by asking the LLM to find the unique search queries for different websites (without writing any code): https://chatgpt.com/share/69dfda87-75ac-83ea-b4bb-62da792c3614

	// SVGs obtained from: https://lucide.dev/icons/
	return `
		<div id ="${popup}" class="a-box">
			<section class="headerrow">
				<h1>Gut Check</h1>
				<svg id="gutcheck-header-icon" width="34" height="32" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.04 31C24.1998 31 25.14 30.0598 25.14 28.9C25.14 27.7402 24.1998 26.8 23.04 26.8C21.8802 26.8 20.94 27.7402 20.94 28.9C20.94 30.0598 21.8802 31 23.04 31Z" stroke="#0F1111" stroke-width="2" stroke-miterlimit="10"/>
				<path d="M13.68 31C14.8398 31 15.78 30.0598 15.78 28.9C15.78 27.7402 14.8398 26.8 13.68 26.8C12.5202 26.8 11.58 27.7402 11.58 28.9C11.58 30.0598 12.5202 31 13.68 31Z" stroke="#0F1111" stroke-width="2" stroke-miterlimit="10"/>
				<path d="M27.08 24.08H9.69L9.09 18.22L7.32 3L1 2.64" stroke="#0F1111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M29.38 6.68H32.2L27.8 20.68H9.37L7.75 6.68H9.96" stroke="#0F1111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M19.68 16.26C23.8939 16.26 27.31 12.8439 27.31 8.63C27.31 4.41607 23.8939 1 19.68 1C15.4661 1 12.05 4.41607 12.05 8.63C12.05 12.8439 15.4661 16.26 19.68 16.26Z" stroke="#0F1111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M17.85 5.37V11.89" stroke="#0F1111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M21.51 5.37V11.89" stroke="#0F1111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</section>

			<p class="emphasis">Do you <span>really</span> need this today?</p>

			<p>
				Search for similar products, check if this product is available in your area, or shop secondhand:
			</p>

			<div class="split-button-container">
				<div class="split-button-row">
						<a href="${googleURL}" target="_blank" class="btn1">
							Search Google
						</a>

					<div class ="dropdown">
						<button class="btn2" type="button">
							<i class="a-icon a-icon-extender-expand"></i>
						</button>
					</div>
				</div>

				<div class="dropdown-content">
					<a href="${googleMapsURL}" target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
					Search Nearby
					</a>
					<a href="${facebookMarketplaceURL}" target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store-icon lucide-store"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/></svg>
					Secondhand Listings
					</a>
					<a href="${indieBoundURL}" target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>
					Local Bookstores
					</a>
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

	let gutcheckElement = document.getElementById(popup)
	if (gutcheckElement) {
		gutcheckIconSwap(gutcheckElement)
		gutcheckElement.classList.add(highlightClass)
		
		// Had to google how to remove the highlight class after a certain amount of time: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout

		// This removes the highlight class after 280ms, which is the duration of the shake animation.
		window.setTimeout(() => {
			gutcheckElement.classList.remove(highlightClass)
		}, 280)
	}
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
