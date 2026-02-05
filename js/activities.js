function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Create map to count frequencies
	let activityCounts = {}; 

	tweet_array.forEach(function(tweet) {
		if (tweet.source === "completed_event") {
			let type = tweet.activityType;
			//Only count valid activities
			if (type !== "unknown") {
				if (activityCounts[type]) {
					activityCounts[type]++;
				} else {
					activityCounts[type] = 1;
				}
			}
		}
	});

	//Convert to array for sorting
	let activityList = [];
	for(let type in activityCounts){
		activityList.push({type: type, count: activityCounts[type]});
	}

	//Sort
	activityList.sort(function(a, b){
		return b.count - a.count;
	});

	//Update HTML
	//Count "Other" in the total number of types found
	document.getElementById("numberActivities").innerText = activityList.length;

	//List for the Top 3 (excluding "other")
	let topActivities = activityList.filter(item => item.type !== "other");

	document.getElementById("firstMost").innerText = topActivities[0].type;
	document.getElementById("secondMost").innerText = topActivities[1].type;
	document.getElementById("thirdMost").innerText = topActivities[2].type;

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});