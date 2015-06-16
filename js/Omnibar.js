var tickers = $.getJSON("data/nasdaqlisted.json");
var dropdownLength = 15; // how many items in the drop down menu
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
        var matches,partTickMatches, partMatches, regStarts, regHas, count, str;

        matches = [];           // array for tickers starting with the query and the final array that's returned
        partTickMatches = [];   // array for partial ticker matches
        partMatches = [];       // array for partial security name matches
        count = 0;              // variable to stop the loop from continuing if it finds ddLen full matches
        str = null;

        // regex used to determine if a string starts with or contains the substring `q`
        regStarts = new RegExp("(^" + q + ")", 'i');
        regHas = new RegExp("(^.*" + q + ".*$)", 'i');

        strs.responseJSON["Stocks"].forEach(function (obj) {
            if (count >= ddLen) { return; }

            str = obj["Symbol"] + " | " + obj["Security Name"];

            if (regHas.test(obj["Symbol"])) {
                if(regStarts.test(obj["Symbol"])){
                    matches.push(Trim(str));
                    count++;                                // Only increase count if there's a match for a ticker starting with the query
                } else if(partTickMatches.length < ddLen){
                    partTickMatches.push(Trim(str));
                }
            } else if (regHas.test(str)) {
                if (partMatches.length < ddLen) {
                    partMatches.push(Trim(str));
                }
            }
        });

        // if there aren't enough Tickers starting with the exact query, then add the partial results starting with partial ticker matches to keep them in order
        if (matches.length < ddLen) {
            matches = matches.concat(partTickMatches, partMatches);
        }

        // trims the length of the ticker + company name to the desired length based on entryLength. Can be improved
        function Trim(trimmed) {
            if (trimmed.length > eLen) {
                return trimmed.substr(0, eLen) + "...";
            } else return trimmed;
        }
        cb(matches.slice(0,ddLen));         // if matches is somehow larger than ddLen, then slice to ddLen and use that
    }
}