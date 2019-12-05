const moment = require('moment')

module.exports = (env) => {
  env.addFilter('getUsername', (value) => {
    if (value.firstname && value.lastname && value.firstname != '' && value.lastname != '') {
      return value.firstname + ' ' + value.lastname
    }
    return value.email.split('@')[0];
  })

  env.addFilter('prettyDate', (value) => {
    return moment(value).utcOffset(1).format('DD MMM YYYY')
  })

  env.addFilter('prettyDateHour', (value) => {
    return moment(value).utcOffset(1).format('DD MMM YYYY à HH:mm')
  })

  env.addFilter('json', (value, spaces) => {
    if (value instanceof nunjucks.runtime.SafeString) {
      value = value.toString()
    }
    const jsonString = JSON.stringify(value, null, spaces).replace(/</g, '\\u003c')
    return nunjucks.runtime.markSafe(jsonString)
  })

  env.addFilter('prettyMoney', (amount, decimalCount = 0, decimal = ",", thousands = ".") => {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "")
  })
}