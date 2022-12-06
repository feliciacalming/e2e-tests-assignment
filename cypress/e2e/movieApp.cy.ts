import { IMovie, Movie } from "./../../src/ts/models/Movie";

let mockMovies: IMovie[] = [
  {
    Title: "Léon",
    imdbID: "1234",
    Type: "movie",
    Poster: "imageURL",
    Year: "2022",
  },
];

describe("movieApp", () => {
  it("should be able to type", () => {
    cy.visit("http://localhost:1234");
    cy.get("input").type("star").should("have.value", "star");
  });

  it("should", () => {
    cy.visit("http://localhost:1234");
    cy.get("input").type("star").should("have.value", "star");
  });

  it("should get data from omdb", () => {
    cy.visit("http://localhost:1234");
    cy.get("input").type("star").should("have.value", "star");
    cy.get("button").click();
    cy.get("div:first > div").should("have.length", 10);
    cy.get("div:first > div:first").contains(
      "Star Wars: Episode IV - A New Hope"
    );
  });

  it("should not get data from omdb", () => {
    cy.visit("http://localhost:1234");
    cy.get("input").type("s").should("have.value", "s");
    cy.get("button").click();
    cy.get("div:first > div").should("have.length", 0);
  });

  it("should get mock data", () => {
    let inputValue = "lord";
    cy.visit("http://localhost:1234");
    cy.intercept("GET", "https:omdbapi.com/apikey=db07c8df&s=*", mockMovies).as(
      "moviecall"
    );
    cy.get("input").type(inputValue).should("have.value", inputValue);
    cy.get("button").click();

    //
    cy.wait("@moviecall").its("request.url").should("contain", inputValue);

    // apikey=db07c8df&s=
  });
});
