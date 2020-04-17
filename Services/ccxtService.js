const ccxt = require('ccxt');

module.exports = class CcxtService {
    async GetTickers(exchange) {
        console.log(`[${exchange}] GetTickers`);
        const exch = new ccxt[exchange.toLowerCase()]();
        if (exch.has['fetchTickers']) {
            try {
                const exchTickers = await exch.loadMarkets();
                return exchTickers;
            }
            catch (e) {
                console.log(`ERROR! Failed to get tickers info with ccxt. Error: ${e}`);
                return null;
            }
        } else {
            return null;
        }
    }
}