import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import { useEffect, useReducer } from "react";
import StarScreen from "./StarScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import BDQuestions from "./../data/questions.json";
/*in useReduce this are all our useState that has our app
questions the arrays of list of questions and responses, etc, status to handle the page to render
index the current questions in course, answer have the selected anwer in time of each questions*/
const tempQuestions = BDQuestions.questions;
const SECONDS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  /*dont forget state is questions: [], status: "loading", index: 0, answer: null, points: 0, 
  action is: type: ''start*, payload: data */
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    case "newAnswer":
      /*because we have the index of the question that was answered, we extract that question*/
      const question = state.questions.at(state.index);
      //action.payload is the index of the option answered, correctOption is an index as well
      return {
        ...state,
        //we update the index of the user answer selected
        answer: action.payload,
        points:
          //to sumarize it depends if payload(user Selected Answer index) is the correct index answer
          action.payload === question.correctOption
            ? state.points + question.points //if true take the current points(from state) and add the points
            : state.points, //otherwise save the same current points
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        //insteasd of setting point=0, highscore=0, answer=null etc we save time by just refer initialState
        ...initialState,
        //to dont refetch the questions we'll recover the current already fetched questions
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        //here we control our timer reducing 1 each 1000 milisec(1sec)
        secondsRemaining: state.secondsRemaining - 1,
        //and till we reach 0 seconds left we update the status to finish, otherwise we keep the current
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknow");
  }
}

export default function App() {
  /* this is a 2 steps to deconstructing state from useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  const [questions, status] = state;
  can be in 1 ste with nested deconstructing bye including 2 fields of state
  */
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;

  /*reduce is a method that return a single value from processing data, here sum is the result acumulator
   current is each question and 0 is the starting acumulator reduce( f(), 0) */
  const maxPoints = questions.reduce(
    (sum, question) => sum + question.points,
    0,
  );
  /*this is the useEffect when retrieves the data from external server, in this case a simple server */
  // useEffect(function () {
  //   fetch("http://localhost:8000/questions")
  //     .then((res) => res.json())
  //     .then((data) => dispatch({ type: "dataReceived", payload: data }))
  //     .catch((err) => dispatch({ type: "dataFailed" }));
  // }, []);
  useEffect(function () {
    if (tempQuestions.length >= 1)
      dispatch({ type: "dataReceived", payload: tempQuestions });
    else dispatch({ type: "dataFailed" });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StarScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            ></Progress>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                maxQuestion={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
