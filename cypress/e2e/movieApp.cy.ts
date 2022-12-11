describe("testing movieApp", () => {
  beforeEach("Should visit the page before each test", () => {
    cy.visit("index.html");
  });

  let inputValue: string = "star wars";

  it("should display 10 movies from search result, each in their own div with title and poster", () => {
    cy.get("input").type(inputValue).should("have.value", inputValue);
    cy.get("form").submit();

    cy.get("#movie-container > div").should("have.length", 10);
    cy.get("#movie-container div:first h3").contains(inputValue, {
      matchCase: false,
    }); // matchCase: false ignores case sensitivity, which makes inputValue match h3-text regardless of whether it says "star wars" or "Star Wars"

    cy.get("#movie-container div:nth-child(2) h3").contains(inputValue, {
      matchCase: false,
    });
    cy.get("div.movie img")
      .should("have.attr", "src")
      .should("include", "http");
  });

  it("should display error message", () => {
    cy.get("input").type(" ").should("have.value", " ");
    cy.get("button").click();
    cy.get("#movie-container p").contains("Inga sökresultat att visa");
  });

  it("should replace existing movie result in div with new search results", () => {
    let firstInputValue: string = "evangelion";
    let secondInputValue: string = "sailor moon";

    //first search
    cy.get("input").type(firstInputValue).should("have.value", firstInputValue);
    cy.get("button").click();

    cy.get("#movie-container > div").should("have.length", 10);
    cy.get("#movie-container div:first h3").contains(firstInputValue, {
      matchCase: false,
    });

    //clearing input + second search
    cy.get("input")
      .clear()
      .type(secondInputValue)
      .should("have.value", secondInputValue);
    cy.get("button").click();

    cy.get("#movie-container > div").should("have.length", 10);
    cy.get("#movie-container div:first h3").contains(secondInputValue, {
      matchCase: false,
    });
  });

  it("should clear input text and erase movie-divs when refreshing page", () => {
    cy.get("input").type("Twin Peaks").should("have.value", "Twin Peaks");
    cy.get("button").click();

    cy.get("#movie-container > div").should("have.length", 10);
    cy.get("#movie-container div:first h3").contains("Twin");

    //simulating that the user refreshes the page
    cy.reload();
    cy.get("input").should("have.value", "");
    cy.get("div").should("have.length", 1);
  });
});
