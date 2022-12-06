describe("movieApp", () => {
  it("should show search form", () => {
    cy.visit("http://localhost:1234");
    cy.get("form").should("have.id", "searchForm");
  });

  it("should show button", () => {
    cy.visit("http://localhost:1234");
    cy.get("button").should("have.id", "search");
  });

  it("should be able to type in input", () => {
    cy.visit("http://localhost:1234");
    cy.get("input").type("star").should("have.value", "star");
  });

  it("should get input value", () => {
    let inputValue: string = "Léon";

    cy.visit("http://localhost:1234");
    cy.get("input").type(inputValue).should("have.value", inputValue);
  });

  ////
  it("should get data with 10 movies from omdb and present each movie in a div", () => {
    cy.visit("http://localhost:1234");
    cy.get("input").type("star").should("have.value", "star");
    cy.get("form").submit();
    // cy.get("button").click();

    cy.get("div:first > div").should("have.length", 10);
    cy.get("div div:first").contains("Star Wars: Episode IV - A New Hope");
    cy.get("div div:nth-child(2)").contains(
      "Star Wars: Episode V - The Empire Strikes Back"
    );
  });

  it("should not get data from omdb", () => {
    cy.visit("http://localhost:1234");
    cy.get("input").type(" ").should("have.value", " ");
    cy.get("button").click();
    cy.get("#movie-container").contains("Inga sökresultat att visa");
  });

  it("should replace existing movie result in div with new search results", () => {
    let firstInputValue = "Evangelion";
    let secondInputValue = "Sailor Moon";

    cy.visit("http://localhost:1234");
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
    cy.visit("http://localhost:1234");
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

  it("should get and present mock data no matter what the input value is", () => {
    let inputValue = "lord";
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "movies" }).as(
      "moviecall"
    );
    cy.visit("http://localhost:1234");
    cy.get("input").type(inputValue).should("have.value", inputValue);
    cy.get("button").click();

    //
    cy.wait("@moviecall").its("request.url").should("contain", "lord");
    cy.get("div > div:first").contains("Léon");

    // apikey=db07c8df&s=
  });

  it("should not get mock data and display error message", () => {
    let inputValue = "Titanic";
    cy.intercept("GET", "http://omdbapi.com/*", { fixture: "emptyMovies" }).as(
      "moviecall"
    );
    cy.visit("http://localhost:1234");
    cy.get("input").type(inputValue).should("have.value", inputValue);
    cy.get("button").click();

    //
    cy.get("#movie-container").contains("Inga sökresultat att visa");
  });
});
