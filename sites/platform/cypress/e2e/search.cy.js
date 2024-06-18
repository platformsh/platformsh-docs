//Both should return results for "opensearch"
//Only Upsun should return a match for "vertical scaling"
//Only platform should return a match for "24.55 gb"
describe("Home",()=>{
  beforeEach(()=>{
    if('local' == Cypress.env('environment')) {
      cy.intercept("/indexes/platform_docs/search*", { "hits":[] })
    }

    //cy.visit("/")
  })

  context("Search tests",()=>{
    it("Searches for something that should match in both", () => {
      cy.visit("/")
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
      cy.get("@searchresultsheader").should("exist")
      cy.get("@searchresultsheader").contains("Documentation")
      cy.get("#xssroot").find("li").contains("OpenSearch").should("exist")

      cy.get("#searchwicon-header").type("{enter}")
      cy.location("pathname").should(
        "eq",
        "/search.html"
      )

      cy.get("#xssSearchPage").find("h2").as("searchpageresults")
      cy.get("@searchpageresults").should("exist")
      cy.get("@searchpageresults").contains("Documentation")

      cy.get("#xssSearchPage").find("li").contains("OpenSearch").should("exist")

    })

    it("Searches for something that should not match on platformsh", ()=>{
      cy.visit("/")
      cy.get("#searchwicon-header").type("vertical scaling")
      cy.get("#xssroot").find("h2").as("searchresultsheader")
      cy.get("@searchresultsheader").should("exist")
      cy.get("@searchresultsheader").contains("No results")
      cy.get("#xssroot").find("p").contains("No documentation matched")

      cy.get("#searchwicon-header").type("{enter}")
      cy.location("pathname").should(
        "eq",
        "/search.html"
      )

      cy.get("#xssSearchPage").find("h2").as("searchpageresults")
      cy.get("@searchpageresults").should("exist")
      cy.get("@searchpageresults").contains("No results")
    })

    it("Searches for something that should ONLY match on platformsh", () => {
      cy.visit("/")
      if('local' == Cypress.env('environment')) {
        cy.intercept({
          pathname: '/indexes/platform_docs/search',
          query: {
            q: 'opensearch'
          }
        },{ fixture: "searchosresults" }).as("searchresultsopensearch")
      }

      console.log('Pausing before starting')
      cy.wait(1000)
      console.log('finished pausing')
      // no idea why but type will NOT work consistently unless we add a scrollIntoView before we try to type
      cy.get("#searchwicon-header").type("24.55 gb")

      if ('local' == Cypress.env('environment')) {
        cy.wait('@searchresultsopensearch')
      }

      cy.get("#xssroot").find("h2").as("searchresultsheader")
      cy.get("@searchresultsheader").should("exist")
      cy.get("@searchresultsheader").contains("Documentation")
      cy.get("#xssroot").find("li").contains("24.55").should("exist")

      cy.get("#searchwicon-header").type("{enter}")
      cy.location("pathname").should(
        "eq",
        "/search.html"
      )

      cy.get("#xssSearchPage").find("h2").as("searchpageresults")
      cy.get("@searchpageresults").should("exist")
      cy.get("@searchpageresults").contains("Documentation")

      cy.get("#xssSearchPage").find("li").contains("24.55").should("exist")

    })
  })
})
