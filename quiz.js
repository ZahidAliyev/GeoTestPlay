import {
  drawMap,
  clearMap,
  drawTotalRightAnswers,
  changeCanvasHeight,
} from "./map.js";
const time0 = performance.now();
const changePageHeight = (max_width_for_device, deviceWidth) => {
  if (deviceWidth < max_width_for_device) {
    changeCanvasHeight(0.94);
    const rootElelemt = document.querySelector(":root");
    rootElelemt.style.setProperty(
      "--page-height",
      `${window.innerHeight / 100}px`
    );
  }
};
const createHtmlElement = (tag, id = 0, className = 0, text = 0) => {
  let elementsName = createHtmlElement.name;
  elementsName = document.createElement(tag);
  if (className) {
    elementsName.setAttribute("class", className);
  } 
  if (id) {
    elementsName.setAttribute("id", id);
  }
  elementsName.textContent = text;
  return elementsName;
};
const quizControlDoneAndRetryDivElement = document.querySelector(
  ".Quiz-control-done"
);
const doneButton = createHtmlElement("button", null, "button", "Done");

const retryButton = createHtmlElement("button", null, "button", "Retry");

const QuizControlTotalElement = document.querySelector(
  ".Quiz-control-total > h2"
);
const quizControlGoFurtherElement = document.querySelector(
  ".Quiz-control-go > button"
);
const randomCountrySelect = (data) => {
  const notSelectedCountriesYet = data.countries.filter((country) => {
    return country.selected === false;
  });
  const random_index = Math.floor(
    Math.random() * notSelectedCountriesYet.length
  );

  if (notSelectedCountriesYet.length === 0) {
    return undefined;
  } else {
    notSelectedCountriesYet[random_index].selected = true;
    return notSelectedCountriesYet[random_index];
  }
};

const changeElementsColor = (element, color) => {
  element.style.backgroundColor = color;

}
// Done button function
const checkAnswers = (data) => {
  const selectedCountry = data.countries.filter((country) => {
    return country.selected === true && !country.passed;
  })[0];
  const TEST_ELEMENT = document.querySelectorAll(".Quiz-tests_test");
  selectedCountry.tests.forEach((test, testindex) => {
    data.totalTestsQuantity += 1;
    const INPUTS_ARRAY_BY_NAME = document.getElementsByName(`${test.name}`);
    test.answers.every((answer, answer_index) => {
      if (INPUTS_ARRAY_BY_NAME[answer_index].checked && answer.isitright) {
        test.mark = true;
        selectedCountry.total += 1;
        data.totalRightAnswers += 1;
        changeElementsColor(TEST_ELEMENT[testindex], "#05f240");
        return false;
      } else {
        changeElementsColor(TEST_ELEMENT[testindex], "#f70330");

        return true;
      }
    });
  });
  selectedCountry.passed = true;
  quizControlGoFurtherElement.disabled = false;
  QuizControlTotalElement.textContent = `Total: ${selectedCountry.total}`;
  doneButton.disabled = true;
};
/////////START or Continue Quiz with Copied Data
// Here is a function that fetchs data from given url, makes html quiz code and inserts this data to it.
function StartQuiz(quizDataCopy) {

  if(retryButton !== undefined) {
    quizControlDoneAndRetryDivElement.innerHTML = "";
    quizControlDoneAndRetryDivElement.appendChild(doneButton);
  } else {
    quizControlDoneAndRetryDivElement.appendChild(doneButton);

  }
  doneButton.disabled = false;
  quizControlGoFurtherElement.disabled = true;
  const selectedCountry = randomCountrySelect(quizDataCopy);
  const form = document.querySelector("#quiz-form");

  if (selectedCountry != undefined) {
    drawMap(selectedCountry);
    QuizControlTotalElement.textContent = `Total: ${selectedCountry.total}`;

    form.innerHTML = "";
    // Looping trough array of tests for given country to make html and put quizDataCopy into html
    selectedCountry.tests.forEach((test, testIndex) => {

      // adding test container for each test in country tests and text quizDataCopy as a question
      form.innerHTML += `<div class="Quiz-tests_test">
            <fieldset class="Quiz-tests_test-question">
              <legend class="Quiz-tests_test-question-text">
                <h3>${test.question_text}</h3>
              </legend>
  
            </fieldset>
            </div>
            `;
      // only after adding html test div with dieldset to form, selecting all fieldset elements
      const fieldset = document.querySelectorAll(".Quiz-tests_test-question");
      // creating div for adding all radio inputs in it
      const options = createHtmlElement("div", null, "Quiz-tests_test-answers", null);
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
    //If TEST FINISHED
  } else {
    form.innerHTML = `<div class="quiz-test-finished"><h2>Test finished</h2></div>`;
    clearMap();

    drawTotalRightAnswers(
      quizDataCopy.totalTestsQuantity,
      quizDataCopy.totalRightAnswers
    );
    quizControlGoFurtherElement.disabled = true;
    quizControlDoneAndRetryDivElement.innerHTML = "";

    quizControlDoneAndRetryDivElement.appendChild(retryButton);
  }
}

async function getQuizDataAndStartGame(url) {
  //Fething data asynchroniously with asynch await
  const res = await fetch(url);
  //Converting it to json format
  const data = await res.json();

  const dataCopy = Object.assign({}, data);

  try {
    //DONT USE EVENT LISTENER ON BUTTONS. we shouldn’t use addEventListener too often since it keeps adding new event listeners to a DOM object without discarding the old ones.
    changePageHeight(600, window.screen.availWidth);

    StartQuiz(dataCopy);
    // doneButton.addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   console.log("done click");

    //   console.log(dataCopy);
    //   done(dataCopy);
    // });
    // retryButton.addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   console.log("retry click");
    //   // getQuizDataAndStartGame("./quiz.json");

    // });
    doneButton.onclick = () => checkAnswers(dataCopy);
    retryButton.onclick = () => getQuizDataAndStartGame("./quiz.json");
    quizControlGoFurtherElement.onclick = () => StartQuiz(dataCopy);
    // go.addEventListener("click", (e) => {
    //   e.stopPropagation();

    //   StartQuiz(dataCopy);
    //   console.log("go click");
    // });
  } catch (err) {
    console.log("err", err);
  }
}
const time1 = performance.now();
console.log(time0, time1);
getQuizDataAndStartGame("./quiz.json");
