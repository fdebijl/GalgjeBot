describe('Placeholder Test', () => {
  it('Should pass', () => {
    expect(true).toBeTrue();
  });
});

// Expect Letters: ["a", "c"]
    // Expect Words: []
    const TEST_STATUSES_VALID_LETTERS = [
      {text: "@galgjebot A"},
      {text: "@galgjebot A"},
      {text: "@galgjebot a"},
      {text: "@galgjebot a"},
      {text: "@galgjebot c"},
      {text: "@galgjebot c"},
      {text: "@galgjebot c"}
    ];
    // Expect Letters: ["a"]
    // Expect Words: ["veeziekte", "kutromy", "sjon"]
    const TEST_STATUSES_VALID_WORDS = [
      {text: "@galgjebot veeziekte"},
      {text: "@galgjebot kutromy"},
      {text: "@galgjebot veeziekte"},
      {text: "@galgjebot sjon"},
      {text: "@galgjebot a"},
      {text: "@galgjebot A"}
    ];
    // Expect Letters: ["a"]
    // Expect Words: []
    const TEST_STATUSES_SINGLE_LETTER = [
      {text: "@galgjebot A"}
    ];
    // Expect Letters: []
    // Expect Words: ["rutkomy"]
    const TEST_STATUSES_SINGLE_WORD = [
      {text: "@galgjebot rutkomy"}
    ];
    // Expect: false
    const TEST_STATUSES_INVALID_MULTILETTERS = [
      {text: "@galgjebot a b x"},
      {text: "@galgjebot c y k a b l y a t"}
    ];
    // Expect: false
    const TEST_STATUSES_INVALID_MULTIWORDS = [
      {text: "@galgjebot er was eens"},
      {text: "@galgjebot een heks genaamd romy"}
    ];
    // Expect Letters: ["a", "b"]
    // Expect Words: []
    const TEST_STATUSES_SOME_VALID_LETTERS = [
      {text: "@galgjebot a"},
      {text: "@galgjebot ongeldige status"},
      {text: "@galgjebot A"},
      {text: "@galgjebot B"},
      {text: "@galgjebot doe eens lief"},
    ];
    // Expect Letters: []
    // Expert Words: ["romy"]
    const TEST_STATUSES_SOME_VALID_WORDS = [
      {text: "@galgjebot er was eens"},
      {text: "@galgjebot een heks genaamd"},
      {text: "@galgjebot romy"},
    ];

    QUnit.module("Clean Status")
    QUnit.test("Single Letter", function( assert ) {
      let input = "@galgjebot A";
      let value = cleanStatus(input);
      let expected = "a"
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.test("Single Word", function( assert ) {
      let input = "@galgjebot VeeziEkte";
      let value = cleanStatus(input);
      let expected = "veeziekte"
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.test("Extra Whitespace w/ Single Letter", function( assert ) {
      let input = "@galgjebot    A";
      let value = cleanStatus(input);
      let expected = "a"
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.test("Letter w/ Accent", function( assert ) {
      let input = "@galgjebot ä";
      let value = cleanStatus(input);
      let expected = "ä"
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.module("Valid Status Check")
    QUnit.test("Single Letter", function( assert ) {
      let input = "@galgjebot a";
      let value = isValidStatus(input);
      let expected = true;
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.test("Single Word", function( assert ) {
      let input = "@galgjebot sjon";
      let value = isValidStatus(input);
      let expected = true;
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.test("Multiple Letters", function( assert ) {
      let input = "@galgjebot A B C";
      let value = isValidStatus(input);
      let expected = false;
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.test("Multiple Words", function( assert ) {
      let input = "@galgjebot niemand gaat toch zo ver lezen in de unit tests dus hier kan ik wel zeggen dat jij lief bent <3";
      let value = isValidStatus(input);
      let expected = false;
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.module("Popular Symbol Finder");
    QUnit.test("Valid Letters", function( assert ) {
      let valueLetters = getPopularSymbol(TEST_STATUSES_VALID_LETTERS, true);
      let valueWords = getPopularSymbol(TEST_STATUSES_VALID_LETTERS);
      let expectedLetters = ["a", "c"];
      let expectedWords = [];
      assert.deepEqual(valueLetters, expectedLetters, `Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'.`);
      assert.deepEqual(valueWords, expectedWords, `Got word(s) '${valueWords}', expected word(s) '${expectedWords}'.`);
    });

    QUnit.test("Valid Words", function( assert ) {
      let valueLetters = getPopularSymbol(TEST_STATUSES_VALID_WORDS, true);
      let valueWords = getPopularSymbol(TEST_STATUSES_VALID_WORDS);
      let expectedLetters = ["a"];
      let expectedWords = ["veeziekte", "kutromy", "sjon"];
      assert.deepEqual(valueLetters, expectedLetters, `Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'.`);
      assert.deepEqual(valueWords, expectedWords, `Got word(s) '${valueWords}', expected word(s) '${expectedWords}'.`);
    });

    QUnit.test("Single Letter", function( assert ) {
      let valueLetters = getPopularSymbol(TEST_STATUSES_SINGLE_LETTER, true);
      let valueWords = getPopularSymbol(TEST_STATUSES_SINGLE_LETTER);
      let expectedLetters = ["a"];
      let expectedWords = [];
      assert.deepEqual(valueLetters, expectedLetters, `Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'.`);
      assert.deepEqual(valueWords, expectedWords, `Got word(s) '${valueWords}', expected word(s) '${expectedWords}'.`);
    });

    QUnit.test("Single Word", function( assert ) {
      let valueLetters = getPopularSymbol(TEST_STATUSES_SINGLE_WORD, true);
      let valueWords = getPopularSymbol(TEST_STATUSES_SINGLE_WORD);
      let expectedLetters = [];
      let expectedWords = ["rutkomy"];
      assert.deepEqual(valueLetters, expectedLetters, `Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'.`);
      assert.deepEqual(valueWords, expectedWords, `Got word(s) '${valueWords}', expected word(s) '${expectedWords}'.`);
    });

    QUnit.test("Multiple Letters", function( assert ) {
      let valueLetters = getPopularSymbol(TEST_STATUSES_INVALID_MULTILETTERS, true);
      let valueWords = getPopularSymbol(TEST_STATUSES_INVALID_MULTILETTERS);
      let expectedLetters = false;
      let expectedWords = false;
      assert.deepEqual(valueLetters, expectedLetters, `Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'.`);
      assert.deepEqual(valueWords, expectedWords, `Got word(s) '${valueWords}', expected word(s) '${expectedWords}'.`);
    });

    QUnit.test("Multiple Words", function( assert ) {
      let valueLetters = getPopularSymbol(TEST_STATUSES_INVALID_MULTIWORDS, true);
      let valueWords = getPopularSymbol(TEST_STATUSES_INVALID_MULTIWORDS);
      let expectedLetters = false;
      let expectedWords = false;
      assert.deepEqual(valueLetters, expectedLetters, `Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'.`);
      assert.deepEqual(valueWords, expectedWords, `Got word(s) '${valueWords}', expected word(s) '${expectedWords}'.`);
    });

    QUnit.test("Some Valid Letters", function( assert ) {
      let valueLetters = getPopularSymbol(TEST_STATUSES_SOME_VALID_LETTERS, true);
      let valueWords = getPopularSymbol(TEST_STATUSES_SOME_VALID_LETTERS);
      let expectedLetters = ["a", "b"];
      let expectedWords = [];
      assert.deepEqual(valueLetters, expectedLetters, `Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'.`);
      assert.deepEqual(valueWords, expectedWords, `Got word(s) '${valueWords}', expected word(s) '${expectedWords}'.`);
    });

    QUnit.test("Some Valid Words", function( assert ) {
      let valueLetters = getPopularSymbol(TEST_STATUSES_SOME_VALID_WORDS, true);
      let valueWords = getPopularSymbol(TEST_STATUSES_SOME_VALID_WORDS);
      let expectedLetters = [];
      let expectedWords = ["romy"];
      assert.deepEqual(valueLetters, expectedLetters, `Got letter(s) '${valueLetters}', expected letter(s) '${expectedLetters}'.`);
      assert.deepEqual(valueWords, expectedWords, `Got word(s) '${valueWords}', expected word(s) '${expectedWords}'.`);
    });

    QUnit.module("Guess Parsers");
    QUnit.test("Wrong Letter", function( assert ) {
      let input = "a";
      let value = guessLetter(input);
      let expected = GUESS_ENUM.WRONG;
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });

    QUnit.test("Repeated Letter", function( assert ) {
      let input = "a";
      let value = guessLetter(input);
      let expected = GUESS_ENUM.REPEAT;
      assert.deepEqual(value, expected, `Got '${value}', expected '${expected}'.`);
    });