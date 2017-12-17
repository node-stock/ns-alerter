import { SlackAlerter } from './alerter';
import * as assert from 'power-assert';
import * as types from 'ns-types';
import { OrderSide } from 'ns-types';

const testSendSignal = async () => {
  const signal: types.Model.Signal = {
    symbol: 'btc_jpy',
    price: 2280000,
    side: types.OrderSide.Buy
  }
  await SlackAlerter.sendSignal(signal);
}

const testSendTrade = async () => {
  const order: types.LimitOrder = {
    price: 2300,
    symbol: 'btc_jpy',
    orderType: types.OrderType.Limit,
    tradeType: types.TradeType.Margin,
    side: types.OrderSide.Buy,
    amount: 0.001,
    eventType: types.EventType.Order
  };
  await SlackAlerter.sendTrade(order);
  order.price = 2400;
  order.side = types.OrderSide.Sell;
  await SlackAlerter.sendTrade(order, 1000);
}


describe('警报测试', () => {
  it('测试发送信号警报', testSendSignal);
  it('测试发送交易警报', testSendTrade);
});
