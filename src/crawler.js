import axios from "axios";

async function crawl() {
    let count = 0;
    for (let l = 0; l < 5; l++) {
        for (let d = 1; d < 4; d++) {
            count += await crawlDivision(l, d);
        }
    };
    console.log('==========================');
    console.log(`${count} total entries`);
}

async function crawlDivision(l, d) {
    let count = 0;
    let resultSet;
    let off = 0;
    do {
        try {
            const response = await axios.get(`https://clans.worldofwarships.eu/clans/wows/ladder/api/structure/?league=${l}&division=${d}&limit=100&offset=${off}`);
            resultSet = response.data;
            console.log(`League ${l} Division ${d} page ${off / 100} : ${resultSet.length} results`);
            count += resultSet.length;
            off += 100;
        } catch (e) {
            console.error(e);
            break;
        }
    } while (resultSet.length > 0);
    return count;
}
crawl();

