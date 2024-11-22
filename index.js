const currencyItemsFrom = document.querySelectorAll('.from-container .currency-list .currency');
const currencyItemsTo = document.querySelectorAll('.to-container .currency-list .currency');
const navItems = document.querySelectorAll('.nav-list .nav-item');

const fromInput = document.querySelector(".from-container .amount-input");
const toInput = document.querySelector(".to-container .amount-input");

let baseCode = ""
let targetCode = ""

let exchangeRateFrom = document.querySelector(".from-container .bottom-container .label");
let exchangeRateTo = document.querySelector(".to-container .bottom-container .label");

const connectionStatusElement = document.querySelector('.connection-status')
const defaultExchangeRate = 1
let lastChangedInput = "from"


function toggleClassActive(items) {
    items.forEach(item => {
        item.addEventListener('click', async () => {
            items.forEach(li => li.classList.remove('active-text'))
            item.classList.add('active-text')

            getBaseAndTargetCode()

            if (lastChangedInput === "from") {

                const conversionResult = await getConversionResult(baseCode, targetCode, fromInput.value)
                if (conversionResult !== null) {
                    toInput.value = conversionResult.toFixed(3)
                }
                else {
                    toInput.value = fromInput.value
                }
            }
            else if (lastChangedInput === "to") {
                const conversionResult = await getConversionResult(targetCode, baseCode, toInput.value)
                if (conversionResult !== null) {
                    fromInput.value = conversionResult.toFixed(3)
                }
                else {
                    fromInput.value = toInput.value
                }
            }

            const exchangeRateBase = await getExchangeRates(baseCode, targetCode)
            console.log(exchangeRateBase)
            exchangeRateFrom.textContent = `1 ${baseCode} = ${exchangeRateBase || defaultExchangeRate} ${targetCode}`

            const exchangeRateTarget = await getExchangeRates(targetCode, baseCode);
            exchangeRateTo.textContent = `1 ${targetCode} = ${exchangeRateTarget || defaultExchangeRate} ${baseCode}`
        })
    })
}

fromInput.addEventListener("input", async () => {
    fromInput.value = fromInput.value.replace(',', '.')

    fromInput.value = fromInput.value.replace(/[^0-9.]/g, '')

    if ((fromInput.value.match(/\./g) || []).length > 1) {
        fromInput.value = fromInput.value.replace(/\.(?=.*\.)/, '')
    }

    lastChangedInput = "from"
    const amount = fromInput.value

    if (baseCode && targetCode && amount) {
        const conversionResult = await getConversionResult(baseCode, targetCode, amount)

        if (conversionResult !== null) {
            toInput.value = conversionResult.toFixed(3)
        }
        else {
            toInput.value = amount
        }
    }

    if (amount === '') {
        fromInput.value = ''
        toInput.value = ''
    }

})

toInput.addEventListener("input", async () => {

    toInput.value = toInput.value.replace(',', '.')

    toInput.value = toInput.value.replace(/[^0-9.]/g, '')

    lastChangedInput = "to"

    if ((toInput.value.match(/\./g) || []).length > 1) {
        toInput.value = toInput.value.replace(/\.(?=.*\.)/, '')
    }


    const amount = toInput.value

    if (baseCode && targetCode && amount) {
        const conversionResult = await getConversionResult(targetCode, baseCode, amount)

        if (conversionResult !== null) {
            fromInput.value = conversionResult.toFixed(3)
        }
        else {
            fromInput.value = amount
        }
    }
    if (amount === '') {
        fromInput.value = ''
        toInput.value = ''
    }
})

async function getConversionResult(baseCode, targetCode, amount) {
    try {
        if (amount) {
            const response = await fetch(
                `https://v6.exchangerate-api.com/v6/dd5b0c6a97dd24dc2cd52d10/pair/${baseCode}/${targetCode}/${amount}`
            )
            const data = await response.json()

            if (data["conversion_result"] !== undefined) {
                hideConnectionStatus()
                return data["conversion_result"]
            } else {
                throw new Error("Invalid API Response")
            }
        }
    } catch (err) {
        console.error("Error fetching conversion data:", err)
        return null
    }
}

async function getExchangeRates(baseCode, targetCode) {
    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/dd5b0c6a97dd24dc2cd52d10/latest/${baseCode}`
        )
        const data = await response.json()

        if (data["conversion_rates"] !== undefined) {
            hideConnectionStatus()
            return data["conversion_rates"][`${targetCode}`]
        } else {
            throw new Error("Invalid API Response")
        }
    } catch (err) {
        console.error("Error fetching conversion data:", err)
        return defaultExchangeRate
    }
}

function getBaseAndTargetCode() {
    currencyItemsFrom.forEach(item => {
        if (item.classList.contains("active-text")) {
            baseCode = item.textContent
        }
    })

    currencyItemsTo.forEach(item => {
        if (item.classList.contains("active-text")) {
            targetCode = item.textContent
        }
    })
}

function showConnectionStatus() {
    connectionStatusElement.style.display = 'flex'
}

function hideConnectionStatus() {
    connectionStatusElement.style.display = 'none'
}

window.addEventListener('offline', () => {
    showConnectionStatus()
    console.warn('You are offline')
})

window.addEventListener('online', () => {
    hideConnectionStatus()
    console.info('You are back online')
})


window.addEventListener('DOMContentLoaded', async () => {
    getBaseAndTargetCode()

    if (baseCode && targetCode) {
        try {
            const conversionResult = await getConversionResult(baseCode, targetCode, fromInput.value)
            if (conversionResult !== null) {
                toInput.value = conversionResult.toFixed(3)
            } else {
                toInput.value = fromInput.value
            }

            const exchangeRateBase = await getExchangeRates(baseCode, targetCode)
            exchangeRateFrom.textContent = `1 ${baseCode} = ${exchangeRateBase || defaultExchangeRate} ${targetCode}`

            const exchangeRateTarget = await getExchangeRates(targetCode, baseCode);
            exchangeRateTo.textContent = `1 ${targetCode} = ${exchangeRateTarget || defaultExchangeRate} ${baseCode}`
        } catch (error) {
            console.error('Error during initial data fetch:', error)
        }
    } else {
        console.warn('Base code or target code is missing. Please check your setup.')
    }
})


toggleClassActive(currencyItemsFrom)
toggleClassActive(currencyItemsTo)
toggleClassActive(navItems)

getBaseAndTargetCode()
