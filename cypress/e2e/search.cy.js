//Both should return results for "opensearch"
//Only Upsun should return a match for "vertical scaling"
//Only platform should return a match for "24.55 gb"
describe("Searches",()=>{
  beforeEach(()=>{
    if('local' == Cypress.env('environment')) {
      cy.intercept("/indexes/*_docs/search*", { "hits":[] })
    }

    //cy.visit("/")
  })

  context("Search tests",()=>{
    it("Searches for something that should match in both", () => {
      cy.visit("/")
      if('local' == Cypress.env('environment')) {
        cy.intercept({
          pathname: '/indexes/*_docs/search',
          query: {
            q: 'opensearch'
          }
        },{ fixture: "opensearchresults" }).as("searchresultsopensearch")
      }

      cy.wait(1000)
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

    it("Searches for something that should not match on Platformsh, but should on Upsun", ()=>{
      const searchDetails = {
        search: 'vertical scaling',
        header: 'No results',
        body: 'No documentation matched'
      }

      if ('upsun' == Cypress.env('site')) {
        searchDetails.header = 'Documentation'
        searchDetails.body = searchDetails.search
      }

      cy.visit("/")
      cy.wait(1000)
      cy.get("#searchwicon-header").type(searchDetails.search)
      cy.get("#xssroot").find("h2").as("searchresultsheader")
      cy.get("@searchresultsheader").should("exist")
      cy.get("@searchresultsheader").contains(searchDetails.header)
      cy.get("#xssroot").find("p").contains(searchDetails.body)

      cy.get("#searchwicon-header").type("{enter}")
      cy.location("pathname").should(
        "eq",
        "/search.html"
      )

      cy.get("#xssSearchPage").find("h2").as("searchpageresults")
      cy.get("@searchpageresults").should("exist")
      if ('upsun' == Cypress.env('site')) {
        cy.get("#xssSearchPage").find("li").contains(searchDetails.body).should("exist")
      } else {
        cy.get("#xssSearchPage").contains(searchDetails.header)
      }

    })

    it("Searches for something that should ONLY match on platformsh, but not on Upsun", () => {
      const searchDetails = {
        search: '24.55',
        header: 'No results',
        body: 'No documentation matched'
      }

      console.log('Current site is ' + Cypress.env('site'))

      if ('platformsh' == Cypress.env('site')) {
        searchDetails.header = 'Documentation'
        searchDetails.body = searchDetails.search
      }

      cy.visit("/")
      if('local' == Cypress.env('environment')) {
        cy.intercept({
          pathname: '/indexes/*_docs/search',
          query: {
            q: 'opensearch'
          }
        },{ fixture: "searchosresults" }).as("searchresultsopensearch")
      }

      //console.log('Pausing before starting')
      cy.wait(1000)
      //console.log('finished pausing')

      cy.get("#searchwicon-header").clear().type(searchDetails.search)

      if ('local' == Cypress.env('environment')) {
        cy.wait('@searchresultsopensearch')
      }

      cy.get("#xssroot").find("h2").as("searchresultsheader")
      cy.get("@searchresultsheader").should("exist")
      cy.get("@searchresultsheader").contains(searchDetails.header)
      cy.get('#xssroot').find('p').contains(searchDetails.body)

      cy.get("#searchwicon-header").type("{enter}")
      cy.location("pathname").should(
        "eq",
        "/search.html"
      )

      cy.get("#xssSearchPage").find("h2").as("searchpageresults")
      cy.get("@searchpageresults").should("exist")
      cy.get("@searchpageresults").contains(searchDetails.header)

      if ('platformsh' == Cypress.env('site')) {
        cy.get("#xssSearchPage").find("li").contains(searchDetails.body).should("exist")
      } else {
        cy.get("#xssSearchPage").contains(searchDetails.body)
      }

    })
  })
})
