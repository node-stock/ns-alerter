import * as types from 'ns-types';
import * as moment from 'moment';
import * as fetch from 'isomorphic-fetch';
const config = require('config');

/**
  * @class
  * @classdesc 信号警报器
  */
export class SlackAlerter {
  static async sendSignal(signal: types.Model.Signal) {
    const requestOptions = {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        channel: signal.symbol.includes('_') ? '#coin' : '#kdj',
        attachments: [
          {
            color: signal.side === 'buy' ? 'danger' : 'good',
            title: '商品：' + signal.symbol,
            text: signal.notes,
            fields: [
              {
                title: '价格',
                value: signal.price + '',
                short: true
              },
              {
                title: '方向',
                value: signal.side === 'buy' ? '买入' : '卖出',
                short: true
              }
            ],
            footer: '5分钟KDJ   ' + moment().format('YYYY-MM-DD hh:mm:ss'),
            footer_icon: !signal.symbol.includes('_') ?
              'https://platform.slack-edge.com/img/default_application_icon.png' : 'https://png.icons8.com/dusk/2x/bitcoin.png'
          }
        ]
      })
    };
    return await fetch(config.slack.url, requestOptions);
  }
  static async sendTrade(order: types.Order, profit?: number) {
    const body = {
      channel: '#coin_trade',
      attachments: [
        {
          color: order.side === types.OrderSide.Buy ? 'danger' : 'good',
          title: '商品：' + order.symbol,
          fields: [
            {
              title: '价格',
              value: order.price + '',
              short: true
            },
            {
              title: '方向',
              value: order.side === types.OrderSide.Buy ? '买入' : '卖出',
              short: true
            },
            {
              title: '数量',
              value: order.amount + '',
              short: true
            }
          ],
          footer: 'AI自动交易   ' + moment().format('YYYY-MM-DD hh:mm:ss'),
          footer_icon: 'https://png.icons8.com/dusk/2x/event-accepted.png'
        }
      ]
    };
    if (profit) {
      body.attachments[0].fields.push({
        title: '盈利',
        value: profit + '',
        short: true
      });
    }

    const requestOptions = {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(body)
    };
    return await fetch(config.slack.url, requestOptions);
  }
}
