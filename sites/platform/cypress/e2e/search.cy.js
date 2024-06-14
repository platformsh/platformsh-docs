//Both should return results for "opensearch"
//Only Upsun should return a match for "vertical scaling"
//Only platform should return a match for "24.55 gb"
describe("Home",()=>{
  beforeEach(()=>{
    if('local' == Cypress.env('environment')) {
      cy.intercept("/indexes/platform_docs/search*", { "hits":[] })
    }

    cy.visit("/")
  })

  context("Search tests",()=>{
    it("Search feature works", () => {
      ///cy.wait("@noSearchResults")
      //cy.intercept("/\/indexes\/platform_docs\/search[^q]+q=opensearch/",{ fixture: "searchosresults" }).as("searchresultsopensearch")
      console.log("Env is " + Cypress.env('environment'))
      console.log("Barfoo is " + Cypress.env('barfoo'))
      if('local' == Cypress.env('environment')) {
        cy.intercept({
          pathname: '/indexes/platform_docs/search',
          query: {
            q: 'opensearch'
          }
        },{ fixture: "searchosresults" }).as("searchresultsopensearch")
      }

      cy.get("#searchwicon-header").type("opensearch")

      if ('local' == Cypress.env('environment')) {
        cy.wait('@searchresultsopensearch')
      }

      cy.get("#xssroot").find("h2").as("searchresultsheader")
      cy.get("@searchresultsheader")
        .should("exist")
        .contains("Documentation")
      cy.get("#xssroot").find("li").contains("OpenSearch").should("exist")
    })
  })
})
