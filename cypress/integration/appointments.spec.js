describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset")
    cy.visit("/")
    cy.contains("Monday")
  })

  it("should book an interview", () => {

    cy.get("[alt=Add]")
      .first()
      .click()
      .get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones")
      .get("[alt='Sylvia Palmer']")
      .click()

    cy.contains("Save")
      .click()

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  })

  it("should edit an interview", () => {
    cy.get("[alt=Edit]").first().click({ force: true })
      .get("[data-testid=student-name-input]").clear().type("Archie Bob Cohen")
      .get("[alt='Tori Malcolm']").click()

    cy.contains("Save")
      .click()

    cy.contains(".appointment__card--show", "Archie Bob Cohen");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  })

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]").first().click({ force: true })

    cy.contains("Confirm").click()

    cy.contains("Deleting")
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  })

})