import {
  drawMap,
  clearMap,
  drawTotalRightAnswers,
  changeCanvasHeightForSmallDevide,
  changeCanvasSizeForResize
} from "./map.js";

var time0 = performance.now();
const changePageHeightandCanvasForSmallDevices = (max_width_for_device, deviceWidth) => {
  if (deviceWidth < max_width_for_device) {
    changeCanvasHeightForSmallDevide(0.94);
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
};
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
  if (retryButton !== undefined) {
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
    if(form.firstChild !== null) {
      form.removeChild(form.firstChild);
    }
    // Looping trough array of tests for given country to make html and put quizDataCopy into html
    const allTestsFragment = document.createDocumentFragment();
    const QUIZ_TESTS_CONTAINER = createHtmlElement('div', null, 'Quiz-tests-tests_container', null);
    selectedCountry.tests.forEach((test, testIndex) => {

      const QUIZ_TESTS_TEST_DIV_ELEMENT = createHtmlElement("div", null, 'Quiz-tests_test', null);
      const FIELDSET_ElEMENT = createHtmlElement("fieldset", null, "Quiz-tests_test-question", null);
      const LEGEND_ELEMENT = createHtmlElement("legend", null, "Quiz-tests_test-question-text", null);
      const H3_ELEMENT = createHtmlElement("h3", null, null, test.question_text);
      const TEST_INPUTS_ELEMENTS_CONTAINER = createHtmlElement("div", null, "Quiz-tests_test-answers", null);

      for(let answerIndex = 0; answerIndex < test.answers.length; answerIndex++) {

        const INPUT_DIV_ELEMENT = createHtmlElement('div', null, "Quiz-tests_test-answer", null);
        const INPUT_ELEMENT = createHtmlElement('input', test.answers[answerIndex].answer_text, null, null);
  
        INPUT_ELEMENT.setAttribute('type', 'radio');
        INPUT_ELEMENT.setAttribute('name', test.name);
        INPUT_ELEMENT.setAttribute('value', test.answers[answerIndex].value);
  
        const LABEL_ELEMENT = createHtmlElement('label', null, null, test.answers[answerIndex].answer_text);
        LABEL_ELEMENT.setAttribute('for', test.answers[answerIndex].answer_text);
        
        LABEL_ELEMENT.textContent = test.answers[answerIndex].answer_text;
        INPUT_DIV_ELEMENT.appendChild(INPUT_ELEMENT);
        INPUT_DIV_ELEMENT.appendChild(LABEL_ELEMENT);

        TEST_INPUTS_ELEMENTS_CONTAINER.appendChild(INPUT_DIV_ELEMENT);
      }
      LEGEND_ELEMENT.appendChild(H3_ELEMENT);
      FIELDSET_ElEMENT.appendChild(LEGEND_ELEMENT);
      FIELDSET_ElEMENT.appendChild(TEST_INPUTS_ELEMENTS_CONTAINER);
      QUIZ_TESTS_TEST_DIV_ELEMENT.appendChild(FIELDSET_ElEMENT);
      allTestsFragment.appendChild(QUIZ_TESTS_TEST_DIV_ELEMENT);

    });
    QUIZ_TESTS_CONTAINER.appendChild(allTestsFragment);
    
    form.appendChild(QUIZ_TESTS_CONTAINER);
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
const controlResizeCall = (data)=> {
  const selectedCountry = data.countries.filter((country) => {
    return country.selected === true && !country.passed;
  })[0];
  changeCanvasSizeForResize();
  drawMap(selectedCountry);
}
async function getQuizDataAndStartGame(url) {
  //Fething data asynchroniously with asynch await
  const res = await fetch(url);
  //Converting it to json format
  const data = await res.json();

  const dataCopy = JSON.parse(JSON.stringify(data));
  try {
    //DONT USE EVENT LISTENER ON BUTTONS. we shouldn’t use addEventListener too often since it keeps adding new event listeners to a DOM object without discarding the old ones.
    changePageHeightandCanvasForSmallDevices(640, window.screen.availWidth);

    StartQuiz(dataCopy);

    window.addEventListener('resize', ()=> {
      controlResizeCall(dataCopy);
      
    });
    doneButton.onclick = () => {
      checkAnswers(dataCopy)
      console.log(data, dataCopy);

    };
    retryButton.onclick = () => getQuizDataAndStartGame("./quiz.json");
    quizControlGoFurtherElement.onclick = () => StartQuiz(dataCopy);

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
