// I used the following tutorials, along with Eric's recorded lecture, to develop the JSON file that identifies amazon product pages and displays the alert below:
// https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world
// https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
// https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
// https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab

// alert("Do you really want to buy this today?")

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
	return `
		<div id ="${popup}">

			<h1>Amazon Gut Check</h1>

			<h2>Do you really need this today?</h2>

			<h3>${productTitle}</h3>

			<p>
				Here are some nearby locations with <span>${productTitle}</span> in stock.
			</p>

			<ul>
				<li><button>Location 1</button></li>
				<li><button>Location 2</button></li>
				<li><button>Location 3</button></li>
			</ul>
	` 
}

function insertPopup() {
	if (document.getElementById(popup)) {
		return
	}

	let insertProductTitle = getProductTitle()
	let popupHTML = createPopup(insertProductTitle)

	document.body.insertAdjacentHTML("beforeend", popupHTML)
}

insertPopup()




