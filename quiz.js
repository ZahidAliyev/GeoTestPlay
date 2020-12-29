import { drawMap, clearMap, drawTotalRightAnswers } from "./map.js";

const doneButtn = document.querySelector(".Quiz-control-done > button");
const totalUi = document.querySelector(".Quiz-control-total > h2");
const go = document.querySelector(".Quiz-control-go > button");

const countrySelect = (data) => {
  const countriesForRandomIndex = data.countries.filter((country) => {
    return country.selected === false;
  });
  const index = Math.floor(
    Math.random() * Math.floor(countriesForRandomIndex.length)
  );
  if (countriesForRandomIndex.length === 0) {
    return undefined;
  } else {
    countriesForRandomIndex[index].selected = true;
    return countriesForRandomIndex[index];
  }
};
// Done button function
const done = (data) => {
  console.log(data.countries);
  const selectedCountry = data.countries.filter((country) => {
    return country.selected === true && !country.passed;
  })[0];
  const mark = document.querySelectorAll(".Quiz-tests_test-mark > p");

  selectedCountry.tests.forEach((test, testindex) => {
    data.testsQuantity += 1;
    // console.log(data.testsQuantity)
    const inputs = document.getElementsByName(`${test.name}`);
    test.answers.forEach((answer, index) => {
      if (inputs[index].checked && answer.isitright) {
        test.mark = true;
        selectedCountry.total += 1;
        // console.log(selectedCountry.total)
        data.allCountriesTotal += 1;
        // console.log(data.allCountriesTotal);
        mark[testindex].innerHTML = "True";
      } else {
        if (!test.mark) {
          mark[testindex].innerHTML = "False";
        }
      }
    });
  });
  selectedCountry.passed = true;
  go.disabled = false;
  totalUi.innerHTML = `Total: ${selectedCountry.total}`;
  doneButtn.disabled = true;
};

// Here is a function that fetchs data from given url, makes html quiz code and inserts this data to it.
function StartQuiz(quizDataCopy) {
  doneButtn.disabled = false;
  go.disabled = true;
  console.log(quizDataCopy.countries);
  const selectedCountry = countrySelect(quizDataCopy);
  // const selectedCountry = quizDataCopy.countries.filter((country) => {
  //   return country.selected === true && !country.passed;
  // })[0];
  const form = document.querySelector("#quiz-form");

  if (selectedCountry != undefined) {
    drawMap(selectedCountry);
    totalUi.innerHTML = `Total: ${selectedCountry.total}`;

    form.innerHTML = "";
    // Looping trough array of tests for given country to make html and put quizDataCopy into html
    selectedCountry.tests.forEach((test, testIndex) => {
      // getting dom form element to put quizDataCopy in it

      // adding test container for each test in country tests and text quizDataCopy as a question
      form.innerHTML += `<div class="Quiz-tests_test">
            <fieldset class="Quiz-tests_test-question">
              <legend class="Quiz-tests_test-question-text">
                <h3>${test.question_text}</h3>
              </legend>
  
            </fieldset>
            <div class="Quiz-tests_test-mark">
              <p></p>
            </div>
            </div>
            `;
      // only after adding html test div with dieldset to form, selecting all fieldset elements
      const fieldset = document.querySelectorAll(".Quiz-tests_test-question");
      // creating div for adding all radio inputs in it
      const options = document.createElement("div");
      options.setAttribute("class", "Quiz-tests_test-answers");
      // looping through each answer in answers data from test to add radio inputs HTML to options and insert answer text in each
      test.answers.forEach((answer) => {
        options.innerHTML += `
          <div class="Quiz-tests_test-answer">
  
            <input type="radio" name="${test.name}" id="${answer.answer_text}" value="${answer.value}"/>
            <label for="${answer.answer_text}">${answer.answer_text}</label>
          </div>
          `;
      });
      // after adding all inputs to options container, we append options container to fieldset of each iterated test
      fieldset[testIndex].appendChild(options);
    });
  } else {
    form.innerHTML = `<div><h2>Test finished</h2></div>`;
    clearMap();

    drawTotalRightAnswers(
      quizDataCopy.testsQuantity,
      quizDataCopy.allCountriesTotal
    );
    go.disabled = true;
  }
}

async function getQuizDataandStartGame(url) {
  //Fething data asynchroniously with asynch await
  const res = await fetch(url);
  //Converting it to json format
  const data = await res.json();

  const dataCopy = Object.assign({}, data);

  try {
    StartQuiz(dataCopy);
    doneButtn.addEventListener("click", () => done(dataCopy));

    go.addEventListener("click", () => StartQuiz(dataCopy));
  } catch (err) {
    console.log("err", err);
  }
}
getQuizDataandStartGame("./quiz.json");
