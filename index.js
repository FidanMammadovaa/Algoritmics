const currencyItemsFrom = document.querySelectorAll('.from-container .currency-list .currency');
const currencyItemsTo = document.querySelectorAll('.to-container .currency-list .currency');
const navItems = document.querySelectorAll('.nav-list .nav-item');

const fromInput = document.querySelector(".from-container .amount-input");
const toInput = document.querySelector(".to-container .amount-input");

let baseCode = "";
let targetCode = "";

let exchangeRateFrom = document.querySelector(".from-container .bottom-container .label");
let exchangeRateTo = document.querySelector(".to-container .bottom-container .label");

const connectionStatusElement = document.querySelector('.connection-status')
const defaultExchangeRate = 1;

function toggleClassActive(items) {
    items.forEach(item => {
        item.addEventListener('click', async () => {
            items.forEach(li => li.classList.remove('active-text'))
            item.classList.add('active-text')

            getBaseAndTargetCode()

            const conversionResult = await getConversionResult(baseCode, targetCode, fromInput.value)
            if (conversionResult !== null) {
                toInput.value = conversionResult.toFixed(3)
            }
            else {
                toInput.value = fromInput.value
            }

            const exchangeRateBase = await getExchangeRates(baseCode, targetCode)
            exchangeRateFrom.textContent = `1 ${baseCode} = ${exchangeRateBase || defaultExchangeRate} ${targetCode}`

            const exchangeRateTarget = await getExchangeRates(targetCode, baseCode);
            exchangeRateTo.textContent = `1 ${targetCode} = ${exchangeRateTarget || defaultExchangeRate} ${baseCode}`
        })
    })
}

fromInput.addEventListener("input", async () => {
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
})

toInput.addEventListener("input", async () => {
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
})

async function getConversionResult(baseCode, targetCode, amount) {
    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/6eb73cf1c1ecadf0c0b2e2be/pair/${baseCode}/${targetCode}/${amount}`
        )
        const data = await response.json()

        if (data["conversion_result"] !== undefined) {
            hideConnectionStatus()
            return data["conversion_result"]
        } else {
            throw new Error("Invalid API Response")
        }
    } catch (err) {
        console.error("Error fetching conversion data:", err)
        showConnectionStatus()
        return null
    }
}

async function getExchangeRates(baseCode, targetCode) {
    try {
        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/6eb73cf1c1ecadf0c0b2e2be/latest/${baseCode}`
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
        showConnectionStatus()
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

toggleClassActive(currencyItemsFrom)
toggleClassActive(currencyItemsTo)
toggleClassActive(navItems)

getBaseAndTargetCode()
