const DepthWorker  =require('./depthWorker');

const worker = new DepthWorker('Bitfinex', 'bitfinex2');
worker.StartWorker();