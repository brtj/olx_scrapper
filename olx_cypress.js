var OLX_LOGIN = "YOUR-LOGIN"
var OLX_PASS = "YOUR-PASS"
var OLX_MESSAGE = "YOUR-MESSAGE"

beforeEach(function () {
  cy.log('Will sign on to OLX.PL')
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('https://olx.pl')
  cy.get('div[class="inlblk rel"]').click()
<<<<<<< HEAD
  cy.get('input[id="userEmail"]').first().type(OLX_LOGIN)
  cy.get('input[id="userPass"]').first().type(OLX_PASS)
=======
  cy.get('input[id="userEmail"]').first().type('YOUR-EMAIL')
  cy.get('input[id="userPass"]').first().type('YOUR-PASSWORD')
>>>>>>> parent of 23a84ed... Script update
  cy.get('button[id="se_userLogin"]').contains('Zaloguj się').click()

})

function check(url) {
<<<<<<< HEAD
    cy.wait(1000)
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
            cy.get('textarea[id="ask-text"]').focus().type(OLX_MESSAGE)
            cy.screenshot(url)
            cy.get('input[data-cy="contact_page_answer_submit"]').focus().click()
            cy.wait(1200000) // 60000 = 60s // 600000 = 10 min // 300000 = 5 min
        }
=======
    cy.log('Visit site')
    cy.visit(url)
    cy.get('ul#contact_methods').get('div[data-rel="phone"]').click()
    cy.get('ul#contact_methods').contains(' Napisz wiadomość ').click()
    cy.get('span[class="link spoiler small"]').click()
    cy.get('h1[class="lheight28 brkword marginbott20 marginright280"]').then(($btn) => {
    const txt = $btn.text()
    $btn.focus()
    cy.log(txt)
    cy.screenshot(url)
>>>>>>> parent of 23a84ed... Script update
    })
    var message = "testowa\nnowalinia"
    cy.get('textarea[id="ask-text"]').focus().type(message)
    cy.get('input[data-cy="contact_page_answer_submit"]').focus() //after test send it
    cy.wait(2000)

}

describe('Open url', function() {
    it('Read file', function() {
        cy.fixture('olx_urls.json').then(urls => {
        for (let i = 0; i < urls.length; i++) {
            cy.log(urls[i]['url'])
            check(urls[i]['url'])
        }
        });

    },
    )
})