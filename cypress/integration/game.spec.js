import _ from "lodash";
describe("game tests", () => {
  beforeEach(() => {
    cy.viewport("iphone-6");
  });
  it("test problem words", () => {
    cy.intercept("GET", "/api/word", {
      statusCode: 404,
      body: {
        word: "howdy",
      },
    }).as("getWord");
    cy.visit("http://192.168.1.3:3000");
    cy.wait("@getWord");
    cy.findByRole("button", { name: "A" }).click();
    cy.findByRole("button", { name: "D" }).click();
    cy.findByRole("button", { name: "I" }).click();
    cy.findByRole("button", { name: "E" }).click();
    cy.findByRole("button", { name: "U" }).click();
    cy.findByRole("button", { name: "enter" }).click();
    cy.wait(500);
    cy.findByRole("button", { name: "A" }).click();
    cy.findByRole("button", { name: "D" }).click();
    cy.findByRole("button", { name: "I" }).click();
    cy.findByRole("button", { name: "E" }).click();
    cy.findByRole("button", { name: "U" }).click();
    cy.findByRole("button", { name: "enter" }).click();
    cy.wait(500);
    cy.findByRole("button", { name: "A" }).click();
    cy.findByRole("button", { name: "D" }).click();
    cy.findByRole("button", { name: "I" }).click();
    cy.findByRole("button", { name: "E" }).click();
    cy.findByRole("button", { name: "U" }).click();
    cy.findByRole("button", { name: "enter" }).click();
    cy.wait(500);
    cy.findByRole("button", { name: "H" }).click();
    cy.findByRole("button", { name: "O" }).click();
    cy.findByRole("button", { name: "W" }).click();
    cy.findByRole("button", { name: "D" }).click();
    cy.findByRole("button", { name: "Y" }).click();
    cy.findByRole("button", { name: "enter" }).click();
    // cy.findByRole("button", { name: "A" }).click();
    // cy.findByRole("button", { name: "D" }).click();
    // cy.findByRole("button", { name: "I" }).click();
    // cy.findByRole("button", { name: "E" }).click();
    // cy.findByRole("button", { name: "U" }).click();
    // cy.findByRole("button", { name: "enter" }).click();
    // cy.wait(500);
    // cy.findByRole("button", { name: "A" }).click();
    // cy.findByRole("button", { name: "D" }).click();
    // cy.findByRole("button", { name: "I" }).click();
    // cy.findByRole("button", { name: "E" }).click();
    // cy.findByRole("button", { name: "U" }).click();
    // cy.findByRole("button", { name: "enter" }).click();
    // cy.wait(500);
    // cy.findByRole("button", { name: "A" }).click();
    // cy.findByRole("button", { name: "D" }).click();
    // cy.findByRole("button", { name: "I" }).click();
    // cy.findByRole("button", { name: "E" }).click();
    // cy.findByRole("button", { name: "U" }).click();
    // cy.findByRole("button", { name: "enter" }).click();
    // cy.wait(500);
    // cy.findByRole("button", { name: "H" }).click();
    // cy.findByRole("button", { name: "O" }).click();
    // cy.findByRole("button", { name: "W" }).click();
    // cy.findByRole("button", { name: "D" }).click();
    // cy.findByRole("button", { name: "Y" }).click();
    // cy.findByRole("button", { name: "enter" }).click();
  });

  it("word - scuff", () => {
    cy.intercept("GET", "/api/word", {
      statusCode: 200,
      body: {
        word: "scuff",
      },
    }).as("getWord");
    cy.visit("http://192.168.1.3:3000");

    cy.wait("@getWord");

    [..."PLATE"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.findByRole("button", { name: "enter" }).click();

    _.range(0, 5).forEach((ix) => {
      cy.findGridItem(0, ix).isIncorrect();
    });
    cy.wait(1500);

    [..."DRIFT"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.findByRole("button", { name: "enter" }).click();
    [0, 1, 2, 4].forEach((ix) => {
      cy.findGridItem(1, ix).isIncorrect();
    });
    cy.findGridItem(1, 3).isCorrect();
    cy.wait(1500);

    [..."SWOON"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.findByRole("button", { name: "enter" }).click();
    [1, 2, 3, 4].forEach((ix) => {
      cy.findGridItem(2, ix).isIncorrect();
    });
    cy.findGridItem(2, 0).isCorrect();
    cy.wait(1500);

    [..."SCUFF"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.findByRole("button", { name: "enter" }).click();
    [0, 1, 2, 3, 4].forEach((ix) => {
      cy.findGridItem(3, ix).isCorrect();
    });
  });

  it("word - howdy", () => {
    cy.intercept("GET", "/api/word", {
      statusCode: 200,
      body: {
        word: "howdy",
      },
    }).as("getWord");
    cy.visit("http://192.168.1.3:3000");

    cy.wait("@getWord");

    [..."ADIEU"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.findByRole("button", { name: "enter" }).click();

    [0, 2, 3, 4].forEach((ix) => {
      cy.findGridItem(0, ix).isIncorrect();
    });
    cy.findGridItem(0, 1).isSemiCorrect();
    cy.wait(1500);

    [..."BROWS"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.findByRole("button", { name: "enter" }).click();
    [0, 1, 4].forEach((ix) => {
      cy.findGridItem(1, ix).isIncorrect();
    });
    cy.findGridItem(1, 2).isSemiCorrect();
    cy.findGridItem(1, 3).isSemiCorrect();
    cy.wait(1500);

    [..."PLOTS"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.findByRole("button", { name: "enter" }).click();
    [0, 1, 3, 4].forEach((ix) => {
      cy.findGridItem(2, ix).isIncorrect();
    });
    cy.findGridItem(2, 2).isSemiCorrect();
    cy.wait(1500);

    [..."MOONY"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.findByRole("button", { name: "enter" }).click();
    [0, 2, 3].forEach((ix) => {
      cy.findGridItem(3, ix).isIncorrect();
    });

    [1, 4].forEach((ix) => {
      cy.findGridItem(3, ix).isCorrect();
    });
  });

  it.only("word - howdy", () => {
    cy.intercept("GET", "/api/word", {
      statusCode: 200,
      body: {
        word: "howdy",
      },
    }).as("getWord");
    cy.intercept("POST", "/api/isValidWord", {
      statusCode: 400,
      body: {
        word: "howdy",
      },
    }).as("getIsValidWord");
    cy.visit("http://192.168.1.3:3000");

    cy.wait("@getWord");

    [..."ADIEU"].forEach((letter) => {
      cy.findByRole("button", { name: letter }).click();
    });
    cy.wait(1000);
    cy.findByRole("button", { name: "enter" }).click();
    cy.wait("@getIsValidWord");
  });
});
