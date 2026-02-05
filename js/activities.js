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

	//DONE: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityList
	  },
	  //DONE: Add mark and encoding
	  "mark": "bar",
      "encoding": {
        "x": {
            "field": "type", 
            "type": "nominal", 
            "title": "Activity Type",
            "sort": "-y" // Sort by height
        },
        "y": {
            "field": "count", 
            "type": "quantitative", 
            "title": "Count"
        }
      }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//DONE: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	// Create a list of just the top 3 names
    let top3_names = topActivities.slice(0, 3).map(a => a.type);

    let graph2_data = tweet_array
        .filter(t => t.source === "completed_event" && top3_names.includes(t.activityType))
        .map(t => {
            return {
                activity: t.activityType,
                distance: t.distance,
                day: t.time.toLocaleDateString("en-US", {weekday: "short"}),
                day_num: t.time.getDay() 
            };
        });
	let dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    let distance_vis_spec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "description": "Distances by day of the week",
      "data": {
        "values": graph2_data
      },
      "mark": "point",
      "encoding": {
        "x": {
            "field": "day", 
            "type": "ordinal", 
            "title": "Day of the Week",
            "sort": dayOrder
        },
        "y": {
            "field": "distance", 
            "type": "quantitative", 
            "title": "Distance (Miles)"
        },
        "color": {
            "field": "activity",
            "type": "nominal",
            "legend": {"title": "Activity Type"} 
        }
      }
    };
    vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	//Show means graph
	let toggleButton = document.getElementById("aggregate");
    let showingMeans = false;

    toggleButton.addEventListener("click", () => {
        if (showingMeans) {
            // Switch back to show all
            distance_vis_spec.encoding.y = {
                "field": "distance", 
                "type": "quantitative", 
                "title": "Distance (Miles)"
            };
            distance_vis_spec.mark = "point";
            toggleButton.innerText = "Show means";
            showingMeans = false;
        } else {
            // Switch to show means
            distance_vis_spec.encoding.y = {
                "field": "distance", 
                "type": "quantitative", 
                "title": "Average Distance (Miles)", 
                "aggregate": "average"
            };
            distance_vis_spec.mark = "point"; 
            toggleButton.innerText = "Show all activities";
            showingMeans = true;
        }
        //Re-draw graph
        vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
    });

	// Hard code ??? from graph
    document.getElementById("longestActivityType").innerText = "bike";
    document.getElementById("shortestActivityType").innerText = "walk";
    document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});