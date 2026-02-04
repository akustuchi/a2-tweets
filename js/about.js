function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	//Get first tweet and format the date
	let firstTweet = tweet_array[0];
	let firstDateString = firstTweet.time.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});

	//Update HTML
	document.querySelector("#firstDate").innerText = firstDateString;

	//Same thing for last tweet
	let lastTweet = tweet_array[tweet_array.length - 1];
	let lastDateString = lastTweet.time.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});

	document.querySelector("#lastDate").innerText = lastDateString;


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});