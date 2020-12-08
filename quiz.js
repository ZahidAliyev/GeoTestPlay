const form = document.querySelector("#quiz-form");
// const options = document.createElement('div');
// options.setAttribute('class', 'Quiz-tests_test-answers');
// const option = document.createElement("div");
// option.setAttribute("class", "Quiz-tests_test-answer");
// option.innerHTML = `

//   <input type="radio" name="country" id="${answer.answer_tex}" checked />
//   <label for="${answer.answer_tex}">${answer.answer_tex}</label>

// `;

// const fieldset = document.querySelector(".Quiz-tests_test-question");

// fieldset.appendChild(option);

// form.innerHTML += `<div class="Quiz-tests_test">
// <fieldset class="Quiz-tests_test-question">
//   <legend class="Quiz-tests_test-question-text">
//     <h3>${test.question_text}</h3>
//   </legend>

// </fieldset>
// <div class="Quiz-tests_test-mark">
//   <p>True</p>
// </div>
// </div>
// `;

async function getQuiz(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    data.countries[0].tests.forEach((test, testIndex) => {
      console.log(test.question_text);
      form.innerHTML += `<div class="Quiz-tests_test">
          <fieldset class="Quiz-tests_test-question">
            <legend class="Quiz-tests_test-question-text">
              <h3>${test.question_text}</h3>
            </legend>

          </fieldset>
          <div class="Quiz-tests_test-mark">
            <p>True</p>
          </div>
          </div>
          `;
      test.answers.forEach((answer) => console.log(answer.answer_text));
      const fieldset = document.querySelectorAll(".Quiz-tests_test-question");

      const options = document.createElement('div');
      options.setAttribute('class', 'Quiz-tests_test-answers')

      // console.log(fieldset);
      test.answers.forEach((answer) => {
        options.innerHTML += `
        <div class="Quiz-tests_test-answer">

          <input type="radio" name="country" id="${answer.answer_text}" ${answer.checked} />
          <label for="${answer.answer_text}">${answer.answer_text}</label>
        </div>
        `
        ;
      });
      fieldset[testIndex].appendChild(options);

    });
  } catch (err) {
    console.log(err);
  }
}

getQuiz("./quiz.json");
