describe("Home",()=>{
  beforeEach(()=>{
    cy.visit("http://localhost:1313/")
  })

  context("Search tests",()=>{
    specify("Search feature works", () => {
      cy.get("#searchwicon-header").type("opensearch")
      cy.get("#xssroot").find("h2")
        .should("exist")
        .contains("Documentation")
    })
  })
})
