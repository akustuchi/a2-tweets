let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//DONE: Filter to just the written tweets
	let tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    writtenTweets = tweet_array.filter(t => t.written);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	//Get the input box and the table
    let searchInput = document.getElementById("textFilter");
    let searchCountSpan = document.getElementById("searchCount");
    let searchTextSpan = document.getElementById("searchText");
    let tableBody = document.getElementById("tweetTable");

    // Listen for typing
    searchInput.addEventListener("input", () => {
        let filterText = searchInput.value.toLowerCase();
        
        searchTextSpan.innerText = filterText;

        // If the box is empty, clear the table
        if (filterText === "") {
            searchCountSpan.innerText = 0;
            tableBody.innerHTML = "";
            return;
        }

        //Filter the written tweets
        let filteredTweets = writtenTweets.filter(t => {
            return t.text.toLowerCase().includes(filterText);
        });

        searchCountSpan.innerText = filteredTweets.length;

        //Update the Table
        tableBody.innerHTML = "";
        
        filteredTweets.forEach((tweet, index) => {
            let rowHTML = tweet.getHTMLTableRow(index + 1);
            tableBody.innerHTML += rowHTML;
        });
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});