/**
 * Created by Eric on 6/15/15.
 */

var tickers = $.getJSON("data/nasdaqlisted.json");
var dropdownLength = 10; // how many items in the drop down menu
var entryLength = 50; // length in characters for how long list items can be before being truncated

$('.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1}
    ,
    {
        name: 'tickers',
        limit: dropdownLength,
        source: SubstringMatcher(tickers, dropdownLength, entryLength),
        templates: {
            empty: [
                '<div class="empty-message text-danger">',
                'Couldn\'t find any stocks or tickers for the NASDAQ with this search result.',
                '</div>'
            ].join('\n')}
    });

function SubstringMatcher (strs, ddLen, eLen) {
    return function findMatches(q, cb) {
        var matches, partMatches, regStarts, regHas, count, str;

        matches = [];       // an array that will be populated with tickers that have exact substring matches
        partMatches = [];   // an array that will be populated with tickers and names that have partial substring matches
        count = 0;
        str = null;

        // regex used to determine if a string starts with or contains the substring `q`
        regStarts = new RegExp("(^" + q + ")", 'i');
        regHas = new RegExp("(^.*" + q + ".*$)", 'i');

        strs.responseJSON.forEach(function (obj) {
            if (count >= ddLen) { return; }

            str = obj["Symbol"] + " | " + obj["Security Name"];

            if (regStarts.test(obj["Symbol"])) {     // Check first to see if the Symbol is a direct match or has exact matching letters
                matches.push(Trim(str));
                count++;
            } else if (partMatches.length < ddLen) { // If just a partial match instead and the partial match array isn't full of partial matches already,
                if (regHas.test(str)) {              // push to a "backup" array for when there aren't enough exact matches.
                    partMatches.push(Trim(str));     // Checks both the Symbol and Security Name for partial matches
                }
            }
        });

        // if there aren't enough Tickers starting with the exact query, then add the partial results to the final result to try and hit the dropdown quota
        if (matches.length < ddLen) {
            matches = matches.concat(partMatches);
        }

        // trims the length of the ticker + company name to the desired length based on entryLength. Can be improved
        function Trim(trimmed) {
            if (trimmed.length > eLen) {
                return trimmed.substr(0, eLen) + "...";
            } else return trimmed;
        }
        cb(matches);
    }
}