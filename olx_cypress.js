beforeEach(function () {
  cy.log('Will sign on to OLX.PL')
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('https://olx.pl')
  cy.get('div[class="inlblk rel"]').click()
  cy.get('input[id="userEmail"]').first().type('YOUR-EMAIL')
  cy.get('input[id="userPass"]').first().type('YOUR-PASSWORD')
  cy.get('button[id="se_userLogin"]').contains('Zaloguj się').click()

})

function check(url) {
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