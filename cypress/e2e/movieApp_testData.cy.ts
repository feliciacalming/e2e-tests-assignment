describe("testing movieApp with test data", () => {
  beforeEach("Should visit the page before each test", () => {
    cy.visit("index.html");
  });

  let inputValue: string = "star";

  it("should show search form", () => {
    cy.get("form").should("have.id", "searchForm");
  });

  it("should show button", () => {
    cy.get("button").should("have.id", "search");
  });

  it("should be able to type in input", () => {
    cy.get("input").type(inputValue).should("have.value", inputValue);
  });

  it("should get input value", () => {
    cy.get("input").type(inputValue).should("have.value", inputValue);
  });

  it("should search for input value but return test data", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "movies" }).as(
      "moviecall"
    );

    cy.get("input").type(inputValue).should("have.value", inputValue);
    cy.get("button").click();

    cy.wait("@moviecall").its("request.url").should("contain", "star");
    cy.get("div.movie:first h3").contains("Léon");
    cy.get("div.movie:nth-child(2) h3").contains("Twin Peaks");
    cy.get("div.movie:nth-child(3) h3").contains("Magnolia");
    cy.get("div.movie:first img")
      .should("have.attr", "src")
      .should("include", "http");
  });

  it("should display error message", () => {
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "emptyMovies" }).as(
      "moviecall"
    );

    cy.get("input").type(inputValue).should("have.value", inputValue);
    cy.get("button").click();

    cy.wait("@moviecall").its("request.url").should("contain", inputValue);
    cy.get("div").should("have.length", 1);
    cy.get("p").contains("sökresultat");
  });

  it("should replace existing movie result in div with new search results", () => {
    let firstInputValue: string = "Evangelion";
    let secondInputValue: string = "Sailor";

    //first search
    cy.intercept("GET", "http://omdbapi.com/*", {
      fixture: "movies",
    }).as("moviecall");

    cy.get("input").type(firstInputValue).should("have.value", firstInputValue);
    cy.get("button").click();

    cy.wait("@moviecall").its("request.url").should("contain", firstInputValue);

    cy.get("#movie-container > div").should("have.length", 3);
    cy.get("div.movie:first h3").contains("Léon");

    //clearing input + second search with different test data
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "otherMovies" }).as(
      "secondMoviecall"
    );

    cy.get("input")
      .clear()
      .type(secondInputValue)
      .should("have.value", secondInputValue);
    cy.get("button").click();

    cy.wait("@secondMoviecall")
      .its("request.url")
      .should("contain", secondInputValue);

    cy.get("#movie-container > div").should("have.length", 3);
    cy.get("div.movie:first h3").contains("Lost In Translation");
  });

  it("should clear input text and erase movie-divs when reloading page", () => {
    cy.get("input").type("Twin Peaks").should("have.value", "Twin Peaks");
    cy.get("button").click();

    cy.get("#movie-container > div").should("have.length", 10);
    cy.get("#movie-container div:first h3").contains("Twin");

    //after reloading page
    cy.reload();
    cy.get("input").should("have.value", "");
    cy.get("div").should("have.length", 1);
  });
});
