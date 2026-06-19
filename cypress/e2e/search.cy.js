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
})
