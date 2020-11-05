const config = require("platformsh-config").config();

const credentials = config.credentials('search');
console.log(credentials)

console.log(config.getRoute("search")["url"])

// for row in $(echo "${sample}" | jq -r '.[] | @base64'); do
//     _jq() {
//      echo ${row} | base64 --decode | jq -r ${1}
//     }

//    echo $(_jq '.name')
// done

// for route in $(echo "$PLATFORM_RELATIONSHIPS" | base64 --decode | jq ): do 
//     _jq() {
//         echo ${route} | base64 --decode | jq -r ${1}
//     }
// done

// echo $PLATFORM_ROUTES | base64 --decode | jq 'if .[].id == "search" then . end'

// echo $PLATFORM_ROUTES | base64 --decode | jq -r '.[] | select(.id == "search) | .'