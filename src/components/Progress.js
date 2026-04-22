function Progress({ index, numQuestions, points, maxPoints, answer }) {
  return (
    <header className="progress">
      {/* IMPORTANT TRICK: to move 1 step forward when click an answer to see their step done before click next 
      we will pivot from answer(if has an index means that already did their choose, if not no step to show)*/}
      <progress
        max={numQuestions}
        value={index + Number(answer !== null)}
      ></progress>
      <p>
        Question{" "}
        <strong>
          {index + 1}/{numQuestions}
        </strong>
      </p>
      <p>
        <strong>{points}</strong>/{maxPoints}
      </p>
    </header>
  );
}

export default Progress;
