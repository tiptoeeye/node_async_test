const cron = require('node-cron');
const DepthWebSocket = require('./Services/depthWebSocket');
const CcxtService = require('./Services/ccxtService');
const dateFormat = require('dateformat');

module.exports = class DepthWorker {
    constructor(exchange, ccxtExchName) {
        this.exchange = exchange;
        this.ccxtExchName = ccxtExchName;
        this.tickers = [];
        this.depths = {};
        this.depthWS = new DepthWebSocket();
        this.ccxt = new CcxtService();
    }

    StartWorker() {
        this.depthWS.init(this.exchange.toLowerCase(),
            (snapshot) =>
            this.OnNewDepthShapshot(snapshot),
            (depthUpdate) =>
            this.OnNewDepthUpdate(depthUpdate)
        );

        this.StartM1_Timer();
        this.LoadExchangesTickersAndStart();
    }

    StartM1_Timer() {
        console.log('Set M1 timeout!');
        cron.schedule("0 * * * * *", () => {
            this.Save();
        });
    }

    async LoadExchangesTickersAndStart(renew = false) {
        const exchTickers = await this.ccxt.GetTickers(this.ccxtExchName);
        this.tickers =  Object.values(exchTickers);

        this.tickers.forEach(tickerObj => { //filter(x=>x.quote === 'USD') //.filter(x=>x.ticker === 'BTCUSDT')
            this.depthWS.connectDepthUpdates(tickerObj, this.exchange.toLowerCase(),
                (snapshot) =>
                    this.OnNewDepthShapshot(snapshot),
                (depthUpdate) =>
                    this.OnNewDepthUpdate(depthUpdate)
            );
        });
    }


    // ====== SAVE DEPTH into DB
    async Save () {
        console.log(`[${dateFormat(Date.now(), "yyyy-mm-dd h:MM:ss l")}] SAVE DEPTH`);
    }

    getTickerObjByUnifiedTicker(ticker) {
        return this.tickers.find(x => x.symbol === ticker);
    }

    async OnNewDepthShapshot(snapshot) {
        if(this.depths[snapshot.marketId] === undefined) {
            console.info('snapshot', snapshot.marketId, Object.keys(this.depths).length);
            const tickerObj = this.getTickerObjByUnifiedTicker(snapshot.marketId);
            this.depths[snapshot.marketId] = {
                marketId: snapshot.marketId,
                asks: [...snapshot.asks.map(x => ({ price: x.price, size: x.size }))],
                bids: [...snapshot.bids.map(x => ({ price: x.price, size: x.size }))],
            };

            //disconnect snapshot WS and leave only updates
            this.depthWS.disconnectDepthSnapshots(tickerObj, this.exchange.toLowerCase());
        } else {
            console.log(`AGAIN??? ${snapshot.marketId}`);
        }
        // await this.setImmediatePromise();
    }

    async OnNewDepthUpdate(depthUpdate) {
        if(this.depths[depthUpdate.marketId]) {
            // console.log(`update ${depthUpdate.marketId}`);
        } 
        // await this.setImmediatePromise();
    }
    
    setImmediatePromise() {
        return new Promise((resolve) => {
          setImmediate(() => resolve());
        });
    }

    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        });
    }
}