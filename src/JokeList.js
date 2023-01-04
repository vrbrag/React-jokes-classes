import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  // initialize 
  // jokes state, generateNewJokes, vote, 
  constructor(props) {
    super(props)
    this.state = {
      jokes: []
    }
    this.generateNewJokes = this.generateNewJokes.bind(this)
    this.vote = this.vote.bind(this)

  }

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes()
  }

  coomponentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes()
  }

  async getJokes() {
    try {
      let j = [...this.state.jokes];
      let seenJokes = new Set();
      /* object of unique values, of any type (no repeated items); uses add() to add elements that dont already exist in the obj*/
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data; // deconstrutction of res.data ; jokeObj is the object of a joke {id, joke}

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });

    } catch (e) {
      console.log(e);
    }
  }

  generateNewJokes() {
    this.setState({ jokes: [] });
  }

  vote(id, delta) {
    let jokes = this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    this.setState({ jokes })
  }

  render() {
    if (this.state.jokes.length === 0) this.getJokes()
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes)

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map(j => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={this.vote} />
          ))}
        </div>
      )
    }
    return null
  }
}


// function JokeList({ numJokesToGet = 10 }) {
//   const [jokes, setJokes] = useState([]);
//   // jokes = { id, joketext, vote}

//   /* get jokes if there are no jokes */

//   useEffect(function () {
//     async function getJokes() {
//       let j = [...jokes];
//       let seenJokes = new Set();
//       /* object of unique values, of any type (no repeated items); uses add() to add elements that dont already exist in the obj*/
//       try {
//         while (j.length < numJokesToGet) {
//           let res = await axios.get("https://icanhazdadjoke.com", {
//             headers: { Accept: "application/json" }
//           });

//           let { status, ...jokeObj } = res.data; // deconstrutction of res.data ; jokeObj is the object of a joke {id, joke}

//           if (!seenJokes.has(jokeObj.id)) {
//             seenJokes.add(jokeObj.id);
//             j.push({ ...jokeObj, votes: 0 });
//           } else {
//             console.error("duplicate found!");
//           }
//         }
//         setJokes(j);
//       } catch (e) {
//         console.log(e);
//       }
//     }

//     if (jokes.length === 0) getJokes();
//   }, [jokes, numJokesToGet]);

//   /* empty joke list and then call getJokes */

//   function generateNewJokes() {
//     setJokes([]);
//   }

//   /* change vote for this id by delta (+1 or -1) */
//   /* +1 or -1 from votes:0 from inside getJokes()*/

//   function vote(id, delta) {
//     setJokes(allJokes =>
//       allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
//     );
//   }

//   /* render: either loading spinner or list of sorted jokes. */

//   if (jokes.length) {
//     /* sort in DESCENDING order */
//     let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

//     return (
//       <div className="JokeList">
//         <button className="JokeList-getmore" onClick={generateNewJokes}>
//           Get New Jokes
//         </button>

//         {sortedJokes.map(j => (
//           <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
//         ))}
//       </div>
//     );
//   }

//   return null;

// }

export default JokeList;
