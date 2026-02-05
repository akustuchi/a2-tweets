class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //DONE: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        } else if (this.text.startsWith("Watch my")) {
            return "live_event";
        } else if (this.text.startsWith("Achieved")) {
            return "achievement";
        } else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //DONE: identify whether the tweet is written
        if(this.text.includes("Check it out!")){ //Automated message, not user written
            return false;
        }

        if(this.text.includes(" - ")){ // Usually means the user added a note
            return true;
        }

        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //DONE: parse the written text from the tweet
        let parts = this.text.split(" - ")
        //If there is a dash, return user text after it
        //Otherwise will return the whole text
        if(parts.length > 1 ){
            return parts[1];
        } else {
            return this.text;
        }
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //DONE: parse the activity type from the text of the tweet
        //Checking for keywords
        if (this.text.includes("run")) return "run";
        if (this.text.includes("hike")) return "hike";
        if (this.text.includes("walk")) return "walk";
        if (this.text.includes("swim")) return "swim";
        if (this.text.includes("bike")) return "bike";
        if (this.text.includes("yoga")) return "yoga";

        return "other";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //DONE: prase the distance from the text of the tweet
        // Split text to find number
        let parts = this.text.split(" ");
        let distanceInMiles = 0;
        
        //Look for "km" and use the number before it
        let kmIndex = parts.indexOf("km");
        if (kmIndex > 0){
            let kmValue = parseFloat(parts[kmIndex - 1]);
            if (!isNaN(kmValue)){
                distanceInMiles = kmValue / 1.609;
            }
        }

        //Look for "mi" and the number before it
        let miIndex = parts.indexOf("mi");
        if (miIndex > 0){
            let miValue = parseFloat(parts[miIndex - 1]);
            if (!isNaN(miValue)){
                distanceInMiles = miValue;
            }
        }
        return distanceInMiles;
    }

    getHTMLTableRow(rowNumber:number):string {
        //DONE: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let words = this.text.split(" ");
        
        //Loop through each word to find the URL
        let processedWords = words.map(word => {
            //Check if the word looks like a link
            if (word.startsWith("http")) {
                //Return the clickable HTML link
                return `<a href="${word}">${word}</a>`;
            }
            //Otherwise return the word as is
            return word;
        });

        let linkedText = processedWords.join(" ");

        return `<tr>
            <td>${rowNumber}</td>
            <td>${this.activityType}</td>
            <td>${linkedText}</td>
        </tr>`;
    }
}