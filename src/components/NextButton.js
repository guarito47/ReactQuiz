function NextButton({ dispatch, answer, index, maxQuestion }) {
  if (answer === null) return null; //because its a component need we need to specify null
  if (index < maxQuestion - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  if (index === maxQuestion - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        see Results
      </button>
    );
}

export default NextButton;
