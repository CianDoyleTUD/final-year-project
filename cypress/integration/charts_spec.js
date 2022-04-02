/// <reference types="cypress" />

describe('Tests chart page functionality', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
    })
  
    it('Chart page should ask for login details before viewing charts', () => {
        cy.visit('http://localhost:3000/analytics')
        cy.get('.LoginContainer').should('be.visible')
        cy.get('input[type=text]').type("admin")
        cy.get('input[type=password]').type("admin")
        cy.get('.submitButton').click()
        cy.wait(2000)
    })

    it('Chart page should no longer ask for details and shows charts', () => {
        cy.visit('http://localhost:3000/')
        cy.window()
            .its("sessionStorage")
            .invoke("getItem", "username")
            .should("exist");
        cy.visit('http://localhost:3000/analytics')
        cy.get('.recharts-surface').should('be.visible')
        cy.get('.recharts-layer.recharts-area').should('be.visible')
    })

    it('Chart zoom buttons function correctly', () => {
        cy.visit('http://localhost:3000/analytics')
        cy.get('button[value=30]').click()
        cy.get('.recharts-layer.recharts-area').should('be.visible')
        cy.get('.chartButtonContainer > button').first().click()
        cy.get('.recharts-layer.recharts-area').should('be.visible')
        
    })
    
    it('Chart can be changed to log scale', () => {
        cy.visit('http://localhost:3000/analytics')
        cy.get('select').first().select('logarithmic')
        cy.get('.recharts-layer.recharts-line').should('be.visible')
    })
})
  
//1LBjea2jcEmM2uenWqX6NnzhbdMVUzqoJs