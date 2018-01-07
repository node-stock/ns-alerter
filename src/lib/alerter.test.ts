import { SlackAlerter } from './alerter';
import * as assert from 'power-assert';
import * as types from 'ns-types';
import { OrderSide } from 'ns-types';

const testSendSignal = async () => {
  const signal: types.Model.Signal = {
    symbol: 'btc_jpy',
    price: '2280000',
    side: types.OrderSide.Buy,
    timeframe: types.CandlestickUnit.Min5
  }
  await SlackAlerter.sendSignal(signal);
}

const testSendSignal2 = async () => {
  const signal: types.Model.Signal = {
    symbol: 'btc_jpy',
    price: '2280000',
    side: types.OrderSide.Buy,
    timeframe: types.CandlestickUnit.Min30
  }
  await SlackAlerter.sendSignal(signal);
}

const testSendOrder = async () => {
  const order: types.LimitOrder = {
    account_id: 'test',
    price: '2300',
    symbol: 'ltc_btc',
    symbolType: types.SymbolType.cryptocoin,
    orderType: types.OrderType.Limit,
    tradeType: types.TradeType.Margin,
    side: types.OrderSide.Buy,
    amount: '0.001',
    eventType: types.EventType.Order,
    backtest: '1'
  };
  await SlackAlerter.sendOrder(order);
  order.price = '2400';
  order.side = types.OrderSide.Sell;
  await SlackAlerter.sendOrder(order);
}

const testSendEarning = async () => {
  const earing: types.Earning = {
    account_id: 'test',
    symbol: 'btc_jpy',
    type: 'cryptocoin',
    side: 'buy_close',
    quantity: '0.00421125',
    profit: '42.1125',
    pips: '10000',
    open: '1675000',
    close: '1685000',
    fee: '0',
    backtest: '1'
  };
  await SlackAlerter.sendEarning(earing);
}


describe('警报测试', () => {
  it('测试发送信号警报', testSendSignal);
  it('测试发送信号警报2', testSendSignal2);
  // it('测试发送下单警报', testSendOrder);
  // it('测试发送收益警报', testSendEarning);
});
