// Here is a function that fetchs data from given url, makes html quiz code and inserts this data to it.
async function getQuizAndInsertInHtml(url) {
  try {
    //Fething data asynchroniously with asynch await
    const res = await fetch(url);
    //Converting it to json format
    const data = await res.json();
    // Looping trough array of tests for given country to make html and put data into html 
    data.countries[0].tests.forEach((test, testIndex) => {
      // getting dom form element to put data in it
      const form = document.querySelector("#quiz-form");
      // adding test container for each test in country tests and text data as a question
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
      // only after adding html test div with dieldset to form, selecting all fieldset elements
      const fieldset = document.querySelectorAll(".Quiz-tests_test-question");
      // creating div for adding all radio inputs in it
      const options = document.createElement('div');
      options.setAttribute('class', 'Quiz-tests_test-answers')
      // looping through each answer in answers data from test to add radio inputs HTML to options and insert answer text in each
      test.answers.forEach((answer) => {
        options.innerHTML += `
        <div class="Quiz-tests_test-answer">

          <input type="radio" name="${test.name}" id="${answer.answer_text}" ${answer.checked} value="${answer.value}"/>
          <label for="${answer.answer_text}">${answer.answer_text}</label>
        </div>
        `
        ;
      });
      // after adding all inputs to options container, we append options container to fieldset of each iterated test
      fieldset[testIndex].appendChild(options);

    });
    // Catching some errors
  } catch (err) {
    console.log(err);
  }
}

getQuizAndInsertInHtml("./quiz.json");
