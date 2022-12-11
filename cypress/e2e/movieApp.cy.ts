describe("movieApp with real data", () => {
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
    cy.get("input").type("star").should("have.value", "star");
  });

  it("should get input value", () => {
    // let inputValue: string = "Léon";
    cy.get("input").type(inputValue).should("have.value", inputValue);
  });

  //
  it("should display 10 movies from search result, each in their own div with title and poster", () => {
    cy.get("input").type(inputValue).should("have.value", inputValue);
    cy.get("form").submit();

    cy.get("div:first > div").should("have.length", 10);
    cy.get("div div:first h3").contains("Star Wars: Episode IV - A New Hope");
    cy.get("div div:nth-child(2)").contains(
      "Star Wars: Episode V - The Empire Strikes Back"
    );
    cy.get("img").should("have.attr", "src").should("include", "http");
  });

  it("should display error message", () => {
    cy.get("input").type(" ").should("have.value", " ");
    cy.get("button").click();
    cy.get("#movie-container p").contains("Inga sökresultat att visa");
  });

  it("should replace existing movie result in div with new search results", () => {
    let firstInputValue = "Evangelion";
    let secondInputValue = "Sailor Moon";

    cy.get("input").type(firstInputValue).should("have.value", firstInputValue);
    cy.get("button").click();

    cy.get("div:first > div").should("have.length", 10);
    cy.get("div div:first").contains("Evangelion");

    cy.get("input")
      .clear()
      .type(secondInputValue)
      .should("have.value", secondInputValue);
    cy.get("button").click();

    cy.get("div:first > div").should("have.length", 10);
    cy.get("div div:first").contains("Sailor Moon");
  });

  it("should clear input text and erase movie-divs when reloading page", () => {
    cy.get("input").type("Twin Peaks").should("have.value", "Twin Peaks");
    cy.get("button").click();

    cy.get("div > div").should("have.length", 10);
    cy.get("div div:first").contains("Twin");

    //after reloading page
    cy.reload();
    cy.get("input").should("have.value", "");
    cy.get("div").should("have.length", 1);
  });

  ///// MOCKTESTER
});

///////////////////
