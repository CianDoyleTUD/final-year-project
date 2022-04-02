/// <reference types="cypress" />

describe('Test home page loads correctly and all elements work as expected', () => {
    beforeEach(() => {
    cy.viewport(1920, 1080)
      cy.visit('http://localhost:3000')
    })
  
    it('All main elements are visible', () => {
      cy.get('.HomePage').should('be.visible', true)
      cy.get('.NavBar').should('be.visible', true)
      cy.get('.NavBar').should('be.visible', true)
      cy.get('.statWidgetContainer').should('be.visible', true)
      cy.get('.SearchBarContainer').should('be.visible', true)
      cy.get('.Latest').should('be.visible', true)
    })
  
    it('Latest block is clickable and opens block page', () => {
        cy.get('.LatestBlocks').eq(1).should('be.visible', true)
        cy.get('.LatestTableRow > td > a').eq(0).click()
        cy.url().should('include', '/block/')
        cy.get('.BlockInfo').should('be.visible')
        cy.get('.BlockTransactions').should('be.visible')
    })

    it('Latest transaction is clickable and opens transaction page', () => {
        cy.get('.LatestBlocks').eq(1).should('be.visible', true)
        cy.get('.LatestTableRow > td > a').eq(5).click()
        cy.url().should('include', '/tr/')
        cy.get('.TransactionID').should('be.visible')
    })
  })
  