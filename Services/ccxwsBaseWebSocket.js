const ccxws = require("ccxws");

module.exports = class ccxwsBaseWebSocket {
    getExchangeObject(exchange) {
        try{
            const exch = new ccxws[exchange] ();
            if(exch){
                return exch;
            }
            console.log(exch);
        }
        catch(error){}
        try {
            switch (exchange.toLowerCase()) {
                case 'binance':
                    const exchangeBinance = new ccxws.binance({requestSnapshot: false});
                    return exchangeBinance;
                case 'bittrex':
                    const exchangeBittrex = new ccxws.bittrex({requestSnapshot: false});
                    return exchangeBittrex;
                case 'bitfinex':
                    const exchangeBitfinex = new ccxws.bitfinex({requestSnapshot: false});
                    return exchangeBitfinex;
                case 'coinbase':
                case 'coinbase pro':
                    const exchangeCoinbase = new ccxws.coinbasepro({requestSnapshot: false});
                    return exchangeCoinbase;
                case 'hitbtc':
                    const exchangeHitBTC = new ccxws.hitbtc2({requestSnapshot: false});
                    return exchangeHitBTC;
                case 'huobi':
                case 'huobi pro':
                        const exchangeHuobi = new ccxws.huobipro({requestSnapshot: false});
                    return exchangeHuobi;
                case 'kuna':
                    const exchangeKuna = new ccxws.kuna({requestSnapshot: false});
                    return exchangeKuna;
                case 'poloniex':
                    const exchangePoloniex = new ccxws.poloniex({requestSnapshot: false});
                    return exchangePoloniex;
                default:
                    //console.log(`ccxws doesn't support the exchange ${exchange}`);
                    return null;
            }
        }
        catch (error) {
            console.log(error);
        }
    };
}