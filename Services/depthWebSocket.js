const ccxwsBaseWebSocket = require('./ccxwsBaseWebSocket');

module.exports = class DepthWebSocket extends ccxwsBaseWebSocket  {

    init(exchange, onL2Snapshot, onL2Update) {
        function setTimeoutPromise(delay) {
            return new Promise((resolve) => {
              setTimeout(() => resolve(), delay);
            });
          }

        function setImmediatePromise() {
            return new Promise((resolve) => {
              setImmediate(() => resolve());
            });
        }
    
        if(this.theExchange === undefined) {
            this.theExchange = this.getExchangeObject(exchange);
        }

        this.theExchange.on("l2snapshot", async (snapshot) => {
                onL2Snapshot(snapshot);
                // await setImmediatePromise();
            });

        this.theExchange.on("l2update", async (l2update) => {
            onL2Update(l2update);
        });

    }

    connectDepthUpdates(tickerObj, exchange) {
        try {
            console.log(`connect to ${tickerObj.symbol}`);
            const market = this.getTickerMarket(tickerObj);
            this.theExchange.subscribeLevel2Updates(market);
        }
        catch (error) {
            console.log(error);
        }
    }

    connectDepthSnapshots(tickerObj, exchange) {
        try {
            console.log(`connect to ${tickerObj.symbol}`);
            const market = this.getTickerMarket(tickerObj);
            this.theExchange.subscribeLevel2Snapshots(market);
        }
        catch (error) {
            console.log(error);
        }
    }

    disconnectDepthSnapshots(tickerObj, exchange) {
        try {
            console.log(`disconnect snapshot ${tickerObj.symbol}`);
            const market = this.getTickerMarket(tickerObj);
            this.theExchange.unsubscribeLevel2Snapshots(market);
        }
        catch (error) {
            console.log(error);
        }
    }

    getTickerMarket(tickerObj) {
        return {
            id: `${tickerObj.base}${tickerObj.quote}`, // remote_id used by the exchange
            base: tickerObj.base, // standardized base symbol for Bitcoin
            quote: tickerObj.quote, // standardized quote symbol for Tether
        };
    }

}