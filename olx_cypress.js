var OLX_LOGIN = ""
var OLX_PASS = ""
var OLX_MESSAGE = ""
var WAITING_TIME = 780000 // 60000 = 60s // 600000 = 10 min // 840000 = 14 min // 780000 = 13 min //

beforeEach(function () {
  cy.log('Will sign on to OLX.PL')
  cy.clearCookies()
  cy.getCookies().should('be.empty')
  cy.clearLocalStorage()
  cy.visit('https://olx.pl', {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15'})
  cy.clearCookies()
  cy.getCookies().should('be.empty')
  cy.clearLocalStorage()
  cy.get('div[class="inlblk rel"]').click()
  cy.get('input[id="userEmail"]').first().type(OLX_LOGIN)
  cy.get('input[id="userPass"]').first().type(OLX_PASS)
  cy.get('button[id="se_userLogin"]').contains('Zaloguj się').click()
  cy.get('button[class="cookie-close abs cookiesBarClose"]').contains('Akceptuj i Zamknij').click()
})

function check(url) {
    cy.log('Visit site')
    cy.get('body').then((body) => {
        if (body.find('div[id="offer_removed_by_user"]').length > 0) {
            cy.log('Add has been removed by user')
            cy.screenshot(url);
        }
        else if (body.find('div[class="overh vmiddle pding10 pdingleft15"]').length > 0) {
            cy.log('Add is not active')
            cy.screenshot(url);
        }
        else {
            cy.log('Writing message.')
            if (body.find('div[data-rel="phone"]').length > 0) {
                cy.get('ul#contact_methods').get('div[data-rel="phone"]').click()
            }
            cy.get('ul#contact_methods').contains(' Napisz wiadomość ').click()
            cy.get('body').then((body) => {
                if (body.find('span[class="link spoiler small"]').length > 0) {
                    cy.get('span[class="link spoiler small"]').click()
                    cy.get('h1[class="lheight28 brkword marginbott20 marginright280"]').then(($btn) => {
                    const txt = $btn.text()
                    $btn.focus()
                    cy.log(txt)
                    })
                }
                cy.get('body').then((body) => {
                    if (body.find('div[class="g-recaptcha"]').length > 0) {
                        cy.pause();
                    }
                });
                cy.get('textarea[id="ask-text"]').focus().type(OLX_MESSAGE)
                cy.screenshot(url)
                cy.get('input[data-cy="contact_page_answer_submit"]').focus().click()
                cy.log(Cypress.moment().format('h:mm:ss'))
                cy.wait(WAITING_TIME)
            })
        }
    })
}

function check_ad_isactive(url) {
    cy.log('Check if ad is available')
    cy.visit(url, {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15'})
    cy.wait(1000)
    cy.get('body').then((body) => {
        if (body.find('div[id="ad-not-available-box"]').length > 0) {
            cy.log('Add is not active')
            }
        else {
            cy.log ('Add is active')
            check(url);
        }
        });
}

describe('Open url', function() {
    it('Read file', function() {
        cy.fixture('olx_urls_20032019.json').then(urls => {
        for (let i = 0; i < urls.length; i++) {
            cy.log(urls[i]['url'])
            check_ad_isactive(urls[i]['url'])
        }
        });
    },
    )
})
