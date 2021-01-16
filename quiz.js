import { drawMap, clearMap, drawTotalRightAnswers } from "./map.js";

// const changeCanvasHeight = () => {
//   const max_width_for_mobiles = 600;
//   const deviceWidth = window.screen.availWidth;
//   const mapElementHeight = document.querySelector(".Map").offsetHeight;
//   if (deviceWidth < max_width_for_mobiles) {
//     canvas.height =
//     mapElementHeight -
//       (mapElementHeight / 100) * 6;
//     const rootElelemt = document.querySelector(":root");
//     rootElelemt.style.setProperty("--page-height", `${window.innerHeight / 100}px`);
//   }
// };
// changeCanvasHeight();

const quizControlDoneAndRetryDivElement = document.querySelector(".Quiz-control-done");
const doneButton = document.createElement("button");
doneButton.setAttribute("class", "button");
doneButton.textContent = "Done";
const retryButton = document.createElement("button");
retryButton.setAttribute("class", "button");
retryButton.textContent = "Retry";
const QuizControlTotalElement = document.querySelector(".Quiz-control-total > h2");
const quizControlGoFurtherElement = document.querySelector(".Quiz-control-go > button");

const randomCountrySelect = (data) => {
  const notSelectedCountriesYet = data.countries.filter((country) => {
    return country.selected === false;
  });
  const random_index = Math.floor(Math.random() * notSelectedCountriesYet.length);

  if (notSelectedCountriesYet.length === 0) {
    return undefined;
  } else {
    notSelectedCountriesYet[random_index].selected = true;
    return notSelectedCountriesYet[random_index];
  }
};
// Done button function
const doneOrRetryQuiz = (data) => {
  const selectedCountry = data.countries.filter((country) => {
    return country.selected === true && !country.passed;
  })[0];
  const mark = document.querySelectorAll(".Quiz-tests_test-mark > p");
  const testElement = document.querySelectorAll('.Quiz-tests_test');
  selectedCountry.tests.forEach((test, testindex) => {
    data.testsQuantity += 1;
    const inputs = document.getElementsByName(`${test.name}`);
    test.answers.every((answer, answer_index) => {
      if (inputs[answer_index].checked && answer.isitright) {
        test.mark = true;
        selectedCountry.total += 1;
        data.allCountriesTotal += 1;
        mark[testindex].innerHTML = "True";
        testElement[testindex].style.backgroundColor = "#05f240";
        console.log("true");
        return false;
      } else {
        mark[testindex].innerHTML = "False";
        testElement[testindex].style.backgroundColor = "#f70330";

        console.log("false");
        return true;
      }
    });
  });
  selectedCountry.passed = true;
  quizControlGoFurtherElement.disabled = false;
  QuizControlTotalElement.innerHTML = `Total: ${selectedCountry.total}`;
  doneButton.disabled = true;
};
/////////START or Continue Quiz with Copied Data
// Here is a function that fetchs data from given url, makes html quiz code and inserts this data to it.
function StartQuiz(quizDataCopy) {
  quizControlDoneAndRetryDivElement.innerHTML = "";
  quizControlDoneAndRetryDivElement.appendChild(doneButton);
  doneButton.disabled = false;
  quizControlGoFurtherElement.disabled = true;
  const selectedCountry = randomCountrySelect(quizDataCopy);
  const form = document.querySelector("#quiz-form");

  if (selectedCountry != undefined) {
    drawMap(selectedCountry);
    QuizControlTotalElement.innerHTML = `Total: ${selectedCountry.total}`;

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
    //If TEST FINISHED
  } else {
    form.innerHTML = `<div><h2>Test finished</h2></div>`;
    clearMap();

    drawTotalRightAnswers(
      quizDataCopy.testsQuantity,
      quizDataCopy.allCountriesTotal
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
    doneButton.onclick = () => doneOrRetryQuiz(dataCopy);
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
getQuizDataAndStartGame("./quiz.json");
