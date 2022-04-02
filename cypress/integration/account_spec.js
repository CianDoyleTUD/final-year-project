/// <reference types="cypress" />

describe('Test account functionality (logging in, creating account, logging out)', () => {
    beforeEach(() => {
    cy.viewport(1920, 1080)
      cy.visit('http://localhost:3000')
    })
  
    it('Logging in works and user token is set correctly', () => {
        cy.get('.loginButton')
            .should('be.visible')   
            .click()
        cy.get('input[type=text]').type("admin")
        cy.get('input[type=password]').type("admin")
        cy.get('.submitButton').click()
        cy.wait(1000)

        cy.visit('http://localhost:3000/')
        cy.window()
            .its("sessionStorage")
            .invoke("getItem", "username")
            .should("exist");
    })

    it('Logging out works and user token is removed correctly', () => {
        cy.get('.loginButton')
            .should('be.visible')
            .contains("Logged in as")
            .click()
        cy.get('.AccountDropdown')
            .invoke('show')
            .contains("Sign out")
            .click()
        cy.get('.loginButton')
            .should('be.visible')
            .contains("Log in")
        cy.visit('http://localhost:3000/')
        cy.window()
            .its("sessionStorage")
            .invoke("getItem", "username")
            .should("equal", '');
    })
     
})
  