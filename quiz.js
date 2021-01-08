import { drawMap, clearMap, drawTotalRightAnswers } from "./map.js";

const changeHeight = () => {
  if(window.screen.availWidth < 400) {
    const html = document.querySelector('html');
    console.log("total", window.screen.height);

    console.log("available ", window.screen.availHeight)
    // console.log("outer ", window.outerWidth);
    console.log("outer ", window.outerHeight);
    // console.log("inner ", window.innerWidth);
    console.log("inner ", window.innerHeight);
    // console.log("client ", html.clientWidth);
    console.log("client ", html.clientHeight);
    const root = document.querySelector(":root");
    
    const browserWidth = window.outerWidth;
    const browserHeight = window.outerHeight;
    root.style.setProperty('--page-height', `${window.innerHeight/100}px`);
    // root.style.setProperty('--page-width', `${window.screen.availWidth}px`);
    const rootStyles = getComputedStyle(root);
    console.log(rootStyles.getPropertyValue('--page-height'));
    console.log(html.offsetHeight);
    const debounce = (cb, wait) =>{
      let timeOut;
      return ()=> {
        if(timeOut) {
          clearTimeout(timeOut);
        }
        console.log("as")
        timeOut = setTimeout(cb, wait);
      }
    }
    const mobileHeightFix = ()=> root.style.setProperty('--page-height', `${window.innerHeight/100}px`);

    window.addEventListener('resize', debounce(mobileHeightFix, 500));
    
  }
}
changeHeight();

// const doneButtn = document.querySelector(".Quiz-control-done > button");
const quizControlDoneAndRetryDiv = document.querySelector(".Quiz-control-done");
const doneButton = document.createElement("button");
doneButton.setAttribute("class", "button");
doneButton.textContent = "Done";
const retryButton = document.createElement("button");
retryButton.setAttribute("class", "button");
retryButton.textContent = "Retry";
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
  console.log("DONE");

  const selectedCountry = data.countries.filter((country) => {
    return country.selected === true && !country.passed;
  })[0];
  const mark = document.querySelectorAll(".Quiz-tests_test-mark > p");

  selectedCountry.tests.forEach((test, testindex) => {
    data.testsQuantity += 1;
    const inputs = document.getElementsByName(`${test.name}`);
    test.answers.forEach((answer, index) => {
      if (inputs[index].checked && answer.isitright) {
        test.mark = true;
        selectedCountry.total += 1;
        data.allCountriesTotal += 1;
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
  doneButton.disabled = true;
};
/////////START or Continue Quiz with Copied Data
// Here is a function that fetchs data from given url, makes html quiz code and inserts this data to it.
function StartQuiz(quizDataCopy) {
  quizControlDoneAndRetryDiv.innerHTML = "";
  quizControlDoneAndRetryDiv.appendChild(doneButton);
  doneButton.disabled = false;
  go.disabled = true;
  console.log("StartQuiz");
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
    //If TEST FINISHED
  } else {
    form.innerHTML = `<div><h2>Test finished</h2></div>`;
    clearMap();

    drawTotalRightAnswers(
      quizDataCopy.testsQuantity,
      quizDataCopy.allCountriesTotal
    );
    go.disabled = true;
    quizControlDoneAndRetryDiv.innerHTML = "";

    quizControlDoneAndRetryDiv.appendChild(retryButton);
  }
}

async function getQuizDataandStartGame(url) {
  console.log("getQuizandStart");
  //Fething data asynchroniously with asynch await
  const res = await fetch(url);
  //Converting it to json format
  const data = await res.json();

  const dataCopy = Object.assign({}, data);
  
  try {
    //DONT USE EVENT LISTENER ON BUTTONS. we shouldn’t use addEventListener too often since it keeps adding new event listeners to a DOM object without discarding the old ones.
    console.log("try");
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
    //   // getQuizDataandStartGame("./quiz.json");

      
    // });
    doneButton.onclick = () => done(dataCopy);
    retryButton.onclick = () => getQuizDataandStartGame("./quiz.json");
    go.onclick = () => StartQuiz(dataCopy);
    // go.addEventListener("click", (e) => {
    //   e.stopPropagation();

    //   StartQuiz(dataCopy);
    //   console.log("go click");
    // });
  } catch (err) {
    console.log("err", err);
  }
}
getQuizDataandStartGame("./quiz.json");
