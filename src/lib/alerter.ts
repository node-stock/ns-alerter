import * as types from 'ns-types';
import * as moment from 'moment';
import * as fetch from 'isomorphic-fetch';
import { BigNumber } from 'BigNumber.js';
import { Util, Log } from 'ns-common';
const config = require('config');

/**
  * @class
  * @classdesc 信号警报器
  */
export class SlackAlerter {
  static async sendSignal(signal: types.Model.Signal) {
    Log.system.info('发送信号警报[启动]');
    let channel = '#kdj';
    // 为数字货币时
    if (signal.symbol.includes('_')) {
      if (signal.timeframe === types.CandlestickUnit.Min5) {
        channel = '#coin';
      } else {
        Log.system.info('时间框架：', signal.timeframe);
        channel = '#coin_vip';
      }
    }
    const requestOptions = {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        channel,
        attachments: [
          {
            color: signal.side === 'buy' ? 'danger' : 'good',
            title: `【${signal.side === types.OrderSide.Buy ? '买入' : '卖出'}信号】${signal.symbol}`,
            text: signal.notes,
            fields: [
              {
                title: '时间框架',
                value: signal.timeframe,
                short: true
              },
              {
                title: '价格',
                value: new BigNumber(String(signal.price)).toFormat(),
                short: true
              }
            ],
            footer: `:${Util.getTradeAssetType(signal.symbol)}: KDJ策略   ${moment().format('YYYY-MM-DD HH:mm:ss')}`
          }
        ]
      })
    };
    Log.system.info('发送信号警报[终了]');
    return await fetch(config.slack.url, requestOptions);
  }

  static async sendOrder(order: types.Order) {
    Log.system.info('发送订单警报[终了]');
    const body = {
      channel: '#coin_trade',
      attachments: [
        {
          color: order.side === types.OrderSide.Buy ? 'danger' : 'good',
          title: `【${order.side === types.OrderSide.Buy ? '买入' : '卖出'}订单】${order.symbol}`,
          fields: [
            {
              title: '账号',
              value: order.account_id,
              short: true
            },
            {
              title: '交易模式',
              value: order.backtest === '1' ? '模拟交易' : '正常交易',
              short: true
            },
            {
              title: '价格',
              value: new BigNumber(order.price).toFormat(),
              short: true
            },
            {
              title: '数量',
              value: new BigNumber(order.amount).toFormat(),
              short: true
            }
          ],
          footer: `:${Util.getTradeAssetType(order.symbol)}: AI自动交易   ${moment().format('YYYY-MM-DD HH:mm:ss')}`
        }
      ]
    };

    const requestOptions = {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(body)
    };
    Log.system.info('发送订单警报[终了]');
    return await fetch(config.slack.url, requestOptions);
  }

  static async sendEarning(earning: types.Earning) {
    Log.system.info('发送收益警报[启动]');
    const body = {
      channel: '#coin_trade',
      attachments: [
        {
          color: 'warning',
          title: '【平仓收益】：' + earning.symbol,
          fields: [
            {
              title: '账号',
              value: earning.account_id,
              short: true
            },
            {
              title: '交易模式',
              value: earning.backtest === '1' ? '模拟交易' : '正常交易',
              short: true
            },
            {
              title: '建仓价格',
              value: new BigNumber(earning.open).toFormat(),
              short: true
            },
            {
              title: '平仓价格',
              value: new BigNumber(earning.close).toFormat(),
              short: true
            },
            {
              title: '数量',
              value: new BigNumber(earning.quantity).toFormat(),
              short: true
            },
            {
              title: '手续费',
              value: new BigNumber(earning.fee).toFormat(),
              short: true
            },
            {
              title: '收益',
              value: new BigNumber(earning.profit).toFormat(),
              short: true
            },
            {
              title: '点差',
              value: new BigNumber(earning.pips).toFormat(),
              short: true
            }
          ],
          footer: `:${Util.getTradeAssetType(earning.symbol)}: AI自动交易   ${moment().format('YYYY-MM-DD HH:mm:ss')}`
        }
      ]
    };

    const requestOptions = {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(body)
    };
    Log.system.info('发送收益警报[终了]');
    return await fetch(config.slack.url, requestOptions);
  }
}
