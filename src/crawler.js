import axios from "axios";

const leagues = ["Hurricane", "Typhoon", "Storm", "Gale", "Squall"];

async function crawl(crawlFunction, args) {
    let count = 0;
    for (let l = 0; l < 5; l++) {
        for (let d = 1; d < 4; d++) {
            count += await crawlFunction(l, d, args);
        }
    };
    console.log('==========================');
    console.log(`${count} total entries`);
    return count;
}

async function crawlDivision(l, d) {
    let count = 0;
    let resultSet;
    let off = 0;
    do {
        try {
            const response = await axios.get(`https://clans.worldofwarships.eu/clans/wows/ladder/api/structure/?league=${l}&division=${d}&limit=100&offset=${off}`);
            resultSet = response.data;
            if (resultSet.length > 0) console.log(`League ${leagues[l]} Division ${d} page ${(off / 100) + 1} : ${resultSet.length} entries`);
            count += resultSet.length;
            off += 100;
        } catch (e) {
            console.error(e);
            break;
        }
    } while (resultSet.length > 0);
    return count;
}

// Flag to indicate the clan has been found.
let clanFound = false;

async function findClan(l, d, name) {
    if(clanFound) {
        return 0;
    }
    let count = 0;
    let resultSet;
    let off = 0;
    do {
        try {
            const response = await axios.get(`https://clans.worldofwarships.eu/clans/wows/ladder/api/structure/?league=${l}&division=${d}&limit=100&offset=${off}`);
            resultSet = response.data;
            if (resultSet.length > 0) console.log(`League ${leagues[l]} Division ${d} page ${(off / 100) + 1} : ${resultSet.length} entries`);
            const search = clanLookup(resultSet, name);
            if (search !== -1) {
                clanFound = true;
                count += search;
                break;
            } else {
                count += resultSet.length;
            }
            off += 100;
        } catch (e) {
            console.error(e);
            break;
        }
    } while (resultSet.length > 0);
    return count;
}

function clanLookup(division, name) {
    let i = 1;
    for (const clan of division) {
        if (clan.tag === name) {
            return i;
        }
        i++;
    }
    return -1;
}

async function clanRank(name) {
    const res = await crawl(findClan,name);
    if(clanFound) {
        console.log(`Clan ${name} found at rank ${res}`);
    } else {
        console.log(`No clan found with tag ${name}`);
    }
    // global cleanup
    clanFound = false;
}

if (process.argv.length > 2) {
    const clans = process.argv.slice(2);
    for (const clan of clans) {
        clanRank(clan);
    }
} else {
    crawl(crawlDivision);
}
