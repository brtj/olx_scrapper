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
  cy.get('input[id="userEmail"]').first().type('')
  cy.get('input[id="userPass"]').first().type('')
  cy.get('button[id="se_userLogin"]').contains('Zaloguj się').click()
  cy.get('button[class="cookie-close abs cookiesBarClose"]').contains('Akceptuj i Zamknij').click()
})

function check(url) {
    cy.wait(15000)
    cy.log('Visit site')
    cy.get('body').then((body) => {
        if (body.find('div[id="offer_removed_by_user"]').length > 0) {
            cy.log('Add has been removed by user')
            cy.screenshot(url);
        }
        else {
            cy.log('Writing message.')
            cy.get('ul#contact_methods').get('div[data-rel="phone"]').click()
            cy.get('ul#contact_methods').contains(' Napisz wiadomość ').click()
            cy.get('span[class="link spoiler small"]').click()
            cy.get('h1[class="lheight28 brkword marginbott20 marginright280"]').then(($btn) => {
            const txt = $btn.text()
            $btn.focus()
            cy.log(txt)
            })
            cy.get('body').then((body) => {
                if (body.find('div[class="g-recaptcha"]').length > 0) {
                    cy.pause();
                }
            });
            var message = "Dzień dobry,\nCzy byliby Państwo zainteresowani interaktywnym spacerem 3D, który zwiększyłby atrakcyjność ogłoszenia i pozwoliłby potencjalnym kupującym przyjrzeć się mieszkaniu o każdej porze dnia i nocy?\n\nPrzykładowy spacer 3D:\nhttps://my.matterport.com/show/?m=8fgikm4hwyf\n\nJeżeli zdecydują się Państwo na dany spacer i pozwolą bym mógł umieścić mieszkanie w realizacjach na stronie, to proponuje kwotę 150 zł brutto. W pozostałych przypadkach obowiązuje cennik, który znajduje się na stronie.\nhttp://www.jarosky.com\n\nZapraszam do kontaktu za pomocą formularza znajdującego się na stronie, mailowo lub przez olx.pl\nPozdrawiam\nBartosz Jarocki"
            cy.get('textarea[id="ask-text"]').focus().type(message)
            cy.screenshot(url)
            cy.get('input[data-cy="contact_page_answer_submit"]').focus().click()
            cy.wait(1200000) // 60000 = 60s // 600000 = 10 min // 300000 = 5 min
        }
    })
}

function check_ad_isactive(url) {
    cy.log('Check if ad is available')
    cy.visit(url, {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15'})
    cy.get('body').then((body) => {
        if (body.find('div[id="ad-not-available-box"]').length > 0) {
            cy.log('Add is not active')
            cy.screenshot(url);
            }
        else {
            cy.log ('Add is active')
            check(url);
        }
        });
}

describe('Open url', function() {
    it('Read file', function() {
        cy.fixture('olx_urls_12032019.json').then(urls => {
        for (let i = 0; i < urls.length; i++) {
            cy.log(urls[i]['url'])
            check_ad_isactive(urls[i]['url'])
        }
        });
    },
    )
})
