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
	let firstTweet = tweet_array[tweet_array.length - 1];
	let firstDateString = firstTweet.time.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});

	//Update HTML
	document.querySelector("#firstDate").innerText = firstDateString;

	//Same thing for last tweet
	let lastTweet = tweet_array[0];
	let lastDateString = lastTweet.time.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});

	document.querySelector("#lastDate").innerText = lastDateString;

	//Counters
    let completedCount = 0;
    let liveCount = 0;
    let achievementCount = 0;
    let miscCount = 0;
    let writtenCount = 0;

    tweet_array.forEach(function(tweet){
        if(tweet.source === "completed_event"){
            completedCount++;
        } else if (tweet.source === "live_event"){
            liveCount++;
        } else if (tweet.source === "achievement"){
            achievementCount++;
        } else {
            miscCount++;
        }

        //Check for written text
        if (tweet.source === "completed_event" && tweet.written === true) {
            writtenCount++;
        }
    });

    //Calculate percentages
    let total = tweet_array.length;
    let completedPct = (completedCount / total * 100).toFixed(2);
    let livePct = (liveCount / total * 100).toFixed(2);
    let achievementPct = (achievementCount / total * 100).toFixed(2);
    let miscPct = (miscCount / total * 100).toFixed(2);

    // Calculate written percentage
    let writtenPct = 0;
    if (completedCount > 0) {
        writtenPct = (writtenCount / completedCount) * 100;
    }
    writtenPct = writtenPct.toFixed(2);

    //Update HTML
    //Counts
    updateText("completedEvents", completedCount);
    updateText("liveEvents", liveCount);
    updateText("achievements", achievementCount);
    updateText("miscellaneous", miscCount);
    updateText("written", writtenCount);

    //Percentages
    updateText("completedEventsPct", completedPct + "%");
    updateText("liveEventsPct", livePct + "%");
    updateText("achievementsPct", achievementPct + "%");
    updateText("miscellaneousPct", miscPct + "%");
    updateText("writtenPct", writtenPct + "%");
}

//Updates text of ALL elements with a specific class
function updateText(className, text) {
    let elements = document.getElementsByClassName(className);
    for(let i = 0; i < elements.length; i++) {
        elements[i].innerText = text;
    }
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});