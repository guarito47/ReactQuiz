function Options({ question, dispatch, answer }) {
  const hasAnswer = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          /*first we condicional render to the right the selected option(answer) with the index option)
          //if already did their answer, will check if its the correct option then will paint orange wrong
          //and correct green, if doesnt have an answer yet we will keep grey by no adding any style  ""*/
          className={`btn btn-option ${index === answer ? "answer" : ""}           
          ${hasAnswer ? (index === question.correctOption ? "correct" : "wrong") : ""}`}
          key={option}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          disabled={hasAnswer}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
