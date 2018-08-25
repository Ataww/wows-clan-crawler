# wows-clan-crawler
wows clan api crawler, EU server.

# Scripts

Using npm or their yarn equivalent.

> npm run build

To build

> npm run crawl {tag} {tag}...

To run the crawler.
Optional parameter {tag} will give you the rank of the clan with that tag. You can add multiple tags and the lookup will be performed for all of them

# Issues

## tag having a - character

Clans that have - in their tag are not supported when using npm script due to the way arguments are parsed by npm. Run `node build/crawler.js {tag}...` instead.
