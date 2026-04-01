// I used the following tutorials, along with Eric's recorded lecture, to develop the JSON file that identifies amazon product pages and displays the alert below:
// https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world
// https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
// https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts

// alert("Do you really want to buy this today?")

// let productName = document.querySelector('#productTitle')



let container = `
   <h1>Extension Logo</h1>
		<h2 id="product"></h2>
		<p>Do you really need this today?</p>
		<p>Here are some nearby locations with <span id="product-inline"></span> in stock.</p>
		<p>
			<ul>
				<li>
					Location 1
				</li>
				<li>
					Location 2
				</li>
				<li>
					Location 3
				</li>
			</ul>
		</p>
` 

// Query selector setup in progress

// document.addEventListened('DOMContentLoaded' () => {

//     let productHeading = document.querySelector('#product')
//     let productHeading = document.querySelector('#product-inline')

//     let linkItem =
//             `
//             <h2>${productName}</h2>
// 			`

// 		// And puts it into the page!
// 		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
// })


