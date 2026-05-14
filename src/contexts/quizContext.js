import { createContext, useEffect, useContext, useReducer } from "react";
import BDQuestions from "./../data/questions.json";

const QuizContext = createContext();

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
      /*because we have the index of the question that was answered, we extract that question
      to use their correct option index from the question itself*/
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

function QuizProvider({ children }) {
  //state is destructured as
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    if (tempQuestions.length >= 1) {
      console.log("data received" + tempQuestions);
      dispatch({ type: "dataReceived", payload: tempQuestions });
    } else {
      console.log("data failed");
      dispatch({ type: "dataFailed" });
    }
  }, []);

  //   async function getCity(id) {
  //     /**in case the user already click in the same city that is already loaded, and to dont call
  //      * the api again, note that we parse to numbner the Id this is becxause is reading from the
  //      * Url and this id is a string, while currentCity is a number since their conception
  //      */
  //     if (Number(id) === currentCity) return;
  //     dispatch({ type: "loading" });
  //     try {
  //       const res = await fetch(`${BASE_URL}/cities/${id}`);
  //       const data = await res.json();
  //       dispatch({ type: "city/loaded", payload: data });
  //     } catch (error) {
  //       dispatch({
  //         type: "rejected",
  //         payload: "there was an error while loading the city...",
  //       });
  //     }
  //   }

  //   async function createCity(newCity) {
  //     dispatch({ type: "loading" });
  //     try {
  //       const res = await fetch(`${BASE_URL}/cities/`, {
  //         method: "POST",
  //         //we parse a sstring
  //         body: JSON.stringify(newCity),
  //         headers: { "Content-type": "application/json" },
  //       });
  //       const data = await res.json();
  //       /*at this point we only add the new city in the server and we got the same newcity back as successful response
  //       but in our app is not sync with our current cities array, we will ad manually to teh current city hook
  //       notice that we are not refetching from the server as the initial useEffect hook, to do it correctly we need
  //       to use  just react query, but for now we will keep simple like this way setCities */
  //       /* VERY IMPORTANT: difference between use setCities(cities) => ... vs setCities() => ...
  //        (cities) => ...: "Dame lo que tengas guardado ahorita mismo en el banco y súmale esto". (Seguro).
  //        () => ...: "Toma lo que yo recuerdo que había en el banco hace un momento y súmale esto". (Arriesgado).
  //         Esta forma utiliza el estado que está "atrapado" en el clausura (closure) de la función actual.
  //         Cómo funciona: Aquí no estás usando el argumento que React te da. En su lugar, estás ignorándolo (por eso el () vacío)
  //         y usando la variable cities que viene del cuerpo de tu componente CitiesProvider.
  //         It works if you test but when happend this function many times quickly it will happend the problem*/
  //       //setCities((citiesState) => [...citiesState, data]);
  //       dispatch({ type: "city/created", payload: data });
  //     } catch (error) {
  //       dispatch({
  //         type: "rejected",
  //         payload: "there was an erro while creating the city...",
  //       });
  //     }
  //   }

  //   async function deleteCity(id) {
  //     dispatch({ type: "loading" });
  //     try {
  //       await fetch(`${BASE_URL}/cities/${id}`, {
  //         method: "DELETE",
  //       });
  //       /**to remove a city we just exclude from the list of cities by filtering just the ones that their id
  //        * is equal to the id that we want to remove, this filter function returns a new array result
  //        */
  //       //setCities((citiesState) => citiesState.filter((city) => city.id !== id));
  //       dispatch({ type: "city/deleted", payload: id });
  //     } catch (error) {
  //       dispatch({
  //         type: "rejected",
  //         payload: "there was an erro while deleting city...",
  //       });
  //     }
  //   }

  return (
    //here our citieContext object is loading the react states that we want to carry
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  /**we casn just export citiesContext but we customized as react hook to
   * and also make some validations when its used outside of the scope of where is placed useCities  */
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("Quiz Context was used outside of QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
