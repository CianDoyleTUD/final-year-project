/// <reference types="cypress" />

describe('Tests searchbar functionality', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000')
    })
  
    it('Searhbar loads on home page main elements are visible', () => {
        cy.get('.SearchBarContainer').should('be.visible')
    })

    it('Block can be searched by hash', () => {
        cy.get('input[type=text]').type("00000000000000305aaf9a4a98b6762204fba13dae98142875ff7557a51cb176{enter}")
        cy.get('.BlockInfo').should('be.visible')
        cy.get('.BlockTransactions').should('be.visible')
    })

    it('Transactions can be searched', () => {
        cy.get('input[type=text]').type("1ef4aaf31a06d5c0ff6e4eba2af055c130bea0d3cde787f0cbb71a95edc0ad71{enter}")
        cy.get('.TransactionID').should('be.visible')
    })

    it('Wallets can be searched', () => {
        cy.get('input[type=text]').type("1LBjea2jcEmM2uenWqX6NnzhbdMVUzqoJs{enter}")
        cy.get('.QRContainer').should('be.visible')
        cy.get('.AddressInfo').should('be.visible')
    })
})
  