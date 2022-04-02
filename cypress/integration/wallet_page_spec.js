/// <reference types="cypress" />

describe('Tests wallet page functionality', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000/address/1LBjea2jcEmM2uenWqX6NnzhbdMVUzqoJs')
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
        });
    })
  
    it('Wallet page displays details correctly ', () => {
        cy.get('.QRContainer').should('be.visible')
        cy.get('.AddressInfo').should('be.visible')
        cy.get('.AddressInfo > tr > td').contains('td', '1LBjea2jcEmM2uenWqX6NnzhbdMVUzqoJs');
        cy.get('.AddressInfo > tr').eq(5).contains('td', 'Value');
        cy.get('.AddressInfo > tr').eq(5).contains('td', '$');
    })

    it('Filter buttons work correctly ', () => {
        cy.get('.TransactionTable').should('be.visible')
        cy.get('input[type=checkbox]').eq(0).uncheck()
        cy.get('input[type=checkbox]').eq(1).uncheck()
        cy.get('.AddressTransaction').should('not.exist')

        cy.get('input[type=checkbox]').eq(0).check()
        cy.get('.AddressTransaction[type=Received]').should('be.visible')

        cy.get('input[type=checkbox]').eq(1).check()
        cy.get('.AddressTransaction[type=Spent]').should('be.visible')
    })

    it('Download buttons work correctly', () => {
        cy.get('.downloadButton').should('be.visible').click()
        cy.task('downloads', 'cypress/downloads').then(after => {
            expect(after.length).to.be.eq(1)  
        })
        cy.get('.downloadTransactionButton').should('be.visible').click()
        cy.task('downloads', 'cypress/downloads').then(after => {
            expect(after.length).to.be.eq(2)  
        })
    })
})
  
