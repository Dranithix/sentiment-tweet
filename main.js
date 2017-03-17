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
        user: '@CarnivalPR',
        sentiment: 0.0,
        numTweets: 0
    },
    {
        user: '@CarnivalOz',
        sentiment: 0.0,
        numTweets: 0
    },
    {
        user: '@pandocruises',
        sentiment: 0.0,
        numTweets: 0
    },
    {
        user: '@LindBladExp',
        sentiment: 0.0,
        numTweets: 0
    }
]

setInterval(() => {
    while (report[userIndex % report.length].stop) {
        console.log(report[userIndex % report.length]);
        userIndex++;
    }
    client.get('search/tweets',
        {
            q: report[userIndex % report.length].user,
            count: 100,
            max_id: report[userIndex % report.length].max_id,
            result_type: 'recent'
        },
        (err, response, res) => {
            const tweets = _.map(_.filter(response.statuses, status => status.user.screen_name.toLowerCase() !== report[userIndex % report.length].user.replace("@", "").toLowerCase()), 'text');

            let results = response.search_metadata;
            report[userIndex % report.length].stop = results.max_id_str ? undefined : true;
            report[userIndex % report.length].max_id = results.max_id_str;
            report[userIndex % report.length].numTweets += tweets.length;

            const averaging = report[userIndex % report.length].sentiment != 0;
            report[userIndex % report.length].sentiment += _.sumBy(tweets, tweet => analyze(tweet)) / tweets.length;
            if (averaging) report[userIndex % report.length].sentiment /= 2;

            console.log(report[userIndex % report.length]);

            userIndex++;
        }
    );
}, 5000);
