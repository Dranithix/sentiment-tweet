/**
 * Created by Kenta Iwasaki on 17/3/2017.
 */

import Twitter from 'twitter';
import qs from 'querystring';
import _ from 'lodash';

import retext from 'retext';
import sentiment from 'sentiment';

let analyze = (text) => sentiment(text).score;

const oauth = {
    consumer_key: 'VwaSNl4HQjY1E3u792ooAVw98',
    consumer_secret: 'WCEbk4TVU9UUWdThJaFSoS25SHi5dHf7THbjFDqeD6hybVenvc',
    access_token_key: '841143129910665217-QKtQPI3UXCiSNPagpwlGzPfXSGRjooK',
    access_token_secret: '8GE0qpwwUtLGqa5QBdF7yuuSY2IlzXpBxZkmo4fRRVr80'
}

let userIndex = 0;
const client = new Twitter(oauth);

let report = [
    {
        user: '@CruiseNorwegian',
        sentiment: 0.0,
        numTweets: 0,
    },
    {
        user: '@RoyalCaribbean',
        sentiment: 0.0,
        numTweets: 0,
    },
    {
        user: '@CarnivalPr',
        sentiment: 0.0,
        numTweets: 0
    }
]

setInterval(() => {
    client.get('search/tweets',
        {
            q: report[userIndex % report.length].user,
            count: 100,
            max_id: report[userIndex % report.length].max_id
        },
        (err, response, res) => {
            const tweets = _.map(_.filter(response.statuses,
                tweet => tweet.user.screen_name.toLowerCase() !== report[userIndex % report.length].user.replace("@", "").toLowerCase()), 'text');

            let results = qs.parse(response.search_metadata.next_results);
            report[userIndex % report.length].max_id = results['?max_id'];
            report[userIndex % report.length].numTweets += tweets.length;
            report[userIndex % report.length].sentiment = _.sumBy(tweets, tweet => analyze(tweet)) / tweets.length;

            console.log(report[userIndex % report.length]);

            userIndex++;
        }
    );
}, 5000);
